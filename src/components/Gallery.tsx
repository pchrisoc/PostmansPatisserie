"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface GalleryImage {
  src: string;
  alt: string;
  id: string;
  title?: string;
  thumbnail?: string;
}

export default function Gallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchImages() {
      try {
        setLoading(true);
        const response = await fetch('/api/gallery');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch images: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log("Fetched gallery images:", data);
        setImages(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load gallery images');
        console.error('Error fetching gallery images:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchImages();
  }, []);

  const openImage = useCallback((src: string, index: number) => {
    setSelectedImage(src);
    setSelectedImageIndex(index);
  }, []);

  const closeImage = useCallback(() => {
    setSelectedImage(null);
    setSelectedImageIndex(null);
  }, []);

  const navigateImage = useCallback((direction: 'prev' | 'next') => {
    if (selectedImageIndex === null || images.length === 0) return;
    
    let newIndex;
    if (direction === 'prev') {
      newIndex = selectedImageIndex > 0 ? selectedImageIndex - 1 : images.length - 1;
    } else {
      newIndex = selectedImageIndex < images.length - 1 ? selectedImageIndex + 1 : 0;
    }
    
    setSelectedImage(images[newIndex].src);
    setSelectedImageIndex(newIndex);
  }, [selectedImageIndex, images]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedImage) return;
      
      if (e.key === 'Escape') {
        closeImage();
      } else if (e.key === 'ArrowLeft') {
        navigateImage('prev');
      } else if (e.key === 'ArrowRight') {
        navigateImage('next');
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, closeImage, navigateImage]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-gray-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-xl text-gray-700">Loading gallery...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="text-center bg-gray-50 p-6 rounded-lg shadow-md max-w-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Failed to load gallery</h3>
            <p className="text-gray-700">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="text-center bg-gray-50 p-6 rounded-lg shadow-md max-w-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No Images Found</h3>
            <p className="text-gray-700">There are no images available in the gallery. Please check your Google Drive folder.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Image Grid - Now with masonry-like effect */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: {
              staggerChildren: 0.08
            }
          }
        }}
      >
        {images.map((img, index) => (
          <motion.div 
            key={img.id} 
            className={`overflow-hidden rounded-2xl shadow-lg bg-transparent cursor-pointer ${index % 3 === 0 ? 'row-span-2' : ''}`}
            onClick={() => openImage(img.src, index)}
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 }
            }}
            whileHover={{ 
              scale: 1.02, 
              boxShadow: "0 20px 25px -5px rgba(255, 255, 255, 0.15), 0 10px 10px -5px rgba(255, 255, 255, 0.1)" 
            }}
            whileTap={{ scale: 0.98 }}
            style={{
              boxShadow: "0 8px 16px -2px rgba(255, 255, 255, 0.1), 0 4px 8px -2px rgba(255, 255, 255, 0.06)"
            }}
          >
            <div className={`relative w-full ${index % 3 === 0 ? 'h-96 sm:h-[500px]' : 'h-64 sm:h-72'}`}>
              <div 
                className="w-full h-full bg-cover bg-center transition-all duration-500 grayscale hover:grayscale-0 rounded-2xl"
                style={{ 
                  backgroundImage: `url('${img.thumbnail || img.src}')`,
                  filter: "drop-shadow(0 0 8px rgba(255, 255, 255, 0.2))"
                }}
                aria-label={img.alt}
              />
              {img.title && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 rounded-b-2xl">
                  <p className="text-white font-semibold">{img.title}</p>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Fullscreen Image Modal with navigation */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={closeImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="relative max-w-6xl max-h-[90vh] w-full h-full"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div 
                className="w-full h-full bg-contain bg-center bg-no-repeat rounded-3xl"
                style={{ backgroundImage: `url('${selectedImage}')` }}
              />
              
              {/* Navigation buttons */}
              <motion.button 
                className="absolute top-[50%] left-4 bg-white/20 hover:bg-white/40 rounded-full w-12 h-12 flex items-center justify-center shadow-lg backdrop-blur-sm transform -translate-y-1/2"
                onClick={(e) => {
                  e.stopPropagation();
                  navigateImage('prev');
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </motion.button>
              
              <motion.button 
                className="absolute top-[50%] right-4 bg-white/20 hover:bg-white/40 rounded-full w-12 h-12 flex items-center justify-center shadow-lg backdrop-blur-sm transform -translate-y-1/2"
                onClick={(e) => {
                  e.stopPropagation();
                  navigateImage('next');
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </motion.button>
              
              {/* Close button */}
              <motion.button 
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 rounded-full w-10 h-10 flex items-center justify-center shadow-lg backdrop-blur-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  closeImage();
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
              
              {/* Image counter */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm">
                {selectedImageIndex !== null ? `${selectedImageIndex + 1} / ${images.length}` : ''}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}