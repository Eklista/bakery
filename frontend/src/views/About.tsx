// src/views/About.tsx
import React, { memo, lazy } from 'react';
import { motion } from 'framer-motion';
import { Heart, Users, Award, Globe, Clock, MapPin, Phone, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const SectionSeparator = lazy(() => import('../components/ui/SectionSeparator').then(module => ({ default: module.SectionSeparator })));
const InteractiveMap = lazy(() => import('../components/InteractiveMap').then(module => ({ default: module.InteractiveMap })));

const StatsCard = memo(({ number, label, delay = 0 }: { number: string; label: string; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    viewport={{ once: true }}
    className="text-center"
  >
    <div className="text-4xl font-black text-amber-600 mb-2">{number}</div>
    <div className="text-sm text-neutral-600 font-medium">{label}</div>
  </motion.div>
));

const ValueCard = memo(({ 
  icon: Icon, 
  title, 
  description, 
  delay = 0 
}: { 
  icon: React.ComponentType<any>; 
  title: string; 
  description: string; 
  delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    viewport={{ once: true }}
    className="text-center p-6"
  >
    <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
      <Icon className="w-8 h-8 text-amber-600" />
    </div>
    <h3 className="text-xl font-bold text-zinc-900 mb-3">{title}</h3>
    <p className="text-neutral-600 leading-relaxed">{description}</p>
  </motion.div>
));

const LocationCard = memo(({ city, description, delay = 0 }: { city: string; description: string; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, delay }}
    viewport={{ once: true }}
    className="bg-white rounded-2xl p-6 border border-neutral-200 hover:shadow-lg transition-all duration-300"
  >
    <div className="flex items-center space-x-3 mb-2">
      <MapPin size={18} className="text-amber-600" />
      <h4 className="font-bold text-zinc-900">{city}</h4>
    </div>
    <p className="text-sm text-neutral-600">{description}</p>
  </motion.div>
));

export const About: React.FC = memo(() => {
  const { i18n } = useTranslation();

  const content = {
    es: {
      // Hero
      title: 'Nuestra Historia',
      subtitle: 'Más de 50 años endulzando momentos especiales',
      
      // Historia completa
      historyTitle: 'La Historia de BAKEHAUS',
      history1: 'Todo comenzó en 1965, cuando abrimos nuestro primer local en una tranquila esquina de Nueva York. Desde el primer día, BAKEHAUS se distinguió por ofrecer productos horneados artesanalmente, con un ambiente vintage y cálido que hacía sentir a cada cliente como en casa.',
      history2: 'Durante más de 40 años, fuimos el corazón de la comunidad neoyorquina, perfeccionando nuestras recetas tradicionales y creando memorias dulces para familias enteras. Nuestro compromiso con la calidad y la calidez humana se convirtió en nuestra marca distintiva.',
      history3: 'En 2007, Steve y Tyra Abrams compraron BAKEHAUS con una visión clara: llevar nuestra tradición familiar al mundo entero sin perder la esencia que nos hacía especiales. Bajo su liderazgo, comenzamos una expansión cuidadosa, asegurándonos de que cada nueva ubicación mantuviera los mismos estándares de calidad y calidez.',
      history4: 'Hoy, BAKEHAUS está presente en 10 ciudades alrededor del mundo, desde Los Ángeles hasta Dubai, pero seguimos siendo la misma panadería familiar que comenzó en Nueva York. Cada cupcake, cada torta, cada galleta sigue siendo horneada con el mismo amor y dedicación de siempre.',
      
      // Valores
      valuesTitle: 'Nuestros Valores',
      value1Title: 'Tradición Artesanal',
      value1Desc: 'Mantenemos las recetas originales de 1965, horneando cada producto con técnicas tradicionales y los mejores ingredientes.',
      value2Title: 'Momentos Especiales',
      value2Desc: 'Creemos que cada celebración merece ser única. Nos especializamos en hacer realidad los sueños dulces de nuestros clientes.',
      value3Title: 'Calidad Global',
      value3Desc: 'Aunque estamos en 10 ciudades, mantenemos los mismos estándares de calidad en cada ubicación alrededor del mundo.',
      value4Title: 'Familia BAKEHAUS',
      value4Desc: 'Tratamos a cada cliente como familia y a cada empleado como parte de nuestra tradición de más de 50 años.',
      
      // Especialidades
      specialtiesTitle: 'Nuestras Especialidades',
      specialtiesIntro: 'Con más de 50 años de experiencia, nos hemos convertido en expertos en crear momentos dulces para toda ocasión:',
      specialty1: 'Bodas elegantes con tortas personalizadas que reflejan la personalidad de cada pareja',
      specialty2: 'Eventos corporativos con presentaciones impecables que impresionan a clientes y empleados',
      specialty3: 'Cumpleaños únicos con diseños creativos que hacen sonreír a niños y adultos',
      specialty4: 'Baby showers con detalles tiernos que celebran la llegada de nuevas vidas',
      specialty5: 'Cupcakes gourmet con sabores innovadores y presentación artística',
      specialty6: 'Galletas artesanales perfectas para regalar o acompañar cualquier momento especial',
      
      // Ubicaciones
      locationsTitle: 'Nuestras Ubicaciones',
      locationsIntro: 'Encuentra BAKEHAUS en estas ciudades alrededor del mundo:',
      
      // Contacto
      contactTitle: 'Información de Contacto',
      contactIntro: 'Estamos aquí para hacer realidad tus momentos dulces',
      phone: 'Teléfono',
      email: 'Email',
      hours: 'Horarios Generales',
      hoursDetail: 'Lun-Vie: 6:00 AM - 8:00 PM, Sáb: 6:00 AM - 10:00 PM, Dom: 7:00 AM - 6:00 PM',
      
      // Stats
      founded: 'Fundada',
      cities: 'Ciudades',
      years: 'Años',
      events: 'Eventos',
      
      // Locations data
      locations: [
        { city: 'Nueva York', desc: 'Nuestra ubicación original desde 1965' },
        { city: 'Los Ángeles', desc: 'Sabores californianos con tradición neoyorquina' },
        { city: 'Chicago', desc: 'Calidez del medio oeste con calidad mundial' },
        { city: 'Honolulu', desc: 'Paraíso tropical con dulces tradicionales' },
        { city: 'México', desc: 'Fusión de sabores locales con recetas clásicas' },
        { city: 'Seúl', desc: 'Innovación asiática con esencia americana' },
        { city: 'Tokio', desc: 'Precisión japonesa con tradición familiar' },
        { city: 'Moscú', desc: 'Elegancia europea con calidez americana' },
        { city: 'Dubai', desc: 'Lujo del medio oriente con autenticidad' },
        { city: 'Doha', desc: 'Hospitalidad árabe con tradición centenaria' }
      ]
    },
    en: {
      // Hero
      title: 'Our Story',
      subtitle: 'Over 50 years sweetening special moments',
      
      // Complete history
      historyTitle: 'The BAKEHAUS Story',
      history1: 'It all began in 1965, when we opened our first location on a quiet corner in New York. From day one, BAKEHAUS distinguished itself by offering artisanally baked products, with a vintage and warm atmosphere that made every customer feel at home.',
      history2: 'For over 40 years, we were the heart of the New York community, perfecting our traditional recipes and creating sweet memories for entire families. Our commitment to quality and human warmth became our distinctive mark.',
      history3: 'In 2007, Steve and Tyra Abrams bought BAKEHAUS with a clear vision: to take our family tradition to the entire world without losing the essence that made us special. Under their leadership, we began a careful expansion, ensuring that each new location maintained the same standards of quality and warmth.',
      history4: 'Today, BAKEHAUS is present in 10 cities around the world, from Los Angeles to Dubai, but we remain the same family bakery that started in New York. Every cupcake, every cake, every cookie is still baked with the same love and dedication as always.',
      
      // Values
      valuesTitle: 'Our Values',
      value1Title: 'Artisanal Tradition',
      value1Desc: 'We maintain the original recipes from 1965, baking each product with traditional techniques and the finest ingredients.',
      value2Title: 'Special Moments',
      value2Desc: 'We believe every celebration deserves to be unique. We specialize in making our customers\' sweet dreams come true.',
      value3Title: 'Global Quality',
      value3Desc: 'Although we are in 10 cities, we maintain the same quality standards in each location around the world.',
      value4Title: 'BAKEHAUS Family',
      value4Desc: 'We treat every customer like family and every employee as part of our tradition of over 50 years.',
      
      // Specialties
      specialtiesTitle: 'Our Specialties',
      specialtiesIntro: 'With over 50 years of experience, we have become experts in creating sweet moments for every occasion:',
      specialty1: 'Elegant weddings with personalized cakes that reflect each couple\'s personality',
      specialty2: 'Corporate events with impeccable presentations that impress clients and employees',
      specialty3: 'Unique birthdays with creative designs that make children and adults smile',
      specialty4: 'Baby showers with tender details that celebrate the arrival of new lives',
      specialty5: 'Gourmet cupcakes with innovative flavors and artistic presentation',
      specialty6: 'Artisanal cookies perfect for gifting or accompanying any special moment',
      
      // Locations
      locationsTitle: 'Our Locations',
      locationsIntro: 'Find BAKEHAUS in these cities around the world:',
      
      // Contact
      contactTitle: 'Contact Information',
      contactIntro: 'We are here to make your sweet moments come true',
      phone: 'Phone',
      email: 'Email',
      hours: 'General Hours',
      hoursDetail: 'Mon-Fri: 6:00 AM - 8:00 PM, Sat: 6:00 AM - 10:00 PM, Sun: 7:00 AM - 6:00 PM',
      
      // Stats
      founded: 'Founded',
      cities: 'Cities',
      years: 'Years',
      events: 'Events',
      
      // Locations data
      locations: [
        { city: 'New York', desc: 'Our original location since 1965' },
        { city: 'Los Angeles', desc: 'Californian flavors with New York tradition' },
        { city: 'Chicago', desc: 'Midwest warmth with world-class quality' },
        { city: 'Honolulu', desc: 'Tropical paradise with traditional sweets' },
        { city: 'Mexico', desc: 'Fusion of local flavors with classic recipes' },
        { city: 'Seoul', desc: 'Asian innovation with American essence' },
        { city: 'Tokyo', desc: 'Japanese precision with family tradition' },
        { city: 'Moscow', desc: 'European elegance with American warmth' },
        { city: 'Dubai', desc: 'Middle Eastern luxury with authenticity' },
        { city: 'Doha', desc: 'Arab hospitality with centennial tradition' }
      ]
    }
  };

  const currentContent = content[i18n.language as 'es' | 'en'] || content.es;

  return (
    <div className="pt-20">

      {/* Banner Image */}
      <section className="relative h-64 lg:h-80 overflow-hidden">
        <motion.img
          src="/panaderia.jpg"
          alt="BAKEHAUS Panadería"
          className="w-full h-full object-cover"
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
            (e.target as HTMLImageElement).src = '/cookies.webp';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-black/40"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-center text-white"
          >
            <h1 className="text-4xl lg:text-6xl font-black mb-4">
              {currentContent.title}
            </h1>
            <p className="text-lg lg:text-xl font-medium">
              {currentContent.subtitle}
            </p>
          </motion.div>
        </div>
      </section>

      <React.Suspense fallback={<div className="py-4"></div>}>
        <SectionSeparator variant="dots" color="amber" size="md" />
      </React.Suspense>

      {/* Stats */}
      <section className="py-16 bg-white border-b border-neutral-100">
        <div className="max-w-[1600px] mx-auto px-8 lg:px-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatsCard number="1965" label={currentContent.founded} delay={0} />
            <StatsCard number="10+" label={currentContent.cities} delay={0.1} />
            <StatsCard number="50+" label={currentContent.years} delay={0.2} />
            <StatsCard number="1000+" label={currentContent.events} delay={0.3} />
          </div>
        </div>
      </section>

      <React.Suspense fallback={<div className="py-4"></div>}>
        <SectionSeparator variant="line" color="neutral" size="sm" />
      </React.Suspense>

      {/* Historia Completa */}
      <section className="py-16 bg-white">
        <div className="max-w-[1600px] mx-auto px-8 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-4xl font-black text-zinc-900 mb-12 text-center">
              {currentContent.historyTitle}
            </h2>
            
            <div className="space-y-8 text-lg text-neutral-600 leading-relaxed">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                {currentContent.history1}
              </motion.p>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
              >
                {currentContent.history2}
              </motion.p>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                viewport={{ once: true }}
              >
                {currentContent.history3}
              </motion.p>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                viewport={{ once: true }}
              >
                {currentContent.history4}
              </motion.p>
            </div>
          </motion.div>
        </div>
      </section>

      <React.Suspense fallback={<div className="py-4"></div>}>
        <SectionSeparator variant="dashed" color="amber" size="md" />
      </React.Suspense>

      {/* Valores */}
      <section className="py-16 bg-neutral-50">
        <div className="max-w-[1600px] mx-auto px-8 lg:px-16">
          <motion.h2 
            className="text-4xl font-black text-zinc-900 mb-16 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {currentContent.valuesTitle}
          </motion.h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <ValueCard 
              icon={Heart} 
              title={currentContent.value1Title}
              description={currentContent.value1Desc}
              delay={0}
            />
            <ValueCard 
              icon={Users} 
              title={currentContent.value2Title}
              description={currentContent.value2Desc}
              delay={0.1}
            />
            <ValueCard 
              icon={Globe} 
              title={currentContent.value3Title}
              description={currentContent.value3Desc}
              delay={0.2}
            />
            <ValueCard 
              icon={Award} 
              title={currentContent.value4Title}
              description={currentContent.value4Desc}
              delay={0.3}
            />
          </div>
        </div>
      </section>

      <React.Suspense fallback={<div className="py-4"></div>}>
        <SectionSeparator variant="dots" color="neutral" size="sm" />
      </React.Suspense>

      {/* Especialidades */}
      <section className="py-16 bg-white">
        <div className="max-w-[1600px] mx-auto px-8 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-4xl font-black text-zinc-900 mb-8 text-center">
              {currentContent.specialtiesTitle}
            </h2>
            
            <p className="text-lg text-neutral-600 mb-12 text-center">
              {currentContent.specialtiesIntro}
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              {[
                currentContent.specialty1,
                currentContent.specialty2,
                currentContent.specialty3,
                currentContent.specialty4,
                currentContent.specialty5,
                currentContent.specialty6
              ].map((specialty, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start space-x-3 p-4 rounded-xl hover:bg-amber-50/50 transition-colors"
                >
                  <div className="w-2 h-2 bg-amber-500 rounded-full mt-3 flex-shrink-0"></div>
                  <p className="text-neutral-700">{specialty}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <React.Suspense fallback={<div className="py-4"></div>}>
        <SectionSeparator variant="dotted-line" color="amber" size="lg" />
      </React.Suspense>

      {/* Ubicaciones */}
      <section className="py-16 bg-neutral-50">
        <div className="max-w-[1600px] mx-auto px-8 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-black text-zinc-900 mb-6">
              {currentContent.locationsTitle}
            </h2>
            <p className="text-lg text-neutral-600 mb-8">
              {currentContent.locationsIntro}
            </p>
          </motion.div>
          
          {/* Mapa Interactivo */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <React.Suspense fallback={
              <div className="w-full h-96 lg:h-[500px] bg-neutral-200 rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mx-auto mb-4"></div>
                  <p className="text-neutral-600">
                    {i18n.language === 'es' ? 'Cargando mapa...' : 'Loading map...'}
                  </p>
                </div>
              </div>
            }>
              <InteractiveMap />
            </React.Suspense>
          </motion.div>
          
          {/* Grid de ubicaciones */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {currentContent.locations.map((location, index) => (
              <LocationCard
                key={location.city}
                city={location.city}
                description={location.desc}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      <React.Suspense fallback={<div className="py-4"></div>}>
        <SectionSeparator variant="line" color="light" size="sm" />
      </React.Suspense>

      {/* Información de Contacto */}
      <section className="py-16 bg-white">
        <div className="max-w-[1600px] mx-auto px-8 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-black text-zinc-900 mb-6">
              {currentContent.contactTitle}
            </h2>
            <p className="text-lg text-neutral-600">
              {currentContent.contactIntro}
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center p-6 border-2 border-neutral-200 rounded-2xl hover:border-amber-400 hover:bg-amber-50/30 transition-all duration-300"
            >
              <Phone className="w-8 h-8 text-amber-600 mx-auto mb-4" />
              <h3 className="font-bold text-zinc-900 mb-2">{currentContent.phone}</h3>
              <p className="text-neutral-600">+502 2345-6789</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-center p-6 border-2 border-neutral-200 rounded-2xl hover:border-amber-400 hover:bg-amber-50/30 transition-all duration-300"
            >
              <Mail className="w-8 h-8 text-amber-600 mx-auto mb-4" />
              <h3 className="font-bold text-zinc-900 mb-2">{currentContent.email}</h3>
              <p className="text-neutral-600">hola@bakehaus.com</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center p-6 border-2 border-neutral-200 rounded-2xl hover:border-amber-400 hover:bg-amber-50/30 transition-all duration-300"
            >
              <Clock className="w-8 h-8 text-amber-600 mx-auto mb-4" />
              <h3 className="font-bold text-zinc-900 mb-2">{currentContent.hours}</h3>
              <p className="text-neutral-600 text-sm">{currentContent.hoursDetail}</p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
});