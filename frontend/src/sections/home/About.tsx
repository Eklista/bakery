// src/sections/home/About.tsx
import React, { memo, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Heart, MapPin, Globe, Star, Coffee, Award } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const StatCard = memo(({ 
  icon: Icon, 
  title, 
  children,
  delay = 0 
}: { 
  icon: React.ComponentType<any>;
  title: string;
  children: React.ReactNode;
  delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, x: -30 }}
    whileInView={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.8, delay }}
    viewport={{ once: true, margin: "100px" }}
    className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-8"
  >
    <div className="flex items-center justify-center space-x-3 mb-6">
      <Icon className="w-8 h-8 text-amber-600" />
      <h3 className="text-2xl font-black text-zinc-900">{title}</h3>
    </div>
    {children}
  </motion.div>
));

const LocationTag = memo(({ location, index }: { location: string; index: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    whileInView={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.4, delay: index * 0.1 }}
    viewport={{ once: true }}
    className="flex items-center space-x-1 bg-white border border-amber-200 rounded-full px-3 py-1 text-xs font-semibold text-neutral-700"
  >
    <MapPin size={12} className="text-amber-600" />
    <span>{location}</span>
  </motion.div>
));

const SpecialtyCard = memo(({ 
  specialty, 
  index 
}: { 
  specialty: { icon: React.ComponentType<any>; title: string; color: string };
  index: number;
}) => {
  const IconComponent = specialty.icon;
  
  return (
    <motion.div
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
});

export const About: React.FC = memo(() => {
  const { t } = useTranslation();
  
  const locations = useMemo(() => [
    'Los Ángeles', 'Chicago', 'Honolulu', 'México', 
    'Seúl', 'Tokio', 'Moscú', 'Dubai', 'Doha'
  ], []);

  const specialties = useMemo(() => [
    { icon: Coffee, title: t('about.cupcakes'), color: 'text-pink-500' },
    { icon: Heart, title: t('about.cakes'), color: 'text-red-500' },
    { icon: Star, title: t('about.cookies'), color: 'text-amber-500' }
  ], [t]);

  const handleRequestQuote = useCallback(() => {
    console.log('Request quote clicked');
  }, []);

  return (
    <section className="py-16 bg-white relative overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-8 lg:px-16">
        
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "100px" }}
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
          
          <StatCard
            icon={Globe}
            title={t('about.globalPresence')}
            delay={0}
          >
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {locations.slice(0, 6).map((location, index) => (
                <LocationTag 
                  key={location} 
                  location={location} 
                  index={index}
                />
              ))}
            </div>
            <p className="text-center text-sm text-neutral-600">
              {t('about.moreCities')}
            </p>
          </StatCard>

          <StatCard
            icon={Award}
            title={t('about.specialties')}
            delay={0.2}
          >
            <div className="grid grid-cols-3 gap-4 mb-6">
              {specialties.map((specialty, index) => (
                <SpecialtyCard 
                  key={specialty.title} 
                  specialty={specialty} 
                  index={index}
                />
              ))}
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
                onClick={handleRequestQuote}
                className="bg-zinc-900 text-white font-bold px-6 py-3 rounded-full hover:bg-amber-600 transition-all duration-300 shadow-lg text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {t('about.requestQuote')}
              </motion.button>
            </motion.div>
          </StatCard>
        </div>
      </div>
    </section>
  );
});