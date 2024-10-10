import Image from 'next/image'
import { useState } from 'react'

export default function BlurImage({ src, alt }: { src: string; alt: string }) {
  const [isLoading, setLoading] = useState(true)

  return (
    <div className="aspect-w-16 aspect-h-9 relative overflow-hidden rounded-lg">
      <Image
        alt={alt}
        src={src}
        layout="fill"
        objectFit="cover"
        className={`
          duration-700 ease-in-out
          ${isLoading ? 'scale-110 blur-2xl grayscale' : 'scale-100 blur-0 grayscale-0'}
        `}
        onLoadingComplete={() => setLoading(false)}
      />
    </div>
  )
}