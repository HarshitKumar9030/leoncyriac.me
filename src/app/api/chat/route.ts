import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { GoogleGenerativeAI } from '@google/generative-ai'
import connectDb from '@/lib/connect'
import Chat from '@/models/Chat'

// Initialize Gemini AI with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function POST(request: NextRequest) {
  // Check authentication using the same approach as comments
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Check chat limits
  const limitsResponse = await fetch(new URL('/api/chat/limits', request.url), { 
    method: 'POST',
    headers: request.headers 
  });

  if (!limitsResponse.ok) {
    const errorData = await limitsResponse.json();
    return NextResponse.json(
      { error: errorData.message || 'Chat limit reached' },
      { status: limitsResponse.status }
    );
  }

  try {
    const { message, history, blogTitle, blogContent, postSlug } = await request.json()

    // Create Gemini model (using an available model - gemini-1.5-flash)
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash'
    })

    // Format chat history for Gemini
    let formattedHistory: {role: string, parts: {text: string}[]}[] = []
    if (history.length > 0) {
      formattedHistory = history.map((msg: any) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }))
    }

    // Create context for the model
    const promptPrefix = `
You are an AI assistant discussing a blog article titled "${blogTitle}".
The article content is as follows:
---
${blogContent.slice(0, 10000)} ${blogContent.length > 10000 ? '...(content truncated)' : ''}
---

Your role is to help users understand this article, answer questions related to it, and provide insights.
Be conversational, helpful, and concise.
Current user: ${session.user?.name || session.user?.email}
Post slug: ${postSlug}
`;

    // Generate content
    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [{ text: promptPrefix + (formattedHistory.length > 0 ? "\nPrevious conversation:\n" + JSON.stringify(formattedHistory) + "\n\nUser's new message: " + message : message) }]
        }
      ],
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
      },
    });

    const response = result.response.text();

    // Save chat history to the database
    await connectDb();
    const chat = await Chat.findOneAndUpdate(
      { blogTitle, postSlug, user: session.user?.email },
      {
        $push: {
          messages: [
            { content: message, role: 'user', timestamp: new Date() },
            { content: response, role: 'assistant', timestamp: new Date() },
          ],
        },
      },
      { new: true, upsert: true }
    );

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    )
  }
}