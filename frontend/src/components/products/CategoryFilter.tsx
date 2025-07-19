// src/components/products/CategoryFilter.tsx
import React, { memo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { directusService } from '../../services/directusService';

interface Category {
  id: number;
  name: string;
  slug: string;
  icon?: string | null; // Cambiar para aceptar null
  productCount?: number;
}

interface CategoryFilterProps {
  selectedCategory: number | null;
  onCategoryChange: (categoryId: number | null) => void;
  className?: string;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = memo(({
  selectedCategory,
  onCategoryChange,
  className = ""
}) => {
  const { i18n } = useTranslation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const texts = {
    es: {
      allCategories: 'Todas las Categorías',
      filter: 'Filtrar',
      loading: 'Cargando...',
      noCategories: 'No hay categorías disponibles'
    },
    en: {
      allCategories: 'All Categories',
      filter: 'Filter',
      loading: 'Loading...',
      noCategories: 'No categories available'
    }
  };

  const currentTexts = texts[i18n.language as 'es' | 'en'] || texts.es;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const categoriesData = await directusService.fetchCategories();
        // Mapear para asegurar compatibilidad de tipos
        const mappedCategories: Category[] = categoriesData.map(cat => ({
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          icon: cat.icon || undefined,
          productCount: undefined
        }));
        setCategories(mappedCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategorySelect = (categoryId: number | null) => {
    onCategoryChange(categoryId);
    setIsOpen(false);
  };

  const selectedCategoryName = selectedCategory 
    ? categories.find(cat => cat.id === selectedCategory)?.name || currentTexts.allCategories
    : currentTexts.allCategories;

  if (loading) {
    return (
      <div className={`bg-white rounded-2xl p-6 ${className}`}>
        <div className="flex items-center space-x-2 mb-4">
          <Filter className="w-5 h-5 text-neutral-400" />
          <span className="text-sm text-neutral-400">{currentTexts.loading}</span>
        </div>
        <div className="space-y-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-10 bg-neutral-100 rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-2xl p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-zinc-900" />
          <h2 className="font-bold text-zinc-900">{currentTexts.filter}</h2>
        </div>
        
        {/* Mobile toggle */}
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-100 transition-colors"
          whileTap={{ scale: 0.95 }}
        >
          {isOpen ? <X size={16} /> : <Filter size={16} />}
        </motion.button>
      </div>

      {/* Selected category display on mobile */}
      <div className="md:hidden mb-4">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full text-left p-3 bg-neutral-50 rounded-xl border border-neutral-200"
          whileTap={{ scale: 0.98 }}
        >
          <span className="font-medium text-zinc-900">{selectedCategoryName}</span>
        </motion.button>
      </div>

      {/* Categories List */}
      <AnimatePresence>
        {(isOpen || window.innerWidth >= 768) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            {/* All Categories */}
            <motion.button
              onClick={() => handleCategorySelect(null)}
              className={`w-full text-left p-3 rounded-xl transition-all duration-200 ${
                selectedCategory === null
                  ? 'bg-amber-500 text-white shadow-md'
                  : 'hover:bg-neutral-50 text-neutral-700'
              }`}
              whileHover={{ scale: selectedCategory === null ? 1 : 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{currentTexts.allCategories}</span>
                {selectedCategory === null && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-2 h-2 bg-white rounded-full"
                  />
                )}
              </div>
            </motion.button>

            {/* Category List */}
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
                      : 'hover:bg-neutral-50 text-neutral-700'
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
                      <span className="font-medium">{category.name}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {category.productCount && (
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          selectedCategory === category.id
                            ? 'bg-white/20 text-white'
                            : 'bg-neutral-100 text-neutral-600'
                        }`}>
                          {category.productCount}
                        </span>
                      )}
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});