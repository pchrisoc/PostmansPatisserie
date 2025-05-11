'use client';

import { motion } from 'framer-motion';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="relative py-16 overflow-hidden">
      {/* Animated lines */}
      <div className="absolute inset-0 flex justify-between -z-10 opacity-30">
        {Array.from({ length: 10 }).map((_, i) => (
          <motion.div
            key={i}
            className="w-px bg-gradient-to-b from-transparent via-white to-transparent h-full"
            initial={{ height: 0 }}
            whileInView={{ height: '100%' }}
            transition={{ duration: 1.5, delay: i * 0.1 }}
            viewport={{ once: true }}
          />
        ))}
      </div>
      
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold mb-6">ZYMO.ME</h3>
            <p className="text-gray-400 max-w-xs">
              Pushing the boundaries of gluten-free tolerance in a world of focaccia.
            </p>
          </motion.div>
          
        </div>
        
        <motion.div 
          className="pt-8 border-t border-white/10 text-center text-gray-500 text-sm"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <p>© {currentYear} ZYMO.ME. All rights reserved.</p>
        </motion.div>
      </div>
    </footer>
  );
}