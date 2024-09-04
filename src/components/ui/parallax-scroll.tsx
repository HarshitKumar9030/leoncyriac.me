"use client";
import { useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";

export const ParallaxScroll = ({
  landscapeImages,
  portraitImages,
  className,
}: {
  landscapeImages: string[];
  portraitImages: string[];
  className?: string;
}) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    container: gridRef,
  });

  // Enhanced Parallax Transform
  const translateLandscape = useTransform(scrollYProgress, [0, 1], [0, -250]);
  const translatePortrait = useTransform(scrollYProgress, [0, 1], [0, 250]);

  return (
    <div
      className={cn(
        "h-[30rem] hide-scrollbar overflow-y-scroll w-full",
        className
      )}
      ref={gridRef}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 items-start max-w-5xl mx-auto gap-10 py-24 px-5 sm:px-10">
        {/* Landscape Grid */}
        <div className="grid gap-10">
          {landscapeImages.map((el, idx) => (
            <motion.div
              style={{ y: translateLandscape }}
              key={"landscape-" + idx}
              className="relative"
            >
              <ImageWithSkeleton
                src={el}
                className="h-[280px] w-full object-cover object-center rounded-lg"
                alt="landscape"
              />
            </motion.div>
          ))}
        </div>

        {/* Portrait Grid */}
        <div className="grid gap-10">
          {portraitImages.map((el, idx) => (
            <motion.div
              style={{ y: translatePortrait }}
              key={"portrait-" + idx}
              className="relative"
            >
              <ImageWithSkeleton
                src={el}
                className="h-[280px] w-[75%] object-cover object-center rounded-lg mx-auto"
                alt="portrait"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

function ImageWithSkeleton({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="relative">
      {!isLoaded && <SkeletonLoader />}
      <Image
        src={src}
        alt={alt}
        className={cn(
          `object-cover w-full h-full rounded-lg transition-opacity duration-500`,
          className,
          isLoaded ? "opacity-100" : "opacity-0"
        )}
        width={800}
        height={400}
        onLoadingComplete={() => setIsLoaded(true)}
      />
    </div>
  );
}

function SkeletonLoader() {
  return (
    <div className="relative w-full h-full rounded-lg bg-neutral-200 dark:bg-neutral-700 animate-pulse aspect-w-16 aspect-h-9">
      <div className="absolute inset-0 bg-gradient-to-r from-neutral-200 via-neutral-300 to-neutral-200 dark:from-neutral-700 dark:via-neutral-800 dark:to-neutral-700 bg-[length:200%_100%] animate-[shimmer_1.5s_infinite] rounded-lg"></div>
    </div>
  );
}
