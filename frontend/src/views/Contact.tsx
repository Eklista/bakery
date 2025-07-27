// src/views/Contact.tsx
import React, { memo, useEffect, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, AlertCircle, User, MessageSquare } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useContact } from '../contexts/ContactContext';
import { useContactForm } from '../hooks/useContactForm';

const SectionSeparator = lazy(() => import('../components/ui/SectionSeparator').then(module => ({ default: module.SectionSeparator })));
const InteractiveMap = lazy(() => import('../components/InteractiveMap').then(module => ({ default: module.InteractiveMap })));

const ContactInfo = memo(({ 
  icon: Icon, 
  title, 
  info, 
  delay = 0 
}: { 
  icon: React.ComponentType<any>; 
  title: string; 
  info: string | string[]; 
  delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    viewport={{ once: true }}
    className="text-center p-6 lg:p-8 bg-white rounded-2xl lg:rounded-3xl shadow-lg border border-neutral-200 hover:shadow-xl transition-all duration-300"
    whileHover={{ y: -4 }}
  >
    <div className="w-16 h-16 lg:w-20 lg:h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4 lg:mb-6">
      <Icon className="w-8 h-8 lg:w-10 lg:h-10 text-amber-600" />
    </div>
    <h3 className="text-lg lg:text-xl font-bold text-zinc-900 mb-3">{title}</h3>
    {Array.isArray(info) ? (
      <div className="space-y-1">
        {info.map((line, index) => (
          <p key={index} className="text-neutral-600 text-sm lg:text-base">{line}</p>
        ))}
      </div>
    ) : (
      <p className="text-neutral-600 text-sm lg:text-base">{info}</p>
    )}
  </motion.div>
));

export const Contact: React.FC = memo(() => {
  const { i18n } = useTranslation();
  const { prefillData, clearPrefillData } = useContact();
  
  const {
    formData,
    errors,
    isSubmitting,
    submitStatus,
    errorMessage,
    handleInputChange,
    handleSubmit,
    setFormData
  } = useContactForm({
    language: i18n.language as 'es' | 'en',
    onSuccess: () => {
      console.log('✅ Formulario enviado exitosamente');
    },
    onError: (error) => {
      console.error('❌ Error en formulario:', error);
    }
  });

  // Efecto para aplicar datos de prellenado (mantén esto igual)
  useEffect(() => {
    if (prefillData && Object.keys(prefillData).length > 0) {
      console.log('📝 Applying prefill data:', prefillData);
      
      setFormData(prev => ({
        ...prev,
        eventType: prefillData.eventType || prev.eventType,
        eventDate: prefillData.eventDate || prev.eventDate,
        subject: prefillData.subject || prev.subject
      }));

      clearPrefillData();
    }
  }, [prefillData, clearPrefillData, setFormData]);

  const content = {
    es: {
      title: 'Contáctanos',
      subtitle: 'Estamos aquí para hacer realidad tus momentos dulces',
      description: 'Ponte en contacto con nosotros para cualquier consulta, pedido especial o simplemente para saludar.',
      
      form: {
        title: 'Envíanos un Mensaje',
        subtitle: 'Completa el formulario y te responderemos pronto',
        name: 'Nombre completo',
        namePlaceholder: 'Tu nombre completo',
        email: 'Correo electrónico',
        emailPlaceholder: 'tu@email.com',
        phone: 'Teléfono',
        phonePlaceholder: '+502 0000-0000',
        subject: 'Asunto',
        subjectPlaceholder: 'Asunto de tu mensaje',
        eventType: 'Tipo de evento (opcional)',
        eventDate: 'Fecha del evento (opcional)',
        message: 'Mensaje',
        messagePlaceholder: 'Cuéntanos sobre tu proyecto o consulta...',
        send: 'Enviar Mensaje',
        sending: 'Enviando...',
        
        eventTypes: [
          { value: '', label: 'Selecciona tipo de evento' },
          { value: 'wedding', label: 'Boda' },
          { value: 'corporate', label: 'Evento Corporativo' },
          { value: 'birthday', label: 'Cumpleaños' },
          { value: 'baby-shower', label: 'Baby Shower' },
          { value: 'other', label: 'Otro' }
        ],
        
        success: {
          title: '¡Mensaje enviado!',
          message: 'Gracias por contactarnos. Te responderemos pronto.'
        },
        
        error: {
          title: 'Error al enviar',
          message: 'Hubo un problema. Inténtalo de nuevo o contáctanos directamente.'
        }
      },
      
      info: {
        phone: {
          title: 'Teléfono',
          info: '+502 2345-6789'
        },
        email: {
          title: 'Email',
          info: 'hola@bakehaus.com'
        },
        address: {
          title: 'Dirección',
          info: ['Zona 10, Ciudad de Guatemala', 'Guatemala, GT']
        },
        hours: {
          title: 'Horarios',
          info: [
            'Lun - Vie: 6:00 - 20:00',
            'Sáb: 6:00 - 22:00',
            'Dom: 7:00 - 18:00'
          ]
        }
      },
      
      validation: {
        nameRequired: 'El nombre es requerido',
        emailRequired: 'El email es requerido',
        emailInvalid: 'Email inválido',
        phoneRequired: 'El teléfono es requerido',
        subjectRequired: 'El asunto es requerido',
        messageRequired: 'El mensaje es requerido',
        messageMinLength: 'El mensaje debe tener al menos 10 caracteres'
      }
    },
    en: {
      title: 'Contact Us',
      subtitle: 'We are here to make your sweet moments come true',
      description: 'Get in touch with us for any inquiry, special order or just to say hello.',
      
      form: {
        title: 'Send us a Message',
        subtitle: 'Fill out the form and we will get back to you soon',
        name: 'Full name',
        namePlaceholder: 'Your full name',
        email: 'Email',
        emailPlaceholder: 'your@email.com',
        phone: 'Phone',
        phonePlaceholder: '+502 0000-0000',
        subject: 'Subject',
        subjectPlaceholder: 'Subject of your message',
        eventType: 'Event type (optional)',
        eventDate: 'Event date (optional)',
        message: 'Message',
        messagePlaceholder: 'Tell us about your project or inquiry...',
        send: 'Send Message',
        sending: 'Sending...',
        
        eventTypes: [
          { value: '', label: 'Select event type' },
          { value: 'wedding', label: 'Wedding' },
          { value: 'corporate', label: 'Corporate Event' },
          { value: 'birthday', label: 'Birthday' },
          { value: 'baby-shower', label: 'Baby Shower' },
          { value: 'other', label: 'Other' }
        ],
        
        success: {
          title: 'Message sent!',
          message: 'Thank you for contacting us. We will get back to you soon.'
        },
        
        error: {
          title: 'Error sending',
          message: 'There was a problem. Please try again or contact us directly.'
        }
      },
      
      info: {
        phone: {
          title: 'Phone',
          info: '+502 2345-6789'
        },
        email: {
          title: 'Email',
          info: 'hello@bakehaus.com'
        },
        address: {
          title: 'Address',
          info: ['Zone 10, Guatemala City', 'Guatemala, GT']
        },
        hours: {
          title: 'Hours',
          info: [
            'Mon - Fri: 6:00 AM - 8:00 PM',
            'Sat: 6:00 AM - 10:00 PM',
            'Sun: 7:00 AM - 6:00 PM'
          ]
        }
      },
      
              validation: {
        nameRequired: 'Name is required',
        emailRequired: 'Email is required',
        emailInvalid: 'Invalid email',
        phoneRequired: 'Phone is required',
        subjectRequired: 'Subject is required',
        messageRequired: 'Message is required',
        messageMinLength: 'Message must be at least 10 characters'
      }
    }
  };

  const currentContent = content[i18n.language as 'es' | 'en'] || content.es;

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 bg-gradient-to-br from-amber-50 via-orange-50/30 to-neutral-50 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-200/15 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3"></div>
        
        <div className="max-w-[1600px] mx-auto px-8 lg:px-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <span className="text-sm font-bold text-amber-600 tracking-[0.3em] uppercase mb-4 block">
              CONTÁCTANOS
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

      {/* Información de Contacto */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-[1600px] mx-auto px-8 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            <ContactInfo
              icon={Phone}
              title={currentContent.info.phone.title}
              info={currentContent.info.phone.info}
              delay={0}
            />
            <ContactInfo
              icon={Mail}
              title={currentContent.info.email.title}
              info={currentContent.info.email.info}
              delay={0.1}
            />
            <ContactInfo
              icon={MapPin}
              title={currentContent.info.address.title}
              info={currentContent.info.address.info}
              delay={0.2}
            />
            <ContactInfo
              icon={Clock}
              title={currentContent.info.hours.title}
              info={currentContent.info.hours.info}
              delay={0.3}
            />
          </div>
        </div>
      </section>

      <React.Suspense fallback={<div className="py-4"></div>}>
        <SectionSeparator variant="dashed" color="neutral" size="md" />
      </React.Suspense>

      {/* Formulario y Mapa */}
      <section className="py-16 lg:py-24 bg-neutral-50">
        <div className="max-w-[1600px] mx-auto px-8 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            
            {/* Formulario */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl p-8 lg:p-12 shadow-xl border border-neutral-200"
            >
              <div className="mb-8">
                <h2 className="text-3xl lg:text-4xl font-black text-zinc-900 mb-4">
                  {currentContent.form.title}
                </h2>
                <p className="text-neutral-600 leading-relaxed">
                  {currentContent.form.subtitle}
                </p>
              </div>

              <AnimatePresence mode="wait">
                {submitStatus === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center space-x-3"
                  >
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-green-800">{currentContent.form.success.title}</p>
                      <p className="text-sm text-green-600">{currentContent.form.success.message}</p>
                    </div>
                  </motion.div>
                )}

                {submitStatus === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-3"
                  >
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-red-800">{currentContent.form.error.title}</p>
                      <p className="text-sm text-red-600">{errorMessage || currentContent.form.error.message}</p>
                    </div>
                  </motion.div>
                )}

                {submitStatus === 'rate-limited' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl flex items-center space-x-3"
                  >
                    <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-yellow-800">Demasiados intentos</p>
                      <p className="text-sm text-yellow-600">{errorMessage}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-zinc-900 mb-2">
                      {currentContent.form.name} *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={18} />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder={currentContent.form.namePlaceholder}
                        className={`w-full pl-10 pr-4 py-3 bg-neutral-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all ${
                          errors.name ? 'border-red-300 bg-red-50' : 'border-neutral-200'
                        }`}
                      />
                    </div>
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-zinc-900 mb-2">
                      {currentContent.form.email} *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={18} />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder={currentContent.form.emailPlaceholder}
                        className={`w-full pl-10 pr-4 py-3 bg-neutral-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all ${
                          errors.email ? 'border-red-300 bg-red-50' : 'border-neutral-200'
                        }`}
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-zinc-900 mb-2">
                      {currentContent.form.phone} *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={18} />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder={currentContent.form.phonePlaceholder}
                        className={`w-full pl-10 pr-4 py-3 bg-neutral-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all ${
                          errors.phone ? 'border-red-300 bg-red-50' : 'border-neutral-200'
                        }`}
                      />
                    </div>
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-zinc-900 mb-2">
                      {currentContent.form.eventType}
                    </label>
                    <select
                      name="eventType"
                      value={formData.eventType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    >
                      {currentContent.form.eventTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-zinc-900 mb-2">
                      {currentContent.form.subject} *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder={currentContent.form.subjectPlaceholder}
                      className={`w-full px-4 py-3 bg-neutral-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all ${
                        errors.subject ? 'border-red-300 bg-red-50' : 'border-neutral-200'
                      }`}
                    />
                    {errors.subject && (
                      <p className="mt-1 text-sm text-red-600">{errors.subject}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-zinc-900 mb-2">
                      {currentContent.form.eventDate}
                    </label>
                    <input
                      type="date"
                      name="eventDate"
                      value={formData.eventDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-zinc-900 mb-2">
                    {currentContent.form.message} *
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3 text-neutral-400" size={18} />
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder={currentContent.form.messagePlaceholder}
                      rows={5}
                      className={`w-full pl-10 pr-4 py-3 bg-neutral-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all resize-none ${
                        errors.message ? 'border-red-300 bg-red-50' : 'border-neutral-200'
                      }`}
                    />
                  </div>
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-600">{errors.message}</p>
                  )}
                </div>

                <motion.button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full bg-zinc-900 text-white font-bold py-4 rounded-xl hover:bg-amber-500 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                  whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>{currentContent.form.sending}</span>
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      <span>{currentContent.form.send}</span>
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>

            {/* Mapa */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <h3 className="text-2xl lg:text-3xl font-bold text-zinc-900 mb-4">
                  {i18n.language === 'es' ? 'Nuestras Ubicaciones' : 'Our Locations'}
                </h3>
                <p className="text-neutral-600 leading-relaxed">
                  {i18n.language === 'es' 
                    ? 'Encuentra BAKEHAUS en estas ciudades alrededor del mundo. Haz clic en los marcadores para más información.'
                    : 'Find BAKEHAUS in these cities around the world. Click on the markers for more information.'
                  }
                </p>
              </div>

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
          </div>
        </div>
      </section>
    </div>
  );
});