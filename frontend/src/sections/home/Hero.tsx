import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Cake, Coffee, Calendar } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="bg-neutral-50 relative overflow-hidden pt-16">
      <div className="max-w-[1700px] mx-auto px-8 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center py-16">
          
          {/* Left Content - Text */}
          <motion.div 
            className="lg:col-span-4 space-y-8 z-10 relative"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Badge */}
            <motion.div
              className="inline-flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm border border-neutral-200"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Star size={16} className="text-amber-500 fill-current" />
              <span className="text-sm font-medium text-neutral-700">Desde 1995</span>
            </motion.div>

            {/* Main Title */}
            <div className="space-y-4">
              <motion.h1 
                className="text-6xl lg:text-8xl font-black leading-[0.9] tracking-tight text-neutral-900"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                DULCE
                <br />
                <span className="text-neutral-900 relative">
                  ESQUINA
                  <motion.div
                    className="absolute -bottom-2 left-0 w-20 h-1 bg-amber-400 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: 80 }}
                    transition={{ duration: 0.8, delay: 1 }}
                  />
                </span>
              </motion.h1>
            </div>

            {/* Description */}
            <motion.p 
              className="text-xl text-neutral-600 max-w-lg leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              Endulzando tu vida con productos artesanales hechos con amor y tradición. 
              Perfectos para tus eventos especiales.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <motion.button
                className="bg-neutral-900 text-white px-8 py-4 rounded-full font-semibold flex items-center justify-center space-x-2 hover:bg-neutral-800 transition-all duration-300 shadow-lg hover:shadow-xl group"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>Ordena Ahora</span>
                <ArrowRight 
                  size={20} 
                  className="group-hover:translate-x-1 transition-transform" 
                />
              </motion.button>
              
              <motion.button
                className="border-2 border-neutral-300 text-neutral-900 px-8 py-4 rounded-full font-semibold hover:border-neutral-900 hover:bg-neutral-50 transition-all duration-300"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                Ver Menú
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Center Content - Image */}
          <div className="lg:col-span-5 relative h-[600px] lg:h-[800px] flex items-center justify-center">
            {/* Elemento decorativo de fondo */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-amber-100/50 to-orange-100/30 rounded-full blur-3xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.5 }}
            />
            
            <motion.img
              src="/cookies.png"
              alt="Delicious Cookies"
              className="relative z-10 w-full h-full object-contain"
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
            />
          </div>

          {/* Right Content - Feature Cards */}
          <motion.div 
            className="lg:col-span-3 space-y-6"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {[
              { 
                icon: Cake, 
                title: 'Pasteles Personalizados', 
                desc: 'Diseños únicos para bodas, cumpleaños y baby showers.',
                delay: 0.8
              },
              { 
                icon: Coffee, 
                title: 'Café Artesanal', 
                desc: 'Blends especiales y métodos de preparación tradicionales.',
                delay: 1.0
              },
              { 
                icon: Calendar, 
                title: 'Eventos Especiales', 
                desc: 'Servicio completo para celebraciones memorables.',
                delay: 1.2
              }
            ].map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 border border-neutral-100 group"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: feature.delay }}
                  whileHover={{ 
                    y: -8,
                    transition: { duration: 0.3 }
                  }}
                >
                  <div className="text-amber-600 mb-4 group-hover:scale-110 group-hover:text-amber-700 transition-all duration-300">
                    <IconComponent size={32} />
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2 group-hover:text-amber-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-neutral-600 text-sm leading-relaxed">
                    {feature.desc}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>

      {/* Elementos decorativos sutiles */}
      <motion.div
        className="absolute top-1/4 left-10 w-3 h-3 bg-amber-400 rounded-full opacity-60"
        animate={{ 
          y: [0, -10, 0],
          scale: [1, 1.2, 1]
        }}
        transition={{ 
          duration: 3, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div
        className="absolute bottom-1/3 right-20 w-2 h-2 bg-orange-400 rounded-full opacity-40"
        animate={{ 
          y: [0, 15, 0],
          x: [0, 5, 0]
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />
    </section>
  );
};