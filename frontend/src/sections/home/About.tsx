import React from 'react';
import { motion } from 'framer-motion';
import { Heart, MapPin, Calendar, Users, Award, Globe, Star, Coffee } from 'lucide-react';

export const About: React.FC = () => {
  const locations = [
    'Los Ángeles', 'Chicago', 'Honolulu', 'México', 
    'Seúl', 'Tokio', 'Moscú', 'Dubai', 'Doha'
  ];

  const specialties = [
    {
      icon: Coffee,
      title: 'Cupcakes',
      description: 'Nuestra especialidad más querida',
      color: 'text-pink-500'
    },
    {
      icon: Heart,
      title: 'Tortas',
      description: 'Para cada ocasión especial',
      color: 'text-red-500'
    },
    {
      icon: Star,
      title: 'Galletas',
      description: 'Tradición en cada bocado',
      color: 'text-amber-500'
    }
  ];

  const events = [
    'Bodas', 'Eventos Corporativos', 'Cumpleaños', 'Baby Shower'
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-8 lg:px-16">
        
        {/* Header */}
        <motion.div 
          className="text-center mb-20"
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
            NUESTRA HISTORIA
          </motion.span>
          <h2 className="text-5xl lg:text-7xl font-black text-zinc-900 mb-6">
            Desde <span className="text-amber-500">1965</span>
          </h2>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
            Una tradición familiar que comenzó en Nueva York y ahora endulza el mundo entero
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center mb-24">
          
          {/* Historia */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-zinc-900">1965</h3>
                  <p className="text-neutral-600">Nuestros inicios</p>
                </div>
              </div>
              <p className="text-lg text-neutral-700 leading-relaxed">
                Panadería Pan y Miel abrió su primer local en una calle tranquila de Nueva York. 
                Desde el primer día, nos hemos distinguido por nuestra <strong>comida clásica americana</strong>, 
                nuestro <strong>look vintage y cálido</strong>, y por crear una <strong>atmósfera amigable</strong> 
                que hace sentir como en casa a cada cliente.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-zinc-900">2007</h3>
                  <p className="text-neutral-600">Nueva dirección</p>
                </div>
              </div>
              <p className="text-lg text-neutral-700 leading-relaxed">
                Steve y Tyra Abrams adquirieron Panadería Pan y Miel, marcando el inicio de una 
                nueva era de expansión. Juntos han llevado nuestra tradición familiar desde 
                Nueva York hasta convertirla en una marca reconocida mundialmente.
              </p>
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
            <div className="relative bg-gradient-to-br from-amber-100 to-orange-100 rounded-3xl p-8 lg:p-12">
              <motion.img
                src="/bakery-vintage.jpg"
                alt="Panadería histórica"
                className="w-full h-80 lg:h-96 object-cover rounded-2xl shadow-2xl"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.4 }}
              />
              
              <motion.div 
                className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-6 shadow-xl border border-neutral-100"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="text-center">
                  <div className="text-3xl font-black text-amber-600">58+</div>
                  <div className="text-sm font-semibold text-neutral-600">Años de Tradición</div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Presencia Global */}
        <motion.div 
          className="mb-24"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Globe className="w-8 h-8 text-amber-600" />
              <h3 className="text-4xl font-black text-zinc-900">Presencia Global</h3>
            </div>
            <p className="text-lg text-neutral-600">
              Llevamos nuestro sabor auténtico a las principales ciudades del mundo
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {locations.map((location, index) => (
              <motion.div
                key={location}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center space-x-2 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-full px-4 py-2 hover:shadow-md transition-all duration-300"
              >
                <MapPin size={16} className="text-amber-600" />
                <span className="text-sm font-semibold text-neutral-700">{location}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Especialidades */}
        <motion.div 
          className="mb-24"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-16">
            <h3 className="text-4xl font-black text-zinc-900 mb-4">Nuestras Especialidades</h3>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Productos artesanales hechos con amor y los mejores ingredientes
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {specialties.map((specialty, index) => {
              const IconComponent = specialty.icon;
              return (
                <motion.div
                  key={specialty.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="text-center group"
                >
                  <motion.div 
                    className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg border border-neutral-100 group-hover:shadow-xl transition-all duration-300"
                    whileHover={{ scale: 1.1, y: -5 }}
                  >
                    <IconComponent size={32} className={specialty.color} />
                  </motion.div>
                  <h4 className="text-2xl font-bold text-zinc-900 mb-3">{specialty.title}</h4>
                  <p className="text-neutral-600">{specialty.description}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Eventos */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-12 lg:p-16 text-center"
        >
          <div className="flex items-center justify-center space-x-3 mb-6">
            <Award className="w-8 h-8 text-amber-600" />
            <h3 className="text-4xl font-black text-zinc-900">Eventos Especiales</h3>
          </div>
          <p className="text-lg text-neutral-600 mb-8 max-w-3xl mx-auto">
            Nos especializamos en hacer de tus momentos más importantes una experiencia inolvidable. 
            Cubrimos pedidos al por mayor para todo tipo de celebraciones.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {events.map((event, index) => (
              <motion.div
                key={event}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl py-4 px-3 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <span className="text-sm font-semibold text-neutral-700">{event}</span>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <motion.button 
              className="bg-zinc-900 text-white font-bold px-8 py-4 rounded-full hover:bg-amber-600 transition-all duration-300 shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Solicitar Cotización
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative elements */}
      <motion.div
        className="absolute top-20 right-10 w-4 h-4 bg-amber-400 rounded-full opacity-60"
        animate={{ 
          y: [0, -15, 0],
          scale: [1, 1.3, 1]
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div
        className="absolute bottom-32 left-16 w-3 h-3 bg-orange-400 rounded-full opacity-40"
        animate={{ 
          y: [0, 20, 0],
          x: [0, 10, 0]
        }}
        transition={{ 
          duration: 5, 
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />
    </section>
  );
};