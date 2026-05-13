'use client';

import { useState } from 'react';
import Image, { ImageProps } from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface OptimizedImageProps extends ImageProps {
  containerClassName?: string;
}

export default function OptimizedImage({ 
  containerClassName = '', 
  className = '',
  alt,
  ...props 
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className={`relative overflow-hidden ${containerClassName}`}>
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="skeleton"
          />
        )}
      </AnimatePresence>
      <Image
        {...props}
        alt={alt}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
}
