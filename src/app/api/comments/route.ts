import { NextResponse } from 'next/server'
import connectDb from '@/lib/connect'
import Comment, { IComment } from '@/models/Comment'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const postSlug = searchParams.get('postSlug')

  if (!postSlug) {
    return NextResponse.json({ error: 'Post slug is required' }, { status: 400 })
  }

  await connectDb()
  const comments = await Comment.find({ postSlug }).sort({ createdAt: -1 })
  return NextResponse.json(comments)
}

export async function POST(request: Request) {
  const body = await request.json()

  if (!body.postSlug || !body.author || !body.content) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  await connectDb()
  const newComment = new Comment({
    postSlug: body.postSlug,
    author: {
      name: body.author.name,
      email: body.author.email,
    },
    content: body.content,
  })

  await newComment.save()
  return NextResponse.json(newComment)
}