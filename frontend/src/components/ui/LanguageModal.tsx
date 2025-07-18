import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Globe, Check } from 'lucide-react';

interface LanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LanguageModal: React.FC<LanguageModalProps> = ({ isOpen, onClose }) => {
  const { i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState('en');
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
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl"
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <Globe size={28} className="text-white" />
            </motion.div>
            
            <h2 className="text-3xl font-black text-zinc-900 mb-2">Welcome</h2>
            <h3 className="text-2xl font-bold text-zinc-700 mb-3">Bienvenido</h3>
            <p className="text-neutral-600 text-sm">
              Choose your language / Elige tu idioma
            </p>
          </div>

          <div className="space-y-3 mb-6">
            {languages.map((language) => (
              <motion.button
                key={language.code}
                onClick={() => setSelectedLanguage(language.code)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`w-full p-4 rounded-2xl border-2 transition-all duration-300 text-left ${
                  selectedLanguage === language.code
                    ? 'border-amber-500 bg-amber-50'
                    : 'border-neutral-200 hover:border-amber-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-3xl">{language.flag}</span>
                    <div>
                      <div className="font-bold text-lg text-zinc-900">
                        {language.name}
                      </div>
                      <div className="text-sm text-neutral-600">
                        {language.description}
                      </div>
                    </div>
                  </div>
                  
                  {selectedLanguage === language.code && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center"
                    >
                      <Check size={14} className="text-white" />
                    </motion.div>
                  )}
                </div>
              </motion.button>
            ))}
          </div>

          <div className="mb-6">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberChoice}
                onChange={(e) => setRememberChoice(e.target.checked)}
                className="w-5 h-5 text-amber-500 rounded"
              />
              <span className="text-sm text-neutral-700">
                Remember / Recordar
              </span>
            </label>
          </div>

          <motion.button
            onClick={handleConfirm}
            className="w-full bg-zinc-900 text-white font-bold py-4 rounded-2xl hover:bg-amber-600 transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Continue / Continuar
          </motion.button>

          <div className="text-center mt-6 pt-6 border-t border-neutral-100">
            <div className="text-lg font-black text-zinc-900">BAKEHAUS</div>
            <div className="text-xs text-neutral-500">Since 1965</div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
