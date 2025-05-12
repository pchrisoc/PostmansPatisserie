"use client";

import React from 'react';
import Link from 'next/link';

export default function Navigation() {
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
        <li>
          <Link 
            href="/#order" 
            className="relative overflow-hidden group py-1"
          >
            <span className="relative z-10 transition-colors group-hover:text-white">Order</span>
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