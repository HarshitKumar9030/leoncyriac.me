'use client'

import React, { Suspense, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Twitter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Highlight from "@/components/common/Highlight"
import MyWork from "@/components/home/work"
import FavoriteAnime from "@/components/home/FavoriteAnime"
import Writings from "@/components/home/writings"
import Beam from "@/components/ui/Beam"
import { getCurrentTrack } from "@/lib/spotify"
import NowPlaying from "@/components/spotify/spotify-client"
import { Skeleton } from "@/components/ui/skeleton"

// import type { Track } from "@/components/spotify/spotify-client"

export default function Home() {
  const initialTrack = getCurrentTrack()

  const [isExpanded, setIsExpanded] = useState(false)

  const toggleExpansion = () => setIsExpanded((prev) => !prev)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="my-8 flex flex-col items-center justify-center mx-auto max-w-7xl space-y-12 px-4"
    >
      <Card className="w-full border-none shadow-none max-w-3xl">
        <CardContent className="p-2 space-y-6">
          <section aria-label="Introduction" className="space-y-4 text-center md:text-start">
            <p className="text-base md:text-lg text-muted-foreground">
              Hello there! This is Harshit, also known as{" "}
              <Highlight href="https://leoncyriac.me">LeonCyriac</Highlight>. I&apos;m a self-taught{" "}
              <Highlight>full-stack developer</Highlight> and a student from{" "}
              <Highlight href="https://en.wikipedia.org/wiki/India">India</Highlight>, with a 
              passion for crafting modern web technologies. My journey is rooted in a deep 
              fascination for <Highlight>JavaScript</Highlight>, exploring the vast landscape 
              of <Highlight>LLMs (Large Language Models)</Highlight>, and creating intelligent 
              solutions with <Highlight href="https://openai.com/">AI</Highlight>.
            </p>

            <motion.div
              initial={isExpanded ? { height: 0, opacity: 0 } : { height: "auto", opacity: 1 }}
              animate={isExpanded ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="space-y-4 ">
                <p className="text-base md:text-lg text-muted-foreground">
                  My expertise lies in building responsive and high-performance applications using{" "}
                  <Highlight href="https://nextjs.org/">Next.js</Highlight>,{" "}
                  <Highlight href="https://reactjs.org/">React</Highlight>, and{" "}
                  <Highlight href="https://tailwindcss.com/">Tailwind CSS</Highlight>. I also 
                  have a strong command of <Highlight>TypeScript</Highlight> and{" "}
                  <Highlight href="https://nodejs.org/">Node.js</Highlight>, enabling me to 
                  develop scalable and maintainable solutions.
                </p>
                <p className="text-base md:text-lg text-muted-foreground">
                  I am driven by the ever-evolving world of technology and constantly seek to 
                  explore new trends, particularly in{" "}
                  <Highlight href="https://www.ibm.com/cloud/learn/machine-learning">AI</Highlight>{" "}
                  and{" "}
                  <Highlight href="https://en.wikipedia.org/wiki/Machine_learning">
                    machine learning
                  </Highlight>. I am currently delving into advanced concepts like{" "}
                  <Highlight href="https://en.wikipedia.org/wiki/Large_language_model">
                    large language models (LLMs)
                  </Highlight>{" "}
                  and integrating AI-powered features into web applications.
                </p>
                <p className="text-base md:text-lg text-muted-foreground">
                  Beyond technology, I&apos;m deeply passionate about anime. Whether it&apos;s the intense 
                  battles in <Highlight>Naruto</Highlight>, the complex narratives of{" "}
                  <Highlight>Attack on Titan</Highlight>, or the inspirational journey of 
                  characters in <Highlight>My Hero Academia</Highlight>, anime has a way of 
                  connecting deeply with its audience.
                </p>
              </div>
            </motion.div>
          </section>

          <div className="flex relative flex-col sm:flex-row justify-between items-center gap-4">
            <Button asChild className="w-2/3 rounded-lg mx-4 sm:mx-0 py-1.5 px-4 space-x-1 shadow-none bg-neutral-300 dark:bg-neutral-700 dark:text-neutral-300 hover:scale-105 duration-300 transition-all cursor-nesw-resize text-neutral-600 sm:w-auto">
              <Link href="https://x.com/OhHarshit" className="flex items-center gap-2">
                <Twitter className="w-5 h-5" />
                Find me on X
              </Link>
            </Button>
            <Button
            
              onClick={toggleExpansion}
              variant="ghost"
              className="w-2/3 mx-4 rounded-lg sm:mx-0 py-1.5 px-4 space-x-1 shadow-none bg-neutral-300 dark:bg-neutral-700 dark:text-neutral-300 hover:scale-105 duration-300 transition-all cursor-pointer text-neutral-600 sm:w-auto"
            >
              {isExpanded ? "Read Less" : "Read More"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <MyWork />
      <FavoriteAnime />
      <Writings />
    <Suspense fallback={<Skeleton className="w-10 h-10 rounded-full" />}>
      <NowPlaying initialTrack={initialTrack as any} />
    </Suspense>
    </motion.div>
  )
}