// src/components/ui/LanguageModal.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Globe, Check } from 'lucide-react';

interface LanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LanguageModal: React.FC<LanguageModalProps> = ({ isOpen, onClose }) => {
  const { i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState('en'); // Default inglés
  const [rememberChoice, setRememberChoice] = useState(true);

  const languages = [
    {
      code: 'en',
      name: 'English',
      flag: '🇺🇸',
      description: 'Founded in New York since 1965'
    },
    {
      code: 'es', 
      name: 'Español',
      flag: '🇲🇽',
      description: 'Ahora en México City'
    }
  ];

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleConfirm = () => {
    i18n.changeLanguage(selectedLanguage);
    
    if (rememberChoice) {
      localStorage.setItem('bakehaus-language', selectedLanguage);
      localStorage.setItem('bakehaus-modal-shown', 'true');
    }
    
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[70] flex items-center justify-center"
      >
        {/* Modal Container - Responsive */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative bg-white rounded-2xl lg:rounded-3xl w-full h-full lg:w-auto lg:h-auto lg:max-w-lg mx-4 lg:mx-0 mt-20 lg:mt-0 mb-4 lg:mb-0 shadow-2xl overflow-hidden"
        >
          {/* Scrollable Content */}
          <div className="h-full lg:h-auto overflow-y-auto">
            <div className="p-6 lg:p-8">
              {/* Header */}
              <div className="text-center mb-6 lg:mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <Globe size={24} className="text-white lg:w-[28px] lg:h-[28px]" />
                </motion.div>
                
                <h2 className="text-2xl lg:text-3xl font-black text-zinc-900 mb-2">Welcome</h2>
                <h3 className="text-xl lg:text-2xl font-bold text-zinc-700 mb-3">Bienvenido</h3>
                <p className="text-neutral-600 text-sm lg:text-base">
                  Choose your language / Elige tu idioma
                </p>
              </div>

              {/* Language Options */}
              <div className="space-y-3 lg:space-y-4 mb-6 lg:mb-8">
                {languages.map((language) => (
                  <motion.button
                    key={language.code}
                    onClick={() => setSelectedLanguage(language.code)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`w-full p-3 lg:p-4 rounded-xl lg:rounded-2xl border-2 transition-all duration-300 text-left ${
                      selectedLanguage === language.code
                        ? 'border-amber-500 bg-amber-50'
                        : 'border-neutral-200 hover:border-amber-300 hover:bg-neutral-50'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 lg:space-x-4">
                        <span className="text-2xl lg:text-3xl">{language.flag}</span>
                        <div>
                          <div className="font-bold text-base lg:text-lg text-zinc-900">
                            {language.name}
                          </div>
                          <div className="text-xs lg:text-sm text-neutral-600">
                            {language.description}
                          </div>
                        </div>
                      </div>
                      
                      {selectedLanguage === language.code && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-5 h-5 lg:w-6 lg:h-6 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0"
                        >
                          <Check size={12} className="text-white lg:w-[14px] lg:h-[14px]" />
                        </motion.div>
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Remember Choice */}
              <div className="mb-6 lg:mb-8">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberChoice}
                    onChange={(e) => setRememberChoice(e.target.checked)}
                    className="w-4 h-4 lg:w-5 lg:h-5 text-amber-500 rounded focus:ring-amber-500 focus:ring-2"
                  />
                  <span className="text-sm lg:text-base text-neutral-700">
                    Remember / Recordar
                  </span>
                </label>
              </div>

              {/* Action Button */}
              <motion.button
                onClick={handleConfirm}
                className="w-full bg-zinc-900 text-white font-bold py-3 lg:py-4 rounded-xl lg:rounded-2xl hover:bg-amber-600 transition-all duration-300 text-sm lg:text-base"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Continue / Continuar
              </motion.button>

              {/* Brand */}
              <div className="text-center mt-4 lg:mt-6 pt-4 lg:pt-6 border-t border-neutral-100">
                <div className="text-base lg:text-lg font-black text-zinc-900">BAKEHAUS</div>
                <div className="text-xs text-neutral-500">Since 1965</div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};