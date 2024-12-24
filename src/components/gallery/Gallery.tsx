'use client'

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, RefreshCw, Search, ChevronLeft, ChevronRight, ZoomIn, X } from 'lucide-react';
import { getGalleryItems } from '@/app/actions/gallery';
import { motion, AnimatePresence } from 'framer-motion';

interface GalleryItem {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
}

const generateRandomPosition = () => {
  return {
    x: Math.random() * 100 - 50,
    y: Math.random() * 100 - 50,
    scale: Math.random() * 0.5 + 0.5,
  };
};

export default function Gallery() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const itemsPerPage = 15;

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  const fetchGalleryItems = async () => {
    setLoading(true);
    try {
      const data = await getGalleryItems();
      setItems(JSON.parse(data));
    } catch (err) {
      setError('Failed to load gallery items. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = items.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 overflow-hidden">
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 relative">
        <div className="mb-8 relative z-10">
          <h2 className="text-5xl font-bold text-neutral-800 dark:text-neutral-200 mb-4">Gallery</h2>
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative flex-grow">
              <Input
                type="text"
                placeholder="Search gallery..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-600 focus:ring-neutral-500 focus:border-neutral-500"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-neutral-400" />
              </div>
            </div>
            <Button
              variant="outline"
              onClick={fetchGalleryItems}
              className="gap-2 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 border-neutral-300 dark:border-neutral-600"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
          </div>
        </div>

        {error && (
          <Alert className="mb-4 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
            <AlertDescription className="text-red-800 dark:text-red-200">{error}</AlertDescription>
          </Alert>
        )}

        {loading ? (
          <div className="flex items-center justify-center min-h-64">
            <Loader2 className="w-8 h-8 animate-spin text-neutral-600 dark:text-neutral-400" />
          </div>
        ) : paginatedItems.length > 0 ? (
          <motion.div 
            className="relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {paginatedItems.map((item, index) => (
              <motion.div
                key={item._id}
                className="absolute"
                initial={generateRandomPosition()}
                animate={{
                  x: (index % 5) * 200 - 400,
                  y: Math.floor(index / 5) * 200 - 200,
                  scale: 1,
                }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  duration: 0.5,
                }}
                whileHover={{ scale: 1.1, zIndex: 10 }}
              >
                <Card 
                  className="w-40 h-40 rounded-full bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 overflow-hidden cursor-pointer shadow-lg"
                  onClick={() => setSelectedItem(item)}
                >
                  <CardContent className="p-0 relative group">
                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover rounded-full" />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center rounded-full">
                      <ZoomIn className="text-white opacity-0 group-hover:opacity-100 transition-all duration-300" size={24} />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
            <svg className="absolute top-0 left-0 w-full h-full -z-10" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: 'rgb(239, 68, 68)', stopOpacity: 0.2 }} />
                  <stop offset="100%" style={{ stopColor: 'rgb(59, 130, 246)', stopOpacity: 0.2 }} />
                </linearGradient>
              </defs>
              <rect width="100%" height="100%" fill="url(#grad1)" />
              {[...Array(20)].map((_, i) => (
                <circle
                  key={i}
                  cx={Math.random() * 100 + '%'}
                  cy={Math.random() * 100 + '%'}
                  r={Math.random() * 50 + 10}
                  fill="none"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="2"
                />
              ))}
              {[...Array(5)].map((_, i) => (
                <path
                  key={i}
                  d={`M${Math.random() * 100},${Math.random() * 100} Q${Math.random() * 100},${Math.random() * 100} ${Math.random() * 100},${Math.random() * 100}`}
                  fill="none"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="2"
                />
              ))}
            </svg>
          </motion.div>
        ) : (
          <p className="text-center text-neutral-600 dark:text-neutral-400">No items found.</p>
        )}

        {totalPages > 1 && (
          <div className="mt-8 flex justify-center relative z-10">
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-sm font-medium text-neutral-500 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-700"
              >
                <span className="sr-only">Previous</span>
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </Button>
              {[...Array(totalPages)].map((_, index) => (
                <Button
                  key={index}
                  variant="outline"
                  onClick={() => setCurrentPage(index + 1)}
                  className={`relative inline-flex items-center px-4 py-2 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-sm font-medium ${
                    currentPage === index + 1
                      ? 'z-10 bg-neutral-100 dark:bg-neutral-700 border-neutral-500 dark:border-neutral-400 text-neutral-600 dark:text-neutral-300'
                      : 'text-neutral-500 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-700'
                  }`}
                >
                  {index + 1}
                </Button>
              ))}
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-sm font-medium text-neutral-500 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-700"
              >
                <span className="sr-only">Next</span>
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </Button>
            </nav>
          </div>
        )}

        <AnimatePresence>
          {selectedItem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
              onClick={() => setSelectedItem(null)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-white dark:bg-neutral-800 p-4 rounded-lg max-w-3xl w-full mx-4 relative"
                onClick={(e) => e.stopPropagation()}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={() => setSelectedItem(null)}
                >
                  <X className="h-6 w-6" />
                </Button>
                <img src={selectedItem.imageUrl} alt={selectedItem.title} className="w-full h-auto max-h-[70vh] object-contain mb-4 rounded-lg" />
                <h3 className="text-2xl font-bold mb-2 text-neutral-800 dark:text-neutral-200">{selectedItem.title}</h3>
                <p className="text-neutral-600 dark:text-neutral-400">{selectedItem.description}</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

