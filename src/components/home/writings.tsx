"use client";

import React from "react";
import {
  CalendarIcon,
  ClockIcon,
  ArrowRightIcon,
  ThumbsUpIcon,
  MessageCircleIcon,
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
import { WritingsHeading } from "./writings-heading";
import Image from "next/image";
import { CustomLink } from "../common/CustomLink";
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
  likes: number;
  comments: number;
};

const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "The Revolution of Peer Learning",
    description:
      "Unlock the potential of collaborative education and witness how it's reshaping traditional learning paradigms.",
    image: "/peerlearn.png",
    date: "2024-09-01",
    readTime: "5 min read",
    tags: [
      { id: 1, name: "Education" },
      { id: 2, name: "Collaboration" },
    ],
    likes: 127,
    comments: 23,
  },
  {
    id: 2,
    title: "AI-Powered Online Education: A Glimpse into Tomorrow",
    description:
      "Dive into the cutting-edge AI technologies transforming e-learning and preparing students for the future.",
    image: "/peerlearn.png",
    date: "2024-08-25",
    readTime: "7 min read",
    tags: [
      { id: 3, name: "AI" },
      { id: 4, name: "E-learning" },
    ],
    likes: 215,
    comments: 41,
  },
  {
    id: 3,
    title: "The Art of Productive Remote Learning",
    description:
      "Master the techniques of staying motivated and achieving peak performance in virtual learning environments.",
    image: "/peerlearn.png",
    date: "2024-08-18",
    readTime: "6 min read",
    tags: [
      { id: 5, name: "Productivity" },
      { id: 6, name: "Remote Work" },
    ],
    likes: 189,
    comments: 37,
  },
];

const BlogCard: React.FC<BlogPost> = ({
  title,
  description,
  image,
  date,
  readTime,
  tags,
  likes,
  comments,
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
              src={image as string}
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

          <div className="flex flex-wrap gap-2 mb-4">
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
            <span>{readTime}</span>
          </div>

          <div className="flex justify-between items-center">
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
                      <span>{likes}</span>
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
                      className="p-0 hover:bg-neutral-100 dark:hover:bg-neutral-700 px-2 text-neutral-600  dark:text-neutral-300"
                    >
                      <MessageCircleIcon className="w-4 h-4 mr-2" />
                      <span>{comments}</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Comments</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 p-0"
            >
              Read More <ArrowRightIcon className="w-4 h-4 ml-2" />
            </Button>
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
  return (
    <div className="container mx-auto px-4 py-8">
      <WritingsHeading />
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {blogPosts.map((post) => (
          <BlogCard key={post.id} {...post} />
        ))}
      </div>
      <div className="mt-8 flex justify-end">
        <CustomLink link="/writings" className="shadow-none px-6 hover:bg-neutral-200 bg-neutral-300 dark:bg-neutral-700 transition-all duration-300 dark:hover:bg-neutral-800">View All</CustomLink>
      </div>
    </div>
  );
}
