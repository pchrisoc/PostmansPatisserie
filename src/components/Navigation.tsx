"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useMediaQuery } from '@/hooks/useMediaQuery';

export default function Navigation() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Mobile hamburger menu
  if (isMobile) {
    return (
      <nav className="relative">
        {/* Hamburger button */}
        <button 
          onClick={toggleMobileMenu}
          className="flex flex-col justify-center items-center w-10 h-10 border border-amber-400 rounded p-1"
          aria-label="Toggle navigation menu"
        >
          <span className={`bg-amber-50 block w-6 h-0.5 my-0.5 transition-transform duration-300 ${mobileMenuOpen ? 'transform rotate-45 translate-y-1.5' : ''}`}></span>
          <span className={`bg-amber-50 block w-6 h-0.5 my-0.5 transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`bg-amber-50 block w-6 h-0.5 my-0.5 transition-transform duration-300 ${mobileMenuOpen ? 'transform -rotate-45 -translate-y-1.5' : ''}`}></span>
        </button>

        {/* Mobile Menu Dropdown */}
        <div className={`absolute right-0 mt-2 w-48 bg-amber-800 shadow-lg rounded-md overflow-hidden transition-all duration-300 transform origin-top-right 
          ${mobileMenuOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}`}>
          <ul className="py-2">
            <li>
              <Link 
                href="/#about" 
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2 text-amber-50 hover:bg-amber-700"
              >
                About
              </Link>
            </li>
            <li>
              <Link 
                href="/#gallery" 
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2 text-amber-50 hover:bg-amber-700"
              >
                Gallery
              </Link>
            </li>
            <li className="border-t border-amber-700 mt-2 pt-2">
              <Link 
                href="/#order" 
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 mx-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-md"
              >
                Order Now
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    );
  }

  // Desktop navigation
  return (
    <nav className="flex items-center gap-2">
      <ul className="flex gap-8">
        <li>
          <Link 
            href="/#about" 
            className="relative overflow-hidden group py-1"
          >
            <span className="relative z-10 transition-colors group-hover:text-white">About</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-200 group-hover:w-full transition-all duration-300"></span>
            <span className="absolute bottom-0 left-0 w-0 h-full bg-amber-600 -z-1 group-hover:w-full transition-all duration-300 opacity-0 group-hover:opacity-20"></span>
          </Link>
        </li>
        <li>
          <Link 
            href="/#gallery" 
            className="relative overflow-hidden group py-1"
          >
            <span className="relative z-10 transition-colors group-hover:text-white">Gallery</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-200 group-hover:w-full transition-all duration-300"></span>
            <span className="absolute bottom-0 left-0 w-0 h-full bg-amber-600 -z-1 group-hover:w-full transition-all duration-300 opacity-0 group-hover:opacity-20"></span>
          </Link>
        </li>
      </ul>

      {/* Order Now button */}
      <Link 
        href="/#order" 
        className="ml-8 bg-amber-600 hover:bg-amber-700 text-white py-2 px-4 rounded-md transition-all duration-300 shadow-md hover:shadow-lg flex items-center transform hover:translate-y-[-2px]"
      >
        Order Now
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </Link>
    </nav>
  );
}