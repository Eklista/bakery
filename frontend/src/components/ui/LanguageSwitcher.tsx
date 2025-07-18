// src/components/ui/LanguageSwitcher.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const languages = [
  { code: 'es', name: 'Español', flag: '🇲🇽' },
  { code: 'en', name: 'English', flag: '🇺🇸' }
];

export const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const handleLanguageChange = (languageCode: string) => {
    console.log('🔄 Changing language to:', languageCode);
    i18n.changeLanguage(languageCode);
    localStorage.setItem('bakehaus-language', languageCode);
    console.log('✅ Language saved');
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-neutral-700 hover:text-neutral-900 font-semibold text-sm transition-all duration-300 py-2 px-3 rounded-full hover:bg-neutral-50"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <span className="text-base">{currentLanguage.flag}</span>
        <span className="text-sm font-bold">{currentLanguage.code.toUpperCase()}</span>
        <ChevronDown 
          size={12} 
          className={`transition-transform duration-200 text-neutral-500 ${isOpen ? 'rotate-180' : ''}`}
        />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full right-0 mt-2 bg-white border border-neutral-200 rounded-xl shadow-xl z-50 min-w-[160px] overflow-hidden"
            >
              <div className="py-1">
                {languages.map((language, index) => (
                  <motion.button
                    key={language.code}
                    onClick={() => handleLanguageChange(language.code)}
                    className={`w-full text-left px-3 py-2 hover:bg-neutral-50 transition-colors duration-150 flex items-center space-x-3 text-sm ${
                      currentLanguage.code === language.code ? 'bg-amber-50 text-amber-700' : 'text-neutral-700'
                    }`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.1, delay: index * 0.05 }}
                  >
                    <span className="text-base">{language.flag}</span>
                    <div className="flex-1">
                      <div className="font-medium">{language.name}</div>
                    </div>
                    {currentLanguage.code === language.code && (
                      <motion.div
                        layoutId="activeLanguage"
                        className="w-1.5 h-1.5 bg-amber-500 rounded-full"
                      />
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};