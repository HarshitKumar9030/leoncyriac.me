
// @ts-nocheck

'use client'

import React, { useRef, useEffect } from 'react'

const SnowfallEffect: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const snowflakes: { x: number; y: number; radius: number; speed: number }[] = []

    for (let i = 0; i < 100; i++) {
      snowflakes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 4 + 1,
        speed: Math.random() * 3 + 1
      })
    }

    function drawSnowflakes() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
      ctx.beginPath()
      for (let i = 0; i < snowflakes.length; i++) {
        const sf = snowflakes[i]
        ctx.moveTo(sf.x, sf.y)
        ctx.arc(sf.x, sf.y, sf.radius, 0, Math.PI * 2, true)
      }
      ctx.fill()
      moveSnowflakes()
    }

    function moveSnowflakes() {
      for (let i = 0; i < snowflakes.length; i++) {
        const sf = snowflakes[i]
        sf.y += sf.speed
        if (sf.y > canvas.height) {
          sf.y = 0
        }
      }
    }

    function animateSnowfall() {
      drawSnowflakes()
      requestAnimationFrame(animateSnowfall)
    }

    animateSnowfall()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-50" />
}

export default SnowfallEffect

