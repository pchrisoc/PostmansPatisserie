'use client';

import { useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function Title() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  // Use scroll reveal for the content section
  const isContentVisible = useScrollReveal(contentRef, {
    threshold: 0.1,
    onEnter: () => {
      console.log('Content has entered the viewport');
    }
  });
  
  useEffect(() => {
    if (!containerRef.current || !textRef.current) return;
    
    // Create a glitch effect on the text
    const timeline = gsap.timeline({ repeat: -1, repeatDelay: isMobile ? 8 : 5 });
    
    timeline.to(textRef.current, {
      skewX: isMobile ? 50 : 70,
      duration: 0.04,
      opacity: 0.8,
    })
    .to(textRef.current, {
      skewX: 0,
      duration: 0.04,
      opacity: 1,
    })
    .to(textRef.current, {
      skewX: isMobile ? -50 : -70,
      duration: 0.04,
      opacity: 0.8,
    })
    .to(textRef.current, {
      skewX: 0,
      duration: 0.04,
      opacity: 1,
    });
    
    return () => {
      timeline.kill();
    };
  }, [isMobile]);
  
  // Memoize grid elements creation to prevent unnecessary re-renders
  const renderGridElements = useCallback(() => {
    const count = isMobile ? 100 : 400;
    return Array.from({ length: count }).map((_, i) => (
      <motion.div 
        key={i}
        className="border border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: Math.random() }}
        transition={{ 
          duration: 3, 
          repeat: Infinity, 
          repeatType: "reverse", 
          delay: Math.random() * 5 
        }}
      />
    ));
  }, [isMobile]);
  
  return (
    <motion.div 
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      className="w-full min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
    >
      {/* Animated background grid - reduce count on mobile */}
      <div className="absolute top-0 left-0 w-full h-full grid grid-cols-[repeat(10,1fr)] md:grid-cols-[repeat(20,1fr)] grid-rows-[repeat(10,1fr)] md:grid-rows-[repeat(20,1fr)] opacity-20">
        {renderGridElements()}
      </div>
      
      {/* Glowing circles in background */}
      <motion.div 
        className="absolute top-1/4 left-1/4 w-40 md:w-80 h-40 md:h-80 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 filter blur-3xl opacity-20"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 30, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      
      <motion.div 
        className="absolute bottom-1/4 right-1/4 w-40 md:w-60 h-40 md:h-60 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 filter blur-3xl opacity-20"
        animate={{
          scale: [1, 1.1, 1],
          x: [0, -20, 0],
          y: [0, 20, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      
      {/* Main content */}
      <motion.div
        ref={contentRef}
        className="z-10 text-center px-4"
        initial={{ y: 50, opacity: 0 }}
        animate={{ 
          y: isContentVisible ? 0 : 50,
          opacity: isContentVisible ? 1 : 0 
        }}
        transition={{ 
          type: "spring", 
          stiffness: 100, 
          damping: 15
        }}
      >
        <motion.h1 
          ref={textRef}
          className="text-4xl md:text-7xl font-bold tracking-tighter mb-4 glitch-text"
          initial={{ letterSpacing: "0.3em", opacity: 0 }}
          animate={{ letterSpacing: isMobile ? "0.1em" : "0.05em", opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          ZYMO.ME
        </motion.h1>
        
        <motion.p 
          className="text-lg md:text-xl text-gray-300 max-w-xl mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          A celiac&apos;s refuge in the digital world.
        </motion.p>
      </motion.div>
    </motion.div>
  );
}