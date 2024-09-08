"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  TrendingUp,
  Sparkles,
  ChevronDown,
  Calendar,
  Clock,
  ThumbsUpIcon,
  MessageCircleIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

type Tag = {
  id: number;
  name: string;
};

type BlogPost = {
  id: number;
  title: string;
  description: string;
  image: string;
  date: string;
  readTime: string;
  tags: Tag[];
  trending?: boolean;
  views: number;
  likes: number;
  comments: number;
};

// Mock data
const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "The Future of Web Development",
    description: "Exploring upcoming trends and technologies shaping the web.",
    image: "/peerlearn.png",
    date: "2024-03-15",
    readTime: "5 min read",
    tags: [
      { id: 1, name: "Web Dev" },
      { id: 2, name: "Trends" },
    ],
    trending: true,
    views: 2323,
    likes: 23343,
    comments: 334,
  },
  {
    id: 2,
    title: "Mastering Next.js 14",
    description: "A deep dive into the latest features of Next.js 14.",
    image: "/peerlearn.png",
    date: "2024-03-10",
    readTime: "8 min read",
    tags: [
      { id: 3, name: "Next.js" },
      { id: 4, name: "React" },
    ],
    trending: true,
    views: 2323,
    likes: 23343,
    comments: 334,
  },
  {
    id: 3,
    title: "Optimizing React Performance",
    description: "Tips and tricks to boost your React application's speed.",
    image: "/peerlearn.png",
    date: "2024-03-05",
    readTime: "6 min read",
    tags: [
      { id: 4, name: "React" },
      { id: 5, name: "Performance" },
    ],
    views: 2323,
    likes: 23343,
    comments: 334,
  },
  {
    id: 4,
    title: "The Art of Clean Code",
    description: "Principles and practices for writing maintainable code.",
    image: "/peerlearn.png",
    date: "2024-02-28",
    readTime: "7 min read",
    tags: [
      { id: 6, name: "Clean Code" },
      { id: 7, name: "Best Practices" },
    ],
    views: 2323,
    likes: 23343,
    comments: 334,
  },
  {
    id: 5,
    title: "Serverless Architecture Explained",
    description:
      "Understanding the benefits and challenges of serverless computing.",
    image: "/peerlearn.png",
    date: "2024-02-20",
    readTime: "9 min read",
    tags: [
      { id: 8, name: "Serverless" },
      { id: 9, name: "Cloud Computing" },
    ], 
    views: 2323,    likes: 23343,
    comments: 334,

  },
  {
    id: 6,
    title: "Mastering CSS Grid",
    description:
      "Advanced techniques for creating complex layouts with CSS Grid.",
    image: "/peerlearn.png",
    date: "2024-02-15",
    readTime: "6 min read",
    tags: [
      { id: 10, name: "CSS" },
      { id: 11, name: "Layout" },
    ],
    views: 2323,    likes: 23343,
    comments: 334,

  },
];

const BlogCard: React.FC<BlogPost> = ({
  title,
  description,
  image,
  date,
  readTime,
  views,
  tags,
  trending,
  likes,
  comments,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="group bg-white dark:bg-neutral-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col sm:flex-row"
    >
      <div className="relative w-full sm:w-1/3 h-48 sm:h-auto">
        <Image
          src={image}
          alt={title}
          layout="fill"
          objectFit="cover"
          className="transition-transform duration-300 group-hover:scale-105"
        />
        {trending && (
          <div className="absolute top-2 left-2">
            <Badge
              variant="secondary"
              className="bg-yellow-500/80 text-yellow-100"
            >
              <TrendingUp className="w-3 h-3 mr-1" />
              Trending
            </Badge>
          </div>
        )}
      </div>
      <div className="p-4 sm:p-6 flex relative flex-col justify-between w-full sm:w-2/3">
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
          <div className="flex items-center">
            <Calendar className="w-3 h-3 mr-1" />
            <span>{date}</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            <span>{readTime}</span>
          </div>
          <div className="flex absolute text-sm top-8 right-[1.75rem] items-center">
            <span>{views} views</span>
          </div>
        </div>
        {/* <div className="flex items-center space-x-2 mt-4 text-xs text-neutral-700 dark:text-neutral-300">
          <div className="flex py-1 px-2 rounded-md bg-neutral-300 dark:bg-neutral-700 items-center">
            <ThumbsUpIcon className="w-3 h-3 mr-1" />
            <span>{likes}</span>
          </div>
          <div className="flex py-1 px-2 rounded-md bg-neutral-300 dark:bg-neutral-700 items-center">
            <MessageCircleIcon className="w-3 h-3 mr-1" />
            <span>{comments}</span>
          </div>
          
        </div> */}
      </div>
    </motion.div>
  );
};

// Search Bar Component
const SearchBar: React.FC<{ onSearch: (query: string) => void }> = ({
  onSearch,
}) => {
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        document.getElementById("search-input")?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <form onSubmit={handleSearch} className="relative mb-12 max-w-3xl mx-auto">
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
    </form>
  );
};

// Main Component
export default function UltraModernWritingsPage() {
  const [filteredPosts, setFilteredPosts] = useState(blogPosts);
  const [searchActive, setSearchActive] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handleSearch = (query: string) => {
    const lowercasedQuery = query.toLowerCase();
    const filtered = blogPosts.filter(
      (post) =>
        post.title.toLowerCase().includes(lowercasedQuery) ||
        post.description.toLowerCase().includes(lowercasedQuery) ||
        post.tags.some((tag) =>
          tag.name.toLowerCase().includes(lowercasedQuery)
        )
    );
    setFilteredPosts(filtered);
    setSearchActive(query !== "");
  };

  const trendingPosts = blogPosts.filter((post) => post.trending);

  return (
    <div className={`container mx-auto px-4 py-16 max-w-5xl`}>
      <SearchBar onSearch={handleSearch} />

      <AnimatePresence>
        {!searchActive && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold mb-6 text-neutral-900 dark:text-white flex items-center">
              <TrendingUp className="mr-2 w-6 h-6 text-yellow-500" />
              Trending Now
            </h2>
            <div className="space-y-6">
              {trendingPosts.map((post) => (
                <BlogCard key={post.id} {...post} />
              ))}
            </div>
          </motion.section>
        )}

        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <h2 className="text-2xl font-bold mb-6 text-neutral-900 dark:text-white flex items-center">
            {searchActive ? (
              <>
                <Search className="mr-2 w-6 h-6 text-purple-500" />
                Search Results
              </>
            ) : (
              <>
                <Sparkles className="mr-2 w-6 h-6 text-purple-500" />
                All Writings
              </>
            )}
          </h2>
          <div className="space-y-6">
            {filteredPosts.map((post) => (
              <BlogCard key={post.id} {...post} />
            ))}
          </div>
        </motion.section>

        {filteredPosts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center mt-12 text-neutral-600 dark:text-neutral-400 text-xl"
          >
            No writings found. Try a different search term.
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-16 text-center">
        <Button
          variant="outline"
          size="lg"
          className="group bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-700"
        >
          Load More
          <ChevronDown className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-y-1" />
        </Button>
      </div>
    </div>
  );
}
