// src/components/products/CategoryFilter.tsx
import React, { memo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { directusService } from '../../services/directusService';
import { groqTranslator } from '../../services/groqTranslator';

interface Category {
  id: number;
  name: string;
  slug: string;
  icon?: string | null;
  product_count: number;
}

interface CategoryFilterProps {
  selectedCategory: number | null;
  onCategoryChange: (categoryId: number | null) => void;
  className?: string;
  availableProducts?: any[]; // Para compatibilidad con Products.tsx
}

export const CategoryFilter: React.FC<CategoryFilterProps> = memo(({
  selectedCategory,
  onCategoryChange,
  className = ""}) => {
  const { i18n } = useTranslation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [translating, setTranslating] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const texts = {
    es: {
      allCategories: 'Todas las Categorías',
      filter: 'Filtrar por Categoría',
      loading: 'Cargando...',
      noCategories: 'No hay categorías disponibles'
    },
    en: {
      allCategories: 'All Categories',
      filter: 'Filter by Category',
      loading: 'Loading...',
      noCategories: 'No categories available'
    }
  };

  const currentTexts = texts[i18n.language as 'es' | 'en'] || texts.es;

  useEffect(() => {
    const fetchAndLocalizeCategories = async () => {
      try {
        setLoading(true);
        console.log('📂 Fetching categories with products from Directus...');
        
        const categoriesData = await directusService.fetchCategoriesWithProducts();
        console.log('📂 Categories with products:', categoriesData);

        if (categoriesData.length === 0) {
          console.log('⚠️ No categories with products found');
          setCategories([]);
          return;
        }

        if (i18n.language === 'es') {
          console.log('✅ Using Spanish categories from Directus');
          setCategories(categoriesData);
        } else {
          setTranslating(true);
          console.log('🤖 Translating categories to English...');
          
          try {
            const translatedCategories = await Promise.all(
              categoriesData.map(async (cat) => {
                console.log(`🔄 Translating category: ${cat.name}`);
                const translatedName = await groqTranslator.translate(cat.name, 'es', 'en');
                
                return {
                  ...cat,
                  name: translatedName
                };
              })
            );
            
            console.log('✅ Categories translated successfully:', translatedCategories);
            setCategories(translatedCategories);
          } catch (translationError) {
            console.error('❌ Category translation failed:', translationError);
            setCategories(categoriesData);
          } finally {
            setTranslating(false);
          }
        }
      } catch (error) {
        console.error('❌ Error fetching categories:', error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAndLocalizeCategories();
  }, [i18n.language]);

  const handleCategorySelect = (categoryId: number | null) => {
    onCategoryChange(categoryId);
    setIsOpen(false);
  };

  const selectedCategoryName = selectedCategory 
    ? categories.find(cat => cat.id === selectedCategory)?.name || currentTexts.allCategories
    : currentTexts.allCategories;

  if (loading) {
    return (
      <div className={`bg-white rounded-2xl border border-neutral-200 ${className}`}>
        <div className="hidden lg:block p-4 lg:p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Filter className="w-4 h-4 text-neutral-400" />
            <span className="text-sm text-neutral-400">
              {translating ? (i18n.language === 'es' ? 'Traduciendo...' : 'Translating...') : currentTexts.loading}
            </span>
          </div>
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-12 bg-neutral-100 rounded-xl animate-pulse"></div>
            ))}
          </div>
        </div>
        
        <div className="lg:hidden p-4">
          <div className="h-12 bg-neutral-100 rounded-xl animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-2xl border border-neutral-200 shadow-sm ${className}`}>
      
      {/* Desktop Version */}
      <div className="hidden lg:block p-4 lg:p-6">
        <div className="flex items-center space-x-2 mb-4 lg:mb-6">
          <Filter className="w-4 h-4 lg:w-5 lg:h-5 text-amber-600" />
          <h3 className="font-semibold lg:font-bold text-zinc-900 text-sm lg:text-base">{currentTexts.filter}</h3>
        </div>

        <div className="space-y-2">
          <motion.button
            onClick={() => handleCategorySelect(null)}
            className={`w-full text-left p-3 rounded-xl transition-all duration-200 ${
              selectedCategory === null
                ? 'bg-amber-500 text-white shadow-md'
                : 'hover:bg-neutral-50 text-neutral-700 border border-transparent hover:border-neutral-200'
            }`}
            whileHover={{ scale: selectedCategory === null ? 1 : 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium text-sm lg:text-base">{currentTexts.allCategories}</span>
              {selectedCategory === null && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-2 h-2 bg-white rounded-full"
                />
              )}
            </div>
          </motion.button>

          {categories.length === 0 ? (
            <div className="text-center py-4 text-neutral-500 text-sm">
              {currentTexts.noCategories}
            </div>
          ) : (
            categories.map((category, index) => (
              <motion.button
                key={category.id}
                onClick={() => handleCategorySelect(category.id)}
                className={`w-full text-left p-3 rounded-xl transition-all duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-amber-500 text-white shadow-md'
                    : 'hover:bg-neutral-50 text-neutral-700 border border-transparent hover:border-neutral-200'
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: selectedCategory === category.id ? 1 : 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {category.icon && (
                      <span className="text-lg">{category.icon}</span>
                    )}
                    <span className="font-medium text-sm lg:text-base">{category.name}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      selectedCategory === category.id 
                        ? 'bg-white/20 text-white' 
                        : 'bg-neutral-100 text-neutral-600'
                    }`}>
                      {category.product_count}
                    </span>
                    {selectedCategory === category.id && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-2 h-2 bg-white rounded-full"
                      />
                    )}
                  </div>
                </div>
              </motion.button>
            ))
          )}
        </div>
      </div>

      {/* Mobile Version */}
      <div className="lg:hidden p-4">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-4 bg-neutral-50 rounded-xl border border-neutral-200 hover:bg-neutral-100 transition-colors"
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center space-x-3">
            <Filter className="w-5 h-5 text-amber-600" />
            <span className="font-medium text-zinc-900">{selectedCategoryName}</span>
          </div>
          <ChevronDown 
            className={`w-5 h-5 text-neutral-500 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 bg-white border border-neutral-200 rounded-xl shadow-lg overflow-hidden"
            >
              <div className="max-h-64 overflow-y-auto">
                <motion.button
                  onClick={() => handleCategorySelect(null)}
                  className={`w-full text-left p-4 transition-colors ${
                    selectedCategory === null
                      ? 'bg-amber-500 text-white'
                      : 'hover:bg-neutral-50 text-neutral-700'
                  }`}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="font-medium">{currentTexts.allCategories}</span>
                </motion.button>

                {categories.map((category) => (
                  <motion.button
                    key={category.id}
                    onClick={() => handleCategorySelect(category.id)}
                    className={`w-full text-left p-4 transition-colors border-t border-neutral-100 ${
                      selectedCategory === category.id
                        ? 'bg-amber-500 text-white'
                        : 'hover:bg-neutral-50 text-neutral-700'
                    }`}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {category.icon && (
                          <span className="text-lg">{category.icon}</span>
                        )}
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        selectedCategory === category.id 
                          ? 'bg-white/20 text-white' 
                          : 'bg-neutral-100 text-neutral-600'
                      }`}>
                        {category.product_count}
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
});