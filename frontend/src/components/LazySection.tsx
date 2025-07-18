// src/components/LazySection.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

interface LazySectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export const LazySection: React.FC<LazySectionProps> = ({ 
  children, 
  className = "",
  delay = 0
}) => {
  const { elementRef, isVisible } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '100px'
  });

  return (
    <div ref={elementRef} className={className}>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.6, 
            delay,
            ease: [0.25, 0.46, 0.45, 0.94] 
          }}
        >
          {children}
        </motion.div>
      )}
    </div>
  );
};