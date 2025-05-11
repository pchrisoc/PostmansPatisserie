"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface BreadOfTheWeek {
  name: string;
  description: string;
}

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  title: string;
  description?: string;
  thumbnail?: string;
  createdTime?: string;
  takenDate?: string;
}

interface HeaderProps {
  breadOfTheWeek: BreadOfTheWeek;
}

export default function Header({ breadOfTheWeek }: HeaderProps) {
  const [latestImage, setLatestImage] = useState<GalleryImage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestImage = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/gallery');
        
        if (!response.ok) {
          throw new Error('Failed to fetch gallery images');
        }
        
        const data = await response.json();
        
        // Find the most recent image (based on createdTime)
        if (data && data.length > 0) {
          const sortedImages = [...data].sort((a, b) => {
            if (a.createdTime && b.createdTime) {
              return new Date(b.createdTime).getTime() - new Date(a.createdTime).getTime();
            }
            return 0;
          });
          
          setLatestImage(sortedImages[0]);
        }
      } catch (err) {
        console.error('Error fetching latest gallery image:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestImage();
  }, []);

  return (
    <>
      {/* Header */}
      <header className="bg-amber-800 text-amber-50 py-6 px-4 md:px-8">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h1 className="text-3xl md:text-4xl font-bold">Postman Patisserie</h1>
            <p className="text-amber-200 italic">Artisanal bread baked with love</p>
          </div>
          <nav>
            <ul className="flex gap-6">
              <li><a href="#about" className="hover:text-amber-200 transition-colors">About</a></li>
              <li><a href="#gallery" className="hover:text-amber-200 transition-colors">Gallery</a></li>
              <li><a href="#contact" className="hover:text-amber-200 transition-colors">Contact</a></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Hero with Bread of the Week */}
      <section className="bg-amber-100 py-12 px-4 md:px-8">
        <div className="container mx-auto flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-1/2">
            <h2 className="text-2xl font-bold text-amber-900 mb-2">Bread of the Week</h2>
            <h3 className="text-8xl font-bold text-amber-800 mb-4">
              {latestImage ? latestImage.title : breadOfTheWeek.name}
            </h3>
            <a 
              href="#contact" 
              className="bg-amber-700 hover:bg-amber-800 text-white py-2 px-6 rounded-md transition-colors inline-block"
            >
              Order Now
            </a>
          </div>
          <div className="md:w-1/2 relative h-64 md:h-96 w-full rounded-lg overflow-hidden shadow-lg">
            {latestImage && latestImage.src ? (
              <Image 
                src={latestImage.src} 
                alt={latestImage.alt || (latestImage.title ? latestImage.title : breadOfTheWeek.name)}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            ) : (
              <div className="absolute inset-0 bg-amber-300 flex items-center justify-center">
                {loading ? (
                  <p className="text-amber-800 text-xl font-bold">Loading image...</p>
                ) : (
                  <p className="text-amber-800 text-xl font-bold">{breadOfTheWeek.name}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}