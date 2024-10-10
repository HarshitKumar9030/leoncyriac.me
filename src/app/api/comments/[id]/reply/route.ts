import { NextResponse } from 'next/server'
import connectDb from '@/lib/connect'
import Comment from '@/models/Comment'

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const { id } = params

  if (!id) {
    return NextResponse.json({ error: 'Comment ID is required' }, { status: 400 })
  }

  await connectDb()

  try {
    const { author, content } = await request.json()

    if (!author || !content) {
      return NextResponse.json({ error: 'Author and content are required' }, { status: 400 })
    }

    const reply = {
      author,
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