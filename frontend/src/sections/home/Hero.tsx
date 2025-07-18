import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="bg-gray-50 relative overflow-hidden pt">
      <div className="max-w-[1750px] mx-auto px-16 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-16 items-center min-h-[95vh]">
          
          {/* Left Content - Text */}
          <motion.div 
            className="space-y-8 z-10 relative"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Main Title */}
            <div className="space-y-4">
              <motion.h1 
                className="text-6xl lg:text-8xl font-black leading-none tracking-tight text-gray-900"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                DULCE
                <br />
                <span className="text-gray-900">ESQUINA</span>
              </motion.h1>
              
              <motion.div
                className="flex items-center space-x-2"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
              </motion.div>
            </div>

            {/* Description */}
            <motion.p 
              className="text-lg text-gray-600 max-w-md leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              "Endulzando tu vida con productos artesanales hechos 
              con amor y tradición. Perfectos para tus eventos especiales."
            </motion.p>

            {/* CTA Button */}
            <motion.button
              className="bg-gray-900 text-white px-8 py-4 rounded-full font-semibold flex items-center space-x-2 hover:bg-gray-800 transition-colors group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Ordena Ahora</span>
              <ArrowRight 
                size={20} 
                className="group-hover:translate-x-1 transition-transform" 
              />
            </motion.button>
          </motion.div>

          {/* Center Content - Image Only */}
          <div className="relative h-[600px] lg:h-[1000px] flex items-center justify-center">
            <motion.img
              src="/cookies.png"
              alt="Delicious Cookies"
              className="w-full h-full object-contain"
              initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            />
          </div>

          {/* Right Content - Feature Cards */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            {[
              { icon: '🍰', title: 'Pasteles Personalizados', desc: 'Diseños únicos para bodas, cumpleaños y baby showers.' },
              { icon: '☕', title: 'Café Artesanal', desc: 'Blends especiales y métodos de preparación tradicionales.' },
              { icon: '🎂', title: 'Eventos Especiales', desc: 'Servicio completo para celebraciones memorables.' }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.2 }}
                whileHover={{ y: -5 }}
              >
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};