"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

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
        <div className="text-amber-800">Loading our delicious creations...</div>
      </div>
    );
  }

  if (error && items.length === 0) {
    return (
      <div className="min-h-[300px] flex items-center justify-center">
        <div className="text-red-500">Error loading gallery: {error}</div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[300px] flex items-center justify-center">
        <div className="text-amber-800">No items to display at the moment. Check back soon!</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex justify-end">
        <div className="inline-flex items-center">
          <label htmlFor="sort-select" className="mr-2 text-stone-700 font-medium">
            Sort by:
          </label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="bg-white border border-amber-300 text-stone-700 rounded-md py-1 px-3 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="alphabetical">Alphabetical</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedItems.map((item) => (
          <div 
            key={item.id} 
            className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="relative h-64 w-full">
              {item.src.includes('drive.google.com') ? (
                <Image 
                  src={item.src} 
                  alt={item.alt} 
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-amber-200 flex items-center justify-center">
                  <p className="text-amber-800 font-bold">{item.title}</p>
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="text-xl font-bold text-amber-800 mb-2">{item.title}</h3>
              {item.description && (
                <p className="text-stone-600">{item.description}</p>
              )}
              {item.createdTime && (
                <p className="text-xs text-stone-500 mt-2">
                  Added: {new Date(item.createdTime).toLocaleDateString()}
                </p>
              )}
              {item.takenDate && (
                <p className="text-xs text-stone-500 mt-1">
                  Taken: {new Date(item.takenDate).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}