'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';

export default function Title() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  
  useEffect(() => {
    if (!containerRef.current || !textRef.current) return;
    
    // Create a glitch effect on the text
    const timeline = gsap.timeline({ repeat: -1, repeatDelay: 5 });
    
    timeline.to(textRef.current, {
      skewX: 70,
      duration: 0.04,
      opacity: 0.8,
    })
    .to(textRef.current, {
      skewX: 0,
      duration: 0.04,
      opacity: 1,
    })
    .to(textRef.current, {
      skewX: -70,
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
  }, []);
  
  return (
    <motion.div 
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      className="w-full min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
    >
      {/* Animated background grid */}
      <div className="absolute top-0 left-0 w-full h-full grid grid-cols-[repeat(20,1fr)] grid-rows-[repeat(20,1fr)] opacity-20">
        {Array.from({ length: 400 }).map((_, i) => (
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
        ))}
      </div>
      
      {/* Glowing circles in background */}
      <motion.div 
        className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 filter blur-3xl opacity-20"
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
        className="absolute bottom-1/4 right-1/4 w-60 h-60 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 filter blur-3xl opacity-20"
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
        className="z-10 text-center"
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        transition={{ 
          type: "spring", 
          stiffness: 100, 
          delay: 0.3 
        }}
      >
        <motion.h1 
          ref={textRef}
          className="text-7xl font-bold tracking-tighter mb-4 glitch-text"
          initial={{ letterSpacing: "0.3em", opacity: 0 }}
          animate={{ letterSpacing: "0.05em", opacity: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
        >
          ZYMO.ME
        </motion.h1>
        
        <motion.p 
          className="text-xl text-gray-300 max-w-xl mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          A celiac&apos;s refuge in the digital world.
        </motion.p>
      </motion.div>
      
    </motion.div>
  );
}