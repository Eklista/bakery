import React from 'react';
import { motion } from 'framer-motion';
import { Star, Instagram, Facebook, Youtube, MapPin, Clock, Phone, Award } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="bg-neutral-50 relative overflow-hidden min-h-screen flex items-center justify-center py-10">
      {/* Social Media Vertical Bar */}
      <motion.div
        className="fixed left-8 top-1/2 -translate-y-1/2 z-50 hidden lg:block"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 1.5 }}
      >
        <div className="flex flex-col items-center space-y-1">
          {/* Line decorativa superior */}
          <motion.div 
            className="w-0.5 h-16 bg-gradient-to-b from-transparent to-neutral-300"
            initial={{ height: 0 }}
            animate={{ height: 64 }}
            transition={{ duration: 0.6, delay: 2 }}
          />
          
          {/* Botones de redes sociales */}
          <div className="flex flex-col space-y-3 py-4">
            {[
              { icon: Instagram, href: "#", label: "Instagram", color: "hover:bg-pink-500" },
              { icon: Facebook, href: "#", label: "Facebook", color: "hover:bg-blue-600" },
              { icon: Youtube, href: "#", label: "YouTube", color: "hover:bg-red-500" }
            ].map((social, index) => {
              const IconComponent = social.icon;
              return (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-14 h-14 bg-white/80 backdrop-blur-sm border border-neutral-200 rounded-full flex items-center justify-center text-neutral-600 hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl group ${social.color}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 2.2 + index * 0.1 }}
                  whileHover={{ scale: 1.1, x: 5 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={social.label}
                >
                  <IconComponent size={20} className="group-hover:scale-110 transition-transform" />
                </motion.a>
              );
            })}
          </div>
          
          {/* Line decorativa inferior */}
          <motion.div 
            className="w-0.5 h-16 bg-gradient-to-t from-transparent to-neutral-300"
            initial={{ height: 0 }}
            animate={{ height: 64 }}
            transition={{ duration: 0.6, delay: 2.5 }}
          />
          
          {/* Texto "SÍGUENOS" vertical */}
          <motion.div
            className="py-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 3 }}
          >
            <span className="text-xs font-bold text-neutral-400 tracking-widest transform -rotate-90 whitespace-nowrap block">
              SÍGUENOS
            </span>
          </motion.div>
        </div>
      </motion.div>

      {/* Quick Actions Vertical Bar - Right Side */}
      <motion.div
        className="fixed right-8 top-1/2 -translate-y-1/2 z-50 hidden lg:block"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 1.7 }}
      >
        <div className="flex flex-col items-center space-y-1">
          {/* Line decorativa superior */}
          <motion.div 
            className="w-0.5 h-16 bg-gradient-to-b from-transparent to-neutral-300"
            initial={{ height: 0 }}
            animate={{ height: 64 }}
            transition={{ duration: 0.6, delay: 2.2 }}
          />
          
          {/* Action buttons */}
          <div className="flex flex-col space-y-3 py-4">
            {[
              { 
                icon: MapPin, 
                href: "#ubicacion",
                label: "Ubicación",
                color: "hover:bg-emerald-500"
              },
              { 
                icon: Clock, 
                href: "#horarios",
                label: "Horarios",
                color: "hover:bg-blue-500"
              },
              { 
                icon: Phone, 
                href: "tel:+50223456789",
                label: "Llamar",
                color: "hover:bg-amber-500"
              },
              { 
                icon: Award, 
                href: "#calidad",
                label: "Calidad",
                color: "hover:bg-purple-500"
              }
            ].map((action, index) => {
              const IconComponent = action.icon;
              return (
                <motion.a
                  key={action.label}
                  href={action.href}
                  className={`w-14 h-14 bg-white/80 backdrop-blur-sm border border-neutral-200 rounded-full flex items-center justify-center text-neutral-600 hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl group ${action.color}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 2.4 + index * 0.1 }}
                  whileHover={{ scale: 1.1, x: -5 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={action.label}
                >
                  <IconComponent size={20} className="group-hover:scale-110 transition-transform" />
                </motion.a>
              );
            })}
          </div>
          
          {/* Line decorativa inferior */}
          <motion.div 
            className="w-0.5 h-16 bg-gradient-to-t from-transparent to-neutral-300"
            initial={{ height: 0 }}
            animate={{ height: 64 }}
            transition={{ duration: 0.6, delay: 2.8 }}
          />
          
          {/* Texto vertical */}
          <motion.div
            className="py-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 3 }}
          >
            <span className="text-xs font-bold text-neutral-400 tracking-widest transform -rotate-90 whitespace-nowrap block">
              ACCESO
            </span>
          </motion.div>
        </div>
      </motion.div>

      {/* Círculos decorativos en las esquinas */}
      
      {/* Círculo superior izquierdo */}
      <motion.div
        className="absolute top-0 left-0 w-96 h-96 bg-amber-400 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-40"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.4 }}
        transition={{ duration: 1.5, delay: 0.5 }}
      />
      
      {/* Círculo inferior derecho */}
      <motion.div
        className="absolute bottom-0 right-0 w-80 h-80 bg-amber-400 rounded-full translate-x-1/3 translate-y-1/3 opacity-45"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.45 }}
        transition={{ duration: 1.5, delay: 0.8 }}
      />

      <div className="max-w-[1600px] mx-auto px-8 lg:px-16 w-full pt-16 relative z-10">
        <div className="relative text-center">
          
          {/* Subtítulo arriba - complementando el texto de fondo */}
          <motion.div
            className="mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <span className="text-sm font-medium text-neutral-500 tracking-[0.3em] uppercase">
              PRODUCTOS ARTESANALES
            </span>
          </motion.div>
          
          {/* Badge arriba */}
          <motion.div
            className="inline-flex items-center space-x-2 bg-amber-100 px-4 py-2 rounded-full mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Star size={14} className="text-amber-600 fill-current" />
            <span className="text-sm font-semibold text-amber-800">DESDE 1995</span>
          </motion.div>

          {/* TEXTO MASIVO DETRÁS - COMO FONDO */}
          <motion.div
            className="relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            {/* Texto de fondo - DETRÁS */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <h1 className="text-[8rem] lg:text-[12rem] xl:text-[16rem] font-black leading-[0.8] tracking-tighter text-orange-400 select-none">
                PREMIUM
              </h1>
              
              <h2 className="text-[8rem] lg:text-[12rem] xl:text-[16rem] font-black leading-[0.8] tracking-tighter text-zinc-950 select-none">
                BAKEHAUS
              </h2>
            </div>

            {/* Subtítulo justo debajo del texto BAKEHAUS - ENCIMA de la imagen */}
            <motion.div
            className="absolute inset-0 flex items-center justify-center z-30 mt-48 lg:mt-64 xl:mt-120"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.1 }}
            >
            <span className="text-xs lg:text-sm font-bold text-neutral-600 tracking-[0.4em] uppercase bg-white backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
              GUATEMALA CITY • ZONA 10 • PREMIUM BAKERY
            </span>
            </motion.div>

            {/* IMAGEN AL FRENTE - FLOTANDO */}
            <motion.div 
              className="relative z-10 h-[500px] lg:h-[700px] flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.8, y: 100 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.8 }}
            >
              {/* Imagen principal */}
              <motion.img
                src="/cookies.png"
                alt="Premium Cookies"
                className="relative z-20 w-full h-full object-contain drop-shadow-2xl"
                whileHover={{ scale: 1.05, rotate: 2 }}
                transition={{ duration: 0.4 }}
              />
            </motion.div>
          </motion.div>
          
        </div>
      </div>
      
      {/* Decorative elements */}
      <motion.div
        className="absolute top-1/4 left-16 w-3 h-3 bg-amber-400 rounded-full opacity-60"
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