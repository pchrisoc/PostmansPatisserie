"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Navigation from './Navigation';
import { useGallery } from '@/context/GalleryContext';

interface BreadOfTheWeek {
  name: string;
}

interface HeaderProps {
  breadOfTheWeek: BreadOfTheWeek;
}

export default function Header({ breadOfTheWeek }: HeaderProps) {
  // Use the shared gallery context instead of making a direct API call
  const { items, loading, error, refetch } = useGallery();
  
  const [latestImage, setLatestImage] = useState<typeof items[0] | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Update latestImage when gallery items change
  useEffect(() => {
    if (items && items.length > 0) {
      // Find the most recent image (based on createdTime)
      const sortedImages = [...items].sort((a, b) => {
        if (a.createdTime && b.createdTime) {
          return new Date(b.createdTime).getTime() - new Date(a.createdTime).getTime();
        }
        return 0;
      });
      
      setLatestImage(sortedImages[0]);
    }
  }, [items]);

  useEffect(() => {
    // Add scroll event listener with header hide/show logic
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show/hide header based on scroll direction
      if (currentScrollY > lastScrollY) {
        // Scrolling down - hide header
        setHeaderVisible(false);
      } else {
        // Scrolling up - show header
        setHeaderVisible(true);
      }
      
      // Set scrolled state for compact header style
      setScrolled(currentScrollY > 20);
      
      // Update the last scroll position
      setLastScrollY(currentScrollY);
      
      // Always show header at the top of the page
      if (currentScrollY < 50) {
        setHeaderVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  return (
    <>
      {/* Header */}
      <header 
        className={`bg-amber-800 text-amber-50 fixed w-full top-0 z-50 transition-all duration-300 
          ${scrolled ? 'shadow-lg py-2' : 'py-4'} 
          ${headerVisible ? 'transform-none' : 'transform -translate-y-full'}`}
      >
        <div className="container mx-auto flex justify-between items-center px-0">
          <div className="flex items-center">
            <h1 className="text-3xl font-bold transform transition-transform duration-300 hover:scale-105">
              Postman Patisserie
            </h1>
          </div>
          
          <Navigation />
        </div>
      </header>

      {/* Spacer to prevent content from hiding behind fixed header - matching header color */}
      <div className={`h-20 ${scrolled ? 'h-16' : ''} bg-amber-800`}></div>

      {/* Hero with Bread of the Week - remove top padding */}
      <section className="bg-gradient-to-b from-amber-800 to-amber-100 py-16 pt-0 px-8 overflow-hidden">
        <div className="container mx-auto flex flex-row items-center gap-8">
          <div className="w-1/2 transform transition-all duration-700 hover:translate-x-3">
            <div className="relative">
              <h2 className="text-xl font-bold text-amber-100 mb-2 relative inline-block">
                Bread of the Week
                <span className="absolute bottom-0 left-0 w-full h-1 bg-amber-400 transform origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
              </h2>
              <h3 className="text-8xl font-bold text-amber-200 mb-6 leading-tight">
                {latestImage ? latestImage.title : breadOfTheWeek.name}
              </h3>
              <a 
                href="#order" 
                className="group bg-amber-700 hover:bg-amber-800 text-white py-3 px-8 rounded-md transition-all duration-300 inline-flex items-center shadow-md hover:shadow-lg"
              >
                Order Now
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
              
              {/* Add error retry button if there's an error */}
              {error && (
                <button
                  onClick={() => refetch()}
                  className="ml-4 bg-amber-600 hover:bg-amber-700 text-white py-2 px-4 rounded-md text-sm transition-colors"
                  title="Retry loading gallery images"
                >
                  Retry
                </button>
              )}
            </div>
          </div>
          <div className="w-1/2 relative h-96 w-full rounded-xl overflow-hidden shadow-2xl transform transition-all duration-700 hover:scale-[1.02] hover:rotate-1">
            {latestImage && latestImage.src ? (
              <Image 
                src={latestImage.src} 
                alt={latestImage.alt || (latestImage.title ? latestImage.title : breadOfTheWeek.name)}
                fill
                sizes="50vw"
                className="object-cover"
                priority
                onError={(e) => {
                  console.error('Image failed to load:', latestImage.src);
                  // Fallback to default content on image load error
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <div className="absolute inset-0 bg-amber-300 flex items-center justify-center">
                {loading ? (
                  <div className="animate-pulse flex flex-col items-center">
                    <div className="h-12 w-12 border-4 border-amber-800 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-amber-800 text-xl font-bold mt-4">Loading image...</p>
                  </div>
                ) : error ? (
                  <div className="text-center p-6">
                    <p className="text-amber-900 text-lg font-bold mb-2">Could not load gallery</p>
                    <p className="text-amber-800 text-sm mb-4">{error}</p>
                    <button 
                      onClick={() => refetch()}
                      className="bg-amber-700 hover:bg-amber-800 text-white py-2 px-4 rounded-md transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                ) : (
                  <p className="text-amber-800 text-xl font-bold">{breadOfTheWeek.name}</p>
                )}
              </div>
            )}
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-12 h-12 bg-amber-400 rounded-full opacity-30"></div>
            <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-amber-500 rounded-full opacity-20"></div>
          </div>
        </div>
      </section>
    </>
  );
}