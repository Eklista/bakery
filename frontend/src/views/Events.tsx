// src/views/Events.tsx
import React, { memo, useState, lazy } from 'react';
import { motion } from 'framer-motion';
import { Clock, Users, Phone, Mail, Heart, Cake, Gift } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useContact } from '../contexts/ContactContext';

const SectionSeparator = lazy(() => import('../components/ui/SectionSeparator').then(module => ({ default: module.SectionSeparator })));

interface EventType {
  id: number;
  icon: React.ComponentType<any>;
  title: string;
  description: string;
  features: string[];
  image: string;
  color: string;
}

const EventCard = memo(({ event, index, language, onRequestQuote }: { 
  event: EventType; 
  index: number; 
  language: string;
  onRequestQuote: (eventType: string, eventTitle: string) => void;
}) => {
  const IconComponent = event.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="bg-white rounded-3xl overflow-hidden shadow-lg border border-neutral-200 hover:shadow-2xl transition-all duration-500 group"
      whileHover={{ y: -8, scale: 1.02 }}
    >
      <div className="relative h-48 lg:h-64 overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
            (e.target as HTMLImageElement).src = '/cookies.webp';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        <div className={`absolute top-4 left-4 w-12 h-12 ${event.color} rounded-full flex items-center justify-center shadow-lg`}>
          <IconComponent className="w-6 h-6 text-white" />
        </div>
      </div>
      
      <div className="p-6 lg:p-8">
        <h3 className="text-xl lg:text-2xl font-bold text-zinc-900 mb-4 group-hover:text-amber-600 transition-colors">
          {event.title}
        </h3>
        <p className="text-neutral-600 mb-6 leading-relaxed">
          {event.description}
        </p>
        
        <div className="space-y-3 mb-6">
          {event.features.map((feature, featureIndex) => (
            <div key={featureIndex} className="flex items-start space-x-3">
              <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-sm text-neutral-700">{feature}</span>
            </div>
          ))}
        </div>
        
        <motion.button
          onClick={() => onRequestQuote(event.id.toString(), event.title)}
          className="w-full bg-zinc-900 text-white font-bold py-3 lg:py-4 rounded-xl hover:bg-amber-500 transition-all duration-300 shadow-lg"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {language === 'es' ? 'Solicitar Cotización' : 'Request Quote'}
        </motion.button>
      </div>
    </motion.div>
  );
});

const ProcessStep = memo(({ step, index }: { 
  step: { number: string; title: string; description: string }; 
  index: number; 
  language: string; 
}) => (
  <motion.div
    initial={{ opacity: 0, x: -30 }}
    whileInView={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.6, delay: index * 0.2 }}
    viewport={{ once: true }}
    className="flex items-start space-x-4 lg:space-x-6"
  >
    <div className="flex-shrink-0 w-12 h-12 lg:w-16 lg:h-16 bg-amber-500 rounded-full flex items-center justify-center shadow-lg">
      <span className="text-white font-black text-lg lg:text-xl">{step.number}</span>
    </div>
    <div className="flex-1">
      <h3 className="text-lg lg:text-xl font-bold text-zinc-900 mb-2">{step.title}</h3>
      <p className="text-neutral-600 leading-relaxed">{step.description}</p>
    </div>
  </motion.div>
));

