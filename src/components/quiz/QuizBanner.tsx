'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import QuizModal from './QuizModal'
import Link from 'next/link'

export default function QuizBanner() {
  const [isVisible, setIsVisible] = useState(false)
  const [isQuizOpen, setIsQuizOpen] = useState(false)

  useEffect(() => {
    // Check if the user has dismissed the banner before
    const bannerDismissed = localStorage.getItem('quizBannerDismissed')
    
    if (!bannerDismissed) {
      // Only show the banner after 2 seconds if it hasn't been dismissed
      const timer = setTimeout(() => setIsVisible(true), 2000)
      return () => clearTimeout(timer)
    }
  }, [])

  // Function to dismiss the banner and remember the choice
  const dismissBanner = () => {
    setIsVisible(false)
    localStorage.setItem('quizBannerDismissed', 'true')
  }

  // Optional: Function to dismiss for a shorter period (e.g., 7 days)
  const dismissTemporarily = () => {
    setIsVisible(false)
    const expiryDate = new Date()
    expiryDate.setDate(expiryDate.getDate() + 7) // 7 days from now
    localStorage.setItem('quizBannerDismissed', expiryDate.toISOString())
  }

  return (
    <>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 100 }}
            className="fixed top-0 left-0 right-0 z-50 bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-700 py-2 px-4 backdrop-blur-md bg-opacity-95 dark:bg-opacity-95"
          >
            <div className="container mx-auto">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
                <p className="text-sm font-medium text-neutral-900 dark:text-white text-center sm:text-left">
                  Test your knowledge and share your opinion!
                </p>
                <div className="flex flex-col md:flex-row items-center gap-3 w-full sm:w-auto">
                  <Button
                    onClick={() => setIsQuizOpen(true)}
                    size="sm"
                    className="px-4 py-2 w-full shadow-none text-xs sm:text-sm font-medium text-neutral-500 bg-neutral-300 dark:text-neutral-900 dark:bg-white rounded-lg hover:bg-neutral-200 transition-all duration-300"
                  >
                    Take Quiz
                  </Button>
                  <Button
                    asChild
                    size="sm"
                    className="px-4 py-2 w-full shadow-none text-xs sm:text-sm font-medium text-neutral-500 bg-neutral-300 dark:text-neutral-900 dark:bg-white rounded-lg hover:bg-neutral-200 transition-all duration-300"
                  >
                    <Link href="/polls">View Polls</Link>
                  </Button>
                  <Button
                    onClick={dismissBanner}
                    size="icon"
                    className="absolute top-2 right-2 sm:relative sm:top-0 sm:right-0 h-7 w-7 shadow-none bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-white border-none"
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close banner</span>
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <QuizModal isOpen={isQuizOpen} onClose={() => setIsQuizOpen(false)} />
    </>
  )
}