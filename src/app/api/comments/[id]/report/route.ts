import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDb from '@/lib/connect';
import Comment, { IComment } from '@/models/Comment';
import mongoose from 'mongoose';

interface ReportRequestBody {
  replyId?: string;
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Invalid Comment ID' }, { status: 400 });
  }

  await connectDb();

  try {
    const body: ReportRequestBody = await request.json();
    const { replyId } = body;

    const comment = await Comment.findById(id);
    if (!comment) {
      return NextResponse.json({ error: `Comment not found with ID: ${id}` }, { status: 404 });
    }

    if (replyId) {
      const found = reportNestedReply(comment.replies, replyId);
      if (!found) {
        return NextResponse.json({ error: `Reply not found with ID: ${replyId}` }, { status: 404 });
      }
    } else {
      comment.reported = true;
    }

    await comment.save();
    const updatedComment = await Comment.findById(id).lean();

    return NextResponse.json(updatedComment, { status: 200 });
  } catch (error) {
    console.error('Error in POST /api/comments/[id]/report:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

function reportNestedReply(replies: any[], replyId: string): boolean {
  for (const reply of replies) {
    if (reply._id.toString() === replyId) {
      reply.reported = true;
      return true;
    }
    if (reply.replies && reply.replies.length > 0) {
      const found = reportNestedReply(reply.replies, replyId);
      if (found) {
        return true;
      }
    }
  }
  return false;
}
