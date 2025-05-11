"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useScrollReveal } from '../hooks/useScrollReveal';

// Define the type for our gallery items
interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  title: string;
  description?: string;
  thumbnail?: string;
  createdTime?: string;
  takenDate?: string;
}

// Define sort options
type SortOption = 'newest' | 'oldest' | 'alphabetical';

export default function Gallery() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [activeItem, setActiveItem] = useState<string | null>(null);

  // Use scroll reveal hook
  const { ref: galleryRef, isRevealed } = useScrollReveal({ 
    threshold: 0.1,
    triggerOnce: true
  });

  // Sort function to handle different sorting options
  const sortItems = (items: GalleryItem[], sortOption: SortOption): GalleryItem[] => {
    return [...items].sort((a, b) => {
      if (sortOption === 'alphabetical') {
        return a.title.localeCompare(b.title);
      }
      
      // For date-based sorting, we prioritize different date fields
      // First try createdTime (when added to drive) since that's what we're mainly interested in
      if (a.createdTime && b.createdTime) {
        const dateA = new Date(a.createdTime).getTime();
        const dateB = new Date(b.createdTime).getTime();
        return sortOption === 'newest' ? dateB - dateA : dateA - dateB;
      }
      
      // Fall back to takenDate if available
      if (a.takenDate && b.takenDate) {
        const dateA = new Date(a.takenDate).getTime();
        const dateB = new Date(b.takenDate).getTime();
        return sortOption === 'newest' ? dateB - dateA : dateA - dateB;
      }
      
      // If one has a date and the other doesn't, prioritize the one with a date
      if (a.createdTime && !b.createdTime) return sortOption === 'newest' ? -1 : 1;
      if (!a.createdTime && b.createdTime) return sortOption === 'newest' ? 1 : -1;
      
      // Last resort: alphabetical
      return a.title.localeCompare(b.title);
    });
  };

  useEffect(() => {
    // Fetch gallery data from the API
    const fetchGallery = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/gallery');
        
        if (!response.ok) {
          throw new Error('Failed to fetch gallery images');
        }
        
        const data = await response.json();
        setItems(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error('Gallery fetch error:', err);
        
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  // Sort items whenever sort option changes or items are loaded
  const sortedItems = sortItems(items, sortBy);

  if (loading) {
    return (
      <div className="min-h-[300px] flex items-center justify-center">
        <div className="flex flex-col items-center text-amber-800">
          <div className="h-10 w-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="animate-pulse">Loading our delicious creations...</p>
        </div>
      </div>
    );
  }

  if (error && items.length === 0) {
    return (
      <div className="min-h-[300px] flex items-center justify-center">
        <div className="text-red-500 bg-red-50 p-4 rounded-lg shadow-md animate-fade-in">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Error loading gallery: {error}
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[300px] flex items-center justify-center">
        <div className="text-amber-800 bg-amber-50 p-6 rounded-lg shadow-md text-center animate-fade-in">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-lg">No items to display at the moment.</p>
          <p className="mt-2 text-amber-600">Check back soon for our latest creations!</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={galleryRef} 
      className={`transition-all duration-700 ${isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
    >
      <div className="mb-8 flex flex-col sm:flex-row sm:justify-between items-start sm:items-center">
        <h2 className="text-2xl font-bold text-amber-800 mb-4 sm:mb-0 relative">
          Our Bread Gallery
          <span className="absolute bottom-0 left-0 w-1/2 h-1 bg-amber-400 transform origin-left scale-x-100"></span>
        </h2>
        <div className="inline-flex items-center">
          <label htmlFor="sort-select" className="mr-2 text-stone-700 font-medium">
            Sort by:
          </label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="bg-white border border-amber-300 text-stone-700 rounded-md py-1.5 px-3 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-shadow duration-300 shadow-sm hover:shadow-md"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="alphabetical">Alphabetical</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {sortedItems.map((item, index) => (
          <div 
            key={item.id} 
            className={`bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 card-hover transform ${
              activeItem === item.id ? 'scale-[1.03] ring-2 ring-amber-400' : ''
            }`}
            style={{ 
              transitionDelay: `${index * 0.05}s`,
              animation: isRevealed ? `fadeIn 0.5s ease-out ${index * 0.05}s forwards` : 'none'
            }}
            onClick={() => setActiveItem(activeItem === item.id ? null : item.id)}
          >
            <div className="relative h-64 w-full overflow-hidden group">
              {item.src && item.src.includes('drive.google.com') ? (
                <>
                  <Image 
                    src={item.src} 
                    alt={item.alt || item.title} 
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-amber-900/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-start p-4">
                    <span className="text-amber-50 font-medium">{item.title}</span>
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 bg-amber-200 flex items-center justify-center">
                  <p className="text-amber-800 font-bold">{item.title}</p>
                </div>
              )}
              
              {/* Decorative element */}
              <div className="absolute top-3 right-3 h-6 w-6 rounded-full bg-amber-400 opacity-70 transform transition-transform duration-300 group-hover:scale-150 group-hover:opacity-30"></div>
            </div>
            
            <div className="p-5">
              <h3 className="text-xl font-bold text-amber-800 mb-2 relative inline-block">
                {item.title}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-400 transition-all duration-300 group-hover:w-full"></span>
              </h3>
              
              {item.description && (
                <p className="text-stone-600 mt-3 line-clamp-2">{item.description}</p>
              )}
              
              <div className="mt-4 pt-3 border-t border-amber-100 flex justify-between items-center">
                {item.createdTime && (
                  <p className="text-xs text-stone-500">
                    <span className="font-medium">Added:</span> {new Date(item.createdTime).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}