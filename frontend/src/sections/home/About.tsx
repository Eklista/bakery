// src/sections/home/About.tsx
import React, { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export const About: React.FC = memo(() => {
  const { i18n } = useTranslation();

  const headerTexts = useMemo(() => ({
    es: {
      subtitle: 'NUESTRA HISTORIA',
      title: 'Desde 1965',
      historyText1: 'En 1965, BAKEHAUS abrió su primer local en una calle tranquila de Nueva York. Desde sus inicios, hemos sido reconocidos por nuestra comida clásica americana, ambiente vintage y cálido, y atmósfera amigable.',
      historyText2: 'En 2007, Steve y Tyra Abrams compraron BAKEHAUS y la expandieron desde Nueva York hasta el mundo entero. Hoy mantenemos la misma calidad artesanal y calidez familiar en cada una de nuestras ubicaciones.',
      specialtiesText: 'Nos especializamos en eventos como bodas, eventos corporativos, cumpleaños y baby showers. Nuestros productos estrella son cupcakes, tortas y galletas artesanales.'
    },
    en: {
      subtitle: 'OUR HISTORY',
      title: 'Since 1965',
      historyText1: 'In 1965, BAKEHAUS opened its first location on a quiet street in New York. Since our beginnings, we have been recognized for our classic American food, vintage and warm atmosphere, and friendly environment.',
      historyText2: 'In 2007, Steve and Tyra Abrams bought BAKEHAUS and expanded it from New York to the entire world. Today we maintain the same artisanal quality and family warmth in each of our locations.',
      specialtiesText: 'We specialize in events such as weddings, corporate events, birthdays and baby showers. Our signature products are artisanal cupcakes, cakes and cookies.'
    }
  }), [i18n.language]);

  const currentTexts = headerTexts[i18n.language as 'es' | 'en'] || headerTexts.es;

  return (
    <section className="py-16 bg-white">
      <div className="max-w-[1600px] mx-auto px-8 lg:px-16">
        
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
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
        </motion.div>

        {/* Content Grid - Historia + Imagen */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Historia */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <p className="text-lg text-neutral-600 leading-relaxed">
              {currentTexts.historyText1}
            </p>
            
            <p className="text-lg text-neutral-600 leading-relaxed">
              {currentTexts.historyText2}
            </p>
            
            <div className="pt-6 border-t border-neutral-100">
              <p className="text-neutral-700 leading-relaxed">
                {currentTexts.specialtiesText}
              </p>
            </div>

            {/* Stats simples */}
            <div className="flex space-x-8 pt-6">
              <div>
                <div className="text-3xl font-black text-amber-600">1965</div>
                <div className="text-sm text-neutral-500 font-medium">
                  {i18n.language === 'es' ? 'Fundada' : 'Founded'}
                </div>
              </div>
              <div>
                <div className="text-3xl font-black text-amber-600">10+</div>
                <div className="text-sm text-neutral-500 font-medium">
                  {i18n.language === 'es' ? 'Ciudades' : 'Cities'}
                </div>
              </div>
              <div>
                <div className="text-3xl font-black text-amber-600">50+</div>
                <div className="text-sm text-neutral-500 font-medium">
                  {i18n.language === 'es' ? 'Años' : 'Years'}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Imagen */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative overflow-hidden rounded-3xl shadow-2xl">
              <img
                src="/panaderia.jpg"
                alt="BAKEHAUS Panadería"
                className="w-full h-96 lg:h-[500px] object-cover"
                loading="lazy"
                onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                  (e.target as HTMLImageElement).src = '/cookies.webp';
                }}
              />
              
              {/* Overlay sutil */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
              
              {/* Badge vintage */}
              <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
                <span className="text-sm font-bold text-zinc-900">
                  {i18n.language === 'es' ? 'Tradición desde 1965' : 'Tradition since 1965'}
                </span>
              </div>
            </div>

            {/* Decoración */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-amber-200/30 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-orange-200/20 rounded-full blur-2xl"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
});