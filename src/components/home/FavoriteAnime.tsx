import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { fetchAnime } from "@/lib/anime";
import { getWatchList } from "@/lib/crunchyroll";
import { WatchlistItem2, WatchListPanel } from "@/types/types";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Heart,
  Play,
  Plus,
  X,
  HeartCrack,
} from "lucide-react";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Card, CardContent } from "../ui/card";
import Link from "next/link";
import { constructAnimeUrl } from "@/lib/url_constructor";
import { Url } from "next/dist/shared/lib/router/router";

interface Anime {
  mal_id: number;
  title: string;
  images: {
    jpg: {
      image_url: string;
    };
  };
}

interface AnimeCardProps {
  anime: Anime;
  index: number;
}

interface ImageWithSkeletonProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
}

export default function FavoriteAnime() {
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [visibleAnimeCount, setVisibleAnimeCount] = useState(6);
  const [showWatchlistModal, setShowWatchlistModal] = useState(false);
  const [watchlist, setWatchlist] = useState<WatchlistItem2[]>([]);
  const [isLoadingWatchlist, setIsLoadingWatchlist] = useState(false);
  const [selectedAnimeIndex, setSelectedAnimeIndex] = useState<number | null>(
    null
  );

  useEffect(() => {
    const getAnimeData = async () => {
      const data = await fetchAnime();
      setAnimeList(data);
    };

    getAnimeData();
  }, []);

  const handleSeeMore = () => {
    setVisibleAnimeCount((prevCount) => prevCount + 6);
  };

  const handleOpenWatchlist = async () => {
    setIsLoadingWatchlist(true);
    try {
      const watchlistData = await getWatchList();
      setWatchlist(watchlistData?.data as WatchlistItem2[]);
    } catch (error) {
      console.error("Error fetching watchlist:", error);
    } finally {
      setIsLoadingWatchlist(false);
      setShowWatchlistModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowWatchlistModal(false);
  };

  return (
    <div className="mt-16 mx-4 lg:mx-8">
      <h2 className="text-4xl font-bold text-center mb-12 text-neutral-900 dark:text-white">
        My Favorite Animes
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {animeList.slice(0, visibleAnimeCount).map((anime, index) => (
          <AnimeCard key={anime.mal_id} anime={anime} index={index} />
        ))}
      </div>

      {visibleAnimeCount < animeList.length && (
        <div className="flex justify-center mt-8">
          <button
            onClick={handleSeeMore}
            className="px-6 py-2 dark:text-black flex items-center text-sm gap-2 font-medium text-neutral-900  bg-[#f8f4f4] cursor-nesw-resize dark:bg-white rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            See More
          </button>
        </div>
      )}

      {/* Watchlist Component */}
      <div className="relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex items-center justify-between p-6 !bg-opacity-[0.98] bg-white dark:bg-neutral-800 rounded-xl shadow-lg mx-auto my-8"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex items-center space-x-6"
          >
            <Image
              src="/crunchyroll_hime.png"
              alt="Crunchyroll Mascot"
              width={100}
              height={100}
              className="rounded-full"
              priority
            />
            <div className="flex flex-col">
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white mb-2"
              >
                My Watchlist
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="text-sm md:text-base text-neutral-600 dark:text-neutral-400 max-w-md"
              >
                Stay up to date with your favorites and discover new anime to
                add to your list anytime.
              </motion.p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleOpenWatchlist}
              className="px-6 py-2 text-sm font-medium text-neutral-900 bg-[#f8f4f4] dark:text-neutral-900 dark:bg-white rounded-lg shadow-md hover:bg-neutral-100 transition-all duration-300"
            >
              Show Watchlist
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Grid Animation */}
        <div className="absolute inset-0 -z-10 h-full w-full">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#f8f4f4_1px,transparent_1px),linear-gradient(to_bottom,#f8f4f4_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#fff_70%,transparent_100%)]">
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0.2 }}
              animate={{ opacity: [0.2, 0.3, 0.2] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </div>

        {/* Watchlist Modal */}
        {showWatchlistModal && (
          <WatchlistModal
            watchlist={watchlist}
            onClose={handleCloseModal}
            isLoading={isLoadingWatchlist}
            selectedAnimeIndex={selectedAnimeIndex}
            setSelectedAnimeIndex={setSelectedAnimeIndex}
          />
        )}
      </div>
    </div>
  );
}

