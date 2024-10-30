'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import BlogCard from './BlogCard'
import { getBlogPosts } from '@/lib/getBlogPosts'
import { useSearchParams } from 'next/navigation'

const POSTS_PER_PAGE = 5

interface BlogPost {
  id: string
  slug: string
  title: string
  description: string
  image: string
  date: string
  readingTime: string
  tags: { id: string; name: string }[]
  views: number
  likes: string[]
}

interface BlogPostsProps {
  searchQuery: string
}

export default function BlogPosts({ searchQuery }: BlogPostsProps) {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const searchParams = useSearchParams()

  const fetchPosts = async (currentPage: number, query: string) => {
    setIsLoading(true)
    try {
      const { posts: newPosts, hasMore } = await getBlogPosts(currentPage, POSTS_PER_PAGE, query)
      setPosts(currentPage === 1 ? newPosts : (prevPosts) => [...prevPosts, ...newPosts])
      setHasMore(hasMore)
      setError(null)
    } catch (error) {
      console.error("Error fetching posts:", error)
      setError("Failed to fetch posts. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setPage(1)
    fetchPosts(1, searchQuery)
  }, [searchQuery])

  const loadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchPosts(nextPage, searchQuery)
  }

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((tag) => tag.name.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.section
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <h2 className="text-2xl font-bold mb-6 text-neutral-900 dark:text-white flex items-center">
            <Sparkles className="mr-2 w-6 h-6 text-purple-500" />
            {searchQuery ? 'Search Results' : 'All Writings'}
          </h2>
          {error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center mt-12 text-red-600 dark:text-red-400 text-xl"
            >
              {error}
            </motion.div>
          ) : (
            <div className="!gap-6">
              {filteredPosts.map((post) => (
                <BlogCard key={post.id} {...post} />
              ))}
            </div>
          )}
        </motion.section>

        {filteredPosts.length === 0 && !error && !isLoading && (
          <motion.div
            key="no-results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center mt-12 text-neutral-600 dark:text-neutral-400 text-xl"
          >
            No writings found. Try a different search term.
          </motion.div>
        )}
      </AnimatePresence>

      {hasMore && !searchQuery && !error && (
        <div className="mt-16 text-center">
          <Button
            variant="outline"
            size="lg"
            onClick={loadMore}
            disabled={isLoading}
            className="group bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-700"
          >
            {isLoading ? 'Loading...' : 'Load More'}
            {!isLoading && <ChevronDown className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-y-1" />}
          </Button>
        </div>
      )}
    </>
  )
}