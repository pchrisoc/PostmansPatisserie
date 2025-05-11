'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';

interface MousePosition {
  x: number;
  y: number;
}

export default function CursorTrail() {
  const [mousePosition, setMousePosition] = useState<MousePosition | null>(null);
  const [cursorHistory, setCursorHistory] = useState<MousePosition[]>([]);
  const [isMoving, setIsMoving] = useState(false);
  const historyLimit = 20; // More points for a longer trail
  const requestRef = useRef<number | undefined>(undefined);
  const previousTimeRef = useRef<number | undefined>(undefined);
  const moveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Handle mouse move events
  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      setIsMoving(true);
      
      // Clear any existing timeout
      if (moveTimeoutRef.current) {
        clearTimeout(moveTimeoutRef.current);
      }
      
      // Set a timeout to detect when mouse stops moving
      moveTimeoutRef.current = setTimeout(() => {
        setIsMoving(false);
      }, 100); // Adjust this value to change how quickly the trail dissipates
    };
    
    window.addEventListener('mousemove', updateMousePosition);
    
    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      if (moveTimeoutRef.current) {
        clearTimeout(moveTimeoutRef.current);
      }
    };
  }, []);
  
  // Animation loop with requestAnimationFrame for smoother trails
  const animate = useCallback((time: number) => {
    if (previousTimeRef.current !== undefined && mousePosition !== null) {
      // Only update trail when mouse is moving
      if (isMoving) {
        const distanceThreshold = 2;
        const lastPoint = cursorHistory.length > 0 ? cursorHistory[0] : null;
        
        if (
          !lastPoint || 
          Math.sqrt(
            Math.pow(lastPoint.x - mousePosition.x, 2) + 
            Math.pow(lastPoint.y - mousePosition.y, 2)
          ) > distanceThreshold
        ) {
          setCursorHistory(prev => {
            const newHistory = [mousePosition, ...prev];
            return newHistory.slice(0, historyLimit);
          });
        }
      } else if (cursorHistory.length > 0) {
        // Gradually reduce trail size when not moving
        setCursorHistory(prev => {
          if (prev.length <= 1) return [];
          return prev.slice(0, prev.length - 1);
        });
      }
    }
    
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  }, [mousePosition, isMoving, cursorHistory, historyLimit]);
  
  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [animate]);
  
  if (mousePosition === null) {
    return null;
  }
  
  // Generate a color based on position for more dynamic trails
  const getHue = (x: number, y: number, index: number) => {
    return (x + y + index * 5) % 360;
  };
  
  return (
    <>
      {/* Cursor trail with particle effect */}
      {cursorHistory.map((point, i) => {
        const hue = getHue(point.x, point.y, i);
        const size = Math.max(5, 25 - i * 1);
        const opacity = Math.max(0.1, 1 - (i / historyLimit));
        
        return (
          <motion.div
            key={i}
            className="fixed rounded-full pointer-events-none"
            style={{
              left: point.x - size / 2,
              top: point.y - size / 2,
              width: size,
              height: size,
              opacity: isMoving ? opacity : opacity * 0.5, // Fade when not moving
              backgroundColor: `hsla(${hue}, 100%, 70%, ${opacity})`,
              boxShadow: `0 0 ${8 + i}px ${i / 2}px hsla(${hue}, 100%, 70%, 0.3)`,
              zIndex: 40 - i,
            }}
            initial={{ scale: 0 }}
            animate={{ 
              scale: isMoving ? 1 : 0.5, // Shrink when not moving
              rotate: i * 10
            }}
            transition={{ 
              duration: 0.4,
              ease: "easeOut"
            }}
          />
        );
      })}
      
      {/* Connecting lines between trail points */}
      <svg className="fixed inset-0 pointer-events-none z-30" style={{ overflow: 'visible' }}>
        {cursorHistory.length > 1 && (
          <motion.path
            d={`M ${cursorHistory.map(p => `${p.x},${p.y}`).join(' L ')}`}
            fill="none"
            stroke={`rgba(255, 255, 255, ${isMoving ? 0.3 : 0.1})`} // Fade when not moving
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="5,5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: 1, 
              opacity: isMoving ? 0.5 : 0.2 // Fade when not moving
            }}
            transition={{ duration: 0.5 }}
          />
        )}
      </svg>
      
      {/* Trail particles for extra effect */}
      {isMoving && cursorHistory.slice(0, 10).map((point, i) => {
        const randomOffset = () => (Math.random() - 0.5) * 30;
        const hue = (getHue(point.x, point.y, i) + 40) % 360;
        
        return (
          <motion.div
            key={`particle-${i}`}
            className="fixed rounded-full pointer-events-none"
            style={{
              left: point.x - 2,
              top: point.y - 2,
              width: 4,
              height: 4,
              backgroundColor: `hsla(${hue}, 100%, 70%, 0.8)`,
            }}
            animate={{
              x: randomOffset(),
              y: randomOffset(),
              opacity: [0.8, 0],
              scale: [1, 0.2]
            }}
            transition={{
              duration: 1,
              ease: "easeOut"
            }}
          />
        );
      })}
    </>
  );
}