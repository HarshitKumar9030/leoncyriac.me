import { NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import connectDb from '@/lib/connect'
import Comment from '@/models/Comment'

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = params

  if (!id) {
    return NextResponse.json({ error: 'Comment ID is required' }, { status: 400 })
  }

  await connectDb()

  try {
    const { content } = await request.json()

    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 })
    }

    const reply = {
      author: {
        name: session.user?.name || 'Anonymous',
        email: session.user?.email || 'anonymous@example.com'
      },
      content,
      createdAt: new Date(),
      likes: 0,
      reported: false
    }

    const comment = await Comment.findByIdAndUpdate(
      id,
      { $push: { replies: reply } },
      { new: true }
    )

    if (!comment) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 })
    }

    return NextResponse.json(comment)
  } catch (error) {
    console.error('Error in POST /api/comments/[id]/reply:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}