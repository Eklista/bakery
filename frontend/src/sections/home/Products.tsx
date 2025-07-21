// src/sections/home/Products.tsx
import React, { useState, useEffect, memo, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { directusService } from '../../services/directusService';
import type { DirectusProduct } from '../../services/directusService';
import { groqTranslator } from '../../services/groqTranslator';
import { useCart } from '../../contexts/CartContext';
import { ProductCard } from '../../components/products/ProductCard';
import type { ProductCardData } from '../../components/products/ProductCard';

const LoadingSkeleton = memo(() => (
  <section className="py-16 bg-neutral-50">
    <div className="max-w-[1600px] mx-auto px-8 lg:px-16">
      <div className="text-center mb-16">
        <div className="h-4 bg-gray-200 rounded w-48 mx-auto mb-4 animate-pulse"></div>
        <div className="h-8 bg-gray-200 rounded w-72 mx-auto mb-6 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-96 mx-auto animate-pulse"></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
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
    </div>
  </section>
));

const ErrorState = memo(({ error, onRetry, language }: { 
  error: string; 
  onRetry: () => void;
  language: string;
}) => (
  <section className="py-16 bg-neutral-50">
    <div className="max-w-[1600px] mx-auto px-8 lg:px-16">
      <div className="text-center">
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
    </div>
  </section>
));

export const Products: React.FC = memo(() => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const { addItem } = useCart();
  
  const [products, setProducts] = useState<ProductCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [translating, setTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const headerTexts = useMemo(() => ({
    es: {
      subtitle: 'PRODUCTOS DESTACADOS',
      title: 'Nuestros Favoritos',
      description: 'Los productos más populares de nuestra panadería, hechos con amor y los mejores ingredientes',
      viewAll: 'Ver Todos los Productos'
    },
    en: {
      subtitle: 'FEATURED PRODUCTS',
      title: 'Our Favorites',
      description: 'The most popular products from our bakery, made with love and the finest ingredients',
      viewAll: 'View All Products'
    }
  }), []);

  const localizeProducts = useCallback(async (rawProducts: DirectusProduct[]) => {
    const currentLang = i18n.language;
    
    console.log(`🌐 Localizing ${rawProducts.length} products for language:`, currentLang);
    
    if (currentLang === 'es') {
      console.log('✅ Language is Spanish, using original content from Directus');
      const localizedProducts: ProductCardData[] = rawProducts.map(product => ({
        id: product.id,
        title: product.title,
        description: product.description || 'Delicioso producto de nuestra panadería',
        price: directusService.formatPrice(product.price),
        image: directusService.getImageUrl(product.image),
        slug: product.slug,
        stock: product.stock,
        category: product.category,
        featured: true
      }));
      setProducts(localizedProducts);
      return;
    }

    if (currentLang === 'en') {
      setTranslating(true);
      console.log('🤖 Translating products to English with GROQ...');
      
      try {
        const localizedProducts = await Promise.all(
          rawProducts.map(async (product) => {
            console.log('🔄 Translating product:', product.title);
            
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
              featured: true
            };
          })
        );
        
        console.log('✅ All products translated successfully with GROQ');
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
          featured: true
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
      console.log('📦 Fetching products from Directus API...');
      
      let rawProducts: DirectusProduct[] = [];
      
      try {
        rawProducts = await directusService.fetchFeaturedProducts();
        console.log('✅ Featured products fetched:', rawProducts.length);
        
        if (rawProducts.length === 0) {
          console.log('⚠️ No featured products found, fetching all products...');
          const allProducts = await directusService.fetchAllProducts();
          rawProducts = allProducts.slice(0, 6);
        }
      } catch (featuredError) {
        console.warn('⚠️ Featured products failed, trying all products:', featuredError);
        const allProducts = await directusService.fetchAllProducts();
        rawProducts = allProducts.slice(0, 6);
      }

      if (rawProducts.length === 0) {
        throw new Error('No products found in Directus');
      }

      await localizeProducts(rawProducts);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('❌ Error in fetchProducts:', err);
    } finally {
      setLoading(false);
    }
  }, [localizeProducts]);

  useEffect(() => {
    console.log('🚀 Products component mounted, language:', i18n.language);
    fetchProducts();
  }, [fetchProducts, i18n.language]);

  const handleAddToCart = useCallback((product: ProductCardData, quantity: number = 1) => {
    console.log('🛒 Adding to cart from Home:', { id: product.id, title: product.title, quantity });
    
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        category: product.category
      });
    }
    
    console.log('✅ Added to cart successfully from Home');
  }, [addItem]);

  const handleViewMore = useCallback((product: ProductCardData) => {
    console.log('👁️ View product details:', product.slug);
    // Navegar a página de productos con el producto específico
    navigate('/productos');
  }, [navigate]);

  const handleViewAll = useCallback(() => {
    console.log('📦 Navigate to all products page');
    navigate('/productos');
  }, [navigate]);

  const currentTexts = useMemo(() => 
    headerTexts[i18n.language as 'es' | 'en'] || headerTexts.es, 
    [i18n.language, headerTexts]
  );

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={fetchProducts} language={i18n.language} />;
  }

  return (
    <section className="py-16 bg-neutral-50">
      <div className="max-w-[1600px] mx-auto px-8 lg:px-16">
        
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "100px" }}
        >
          <motion.span 
            className="text-sm font-bold text-amber-600 tracking-[0.3em] uppercase mb-4 block"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {translating ? 'TRANSLATING...' : currentTexts.subtitle}
          </motion.span>
          <h2 className="text-4xl lg:text-6xl font-black text-zinc-900 mb-6">
            {currentTexts.title}
          </h2>
          <p className="text-lg text-neutral-600 max-w-3xl mx-auto leading-relaxed">
            {currentTexts.description}
          </p>
          {translating && (
            <p className="text-amber-600 text-sm mt-2 flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-amber-500"></div>
              {i18n.language === 'es' ? 'Traduciendo productos...' : 'Translating products...'}
            </p>
          )}
        </motion.div>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-neutral-600 text-lg">
              {i18n.language === 'es' ? 'No hay productos disponibles' : 'No products available'}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={index}
                  language={i18n.language}
                  variant="featured"
                  onAddToCart={handleAddToCart}
                  onViewMore={handleViewMore}
                />
              ))}
            </div>

            <motion.div 
              className="text-center mt-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true, margin: "50px" }}
            >
              <motion.button 
                onClick={handleViewAll}
                className="bg-amber-500 text-white font-bold px-8 py-4 rounded-full hover:bg-amber-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                {currentTexts.viewAll}
              </motion.button>
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
});