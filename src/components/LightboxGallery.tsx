'use client';

import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';
import OptimizedImage from './OptimizedImage';

interface LightboxGalleryProps {
  images: string[];
  title: string;
}

export default function LightboxGallery({ images, title }: LightboxGalleryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);


  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const handleDragEnd = (e: any, { offset, velocity }: any) => {
    const swipe = swipePower(offset.x, velocity.x);

    if (swipe < -swipeConfidenceThreshold) {
      nextImage();
    } else if (swipe > swipeConfidenceThreshold) {
      prevImage();
    }
  };

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
  };

  const closeLightbox = () => {
    setIsOpen(false);
  };

  const nextImage = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevImage = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };
    
    window.addEventListener('keydown', handleKeyDown);
    // Lock scroll when lightbox is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, nextImage, prevImage]);

  return (
    <>
      <div className="gallery-grid-detail">
        {images.map((img, idx) => (
          <div 
            key={idx} 
            className="gallery-item" 
            style={{ position: 'relative', minHeight: '300px', cursor: 'pointer' }}
            onClick={() => openLightbox(idx)}
          >
            <OptimizedImage 
              src={img} 
              alt={`${title} exploration ${idx + 1}`}
              fill
              className="gallery-image"
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {/* Hover overlay with zoom icon */}
            <div className="gallery-zoom-overlay">
              <ZoomIn size={32} color="white" />
            </div>
          </div>
        ))}
      </div>

      {mounted && createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="lightbox-overlay"
            >
              {/* Top Bar with Close Button */}
              <div className="lightbox-header">
                <button onClick={closeLightbox} className="lightbox-close-btn">
                  <X size={24} />
                </button>
              </div>

              {/* Main Image Area */}
              <div className="lightbox-content" onClick={closeLightbox}>
                <button 
                  className="lightbox-nav-btn lightbox-prev"
                  onClick={prevImage}
                >
                  <ChevronLeft size={32} />
                </button>
                
                <div 
                  className="lightbox-image-container"
                  onClick={(e) => e.stopPropagation()}
                >
                  <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={1}
                    onDragEnd={handleDragEnd}
                    style={{ width: '100%', height: '100%', position: 'relative', cursor: 'grab' }}
                  >
                    <OptimizedImage 
                      src={images[currentIndex]}
                      alt={`${title} zoomed image`}
                      fill
                      style={{ objectFit: 'contain' }}
                      sizes="100vw"
                      quality={100}
                    />
                  </motion.div>
                </div>

                <button 
                  className="lightbox-nav-btn lightbox-next"
                  onClick={nextImage}
                >
                  <ChevronRight size={32} />
                </button>
              </div>

              {/* Thumbnails Area */}
              <div className="lightbox-thumbnails-wrapper hide-scrollbar">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`lightbox-thumbnail ${currentIndex === idx ? 'active' : ''}`}
                  >
                    <OptimizedImage 
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      fill
                      style={{ objectFit: 'cover' }}
                      sizes="150px"
                    />
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
