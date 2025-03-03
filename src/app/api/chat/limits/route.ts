import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import connectDb from '@/lib/connect';
import UserChatLimit from '@/models/UserChatLimit';

const MAX_DAILY_CHATS = 15;

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
  }
  
  try {
    await connectDb();
    
    // Get current user's chat limit
    let userLimit = await UserChatLimit.findOne({ userEmail: session.user.email });
    
    // If no record exists, create one with full daily limit
    if (!userLimit) {
      userLimit = new UserChatLimit({
        userEmail: session.user.email,
        dailyChatsUsed: 0,
        lastResetDate: new Date(),
        bonusChats: 0
      });
      await userLimit.save();
      
      return NextResponse.json({ 
        remainingChats: MAX_DAILY_CHATS,
        maxDailyChats: MAX_DAILY_CHATS,
        bonusChats: 0
      });
    }
    
    // Check if we need to reset daily limit (it's a new day)
    if (userLimit.checkAndResetDaily()) {
      await userLimit.save();
    }
    
    // Calculate remaining chats
    const remainingDailyChats = Math.max(0, MAX_DAILY_CHATS - userLimit.dailyChatsUsed);
    const totalRemaining = remainingDailyChats + userLimit.bonusChats;
    
    return NextResponse.json({
      remainingChats: totalRemaining,
      maxDailyChats: MAX_DAILY_CHATS,
      bonusChats: userLimit.bonusChats
    });
    
  } catch (error) {
    console.error('Error checking chat limits:', error);
    return NextResponse.json({ message: 'Server error checking limits' }, { status: 500 });
  }
}

// Use this endpoint when a user sends a message to decrement their chat count
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
  }
  
  try {
    await connectDb();
    const userEmail = session.user.email;
    
    // Get or create user limit record
    let userLimit = await UserChatLimit.findOne({ userEmail });
    
    if (!userLimit) {
      userLimit = new UserChatLimit({
        userEmail,
        dailyChatsUsed: 1,
        lastResetDate: new Date(),
        bonusChats: 0
      });
      await userLimit.save();
      
      return NextResponse.json({ 
        remainingChats: MAX_DAILY_CHATS - 1,
        success: true 
      });
    }
    
    // Check if we need to reset daily limit (it's a new day)
    userLimit.checkAndResetDaily();
    
    // Calculate if user has available chats
    const remainingDailyChats = Math.max(0, MAX_DAILY_CHATS - userLimit.dailyChatsUsed);
    
    if (remainingDailyChats === 0 && userLimit.bonusChats === 0) {
      return NextResponse.json({ 
        message: 'Daily chat limit reached',
        remainingChats: 0
      }, { status: 429 });
    }
    
    // Determine if we use a daily chat or bonus chat
    if (remainingDailyChats > 0) {
      userLimit.dailyChatsUsed += 1;
    } else {
      userLimit.bonusChats -= 1;
    }
    
    await userLimit.save();
    
    // Calculate new remaining count
    const newRemainingDailyChats = Math.max(0, MAX_DAILY_CHATS - userLimit.dailyChatsUsed);
    const totalRemaining = newRemainingDailyChats + userLimit.bonusChats;
    
    return NextResponse.json({ 
      remainingChats: totalRemaining,
      success: true 
    });
    
  } catch (error) {
    console.error('Error updating chat limit:', error);
    return NextResponse.json({ message: 'Server error updating limits' }, { status: 500 });
  }
}