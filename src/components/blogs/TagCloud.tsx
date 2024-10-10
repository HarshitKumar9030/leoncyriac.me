import React from 'react'
import { Badge } from "@/components/ui/badge"

interface Tag {
  id: number;
  name: string;
}

interface TagCloudProps {
  tags: Tag[];
  selectedTags: number[];
  onTagClick: (tagId: number) => void;
}

export default function TagCloud({ tags, selectedTags, onTagClick }: TagCloudProps) {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-4 text-neutral-900 dark:text-white">Filter by Tags</h3>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Badge
            key={tag.id}
            variant={selectedTags.includes(tag.id) ? "default" : "secondary"}
            className={`cursor-pointer transition-all duration-300 ${
              selectedTags.includes(tag.id)
                ? "bg-purple-500 text-white hover:bg-purple-600"
                : "bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-600"
            }`}
            onClick={() => onTagClick(tag.id)}
          >
            {tag.name}
          </Badge>
        ))}
      </div>
    </div>
  )
}