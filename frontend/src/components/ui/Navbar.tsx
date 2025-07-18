import React, { useState } from 'react';
import { Menu, X, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount] = useState(0);
  const [activeItem, setActiveItem] = useState('Inicio');

  const navItems = [
    { name: 'Inicio', href: '/' },
    { name: 'Nosotros', href: '/nosotros' },
    { name: 'Productos', href: '/productos' },
    { name: 'Eventos', href: '/eventos' },
    { name: 'Contacto', href: '/contacto' }
  ];

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
            <h1 className="text-2xl font-black tracking-tight text-zinc-900">
              BAKEHAUS
            </h1>
          </motion.div>

          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item, index) => (
              <motion.a
                key={item.name}
                href={item.href}
                onClick={() => setActiveItem(item.name)}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                className={`font-semibold text-sm transition-all duration-300 py-3 px-6 rounded-full relative group ${
                  activeItem === item.name 
                    ? 'text-white bg-neutral-900' 
                    : 'text-neutral-700 hover:text-neutral-900 hover:bg-neutral-50'
                }`}
              >
                {item.name}
              </motion.a>
            ))}
          </div>

          <motion.div 
            className="hidden lg:flex items-center space-x-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <motion.button 
              className="flex items-center space-x-2 text-neutral-700 hover:text-neutral-900 font-semibold text-sm transition-all duration-300 py-3 px-4 rounded-full hover:bg-neutral-50 relative"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ShoppingBag size={18} />
              <span>Carrito</span>
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
            
            <motion.button 
              className="bg-zinc-900 text-white font-bold px-6 py-3 rounded-full hover:bg-zinc-100 hover:text-black hover:border-black hover:border-[2px] transition-all duration-300 shadow-lg "
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.95 }}
            >
              Ordenar
            </motion.button>
          </motion.div>

          <div className="lg:hidden">
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
                <motion.a
                  key={item.name}
                  href={item.href}
                  className={`block py-4 px-6 rounded-2xl text-base font-semibold transition-all duration-300 ${
                    activeItem === item.name 
                      ? 'text-white bg-neutral-900' 
                      : 'text-neutral-700 hover:text-neutral-900 hover:bg-neutral-50'
                  }`}
                  onClick={() => {
                    setActiveItem(item.name);
                    setIsMenuOpen(false);
                  }}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {item.name}
                </motion.a>
              ))}
              
              <motion.div 
                className="pt-6 space-y-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                <motion.button 
                  className="w-full flex items-center justify-center space-x-2 py-4 px-6 text-neutral-700 hover:text-neutral-900 rounded-2xl hover:bg-neutral-50 transition-all duration-300 font-semibold"
                  whileTap={{ scale: 0.98 }}
                >
                  <ShoppingBag size={18} />
                  <span>Ver Carrito</span>
                  <AnimatePresence>
                    {cartCount > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="bg-amber-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold"
                      >
                        {cartCount}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
                
                <motion.button 
                  className="w-full bg-zinc-900 text-white font-bold py-4 rounded-2xl hover:bg-amber-600 transition-all duration-300 shadow-lg"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Ordenar Ahora
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};