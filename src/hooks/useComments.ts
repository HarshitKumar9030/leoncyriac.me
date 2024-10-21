'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

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
  likedBy: string[]; // Include this field
  replies: Comment[];
  reported: boolean;
}

interface UseCommentsReturn {
  comments: Comment[];
  isLoading: boolean;
  error: string | null;
  addComment: (content: string) => Promise<Comment>;
  likeComment: (id: string) => Promise<void>;
  replyToComment: (commentId: string, content: string) => Promise<Comment>;
  reportComment: (commentId: string) => Promise<void>;
}

export function useComments(postSlug: string): UseCommentsReturn {
  const { data: session } = useSession();
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

      setComments(data);
    } catch (error) {
      console.error('Error fetching comments:', error);
      setError('Failed to load comments. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const addComment = async (content: string): Promise<Comment> => {
    if (!session) throw new Error('You must be signed in to add a comment');
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postSlug, content }),
      });
      if (!response.ok) {
        throw new Error('Failed to add comment');
      }
      const newComment: Comment = await response.json();

      setComments((prevComments) => [newComment, ...prevComments]);
      return newComment;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  };

  const likeComment = async (id: string): Promise<void> => {
    if (!session) throw new Error('You must be signed in to like a comment');
    try {
      const response = await fetch(`/api/comments/${id}/like`, {
        method: 'POST',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to like comment');
      }

      const updatedComment: Comment = await response.json();

      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment._id === updatedComment._id ? updatedComment : comment
        )
      );
    } catch (error: any) {
      console.error('Error liking comment:', error);
      throw error;
    }
  };

  const replyToComment = async (
    commentId: string,
    content: string
  ): Promise<Comment> => {
    if (!session) throw new Error('You must be signed in to reply to a comment');
    try {
      const response = await fetch(`/api/comments/${commentId}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });
      if (!response.ok) {
        throw new Error('Failed to reply to comment');
      }
      const updatedComment: Comment = await response.json();

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
    if (!session) throw new Error('You must be signed in to report a comment');
    try {
      const response = await fetch(`/api/comments/${commentId}/report`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Failed to report comment');
      }
      const updatedComment: Comment = await response.json();

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
