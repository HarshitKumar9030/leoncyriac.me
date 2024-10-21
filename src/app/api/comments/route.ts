import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDb from '@/lib/connect';
import Comment from '@/models/Comment';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const postSlug = searchParams.get('postSlug');

  if (!postSlug) {
    return NextResponse.json({ error: 'Post slug is required' }, { status: 400 });
  }

  await connectDb();
  const comments = await Comment.find({ postSlug }).sort({ createdAt: -1 });
  return NextResponse.json(comments);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { postSlug, content } = await request.json();

  if (!postSlug || !content) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  await connectDb();
  const newComment = new Comment({
    postSlug,
    author: {
      name: session.user?.name || 'Anonymous',
      email: session.user?.email || '',
    },
    content,
  });

  await newComment.save();
  return NextResponse.json(newComment);
}
