// src/components/OptimizedImage.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { useImageOptimization } from './useImageOptimization';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  loading?: 'lazy' | 'eager';
  decoding?: 'async' | 'sync' | 'auto';
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = "",
  placeholder,
  loading = 'lazy',
  decoding = 'async'
}) => {
  const { imageSrc, isLoaded, error } = useImageOptimization({ src, placeholder });

  if (error) {
    return (
      <div className={`bg-neutral-200 flex items-center justify-center ${className}`}>
        <span className="text-neutral-500 text-sm">Image failed to load</span>
      </div>
    );
  }

  return (
    <motion.img
      src={imageSrc}
      alt={alt}
      className={className}
      loading={loading}
      decoding={decoding}
      initial={{ opacity: 0 }}
      animate={{ opacity: isLoaded ? 1 : 0.7 }}
      transition={{ duration: 0.3 }}
      style={{
        filter: isLoaded ? 'none' : 'blur(5px)',
        transition: 'filter 0.3s ease-out'
      }}
    />
  );
};