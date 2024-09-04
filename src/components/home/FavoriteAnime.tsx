import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { fetchAnime } from "@/lib/anime";
import { getWatchList } from "@/lib/crunchyroll";

interface Anime {
  mal_id: number;
  title: string;
  images: {
    jpg: {
      image_url: string;
    };
  };
}

interface WatchlistItem {
  panel: {
    title: string;
    description: string;
    images: {
      thumbnail: [
        {
          source: string;
          width: number;
          height: number;
        }[]
      ];
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
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [isLoadingWatchlist, setIsLoadingWatchlist] = useState(false);

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
      setWatchlist(watchlistData?.data as WatchlistItem[]);
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
            className="bg-blue-500 text-white py-2 px-8 rounded-xl hover:bg-blue-600 transition-colors duration-300"
          >
            See More
          </button>
        </div>
      )}

      {/* Button to open the watchlist modal */}
      <div className="flex justify-center mt-4">
        <button
          onClick={handleOpenWatchlist}
          className="bg-green-500 text-white py-2 px-8 rounded-xl hover:bg-green-600 transition-colors duration-300"
        >
          Show Watchlist
        </button>
      </div>

      {/* Watchlist Modal */}
      {showWatchlistModal && (
        <WatchlistModal
          watchlist={watchlist}
          onClose={handleCloseModal}
          isLoading={isLoadingWatchlist}
        />
      )}
    </div>
  );
}

function WatchlistModal({
  watchlist,
  onClose,
  isLoading,
}: {
  watchlist: WatchlistItem[];
  onClose: () => void;
  isLoading: boolean;
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg w-11/12 max-w-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-semibold text-neutral-900 dark:text-white">
            My Watchlist
          </h3>
          <button
            onClick={onClose}
            className="text-red-500 hover:text-red-700 font-bold"
          >
            ×
          </button>
        </div>
        {isLoading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {watchlist.map((item, index) => (
              <div
                key={index}
                className="flex items-start space-x-4 bg-gray-100 dark:bg-gray-700 p-4 rounded-lg"
              >
                <Image
                  src={item.panel.images.thumbnail[0][3].source}
                  alt={item.panel.title}
                  width={100}
                  height={100}
                  className="rounded-md"
                />
                <div>
                  <h4 className="text-lg font-bold text-neutral-900 dark:text-white">
                    {item.panel.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {item.panel.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
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
        transition: { duration: 1.2, type: "spring", stiffness: 80, bounce: 0.4 },
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
