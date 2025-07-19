// src/components/products/ProductCard.tsx
import React, { memo, useCallback, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Star, Eye, Minus, Plus, AlertTriangle } from 'lucide-react';
import { formatPriceByLanguage } from '../../utils/currency';
import { useCart } from '../../contexts/CartContext';

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
  onAddToCart?: (product: ProductCardData, quantity: number) => void;
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
  const [quantity, setQuantity] = useState(1);
  const [isHovered, setIsHovered] = useState(false);
  const { state: cartState } = useCart();

  // Calcular stock disponible considerando lo que ya está en el carrito
  const availableStock = useMemo(() => {
    const cartItem = cartState.items.find(item => item.id === product.id);
    const inCartQuantity = cartItem ? cartItem.quantity : 0;
    return Math.max(0, product.stock - inCartQuantity);
  }, [product.id, product.stock, cartState.items]);

  const isOutOfStock = product.stock === 0 || availableStock === 0;
  const isLowStock = availableStock > 0 && availableStock < 10;
  const isFeatured = product.featured || variant === 'featured';

  // Verificar si se puede agregar la cantidad actual
  const canAddToCart = useMemo(() => {
    return availableStock >= quantity && !isOutOfStock;
  }, [availableStock, quantity, isOutOfStock]);

  const handleAddToCart = useCallback(() => {
    if (!canAddToCart) {
      console.warn('Cannot add to cart: insufficient stock', {
        requested: quantity,
        available: availableStock,
        inStock: product.stock,
        product: product.title
      });
      return;
    }

    console.log('Added to cart:', product.id, product.title, 'Quantity:', quantity, 'Available after:', availableStock - quantity);
    onAddToCart?.(product, quantity);
    setQuantity(1);
  }, [product, onAddToCart, quantity, canAddToCart, availableStock]);

  const handleViewMore = useCallback(() => {
    console.log('View more:', product.slug);
    onViewMore?.(product);
  }, [product, onViewMore]);

  const handleQuantityChange = (delta: number) => {
    const newQuantity = Math.max(1, Math.min(availableStock, quantity + delta));
    setQuantity(newQuantity);
  };

  const containerClasses = {
    default: "bg-white/90",
    featured: "bg-gradient-to-br from-white via-amber-50/30 to-orange-50/20",
    compact: "bg-white/90"
  };

  const imageHeights = {
    default: "h-48 sm:h-64 lg:h-72",
    featured: "h-56 sm:h-72 lg:h-80", 
    compact: "h-40 sm:h-48 lg:h-64"
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true, margin: "50px" }}
      className={`${containerClasses[variant]} backdrop-blur-sm border border-neutral-200/50 rounded-xl lg:rounded-2xl overflow-hidden group hover:shadow-2xl transition-all duration-500 ${className}`}
      whileHover={{ y: -4, scale: 1.01 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className={`relative ${imageHeights[variant]} bg-gradient-to-br from-neutral-50 to-neutral-100 overflow-hidden`}>
        <div className="absolute inset-0">
          <div className="absolute top-2 right-2 lg:top-4 lg:right-4 w-16 h-16 lg:w-24 lg:h-24 bg-amber-200/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-2 left-2 lg:bottom-4 lg:left-4 w-20 h-20 lg:w-32 lg:h-32 bg-orange-200/15 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 h-full flex items-center justify-center p-2">
          <motion.img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover rounded-lg lg:rounded-xl drop-shadow-lg"
            loading="lazy"
            decoding="async"
            whileHover={{ scale: 1.05, rotate: 2 }}
            transition={{ duration: 0.4 }}
            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
              (e.target as HTMLImageElement).src = '/cookies.webp';
            }}
          />
        </div>

        {isFeatured && (
          <motion.div 
            className="absolute top-2 left-2 lg:top-4 lg:left-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-2 py-1 lg:px-3 lg:py-1.5 rounded-full text-xs font-bold flex items-center gap-1 lg:gap-1.5 shadow-lg z-20"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
          >
            <Star size={8} className="fill-current lg:w-[10px] lg:h-[10px]" />
            <span className="text-xs">{language === 'es' ? 'Destacado' : 'Featured'}</span>
          </motion.div>
        )}

        {showStock && isLowStock && !isOutOfStock && (
          <motion.div 
            className="absolute top-2 right-2 lg:top-4 lg:right-4 bg-red-500 text-white px-2 py-1 lg:px-2.5 lg:py-1 rounded-full text-xs font-bold shadow-lg z-20"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
          >
            {language === 'es' ? `Solo ${availableStock}` : `Only ${availableStock}`}
          </motion.div>
        )}

        {isOutOfStock && (
          <motion.div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
          >
            <span className="bg-red-500 text-white px-4 py-2 lg:px-6 lg:py-3 rounded-full text-xs lg:text-sm font-bold shadow-xl">
              {language === 'es' ? 'Agotado' : 'Sold Out'}
            </span>
          </motion.div>
        )}

        <motion.div 
          className="absolute inset-0 bg-black/0 group-hover:bg-black/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-20"
        >
          <motion.button
            onClick={handleViewMore}
            className="bg-white/95 backdrop-blur-sm text-zinc-900 px-3 py-2 lg:px-5 lg:py-3 rounded-full font-semibold flex items-center gap-2 shadow-xl border border-white/30 text-xs lg:text-sm"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Eye size={14} className="lg:w-[16px] lg:h-[16px]" />
            <span>{language === 'es' ? 'Ver detalles' : 'View details'}</span>
          </motion.button>
        </motion.div>
      </div>

      <div className={`${variant === 'compact' ? 'p-3 lg:p-4' : 'p-4 lg:p-6'} relative`}>
        <motion.div 
          className="absolute -top-4 lg:-top-6 right-3 lg:right-4 bg-white/95 backdrop-blur-md rounded-full px-3 py-1.5 lg:px-4 lg:py-2 shadow-lg border border-neutral-200/50 z-10"
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
        >
          <span className={`font-black text-zinc-900 ${variant === 'compact' ? 'text-xs lg:text-sm' : 'text-sm lg:text-lg'}`}>
            {formatPriceByLanguage(product.price / 100, language)}
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
        >
          <h3 className={`font-bold text-zinc-900 mb-2 lg:mb-3 group-hover:text-amber-600 transition-colors leading-tight ${
            variant === 'compact' ? 'text-sm lg:text-base' : 'text-base lg:text-xl'
          }`}>
            {product.title}
          </h3>
          
          <p className={`text-neutral-600 mb-4 lg:mb-6 leading-relaxed ${
            variant === 'compact' ? 'text-xs line-clamp-2' : 'text-xs lg:text-sm line-clamp-3'
          }`}>
            {product.description}
          </p>
        </motion.div>

        {/* Stock warning si hay items en carrito */}
        {cartState.items.find(item => item.id === product.id) && availableStock < product.stock && !isOutOfStock && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-3 p-2 bg-amber-50 border border-amber-200 rounded-lg"
          >
            <div className="flex items-center gap-2">
              <AlertTriangle size={14} className="text-amber-600 flex-shrink-0" />
              <span className="text-xs text-amber-700">
                {language === 'es' 
                  ? `Ya tienes ${product.stock - availableStock} en el carrito. Quedan ${availableStock} disponibles.`
                  : `You have ${product.stock - availableStock} in cart. ${availableStock} remaining.`
                }
              </span>
            </div>
          </motion.div>
        )}

        <motion.div
          className={`mb-4 ${
            variant === 'compact' || window.innerWidth < 1024 ? 'block' : ''
          }`}
          initial={{ opacity: 0, height: 0 }}
          animate={{ 
            opacity: isHovered || variant === 'compact' || window.innerWidth < 1024 ? 1 : 0,
            height: isHovered || variant === 'compact' || window.innerWidth < 1024 ? 'auto' : 0
          }}
          transition={{ duration: 0.2 }}
          style={{
            display: isHovered || variant === 'compact' || window.innerWidth < 1024 ? 'block' : 'none'
          }}
        >
          <div className="flex items-center justify-center space-x-3 bg-neutral-50 rounded-xl p-2">
            <span className="text-xs lg:text-sm font-medium text-neutral-600">
              {language === 'es' ? 'Cantidad:' : 'Quantity:'}
            </span>
            
            <div className="flex items-center space-x-2">
              <motion.button
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
                className="w-6 h-6 lg:w-8 lg:h-8 bg-white rounded-full flex items-center justify-center border border-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-100 transition-colors"
                whileHover={{ scale: quantity > 1 ? 1.1 : 1 }}
                whileTap={{ scale: quantity > 1 ? 0.9 : 1 }}
              >
                <Minus size={12} className="lg:w-[14px] lg:h-[14px]" />
              </motion.button>
              
              <span className="w-8 lg:w-10 text-center font-bold text-zinc-900 text-sm lg:text-base">
                {quantity}
              </span>
              
              <motion.button
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= availableStock}
                className="w-6 h-6 lg:w-8 lg:h-8 bg-white rounded-full flex items-center justify-center border border-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-100 transition-colors"
                whileHover={{ scale: quantity < availableStock ? 1.1 : 1 }}
                whileTap={{ scale: quantity < availableStock ? 0.9 : 1 }}
              >
                <Plus size={12} className="lg:w-[14px] lg:h-[14px]" />
              </motion.button>
            </div>
            
            <span className="text-xs text-neutral-500">
              {language === 'es' ? `(${availableStock} disponibles)` : `(${availableStock} available)`}
            </span>
          </div>
        </motion.div>

        <motion.div 
          className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 lg:gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
        >
          <motion.button 
            onClick={handleAddToCart}
            disabled={isOutOfStock || !canAddToCart}
            className={`flex items-center gap-2 px-3 py-2 lg:px-5 lg:py-3 rounded-full font-semibold transition-all duration-300 flex-1 sm:flex-none justify-center ${
              variant === 'compact' ? 'text-xs px-3 py-2' : 'text-xs lg:text-sm'
            } ${
              isOutOfStock || !canAddToCart
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                : 'bg-zinc-900 text-white hover:bg-amber-500 shadow-lg hover:shadow-xl'
            }`}
            whileHover={canAddToCart ? { scale: 1.02, y: -2 } : {}}
            whileTap={canAddToCart ? { scale: 0.98 } : {}}
          >
            <ShoppingBag size={12} className="lg:w-[16px] lg:h-[16px]" />
            <span>
              {isOutOfStock 
                ? (language === 'es' ? 'Agotado' : 'Sold Out')
                : !canAddToCart
                ? (language === 'es' ? 'Sin stock' : 'No stock')
                : (language === 'es' ? 'Agregar' : 'Add to Cart')
              }
              {canAddToCart && quantity > 1 && ` (${quantity})`}
            </span>
          </motion.button>

          <motion.button 
            onClick={handleViewMore}
            className={`text-amber-600 font-semibold hover:text-amber-700 transition-colors px-2 whitespace-nowrap ${
              variant === 'compact' ? 'text-xs' : 'text-xs lg:text-sm'
            }`}
            whileHover={{ x: 5 }}
          >
            {language === 'es' ? 'Ver más →' : 'View more →'}
          </motion.button>
        </motion.div>

        {showStock && availableStock && availableStock < 20 && !isOutOfStock && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-3 text-center"
          >
            <span className={`text-xs px-2 py-1 rounded-full ${
              availableStock < 5 
                ? 'bg-red-100 text-red-600' 
                : 'bg-yellow-100 text-yellow-600'
            }`}>
              {language === 'es' 
                ? `Quedan ${availableStock} unidades`
                : `${availableStock} units left`
              }
            </span>
          </motion.div>
        )}
      </div>
    </motion.article>
  );
});