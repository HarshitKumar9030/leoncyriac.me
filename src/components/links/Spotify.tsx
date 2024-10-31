"use client";

import { useState, useEffect, useCallback } from "react";
import { Music2, Pause, Play, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Track = {
  name: string;
  artist: string;
  album: string;
  albumArt: string;
  isPlaying: boolean;
  duration: number;
  progress: number;
  status?: "playing" | "not_playing";
};

type LastPlayed = {
  name: string;
  artist: string;
  album: string;
  albumArt: string;
  playedAt: string;
};

type LiveTrackInfo = {
  currentTrack: Track | null;
  lastPlayed: LastPlayed | null;
};

function TrackSkeleton() {
  return (
    <div className="flex items-center space-x-4 animate-pulse">
      <div className="w-16 h-16 bg-neutral-300 dark:bg-neutral-700 rounded-md"></div>
      <div className="flex-grow">
        <div className="h-4 bg-neutral-300 dark:bg-neutral-700 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-neutral-300 dark:bg-neutral-700 rounded w-1/2"></div>
      </div>
    </div>
  );
}

function TrackDisplay({
  track,
  isCurrentTrack,
}: {
  track: Track | LastPlayed;
  isCurrentTrack: boolean;
}) {
  const progressPercentage =
    isCurrentTrack && "progress" in track
      ? (track.progress / track.duration) * 100
      : 0;

  return (
    <motion.div
      className="flex items-center border-neutral-300 dark:border-neutral-700 space-x-4 p-4 bg-white dark:bg-neutral-800 rounded-lg border transition-shadow duration-300 ease-in-out"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative w-16 h-16 flex-shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={track.albumArt}
          alt={`${track.album}`}
          className="w-full h-full object-cover rounded-md shadow-sm transition-transform duration-300 ease-in-out hover:scale-105"
        />
        <AnimatePresence>
          {isCurrentTrack && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-md"
            >
              {"isPlaying" in track ? (
                track.isPlaying ? (
                  <Pause className="w-6 h-6 text-white" />
                ) : (
                  <Play className="w-6 h-6 text-white" />
                )
              ) : (
                <Clock className="w-6 h-6 text-white" />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="flex-grow min-w-0">
        <p className="font-semibold text-neutral-900 dark:text-neutral-100 text-base truncate">
          {track.name || "Not Playing"}
        </p>
        <p className="text-sm text-neutral-600 dark:text-neutral-300 truncate">
          {track.artist || "No artist"}
        </p>
        {isCurrentTrack && "progress" in track && track.status !== "not_playing" && (
          <div className="mt-2 relative h-1.5 bg-neutral-300 dark:bg-neutral-600 rounded-full overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 h-full bg-green-500 dark:bg-green-400"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        )}
        {!isCurrentTrack && "playedAt" in track && (
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Last played: {new Date(track.playedAt).toLocaleTimeString()}
          </p>
        )}
      </div>
    </motion.div>
  );
}

export default function NowPlaying() {
  const [liveTrackInfo, setLiveTrackInfo] = useState<LiveTrackInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLiveTrackInfo = useCallback(async () => {
    try {
      const response = await fetch("/api/spotify/live-track");
      if (response.ok) {
        const data: LiveTrackInfo = await response.json();
        setLiveTrackInfo(data);
      } else {
        console.error("Failed to fetch live track info:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching live track info:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLiveTrackInfo();
    const fetchInterval = setInterval(fetchLiveTrackInfo, 5000);
    return () => clearInterval(fetchInterval);
  }, [fetchLiveTrackInfo]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 border rounded-2xl dark:border-neutral-800 border-neutral-300 mt-16 shadow-xl max-w-md w-full mx-auto space-y-6"
    >
      <h2 className="text-xl font-bold mb-4 text-neutral-900 dark:text-neutral-100">
        Music 🎶
      </h2>
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-semibold mb-2 text-neutral-700 dark:text-neutral-300">
            Currently Playing
          </h3>
          {isLoading ? (
            <TrackSkeleton />
          ) : liveTrackInfo?.currentTrack ? (
            <TrackDisplay
              track={liveTrackInfo.currentTrack}
              isCurrentTrack={true}
            />
          ) : (
            <TrackDisplay
              track={{
                name: "",
                artist: "",
                album: "",
                albumArt: "",
                isPlaying: false,
                duration: 0,
                progress: 0,
                status: "not_playing"
              }}
              isCurrentTrack={true}
            />
          )}
        </div>
        <div>
          <h3 className="text-sm font-semibold mb-2 text-neutral-700 dark:text-neutral-300">
            Last Played
          </h3>
          {isLoading ? (
            <TrackSkeleton />
          ) : liveTrackInfo?.lastPlayed ? (
            <TrackDisplay
              track={liveTrackInfo.lastPlayed}
              isCurrentTrack={false}
            />
          ) : (
            <p className="text-sm text-neutral-600 border border-neutral-300 dark:border-neutral-700 dark:text-neutral-400 p-4 bg-white dark:bg-neutral-800 rounded-lg shadow-md">
              No recent tracks
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}