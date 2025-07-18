// src/components/products/ProductCard.tsx
import React, { memo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Star, Eye } from 'lucide-react';
import { formatPriceByLanguage } from '../../utils/currency';

export interface ProductCardData {
  id: number;
  title: string;
  description: string;
  price: number;
  image: string;
  slug: string;
  stock: number;
  category?: number;
  featured?: boolean;
}

interface ProductCardProps {
  product: ProductCardData;
  index?: number;
  language: string;
  variant?: 'default' | 'featured' | 'compact';
  showStock?: boolean;
  onAddToCart?: (product: ProductCardData) => void;
  onViewMore?: (product: ProductCardData) => void;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = memo(({
  product,
  index = 0,
  language,
  variant = 'default',
  showStock = true,
  onAddToCart,
  onViewMore,
  className = ""
}) => {
  const handleAddToCart = useCallback(() => {
    console.log('Added to cart:', product.id, product.title);
    onAddToCart?.(product);
  }, [product, onAddToCart]);

  const handleViewMore = useCallback(() => {
    console.log('View more:', product.slug);
    onViewMore?.(product);
  }, [product, onViewMore]);

  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock < 10;
  const isFeatured = product.featured || variant === 'featured';

  const containerClasses = {
    default: "bg-white/90",
    featured: "bg-gradient-to-br from-white via-amber-50/30 to-orange-50/20",
    compact: "bg-white/90"
  };

  const imageHeights = {
    default: "h-72",
    featured: "h-80", 
    compact: "h-64"
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true, margin: "50px" }}
      className={`${containerClasses[variant]} backdrop-blur-sm border border-neutral-200/50 rounded-2xl overflow-hidden group hover:shadow-2xl transition-all duration-500 ${className}`}
      whileHover={{ y: -8, scale: 1.02 }}
    >
      {/* Image Section */}
      <div className={`relative ${imageHeights[variant]} bg-gradient-to-br from-neutral-50 to-neutral-100 overflow-hidden`}>
        {/* Subtle background decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-4 right-4 w-24 h-24 bg-amber-200/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-4 left-4 w-32 h-32 bg-orange-200/15 rounded-full blur-3xl"></div>
        </div>

        {/* Product Image */}
        <div className="relative z-10 h-full flex items-center justify-center p-2">
          <motion.img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover rounded-xl drop-shadow-lg"
            loading="lazy"
            decoding="async"
            whileHover={{ scale: 1.05, rotate: 2 }}
            transition={{ duration: 0.4 }}
            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
              (e.target as HTMLImageElement).src = '/cookies.webp';
            }}
          />
        </div>

        {/* Featured Badge */}
        {isFeatured && (
          <motion.div 
            className="absolute top-4 left-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg z-20"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
          >
            <Star size={10} className="fill-current" />
            <span>{language === 'es' ? 'Destacado' : 'Featured'}</span>
          </motion.div>
        )}

        {/* Stock Indicators */}
        {showStock && isLowStock && !isOutOfStock && (
          <motion.div 
            className="absolute top-4 right-4 bg-red-500 text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-lg z-20"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
          >
            {language === 'es' ? `Solo ${product.stock}` : `Only ${product.stock}`}
          </motion.div>
        )}

        {/* Sold Out Overlay */}
        {isOutOfStock && (
          <motion.div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
          >
            <span className="bg-red-500 text-white px-6 py-3 rounded-full text-sm font-bold shadow-xl">
              {language === 'es' ? 'Agotado' : 'Sold Out'}
            </span>
          </motion.div>
        )}

        {/* Hover View Details */}
        <motion.div 
          className="absolute inset-0 bg-black/0 group-hover:bg-black/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-20"
        >
          <motion.button
            onClick={handleViewMore}
            className="bg-white/95 backdrop-blur-sm text-zinc-900 px-5 py-3 rounded-full font-semibold flex items-center gap-2 shadow-xl border border-white/30"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Eye size={16} />
            <span>{language === 'es' ? 'Ver detalles' : 'View details'}</span>
          </motion.button>
        </motion.div>
      </div>

      {/* Content Section */}
      <div className={`${variant === 'compact' ? 'p-4' : 'p-6'} relative`}>
        {/* Price Badge */}
        <motion.div 
          className="absolute -top-6 right-4 bg-white/95 backdrop-blur-md rounded-full px-4 py-2 shadow-lg border border-neutral-200/50 z-10"
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
        >
          <span className={`font-black text-zinc-900 ${variant === 'compact' ? 'text-sm' : 'text-lg'}`}>
            {formatPriceByLanguage(product.price / 100, language)}
          </span>
        </motion.div>

        {/* Product Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
        >
          <h3 className={`font-bold text-zinc-900 mb-3 group-hover:text-amber-600 transition-colors leading-tight ${
            variant === 'compact' ? 'text-base' : 'text-xl'
          }`}>
            {product.title}
          </h3>
          
          <p className={`text-neutral-600 mb-6 leading-relaxed ${
            variant === 'compact' ? 'text-xs line-clamp-2' : 'text-sm line-clamp-3'
          }`}>
            {product.description}
          </p>
        </motion.div>

        {/* Actions */}
        <motion.div 
          className="flex items-center justify-between gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
        >
          <motion.button 
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`flex items-center gap-2 px-5 py-3 rounded-full font-semibold transition-all duration-300 flex-1 justify-center ${
              variant === 'compact' ? 'text-xs px-4 py-2.5' : 'text-sm'
            } ${
              isOutOfStock
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                : 'bg-zinc-900 text-white hover:bg-amber-500 shadow-lg hover:shadow-xl'
            }`}
            whileHover={!isOutOfStock ? { scale: 1.02, y: -2 } : {}}
            whileTap={!isOutOfStock ? { scale: 0.98 } : {}}
          >
            <ShoppingBag size={variant === 'compact' ? 14 : 16} />
            <span>
              {isOutOfStock 
                ? (language === 'es' ? 'Agotado' : 'Sold Out')
                : (language === 'es' ? 'Agregar' : 'Add to Cart')
              }
            </span>
          </motion.button>

          <motion.button 
            onClick={handleViewMore}
            className={`text-amber-600 font-semibold hover:text-amber-700 transition-colors px-2 ${
              variant === 'compact' ? 'text-xs' : 'text-sm'
            }`}
            whileHover={{ x: 5 }}
          >
            {language === 'es' ? 'Ver más →' : 'View more →'}
          </motion.button>
        </motion.div>
      </div>
    </motion.article>
  );
});