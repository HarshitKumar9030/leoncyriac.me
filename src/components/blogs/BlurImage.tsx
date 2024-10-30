"use client";
import Image from 'next/image'
import { useState } from 'react'

interface BlurImageProps {
  src: string
  alt: string
  width: number
  height: number
}

export default function BlurImage({ src, alt, width, height }: BlurImageProps) {
  const [isLoading, setLoading] = useState(true)

  return (
    <div className="aspect-w-16 aspect-h-9 relative overflow-hidden rounded-lg">
      <Image
        alt={alt}
        src={src}
        fill={true}
        quality={100}
        className={`
          duration-700 ease-in-out
          ${isLoading 
            ? 'scale-110 blur-2xl grayscale' 
            : 'scale-100 blur-0 grayscale-0'}
        `}
        onLoadingComplete={() => setLoading(false)}
        style={{ objectFit: 'cover' }}
      />
    </div>
  )
}