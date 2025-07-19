// src/views/Products.tsx
import React, { memo, useState, useEffect, lazy, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Grid, List, AlertCircle, RefreshCw, X, ShoppingCart } from 'lucide-react';
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
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
    {[...Array(9)].map((_, i) => (
      <div key={i} className="bg-white rounded-2xl lg:rounded-3xl overflow-hidden border border-neutral-200">
        <div className="h-48 lg:h-64 bg-gray-200 animate-pulse"></div>
        <div className="p-4 lg:p-6">
          <div className="h-5 lg:h-6 bg-gray-200 rounded mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded mb-4 animate-pulse"></div>
          <div className="flex justify-between">
            <div className="h-8 lg:h-10 bg-gray-200 rounded w-20 lg:w-24 animate-pulse"></div>
            <div className="h-5 lg:h-6 bg-gray-200 rounded w-12 lg:w-16 animate-pulse"></div>
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
  <div className="text-center py-12 lg:py-16">
    <AlertCircle className="w-12 h-12 lg:w-16 lg:h-16 text-red-500 mx-auto mb-4" />
    <h3 className="text-lg lg:text-xl font-bold text-zinc-900 mb-2">
      {language === 'es' ? 'Error al cargar productos' : 'Error loading products'}
    </h3>
    <p className="text-neutral-600 mb-6 max-w-md mx-auto text-sm lg:text-base">{error}</p>
    <motion.button
      onClick={onRetry}
      className="bg-amber-500 text-white px-4 lg:px-6 py-2 lg:py-3 rounded-full font-semibold hover:bg-amber-600 transition-colors flex items-center gap-2 mx-auto text-sm lg:text-base"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <RefreshCw size={16} />
      {language === 'es' ? 'Reintentar' : 'Retry'}
    </motion.button>
  </div>
));

const MobileCartModal = memo(({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 lg:hidden"
        onClick={onClose}
      >
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <React.Suspense fallback={
            <div className="p-4 flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
            </div>
          }>
            <CartList isMobile onClose={onClose} />
          </React.Suspense>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
});

export const Products: React.FC = memo(() => {
  const { i18n } = useTranslation();
  const { addItem, state: cartState } = useCart();
  
  const [allProducts, setAllProducts] = useState<ProductCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [translating, setTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showMobileCart, setShowMobileCart] = useState(false);

  const headerTexts = {
    es: {
      title: 'Nuestros Productos',
      subtitle: 'Descubre nuestra selección de productos artesanales',
      search: 'Buscar productos...',
      noResults: 'No se encontraron productos',
      noResultsDesc: 'Intenta con otros términos de búsqueda o categorías',
      cart: 'Carrito',
      products: 'productos',
      filteredBy: 'filtrado por',
      categorySelected: 'categoría seleccionada',
      clearFilters: 'Limpiar filtros'
    },
    en: {
      title: 'Our Products',
      subtitle: 'Discover our selection of artisanal products',
      search: 'Search products...',
      noResults: 'No products found',
      noResultsDesc: 'Try different search terms or categories',
      cart: 'Cart',
      products: 'products',
      filteredBy: 'filtered by',
      categorySelected: 'category selected',
      clearFilters: 'Clear filters'
    }
  };

  const currentTexts = headerTexts[i18n.language as 'es' | 'en'] || headerTexts.es;

  const filteredProducts = useMemo(() => {
    console.log('🔍 Filtering products...', {
      totalProducts: allProducts.length,
      searchTerm: searchTerm.trim(),
      selectedCategory,
      timestamp: new Date().toISOString()
    });

    if (allProducts.length === 0) {
      console.log('⚠️ No products to filter');
      return [];
    }

    let filtered = allProducts.slice();

    if (selectedCategory !== null) {
      const beforeCount = filtered.length;
      filtered = filtered.filter(product => {
        const productCategory = product.category ? Number(product.category) : null;
        const targetCategory = Number(selectedCategory);
        const matches = productCategory === targetCategory;
        
        if (!matches) {
          console.log(`📂 Product ${product.id} (${product.title}) excluded - category ${productCategory} !== ${targetCategory}`);
        }
        return matches;
      });
      console.log(`📂 Category filter (${selectedCategory}): ${beforeCount} → ${filtered.length}`);
    }

    const trimmedSearch = searchTerm.trim().toLowerCase();
    if (trimmedSearch) {
      const beforeCount = filtered.length;
      filtered = filtered.filter(product => {
        const titleMatch = product.title.toLowerCase().includes(trimmedSearch);
        const descMatch = product.description.toLowerCase().includes(trimmedSearch);
        const matches = titleMatch || descMatch;
        
        if (!matches) {
          console.log(`🔎 Product ${product.id} (${product.title}) excluded - no match for "${trimmedSearch}"`);
        }
        return matches;
      });
      console.log(`🔎 Search filter ("${trimmedSearch}"): ${beforeCount} → ${filtered.length}`);
    }

    console.log(`✅ Final result: ${filtered.length} products`);
    return filtered;
  }, [allProducts, selectedCategory, searchTerm]);

  const localizeProducts = useCallback(async (rawProducts: DirectusProduct[]) => {
    const currentLang = i18n.language;
    
    console.log(`🌐 Localizing ${rawProducts.length} products to ${currentLang}`);
    
    if (currentLang === 'es') {
      console.log('✅ Using Spanish content from Directus');
      const localizedProducts: ProductCardData[] = rawProducts.map(product => ({
        id: product.id,
        title: product.title,
        description: product.description || 'Delicioso producto de nuestra panadería',
        price: directusService.formatPrice(product.price),
        image: directusService.getImageUrl(product.image),
        slug: product.slug,
        stock: product.stock,
        category: product.category ? Number(product.category) : undefined,
        featured: false
      }));
      
      console.log('📦 Spanish products ready:', localizedProducts.length);
      setAllProducts(localizedProducts);
      return;
    }

    if (currentLang === 'en') {
      setTranslating(true);
      console.log('🤖 Translating to English...');
      
      try {
        const localizedProducts = await Promise.all(
          rawProducts.map(async (product, index) => {
            console.log(`🔄 Translating ${index + 1}/${rawProducts.length}: ${product.title}`);
            
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
              category: product.category ? Number(product.category) : undefined,
              featured: false
            };
          })
        );
        
        console.log('✅ Translation successful');
        setAllProducts(localizedProducts);
        setError(null);
      } catch (err) {
        console.error('❌ Translation failed:', err);
        setError('Translation failed, showing original content');
        
        const fallbackProducts: ProductCardData[] = rawProducts.map(product => ({
          id: product.id,
          title: product.title,
          description: product.description || 'Delicioso producto de nuestra panadería',
          price: directusService.formatPrice(product.price),
          image: directusService.getImageUrl(product.image),
          slug: product.slug,
          stock: product.stock,
          category: product.category ? Number(product.category) : undefined,
          featured: false
        }));
        
        setAllProducts(fallbackProducts);
      } finally {
        setTranslating(false);
      }
    }
  }, [i18n.language]);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('📦 Fetching products from Directus...');

      const rawProducts = await directusService.fetchAllProducts();
      console.log(`✅ Fetched ${rawProducts.length} products`);
      
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

  useEffect(() => {
    console.log('🚀 Products view mounted, language:', i18n.language);
    fetchProducts();
  }, [fetchProducts]);

  const handleAddToCart = useCallback((product: ProductCardData, quantity: number = 1) => {
    console.log('🛒 Adding to cart:', { id: product.id, title: product.title, quantity });
    
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        category: product.category || undefined
      });
    }
    
    console.log('✅ Added to cart successfully');
  }, [addItem]);

  const handleViewMore = useCallback((product: ProductCardData) => {
    console.log('👁️ View product details:', product.slug);
  }, []);

  const handleCategoryChange = useCallback((categoryId: number | null) => {
    console.log('📂 Category changed to:', categoryId);
    setSelectedCategory(categoryId);
    setSearchTerm(''); // Limpiar búsqueda al cambiar categoría
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    console.log('🔍 Search changed to:', value);
    setSearchTerm(value);
  }, []);

  const clearSearch = useCallback(() => {
    console.log('❌ Clearing search');
    setSearchTerm('');
  }, []);

  const handleClearFilters = useCallback(() => {
    console.log('🧹 Clearing all filters');
    setSearchTerm('');
    setSelectedCategory(null);
  }, []);

  if (loading) {
    return (
      <div className="pt-20">
        <section className="py-8 lg:py-16 bg-gradient-to-br from-neutral-50 to-amber-50/30">
          <div className="max-w-[1600px] mx-auto px-4 lg:px-8 xl:px-16">
            <div className="text-center mb-8 lg:mb-16">
              <div className="h-6 lg:h-8 bg-gray-200 rounded w-64 mx-auto mb-4 animate-pulse"></div>
              <div className="h-4 lg:h-6 bg-gray-200 rounded w-96 mx-auto animate-pulse"></div>
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
        <section className="py-8 lg:py-16 bg-gradient-to-br from-neutral-50 to-amber-50/30">
          <div className="max-w-[1600px] mx-auto px-4 lg:px-8 xl:px-16">
            <ErrorState error={error} onRetry={fetchProducts} language={i18n.language} />
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="pt-20">
      <section className="py-8 lg:py-16 bg-gradient-to-br from-neutral-50 to-amber-50/30">
        <div className="max-w-[1600px] mx-auto px-4 lg:px-8 xl:px-16">
          <motion.div 
            className="text-center mb-8 lg:mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-3xl lg:text-5xl xl:text-7xl font-black text-zinc-900 mb-4 lg:mb-6">
              {currentTexts.title}
            </h1>
            <p className="text-base lg:text-xl text-neutral-600 leading-relaxed max-w-2xl mx-auto">
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

      <motion.button
        onClick={() => setShowMobileCart(true)}
        className="fixed bottom-6 right-6 z-40 lg:hidden bg-amber-500 text-white p-3 lg:p-4 rounded-full shadow-2xl flex items-center gap-2"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <ShoppingCart size={20} />
        {cartState.itemCount > 0 && (
          <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
            {cartState.itemCount}
          </span>
        )}
      </motion.button>

      <MobileCartModal isOpen={showMobileCart} onClose={() => setShowMobileCart(false)} />

      <section className="py-8 lg:py-16 bg-white">
        <div className="max-w-[1600px] mx-auto px-4 lg:px-8 xl:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            
            <div className="lg:col-span-3 xl:col-span-2">
              <React.Suspense fallback={
                <div className="bg-white rounded-2xl p-4 lg:p-6 border border-neutral-200">
                  <div className="h-5 lg:h-6 bg-gray-200 rounded mb-4 animate-pulse"></div>
                  <div className="space-y-2">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="h-8 lg:h-10 bg-gray-100 rounded-xl animate-pulse"></div>
                    ))}
                  </div>
                </div>
              }>
                <CategoryFilter
                  selectedCategory={selectedCategory}
                  onCategoryChange={handleCategoryChange}
                  className="sticky top-24"
                />
              </React.Suspense>
            </div>

            <div className="lg:col-span-6 xl:col-span-7">
              <div className="mb-6 lg:mb-8 space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 lg:left-4 top-1/2 transform -translate-y-1/2 text-neutral-400" size={18} />
                  <input
                    type="text"
                    placeholder={currentTexts.search}
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="w-full pl-10 lg:pl-12 pr-10 lg:pr-12 py-3 lg:py-4 bg-white border border-neutral-200 rounded-xl lg:rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm lg:text-base"
                  />
                  {searchTerm && (
                    <motion.button
                      onClick={clearSearch}
                      className="absolute right-3 lg:right-4 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <X size={18} />
                    </motion.button>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-neutral-600">
                      {filteredProducts.length} {currentTexts.products}
                      {searchTerm && (
                        <span className="ml-2 text-amber-600">
                          • {currentTexts.filteredBy} "{searchTerm}"
                        </span>
                      )}
                      {selectedCategory && (
                        <span className="ml-2 text-amber-600">
                          • {currentTexts.categorySelected}
                        </span>
                      )}
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

              {filteredProducts.length === 0 ? (
                <div className="text-center py-12 lg:py-16">
                  <div className="w-12 h-12 lg:w-16 lg:h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-6 h-6 lg:w-8 lg:h-8 text-neutral-400" />
                  </div>
                  <h3 className="text-lg lg:text-xl font-bold text-zinc-900 mb-2">
                    {currentTexts.noResults}
                  </h3>
                  <p className="text-neutral-600 mb-4 text-sm lg:text-base">{currentTexts.noResultsDesc}</p>
                  {(searchTerm || selectedCategory) && (
                    <button
                      onClick={handleClearFilters}
                      className="bg-amber-500 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-amber-600 transition-colors"
                    >
                      {currentTexts.clearFilters}
                    </button>
                  )}
                </div>
              ) : (
                <div className={`${
                  viewMode === 'grid' 
                    ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6' 
                    : 'space-y-4 lg:space-y-6'
                }`}>
                  {filteredProducts.map((product, index) => (
                    <React.Suspense
                      key={`product-${product.id}`}
                      fallback={
                        <div className="bg-white rounded-2xl border border-neutral-200 animate-pulse">
                          <div className="h-48 bg-gray-200"></div>
                          <div className="p-4">
                            <div className="h-4 bg-gray-200 rounded mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded mb-4"></div>
                            <div className="h-8 bg-gray-200 rounded"></div>
                          </div>
                        </div>
                      }
                    >
                      <ProductCard
                        product={product}
                        index={index}
                        language={i18n.language}
                        variant={viewMode === 'list' ? 'compact' : 'default'}
                        onAddToCart={handleAddToCart}
                        onViewMore={handleViewMore}
                      />
                    </React.Suspense>
                  ))}
                </div>
              )}
            </div>

            <div className="hidden lg:block lg:col-span-3">
              <React.Suspense fallback={
                <div className="bg-neutral-50 rounded-2xl lg:rounded-3xl p-4 lg:p-6 sticky top-24">
                  <div className="h-5 lg:h-6 bg-gray-200 rounded mb-4 animate-pulse"></div>
                  <div className="h-24 lg:h-32 bg-gray-100 rounded-2xl animate-pulse"></div>
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