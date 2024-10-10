'use client';

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { MDXProvider } from '@mdx-js/react'
import TableOfContents from './TableOfContents'
import { Clock, Eye, Calendar, ThumbsUp, MessageCircle, Share2 } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { Button } from "@/components/custom/button"

interface FrontMatter {
  title: string
  date: string
  readingTime: string
  image: string
  views: number
  likes: number
  comments: number
}

interface BlogLayoutProps {
  children: React.ReactNode
  frontMatter: FrontMatter
}

const components = {
  img: (props: any) => (
    <div className="relative w-full h-64 my-8">
      <Image
        {...props}
        layout="fill"
        objectFit="cover"
        className="rounded-lg"
        loading="lazy"
        placeholder="blur"
        blurDataURL="/placeholder.png"
      />
    </div>
  ),
  a: (props: any) => <Link {...props} className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 underline" />,
  h2: (props: any) => <h2 {...props} className="text-2xl font-bold mt-8 mb-4 text-zinc-800 dark:text-zinc-200" />,
  h3: (props: any) => <h3 {...props} className="text-xl font-semibold mt-6 mb-3 text-zinc-800 dark:text-zinc-200" />,
  p: (props: any) => <p {...props} className="mb-4 text-zinc-600 dark:text-zinc-400" />,
  ul: (props: any) => <ul {...props} className="list-disc list-inside mb-4 text-zinc-600 dark:text-zinc-400" />,
  ol: (props: any) => <ol {...props} className="list-decimal list-inside mb-4 text-zinc-600 dark:text-zinc-400" />,
  blockquote: (props: any) => <blockquote {...props} className="border-l-4 border-zinc-300 dark:border-zinc-700 pl-4 italic my-4 text-zinc-600 dark:text-zinc-400" />,
  code: (props: any) => <code {...props} className="bg-zinc-100 dark:bg-zinc-800 rounded px-1 py-0.5 text-sm text-zinc-800 dark:text-zinc-200" />,
  pre: (props: any) => <pre {...props} className="bg-zinc-100 dark:bg-zinc-800 rounded p-4 overflow-x-auto my-4" />,
}

const MetaItem: React.FC<{ icon: React.ReactNode; children: React.ReactNode }> = ({ icon, children }) => (
  <div className="flex items-center text-sm text-zinc-500 dark:text-zinc-400">
    {icon}
    <span className="ml-1">{children}</span>
  </div>
)

export default function BlogLayout({ children, frontMatter }: BlogLayoutProps) {
  return (
    <MDXProvider components={components}>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <article>
          <header className="mb-8">
            <h1 className="text-4xl font-bold mb-4 text-zinc-900 dark:text-zinc-100">{frontMatter.title}</h1>
            <div className="flex items-center space-x-4 text-zinc-500 dark:text-zinc-400">
              <MetaItem icon={<Calendar className="w-4 h-4" />}>
                {formatDate(frontMatter.date)}
              </MetaItem>
              <MetaItem icon={<Clock className="w-4 h-4" />}>
                {frontMatter.readingTime} min read
              </MetaItem>
              <MetaItem icon={<Eye className="w-4 h-4" />}>
                {frontMatter.views} views
              </MetaItem>
            </div>
          </header>
          
          <div className="relative w-full h-[60vh] mb-8">
            <Image
              src={frontMatter.image}
              alt={frontMatter.title}
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
          </div>
          
          <div className="flex justify-between items-center mb-8">
            <div className="flex space-x-4">
              <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                <ThumbsUp className="w-4 h-4" />
                <span>{frontMatter.likes}</span>
              </Button>
              <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                <MessageCircle className="w-4 h-4" />
                <span>{frontMatter.comments}</span>
              </Button>
            </div>
            <Button variant="ghost" size="sm" className="flex items-center space-x-2">
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </Button>
          </div>
          
          <div className="flex flex-col lg:flex-row">
            <div className="w-full lg:w-3/4 lg:pr-8">
              <div className="prose prose-zinc dark:prose-invert max-w-none">
                {children}
              </div>
            </div>
            
            <aside className="w-full lg:w-1/4 mt-8 lg:mt-0">
              <div className="sticky top-8">
                <TableOfContents />
              </div>
            </aside>
          </div>
        </article>
      </div>
    </MDXProvider>
  )
}