export const Events: React.FC = memo(() => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const { setPrefillData } = useContact();
  const [] = useState<number | null>(null);

  // Función para manejar la cotización
  const handleRequestQuote = (eventType: string, eventTitle: string) => {
    console.log('🎯 Requesting quote for:', { eventType, eventTitle });
    
    // Mapear el ID del evento al valor del formulario
    const eventTypeMap: Record<string, string> = {
      '1': 'wedding',
      '2': 'corporate', 
      '3': 'birthday',
      '4': 'baby-shower'
    };

    const formEventType = eventTypeMap[eventType] || 'other';
    
    // Establecer datos de prellenado
    setPrefillData({
      eventType: formEventType,
      subject: `${i18n.language === 'es' ? 'Cotización para' : 'Quote for'} ${eventTitle}`
    });

    // Navegar a contacto
    navigate('/contacto');
  };

  // Función para el botón principal de contacto
  const handleMainContactClick = () => {
    console.log('📞 Main contact click');
    
    setPrefillData({
      subject: i18n.language === 'es' ? 'Consulta sobre eventos especiales' : 'Special events inquiry'
    });

    navigate('/contacto');
  };

  const content = {
    es: {
      title: 'Eventos Especiales',
      subtitle: 'Hacemos realidad los momentos más dulces de tu vida',
      description: 'Con más de 50 años de experiencia, somos especialistas en crear experiencias únicas para cada ocasión especial.',
      
      processTitle: 'Nuestro Proceso',
      processSteps: [
        {
          number: '1',
          title: 'Consulta Inicial',
          description: 'Conversamos sobre tu visión, fecha, número de invitados y preferencias especiales.'
        },
        {
          number: '2',
          title: 'Propuesta Personalizada',
          description: 'Creamos una propuesta detallada con diseños, sabores y presupuesto ajustado a tus necesidades.'
        },
        {
          number: '3',
          title: 'Degustación',
          description: 'Te invitamos a probar nuestros sabores para que elijas los perfectos para tu evento.'
        },
        {
          number: '4',
          title: 'Entrega Perfecta',
          description: 'Nos encargamos de todos los detalles para que tu evento sea perfecto y memorable.'
        }
      ],

      eventsTypes: [
        {
          id: 1,
          icon: Heart,
          title: 'Bodas',
          description: 'Tortas de bodas únicas que reflejan la personalidad de cada pareja. Diseños elegantes con sabores exquisitos.',
          features: [
            'Tortas de múltiples pisos personalizadas',
            'Cupcakes y postres para mesa dulce',
            'Degustación previa incluida',
            'Entrega y montaje en el lugar del evento'
          ],
          image: '/panaderia.jpg',
          color: 'bg-pink-500'
        },
        {
          id: 2,
          icon: Users,
          title: 'Eventos Corporativos',
          description: 'Impresiona a clientes y empleados con presentaciones profesionales y sabores memorables.',
          features: [
            'Branding personalizado en productos',
            'Variedad de opciones para diferentes gustos',
            'Presentación profesional e impecable',
            'Servicio de entrega puntual'
          ],
          image: '/cookies.webp',
          color: 'bg-blue-500'
        },
        {
          id: 3,
          icon: Cake,
          title: 'Cumpleaños',
          description: 'Celebraciones únicas para todas las edades con diseños creativos y sabores increíbles.',
          features: [
            'Diseños temáticos personalizados',
            'Tortas para todas las edades',
            'Cupcakes individuales disponibles',
            'Opciones sin gluten y veganas'
          ],
          image: '/panaderia.jpg',
          color: 'bg-purple-500'
        },
        {
          id: 4,
          icon: Gift,
          title: 'Baby Shower',
          description: 'Detalles tiernos y dulces para celebrar la llegada de una nueva vida con amor.',
          features: [
            'Diseños tiernos y delicados',
            'Colores personalizados según género',
            'Mini cupcakes y galletas decoradas',
            'Presentación especial para fotos'
          ],
          image: '/cookies.webp',
          color: 'bg-green-500'
        }
      ],

      contactSection: {
        title: 'Planifica tu Evento',
        subtitle: 'Contáctanos para crear juntos el evento perfecto',
        phone: '+502 2345-6789',
        email: 'eventos@bakehaus.com',
        hours: 'Lun-Vie: 8:00 AM - 6:00 PM'
      }
    },
    en: {
      title: 'Special Events',
      subtitle: 'We make the sweetest moments of your life come true',
      description: 'With over 50 years of experience, we specialize in creating unique experiences for every special occasion.',
      
      processTitle: 'Our Process',
      processSteps: [
        {
          number: '1',
          title: 'Initial Consultation',
          description: 'We discuss your vision, date, number of guests and special preferences.'
        },
        {
          number: '2',
          title: 'Custom Proposal',
          description: 'We create a detailed proposal with designs, flavors and budget tailored to your needs.'
        },
        {
          number: '3',
          title: 'Tasting',
          description: 'We invite you to try our flavors so you can choose the perfect ones for your event.'
        },
        {
          number: '4',
          title: 'Perfect Delivery',
          description: 'We take care of every detail to make your event perfect and memorable.'
        }
      ],

      eventsTypes: [
        {
          id: 1,
          icon: Heart,
          title: 'Weddings',
          description: 'Unique wedding cakes that reflect each couple\'s personality. Elegant designs with exquisite flavors.',
          features: [
            'Custom multi-tier cakes',
            'Cupcakes and desserts for sweet table',
            'Pre-tasting included',
            'Delivery and setup at event location'
          ],
          image: '/panaderia.jpg',
          color: 'bg-pink-500'
        },
        {
          id: 2,
          icon: Users,
          title: 'Corporate Events',
          description: 'Impress clients and employees with professional presentations and memorable flavors.',
          features: [
            'Custom branding on products',
            'Variety of options for different tastes',
            'Professional and impeccable presentation',
            'Punctual delivery service'
          ],
          image: '/cookies.webp',
          color: 'bg-blue-500'
        },
        {
          id: 3,
          icon: Cake,
          title: 'Birthdays',
          description: 'Unique celebrations for all ages with creative designs and incredible flavors.',
          features: [
            'Custom thematic designs',
            'Cakes for all ages',
            'Individual cupcakes available',
            'Gluten-free and vegan options'
          ],
          image: '/panaderia.jpg',
          color: 'bg-purple-500'
        },
        {
          id: 4,
          icon: Gift,
          title: 'Baby Shower',
          description: 'Tender and sweet details to celebrate the arrival of a new life with love.',
          features: [
            'Tender and delicate designs',
            'Custom colors by gender',
            'Mini cupcakes and decorated cookies',
            'Special presentation for photos'
          ],
          image: '/cookies.webp',
          color: 'bg-green-500'
        }
      ],

      contactSection: {
        title: 'Plan Your Event',
        subtitle: 'Contact us to create the perfect event together',
        phone: '+502 2345-6789',
        email: 'events@bakehaus.com',
        hours: 'Mon-Fri: 8:00 AM - 6:00 PM'
      }
    }
  };

  const currentContent = content[i18n.language as 'es' | 'en'] || content.es;

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 bg-gradient-to-br from-amber-50 via-orange-50/30 to-neutral-50 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-orange-200/15 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>
        
        <div className="max-w-[1600px] mx-auto px-8 lg:px-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <span className="text-sm font-bold text-amber-600 tracking-[0.3em] uppercase mb-4 block">
              EVENTOS ESPECIALES
            </span>
            <h1 className="text-4xl lg:text-6xl xl:text-7xl font-black text-zinc-900 mb-6">
              {currentContent.title}
            </h1>
            <p className="text-xl lg:text-2xl text-neutral-600 mb-8 leading-relaxed">
              {currentContent.subtitle}
            </p>
            <p className="text-lg text-neutral-600 leading-relaxed">
              {currentContent.description}
            </p>
          </motion.div>
        </div>
      </section>

      <React.Suspense fallback={<div className="py-4"></div>}>
        <SectionSeparator variant="dots" color="amber" size="lg" />
      </React.Suspense>

      {/* Tipos de Eventos */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-[1600px] mx-auto px-8 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {currentContent.eventsTypes.map((event, index) => (
              <EventCard
                key={event.id}
                event={event}
                index={index}
                language={i18n.language}
                onRequestQuote={handleRequestQuote}
              />
            ))}
          </div>
        </div>
      </section>

      <React.Suspense fallback={<div className="py-4"></div>}>
        <SectionSeparator variant="dashed" color="neutral" size="md" />
      </React.Suspense>

      {/* Proceso */}
      <section className="py-16 lg:py-24 bg-neutral-50">
        <div className="max-w-[1600px] mx-auto px-8 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-black text-zinc-900 mb-6">
              {currentContent.processTitle}
            </h2>
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-8 lg:space-y-12">
            {currentContent.processSteps.map((step, index) => (
              <ProcessStep
                key={step.number}
                step={step}
                index={index}
                language={i18n.language}
              />
            ))}
          </div>
        </div>
      </section>

      <React.Suspense fallback={<div className="py-4"></div>}>
        <SectionSeparator variant="dotted-line" color="amber" size="lg" />
      </React.Suspense>

      {/* Contacto para Eventos */}
      <section className="py-16 lg:py-24 bg-zinc-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="max-w-[1600px] mx-auto px-8 lg:px-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-6">
              {currentContent.contactSection.title}
            </h2>
            <p className="text-xl text-neutral-300 max-w-2xl mx-auto">
              {currentContent.contactSection.subtitle}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20"
            >
              <Phone className="w-8 h-8 text-amber-400 mx-auto mb-4" />
              <h3 className="font-bold text-white mb-2">
                {i18n.language === 'es' ? 'Teléfono' : 'Phone'}
              </h3>
              <p className="text-neutral-300">{currentContent.contactSection.phone}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20"
            >
              <Mail className="w-8 h-8 text-amber-400 mx-auto mb-4" />
              <h3 className="font-bold text-white mb-2">Email</h3>
              <p className="text-neutral-300">{currentContent.contactSection.email}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20"
            >
              <Clock className="w-8 h-8 text-amber-400 mx-auto mb-4" />
              <h3 className="font-bold text-white mb-2">
                {i18n.language === 'es' ? 'Horarios' : 'Hours'}
              </h3>
              <p className="text-neutral-300 text-sm">{currentContent.contactSection.hours}</p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <motion.button
              onClick={handleMainContactClick}
              className="bg-amber-500 text-zinc-900 font-bold px-8 py-4 rounded-full hover:bg-amber-400 transition-all duration-300 shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              {i18n.language === 'es' ? 'Solicitar Cotización Ahora' : 'Request Quote Now'}
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
});