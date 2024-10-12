"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Play,
  Pause,
  Music,
  ChevronLeft,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Share2,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import Hls from "hls.js";
import { useTheme } from "next-themes";
import { IconBrandSpotify } from "@tabler/icons-react";

type Song = {
  _id: string;
  title: string;
  artist: string;
  albumArt: string;
  audioUrl: string;
};

export default function MusicWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [songOfTheWeek, setSongOfTheWeek] = useState<Song | null>(null);
  const [favorites, setFavorites] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isSongLoading, setIsSongLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [weekResponse, favoritesResponse] = await Promise.all([
          fetch("/api/song-of-week"),
          fetch("/api/favorites"),
        ]);
        const weekData = await weekResponse.json();
        const favoritesData = await favoritesResponse.json();
        setSongOfTheWeek(weekData);
        setFavorites(favoritesData);
      } catch (error) {
        console.error("Error fetching music data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Set up HLS when currentSong changes
  useEffect(() => {
    if (currentSong && audioRef.current) {
      setIsSongLoading(true);
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }

      if (Hls.isSupported()) {
        const hls = new Hls();
        hlsRef.current = hls;
        hls.loadSource(currentSong.audioUrl);
        hls.attachMedia(audioRef.current);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          setIsSongLoading(false);
          if (isPlaying) {
            audioRef.current?.play();
          }
        });
        hls.on(Hls.Events.ERROR, (event, data) => {
          console.error("HLS error:", data);
          setIsSongLoading(false);
        });
      } else if (
        audioRef.current.canPlayType("application/vnd.apple.mpegurl")
      ) {
        audioRef.current.src = currentSong.audioUrl;
        audioRef.current.addEventListener("loadedmetadata", () => {
          setIsSongLoading(false);
          if (isPlaying) {
            audioRef.current?.play();
          }
        });
      } else {
        console.error("This browser does not support HLS.");
        setIsSongLoading(false);
      }
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, [currentSong]);

  // Handle play/pause when isPlaying changes
  useEffect(() => {
    if (audioRef.current && !isSongLoading) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, isSongLoading]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = (song: Song) => {
    if (currentSong && currentSong._id === song._id) {
      if (
        !isPlaying &&
        audioRef.current?.paused &&
        audioRef.current?.currentTime > 0
      ) {
        setIsPlaying(true);
      } else {
        setIsPlaying(!isPlaying);
      }
    } else {
      setCurrentSong(song);
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (newTime: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const shareOnTwitter = useCallback((song: Song) => {
    const tweetText = `Listening to "${song.title}" by ${song.artist}`;
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      tweetText
    )}&url=${encodeURIComponent(song.albumArt)}`;
    window.open(tweetUrl, "_blank");
  }, []);

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          key="music-widget"
          initial={{ x: "-100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "-100%", opacity: 0 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
          className="fixed top-4 left-4 rounded-xl w-80 h-auto overflow-hidden cursor-pointer"
          style={{ zIndex: 1000 }}
        >
          <motion.div
            layout
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Card
              className={`w-full h-full shadow-lg transition-colors duration-300 border-none ${
                theme === "dark"
                  ? "bg-zinc-800 text-white"
                  : "bg-zinc-100 text-zinc-900"
              }`}
            >
              <CardContent className="p-4">
                <motion.div
                  className="flex items-center justify-between mb-4"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="flex items-center">
                    <Music className="w-5 h-5 mr-2" />
                    <h2 className="text-sm font-semibold">Song of the Week</h2>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsOpen(false);
                    }}
                    aria-label="Close Music Widget"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                </motion.div>
                {loading || !songOfTheWeek ? (
                  <SongOfTheWeekSkeleton />
                ) : (
                  <SongOfTheWeek
                    song={songOfTheWeek}
                    isPlaying={
                      isPlaying && currentSong?._id === songOfTheWeek._id
                    }
                    isSongLoading={
                      isSongLoading && currentSong?._id === songOfTheWeek._id
                    }
                    onTogglePlay={togglePlay}
                    onShare={shareOnTwitter}
                  />
                )}

                <motion.div
                  className="mt-6 mb-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h2 className="text-sm font-semibold mb-2">
                    Some of my favorites
                  </h2>
                  {loading || favorites.length === 0 ? (
                    <FavoritesSkeleton />
                  ) : (
                    <Carousel className="w-full">
                      <CarouselContent>
                        {favorites.map((song, index) => (
                          <CarouselItem key={song._id} className="basis-1/3">
                            <FavoriteSong
                              song={song}
                              isPlaying={
                                isPlaying && currentSong?._id === song._id
                              }
                              isSongLoading={
                                isSongLoading && currentSong?._id === song._id
                              }
                              onTogglePlay={togglePlay}
                              onShare={shareOnTwitter}
                              index={index}
                            />
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious />
                      <CarouselNext />
                    </Carousel>
                  )}
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-4"
                >
                  <Slider
                    value={[currentTime]}
                    max={duration || 0}
                    step={1}
                    onValueChange={(value) => handleSeek(value[0])}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs mt-1">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => console.log("Previous song")}
                      aria-label="Previous Song"
                    >
                      <SkipBack className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => currentSong && togglePlay(currentSong)}
                      aria-label={isPlaying ? "Pause" : "Play"}
                    >
                      {isSongLoading ? (
                        <Loader2 className="h-6 w-6 animate-spin" />
                      ) : isPlaying ? (
                        <Pause className="h-6 w-6" />
                      ) : (
                        <Play className="h-6 w-6" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => console.log("Next song")}
                      aria-label="Next Song"
                    >
                      <SkipForward className="h-4 w-4" />
                    </Button>
                    <div className="flex items-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setVolume(volume === 0 ? 1 : 0)}
                        aria-label={volume === 0 ? "Unmute" : "Mute"}
                      >
                        {volume === 0 ? (
                          <VolumeX className="h-4 w-4" />
                        ) : (
                          <Volume2 className="h-4 w-4" />
                        )}
                      </Button>
                      <Slider
                        value={[volume]}
                        max={1}
                        step={0.1}
                        onValueChange={(value) => setVolume(value[0])}
                        className="w-20"
                      />
                    </div>
                  </div>
                </motion.div>
                <div className="w-full h-[2px] bg-zinc-400 dark:bg-zinc-700 rounded mt-4"></div>
                <div className="mt-4 flex justify-center">
                  <a
                    href="https://www.spotify.com"
                    className="flex mt-0.5 font-medium justify-center items-center grayscale hover:grayscale-0 duration-300 ease-in-out gap-1 text-xs text-neutral-500"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg
                        className="h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 496 512"
                    >
                      <path
                        fill="#1ed760"
                        d="M248 8C111.1 8 0 119.1 0 256s111.1 248 248 248 248-111.1 248-248S384.9 8 248 8Z"
                      />
                      <path d="M406.6 231.1c-5.2 0-8.4-1.3-12.9-3.9-71.2-42.5-198.5-52.7-280.9-29.7-3.6 1-8.1 2.6-12.9 2.6-13.2 0-23.3-10.3-23.3-23.6 0-13.6 8.4-21.3 17.4-23.9 35.2-10.3 74.6-15.2 117.5-15.2 73 0 149.5 15.2 205.4 47.8 7.8 4.5 12.9 10.7 12.9 22.6 0 13.6-11 23.3-23.2 23.3zm-31 76.2c-5.2 0-8.7-2.3-12.3-4.2-62.5-37-155.7-51.9-238.6-29.4-4.8 1.3-7.4 2.6-11.9 2.6-10.7 0-19.4-8.7-19.4-19.4s5.2-17.8 15.5-20.7c27.8-7.8 56.2-13.6 97.8-13.6 64.9 0 127.6 16.1 177 45.5 8.1 4.8 11.3 11 11.3 19.7-.1 10.8-8.5 19.5-19.4 19.5zm-26.9 65.6c-4.2 0-6.8-1.3-10.7-3.6-62.4-37.6-135-39.2-206.7-24.5-3.9 1-9 2.6-11.9 2.6-9.7 0-15.8-7.7-15.8-15.8 0-10.3 6.1-15.2 13.6-16.8 81.9-18.1 165.6-16.5 237 26.2 6.1 3.9 9.7 7.4 9.7 16.5s-7.1 15.4-15.2 15.4z" />
                    </svg>
                    Powered by Spotify
                  </a>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          key="music-widget-button"
          initial={{ x: "-100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "-100%", opacity: 0 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
          onClick={() => setIsOpen(true)}
          className="fixed top-4 left-0 w-8 rounded-r-lg h-24 sm:w-10 sm:h-32 overflow-hidden cursor-pointer"
          style={{ zIndex: 1000 }}
        >
          <div
            className={`w-full h-full rounded-r-lg flex items-center justify-center shadow-lg transition-colors duration-200 ${
              theme === "dark"
                ? "bg-zinc-800 hover:bg-zinc-700"
                : "bg-zinc-100 hover:bg-zinc-200"
            }`}
          >
            <Music
              className={`w-4 h-4 sm:w-5 sm:h-5 ${
                theme === "dark" ? "text-white" : "text-zinc-900"
              }`}
            />
          </div>
        </motion.div>
      )}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
      />
    </AnimatePresence>
  );
}

function SongOfTheWeek({
  song,
  isPlaying,
  isSongLoading,
  onTogglePlay,
  onShare,
}: {
  song: Song;
  isPlaying: boolean;
  isSongLoading: boolean;
  onTogglePlay: (song: Song) => void;
  onShare: (song: Song) => void;
}) {
  return (
    <motion.div
      className="flex items-center space-x-4"
      whileHover={{ scale: 1.02 }}
    >
      <ShimmerImage
        src={song.albumArt}
        alt={song.title}
        width={64}
        height={64}
        className="rounded-full"
      />
      <div className="flex-grow">
        <p className="font-medium text-sm truncate">{song.title}</p>
        <p className="text-xs opacity-70 truncate">{song.artist}</p>
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onTogglePlay(song);
          }}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isSongLoading ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : isPlaying ? (
            <Pause className="h-6 w-6" />
          ) : (
            <Play className="h-6 w-6" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onShare(song);
          }}
          aria-label="Share on Twitter"
        >
          <Share2 className="h-5 w-5" />
        </Button>
      </div>
    </motion.div>
  );
}

function FavoriteSong({
  song,
  isPlaying,
  isSongLoading,
  onTogglePlay,
  onShare,
  index,
}: {
  song: Song;
  isPlaying: boolean;
  isSongLoading: boolean;
  onTogglePlay: (song: Song) => void;
  onShare: (song: Song) => void;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index, duration: 0.2 }}
      whileTap={{ scale: 0.95 }}
      className="aspect-square relative overflow-hidden rounded-lg cursor-pointer"
      onClick={(e) => {
        e.stopPropagation();
        onTogglePlay(song);
      }}
    >
      <Image
        src={song.albumArt}
        alt={song.title}
        layout="fill"
        objectFit="cover"
      />
      {isSongLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <Loader2 className="h-8 w-8 text-white animate-spin" />
        </div>
      )}
      {isPlaying && !isSongLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        >
          <Pause className="h-8 w-8 text-white" />
        </motion.div>
      )}
      {/* Moved Share Button outside the image */}
      <div className="mt-2 flex items-center justify-between">
        <p className="text-xs font-medium truncate">{song.title}</p>
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onShare(song);
          }}
          aria-label="Share on Twitter"
        >
          <Share2 className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
}

function ShimmerImage({
  src,
  alt,
  ...props
}: { src: string; alt: string } & React.ComponentProps<typeof Image>) {
  const { theme } = useTheme();
  return (
    <div className="relative overflow-hidden">
      <Image src={src} alt={alt} {...props} />
      <motion.div
        className={`absolute inset-0 bg-gradient-to-r ${
          theme === "dark"
            ? "from-transparent via-zinc-300 to-transparent"
            : "from-transparent via-white to-transparent"
        }`}
        initial={{ x: "-100%" }}
        animate={{ x: "100%" }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
        style={{ opacity: theme === "dark" ? 0.1 : 0.2 }}
      />
    </div>
  );
}

function SongOfTheWeekSkeleton() {
  const { theme } = useTheme();
  return (
    <div className="flex items-center space-x-4">
      <Skeleton
        className={`h-16 w-16 rounded-full ${
          theme === "dark" ? "bg-zinc-700" : "bg-zinc-300"
        }`}
      />
      <div className="space-y-2 flex-grow">
        <Skeleton
          className={`h-4 w-3/4 ${
            theme === "dark" ? "bg-zinc-700" : "bg-zinc-300"
          }`}
        />
        <Skeleton
          className={`h-3 w-1/2 ${
            theme === "dark" ? "bg-zinc-700" : "bg-zinc-300"
          }`}
        />
      </div>
      <Skeleton
        className={`h-10 w-10 rounded-full ${
          theme === "dark" ? "bg-zinc-700" : "bg-zinc-300"
        }`}
      />
    </div>
  );
}

function FavoritesSkeleton() {
  const { theme } = useTheme();
  return (
    <div className="flex space-x-2">
      {[...Array(3)].map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 * index, duration: 0.2 }}
          className="w-1/3"
        >
          <Skeleton
            className={`aspect-square rounded-lg ${
              theme === "dark" ? "bg-zinc-700" : "bg-zinc-300"
            }`}
          />
        </motion.div>
      ))}
    </div>
  );
}
