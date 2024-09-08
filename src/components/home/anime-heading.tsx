import React from "react";
import { motion } from "framer-motion";
import { Tv } from "lucide-react";

export function AnimeHeading() {
  return (
    <div className="relative rounded-xl mb-16 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center md:items-start relative z-10"
      >
        <motion.div
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
        </motion.div>
        <motion.h1
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-center md:text-left text-neutral-900 dark:text-neutral-200 mb-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          My Favorite Anime
        </motion.h1>
        <motion.p
          className="text-base md:text-lg text-neutral-600 dark:text-neutral-400 text-center md:text-left max-w-2xl"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          Explore my handpicked selection of captivating anime series that have
          left a lasting impression.
        </motion.p>
      </motion.div>
    </div>
  );
}
