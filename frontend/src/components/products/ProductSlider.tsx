// src/components/products/ProductSlider.tsx
import React, { useState, useRef, useEffect, memo } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductCard } from './ProductCard';
import type { ProductCardData } from './ProductCard';

interface ProductSliderProps {
  products: ProductCardData[];
  language: string;
  title?: string;
  subtitle?: string;
  variant?: 'default' | 'featured' | 'compact';
  showStock?: boolean;
  slidesToShow?: number;
  autoplay?: boolean;
  autoplayInterval?: number;
  onAddToCart?: (product: ProductCardData) => void;
  onViewMore?: (product: ProductCardData) => void;
  onViewAll?: () => void;
  className?: string;
}

export const ProductSlider: React.FC<ProductSliderProps> = memo(({
  products,
  language,
  title,
  subtitle,
  variant = 'default',
  showStock = true,
  slidesToShow = 3,
  autoplay = false,
  autoplayInterval = 5000,
  onAddToCart,
  onViewMore,
  onViewAll,
  className = ""
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);

  // Responsive slides configuration
  const [responsiveSlides, setResponsiveSlides] = useState(slidesToShow);

  useEffect(() => {
    const updateSlidesToShow = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setResponsiveSlides(1);
      } else if (width < 1024) {
        setResponsiveSlides(2);
      } else {
        setResponsiveSlides(slidesToShow);
      }
    };

    updateSlidesToShow();
    window.addEventListener('resize', updateSlidesToShow);
    return () => window.removeEventListener('resize', updateSlidesToShow);
  }, [slidesToShow]);

  const maxIndex = Math.max(0, products.length - responsiveSlides);

  // Autoplay functionality
  useEffect(() => {
    if (autoplay && products.length > responsiveSlides) {
      autoplayRef.current = setInterval(() => {
        setCurrentIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
      }, autoplayInterval);

      return () => {
        if (autoplayRef.current) {
          clearInterval(autoplayRef.current);
        }
      };
    }
  }, [autoplay, autoplayInterval, maxIndex, products.length, responsiveSlides]);

  const handlePrevious = () => {
    if (autoplayRef.current) clearInterval(autoplayRef.current);
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    if (autoplayRef.current) clearInterval(autoplayRef.current);
    setCurrentIndex(prev => Math.min(maxIndex, prev + 1));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - dragStart;
    const threshold = 100;

    if (Math.abs(deltaX) > threshold) {
      if (deltaX > 0) {
        handlePrevious();
      } else {
        handleNext();
      }
      setIsDragging(false);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  if (products.length === 0) {
    return null;
  }

  return (
    <section className={`py-8 ${className}`}>
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        {(title || subtitle) && (
          <motion.div 
            className="flex justify-between items-end mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div>
              {subtitle && (
                <span className="text-sm font-bold text-amber-600 tracking-[0.3em] uppercase mb-2 block">
                  {subtitle}
                </span>
              )}
              {title && (
                <h2 className="text-3xl lg:text-5xl font-black text-zinc-900">
                  {title}
                </h2>
              )}
            </div>
            
            {onViewAll && (
              <motion.button
                onClick={onViewAll}
                className="text-amber-600 font-semibold hover:text-amber-700 transition-colors"
                whileHover={{ x: 5 }}
              >
                {language === 'es' ? 'Ver todos' : 'View all'}
              </motion.button>
            )}
          </motion.div>
        )}

        {/* Slider Container */}
        <div className="relative">
          
          {/* Navigation Buttons */}
          {products.length > responsiveSlides && (
            <>
              <motion.button
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center transition-all duration-300 ${
                  currentIndex === 0 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:bg-amber-500 hover:text-white'
                }`}
                whileHover={{ scale: currentIndex === 0 ? 1 : 1.1 }}
                whileTap={{ scale: currentIndex === 0 ? 1 : 0.9 }}
                style={{ marginLeft: '-24px' }}
              >
                <ChevronLeft size={20} />
              </motion.button>

              <motion.button
                onClick={handleNext}
                disabled={currentIndex >= maxIndex}
                className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center transition-all duration-300 ${
                  currentIndex >= maxIndex 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:bg-amber-500 hover:text-white'
                }`}
                whileHover={{ scale: currentIndex >= maxIndex ? 1 : 1.1 }}
                whileTap={{ scale: currentIndex >= maxIndex ? 1 : 0.9 }}
                style={{ marginRight: '-24px' }}
              >
                <ChevronRight size={20} />
              </motion.button>
            </>
          )}

          {/* Products Grid/Slider */}
          <div
            ref={sliderRef}
            className="overflow-hidden"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <motion.div
              className="flex gap-6"
              animate={{
                x: `${-currentIndex * (100 / responsiveSlides)}%`
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30
              }}
            >
              {products.map((product, index) => (
                <div
                  key={product.id}
                  className="flex-shrink-0"
                  style={{ width: `${100 / responsiveSlides}%` }}
                >
                  <ProductCard
                    product={product}
                    index={index}
                    language={language}
                    variant={variant}
                    showStock={showStock}
                    onAddToCart={onAddToCart}
                    onViewMore={onViewMore}
                    className="mx-2"
                  />
                </div>
              ))}
            </motion.div>
          </div>

          {/* Dots Indicator */}
          {products.length > responsiveSlides && (
            <motion.div 
              className="flex justify-center mt-8 space-x-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {Array.from({ length: maxIndex + 1 }).map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex 
                      ? 'bg-amber-500 scale-125' 
                      : 'bg-neutral-300 hover:bg-neutral-400'
                  }`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
});