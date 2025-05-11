'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useMediaQuery } from '../hooks/useMediaQuery';

export default function About() {
  const ref = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  // Reduce parallax effect on mobile
  const y = useTransform(scrollYProgress, [0, 1], [0, isMobile ? -50 : -200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, isMobile ? 1 : 1.1]);

  return (
    <motion.div 
      ref={ref}
      className="relative min-h-screen py-16 md:py-0 md:h-screen flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1 }}
      viewport={{ once: true }}
    >
      {/* Background grid lines */}
      <div className="absolute inset-0 grid grid-cols-6 md:grid-cols-12 grid-rows-12 z-0">
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div 
            key={`v-${i}`}
            className={`${i < 6 || !isMobile ? 'col-span-1' : 'hidden'} row-span-full border-r border-white/10`}
            initial={{ height: 0 }}
            whileInView={{ height: "100%" }}
            transition={{ duration: 1.5, delay: i * 0.1 }}
            viewport={{ once: true }}
          />
        ))}
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div 
            key={`h-${i}`}
            className="col-span-full row-span-1 border-b border-white/10"
            initial={{ width: 0 }}
            whileInView={{ width: "100%" }}
            transition={{ duration: 1.5, delay: i * 0.1 }}
            viewport={{ once: true }}
          />
        ))}
      </div>
      
      {/* Parallax content - Dictionary definition */}
      <motion.div 
        className="relative z-10 w-[90%] max-w-4xl mx-auto flex flex-col items-center bg-black/40 backdrop-blur-md border border-white/10 p-4 md:p-10 rounded-lg"
        style={{ y, opacity, scale }}
      >
        <motion.div 
          className="self-start flex flex-col md:flex-row md:items-baseline gap-1 md:gap-3 mb-4 md:mb-6"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">zymome</h2>
          <span className="text-gray-400 italic text-lg md:text-xl">/zīˈmōm/</span>
        </motion.div>
        
        <motion.div
          className="w-full mb-6 md:mb-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="border-b border-white/20 w-full mb-4"></div>
          
          <div className="flex flex-col md:flex-row gap-2 md:gap-6 mb-4">
            <div className="text-gray-400 italic min-w-[60px]">noun</div>
            <div>
              <ol className="list-decimal list-inside space-y-3 md:space-y-4">
                <li className="text-base md:text-xl">
                    <span className="text-white">A name for that constituent of gluten which is insoluble in alcohol.</span>
                    <p className="text-gray-400 ml-4 md:ml-6 mt-1 italic text-sm md:text-base">
                        &ldquo;Researchers isolated the zymome to study its effect on gluten-sensitive individuals.&rdquo;
                    </p>
                </li>
                <li className="text-base md:text-xl">
                    <span className="text-white">A celiac that is immune from alcoholic inebriation.</span>
                    <p className="text-gray-400 ml-4 md:ml-6 mt-1 italic text-sm md:text-base">
                        &ldquo;Legend has it, the zymome could drink all night and still recite poetry without slurring.&rdquo;
                    </p>
                </li>
              </ol>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-2 md:gap-6 mt-6 md:mt-8">
            <div className="text-gray-400 italic min-w-[60px]">origin</div>
            <div className="text-gray-200 text-sm md:text-base">
              Early 21st century: from Greek <span className="italic">zymē</span> (fermentation) + <span className="italic">-ome</span> (denoting a complete system or set).
            </div>
          </div>
        </motion.div>
        
        <motion.div
          className="w-full"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="border-b border-white/20 w-full mb-4"></div>
          <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4">Synonyms</h3>
          <div className="flex flex-wrap gap-2 md:gap-3">
          {[
            "awesome sauce",
            "super celiac",
            "gluten guru",
            "celiac champion",
            "gluten-free wizard",
            "celiac connoisseur",
            ].map((word, index) => (
              <motion.span 
                key={word}
                className="px-2 md:px-3 py-1 rounded-full border border-white/20 bg-white/5 text-xs md:text-sm"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.5 + (index * 0.1) }}
                viewport={{ once: true }}
                whileHover={{ 
                  backgroundColor: "rgba(255,255,255,0.2)",
                  borderColor: "rgba(255,255,255,0.5)"
                }}
              >
                {word}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}