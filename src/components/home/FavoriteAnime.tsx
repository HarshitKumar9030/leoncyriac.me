import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { fetchAnime } from "@/lib/anime";
import { getWatchList } from "@/lib/crunchyroll";
import { WatchlistItem2 } from "@/types/types";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut", staggerChildren: 0.2 }}
        className="flex flex-col items-center mt-16 p-8 md:p-12 bg-white dark:bg-neutral-800 rounded-xl shadow-lg max-w-md md:max-w-lg mx-auto"
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          <Image
            src={"/crunchyroll.svg"}
            alt="Crunchyroll Logo"
            width={200}
            height={150}
            className="mb-4"
            priority
          />
          <div className="border w-full mb-4 dark:border-neutral-600 border-neutral-600 rounded-full"></div>
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white mb-4 text-center"
          >
            My Watchlist
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-sm md:text-base text-neutral-600 dark:text-neutral-400 mb-6 text-center max-w-xs"
          >
            A personalized collection of shows and movies just for me. Stay up
            to date with my favorites and discover new ones to add to my list
            anytime.
          </motion.p>
        </motion.div>
        <motion.button
          whileHover={{
            scale: 1.05,
          }}
          whileTap={{ scale: 0.95 }}
          onClick={handleOpenWatchlist}
          className="px-6 py-2 flex items-center text-sm gap-2 font-medium text-neutral-900 bg-[#f8f4f4] dark:text-neutral-900 dark:bg-white cursor-pointer rounded-lg transition-transform duration-300"
        >
          Show Watchlist
        </motion.button>
      </motion.div>

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
  console.log(watchlist)

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
      year: 'numeric',
      month: 'short',
      day: 'numeric',
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
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="relative bg-white dark:bg-neutral-900 rounded-lg shadow-2xl w-11/12 max-w-4xl p-6 flex flex-col"
        role="dialog"
        aria-labelledby="watchlist-title"
        aria-modal="true"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-900 dark:text-white hover:text-red-500 transition-transform transform hover:scale-110"
          aria-label="Close Watchlist"
        >
          <X size={24} />
        </button>

        <h3
          id="watchlist-title"
          className="text-2xl font-semibold text-neutral-900 dark:text-white mb-6 text-center"
        >
          My Watchlist
        </h3>

        {isLoading ? (
          <p className="text-center text-neutral-500 dark:text-neutral-400">
            Loading...
          </p>
        ) : (
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <motion.ul
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.5,
                ease: 'easeOut',
                staggerChildren: 0.1,
              }}
              className="w-full md:w-1/3 overflow-auto space-y-2"
            >
              {watchlist.map((item, index) => (
                <motion.li
                  key={item.panel.id}
                  whileHover={{
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderColor: '#2563eb',
                    borderWidth: 2,
                  }}
                  className={`p-3 rounded-lg transition-all duration-300 cursor-pointer ${
                    selectedAnimeIndex === index
                      ? 'bg-neutral-800 dark:bg-neutral-700 dark:text-neutral-400 text-neutral-600 border-blue-500'
                      : 'border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white'
                  }`}
                  onClick={() => {
                    setSelectedAnimeIndex(index);
                    setCurrentImageIndex(0); 
                  }}
                  tabIndex={0}
                  role="button"
                  aria-pressed={selectedAnimeIndex === index}
                >
                  <div className="flex items-center space-x-4">
                    <Image
                      src={item.panel.images.thumbnail[0][0].source} // Safely access the first thumbnail
                      alt={item.panel.title}
                      width={50}
                      height={50}
                      className="rounded-md"
                    />
                    <div>
                      <h4 className="text-sm font-medium">
                        {item.panel.episode_metadata.series_title}
                      </h4>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        {"Rated: " + item.panel.episode_metadata.maturity_ratings ||
                          item.panel.promo_title}
                      </p>
                    </div>
                  </div>
                </motion.li>
              ))}
            </motion.ul>

            {/* Selected Anime Details */}
            <div className="w-full md:w-2/3 p-4 flex justify-center items-center relative">
              {selectedAnimeIndex !== null && !isLoading ? (
                <motion.div
                  key={selectedAnimeIndex}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="flex flex-col space-y-4"
                >
                  {/* Image Carousel */}
                  <div className="relative">
                    <Image
                      src={
                        getBestThumbnail(
                          watchlist[selectedAnimeIndex].panel.images.thumbnail[0],
                          containerWidth
                        ).source
                      }
                      alt={watchlist[selectedAnimeIndex].panel.title}
                      width={containerWidth}
                      height={(containerWidth / 16) * 9}
                      className="rounded-lg shadow-md"
                    />
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-0 top-1/2 transform -translate-y-1/2 text-neutral-900 dark:text-white hover:text-blue-500"
                      aria-label="Previous Image"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-0 top-1/2 transform -translate-y-1/2 text-neutral-900 dark:text-white hover:text-blue-500"
                      aria-label="Next Image"
                    >
                      <ChevronRight size={24} />
                    </button>
                  </div>

                  {/* Anime Details */}
                  <div>
                    <h4 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">
                      {watchlist[selectedAnimeIndex].panel.title}
                    </h4>
                    <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-2">
                      {watchlist[selectedAnimeIndex].panel.description}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      Season{' '}
                      {watchlist[selectedAnimeIndex].panel.episode_metadata
                        .season_number || 'N/A'}
                      , Episode{' '}
                      {watchlist[selectedAnimeIndex].panel.episode_metadata
                        .episode_number || 'N/A'}{' '}
                      -{' '}
                      {formatDate(
                        watchlist[selectedAnimeIndex].panel.episode_metadata
                          .episode_air_date || ''
                      )}
                    </p>
                  </div>
                </motion.div>
              ) : (
                <p className="text-center text-neutral-500 dark:text-neutral-400">
                  Select an anime to view details.
                </p>
              )}
            </div>
          </div>
        )}
      </motion.div>
    </div>
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
