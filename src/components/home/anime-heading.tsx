"use client"

import React from "react"
import dynamic from "next/dynamic"
import { Tv } from "lucide-react"

const MotionDiv = dynamic(() => import("framer-motion").then((mod) => mod.motion.div), { ssr: false })
const MotionH1 = dynamic(() => import("framer-motion").then((mod) => mod.motion.h1), { ssr: false })
const MotionP = dynamic(() => import("framer-motion").then((mod) => mod.motion.p), { ssr: false })

export function AnimeHeading() {
  return (
    <div className="relative rounded-xl mb-16 overflow-hidden">
      <MotionDiv
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center md:items-start relative z-10"
      >
        <MotionDiv
          className="flex items-center mb-4"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="flex flex-row items-center">
            <Tv className="w-8 h-8 mr-2 dark:text-neutral-100 text-neutral-700" />
            <h2 className="text-sm font-medium mt-1.5 dark:text-neutral-100 text-neutral-700 uppercase tracking-wide">
              Anime Collection
            </h2>
          </div>
        </MotionDiv>
        <MotionH1
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-center md:text-left text-neutral-900 dark:text-neutral-200 mb-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          My Favorite Anime
        </MotionH1>
        <MotionP
          className="text-base md:text-lg text-neutral-600 dark:text-neutral-400 text-center md:text-left max-w-2xl"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          Explore my handpicked selection of captivating anime series that have
          left a lasting impression.
        </MotionP>
      </MotionDiv>
    </div>
  )
}