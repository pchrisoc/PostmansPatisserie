'use client';

import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

/**
 * Custom hook for revealing elements when they're scrolled into view
 */
export function useScrollReveal({
  threshold = 0.1,
  triggerOnce = true,
  rootMargin = '0px',
} = {}) {
  const [ref, inView] = useInView({
    threshold,
    triggerOnce,
    rootMargin,
  });

  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    if (inView) {
      setIsRevealed(true);
    }
  }, [inView]);

  return { ref, isRevealed };
}