'use client';

import { useEffect, useState } from 'react';
import { useInView } from 'framer-motion';

/**
 * Custom hook for revealing elements when they're scrolled into view
 * @param ref The reference to the element to observe
 * @param options Configuration options for the reveal animation
 * @returns boolean indicating if the element is in view
 */
export function useScrollReveal(
  ref: React.RefObject<HTMLElement>,
  options: {
    onEnter?: () => void;
    onExit?: () => void;
    once?: boolean;
    threshold?: number;
  } = {}
): boolean {
  const [isRevealed, setIsRevealed] = useState(false);
  const { 
    once = true, 
    threshold = 0.2,
    onEnter,
    onExit
  } = options;
  
  // Safe guard against ref being null
  const inView = useInView(ref, { 
    once,
    amount: threshold 
  });
  
  useEffect(() => {
    if (inView) {
      setIsRevealed(true);
      onEnter?.();
    } else if (!once) {
      setIsRevealed(false);
      onExit?.();
    }
  }, [inView, once, onEnter, onExit]);
  
  return isRevealed;
}