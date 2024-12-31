'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ElegantCountdownProps {
  targetDate: Date
}

export default function ElegantCountdown({ targetDate }: ElegantCountdownProps) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())

  function calculateTimeLeft() {
    const difference = +targetDate - +new Date()
    let timeLeft: { [key: string]: number } = {}

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      }
    }

    return timeLeft
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearTimeout(timer)
  })

  return (
    <div className="flex justify-center items-center">
      {Object.entries(timeLeft).map(([interval, value]) => (
        <motion.div
          key={interval}
          className="flex flex-col items-center mx-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={value}
              className="text-5xl md:text-7xl font-thin"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
            >
              {value}
            </motion.span>
          </AnimatePresence>
          <span className="text-sm md:text-base uppercase tracking-widest mt-2 opacity-70">{interval}</span>
        </motion.div>
      ))}
    </div>
  )
}

