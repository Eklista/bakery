// src/components/cart/CartDropdown.tsx
import React, { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X, Minus, Plus, Trash2, CreditCard } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { formatPriceByLanguage } from '../../utils/currency';

interface CartDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDropdownItem = memo(({ item, onUpdateQuantity, onRemove, language }: {
  item: any;
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemove: (id: number) => void;
  language: string;
}) => (
  <div className="flex items-start space-x-3 p-4 bg-white rounded-xl border border-neutral-100 hover:shadow-sm transition-all duration-200">
    <div className="w-14 h-14 bg-neutral-100 rounded-xl overflow-hidden flex-shrink-0">
      <img
        src={item.image}
        alt={item.title}
        className="w-full h-full object-cover"
        onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
          (e.target as HTMLImageElement).src = '/cookies.webp';
        }}
      />
    </div>
    
    <div className="flex-1 min-w-0">
      <h4 className="font-bold text-zinc-900 text-sm mb-1 line-clamp-1">
        {item.title}
      </h4>
      <p className="text-amber-600 font-bold text-sm mb-3">
        {formatPriceByLanguage(item.price / 100, language)}
      </p>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center bg-neutral-50 rounded-lg p-1">
          <motion.button
            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
            className="w-7 h-7 bg-white rounded-md flex items-center justify-center border border-neutral-200 hover:bg-neutral-100 transition-colors"
            whileTap={{ scale: 0.9 }}
          >
            <Minus size={12} />
          </motion.button>
          
          <span className="w-8 text-center text-sm font-bold text-zinc-900">
            {item.quantity}
          </span>
          
          <motion.button
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            className="w-7 h-7 bg-white rounded-md flex items-center justify-center border border-neutral-200 hover:bg-neutral-100 transition-colors"
            whileTap={{ scale: 0.9 }}
          >
            <Plus size={12} />
          </motion.button>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="font-bold text-zinc-900 text-sm">
            {formatPriceByLanguage((item.price * item.quantity) / 100, language)}
          </span>
          <motion.button
            onClick={() => onRemove(item.id)}
            className="w-7 h-7 flex items-center justify-center text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-all"
            whileTap={{ scale: 0.9 }}
          >
            <Trash2 size={14} />
          </motion.button>
        </div>
      </div>
    </div>
  </div>
));

export const CartDropdown: React.FC<CartDropdownProps> = memo(({ isOpen, onClose }) => {
  const { t, i18n } = useTranslation();
  const { state, updateQuantity, removeItem, clearCart } = useCart();

  const handleUpdateQuantity = (id: number, quantity: number) => {
    if (quantity === 0) {
      removeItem(id);
    } else {
      updateQuantity(id, quantity);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50"
        onClick={onClose}
      >
        {/* Backdrop más sutil */}
        <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]" />
        
        {/* Dropdown mejorado */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="absolute top-[88px] right-8 w-96 bg-white rounded-2xl shadow-xl border border-neutral-200/50 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header más elegante */}
          <div className="p-5 bg-gradient-to-r from-neutral-50 to-amber-50/30 border-b border-neutral-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                  <ShoppingBag size={18} className="text-amber-600" />
                </div>
                <div>
                  <h3 className="font-bold text-zinc-900 text-lg">
                    {t('navbar.cart')}
                  </h3>
                  {state.itemCount > 0 && (
                    <p className="text-sm text-neutral-600">
                      {state.itemCount} {state.itemCount === 1 ? 'producto' : 'productos'}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {state.items.length > 0 && (
                  <motion.button
                    onClick={clearCart}
                    className="text-xs text-neutral-500 hover:text-red-500 transition-colors px-2 py-1 rounded-md hover:bg-red-50"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {i18n.language === 'es' ? 'Limpiar' : 'Clear'}
                  </motion.button>
                )}
                <motion.button
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-100 transition-colors"
                  whileTap={{ scale: 0.95 }}
                >
                  <X size={18} className="text-neutral-600" />
                </motion.button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="max-h-[400px] overflow-y-auto">
            {state.items.length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="w-8 h-8 text-neutral-400" />
                </div>
                <h3 className="font-bold text-zinc-900 mb-2">
                  {i18n.language === 'es' ? 'Tu carrito está vacío' : 'Your cart is empty'}
                </h3>
                <p className="text-neutral-600 text-sm mb-4">
                  {i18n.language === 'es' 
                    ? 'Agrega algunos productos deliciosos' 
                    : 'Add some delicious products'}
                </p>
                <Link to="/productos" onClick={onClose}>
                  <motion.button
                    className="bg-amber-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-amber-600 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {i18n.language === 'es' ? 'Ver Productos' : 'Browse Products'}
                  </motion.button>
                </Link>
              </div>
            ) : (
              <div className="p-5 space-y-4">
                <AnimatePresence>
                  {state.items.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <CartDropdownItem
                        item={item}
                        onUpdateQuantity={handleUpdateQuantity}
                        onRemove={removeItem}
                        language={i18n.language}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Footer mejorado */}
          {state.items.length > 0 && (
            <div className="p-5 bg-gradient-to-r from-neutral-50 to-amber-50/30 border-t border-neutral-100">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-sm text-neutral-600">
                    {i18n.language === 'es' ? 'Total' : 'Total'}
                  </span>
                  <div className="text-2xl font-black text-amber-600">
                    {formatPriceByLanguage(state.total / 100, i18n.language)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-neutral-500 mb-1">
                    {state.itemCount} {state.itemCount === 1 ? 'producto' : 'productos'}
                  </div>
                  <div className="text-xs text-green-600 font-semibold">
                    {state.total / 100 >= 200 
                      ? (i18n.language === 'es' ? '🎉 Envío gratis!' : '🎉 Free shipping!')
                      : (i18n.language === 'es' 
                          ? `Q${(200 - state.total / 100).toFixed(0)} más para envío gratis` 
                          : `Q${(200 - state.total / 100).toFixed(0)} more for free shipping`)
                    }
                  </div>
                </div>
              </div>
              
              <Link to="/checkout" onClick={onClose}>
                <motion.button
                  className="w-full bg-zinc-900 text-white font-bold py-3 rounded-xl hover:bg-amber-500 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg"
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <CreditCard size={18} />
                  <span>
                    {i18n.language === 'es' ? 'Finalizar Compra' : 'Checkout'}
                  </span>
                </motion.button>
              </Link>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
});