"use client";

import { useState, useEffect, useRef } from "react";
import { Music2, Pause } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Track = {
  name: string;
  artist: string;
  album: string;
  albumArt: string;
  isPlaying: boolean;
} | null;

export default function NowPlaying({ initialTrack }: { initialTrack: Track }) {
  const [track, setTrack] = useState<Track>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const playerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
    setTrack(initialTrack);
  }, [initialTrack]);

  useEffect(() => {
    const fetchTrack = async () => {
      try {
        const response = await fetch("/api/spotify/current-track");
        if (response.ok) {
          const data = await response.json();
          setTrack(data);
        } else {
          console.error("Failed to fetch track:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching track:", error);
      }
    };

    fetchTrack();
    const interval = setInterval(fetchTrack, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      if (window.scrollY + windowHeight >= documentHeight - 10) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        playerRef.current &&
        !playerRef.current.contains(event.target as Node) &&
        isExpanded
      ) {
        setIsExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isExpanded]);

  if (!isMounted) {
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible && track && (
        <motion.div
          ref={playerRef}
          className={`fixed bottom-4 right-4 cursor-pointer overflow-hidden z-50 transition-all duration-300 ease-in-out ${
            isExpanded ? "w-80 h-80" : "w-24 h-24 rounded-full"
          }`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          whileHover={{ scale: isExpanded ? 1 : 1.1 }}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="relative w-full h-full">
            <motion.div
              className="absolute inset-0 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              style={{
                backgroundImage: `url(${track.albumArt})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />

            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full">
              {track.isPlaying ? (
                <Music2 className={`w-8 h-8 text-white ${isExpanded ? 'hidden' : 'block'
                }`} />
              ) : (
                <Pause className="w-8 h-8 text-white" />
              )}
            </div>

            {!isExpanded && (
              <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 100 100"
              >
                <defs>
                  <path
                    id="circle"
                    d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                  />
                </defs>
                <text fontSize="7.5" fill="white">
                  <textPath href="#circle" startOffset="0%">
                    {track.name} • {track.artist} • {track.album} •&nbsp;
                  </textPath>
                </text>
              </svg>
            )}

            {isExpanded && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-primary-foreground text-primary flex flex-col items-center justify-center p-4 rounded-lg"
              >
                <motion.div
                  className="w-full h-full"
                  animate={{
                    scale: [1, 1.05, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                >
                  <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-radial from-primary-foreground to-transparent opacity-50" />
                    <div className="text-center z-10 max-w-full">
                      <p className="font-bold text-lg truncate text-primary max-w-full">
                        {track.name}
                      </p>
                      <p className="text-primary-muted truncate max-w-full">
                        {track.artist}
                      </p>
                      <p className="text-primary-muted truncate text-sm max-w-full">
                        {track.album}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
