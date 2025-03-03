import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import connectDb from '@/lib/connect';
import Chat from '@/models/Chat';

export async function GET(request: NextRequest) {
  // Check authentication
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const postSlug = searchParams.get('postSlug');

  if (!postSlug) {
    return NextResponse.json({ error: 'Post slug is required' }, { status: 400 });
  }

  try {
    await connectDb();
    
    // Find chat history for this user and post
    const chat = await Chat.findOne({ 
      user: session.user?.email,
      postSlug 
    });

    if (!chat) {
      return NextResponse.json({ messages: [] });
    }

    // Return the messages with proper IDs for the frontend
    const messages = chat.messages.map((msg: any) => ({
      id: msg._id.toString(),
      content: msg.content,
      role: msg.role,
      timestamp: msg.timestamp
    }));

    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Chat history error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chat history' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  // Check authentication
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Get query parameters
  const { searchParams } = new URL(request.url);
  const blogTitle = searchParams.get('blogTitle');
  const postSlug = searchParams.get('postSlug');

  if (!blogTitle || !postSlug) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  try {
    await connectDb();
    
    await Chat.findOneAndDelete({
      user: session.user?.email,
      blogTitle,
      postSlug,
    });

    return NextResponse.json({ 
      success: true,
      messages: [{
        id: 'welcome',
        content: `Hi there! I'm your AI assistant for "${blogTitle}". What would you like to discuss about this article?`,
        role: 'assistant',
        timestamp: new Date()
      }]
    });
  } catch (error) {
    console.error('Error clearing chat history:', error);
    return NextResponse.json({ error: 'Failed to clear chat history' }, { status: 500 });
  }
}