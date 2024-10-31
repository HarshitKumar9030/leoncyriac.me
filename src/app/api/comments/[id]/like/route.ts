import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth'
import connectDb from '@/lib/connect';
import Comment, { IComment, IReply } from '@/models/Comment';
import mongoose from 'mongoose';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userEmail = session.user?.email;
  if (!userEmail) {
    return NextResponse.json({ error: 'User email not found' }, { status: 400 });
  }

  const { id } = params;
  console.log('Received ID:', id);

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  await connectDb();

  try {
    // First, try to find a comment with the given ID
    let updatedComment: IComment | null = await Comment.findById(id);

    if (updatedComment) {
      // Found a comment with the given ID
      if (updatedComment.likedBy.includes(userEmail)) {
        return NextResponse.json(
          { error: 'You have already liked this comment' },
          { status: 400 }
        );
      }

      updatedComment.likes += 1;
      updatedComment.likedBy.push(userEmail);
      await updatedComment.save();

      return NextResponse.json(updatedComment, { status: 200 });
    } else {
      // Did not find a comment with the given ID; it might be a reply ID
      // Find the comment containing this reply ID
      const comment = await Comment.findOne({ 'replies._id': id });

      if (!comment) {
        // Could not find a comment containing this reply ID
        return NextResponse.json(
          { error: `Comment or reply not found with ID: ${id}` },
          { status: 404 }
        );
      }

      // Now, increment the likes on the reply
      const found = incrementReplyLikes(comment.replies, id, userEmail);

      if (!found) {
        return NextResponse.json(
          { error: `You have already liked this reply` },
          { status: 400 }
        );
      }

      await comment.save();

      return NextResponse.json(comment, { status: 200 });
    }
  } catch (error) {
    console.error('Error in POST /api/comments/[id]/like:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// Recursive function to increment likes for a reply with the given replyId
function incrementReplyLikes(
  replies: IReply[],
  replyId: string,
  userEmail: string
): boolean {
  for (const reply of replies) {
    // @ts-ignore
    if (reply._id.toString() === replyId) {
      if (reply.likedBy.includes(userEmail)) {
        return false; // User has already liked this reply
      }
      reply.likes += 1;
      reply.likedBy.push(userEmail);
      return true;
    }
    if (reply.replies && reply.replies.length > 0) {
      const found = incrementReplyLikes(reply.replies, replyId, userEmail);
      if (found) {
        return true;
      }
    }
  }
  return false;
}
