// src/sections/home/About.tsx - Con i18n
import React from 'react';
import { motion } from 'framer-motion';
import { Heart, MapPin, Globe, Star, Coffee, Award } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const About: React.FC = () => {
  const { t } = useTranslation();
  
  const locations = [
    'Los Ángeles', 'Chicago', 'Honolulu', 'México', 
    'Seúl', 'Tokio', 'Moscú', 'Dubai', 'Doha'
  ];

  const specialties = [
    { icon: Coffee, title: t('about.cupcakes'), color: 'text-pink-500' },
    { icon: Heart, title: t('about.cakes'), color: 'text-red-500' },
    { icon: Star, title: t('about.cookies'), color: 'text-amber-500' }
  ];

  return (
    <section className="py-16 bg-white relative overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-8 lg:px-16">
        
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.span 
            className="text-sm font-bold text-amber-600 tracking-[0.3em] uppercase mb-4 block"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {t('about.ourHistory')}
          </motion.span>
          <h2 className="text-4xl lg:text-6xl font-black text-zinc-900 mb-6">
            {t('about.since')} <span className="text-amber-500">1965</span>
          </h2>
          <p className="text-lg text-neutral-600 max-w-4xl mx-auto leading-relaxed">
            {t('about.historyText')}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-8"
          >
            <div className="flex items-center justify-center space-x-3 mb-6">
              <Globe className="w-8 h-8 text-amber-600" />
              <h3 className="text-2xl font-black text-zinc-900">{t('about.globalPresence')}</h3>
            </div>
            
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {locations.slice(0, 6).map((location, index) => (
                <motion.div
                  key={location}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center space-x-1 bg-white border border-amber-200 rounded-full px-3 py-1 text-xs font-semibold text-neutral-700"
                >
                  <MapPin size={12} className="text-amber-600" />
                  <span>{location}</span>
                </motion.div>
              ))}
            </div>
            <p className="text-center text-sm text-neutral-600">{t('about.moreCities')}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-8"
          >
            <div className="flex items-center justify-center space-x-3 mb-6">
              <Award className="w-8 h-8 text-amber-600" />
              <h3 className="text-2xl font-black text-zinc-900">{t('about.specialties')}</h3>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              {specialties.map((specialty, index) => {
                const IconComponent = specialty.icon;
                return (
                  <motion.div
                    key={specialty.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    viewport={{ once: true }}
                    className="text-center group"
                  >
                    <motion.div 
                      className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-2 shadow-md group-hover:shadow-lg transition-all duration-300"
                      whileHover={{ scale: 1.1 }}
                    >
                      <IconComponent size={20} className={specialty.color} />
                    </motion.div>
                    <span className="text-sm font-bold text-zinc-900">{specialty.title}</span>
                  </motion.div>
                );
              })}
            </div>
            <p className="text-center text-sm text-neutral-600 mb-6">
              {t('about.eventsText')}
            </p>
            
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <motion.button 
                className="bg-zinc-900 text-white font-bold px-6 py-3 rounded-full hover:bg-amber-600 transition-all duration-300 shadow-lg text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {t('about.requestQuote')}
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};