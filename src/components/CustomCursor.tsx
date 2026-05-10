'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isText, setIsText] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 300 };
  const springX = useSpring(cursorX, springConfig);
  const springY = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      const isClickable = target.tagName === 'A' || 
                         target.tagName === 'BUTTON' || 
                         !!target.closest('a') || 
                         !!target.closest('button') ||
                         target.classList.contains('clickable');

      const isInput = target.tagName === 'INPUT' || 
                     target.tagName === 'TEXTAREA' ||
                     !!target.closest('.form-group');

      setIsHovering(!!isClickable);
      setIsText(!!isInput);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [cursorX, cursorY]);

  return (
    <>
      <style jsx global>{`
        body, a, button, input, textarea {
          cursor: none !important;
        }
        @media (max-width: 768px) {
          .custom-cursor {
            display: none !important;
          }
          body, a, button, input, textarea {
            cursor: auto !important;
          }
        }
      `}</style>

      {/* Main Dot */}
      <motion.div
        className="custom-cursor dot"
        style={{
          left: cursorX,
          top: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: isClicking ? 0.8 : isHovering ? 1.5 : 1,
          backgroundColor: isHovering || isText ? '#FF6B1A' : '#ffffff',
          width: isText ? 2 : 8,
          height: isText ? 24 : 8,
          borderRadius: isText ? 2 : 8,
        }}
        transition={{ type: 'spring', damping: 20, stiffness: 400 }}
      />

      {/* Outer Ring */}
      <motion.div
        className="custom-cursor ring"
        style={{
          left: springX,
          top: springY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: isClicking ? 1.5 : isHovering ? 2.5 : isText ? 0.5 : 1,
          borderColor: isHovering || isText ? '#FF6B1A' : 'rgba(255, 255, 255, 0.3)',
          opacity: isText ? 0.2 : isClicking ? 0.5 : 1,
        }}
      />
    </>
  );
}
