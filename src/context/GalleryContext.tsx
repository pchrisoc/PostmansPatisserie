"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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

// Define the context shape
interface GalleryContextType {
  items: GalleryItem[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  lastFetched: number | null;
}

// Create the context with default values
const GalleryContext = createContext<GalleryContextType>({
  items: [],
  loading: true,
  error: null,
  refetch: async () => {},
  lastFetched: null
});

// Create a global cache outside of the component to persist between renders
// This helps with React's StrictMode double-mounting in development
let globalCache: {
  items: GalleryItem[];
  timestamp: number;
} | null = null;

// Cache expiry time (5 minutes)
const CACHE_EXPIRY_MS = 5 * 60 * 1000;

// Helper to get the absolute URL for API requests
function getApiUrl(path: string): string {
  // For client-side, we can use relative URLs and just return the path
  if (typeof window !== 'undefined') {
    return path;
  }
  
  // For server-side rendering, use the environment variable if available
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
  return `${baseUrl}${path}`;
}

// Provider component
export function GalleryProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<GalleryItem[]>(() => globalCache?.items || []);
  const [loading, setLoading] = useState(!globalCache);
  const [error, setError] = useState<string | null>(null);
  const [lastFetched, setLastFetched] = useState<number | null>(globalCache?.timestamp || null);

  // Function to fetch gallery data
  const fetchGallery = async (force = false) => {
    // Skip fetching if we've already fetched recently, unless forced
    if (
      !force && 
      globalCache && 
      globalCache.items.length > 0 && 
      Date.now() - globalCache.timestamp < CACHE_EXPIRY_MS
    ) {
      console.log('[GalleryContext] Using global cached gallery data');
      setItems(globalCache.items);
      setLastFetched(globalCache.timestamp);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('[GalleryContext] Fetching gallery data from API');
      
      // Add a timeout to the fetch to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const apiUrl = getApiUrl('/api/gallery');
      console.log(`[GalleryContext] Fetching from: ${apiUrl}`);
      
      const response = await fetch(apiUrl, {
        // Add cache busting for forced refreshes
        headers: force ? {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        } : {},
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch gallery images: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!Array.isArray(data)) {
        console.error('[GalleryContext] API returned non-array data:', data);
        throw new Error('Invalid data format received from API');
      }
      
      // Update the global cache
      globalCache = {
        items: data,
        timestamp: Date.now()
      };
      
      setItems(data);
      setLastFetched(Date.now());
      setError(null);
    } catch (err) {
      // Check for specific error types
      if (err instanceof DOMException && err.name === 'AbortError') {
        setError('Request timed out. Please try again.');
      } else {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      }
      console.error('[GalleryContext] Gallery fetch error:', err);
      
      // If we have cached items, use them even if the refresh failed
      if (globalCache?.items?.length) {
        console.log('[GalleryContext] Using cached items despite fetch error');
        setItems(globalCache.items);
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on initial mount only if we don't have cached data
  useEffect(() => {
    fetchGallery();
    // Empty dependency array ensures this only runs once when the component mounts
  }, []);

  return (
    <GalleryContext.Provider value={{ 
      items, 
      loading, 
      error, 
      refetch: () => fetchGallery(true),
      lastFetched
    }}>
      {children}
    </GalleryContext.Provider>
  );
}

// Custom hook to use the gallery context
export function useGallery() {
  const context = useContext(GalleryContext);
  if (context === undefined) {
    throw new Error('useGallery must be used within a GalleryProvider');
  }
  return context;
}