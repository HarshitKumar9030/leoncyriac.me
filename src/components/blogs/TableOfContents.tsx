"use client"

import React, { useEffect, useState, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { ChevronDown, ChevronRight, Search, Loader2, Menu } from 'lucide-react'
// @ts-ignore
import throttle from 'lodash/throttle'

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { useMediaQuery } from '@/hooks/useMediaQuery'

interface Heading {
  id: string
  text: string
  level: number
}

export default function TableOfContents() {
  const [headings, setHeadings] = useState<Heading[]>([])
  const [filteredHeadings, setFilteredHeadings] = useState<Heading[]>([])
  const [activeId, setActiveId] = useState<string>('')
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const pathname = usePathname()
  const observer = useRef<IntersectionObserver | null>(null)

  const isDesktop = useMediaQuery('(min-width: 1024px)') 

  useEffect(() => {
    setIsLoading(true)
    const generateId = (text: string) =>
      text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '')

    const getHeadings = () => {
      const elements = Array.from(document.querySelectorAll('h2, h3, h4')).map(
        (element) => {
          let id = element.id
          if (!id) {
            id = generateId(element.textContent || '')
            element.id = id
          }
          return {
            id,
            text: element.textContent || '',
            level: Number(element.tagName.charAt(1)),
          }
        }
      )
      setHeadings(elements)
      setFilteredHeadings(elements)
      setIsLoading(false)
    }

    const timer = setTimeout(() => {
      getHeadings()
      setupIntersectionObserver()
    }, 500)

    return () => {
      clearTimeout(timer)
      if (observer.current) {
        observer.current.disconnect()
      }
    }
  }, [pathname])

  const setupIntersectionObserver = () => {
    if (observer.current) {
      observer.current.disconnect()
    }

    const callback = throttle((entries: IntersectionObserverEntry[]) => {
      const visibleHeadings = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

      if (visibleHeadings.length > 0) {
        setActiveId(visibleHeadings[0].target.id)
      }
    }, 100)

    observer.current = new IntersectionObserver(callback, {
      rootMargin: '-20% 0% -35% 0%',
      threshold: [0, 0.25, 0.5, 0.75, 1],
    })

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id)
      if (element) observer.current?.observe(element)
    })
  }

  useEffect(() => {
    const filtered = headings.filter((heading) =>
      heading.text.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredHeadings(filtered)
  }, [searchTerm, headings])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  // Open the Collapsible by default on desktop, closed on mobile
  useEffect(() => {
    setIsOpen(isDesktop)
  }, [isDesktop])

  return (
    <div
      className={`${
        isDesktop ? 'w-64' : 'w-full'
      } bg-zinc-50 dark:bg-zinc-900 border pb-3 border-zinc-200 dark:border-zinc-800 ${
        isOpen ? 'rounded-t-lg rounded-b-lg' : 'rounded-lg'
      } shadow-sm overflow-hidden`}
    >
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div
          className={`flex items-center justify-between px-4 py-2 ${
            isOpen ? 'border-b border-zinc-200 dark:border-zinc-800' : ''
          }`}
        >
          <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">
            Contents
          </h2>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="w-9 h-9 p-0 hover:bg-zinc-200 dark:hover:bg-zinc-800"
            >
              {isOpen ? (
                isDesktop ? (
                  <ChevronDown className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
                ) : (
                  <Menu className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
                )
              ) : isDesktop ? (
                <ChevronRight className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
              ) : (
                <Menu className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
              )}
              <span className="sr-only">Toggle table of contents</span>
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent className="rounded-b-lg">
          <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-zinc-400 dark:text-zinc-500" />
              <Input
                type="search"
                placeholder="Search headings..."
                className="pl-8 bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 focus:ring-zinc-500 dark:focus:ring-zinc-400"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
          </div>
          <ScrollArea className="max-h-[60vh] px-4 py-2">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-6 w-6 animate-spin text-zinc-400 dark:text-zinc-500" />
              </div>
            ) : (
              <nav aria-label="Table of contents">
                {filteredHeadings.map((heading) => (
                  <a
                    key={heading.id}
                    href={`#${heading.id}`}
                    style={{ paddingLeft: `${(heading.level - 2) * 1}rem` }}
                    className={`block py-1 text-sm transition-colors duration-200 hover:text-zinc-900 dark:hover:text-zinc-100 ${
                      activeId === heading.id
                        ? 'text-zinc-900 dark:text-zinc-100 font-medium'
                        : 'text-zinc-600 dark:text-zinc-400'
                    }`}
                    onClick={(e) => {
                      e.preventDefault()
                      const target = document.getElementById(heading.id)
                      if (target) {
                        window.history.pushState(null, '', `#${heading.id}`)
                        target.scrollIntoView({
                          behavior: 'smooth',
                          block: 'start',
                        })
                        if (!isDesktop) {
                          setIsOpen(false) // Close the TOC on mobile after selection
                        }
                      }
                    }}
                  >
                    {heading.text}
                  </a>
                ))}
              </nav>
            )}
          </ScrollArea>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
