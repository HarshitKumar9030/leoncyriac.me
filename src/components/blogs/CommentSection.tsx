'use client'

import React, { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useComments } from '@/hooks/useComments'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from 'lucide-react'
import { useToast } from "@/components/ui/use-toast"
import CommentItem from './CommentItem'
import LoginButton from './LoginButton'

interface CommentSectionProps {
  postSlug: string
}

export default function CommentSection({ postSlug }: CommentSectionProps) {
  const { data: session } = useSession()
  const { comments, isLoading, addComment, likeComment, replyToComment, reportComment } = useComments(postSlug)
  const [newComment, setNewComment] = useState('')
  const { toast } = useToast()

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newComment.trim() && session?.user) {
      try {
        await addComment({ name: session.user.name || 'Anonymous', email: session.user.email || '' }, newComment)
        setNewComment('')
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
        description: "Please sign in and enter a comment before submitting.",
        variant: "destructive",
      })
    }
  }

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
      {session ? (
        <form onSubmit={handleSubmitComment} className="mb-8 space-y-4">
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
      ) : (
        <div className="mb-8">
          <p className="text-gray-700 dark:text-gray-300 mb-4">Please sign in to leave a comment.</p>
          <LoginButton />
        </div>
      )}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <p className="text-gray-700 dark:text-gray-300">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map(comment => (
            <CommentItem
              key={comment._id}
              comment={comment}
              depth={0}
              likeComment={likeComment}
              replyToComment={replyToComment}
              reportComment={reportComment}
              session={session}
            />
          ))
        )}
      </div>
    </section>
  )
}