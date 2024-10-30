'use client'

import React from "react"
import { motion } from "framer-motion"
import { Calendar, Clock, Eye, ThumbsUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"

interface Tag {
  id: string
  name: string
}

interface BlogCardProps {
  id: string
  slug: string
  title: string
  description: string
  image: string
  date: string
  readingTime: string
  tags: Tag[]
  views: number
  likes: string[]
}

export default function BlogCard({
  slug,
  title,
  description,
  image,
  date,
  readingTime,
  tags,
  views,
  likes,
}: BlogCardProps) {
  return (
    <Link href={`/writings/${slug}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="group mt-6 bg-white dark:bg-neutral-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col sm:flex-row"
      >
        <div className="relative w-full sm:w-1/3 h-48 sm:h-auto">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="p-4 sm:p-6 flex flex-col justify-between w-full sm:w-2/3">
          <div>
            <h3 className="text-lg font-semibold mb-2 text-neutral-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
              {title}
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-4 line-clamp-2">
              {description}
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              {tags.map((tag) => (
                <Badge
                  key={tag.id}
                  variant="secondary"
                  className="bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300"
                >
                  {tag.name}
                </Badge>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Calendar className="w-3 h-3 mr-1" />
                <span>{date}</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                <span>{readingTime}</span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center">
                <Eye className="w-3 h-3 mr-1" />
                <span>{views}</span>
              </div>
              <div className="flex items-center">
                <ThumbsUp className="w-3 h-3 mr-1" />
                <span>{likes.length}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  )
}