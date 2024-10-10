'use client'

import React, { useState, useMemo, memo } from 'react'
import { useComments } from '@/hooks/useComments'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { ThumbsUp, MessageCircle, Flag, Loader2, Edit, Trash } from 'lucide-react'
import { useToast } from "@/components/ui/use-toast"
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
} from "@/components/ui/alert-dialog"
import CommentItem from './CommentItem'

interface CommentSectionProps {
  postSlug: string
}

interface Author {
  name: string
  email: string
}

interface Comment {
  _id: string
  author: Author
  content: string
  createdAt: string
  likes: number
  replies: Comment[]
  reported: boolean
}

const CommentSection: React.FC<CommentSectionProps> = ({ postSlug }) => {
  const { comments, isLoading, addComment, likeComment, replyToComment, reportComment } = useComments(postSlug)
  const [newComment, setNewComment] = useState('')
  const [authorName, setAuthorName] = useState('')
  const [authorEmail, setAuthorEmail] = useState('')
  const { toast } = useToast()

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newComment.trim() && authorName.trim() && authorEmail.trim()) {
      try {
        await addComment({ name: authorName, email: authorEmail }, newComment)
        setNewComment('')
        setAuthorName('')
        setAuthorEmail('')
        toast({
          title: "Comment Posted",
          description: "Your comment has been successfully added.",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to post comment. Please try again.",
          variant: "destructive",
        })
      }
    } else {
      toast({
        title: "Incomplete Information",
        description: "Please fill in all fields before submitting.",
        variant: "destructive",
      })
    }
  }

  const renderComment = (comment: Comment, depth: number = 0) => (
    <CommentItem
      key={comment._id}
      comment={comment}
      depth={depth}
      likeComment={likeComment}
      replyToComment={replyToComment}
      reportComment={reportComment}
    />
  )

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <Loader2 className="w-8 h-8 animate-spin text-gray-600 dark:text-gray-400" aria-label="Loading comments" />
      </div>
    )
  }

  return (
    <section className="mt-12 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Comments</h3>
      <form onSubmit={handleSubmitComment} className="mb-8 space-y-4">
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
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          required
          className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
          aria-label="Your comment"
        />
        <Button
          type="submit"
          className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          aria-label="Post Comment"
        >
          Post Comment
        </Button>
      </form>
      <div className="space-y-6">
        {comments.length === 0 ? (
          <p className="text-gray-700 dark:text-gray-300">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map(comment => renderComment(comment))
        )}
      </div>
    </section>
  )
}


export default CommentSection;