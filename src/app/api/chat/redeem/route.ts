import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import connectDb from '@/lib/connect';
import UserChatLimit from '@/models/UserChatLimit';
import CodeRedemption from '@/models/CodeRedemption';
import { generateVerificationHash } from '@/lib/codeUtils';

// Redeem code format: BLOG-XXXX-XXXX-XXXX (where X is alphanumeric)
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
  }
  
  try {
    await connectDb();
    const { code } = await request.json();
    
    if (!code || typeof code !== 'string') {
      return NextResponse.json({ message: 'Invalid code format' }, { status: 400 });
    }
    
    // Normalize the code format
    const normalizedCode = code.toUpperCase().replace(/[^A-Z0-9-]/g, '');
    
    // Validate code format
    if (!normalizedCode.match(/^BLOG-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/)) {
      return NextResponse.json({ message: 'Invalid code format' }, { status: 400 });
    }
    
    // Check if code has already been redeemed
    const existingRedemption = await CodeRedemption.findOne({ code: normalizedCode });
    
    if (existingRedemption) {
      return NextResponse.json({ message: 'This code has already been redeemed' }, { status: 400 });
    }
    
    // Parse code parts
    const [prefix, typeSection, timeSection, verificationSection] = normalizedCode.split('-');
    
    // Verify the code integrity
    const secretKey = process.env.REDEEM_CODE_SECRET || 'default_secret_key_change_me';
    const dataToVerify = `${prefix}-${typeSection}-${timeSection}`;
    const expectedVerification = generateVerificationHash(dataToVerify, secretKey).substring(0, 4);
    
    if (verificationSection !== expectedVerification) {
      return NextResponse.json({ message: 'Invalid code' }, { status: 400 });
    }
    
    // Check expiration (encoded in timeSection)
    const currentTime = Math.floor(Date.now() / 86400000); // Days since epoch
    const codeTime = parseInt(timeSection, 36); // Base36 encoded time
    
    if (currentTime > codeTime + 30) { // Codes expire after 30 days
      return NextResponse.json({ message: 'This code has expired' }, { status: 400 });
    }
    
    // Determine bonus amount from typeSection
    const codeType = typeSection.substring(0, 2);
    let extraChats = 0;
    
    switch (codeType) {
      case 'SM': extraChats = 15; break;  // Small bonus
      case 'MD': extraChats = 50; break;  // Medium bonus
      case 'LG': extraChats = 100; break; // Large bonus
      case 'XL': extraChats = 500; break; // Extra large bonus
      default: extraChats = 10; // Default bonus
    }
    
    // Record the redemption
    await CodeRedemption.create({
      code: normalizedCode,
      userEmail: session.user.email,
      extraChats,
      redeemedAt: new Date(),
    });
    
    // Update user's chat limits
    const userLimit = await UserChatLimit.findOne({ userEmail: session.user.email });
    
    if (userLimit) {
      userLimit.bonusChats += extraChats;
      await userLimit.save();
    } else {
      await UserChatLimit.create({
        userEmail: session.user.email,
        dailyChatsUsed: 0,
        lastResetDate: new Date(),
        bonusChats: extraChats
      });
    }
    
    return NextResponse.json({ 
      success: true, 
      extraChats,
      message: `Successfully redeemed code for ${extraChats} additional chats!`
    });
  } catch (error) {
    console.error('Error redeeming code:', error);
    return NextResponse.json({ message: 'Server error processing code' }, { status: 500 });
  }
}