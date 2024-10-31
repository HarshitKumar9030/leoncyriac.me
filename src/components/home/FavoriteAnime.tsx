import React, { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { fetchAnime } from "@/lib/anime";
import { getWatchList } from "@/lib/crunchyroll";
import { WatchlistItem2, WatchListPanel } from "@/types/types";
import { ChevronLeft, ChevronRight, Heart, Play, Tv, X } from "lucide-react";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import Link from "next/link";
import { constructAnimeUrl } from "@/lib/url_constructor";
import { Url } from "next/dist/shared/lib/router/router";
import { AnimeHeading } from "./anime-heading";

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
  const [visibleAnimeCount, setVisibleAnimeCount] = useState(3); // set the visible anime count here.
  const [showWatchlistModal, setShowWatchlistModal] = useState(false);
  const [watchlist, setWatchlist] = useState<WatchlistItem2[]>([]);
  const [isLoadingWatchlist, setIsLoadingWatchlist] = useState(false);
  const [selectedAnimeIndex, setSelectedAnimeIndex] = useState<number | null>(
    null
  );
  const [isLoadingAnime, setIsLoadingAnime] = useState(true);

  useEffect(() => {
    const getAnimeData = async () => {
      setIsLoadingAnime(true);
      try {
        const data = await fetchAnime();
        setAnimeList(data);
      } catch (error) {
        console.error("Error fetching anime data:", error);
      } finally {
        setIsLoadingAnime(false);
      }
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
    <div className="!mt-28  mx-4 lg:mx-8">
      <div className="relative">

      <AnimeHeading />
      <motion.div 
        className="absolute hidden md:block -top-8 md:-top-12 md:right-0 right-[26px] w-64 h-64 dark:bg-neutral-100/5 bg-neutral-800/5 rounded-full"
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 90, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      </div>
     
      {isLoadingAnime ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {animeList.slice(0, visibleAnimeCount).map((anime, index) => (
              <AnimeCard key={anime.mal_id} anime={anime} index={index} />
            ))}
          </div>
          {visibleAnimeCount < animeList.length && (
            <div className="flex justify-center mt-8">
              <button
                onClick={handleSeeMore}
                className="px-4 sm:px-6 py-2 mt-3 sm:mt-4 text-xs sm:text-sm font-medium text-neutral-500 bg-neutral-300 dark:text-neutral-900 dark:bg-white rounded-lg hover:bg-neutral-200 transition-all duration-300"
              >
                See More
              </button>
            </div>
          )}
        </>
      )}

      {/* Watchlist Component */}
      <div className="relative my-16">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex items-center border-4 dark:border-neutral-700 border-neutral-300 !bg-opacity-80 justify-between p-6 bg-white dark:bg-neutral-800 rounded-xl dark:shadow-lg mx-auto my-8"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex items-center md:flex-row flex-col"
          >
            <Image
              src="/crunchyroll_hime.png"
              alt="Crunchyroll Mascot"
              width={200}
              height={200}
              className="rounded-full"
              priority
            />
            <div className="flex flex-col mx-auto items-center md:items-start p-4 sm:p-6 md:p-8 lg:p-12">
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-xl sm:text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white mb-2 text-center"
              >
                My Watchlist
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="text-sm sm:text-base md:text-lg text-neutral-600 dark:text-neutral-400 text-center md:text-start max-w-md lg:max-w-lg"
              >
                Stay up to date with my favorites and what I am watching. <br />
                Check out my watchlist for more!
              </motion.p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleOpenWatchlist}
                className="px-4 sm:px-6 py-2 mt-4 sm:mt-6 text-xs sm:text-sm font-medium text-neutral-500 bg-neutral-300 dark:text-neutral-900 dark:bg-white rounded-lg hover:bg-neutral-200 transition-all duration-300"
              >
                Show Watchlist
              </motion.button>
            </div>
          </motion.div>
        </motion.div>

        {/* Grid */}
        <div className="absolute inset-0 opacity-30 -z-10 h-full w-full">
          <div className="absolute inset-0 dark:bg-[linear-gradient(to_right,#f8f4f4_1px,transparent_1px),linear-gradient(to_bottom,#f8f4f4_1px,transparent_1px)] dark:bg-[size:14px_24px] dark:[mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#fff_70%,transparent_100%)] bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#0101010_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]">
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
  watchlist: WatchlistItem2[]
  onClose: () => void
  isLoading: boolean
  selectedAnimeIndex: number | null
  setSelectedAnimeIndex: (index: number | null) => void
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const handleNextImage = () => {
    if (selectedAnimeIndex !== null) {
      const totalImages = watchlist[selectedAnimeIndex]?.panel.images.thumbnail[0]?.length || 0
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % totalImages)
    }
  }

  const handlePrevImage = () => {
    if (selectedAnimeIndex !== null) {
      const totalImages = watchlist[selectedAnimeIndex]?.panel.images.thumbnail[0]?.length || 0
      setCurrentImageIndex((prevIndex) => (prevIndex - 1 + totalImages) % totalImages)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getBestThumbnail = (thumbnails: any[], containerWidth: number) => {
    return thumbnails.reduce((prev, curr) => {
      return Math.abs(curr.width - containerWidth) < Math.abs(prev.width - containerWidth)
        ? curr
        : prev
    })
  }

  const containerWidth = typeof window !== 'undefined' ? Math.min(window.innerWidth - 32, 800) : 800

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999999] bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative bg-white dark:bg-neutral-900 rounded-lg shadow-2xl w-full max-w-5xl p-4 sm:p-6 flex flex-col max-h-[90vh] overflow-hidden"
        role="dialog"
        aria-labelledby="watchlist-title"
        aria-modal="true"
      >
        <Button
          onClick={onClose}
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
          aria-label="Close Watchlist"
        >
          <X size={24} />
        </Button>

        <h3
          id="watchlist-title"
          className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white mb-4 sm:mb-6 text-center"
        >
          My Watchlist
        </h3>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-6 h-full overflow-hidden">
            <ScrollArea className="w-full lg:w-1/3 h-[50vh] lg:h-[70vh] pr-4">
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
                        selectedAnimeIndex === index ? "ring-2 ring-blue-500 dark:ring-blue-400" : ""
                      }`}
                      onClick={() => {
                        setSelectedAnimeIndex(index)
                        setCurrentImageIndex(0)
                      }}
                    >
                      <div className="relative">
                        <Image
                          src={item.panel.images.thumbnail[0][0].source}
                          alt={item.panel.title}
                          width={320}
                          height={180}
                          className="w-full h-32 sm:h-40 object-cover"
                        />
                        <div className="absolute top-2 right-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className={`${item.is_favorite ? "text-pink-600" : "hidden"}`}
                          >
                            <Heart size={20} fill={item.is_favorite ? "currentColor" : "none"} />
                          </Button>
                        </div>
                        {item.new && (
                          <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded">
                            NEW
                          </div>
                        )}
                      </div>
                      <div className="p-3 sm:p-4 bg-white dark:bg-neutral-800">
                        <h4 className="text-xs sm:text-sm font-semibold text-neutral-900 dark:text-white mb-1 line-clamp-1">
                          {item.panel.episode_metadata.series_title}
                        </h4>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-2 line-clamp-1">
                          {item.panel.episode_metadata.episode_title}
                        </p>
                        <div className="flex justify-between items-center text-xs text-neutral-500 dark:text-neutral-400">
                          <span>Ep {item.panel.episode_metadata.episode_number}</span>
                          <span>{Math.floor(item.panel.episode_metadata.duration_ms / 60000)} min</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </ScrollArea>

            <ScrollArea className="w-full lg:w-2/3 h-[50vh] lg:h-[70vh]">
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
                        src={getBestThumbnail(watchlist[selectedAnimeIndex].panel.images.thumbnail[0], containerWidth).source}
                        alt={watchlist[selectedAnimeIndex].panel.title}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-lg shadow-md"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg"></div>
                      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                        <Link
                          href={constructAnimeUrl(watchlist[selectedAnimeIndex].panel as WatchListPanel) as Url}
                          target="_blank"
                        >
                          <Button variant="default" size="sm" className="flex shadow-none items-center space-x-2">
                            <Play size={16} />
                            <span>Play</span>
                          </Button>
                        </Link>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className={`text-white shadow-none cursor-default border-none ${
                              watchlist[selectedAnimeIndex].is_favorite ? "text-pink-700" : ""
                            }`}
                          >
                            <Heart fill={watchlist[selectedAnimeIndex].is_favorite ? "currentColor" : "none"} size={24} />
                          </Button>
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
                      <h4 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white">
                        {watchlist[selectedAnimeIndex].panel.episode_metadata.series_title}
                      </h4>
                      <p className="text-base sm:text-lg font-semibold text-neutral-700 dark:text-neutral-300">
                        {watchlist[selectedAnimeIndex].panel.episode_metadata.episode_title}
                      </p>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        {watchlist[selectedAnimeIndex].panel.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-500 dark:text-neutral-400">
                        <span>Season {watchlist[selectedAnimeIndex].panel.episode_metadata.season_number}</span>
                        <span>Episode {watchlist[selectedAnimeIndex].panel.episode_metadata.episode_number}</span>
                        <span>{formatDate(watchlist[selectedAnimeIndex].panel.episode_metadata.episode_air_date)}</span>
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
            </ScrollArea>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

function AnimeCard({ anime, index }: AnimeCardProps) {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9, rotateY: -10 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateY: 0,
      transition: {
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.43, 0.13, 0.23, 0.96],
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={cardVariants}
      className="relative rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 flex-shrink-0 md:flex-shrink bg-white dark:bg-gray-800"
      whileHover={{
        scale: 1.05,
        rotateY: 5,
        transition: { duration: 0.2 },
      }}
    >
      <div className="relative h-96 md:w-full md:h-[360px]">
        <Image
          src={anime.images.jpg.image_url}
          alt={anime.title}
          layout="fill"
          objectFit="cover"
          className="rounded-xl"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-xl"></div>
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-white text-lg font-semibold line-clamp-2">
            {anime.title}
          </h3>
        </div>
      </div>
    </motion.div>
  );
}
// function ImageWithSkeleton({
//   src,
//   alt,
//   width,
//   height,
//   priority = false,
// }: ImageWithSkeletonProps) {
//   const [isLoaded, setIsLoaded] = useState(false);

//   return (
//     <div className="relative w-full h-[360px]">
//       {!isLoaded && (
//         <div className="absolute inset-0 bg-gradient-to-r from-neutral-200 via-neutral-300 to-neutral-200 dark:from-neutral-700 dark:via-neutral-800 dark:to-neutral-700 animate-pulse rounded-t-xl" />
//       )}
//       <Image
//         src={src}
//         alt={alt}
//         width={width}
//         height={height}
//         onLoadingComplete={() => setIsLoaded(true)}
//         className={`object-cover w-full h-full rounded-xl transition-opacity duration-500 ${
//           isLoaded ? "opacity-100" : "opacity-0"
//         }`}
//         priority={priority}
//       />
//     </div>
//   );
// }
