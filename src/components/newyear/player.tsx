'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, X } from 'lucide-react'
import Image from 'next/image'
import Hls from 'hls.js'
import { Song } from '@/lib/content'

interface ElegantMusicPlayerProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  playlist: Song[]
}

export default function ElegantMusicPlayer({ isOpen, setIsOpen, playlist }: ElegantMusicPlayerProps) {
  const [currentSongIndex, setCurrentSongIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(1)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [showPlaylist, setShowPlaylist] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const hlsRef = useRef<Hls | null>(null)

  useEffect(() => {
    if (playlist[currentSongIndex] && audioRef.current) {
      if (hlsRef.current) {
        hlsRef.current.destroy()
      }

      if (Hls.isSupported()) {
        const hls = new Hls()
        hlsRef.current = hls
        hls.loadSource(playlist[currentSongIndex].audioUrl)
        hls.attachMedia(audioRef.current)
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          if (isPlaying) {
            audioRef.current?.play()
          }
        })
      } else if (audioRef.current.canPlayType('application/vnd.apple.mpegurl')) {
        audioRef.current.src = playlist[currentSongIndex].audioUrl
      }
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy()
      }
    }
  }, [playlist, currentSongIndex, isPlaying])

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play()
      } else {
        audioRef.current.pause()
      }
    }
  }, [isPlaying])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  const togglePlay = () => setIsPlaying(!isPlaying)

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
      setDuration(audioRef.current.duration)
    }
  }

  const handleSeek = (newTime: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = newTime
      setCurrentTime(newTime)
    }
  }

  const handlePrevious = () => {
    setCurrentSongIndex((prevIndex) => (prevIndex === 0 ? playlist.length - 1 : prevIndex - 1))
  }

  const handleNext = () => {
    setCurrentSongIndex((prevIndex) => (prevIndex === playlist.length - 1 ? 0 : prevIndex + 1))
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-4 left-4 right-4 z-50 max-w-md mx-auto"
        >
          <Card className="bg-gradient-to-br from-gray-900 to-black text-white border border-gray-800 rounded-xl shadow-2xl overflow-hidden">
            <CardContent className="p-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center justify-between mb-6"
              >
                <h2 className="text-2xl font-light">Now Playing</h2>
                <Button variant="ghost" onClick={() => setIsOpen(false)} className="text-white hover:text-gray-300">
                  <X className="h-6 w-6" />
                </Button>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center space-x-6 mb-6"
              >
                <div className="relative w-24 h-24 rounded-lg overflow-hidden">
                  <Image
                    src={playlist[currentSongIndex].albumArt}
                    alt={playlist[currentSongIndex].title}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-xl mb-1 truncate">{playlist[currentSongIndex].title}</p>
                  <p className="text-sm text-gray-400 truncate">{playlist[currentSongIndex].artist}</p>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mb-4"
              >
                <Slider
                  value={[currentTime]}
                  max={duration}
                  step={1}
                  onValueChange={(value) => handleSeek(value[0])}
                  className="w-full mb-2"
                />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="flex items-center justify-between"
              >
                <Button variant="ghost" size="icon" onClick={handlePrevious} className="text-white hover:text-gray-300">
                  <SkipBack className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={togglePlay}
                  className="text-white hover:text-gray-300 bg-white bg-opacity-10 rounded-full p-3 transform transition-transform duration-200 hover:scale-110"
                >
                  {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
                </Button>
                <Button variant="ghost" size="icon" onClick={handleNext} className="text-white hover:text-gray-300">
                  <SkipForward className="h-5 w-5" />
                </Button>
                <div className="flex items-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setVolume(volume === 0 ? 1 : 0)}
                    className="text-white hover:text-gray-300"
                  >
                    {volume === 0 ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                  </Button>
                  <Slider
                    value={[volume]}
                    max={1}
                    step={0.1}
                    onValueChange={(value) => setVolume(value[0])}
                    className="w-20"
                  />
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: showPlaylist ? 1 : 0, height: showPlaylist ? 'auto' : 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 overflow-hidden"
              >
                <h3 className="text-lg font-semibold mb-2">Playlist</h3>
                <ul className="space-y-2">
                  {playlist.map((song, index) => (
                    <li
                      key={index}
                      className={`flex items-center space-x-2 p-2 rounded-md cursor-pointer ${
                        index === currentSongIndex ? 'bg-white bg-opacity-10' : 'hover:bg-white hover:bg-opacity-5'
                      }`}
                      onClick={() => {
                        setCurrentSongIndex(index)
                        setIsPlaying(true)
                      }}
                    >
                      <div className="w-8 h-8 relative rounded overflow-hidden">
                        <Image src={song.albumArt} alt={song.title} layout="fill" objectFit="cover" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium truncate">{song.title}</p>
                        <p className="text-xs text-gray-400 truncate">{song.artist}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </motion.div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPlaylist(!showPlaylist)}
                className="text-white hover:text-gray-300 mt-4 w-full"
              >
                {showPlaylist ? 'Hide Playlist' : 'Show Playlist'}
              </Button>
            </CardContent>
          </Card>
          <audio
            ref={audioRef}
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleNext}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

