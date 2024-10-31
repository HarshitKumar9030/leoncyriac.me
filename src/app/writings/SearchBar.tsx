'use client'

import React, { useState, useEffect, useCallback } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useRouter, useSearchParams } from 'next/navigation'
import { useDebounce } from '@/hooks/use-debouce'

export default function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || "")
  const debouncedQuery = useDebounce(query, 300)

  const updateSearchParams = useCallback((newQuery: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (newQuery) {
      params.set('q', newQuery)
    } else {
      params.delete('q')
    }
    return params.toString()
  }, [searchParams])

  useEffect(() => {
    const newParams = updateSearchParams(debouncedQuery)
    router.push(`/writings${newParams ? `?${newParams}` : ''}`, { scroll: false })
  }, [debouncedQuery, router, updateSearchParams])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault()
        document.getElementById("search-input")?.focus()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <div className="relative mb-12 max-w-3xl mx-auto">
      <div className="relative">
        <Input
          id="search-input"
          type="text"
          placeholder="Search Writings"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-12 pr-12 py-6 rounded-lg border-none bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-500 dark:placeholder-neutral-400 focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 text-lg shadow-sm"
        />
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-600 dark:text-neutral-400 w-5 h-5" />
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-neutral-200 dark:bg-neutral-700 rounded px-2 py-1 text-xs text-neutral-600 dark:text-neutral-300">
          ⌘K
        </div>
      </div>
      <div className="absolute inset-0 -z-10 bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-xl" />
    </div>
  )
}