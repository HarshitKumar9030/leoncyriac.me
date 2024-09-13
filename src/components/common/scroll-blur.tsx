"use client"

import React, { useState, useEffect, ReactNode } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

interface ProgressiveScrollBlurProps {
  children: ReactNode
  blurHeight?: number
  maxBlur?: number
}

export default function ProgressiveScrollBlur({
  children,
  blurHeight = 100,
  maxBlur = 3
}: ProgressiveScrollBlurProps) {
  const [isPageEnd, setIsPageEnd] = useState(false)
  const { scrollY } = useScroll()

  const blurAmount = useTransform(
    scrollY,
    [0, blurHeight],
    [0, maxBlur]
  )

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      setIsPageEnd(window.scrollY + windowHeight >= documentHeight - 10) // 10px threshold
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Call once to set initial state

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <div className="relative">
      {children}
      <motion.div
        className="fixed left-0 right-0 bottom-0 z-10 pointer-events-none"
        style={{
          height: blurHeight,
          backdropFilter: useTransform(blurAmount, (value) => `blur(${isPageEnd ? 0 : value}px)`),
          WebkitBackdropFilter: useTransform(blurAmount, (value) => `blur(${isPageEnd ? 0 : value}px)`),
          maskImage: 'linear-gradient(to bottom, transparent, black)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, black)',
        }}
      />
    </div>
  )
}