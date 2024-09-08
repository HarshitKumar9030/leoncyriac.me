import React from "react"
import { motion } from "framer-motion"
import { BookOpen } from "lucide-react"

export function WritingsHeading() {
  return (
    <div className="relative !max-w-3xl mx-auto rounded-xl mb-16 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col  items-center md:items-start relative z-10"
      >
        <motion.div
          className="flex items-center mb-4"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="flex  flex-row items-center">
            <BookOpen className="w-8 h-8 mr-2 dark:text-neutral-100 text-neutral-700" />
            <h2 className="text-sm font-medium dark:text-neutral-100 text-neutral-700 uppercase tracking-wide">
              Blog Posts
            </h2>
          </div>
        </motion.div>
        <motion.h1
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-center md:text-left text-neutral-900 dark:text-neutral-200 mb-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Writings
        </motion.h1>
        <motion.p
          className="text-base md:text-lg text-neutral-600 dark:text-neutral-400 text-center md:text-left max-w-2xl"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          Dive into my collection of thoughts, insights, and experiences shared through carefully crafted articles.
        </motion.p>
      </motion.div>
    </div>
  )
}