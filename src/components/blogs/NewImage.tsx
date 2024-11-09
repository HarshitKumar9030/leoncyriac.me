import Image from 'next/image'

type NewImageProps = {
  src: string
  alt: string
  caption?: string
  className?: string
}

export function NewImage({ src, alt, caption, className = '' }: NewImageProps) {
  return (
    <figure className={`flex flex-col items-center ${className} my-6`}>
      <div className="relative w-full max-w-4xl aspect-[16/10] overflow-hidden rounded-lg">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover rounded-lg"
          priority
        />
      </div>
      {caption && (
        <figcaption className="mt-3 text-center text-sm text-neutral-600">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}