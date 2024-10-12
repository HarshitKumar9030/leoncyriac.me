import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import connectDb from '@/lib/connect';
import Comment, { IComment } from '@/models/Comment';
import mongoose from 'mongoose';

interface LikeRequestBody {
  replyId?: string;
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = params;
  console.log('Received Comment ID:', id);

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { error: 'Invalid Comment ID' },
      { status: 400 }
    );
  }

  await connectDb();

  try {
    const contentType = request.headers.get('content-type');
    let body: LikeRequestBody = {};

    if (contentType && contentType.includes('application/json')) {
      body = await request.json();
    }

    const { replyId } = body;
    console.log('Received Reply ID:', replyId);

    if (replyId && !mongoose.Types.ObjectId.isValid(replyId)) {
      return NextResponse.json(
        { error: 'Invalid Reply ID' },
        { status: 400 }
      );
    }

    let updatedComment: IComment | null = null;

    if (replyId) {
      const comment = await Comment.findById(id);
      if (!comment) {
        return NextResponse.json(
          { error: `Main comment not found with ID: ${id}` },
          { status: 404 }
        );
      }

      const reply = comment.replies.id(replyId);
      if (!reply) {
        return NextResponse.json(
          { error: `Reply not found with ID: ${replyId}` },
          { status: 404 }
        );
      }

      reply.likes += 1;
      await comment.save();
      updatedComment = await Comment.findById(id).lean();
    } else {
      updatedComment = await Comment.findByIdAndUpdate(
        id,
        { $inc: { likes: 1 } },
        { new: true, lean: true }
      );

      if (!updatedComment) {
        return NextResponse.json(
          { error: `Main comment not found with ID: ${id}` },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(updatedComment, { status: 200 });
  } catch (error) {
    console.error('Error in POST /api/comments/[id]/like:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}