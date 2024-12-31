'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'
import { X, Sparkles, Volume2, VolumeX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ElegantCountdown from './Countdown'
import ShimmerEffect from './ShimmerEffect'
import GentleSnowfall from './snowfall'
import { getNewYearContent } from '@/lib/content'
import Image from 'next/image'

export default function NewYearPopup() {
  const [isOpen, setIsOpen] = useState(true)
  const [content, setContent] = useState<any>(null)
  const [backgroundMusic, setBackgroundMusic] = useState<HTMLAudioElement | null>(null)
  const [isMuted, setIsMuted] = useState(false)
  const controls = useAnimation()

  const toggleMute = useCallback(() => {
    if (backgroundMusic) {
      backgroundMusic.muted = !backgroundMusic.muted
      setIsMuted(backgroundMusic.muted)
    }
  }, [backgroundMusic])

  useEffect(() => {
    const fetchContent = async () => {
      const data = await getNewYearContent()
      setContent(data)
    }
    fetchContent()

    const audio = new Audio('/perfect.mp3')
    audio.loop = true
    audio.volume = 0.1
    setBackgroundMusic(audio)

    return () => {
      audio.pause()
      audio.src = ''
    }
  }, [])

  useEffect(() => {
    if (isOpen && backgroundMusic) {
      backgroundMusic.play()
    }
    return () => {
      if (backgroundMusic) {
        backgroundMusic.pause()
      }
    }
  }, [isOpen, backgroundMusic])

  useEffect(() => {
    if (content) {
      controls.start({
        opacity: 1,
        y: 0,
        transition: { duration: 1.5, ease: 'easeOut' }
      })
    }
  }, [content, controls])

  if (!isOpen || !content) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-95"
      >
        <GentleSnowfall />
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="relative w-full max-w-4xl bg-gradient-to-b from-gray-900 to-black text-white rounded-2xl overflow-hidden shadow-2xl border border-gray-800"
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-10 transition-colors duration-300"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 left-4 text-white hover:text-gray-300 z-10 transition-colors duration-300"
            onClick={toggleMute}
          >
            {isMuted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
          </Button>

          <div className="relative min-h-[80vh] flex flex-col items-center justify-center p-8 text-center">
            <ShimmerEffect />
            <div className="absolute inset-0 overflow-hidden opacity-10">
            </div>

            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
              className="text-6xl md:text-8xl font-extralight mb-8 tracking-widest relative"
            >
              <span className="absolute -inset-1 bg-white opacity-10 blur rounded-lg"></span>
              <span className="relative">{content.title}</span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5, delay: 1 }}
            >
              <ElegantCountdown targetDate={new Date('2025-01-01T00:00:00')} />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={controls}
              className="mt-12 text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed"
            >
              {content.description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 2.5 }}
              className="mt-16 space-y-4"
            >
              <Button
                onClick={toggleMute}
                className="bg-transparent border border-white text-white hover:bg-white hover:text-black text-sm uppercase tracking-widest py-3 px-8 rounded-full transition-all duration-300 flex items-center space-x-2 group"
              >
                <Sparkles className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                <span>{isMuted ? 'Unmute Ambiance' : 'Mute Ambiance'}</span>
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}