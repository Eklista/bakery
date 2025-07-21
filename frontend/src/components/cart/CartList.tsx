// src/components/cart/CartList.tsx
import React, { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, Trash2, ShoppingCart, CreditCard, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { formatPriceByLanguage } from '../../utils/currency';

const EmptyCart = memo(() => {
  const { i18n } = useTranslation();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-8 lg:py-12"
    >
      <div className="w-12 h-12 lg:w-16 lg:h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <ShoppingCart className="w-6 h-6 lg:w-8 lg:h-8 text-neutral-400" />
      </div>
      <h3 className="font-bold text-zinc-900 mb-2 text-sm lg:text-base">
        {i18n.language === 'es' ? 'Carrito vacío' : 'Empty cart'}
      </h3>
      <p className="text-neutral-600 text-xs lg:text-sm">
        {i18n.language === 'es' 
          ? 'Agrega productos para comenzar' 
          : 'Add products to get started'}
      </p>
    </motion.div>
  );
});

const CartItem = memo(({ item, index }: { item: any; index: number }) => {
  const { i18n } = useTranslation();
  const { updateQuantity, removeItem } = useCart();

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity === 0) {
      removeItem(item.id);
    } else {
      updateQuantity(item.id, newQuantity);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="bg-white rounded-xl lg:rounded-2xl p-3 lg:p-4 shadow-sm border border-neutral-200"
    >
      <div className="flex items-start space-x-3">
        {/* Imagen */}
        <div className="w-12 h-12 lg:w-16 lg:h-16 bg-neutral-100 rounded-lg lg:rounded-xl overflow-hidden flex-shrink-0">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover"
            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
              (e.target as HTMLImageElement).src = '/cookies.webp';
            }}
          />
        </div>

        {/* Contenido */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <h4 className="font-bold text-zinc-900 text-xs lg:text-sm line-clamp-2 pr-2">
              {item.title}
            </h4>
            
            <motion.button
              onClick={() => removeItem(item.id)}
              className="w-6 h-6 lg:w-8 lg:h-8 flex items-center justify-center text-neutral-400 hover:text-red-500 transition-colors flex-shrink-0"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Trash2 size={12} className="lg:w-[14px] lg:h-[14px]" />
            </motion.button>
          </div>
          
          <div className="flex items-center justify-between">
            <p className="font-bold text-amber-600 text-xs lg:text-sm">
              {formatPriceByLanguage(item.price / 100, i18n.language)}
            </p>
          </div>

          {/* Controles de cantidad */}
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center space-x-1">
              <motion.button
                onClick={() => handleQuantityChange(item.quantity - 1)}
                className="w-6 h-6 lg:w-8 lg:h-8 bg-neutral-100 rounded-full flex items-center justify-center hover:bg-neutral-200 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Minus size={10} className="lg:w-[12px] lg:h-[12px]" />
              </motion.button>
              
              <span className="w-6 lg:w-8 text-center font-bold text-zinc-900 text-xs lg:text-sm">
                {item.quantity}
              </span>
              
              <motion.button
                onClick={() => handleQuantityChange(item.quantity + 1)}
                className="w-6 h-6 lg:w-8 lg:h-8 bg-neutral-100 rounded-full flex items-center justify-center hover:bg-neutral-200 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Plus size={10} className="lg:w-[12px] lg:h-[12px]" />
              </motion.button>
            </div>
            
            <p className="font-bold text-zinc-900 text-xs lg:text-sm">
              {formatPriceByLanguage((item.price * item.quantity) / 100, i18n.language)}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

interface CartListProps {
  isMobile?: boolean;
  onClose?: () => void;
}

export const CartList: React.FC<CartListProps> = memo(({ isMobile = false, onClose }) => {
  const { i18n } = useTranslation();
  const { state, clearCart } = useCart();

  const handleClearCart = () => {
    clearCart();
  };

  if (state.items.length === 0) {
    return (
      <div className={`bg-neutral-50 rounded-2xl lg:rounded-3xl ${
        isMobile ? 'p-4' : 'p-4 lg:p-6 sticky top-24'
      }`}>
        {/* Header para mobile */}
        {isMobile && onClose && (
          <div className="flex items-center justify-between mb-4 lg:mb-6">
            <div className="flex items-center space-x-2">
              <ShoppingCart className="w-4 h-4 lg:w-5 lg:h-5 text-zinc-900" />
              <h2 className="font-semibold lg:font-bold text-zinc-900 text-sm lg:text-base">
                {i18n.language === 'es' ? 'Carrito' : 'Cart'}
              </h2>
            </div>
            <motion.button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-200 transition-colors"
              whileTap={{ scale: 0.95 }}
            >
              <X size={20} />
            </motion.button>
          </div>
        )}
        
        {/* Header para desktop */}
        {!isMobile && (
          <div className="flex items-center space-x-2 mb-4 lg:mb-6">
            <ShoppingCart className="w-4 h-4 lg:w-5 lg:h-5 text-zinc-900" />
            <h2 className="font-semibold lg:font-bold text-zinc-900 text-sm lg:text-base">
              {i18n.language === 'es' ? 'Carrito' : 'Cart'}
            </h2>
          </div>
        )}
        
        <EmptyCart />
      </div>
    );
  }

  return (
    <div className={`bg-neutral-50 rounded-2xl lg:rounded-3xl ${
      isMobile ? 'p-4 max-h-[80vh] flex flex-col' : 'p-4 lg:p-6 sticky top-24'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 lg:mb-6">
        <div className="flex items-center space-x-2">
          <ShoppingCart className="w-4 h-4 lg:w-5 lg:h-5 text-zinc-900" />
          <h2 className="font-semibold lg:font-bold text-zinc-900 text-sm lg:text-base">
            {i18n.language === 'es' ? 'Carrito' : 'Cart'}
          </h2>
          <span className="bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            {state.itemCount}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <motion.button
            onClick={handleClearCart}
            className="text-xs text-neutral-500 hover:text-red-500 transition-colors"
            whileHover={{ scale: 1.05 }}
          >
            {i18n.language === 'es' ? 'Limpiar' : 'Clear'}
          </motion.button>
          
          {/* Close button para mobile */}
          {isMobile && onClose && (
            <motion.button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-200 transition-colors"
              whileTap={{ scale: 0.95 }}
            >
              <X size={18} />
            </motion.button>
          )}
        </div>
      </div>

      {/* Items */}
      <div className={`space-y-3 mb-4 lg:mb-6 ${
        isMobile ? 'flex-1 overflow-y-auto' : 'max-h-80 lg:max-h-96 overflow-y-auto'
      }`}>
        <AnimatePresence mode="popLayout">
          {state.items.map((item, index) => (
            <CartItem key={item.id} item={item} index={index} />
          ))}
        </AnimatePresence>
      </div>

      {/* Total y Checkout */}
      <div className="border-t border-neutral-200 pt-4 lg:pt-6">
        <div className="flex items-center justify-between mb-4 lg:mb-6">
          <span className="font-bold text-zinc-900 text-sm lg:text-base">
            {i18n.language === 'es' ? 'Total:' : 'Total:'}
          </span>
          <span className="text-lg lg:text-xl font-black text-amber-600">
            {formatPriceByLanguage(state.total / 100, i18n.language)}
          </span>
        </div>

        {/* Checkout Button */}
        <Link to="/checkout" onClick={onClose}>
          <motion.button
            className="w-full bg-zinc-900 text-white font-bold py-3 lg:py-4 rounded-xl lg:rounded-2xl hover:bg-amber-600 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg text-sm lg:text-base"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <CreditCard size={16} className="lg:w-[18px] lg:h-[18px]" />
            <span>
              {i18n.language === 'es' ? 'Ir a Pagar' : 'Checkout'}
            </span>
          </motion.button>
        </Link>

        <p className="text-xs text-neutral-500 text-center mt-3">
          {i18n.language === 'es' 
            ? 'Envío y métodos de pago en el siguiente paso' 
            : 'Shipping and payment methods in the next step'}
        </p>
      </div>
    </div>
  );
});