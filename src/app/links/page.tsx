"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ExternalLink,
  Mail,
  Dribbble,
  Youtube,
  Instagram,
  Coffee,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DonationSection } from "@/components/links/Donate";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PulseBeams } from "@/components/ui/PulseBeam";
import { GitHubLogoIcon, TwitterLogoIcon } from "@radix-ui/react-icons";
import SpotifyAbout from "@/components/links/Spotify";

type Link = {
  id: number;
  title: string;
  url: string;
  icon: React.ReactNode;
  color: string;
};

const links: Link[] = [
  {
    id: 1,
    title: "Portfolio",
    url: "https://leoncyriac.me",
    icon: <ExternalLink className="w-5 h-5" />,
    color: "grayscale group-hover:grayscale-0 bg-blue-500",
  },
  {
    id: 2,
    title: "GitHub",
    url: "https://github.com/harshitkumar9030",
    icon: <GitHubLogoIcon className="w-5 h-5" />,
    color: "grayscale group-hover:grayscale-0 bg-gray-800",
  },
  {
    id: 3,
    title: "Twitter",
    url: "https://twitter.com/OhHarshit",
    icon: <TwitterLogoIcon className="w-5 h-5" />,
    color: "grayscale group-hover:grayscale-0 bg-sky-500",
  },
  {
    id: 5,
    title: "Email",
    url: "mailto:harshitkumar9030@gmail.com",
    icon: <Mail className="w-5 h-5" />,
    color: "grayscale group-hover:grayscale-0 bg-red-500",
  },
  {
    id: 6,
    title: "Dribbble",
    url: "https://dribbble.com/leoncyriac",
    icon: <Dribbble className="w-5 h-5" />,
    color: "grayscale group-hover:grayscale-0 bg-pink-500",
  },
  {
    id: 7,
    title: "YouTube",
    url: "https://youtube.com/@leoncyriac",
    icon: <Youtube className="w-5 h-5" />,
    color: "grayscale group-hover:grayscale-0 bg-red-600",
  },
  {
    id: 9,
    title: "Instagram",
    url: "https://instagram.com/_harshit.xd",
    icon: <Instagram className="w-5 h-5" />,
    color: "grayscale group-hover:grayscale-0 bg-pink-600",
  },
  {
    id: 10,
    title: "Buy Me a Coffee",
    url: "https://buymeacoffee.com/harshitkump",
    icon: <Coffee className="w-5 h-5" />,
    color: "grayscale group-hover:grayscale-0 bg-yellow-500",
  },
];

const LinkCard: React.FC<Link> = ({ title, url, icon, color }) => {
  return (
    <motion.div className="w-full mb-2 border backdrop-blur-md rounded-xl border-neutral-300 dark:border-neutral-700 relative overflow-hidden group">
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500"
          initial={{ opacity: 0, x: "-100%" }}
          animate={{ x: "0%" }}
          transition={{ ease: "linear", duration: 1, repeat: Infinity }}
          style={{ opacity: 0.1 }}
        ></motion.div>
      </div>

      <Button
        variant="outline"
        size="lg"
        className="w-full bg-white/80 dark:bg-neutral-800/80 p-4 text-neutral-900 dark:text-white border-none shadow-md hover:shadow-lg transition-all duration-300 rounded-xl h-full  relative z-10"
        onClick={() => window.open(url, "_blank")}
      >
        <span className="flex items-center justify-between w-full">
          <span className="flex items-center">
            <span
              className={`${color} duration-300 transition-all text-neutral-100 p-2 rounded-xl mr-3`}
            >
              {icon}
            </span>
            <span className="font-semibold">{title}</span>
          </span>
          <ExternalLink className="w-4 h-4 text-neutral-500" />
        </span>
      </Button>
    </motion.div>
  );
};

type LinkCardListProps = {
  links: Link[];
};

const LinkCardList: React.FC<LinkCardListProps> = ({ links }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [backgroundStyle, setBackgroundStyle] = useState({
    top: 0,
    height: 0,
    opacity: 0,
  });

  useEffect(() => {
    if (hoveredIndex !== null && containerRef.current) {
      const cardElements = containerRef.current.querySelectorAll(".link-card");
      const hoveredCard = cardElements[hoveredIndex] as HTMLElement;

      if (hoveredCard) {
        const { offsetTop, offsetHeight } = hoveredCard;
        setBackgroundStyle({
          top: offsetTop,
          height: offsetHeight,
          opacity: 1,
        });
      }
    } else {
      setBackgroundStyle((prev) => ({ ...prev, opacity: 0 }));
    }
  }, [hoveredIndex]);

  return (
    <div className="relative w-full" ref={containerRef}>
      <motion.div
        className="absolute left-0 right-0 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-xl pointer-events-none"
        style={{
          top: backgroundStyle.top,
          height: backgroundStyle.height,
          opacity: backgroundStyle.opacity * 0.1,
        }}
        animate={{
          top: backgroundStyle.top,
          height: backgroundStyle.height,
          opacity: backgroundStyle.opacity * 0.1,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      ></motion.div>

      {links.map((link, index) => (
        <div
          key={link.id}
          className="link-card"
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <LinkCard {...link} />
        </div>
      ))}
    </div>
  );
};

export default function LinksPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };

    window.addEventListener("mousemove", updateMousePosition);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
    };
  }, []);
  return (
    <div className="min-h-screen flex items-center z-0 justify-center px-4 py-16 ">
      <div className="container mx-auto max-w-4xl z-10">
        <motion.div
          ref={cardRef}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative w-full mx-auto max-w-md rounded-xl overflow-hidden"
          whileHover="hover"
        >
          <motion.div
            className="absolute inset-0 z-0 bg-transparent opacity-0 transition-opacity duration-300"
            variants={{
              hover: { opacity: 1 },
            }}
          />
          <motion.div
            className="absolute inset-0 z-10 rounded-xl"
            style={{
              background: `radial-gradient(circle 120px at ${mousePosition.x}px ${mousePosition.y}px, #bf2727c9 0%, rgba(0,0,0,0.9) 100%)`,
              mixBlendMode: "overlay",
            }}
          />
          <motion.div
            className="relative z-20 text-center p-8 rounded-xl backdrop-blur-sm dark:backdrop-blur-md bg-white/90 dark:bg-neutral-800/80 shadow-xl"
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                delay: 0.2,
                type: "spring",
                stiffness: 260,
                damping: 20,
              }}
            >
              <Avatar className="w-32 h-32 mx-auto mb-6 border-4 border-neutral-200 dark:border-neutral-700">
                <AvatarImage src="/pfp.jpg" alt="Harshit" />
                <AvatarFallback>HT</AvatarFallback>
              </Avatar>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl font-bold mb-2 text-neutral-900 dark:text-white"
            >
              Harshit
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl mb-4 text-neutral-600 dark:text-neutral-400"
            >
              Full Stack Developer
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-sm mb-6 text-neutral-500 dark:text-neutral-500"
            >
              Passionate about creating seamless web experiences with
              cutting-edge technologies. Specializing in React, Node.js, and
              cloud architecture.
            </motion.p>
          </motion.div>
        </motion.div>

        <AnimatePresence>
          <div className="container mx-auto max-w-4xl z-10 mt-8">
            <LinkCardList links={links} />
          </div>
        </AnimatePresence>
        <SpotifyAbout />
        <DonationSection />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center text-neutral-600 dark:text-neutral-400"
        >
          Thank you for your support! Feel free to connect with me on any of
          these platforms.
        </motion.p>
      </div>
    </div>
  );
}
