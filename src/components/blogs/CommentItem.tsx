/* eslint-disable react/display-name */
'use client';

import React, { useState, useMemo, memo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  ThumbsUp,
  MessageCircle,
  Flag,
  Loader2,
  Edit,
  Trash,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
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
} from "@/components/ui/alert-dialog";

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
  replies: Comment[];
  reported: boolean;
}

interface CommentItemProps {
  comment: Comment;
  depth: number;
  likeComment: (id: string) => Promise<void>;
  replyToComment: (
    id: string,
    author: Author,
    content: string
  ) => Promise<Comment>;
  reportComment: (id: string) => Promise<void>;
}

const CommentItem: React.FC<CommentItemProps> = memo(
  ({ comment, depth, likeComment, replyToComment, reportComment }) => {
    const [isReplying, setIsReplying] = useState(false);
    const [replyContent, setReplyContent] = useState("");
    const [authorName, setAuthorName] = useState("");
    const [authorEmail, setAuthorEmail] = useState("");
    const { toast } = useToast();

    const formattedDate = useMemo(() => {
      const date = new Date(comment.createdAt);
      return date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }, [comment.createdAt]);

    const handleLike = async () => {
      try {
        await likeComment(comment._id);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to like comment. Please try again.",
          variant: "destructive",
        });
      }
    };

    const handleReplySubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (replyContent.trim() && authorName.trim() && authorEmail.trim()) {
        try {
          await replyToComment(
            comment._id,
            { name: authorName, email: authorEmail },
            replyContent
          );
          setReplyContent("");
          setAuthorName("");
          setAuthorEmail("");
          setIsReplying(false);
          toast({
            title: "Reply Posted",
            description: "Your reply has been successfully added.",
          });
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to post reply. Please try again.",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Incomplete Information",
          description:
            "Please fill in all fields before submitting your reply.",
          variant: "destructive",
        });
      }
    };

    const handleReport = async () => {
      try {
        await reportComment(comment._id);
        toast({
          title: "Comment Reported",
          description:
            "Thank you for your feedback. We'll review this comment.",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to report comment. Please try again.",
          variant: "destructive",
        });
      }
    };

    return (
      <div className={`flex space-x-4 ${depth > 0 ? "ml-12 mt-4" : ""}`}>
        <Avatar>
          <AvatarImage
            src={`https://www.gravatar.com/avatar/${comment.author.email}?d=mp`}
            alt={comment.author.name}
          />
          <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              {comment.author.name}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {formattedDate}
            </span>
          </div>
          <p className="text-gray-700 dark:text-gray-300">{comment.content}</p>
          <div className="mt-2 flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className="flex items-center space-x-1 hover:text-gray-900 dark:hover:text-gray-100"
              aria-label={`Like comment by ${comment.author.name}`}
            >
              <ThumbsUp className="w-4 h-4" />
              <span>{comment.likes}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsReplying(!isReplying)}
              className="flex items-center space-x-1 hover:text-gray-900 dark:hover:text-gray-100"
              aria-label={`Reply to comment by ${comment.author.name}`}
            >
              <MessageCircle className="w-4 h-4" />
              <span>Reply</span>
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-1 hover:text-gray-900 dark:hover:text-gray-100"
                  aria-label={`Report comment by ${comment.author.name}`}
                >
                  <Flag className="w-4 h-4" />
                  <span>Report</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-gray-100 dark:bg-gray-800">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-gray-900 dark:text-gray-100">
                    Report this comment?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-gray-700 dark:text-gray-300">
                    This will flag the comment for review by our moderation
                    team. Are you sure you want to proceed?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleReport}
                    className="bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
                  >
                    Report
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          {isReplying && (
            <form onSubmit={handleReplySubmit} className="mt-4 space-y-4">
              <div className="flex flex-col md:flex-row md:space-x-4">
                <Input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="Your name"
                  required
                  className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                  aria-label="Your name"
                />
                <Input
                  type="email"
                  value={authorEmail}
                  onChange={(e) => setAuthorEmail(e.target.value)}
                  placeholder="Your email"
                  required
                  className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                  aria-label="Your email"
                />
              </div>
              <Textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write your reply..."
                required
                className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                aria-label="Your reply"
              />
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsReplying(false)}
                  className="bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-100 dark:hover:bg-gray-500"
                  aria-label="Cancel reply"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                  aria-label="Post reply"
                >
                  Post Reply
                </Button>
              </div>
            </form>
          )}
          {comment.replies &&
            comment.replies.map((reply) => (
              <CommentItem
                key={reply._id}
                comment={reply}
                depth={depth + 1}
                likeComment={likeComment}
                replyToComment={replyToComment}
                reportComment={reportComment}
              />
            ))}
        </div>
      </div>
    );
  }
);

export default CommentItem;
