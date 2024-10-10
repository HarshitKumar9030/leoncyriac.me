import { NextResponse } from 'next/server';
import connectDb from '@/lib/connect';
import Comment, { IComment, IReply } from '@/models/Comment';
import mongoose from 'mongoose';

// Define the shape of the request body
interface LikeRequestBody {
  replyId?: string;
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
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
      // Fetch the main comment
      const comment = await Comment.findById(id);
      if (!comment) {
        return NextResponse.json(
          { error: `Main comment not found with ID: ${id}` },
          { status: 404 }
        );
      }

      // Find the reply
      const reply = comment.replies.id(replyId);
      if (!reply) {
        return NextResponse.json(
          { error: `Reply not found with ID: ${replyId}` },
          { status: 404 }
        );
      }

      // Increment likes
      reply.likes += 1;

      // Save the updated comment
      await comment.save();

      // Fetch the updated comment as a plain object
      updatedComment = await Comment.findById(id).lean();
    } else {
      // Like the main comment
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