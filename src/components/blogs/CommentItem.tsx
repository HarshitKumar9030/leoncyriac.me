'use client';

import React, { useState, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ThumbsUp, MessageCircle, Flag, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { motion, AnimatePresence } from 'framer-motion';

interface Author {
  name: string;
  email: string;
}

interface Comment {
  _id: string;
  author: Author;
  content: string;
  createdAt: string;
  likes: number;
  likedBy: string[];
  replies: Comment[];
  reported: boolean;
}

interface CommentItemProps {
  comment: Comment;
  depth: number;
  likeComment: (id: string) => Promise<void>;
  replyToComment: (commentId: string, content: string) => Promise<Comment>;
  reportComment: (commentId: string) => Promise<void>;
  session: any;
}

export default function CommentItem({
  comment,
  depth,
  likeComment,
  replyToComment,
  reportComment,
  session,
}: CommentItemProps) {
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [isExpanded, setIsExpanded] = useState(depth < 2);
  const { toast } = useToast();
  const { data: sessionData } = useSession();

  const formattedDate = useMemo(() => {
    const date = new Date(comment.createdAt);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }, [comment.createdAt]);

  const userEmail = sessionData?.user?.email;
  const userHasLiked =
    userEmail && comment.likedBy && comment.likedBy.includes(userEmail);

  const handleLike = async () => {
    if (!session) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to like comments.',
        variant: 'destructive',
      });
      return;
    }
    try {
      await likeComment(comment._id);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update like status. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to reply to comments.',
        variant: 'destructive',
      });
      return;
    }
    if (replyContent.trim()) {
      try {
        await replyToComment(comment._id, replyContent);
        setReplyContent('');
        setIsReplying(false);
        toast({
          title: 'Reply Posted',
          description: 'Your reply has been successfully added.',
        });
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to post reply. Please try again.',
          variant: 'destructive',
        });
      }
    }
  };

  const handleReport = async () => {
    if (!session) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to report comments.',
        variant: 'destructive',
      });
      return;
    }
    try {
      await reportComment(comment._id);
      toast({
        title: 'Comment Reported',
        description: "Thank you for your feedback. We'll review this comment.",
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to report comment. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className={`flex space-x-4 ${depth > 0 ? 'ml-12 mt-4' : 'mt-6'}`}>
      <Avatar className="flex-shrink-0">
        <AvatarImage
          src={`https://www.gravatar.com/avatar/${comment.author.email}?d=identicon`}
          alt={comment.author.name}
        />
        <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold text-neutral-900 dark:text-neutral-100">
            {comment.author.name}
          </span>
          <span className="text-sm text-neutral-500 dark:text-neutral-400">
            {formattedDate}
          </span>
        </div>
        <p className="text-neutral-800 dark:text-neutral-200">{comment.content}</p>
        <div className="mt-2 flex items-center space-x-4 text-sm text-neutral-600 dark:text-neutral-400">
          <Button
            onClick={handleLike}
            className={`flex items-center space-x-1 shadow-none rounded-xl ${
              userHasLiked
                ? 'bg-neutral-500 text-white hover:bg-neutral-600'
                : 'bg-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-700 dark:bg-zinc-800 hover:text-neutral-800 dark:hover:text-neutral-200'
            }`}
            aria-label={`${userHasLiked ? 'Unlike' : 'Like'} comment by ${comment.author.name}`}
          >
            <ThumbsUp className="w-4 h-4" />
            <span>{comment.likes}</span>
          </Button>
          <Button
            onClick={() => setIsReplying(!isReplying)}
            className="flex items-center space-x-1 shadow-none bg-zinc-100 rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-700 dark:bg-zinc-800 hover:text-neutral-800 dark:hover:text-neutral-200"
            aria-label={`Reply to comment by ${comment.author.name}`}
          >
            <MessageCircle className="w-4 h-4" />
            <span>Reply</span>
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                className="flex items-center space-x-1 shadow-none bg-zinc-100 rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-700 dark:bg-zinc-800 hover:text-neutral-800 dark:hover:text-neutral-200"
                aria-label={`Report comment by ${comment.author.name}`}
              >
                <Flag className="w-4 h-4" />
                <span>Report</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-white dark:bg-neutral-800 max-w-lg p-6 rounded-lg shadow-lg">
              <AlertDialogHeader>
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="text-red-600 w-6 h-6" />
                  <AlertDialogTitle className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                    Report this comment?
                  </AlertDialogTitle>
                </div>
                <AlertDialogDescription className="mt-2 text-neutral-600 dark:text-neutral-300">
                  Flagging this comment will notify our moderation team. This action cannot be
                  undone. Are you sure you want to proceed?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="flex justify-end space-x-4 mt-4">
                <AlertDialogCancel className="px-4 py-2 bg-neutral-200 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 rounded-md hover:bg-neutral-300 dark:hover:bg-neutral-600">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleReport}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
                >
                  Report
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* Reply Form */}
        <AnimatePresence>
          {isReplying && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleReplySubmit}
              className="mt-4 space-y-4"
            >
              <Textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write your reply..."
                required
                className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-md p-3 text-neutral-900 dark:text-neutral-100"
                aria-label="Your reply"
              />
              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  onClick={() => setIsReplying(false)}
                  className="flex items-center space-x-1 shadow-none px-5 bg-zinc-200 rounded-xl hover:bg-zinc-300 dark:hover:bg-zinc-700 dark:bg-zinc-800 hover:text-neutral-800 dark:hover:text-neutral-200"
                  aria-label="Cancel reply"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex items-center space-x-1 shadow-none bg-zinc-200 rounded-xl hover:bg-zinc-300 dark:hover:bg-zinc-700 dark:bg-zinc-800 hover:text-neutral-800 dark:hover:text-neutral-200"
                  aria-label="Post reply"
                >
                  Post Reply
                </Button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Collapsible Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-4">
            <Button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center space-x-1 shadow-none bg-zinc-100 rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-700 dark:bg-zinc-800 hover:text-neutral-800 dark:hover:text-neutral-200"
              aria-label={isExpanded ? 'Collapse replies' : 'Expand replies'}
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              <span>{isExpanded ? 'Hide' : 'Show'} {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}</span>
            </Button>
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {comment.replies.map((reply) => (
                    <CommentItem
                      key={reply._id}
                      comment={reply}
                      depth={depth + 1}
                      likeComment={likeComment}
                      replyToComment={replyToComment}
                      reportComment={reportComment}
                      session={session}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}