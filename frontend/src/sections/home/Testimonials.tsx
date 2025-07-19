// src/sections/home/Testimonials.tsx
import React, { useEffect, useState, memo } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  location: string;
  rating: number;
  text: string;
}

const testimonials: Record<string, Testimonial[]> = {
  es: [
    {
      id: 1,
      name: "María García",
      role: "Boda en México",
      location: "Ciudad de México",
      rating: 5,
      text: "El pastel de bodas más hermoso que jamás había visto. El sabor superó todas nuestras expectativas."
    },
    {
      id: 2,
      name: "Carlos Mendoza",
      role: "Eventos Corporativos",
      location: "Los Ángeles",
      rating: 5,
      text: "3 años trabajando con BAKEHAUS. Su profesionalismo y calidad son excepcionales."
    },
    {
      id: 3,
      name: "Ana Rivera",
      role: "Baby Shower",
      location: "Chicago",
      rating: 5,
      text: "Las galletas personalizadas fueron increíbles. Definitivamente los volveré a contratar."
    },
    {
      id: 4,
      name: "Roberto Silva",
      role: "Cliente Frecuente",
      location: "Dubai",
      rating: 5,
      text: "La calidad se mantiene igual en todos sus locales. En Dubai es tan excelente como en Nueva York."
    },
    {
      id: 5,
      name: "Sophie Martin",
      role: "Evento Corporativo",
      location: "Tokio",
      rating: 5,
      text: "Los cupcakes fueron el centro de atención en nuestra conferencia. Servicio impecable."
    }
  ],
  en: [
    {
      id: 1,
      name: "Maria Garcia",
      role: "Wedding in Mexico",
      location: "Mexico City",
      rating: 5,
      text: "The most beautiful wedding cake I had ever seen. The taste exceeded all our expectations."
    },
    {
      id: 2,
      name: "Carlos Mendoza",
      role: "Corporate Events",
      location: "Los Angeles",
      rating: 5,
      text: "3 years working with BAKEHAUS. Their professionalism and quality are exceptional."
    },
    {
      id: 3,
      name: "Ana Rivera",
      role: "Baby Shower",
      location: "Chicago",
      rating: 5,
      text: "The personalized cookies were incredible. I will definitely hire them again."
    },
    {
      id: 4,
      name: "Roberto Silva",
      role: "Frequent Customer",
      location: "Dubai",
      rating: 5,
      text: "Quality remains the same in all locations. In Dubai it's as excellent as in New York."
    },
    {
      id: 5,
      name: "Sophie Martin",
      role: "Corporate Event",
      location: "Tokyo",
      rating: 5,
      text: "The cupcakes were the center of attention at our conference. Impeccable service."
    }
  ]
};

const TestimonialItem = memo(({ testimonial }: { testimonial: Testimonial }) => (
  <div className="flex-shrink-0 w-80 mx-4">
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-neutral-100">
      <div className="flex items-center space-x-1 mb-3">
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            size={12}
            className="text-amber-400 fill-current"
          />
        ))}
      </div>
      
      <blockquote className="text-neutral-700 text-sm leading-relaxed mb-4 line-clamp-3">
        "{testimonial.text}"
      </blockquote>
      
      <div>
        <div className="font-semibold text-zinc-900 text-sm">{testimonial.name}</div>
        <div className="text-xs text-neutral-500">{testimonial.role} • {testimonial.location}</div>
      </div>
    </div>
  </div>
));

export const Testimonials: React.FC = memo(() => {
  const { i18n } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const currentTestimonials = testimonials[i18n.language] || testimonials.es;
  
  // Crear array infinito duplicando testimonials
  const infiniteTestimonials = [...currentTestimonials, ...currentTestimonials];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => prev + 1);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Reset cuando llegue al final para crear efecto infinito
  useEffect(() => {
    if (currentIndex >= currentTestimonials.length) {
      setTimeout(() => {
        setCurrentIndex(0);
      }, 500);
    }
  }, [currentIndex, currentTestimonials.length]);

  const headerTexts = {
    es: {
      subtitle: 'TESTIMONIOS',
      title: 'Momentos dulces, memorias infinitas',
      description: 'Más de 50 años creando experiencias especiales alrededor del mundo'
    },
    en: {
      subtitle: 'TESTIMONIALS',
      title: 'Sweet moments, infinite memories',
      description: 'Over 50 years creating special experiences around the world'
    }
  };

  const currentTexts = headerTexts[i18n.language as 'es' | 'en'] || headerTexts.es;

  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-8 lg:px-16">
        
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.span 
            className="text-sm font-bold text-amber-600 tracking-[0.3em] uppercase mb-3 block"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {currentTexts.subtitle}
          </motion.span>
          <h2 className="text-3xl lg:text-4xl font-black text-zinc-900 mb-4">
            {currentTexts.title}
          </h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            {currentTexts.description}
          </p>
        </motion.div>

        {/* Carrusel infinito */}
        <div className="relative">
          <div className="overflow-hidden">
            <motion.div
              className="flex"
              animate={{
                x: `${-currentIndex * 320}px`
              }}
              transition={{
                duration: 0.8,
                ease: "easeInOut"
              }}
            >
              {infiniteTestimonials.map((testimonial, index) => (
                <TestimonialItem
                  key={`${testimonial.id}-${Math.floor(index / currentTestimonials.length)}`}
                  testimonial={testimonial}
                />
              ))}
            </motion.div>
          </div>

          {/* Gradients para fade effect en los bordes */}
          <div className="absolute left-0 top-0 w-16 h-full bg-gradient-to-r from-white to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 w-16 h-full bg-gradient-to-l from-white to-transparent pointer-events-none" />
        </div>

        {/* Indicadores sutiles */}
        <div className="flex justify-center mt-8 space-x-2">
          {currentTestimonials.map((_, index) => (
            <motion.div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === (currentIndex % currentTestimonials.length) 
                  ? 'bg-amber-500 scale-125' 
                  : 'bg-neutral-300'
              }`}
              whileHover={{ scale: 1.2 }}
            />
          ))}
        </div>

        {/* Stats sutiles */}
        <motion.div 
          className="text-center mt-12 pt-8 border-t border-neutral-100"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <div className="flex justify-center space-x-12 text-center">
            <div>
              <div className="text-2xl font-black text-amber-600">50+</div>
              <div className="text-xs text-neutral-500 font-medium">
                {i18n.language === 'es' ? 'Años' : 'Years'}
              </div>
            </div>
            <div>
              <div className="text-2xl font-black text-amber-600">10</div>
              <div className="text-xs text-neutral-500 font-medium">
                {i18n.language === 'es' ? 'Ciudades' : 'Cities'}
              </div>
            </div>
            <div>
              <div className="text-2xl font-black text-amber-600">5.0</div>
              <div className="text-xs text-neutral-500 font-medium">
                {i18n.language === 'es' ? 'Rating' : 'Rating'}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
});