'use client'

import { Suspense, useState } from 'react'
import BlogPosts from './Client'
import SearchBar from './SearchBar'
import Loading from '@/app/loading'

export default function WritingsPage() {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-5xl">
      <SearchBar onSearch={handleSearch} />
      <Suspense fallback={<Loading />}>
        <BlogPosts searchQuery={searchQuery} />
      </Suspense>
    </div>
  )
}