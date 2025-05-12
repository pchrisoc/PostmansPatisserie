"use client";

import React from 'react';
import Image from 'next/image';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useMediaQuery } from '@/hooks/useMediaQuery';

export default function About() {
  // Use the scroll reveal hook for animation
  const { ref: aboutRef, isRevealed } = useScrollReveal({
    threshold: 0.1,
    triggerOnce: true
  });
  
  // Media query for responsive design
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  return (
    <section id="about" className="py-16 px-4 md:px-8 bg-white overflow-hidden">
      <div 
        ref={aboutRef}
        className="container mx-auto transition-all duration-700"
      >
        <div className={`flex ${isMobile ? 'flex-col items-center' : 'flex-row items-start'} gap-8 max-w-5xl mx-auto`}>
          {/* Image - centered on mobile, left on desktop */}
          <div 
            className={`${isMobile ? 'w-full flex justify-center mb-8' : 'w-1/3 flex justify-start'} transition-all duration-1000 transform ${
              isRevealed ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-24'
            }`}
            style={{ transitionDelay: '200ms' }}
          >
            <div className={`relative ${isMobile ? 'h-56 w-56' : 'h-72 w-72'} rounded-full overflow-hidden shadow-md transform transition-all duration-500 hover:scale-105 hover:shadow-lg`}>
              <Image
                src="/kian.jpeg"
                alt="Our bakery"
                fill
                sizes="(max-width: 768px) 224px, 288px"
                className="object-cover"
              />
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-amber-400 rounded-full opacity-20"></div>
              <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-amber-500 rounded-full opacity-10"></div>
            </div>
          </div>
          
          {/* Content: title and text - centered on mobile, right-aligned on desktop */}
          <div 
            className={`${isMobile ? 'w-full text-center' : 'w-2/3 text-left'} transition-all duration-1000 transform ${
              isRevealed ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-24'
            }`}
            style={{ transitionDelay: '400ms' }}
          >
            <h2 className={`text-3xl font-bold text-amber-800 mb-6 ${isMobile ? 'text-center' : 'text-left'} relative inline-block`}>
              Our Story
              <span className={`absolute bottom-0 left-0 h-1 bg-amber-400 transform origin-left transition-all duration-1000 ${
                isRevealed ? 'w-1/2' : 'w-0'
              }`} style={{ transitionDelay: '800ms' }}></span>
            </h2>
            <p className="mb-4 text-stone-700">
              Hello, my name is Kian. I started Postman Patisserie to share my passion for artisanal bread with the world.
              I want to make sure everyone can enjoy the simple pleasure of freshly baked bread.
            </p>
            <p className="mb-4 text-stone-700">
              We use only locally-sourced ingredients and traditional fermentation methods to create bread with 
              exceptional flavor and texture. Each loaf is crafted by hand with care and attention to detail.
            </p>
            <p className="text-stone-700">
              Our commitment to quality and sustainability means we bake in small batches daily, reducing waste 
              and ensuring you get the freshest bread possible.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}