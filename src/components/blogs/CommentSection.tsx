'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useComments } from '@/hooks/useComments';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import CommentItem from './CommentItem';
import LoginButton from './LoginButton';
import { motion, AnimatePresence } from 'framer-motion';

interface CommentSectionProps {
  postSlug: string;
}

export default function CommentSection({ postSlug }: CommentSectionProps) {
  const { data: session } = useSession();
  const { comments, isLoading, addComment, likeComment, replyToComment, reportComment } = useComments(postSlug);
  const [newComment, setNewComment] = useState('');
  const { toast } = useToast();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim() && session?.user) {
      try {
        await addComment(newComment);
        setNewComment('');
        toast({
          title: 'Comment Posted',
          description: 'Your comment has been successfully added.',
        });
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to post comment. Please try again.',
          variant: 'destructive',
        });
      }
    } else {
      toast({
        title: 'Incomplete Information',
        description: 'Please sign in and enter a comment before submitting.',
        variant: 'destructive',
      });
    }
  };

  if (!mounted) return null;

  return (
    <section className="mt-4 sm:mt-8 md:mt-12 p-4 sm:p-6 rounded-lg shadow-none dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 max-w-4xl mx-auto">
      <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Comments</h3>
      {session ? (
        <form onSubmit={handleSubmitComment} className="mb-6 sm:mb-8 space-y-3 sm:space-y-4">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            required
            className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-md p-2 sm:p-3 text-sm sm:text-base text-neutral-900 dark:text-neutral-100"
            aria-label="Your comment"
          />
          <Button
            type="submit"
            className="w-full sm:w-auto bg-zinc-600 dark:bg-zinc-700 text-white px-4 sm:px-8 py-2 sm:py-3 rounded-md sm:rounded-xl text-sm sm:text-base"
            aria-label="Post Comment"
          >
            Post Comment
          </Button>
        </form>
      ) : (
        <div className="mb-6 sm:mb-8">
          <p className="mb-3 sm:mb-4 text-sm sm:text-base text-neutral-700 dark:text-neutral-300">
            Please sign in to leave a comment.
          </p>
          <LoginButton />
        </div>
      )}
      {isLoading ? (
        <div className="flex justify-center items-center h-24 sm:h-32">
          <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-neutral-600 dark:text-neutral-400" aria-label="Loading comments" />
        </div>
      ) : (
        <AnimatePresence>
          {comments.length === 0 ? (
            <p className="text-sm sm:text-base text-neutral-700 dark:text-neutral-300">
              No comments yet. Be the first to comment!
            </p>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              {comments.map((comment) => (
                <CommentItem
                  key={comment._id}
                  comment={comment}
                  depth={0}
                  likeComment={likeComment}
                  replyToComment={replyToComment}
                  reportComment={reportComment}
                  session={session}
                />
              ))}
            </div>
          )}
        </AnimatePresence>
      )}
    </section>
  );
}