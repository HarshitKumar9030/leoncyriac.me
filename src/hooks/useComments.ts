import { useState, useEffect } from 'react';

interface Author {
  name: string;
  email: string;
}

export interface Comment {
  _id: string;
  author: Author;
  content: string;
  createdAt: string;
  likes: number;
  replies: Reply[];
  reported: boolean;
}

interface Reply {
  _id: string;
  author: Author;
  content: string;
  createdAt: string;
  likes: number;
  reported: boolean;
}

interface UseCommentsReturn {
  comments: Comment[];
  isLoading: boolean;
  error: string | null;
  addComment: (author: Author, content: string) => Promise<Comment>;
  likeComment: (commentId: string, replyId?: string) => Promise<void>;
  replyToComment: (commentId: string, author: Author, content: string) => Promise<Comment>;
  reportComment: (commentId: string) => Promise<void>;
}

export function useComments(postSlug: string): UseCommentsReturn {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchComments();
  }, [postSlug]);

  const fetchComments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/comments?postSlug=${encodeURIComponent(postSlug)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }
      const data: Comment[] = await response.json();

      // Ensure IDs are strings
      const commentsWithStringIds = data.map((comment) => ({
        ...comment,
        _id: comment._id.toString(),
        replies: comment.replies.map((reply) => ({
          ...reply,
          _id: reply._id.toString(),
        })),
      }));

      setComments(commentsWithStringIds);
    } catch (error) {
      console.error('Error fetching comments:', error);
      setError('Failed to load comments. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const addComment = async (author: Author, content: string): Promise<Comment> => {
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postSlug, author, content }),
      });
      if (!response.ok) {
        throw new Error('Failed to add comment');
      }
      const newComment: Comment = await response.json();

      // Ensure IDs are strings
      newComment._id = newComment._id.toString();
      newComment.replies = newComment.replies.map((reply) => ({
        ...reply,
        _id: reply._id.toString(),
      }));

      setComments((prevComments) => [newComment, ...prevComments]);
      return newComment;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  };

  const likeComment = async (commentId: string, replyId?: string): Promise<void> => {
    try {
      console.log('Attempting to like comment:', commentId, 'Reply ID:', replyId);
      const body = replyId ? { replyId } : {};
      const response = await fetch(`/api/comments/${commentId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        if (response.status === 404) {
          const errorText = await response.text();
          console.error('Error response:', errorText);
          throw new Error(replyId ? 'Reply not found' : 'Comment not found');
        }
        throw new Error('Failed to like comment');
      }

      const updatedComment: Comment = await response.json();

      // Ensure IDs are strings
      updatedComment._id = updatedComment._id.toString();
      updatedComment.replies = updatedComment.replies.map((reply) => ({
        ...reply,
        _id: reply._id.toString(),
      }));

      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment._id === updatedComment._id ? updatedComment : comment
        )
      );
    } catch (error) {
      console.error('Error liking comment:', error);
      throw error;
    }
  };

  const replyToComment = async (
    commentId: string,
    author: Author,
    content: string
  ): Promise<Comment> => {
    try {
      const response = await fetch(`/api/comments/${commentId}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ author, content }),
      });
      if (!response.ok) {
        throw new Error('Failed to reply to comment');
      }
      const updatedComment: Comment = await response.json();

      // Ensure IDs are strings
      updatedComment._id = updatedComment._id.toString();
      updatedComment.replies = updatedComment.replies.map((reply) => ({
        ...reply,
        _id: reply._id.toString(),
      }));

      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment._id === updatedComment._id ? updatedComment : comment
        )
      );
      return updatedComment;
    } catch (error) {
      console.error('Error replying to comment:', error);
      throw error;
    }
  };

  const reportComment = async (commentId: string): Promise<void> => {
    try {
      const response = await fetch(`/api/comments/${commentId}/report`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Failed to report comment');
      }
      const updatedComment: Comment = await response.json();

      // Ensure IDs are strings
      updatedComment._id = updatedComment._id.toString();

      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment._id === commentId ? { ...comment, reported: true } : comment
        )
      );
    } catch (error) {
      console.error('Error reporting comment:', error);
      throw error;
    }
  };

  return { comments, isLoading, error, addComment, likeComment, replyToComment, reportComment };
}
