// src/components/ui/Navbar.tsx
import React, { useState } from 'react';
import { Menu, X, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useLocation, Link } from 'react-router-dom';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useCart } from '../../contexts/CartContext';

export const Navbar: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { state } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: t('navbar.home'), href: '/', key: 'home' },
    { name: t('navbar.about'), href: '/nosotros', key: 'about' },
    { name: t('navbar.products'), href: '/productos', key: 'products' },
    { name: t('navbar.events'), href: '/eventos', key: 'events' },
    { name: t('navbar.contact'), href: '/contacto', key: 'contact' }
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-white/98 backdrop-blur-xl border-b border-neutral-100 fixed top-0 w-full z-50 shadow-sm"
    >
      <div className="max-w-[1600px] mx-auto px-8 lg:px-16">
        <div className="flex justify-between items-center h-20">
          
          <motion.div 
            className="flex-shrink-0"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link to="/" className="text-2xl font-black tracking-tight text-zinc-900">
              BAKEHAUS
            </Link>
          </motion.div>

          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item, index) => (
              <motion.div
                key={item.key}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
              >
                <Link
                  to={item.href}
                  className={`font-semibold text-sm transition-all duration-300 py-3 px-6 rounded-full relative group ${
                    isActive(item.href)
                      ? 'text-white bg-neutral-900' 
                      : 'text-neutral-700 hover:text-neutral-900 hover:bg-neutral-50'
                  }`}
                >
                  {item.name}
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div 
            className="hidden lg:flex items-center space-x-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <LanguageSwitcher />
            
            <Link to="/productos">
              <motion.div
                className="flex items-center space-x-2 text-neutral-700 hover:text-neutral-900 font-semibold text-sm transition-all duration-300 py-3 px-4 rounded-full hover:bg-neutral-50 relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ShoppingBag size={18} />
                <span>{t('navbar.cart')}</span>
                <AnimatePresence>
                  {state.itemCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold"
                    >
                      {state.itemCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>
            
            <motion.button 
              className="bg-zinc-900 text-white font-bold px-6 py-3 rounded-full hover:bg-zinc-100 hover:text-black hover:border-black hover:border-[2px] transition-all duration-300 shadow-lg"
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.95 }}
            >
              {t('navbar.order')}
            </motion.button>
          </motion.div>

          <div className="lg:hidden flex items-center space-x-3">
            <LanguageSwitcher />
            <motion.button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-neutral-700 hover:text-neutral-900 p-3 rounded-full hover:bg-neutral-50 transition-all duration-300"
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence mode="wait">
                {isMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X size={24} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu size={24} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            className="lg:hidden bg-white/98 backdrop-blur-xl border-t border-neutral-100 shadow-xl"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="px-8 py-6 space-y-2">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.key}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Link
                    to={item.href}
                    className={`block py-4 px-6 rounded-2xl text-base font-semibold transition-all duration-300 ${
                      isActive(item.href)
                        ? 'text-white bg-neutral-900' 
                        : 'text-neutral-700 hover:text-neutral-900 hover:bg-neutral-50'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
              
              <motion.div 
                className="pt-6 space-y-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                <Link to="/productos" onClick={() => setIsMenuOpen(false)}>
                  <motion.div
                    className="w-full flex items-center justify-center space-x-2 py-4 px-6 text-neutral-700 hover:text-neutral-900 rounded-2xl hover:bg-neutral-50 transition-all duration-300 font-semibold"
                    whileTap={{ scale: 0.98 }}
                  >
                    <ShoppingBag size={18} />
                    <span>{t('navbar.cart')}</span>
                    <AnimatePresence>
                      {state.itemCount > 0 && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          className="bg-amber-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold"
                        >
                          {state.itemCount}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </Link>
                
                <motion.button 
                  className="w-full bg-zinc-900 text-white font-bold py-4 rounded-2xl hover:bg-amber-600 transition-all duration-300 shadow-lg"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {t('navbar.order')}
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};