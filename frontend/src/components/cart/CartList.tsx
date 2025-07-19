// src/components/cart/CartList.tsx
import React, { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, Trash2, ShoppingCart, CreditCard } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useCart } from '../../contexts/CartContext';
import { formatPriceByLanguage } from '../../utils/currency';

const EmptyCart = memo(() => {
  const { i18n } = useTranslation();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-12"
    >
      <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <ShoppingCart className="w-8 h-8 text-neutral-400" />
      </div>
      <h3 className="font-bold text-zinc-900 mb-2">
        {i18n.language === 'es' ? 'Carrito vacío' : 'Empty cart'}
      </h3>
      <p className="text-neutral-600 text-sm">
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
      className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-200"
    >
      <div className="flex items-start space-x-3">
        {/* Imagen */}
        <div className="w-16 h-16 bg-neutral-100 rounded-xl overflow-hidden flex-shrink-0">
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
          <h4 className="font-bold text-zinc-900 text-sm mb-1 line-clamp-2">
            {item.title}
          </h4>
          
          <div className="flex items-center justify-between">
            <p className="font-bold text-amber-600 text-sm">
              {formatPriceByLanguage(item.price / 100, i18n.language)}
            </p>
            
            <motion.button
              onClick={() => removeItem(item.id)}
              className="w-8 h-8 flex items-center justify-center text-neutral-400 hover:text-red-500 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Trash2 size={14} />
            </motion.button>
          </div>

          {/* Controles de cantidad */}
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center space-x-1">
              <motion.button
                onClick={() => handleQuantityChange(item.quantity - 1)}
                className="w-8 h-8 bg-neutral-100 rounded-full flex items-center justify-center hover:bg-neutral-200 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Minus size={12} />
              </motion.button>
              
              <span className="w-8 text-center font-bold text-zinc-900 text-sm">
                {item.quantity}
              </span>
              
              <motion.button
                onClick={() => handleQuantityChange(item.quantity + 1)}
                className="w-8 h-8 bg-neutral-100 rounded-full flex items-center justify-center hover:bg-neutral-200 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Plus size={12} />
              </motion.button>
            </div>
            
            <p className="font-bold text-zinc-900 text-sm">
              {formatPriceByLanguage((item.price * item.quantity) / 100, i18n.language)}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

export const CartList: React.FC = memo(() => {
  const { i18n } = useTranslation();
  const { state, clearCart } = useCart();

  const handleCheckout = () => {
    // Redirigir a página de carrito/checkout
    window.location.href = '/carrito';
  };

  const handleClearCart = () => {
    clearCart();
  };

  if (state.items.length === 0) {
    return (
      <div className="bg-neutral-50 rounded-3xl p-6 sticky top-24">
        <div className="flex items-center space-x-2 mb-6">
          <ShoppingCart className="w-5 h-5 text-zinc-900" />
          <h2 className="font-bold text-zinc-900">
            {i18n.language === 'es' ? 'Carrito' : 'Cart'}
          </h2>
        </div>
        <EmptyCart />
      </div>
    );
  }

  return (
    <div className="bg-neutral-50 rounded-3xl p-6 sticky top-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <ShoppingCart className="w-5 h-5 text-zinc-900" />
          <h2 className="font-bold text-zinc-900">
            {i18n.language === 'es' ? 'Carrito' : 'Cart'}
          </h2>
          <span className="bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            {state.itemCount}
          </span>
        </div>
        
        <motion.button
          onClick={handleClearCart}
          className="text-xs text-neutral-500 hover:text-red-500 transition-colors"
          whileHover={{ scale: 1.05 }}
        >
          {i18n.language === 'es' ? 'Limpiar' : 'Clear'}
        </motion.button>
      </div>

      {/* Items */}
      <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
        <AnimatePresence mode="popLayout">
          {state.items.map((item, index) => (
            <CartItem key={item.id} item={item} index={index} />
          ))}
        </AnimatePresence>
      </div>

      {/* Total */}
      <div className="border-t border-neutral-200 pt-6">
        <div className="flex items-center justify-between mb-6">
          <span className="font-bold text-zinc-900">
            {i18n.language === 'es' ? 'Total:' : 'Total:'}
          </span>
          <span className="text-xl font-black text-amber-600">
            {formatPriceByLanguage(state.total / 100, i18n.language)}
          </span>
        </div>

        {/* Checkout Button */}
        <motion.button
          onClick={handleCheckout}
          className="w-full bg-zinc-900 text-white font-bold py-4 rounded-2xl hover:bg-amber-600 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <CreditCard size={18} />
          <span>
            {i18n.language === 'es' ? 'Ir a Pagar' : 'Checkout'}
          </span>
        </motion.button>

        <p className="text-xs text-neutral-500 text-center mt-3">
          {i18n.language === 'es' 
            ? 'Envío y métodos de pago en el siguiente paso' 
            : 'Shipping and payment methods in the next step'}
        </p>
      </div>
    </div>
  );
});