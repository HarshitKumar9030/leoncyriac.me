
import { NextRequest, NextResponse } from 'next/server';
import connectDb from '@/lib/connect';
import Comment from '@/models/Comment';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');

  if (!slug) {
    return NextResponse.json({ error: 'Missing slug parameter' }, { status: 400 });
  }

  try {
    await connectDb();

    const count = await Comment.countDocuments({ postSlug: slug });

    return NextResponse.json({ count });
  } catch (error) {
    console.error('Error fetching comments count:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}