"use client";
import { getBlogPosts } from "@/lib/getBlogPosts";
import React, { useState, useEffect } from "react";
import {
  CalendarIcon,
  ClockIcon,
  ArrowRightIcon,
  ThumbsUpIcon,
  MessageCircleIcon,
  EyeIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Beam from "@/components/ui/Beam";
import Link from "next/link";
import { WritingsHeading } from "./writings-heading";
import Image from "next/image";
import { CustomLink } from "../common/CustomLink";
import Loading from "@/app/loading";

type Tag = {
  id: string;
  name: string;
};

type BlogPost = {
  id: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  date: string;
  readingTime: string;
  tags: Tag[];
  views: number;
  likes: string[];
};

const BlogCard: React.FC<BlogPost> = ({
  slug,
  title,
  description,
  image,
  date,
  readingTime,
  tags,
  likes,
  views,
}) => {
  return (
    <div style={{ perspective: "1000px" }}>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0 }}
        variants={{
          hidden: { opacity: 0, y: 0, scale: 1, rotateX: 45 },
          visible: {
            opacity: 1,
            y: [0, -20, 0],
            scale: [1, 1.02, 1],
            rotateX: 0,
          },
        }}
        className="h-full w-full rounded-lg bg-white dark:bg-neutral-800 relative overflow-hidden shadow-md transition-colors duration-200"
      >
        <Beam className="top-0" />
        <Beam className="top-0" />

        <div className="p-3 relative z-10">
          <div className="relative h-48 w-full mb-4 overflow-hidden rounded-lg">
            <Image
              src={image}
              alt={title}
              layout="fill"
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 transition-opacity group-hover:bg-opacity-20" />
          </div>

          <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {title}
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-4">
            {description}
          </p>

          <div className="flex h-full flex-wrap gap-2 mb-4">
            {tags.map((tag) => (
              <Badge
                key={tag.id}
                variant="secondary"
                className="bg-neutral-100 text-neutral-800 dark:bg-neutral-700 dark:text-neutral-200"
              >
                {tag.name}
              </Badge>
            ))}
          </div>

          <div className="flex items-center text-sm text-neutral-500 dark:text-neutral-400 mb-4">
            <CalendarIcon className="w-4 h-4 mr-2" />
            <span>{date}</span>
            <ClockIcon className="w-4 h-4 ml-4 mr-2" />
            <span>{readingTime}</span>
          </div>

          <div className="flex h-full justify-between items-center">
            <div className="flex space-x-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-0 hover:bg-neutral-100 dark:hover:bg-neutral-700 px-2 text-neutral-600 dark:text-neutral-300"
                    >
                      <ThumbsUpIcon className="w-4 h-4 mr-2" />
                      <span>{likes.length}</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Likes</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-0 hover:bg-neutral-100 dark:hover:bg-neutral-700 px-2 text-neutral-600 dark:text-neutral-300"
                    >
                      <EyeIcon className="w-4 h-4 mr-2" />
                      <span>{views}</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Views</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Link href={`/writings/${slug}`}>
              <Button
                variant="ghost"
                size="sm"
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 p-0"
              >
                Read More <ArrowRightIcon className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="absolute bottom-0 right-4 mt-[2px] flex h-8 items-end overflow-hidden">
          <div className="flex -mb-px h-[2px] w-80 -scale-x-100">
            <div className="w-full flex-none blur-sm [background-image:linear-gradient(90deg,rgba(56,189,248,0)_0%,#0EA5E9_32.29%,rgba(236,72,153,0.3)_67.19%,rgba(236,72,153,0)_100%)]"></div>
            <div className="-ml-[100%] w-full flex-none blur-[1px] [background-image:linear-gradient(90deg,rgba(56,189,248,0)_0%,#0EA5E9_32.29%,rgba(236,72,153,0.3)_67.19%,rgba(236,72,153,0)_100%)]"></div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default function Writings() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const { posts: fetchedPosts } = await getBlogPosts(1, 3, "");
        setPosts(fetchedPosts);
        setError(null);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setError("Failed to fetch posts. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <WritingsHeading />
        <div className="text-center mt-12 text-red-600 dark:text-red-400 text-xl">
          {error}
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <WritingsHeading />
        <div className="text-center mt-12">
          <Loading />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <WritingsHeading />
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <BlogCard key={post.id} {...post} />
        ))}
      </div>
      <div className="mt-8 flex justify-end">
        <CustomLink
          link="/writings"
          className="shadow-none px-6 hover:bg-neutral-200 bg-neutral-300 dark:bg-neutral-700 transition-all duration-300 dark:hover:bg-neutral-800"
        >
          View All
        </CustomLink>
      </div>
    </div>
  );
}