function WatchlistModal({
  watchlist,
  onClose,
  isLoading,
  selectedAnimeIndex,
  setSelectedAnimeIndex,
}: {
  watchlist: WatchlistItem2[];
  onClose: () => void;
  isLoading: boolean;
  selectedAnimeIndex: number | null;
  setSelectedAnimeIndex: (index: number | null) => void;
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleNextImage = () => {
    if (selectedAnimeIndex !== null) {
      const totalImages =
        watchlist[selectedAnimeIndex]?.panel.images.thumbnail[0]?.length || 0;
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % totalImages);
    }
  };

  const handlePrevImage = () => {
    if (selectedAnimeIndex !== null) {
      const totalImages =
        watchlist[selectedAnimeIndex]?.panel.images.thumbnail[0]?.length || 0;
      setCurrentImageIndex(
        (prevIndex) => (prevIndex - 1 + totalImages) % totalImages
      );
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getBestThumbnail = (thumbnails: any[], containerWidth: number) => {
    return thumbnails.reduce((prev, curr) => {
      return Math.abs(curr.width - containerWidth) <
        Math.abs(prev.width - containerWidth)
        ? curr
        : prev;
    });
  };

  const containerWidth = 800;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative bg-white dark:bg-neutral-900 rounded-lg shadow-2xl w-11/12 max-w-5xl p-6 flex flex-col"
        role="dialog"
        aria-labelledby="watchlist-title"
        aria-modal="true"
      >
        <Button
          onClick={onClose}
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
          aria-label="Close Watchlist"
        >
          <X size={24} />
        </Button>

        <h3
          id="watchlist-title"
          className="text-3xl font-bold text-neutral-900 dark:text-white mb-6 text-center"
        >
          My Watchlist
        </h3>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-6">
            <ScrollArea className="w-full lg:w-1/3 h-[calc(100vh-200px)] pr-4">
              <AnimatePresence>
                {watchlist.map((item, index) => (
                  <motion.div
                    key={item.panel.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <div
                      className={`mb-4 cursor-pointer transition-all duration-300 rounded-lg overflow-hidden shadow-md hover:shadow-lg ${
                        selectedAnimeIndex === index
                          ? "ring-2 ring-blue-500 dark:ring-blue-400"
                          : ""
                      }`}
                      onClick={() => {
                        setSelectedAnimeIndex(index);
                        setCurrentImageIndex(0);
                      }}
                    >
                      <div className="relative">
                        <Image
                          src={item.panel.images.thumbnail[0][0].source}
                          alt={item.panel.title}
                          width={320}
                          height={180}
                          className="w-full h-40 object-cover"
                        />
                        <div className="absolute top-2 right-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className={` ${
                              item.is_favorite
                                ? "text-pink-600"
                                : "hidden"
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              // for in future updation of the toggle favorite logic here
                            }}
                          >
                            <Heart
                              size={24}
                              fill={item.is_favorite ? "currentColor" : "none"}
                            />
                          </Button>
                        </div>
                        {item.new && (
                          <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded">
                            NEW
                          </div>
                        )}
                      </div>
                      <div className="p-4 bg-white dark:bg-neutral-800">
                        <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-1 line-clamp-1">
                          {item.panel.episode_metadata.series_title}
                        </h4>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-2 line-clamp-1">
                          {item.panel.episode_metadata.episode_title}
                        </p>
                        <div className="flex justify-between items-center text-xs text-neutral-500 dark:text-neutral-400">
                          <span>
                            Ep {item.panel.episode_metadata.episode_number}
                          </span>
                          <span>
                            {Math.floor(
                              item.panel.episode_metadata.duration_ms / 60000
                            )}{" "}
                            min
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </ScrollArea>

            <div className="w-full lg:w-2/3 flex justify-center items-start">
              <AnimatePresence mode="wait">
                {selectedAnimeIndex !== null && !isLoading ? (
                  <motion.div
                    key={selectedAnimeIndex}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="w-full"
                  >
                    <div className="relative aspect-video mb-4">
                      <Image
                        src={
                          getBestThumbnail(
                            watchlist[selectedAnimeIndex].panel.images
                              .thumbnail[0],
                            containerWidth
                          ).source
                        }
                        alt={watchlist[selectedAnimeIndex].panel.title}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-lg shadow-md"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg"></div>
                      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                        <Link
                          target="_blank"
                          href={
                            constructAnimeUrl(
                              watchlist[selectedAnimeIndex]
                                .panel as WatchListPanel
                            ) as Url
                          }
                        >
                          <Button
                            variant="default"
                            size="sm"
                            className="flex shadow-none items-center space-x-2"
                          >
                            <Play size={16} />
                            <span>Play</span>
                          </Button>
                        </Link>
                        <div className="flex space-x-2">
                          {watchlist[selectedAnimeIndex].is_favorite ? (
                            <Button
                              variant="outline"
                              size="icon"
                              className="text-pink-700 cursor-default border-none"
                            >
                              <Heart fill="currentColor" size={24} />
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="icon"
                              className="text-white shadow-none cursor-default border-none"
                            >
                              <Heart size={24} />
                            </Button>
                          )}
                        </div>
                      </div>
                      <Button
                        onClick={handlePrevImage}
                        variant="ghost"
                        size="icon"
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white"
                        aria-label="Previous Image"
                      >
                        <ChevronLeft size={24} />
                      </Button>
                      <Button
                        onClick={handleNextImage}
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white"
                        aria-label="Next Image"
                      >
                        <ChevronRight size={24} />
                      </Button>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-2xl font-bold text-neutral-900 dark:text-white">
                        {
                          watchlist[selectedAnimeIndex].panel.episode_metadata
                            .series_title
                        }
                      </h4>
                      <p className="text-lg font-semibold text-neutral-700 dark:text-neutral-300">
                        {
                          watchlist[selectedAnimeIndex].panel.episode_metadata
                            .episode_title
                        }
                      </p>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        {watchlist[selectedAnimeIndex].panel.description}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-neutral-500 dark:text-neutral-400">
                        <span>
                          Season{" "}
                          {
                            watchlist[selectedAnimeIndex].panel.episode_metadata
                              .season_number
                          }
                        </span>
                        <span>
                          Episode{" "}
                          {
                            watchlist[selectedAnimeIndex].panel.episode_metadata
                              .episode_number
                          }
                        </span>
                        <span>
                          {formatDate(
                            watchlist[selectedAnimeIndex].panel.episode_metadata
                              .episode_air_date
                          )}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-center h-64 text-neutral-500 dark:text-neutral-400"
                  >
                    Select an anime to view details.
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

function AnimeCard({ anime, index }: AnimeCardProps) {
  const { ref, inView } = useInView({ threshold: 0.2 });
  const controls = useAnimation();

  useEffect(() => {
    if (inView) {
      controls.start({
        x: 0,
        y: 0,
        opacity: 1,
        rotate: [0, 2, -2, 1, 0],
        transition: {
          duration: 1.2,
          type: "spring",
          stiffness: 80,
          bounce: 0.4,
        },
      });
    }
  }, [controls, inView]);

  const initialX = index % 2 === 0 ? "-100%" : "100%";
  const initialY = 50 * (index + 1);

  return (
    <motion.div
      ref={ref}
      className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col"
      initial={{ x: initialX, y: initialY, opacity: 0 }}
      animate={controls}
      whileHover={{ scale: 1.05, rotate: 1 }}
    >
      <ImageWithSkeleton
        src={anime.images.jpg.image_url}
        alt={anime.title}
        width={220}
        height={340}
        priority={false}
      />
    </motion.div>
  );
}

function ImageWithSkeleton({
  src,
  alt,
  width,
  height,
  priority = false,
}: ImageWithSkeletonProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="relative w-full">
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-200 via-neutral-300 to-neutral-200 dark:from-neutral-700 dark:via-neutral-800 dark:to-neutral-700 animate-pulse rounded-t-xl" />
      )}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        onLoadingComplete={() => setIsLoaded(true)}
        className={`object-cover w-full h-[360px] rounded-t-xl transition-opacity duration-500 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        priority={priority}
      />
    </div>
  );
}
