import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Briefcase } from "lucide-react";

export default function MyWork() {
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <section className="py-16 px-4 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        <div className="relative">
          <div className="relative !max-w-3xl mx-auto mb-20 overflow-hidden">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center md:items-start relative z-10"
            >
              <motion.div
                className="flex items-center mb-4"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <Briefcase className="w-8 h-8 mr-2 text-neutral-700 dark:text-neutral-100" />
                <h2 className="text-sm font-medium text-neutral-700 dark:text-neutral-100 uppercase tracking-wide">
                  Project Showcase
                </h2>
              </motion.div>
              <motion.h1
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-center md:text-left text-neutral-900 dark:text-neutral-200 mb-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                My Work
              </motion.h1>
              <motion.p
                className="text-base md:text-lg text-neutral-600 dark:text-neutral-400 text-center md:text-left max-w-2xl"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                Explore a collection of my projects, showcasing my skills and
                ideas!
              </motion.p>
            </motion.div>

          </div>
          <motion.div
            className="absolute z-30 hidden md:block md:-top-12 md:left-24 left-[26px] w-64 h-64 dark:bg-neutral-100/5 bg-neutral-800/5 rounded-full"
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 90, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-8 gap-6">
          {/* Left Column */}
          <motion.div
            className="flex flex-col col-span-1 lg:col-span-5 gap-y-6"
            style={{ y: y1 }}
          >
            {projectListLeft.map((project, index) => (
              <ProjectCard key={index} {...project} index={index} />
            ))}
          </motion.div>

          {/* Right Column */}
          <motion.div
            className="hidden lg:flex flex-col col-span-3 gap-y-6"
            style={{ y: y2 }}
          >
            {projectListRight.map((project, index) => (
              <ProjectCard key={index} {...project} index={index} />
            ))}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

const projectListLeft = [
  {
    href: "https://zesty-merch.vercel.app",
    src: "/zesty.png",
    alt: "Zesty Merch",
    name: "Zesty Merch",
  },
  {
    href: "https://www.pearlearn.live/",
    src: "/peerlearn.png",
    alt: "Peerlearn",
    name: "Peerlearn",
  },
  {
    href: "https://www.pybrowser.vercel.app/",
    src: "/pybrowser.png",
    alt: "PyBrowser",
    name: "PyBrowser",
  },
];

const projectListRight = [
  {
    href: "/writings/managing-life-as-student",
    src: "/blog.jpg",
    alt: "managing-life-as-student",
    name: "Life as a Student",
    isVertical: true,
  },
  {
    href: "https://github.com/HarshitKumar9030/anime_recommendation_model",
    src: "/anime.jpg",
    alt: "Anime Recommendation Model",
    name: "Anime Recommendation AI",
    isVertical: true,
  },
  {
    href: "https://github.com/HarshitKumar9030/python-web-crawler",
    src: "/output.jpg",
    alt: "Python Web Crawler",
    name: "Sophisticated Web Crawler",
  },
];

interface ProjectCardProps {
  href: string;
  src: string;
  alt: string;
  name: string;
  isVertical?: boolean;
  index: number;
}

function ProjectCard({
  href,
  src,
  alt,
  name,
  isVertical = false,
  index,
}: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={href} passHref>
        <motion.div
          className="relative group cursor-pointer overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.3 }}
        >
          <Image
            className="rounded-xl object-cover group-hover:opacity-90 transition-opacity duration-200"
            src={src}
            alt={alt}
            width={isVertical ? 360 : 1600}
            height={isVertical ? 493 : 900}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={index < 3}
            style={{
              width: "100%",
              height: isVertical ? "auto" : "400px",
              objectFit: "cover",
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <p className="text-xl font-semibold text-white">{name}</p>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}
