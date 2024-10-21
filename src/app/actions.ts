'use server';

import connectDb from '@/lib/connect';
import Comment from '@/models/Comment';

export async function GetCommentFromReplyId(replyId: string) {
  await connectDb();

  try {
    const comment = await Comment.findOne({
      'replies._id': replyId, 
    });

    if (!comment) {
      return { error: 'Comment or reply not found', status: 404 };
    }

    const reply = comment.replies.id(replyId);
    if (!reply) {
      return { error: 'Reply not found', status: 404 };
    }

    return {
      comment,
      reply, 
    };
  } catch (error) {
    console.error('Error fetching comment by replyId:', error);
    return { error: 'Internal server error', status: 500 };
  }
}
