// src/sections/home/CallToAction.tsx
import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Calendar, Phone, MapPin, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const CallToAction: React.FC = memo(() => {
  const { i18n } = useTranslation();

  const headerTexts = {
    es: {
      subtitle: 'ORDENA AHORA',
      title: 'Listos para endulzar tu día',
      description: 'Haz tu pedido hoy y descubre por qué somos la panadería favorita desde 1965',
      orderNow: 'Ordenar Ahora',
      scheduleEvent: 'Programar Evento',
      phone: '+502 2345-6789',
      openNow: 'Abierto ahora'
    },
    en: {
      subtitle: 'ORDER NOW',
      title: 'Ready to sweeten your day',
      description: 'Place your order today and discover why we are the favorite bakery since 1965',
      orderNow: 'Order Now',
      scheduleEvent: 'Schedule Event',
      phone: '+502 2345-6789',
      openNow: 'Open now'
    }
  };

  const currentTexts = headerTexts[i18n.language as 'es' | 'en'] || headerTexts.es;

  return (
    <section className="py-20 bg-neutral-50">
      <div className="max-w-[1600px] mx-auto px-8 lg:px-16">
        
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <span className="text-sm font-bold text-amber-600 tracking-[0.3em] uppercase mb-4 block">
            {currentTexts.subtitle}
          </span>
          <h2 className="text-4xl lg:text-5xl font-black text-zinc-900 mb-6">
            {currentTexts.title}
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            {currentTexts.description}
          </p>
        </motion.div>

        {/* Main Actions */}
        <motion.div 
          className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <motion.button 
            className="bg-zinc-900 text-white font-bold px-8 py-4 rounded-full hover:bg-amber-500 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-3"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <ShoppingBag size={20} />
            <span>{currentTexts.orderNow}</span>
          </motion.button>
          
          <motion.button 
            className="bg-white border-2 border-zinc-900 text-zinc-900 font-bold px-8 py-4 rounded-full hover:bg-zinc-900 hover:text-white transition-all duration-300 flex items-center space-x-3"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <Calendar size={20} />
            <span>{currentTexts.scheduleEvent}</span>
          </motion.button>
        </motion.div>

        {/* Contact Info - Simple Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          {/* Phone */}
          <motion.div 
            className="border-2 border-neutral-200 rounded-2xl p-6 text-center hover:border-amber-400 hover:bg-amber-50/30 transition-all duration-300"
            whileHover={{ y: -2 }}
          >
            <div className="flex items-center justify-center space-x-2 mb-3">
              <Phone size={20} className="text-amber-600" />
              <h3 className="font-bold text-zinc-900">
                {i18n.language === 'es' ? 'Llámanos' : 'Call us'}
              </h3>
            </div>
            <p className="text-neutral-600">{currentTexts.phone}</p>
          </motion.div>

          {/* Locations */}
          <motion.div 
            className="border-2 border-neutral-200 rounded-2xl p-6 text-center hover:border-amber-400 hover:bg-amber-50/30 transition-all duration-300"
            whileHover={{ y: -2 }}
          >
            <div className="flex items-center justify-center space-x-2 mb-3">
              <MapPin size={20} className="text-amber-600" />
              <h3 className="font-bold text-zinc-900">
                {i18n.language === 'es' ? 'Ubicaciones' : 'Locations'}
              </h3>
            </div>
            <p className="text-neutral-600">
              10 {i18n.language === 'es' ? 'ciudades' : 'cities'}
            </p>
          </motion.div>

          {/* Hours */}
          <motion.div 
            className="border-2 border-neutral-200 rounded-2xl p-6 text-center hover:border-amber-400 hover:bg-amber-50/30 transition-all duration-300"
            whileHover={{ y: -2 }}
          >
            <div className="flex items-center justify-center space-x-2 mb-3">
              <Clock size={20} className="text-amber-600" />
              <h3 className="font-bold text-zinc-900">
                {currentTexts.openNow}
              </h3>
            </div>
            <p className="text-neutral-600">6:00 AM - 8:00 PM</p>
          </motion.div>
        </motion.div>

        {/* Trust indicator */}
        <motion.div 
          className="text-center mt-12 pt-8 border-t border-neutral-200"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <p className="text-neutral-500 text-sm">
            {i18n.language === 'es' 
              ? 'Más de 50 años endulzando momentos especiales' 
              : 'Over 50 years sweetening special moments'}
          </p>
        </motion.div>
      </div>
    </section>
  );
});