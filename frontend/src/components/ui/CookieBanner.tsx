// src/components/ui/CookieBanner.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Cookie, Settings, X, Check, Shield, BarChart3 } from 'lucide-react';

interface CookieSettings {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

export const CookieBanner: React.FC = () => {
  const { t } = useTranslation();
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<CookieSettings>({
    necessary: true,
    analytics: false,
    marketing: false,
    preferences: false
  });

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showSettings) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showSettings]);

  useEffect(() => {
    // Verificar si ya se aceptaron las cookies
    const cookieConsent = localStorage.getItem('bakehaus-cookie-consent');
    if (!cookieConsent) {
      setShowBanner(true);
    } else {
      // Cargar configuración guardada
      try {
        const savedSettings = JSON.parse(cookieConsent);
        setSettings(savedSettings);
      } catch (error) {
        console.warn('Error loading cookie settings:', error);
      }
    }
  }, []);

  const cookieTypes = [
    {
      key: 'necessary' as keyof CookieSettings,
      icon: Shield,
      title: t('cookies.necessary.title', 'Cookies Necesarias'),
      description: t('cookies.necessary.desc', 'Esenciales para el funcionamiento básico del sitio web'),
      required: true,
      examples: ['Idioma seleccionado', 'Configuración de sesión', 'Carrito de compras']
    },
    {
      key: 'preferences' as keyof CookieSettings,
      icon: Settings,
      title: t('cookies.preferences.title', 'Cookies de Preferencias'),
      description: t('cookies.preferences.desc', 'Recuerdan tus preferencias y configuraciones'),
      required: false,
      examples: ['Tema preferido', 'Configuración de idioma', 'Preferencias de visualización']
    },
    {
      key: 'analytics' as keyof CookieSettings,
      icon: BarChart3,
      title: t('cookies.analytics.title', 'Cookies de Análisis'),
      description: t('cookies.analytics.desc', 'Nos ayudan a entender cómo usas nuestro sitio web'),
      required: false,
      examples: ['Google Analytics', 'Estadísticas de uso', 'Análisis de rendimiento']
    },
  ];

  const handleAcceptAll = () => {
    const allAccepted: CookieSettings = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true
    };
    
    saveSettings(allAccepted);
    setShowBanner(false);
    console.log('🍪 All cookies accepted');
  };

  const handleAcceptNecessary = () => {
    const necessaryOnly: CookieSettings = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false
    };
    
    saveSettings(necessaryOnly);
    setShowBanner(false);
    console.log('🍪 Only necessary cookies accepted');
  };

  const handleSaveSettings = () => {
    saveSettings(settings);
    setShowSettings(false);
    setShowBanner(false);
    console.log('🍪 Custom settings saved:', settings);
  };

  const saveSettings = (cookieSettings: CookieSettings) => {
    localStorage.setItem('bakehaus-cookie-consent', JSON.stringify(cookieSettings));
    
    // Aquí puedes inicializar/desinicializar servicios según la configuración
    if (cookieSettings.analytics) {
      console.log('📊 Analytics enabled');
    }
    
    if (cookieSettings.marketing) {
      console.log('📢 Marketing cookies enabled');
    }
    
    if (cookieSettings.preferences) {
      console.log('⚙️ Preferences cookies enabled');
    }
  };

  const toggleSetting = (key: keyof CookieSettings) => {
    if (key === 'necessary') return;
    
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  if (!showBanner) return null;

  return (
    <AnimatePresence>
      {showBanner && (
        <>
          {/* Banner Principal */}
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-neutral-200 shadow-2xl"
          >
            <div className="max-w-7xl mx-auto p-4 lg:p-6">
              <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
                
                {/* Icono y Contenido */}
                <div className="flex items-start gap-3 lg:gap-4 flex-1">
                  <div className="flex-shrink-0">
                    <Cookie className="w-6 h-6 lg:w-8 lg:h-8 text-amber-500" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-base lg:text-lg font-bold text-zinc-900 mb-2">
                      {t('cookies.banner.title', '🍪 Utilizamos cookies')}
                    </h3>
                    <p className="text-sm lg:text-base text-neutral-600 leading-relaxed">
                      {t('cookies.banner.description', 'Utilizamos cookies para mejorar tu experiencia, analizar el tráfico del sitio y personalizar el contenido. Puedes elegir qué tipos de cookies permitir.')}
                    </p>
                  </div>
                </div>

                {/* Botones */}
                <div className="flex flex-col sm:flex-row gap-2 lg:gap-3 w-full lg:w-auto">
                  <motion.button
                    onClick={() => setShowSettings(true)}
                    className="flex items-center justify-center gap-2 px-3 lg:px-4 py-2 border border-neutral-300 rounded-lg text-neutral-700 hover:bg-neutral-50 transition-colors text-sm font-medium"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Settings size={14} />
                    {t('cookies.customize', 'Personalizar')}
                  </motion.button>
                  
                  <motion.button
                    onClick={handleAcceptNecessary}
                    className="px-3 lg:px-4 py-2 bg-neutral-600 text-white rounded-lg hover:bg-neutral-700 transition-colors text-sm font-medium"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {t('cookies.necessary', 'Solo Necesarias')}
                  </motion.button>
                  
                  <motion.button
                    onClick={handleAcceptAll}
                    className="px-3 lg:px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors text-sm font-medium"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {t('cookies.acceptAll', 'Aceptar Todo')}
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Modal de Configuración */}
          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center"
                onClick={() => setShowSettings(false)}
              >
                {/* Modal Container - Responsive */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  className="relative bg-white rounded-2xl lg:rounded-3xl w-full h-full lg:w-auto lg:h-auto lg:max-w-2xl mx-4 lg:mx-0 mt-20 lg:mt-0 mb-4 lg:mb-0 shadow-2xl overflow-hidden"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between p-4 lg:p-6 border-b border-neutral-100">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 lg:w-10 lg:h-10 bg-amber-100 rounded-full flex items-center justify-center">
                        <Cookie className="w-4 h-4 lg:w-5 lg:h-5 text-amber-600" />
                      </div>
                      <h2 className="text-xl lg:text-2xl font-bold text-zinc-900">
                        {t('cookies.settings.title', 'Configuración de Cookies')}
                      </h2>
                    </div>
                    <button
                      onClick={() => setShowSettings(false)}
                      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-100 transition-colors"
                    >
                      <X size={18} className="text-neutral-500" />
                    </button>
                  </div>

                  {/* Scrollable Content */}
                  <div className="overflow-y-auto max-h-[60vh] lg:max-h-[70vh]">
                    <div className="p-4 lg:p-6">
                      {/* Descripción */}
                      <p className="text-neutral-600 mb-6 leading-relaxed text-sm lg:text-base">
                        {t('cookies.settings.description', 'Gestiona tus preferencias de cookies. Puedes habilitar o deshabilitar diferentes tipos de cookies según tus preferencias.')}
                      </p>

                      {/* Lista de Cookies */}
                      <div className="space-y-4 lg:space-y-6">
                        {cookieTypes.map((cookieType) => {
                          const IconComponent = cookieType.icon;
                          const isEnabled = settings[cookieType.key];
                          
                          return (
                            <div
                              key={cookieType.key}
                              className="border border-neutral-200 rounded-xl p-3 lg:p-4"
                            >
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-start gap-3">
                                  <IconComponent className="w-4 h-4 lg:w-5 lg:h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                  <div className="flex-1">
                                    <h3 className="font-semibold text-zinc-900 text-sm lg:text-base">
                                      {cookieType.title}
                                    </h3>
                                    <p className="text-xs lg:text-sm text-neutral-600 mt-1">
                                      {cookieType.description}
                                    </p>
                                  </div>
                                </div>
                                
                                <div className="flex-shrink-0 ml-3">
                                  {cookieType.required ? (
                                    <div className="px-2 lg:px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                      {t('cookies.required', 'Requerido')}
                                    </div>
                                  ) : (
                                    <motion.button
                                      onClick={() => toggleSetting(cookieType.key)}
                                      className={`w-10 h-5 lg:w-12 lg:h-6 rounded-full transition-colors ${
                                        isEnabled ? 'bg-amber-500' : 'bg-neutral-300'
                                      }`}
                                      whileTap={{ scale: 0.95 }}
                                    >
                                      <motion.div
                                        className="w-4 h-4 lg:w-5 lg:h-5 bg-white rounded-full shadow-sm"
                                        animate={{
                                          x: isEnabled ? 20 : 2
                                        }}
                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                      />
                                    </motion.button>
                                  )}
                                </div>
                              </div>
                              
                              {/* Ejemplos */}
                              <div className="ml-6 lg:ml-8">
                                <p className="text-xs text-neutral-500 mb-2">
                                  {t('cookies.examples', 'Ejemplos:')}
                                </p>
                                <div className="flex flex-wrap gap-1">
                                  {cookieType.examples.map((example, index) => (
                                    <span
                                      key={index}
                                      className="px-2 py-1 bg-neutral-100 text-neutral-600 rounded text-xs"
                                    >
                                      {example}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Footer Buttons */}
                  <div className="border-t border-neutral-100 p-4 lg:p-6">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <motion.button
                        onClick={handleAcceptNecessary}
                        className="flex-1 px-4 py-3 border border-neutral-300 text-neutral-700 rounded-xl hover:bg-neutral-50 transition-colors font-medium text-sm lg:text-base"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {t('cookies.rejectAll', 'Rechazar Todo')}
                      </motion.button>
                      
                      <motion.button
                        onClick={handleSaveSettings}
                        className="flex-1 px-4 py-3 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-colors font-medium flex items-center justify-center gap-2 text-sm lg:text-base"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Check size={16} />
                        {t('cookies.saveSettings', 'Guardar Configuración')}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
};