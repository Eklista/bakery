import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="bg-neutral-50 relative overflow-hidden min-h-screen flex items-center justify-center py-10">
      <div className="max-w-[1600px] mx-auto px-8 lg:px-16 w-full pt-16">
        <div className="relative text-center">
          
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
          
          {/* Información abajo */}
          <motion.div
            className="space-y-8 mt-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            {/* Description */}
            <p className="text-lg lg:text-xl text-neutral-600 max-w-2xl mx-auto leading-relaxed">
              Productos horneados artesanalmente con ingredientes premium.
              <br />
              <span className="text-amber-600 font-semibold">Perfección en cada bocado.</span>
            </p>

            {/* Stats */}
            <div className="flex items-center justify-center space-x-8 lg:space-x-12">
              <div className="text-center">
                <div className="text-2xl lg:text-3xl font-black text-neutral-900">25+</div>
                <div className="text-sm text-neutral-500 font-medium">AÑOS</div>
              </div>
              <div className="w-px h-10 bg-neutral-300"></div>
              <div className="text-center">
                <div className="text-2xl lg:text-3xl font-black text-neutral-900">100%</div>
                <div className="text-sm text-neutral-500 font-medium">ARTESANAL</div>
              </div>
              <div className="w-px h-10 bg-neutral-300"></div>
              <div className="text-center">
                <div className="text-2xl lg:text-3xl font-black text-green-600">4.8★</div>
                <div className="text-sm text-neutral-500 font-medium">TRIPADVISOR</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.button
                className="bg-amber-500 text-white px-8 py-4 rounded-full font-bold flex items-center space-x-2 hover:bg-amber-600 transition-all duration-300 shadow-xl hover:shadow-2xl group"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>ORDENAR AHORA</span>
                <ArrowRight 
                  size={20} 
                  className="group-hover:translate-x-1 transition-transform" 
                />
              </motion.button>
              
              <motion.button
                className="border-2 border-neutral-900 text-neutral-900 px-8 py-4 rounded-full font-bold hover:bg-neutral-900 hover:text-white transition-all duration-300"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                VER CATÁLOGO
              </motion.button>
            </div>
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