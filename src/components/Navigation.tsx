'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  
  const navItems = [
    { name: 'HOME', path: '#' },
    { name: 'ABOUT', path: '#about' },
    { name: 'GALLERY', path: '#gallery' },
  ];
  
  // Handle scroll events to change navigation appearance
  // Removed unused scroll effect
  
  const menuVariants = {
    closed: {
      opacity: 0,
      x: "100%",
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    closed: { opacity: 0, x: 50 },
    open: { opacity: 1, x: 0 }
  };
  
  return (
    <>
      {/* Navigation bar */}
      <motion.nav 
        className={`fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 md:px-8 py-4 md:py-6 transition-colors duration-300`}
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 100, 
            delay: 0.5 
          }}
        >
        <motion.div 
          className="text-xl md:text-2xl font-bold tracking-wider"
          whileHover={{ scale: 1.05 }}
        >
          ZYMO.ME
        </motion.div>
        
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="w-10 h-10 md:w-12 md:h-12 flex flex-col justify-center items-center gap-1.5 z-50"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <motion.span 
            className="w-6 md:w-8 h-0.5 bg-white block"
            animate={{ 
              rotate: isOpen ? 45 : 0,
              y: isOpen ? 8 : 0
            }}
          />
          <motion.span 
            className="w-6 md:w-8 h-0.5 bg-white block"
            animate={{ opacity: isOpen ? 0 : 1 }}
          />
          <motion.span 
            className="w-6 md:w-8 h-0.5 bg-white block"
            animate={{ 
              rotate: isOpen ? -45 : 0,
              y: isOpen ? -8 : 0
            }}
          />
        </motion.button>
      </motion.nav>
      
      {/* Full screen menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/90 backdrop-blur-lg z-40 flex items-center justify-center"
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
          >
            <motion.ul className="flex flex-col gap-6 md:gap-8 text-center">
              {navItems.map((item) => (
                <motion.li 
                  key={item.name}
                  variants={itemVariants}
                  whileHover={{ scale: 1.1, x: 20 }}
                >
                  <a 
                    href={item.path} 
                    className="text-2xl md:text-4xl font-bold tracking-widest hover:text-gray-300 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </a>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}