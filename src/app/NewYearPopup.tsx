import React from 'react'
import Hls from 'hls.js'

export default function NewYearPopup() {
  const audioRef = React.useRef<HTMLAudioElement>(null)
  const hlsRef = React.useRef<Hls | null>(null)
  const [isOpen, setIsOpen] = React.useState(false)
  const [isPlaying, setIsPlaying] = React.useState(false)

  React.useEffect(() => {
    if (Hls.isSupported() && audioRef.current) {
      hlsRef.current = new Hls()
      hlsRef.current.loadSource('https://music.leoncyriac.me/play/1735667419752')
      hlsRef.current.attachMedia(audioRef.current)
    } else {
      if (audioRef.current) {
        audioRef.current.src = 'https://music.leoncyriac.me/play/1735667419752'
      }
    }
    return () => {
      hlsRef.current?.destroy()
    }
  }, [])

  const handleOpen = () => {
    setIsOpen(true)
    setIsPlaying(true)
    audioRef.current?.play()
  }

  const handleClose = () => {
    setIsOpen(false)
    setIsPlaying(false)
    audioRef.current?.pause()
  }

  return (
    <>
      <button onClick={handleOpen}>Open Popup</button>
      {isOpen && (
        <div className="popup">
          <button onClick={handleClose}>Close Popup</button>
        </div>
      )}
      <audio ref={audioRef} controls={false} style={{ display: 'none' }} />
    </>
  )
}