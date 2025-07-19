// src/views/Products.tsx
import React, { memo, useState, useEffect, lazy, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Grid, List, AlertCircle, RefreshCw, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { directusService } from '../services/directusService';
import { groqTranslator } from '../services/groqTranslator';
import { useCart } from '../contexts/CartContext';
import type { DirectusProduct } from '../services/directusService';
import type { ProductCardData } from '../components/products/ProductCard';

const SectionSeparator = lazy(() => import('../components/ui/SectionSeparator').then(module => ({ default: module.SectionSeparator })));
const CategoryFilter = lazy(() => import('../components/products/CategoryFilter').then(module => ({ default: module.CategoryFilter })));
const ProductCard = lazy(() => import('../components/products/ProductCard').then(module => ({ default: module.ProductCard })));
const CartList = lazy(() => import('../components/cart/CartList').then(module => ({ default: module.CartList })));

const LoadingSkeleton = memo(() => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {[...Array(9)].map((_, i) => (
      <div key={i} className="bg-white rounded-3xl overflow-hidden">
        <div className="h-64 bg-gray-200 animate-pulse"></div>
        <div className="p-6">
          <div className="h-6 bg-gray-200 rounded mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded mb-4 animate-pulse"></div>
          <div className="flex justify-between">
            <div className="h-10 bg-gray-200 rounded w-24 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
));

const ErrorState = memo(({ error, onRetry, language }: { 
  error: string; 
  onRetry: () => void;
  language: string;
}) => (
  <div className="text-center py-16">
    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
    <h3 className="text-xl font-bold text-zinc-900 mb-2">
      {language === 'es' ? 'Error al cargar productos' : 'Error loading products'}
    </h3>
    <p className="text-neutral-600 mb-6 max-w-md mx-auto">{error}</p>
    <motion.button
      onClick={onRetry}
      className="bg-amber-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-amber-600 transition-colors flex items-center gap-2 mx-auto"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <RefreshCw size={16} />
      {language === 'es' ? 'Reintentar' : 'Retry'}
    </motion.button>
  </div>
));

export const Products: React.FC = memo(() => {
  const { i18n } = useTranslation();
  const { addItem } = useCart();
  
  const [products, setProducts] = useState<ProductCardData[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [translating, setTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const headerTexts = {
    es: {
      title: 'Nuestros Productos',
      subtitle: 'Descubre nuestra selección de productos artesanales',
      search: 'Buscar productos...',
      noResults: 'No se encontraron productos',
      noResultsDesc: 'Intenta con otros términos de búsqueda o categorías'
    },
    en: {
      title: 'Our Products',
      subtitle: 'Discover our selection of artisanal products',
      search: 'Search products...',
      noResults: 'No products found',
      noResultsDesc: 'Try different search terms or categories'
    }
  };

  const currentTexts = headerTexts[i18n.language as 'es' | 'en'] || headerTexts.es;

  const localizeProducts = useCallback(async (rawProducts: DirectusProduct[]) => {
    const currentLang = i18n.language;
    
    if (currentLang === 'es') {
      const localizedProducts: ProductCardData[] = rawProducts.map(product => ({
        id: product.id,
        title: product.title,
        description: product.description || 'Delicioso producto de nuestra panadería',
        price: directusService.formatPrice(product.price),
        image: directusService.getImageUrl(product.image),
        slug: product.slug,
        stock: product.stock,
        category: product.category,
        featured: false
      }));
      setProducts(localizedProducts);
      return;
    }

    if (currentLang === 'en') {
      setTranslating(true);
      
      try {
        const localizedProducts = await Promise.all(
          rawProducts.map(async (product) => {
            const description = product.description || 'Delicioso producto de nuestra panadería';
            
            const [translatedTitle, translatedDescription] = await Promise.all([
              groqTranslator.translate(product.title, 'es', 'en'),
              groqTranslator.translate(description, 'es', 'en')
            ]);

            return {
              id: product.id,
              title: translatedTitle,
              description: translatedDescription,
              price: directusService.formatPrice(product.price),
              image: directusService.getImageUrl(product.image),
              slug: product.slug,
              stock: product.stock,
              category: product.category,
              featured: false
            };
          })
        );
        
        setProducts(localizedProducts);
        setError(null);
      } catch (err) {
        console.error('❌ GROQ translation failed:', err);
        setError('Translation failed, showing original content');
        
        const fallbackProducts: ProductCardData[] = rawProducts.map(product => ({
          id: product.id,
          title: product.title,
          description: product.description || 'Delicioso producto de nuestra panadería',
          price: directusService.formatPrice(product.price),
          image: directusService.getImageUrl(product.image),
          slug: product.slug,
          stock: product.stock,
          category: product.category,
          featured: false
        }));
        setProducts(fallbackProducts);
      } finally {
        setTranslating(false);
      }
    }
  }, [i18n.language]);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const rawProducts = await directusService.fetchAllProducts();
      
      if (rawProducts.length === 0) {
        throw new Error('No products found');
      }

      await localizeProducts(rawProducts);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('❌ Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  }, [localizeProducts]);

  // Filtrar productos
  useEffect(() => {
    console.log('🔍 Filtering products...', {
      totalProducts: products.length,
      searchTerm,
      selectedCategory,
      productsArray: products.map(p => ({ id: p.id, title: p.title }))
    });

    let filtered = [...products]; // Crear copia

    // Filtrar por categoría
    if (selectedCategory !== null) {
      filtered = filtered.filter(product => product.category === selectedCategory);
      console.log('📂 After category filter:', filtered.length);
    }

    // Filtrar por búsqueda
    if (searchTerm && searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term)
      );
      console.log('🔎 After search filter:', filtered.length, 'for term:', term);
    }

    console.log('✅ Final filtered products:', filtered.length);
    setFilteredProducts(filtered);
  }, [products, selectedCategory, searchTerm]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleAddToCart = useCallback((product: ProductCardData) => {
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      category: product.category || undefined
    });
  }, [addItem]);

  const handleViewMore = useCallback((product: ProductCardData) => {
    console.log('View product details:', product.slug);
    // Implementar navegación a detalle del producto
  }, []);

  if (loading) {
    return (
      <div className="pt-20">
        <section className="py-16 bg-gradient-to-br from-neutral-50 to-amber-50/30">
          <div className="max-w-[1600px] mx-auto px-8 lg:px-16">
            <div className="text-center mb-16">
              <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4 animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded w-96 mx-auto animate-pulse"></div>
            </div>
            <LoadingSkeleton />
          </div>
        </section>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-20">
        <section className="py-16 bg-gradient-to-br from-neutral-50 to-amber-50/30">
          <div className="max-w-[1600px] mx-auto px-8 lg:px-16">
            <ErrorState error={error} onRetry={fetchProducts} language={i18n.language} />
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="pt-20">
      {/* Header */}
      <section className="py-16 bg-gradient-to-br from-neutral-50 to-amber-50/30">
        <div className="max-w-[1600px] mx-auto px-8 lg:px-16">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl lg:text-7xl font-black text-zinc-900 mb-6">
              {currentTexts.title}
            </h1>
            <p className="text-xl text-neutral-600 leading-relaxed max-w-2xl mx-auto">
              {currentTexts.subtitle}
            </p>
            {translating && (
              <p className="text-amber-600 text-sm mt-2 flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-amber-500"></div>
                {i18n.language === 'es' ? 'Traduciendo productos...' : 'Translating products...'}
              </p>
            )}
          </motion.div>
        </div>
      </section>

      <React.Suspense fallback={<div className="py-4"></div>}>
        <SectionSeparator variant="dots" color="amber" size="md" />
      </React.Suspense>

      {/* Main Content */}
      <section className="py-16 bg-white">
        <div className="max-w-[1600px] mx-auto px-8 lg:px-16">
          <div className="grid lg:grid-cols-12 gap-8">
            
            {/* Sidebar - Categories */}
            <div className="lg:col-span-2">
              <div className="sticky top-24 space-y-6">
                <React.Suspense fallback={
                  <div className="bg-white rounded-2xl p-6">
                    <div className="h-6 bg-gray-200 rounded mb-4 animate-pulse"></div>
                    <div className="space-y-2">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-10 bg-gray-100 rounded-xl animate-pulse"></div>
                      ))}
                    </div>
                  </div>
                }>
                  <CategoryFilter
                    selectedCategory={selectedCategory}
                    onCategoryChange={setSelectedCategory}
                  />
                </React.Suspense>
              </div>
            </div>

            {/* Products Grid */}
            <div className="lg:col-span-7">
              {/* Search and Controls */}
              <div className="mb-8 space-y-4">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400" size={20} />
                  <input
                    type="text"
                    placeholder={currentTexts.search}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white border border-neutral-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                  {searchTerm && (
                    <motion.button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <X size={18} />
                    </motion.button>
                  )}
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-neutral-600">
                      {filteredProducts.length} {i18n.language === 'es' ? 'productos' : 'products'}
                      {searchTerm && (
                        <span className="ml-2 text-amber-600">
                          • {i18n.language === 'es' ? 'filtrado por' : 'filtered by'} "{searchTerm}"
                        </span>
                      )}
                      {selectedCategory && (
                        <span className="ml-2 text-amber-600">
                          • {i18n.language === 'es' ? 'categoría seleccionada' : 'category selected'}
                        </span>
                      )}
                    </p>
                    {/* Debug info temporal */}
                    <p className="text-xs text-gray-400 mt-1">
                      Total products: {products.length} | Filtered: {filteredProducts.length}
                      {searchTerm && ` | Search: "${searchTerm}"`}
                      {selectedCategory && ` | Category: ${selectedCategory}`}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <motion.button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-lg transition-colors ${
                        viewMode === 'grid' ? 'bg-amber-500 text-white' : 'bg-neutral-100 text-neutral-600'
                      }`}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Grid size={16} />
                    </motion.button>
                    <motion.button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-lg transition-colors ${
                        viewMode === 'list' ? 'bg-amber-500 text-white' : 'bg-neutral-100 text-neutral-600'
                      }`}
                      whileTap={{ scale: 0.95 }}
                    >
                      <List size={16} />
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Products Grid/List */}
              <AnimatePresence mode="wait">
                {filteredProducts.length === 0 ? (
                  <motion.div 
                    key="no-results"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-16"
                  >
                    <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="w-8 h-8 text-neutral-400" />
                    </div>
                    <h3 className="text-xl font-bold text-zinc-900 mb-2">
                      {currentTexts.noResults}
                    </h3>
                    <p className="text-neutral-600 mb-4">{currentTexts.noResultsDesc}</p>
                    {(searchTerm || selectedCategory) && (
                      <motion.button
                        onClick={() => {
                          console.log('🧹 Clearing filters...');
                          setSearchTerm('');
                          setSelectedCategory(null);
                        }}
                        className="bg-amber-500 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-amber-600 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {i18n.language === 'es' ? 'Limpiar filtros' : 'Clear filters'}
                      </motion.button>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key={`products-${filteredProducts.length}-${Date.now()}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`${
                      viewMode === 'grid' 
                        ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6' 
                        : 'space-y-6'
                    }`}
                  >
                    {filteredProducts.map((product, index) => (
                      <motion.div
                        key={`product-${product.id}-${index}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <ProductCard
                          product={product}
                          index={0} // Reset index para evitar delays largos
                          language={i18n.language}
                          variant={viewMode === 'list' ? 'compact' : 'default'}
                          onAddToCart={handleAddToCart}
                          onViewMore={handleViewMore}
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Cart Sidebar */}
            <div className="lg:col-span-3">
              <React.Suspense fallback={
                <div className="bg-neutral-50 rounded-3xl p-6">
                  <div className="h-6 bg-gray-200 rounded mb-4 animate-pulse"></div>
                  <div className="h-32 bg-gray-100 rounded-2xl animate-pulse"></div>
                </div>
              }>
                <CartList />
              </React.Suspense>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
});