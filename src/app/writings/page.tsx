import { Suspense } from 'react'
import BlogPosts from './Client'
import SearchBar from './SearchBar'
import Loading from '@/app/loading'

// This is a Server Component by default (no 'use client' directive)
export default function WritingsPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-5xl">
      <SearchBar />
      <Suspense fallback={<Loading />}>
        <BlogPosts />
      </Suspense>
    </div>
  )
}