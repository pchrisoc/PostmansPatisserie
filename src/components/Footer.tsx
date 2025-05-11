import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-amber-50 text-amber-900 py-12 px-4 md:px-8 mt-auto border-t border-amber-200 relative overflow-hidden transition-all duration-300 hover:bg-amber-100">
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-300 via-amber-500 to-amber-300"></div>
      
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="transform transition-transform duration-300 hover:translate-y-[-5px]">
            <h3 className="text-2xl font-bold mb-4 relative inline-block after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-amber-500 after:left-0 after:bottom-0 hover:after:w-full after:transition-all after:duration-300">Postman Patisserie</h3>
            <p className="mb-2 hover:text-amber-700 transition-colors">kraffian@berkeley.edu</p>
            <p className="mb-2 hover:text-amber-700 transition-colors">(805) 295-0593</p>
          </div>
            <div className="transform transition-transform duration-300 hover:translate-y-[-5px]">
            {/* Middle column - Empty placeholder */}
            </div>
            
            <div className="transform transition-transform duration-300 hover:translate-y-[-5px] text-right">
            <h3 className="text-xl font-bold mb-4 relative inline-block after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-amber-500 after:right-0 after:bottom-0 hover:after:w-full after:transition-all after:duration-300">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/#about" className="hover:text-amber-600 transition-colors relative inline-block after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-amber-400 after:right-0 after:bottom-0 hover:after:w-full after:transition-all after:duration-300">About Us</Link></li>
              <li><Link href="/#gallery" className="hover:text-amber-600 transition-colors relative inline-block after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-amber-400 after:right-0 after:bottom-0 hover:after:w-full after:transition-all after:duration-300">Our Gallery</Link></li>
              <li><Link href="/#order" className="hover:text-amber-600 transition-colors relative inline-block after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-amber-400 after:right-0 after:bottom-0 hover:after:w-full after:transition-all after:duration-300">Order</Link></li>
            </ul>
            </div>
        </div>
        
        <div className="border-t border-amber-200 mt-8 pt-8 text-center">
          <p className="text-amber-800 group">
            &copy; {new Date().getFullYear()} Postman Patisserie. All rights reserved.
            <span className="block text-xs mt-2 text-amber-600 opacity-70 group-hover:opacity-100 transition-opacity duration-300">
              Crafting delicious memories, one loaf at a time.
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}