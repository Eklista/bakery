// src/hooks/useDirectusProducts.ts
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { directusService } from '../services/directusService';
import type { DirectusProduct } from '../services/directusService';
import { groqTranslator } from '../services/groqTranslator';

interface LocalizedProduct {
  id: number;
  title: string;
  description: string;
  price: number;
  image: string;
  slug: string;
  stock: number;
  category: number;
}

export const useDirectusProducts = () => {
  const { i18n } = useTranslation();
  const [products, setProducts] = useState<LocalizedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [translating, setTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const localizeProducts = async (rawProducts: DirectusProduct[]) => {
    const currentLang = i18n.language;
    
    console.log(`🌐 Localizing ${rawProducts.length} products for language:`, currentLang);
    
    // Si es español, usar contenido original del CMS
    if (currentLang === 'es') {
      console.log('✅ Language is Spanish, using original content from Directus');
      const localizedProducts = rawProducts.map(product => ({
        id: product.id,
        title: product.title,
        description: product.description || 'Delicioso producto de nuestra panadería',
        price: directusService.formatPrice(product.price),
        image: directusService.getImageUrl(product.image),
        slug: product.slug,
        stock: product.stock,
        category: product.category
      }));
      setProducts(localizedProducts);
      return;
    }

    // Si es inglés, traducir con GROQ
    if (currentLang === 'en') {
      setTranslating(true);
      console.log('🤖 Translating products to English with GROQ...');
      
      try {
        const localizedProducts = await Promise.all(
          rawProducts.map(async (product) => {
            console.log('🔄 Translating product:', product.title);
            
            const description = product.description || 'Delicioso producto de nuestra panadería';
            
            // Traducir título y descripción en paralelo
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
              category: product.category
            };
          })
        );
        
        console.log('✅ All products translated successfully with GROQ');
        setProducts(localizedProducts);
        setError(null);
      } catch (err) {
        console.error('❌ GROQ translation failed:', err);
        setError('Translation failed, showing original content');
        
        // Fallback: mostrar contenido original en español
        const fallbackProducts = rawProducts.map(product => ({
          id: product.id,
          title: product.title,
          description: product.description || 'Delicioso producto de nuestra panadería',
          price: directusService.formatPrice(product.price),
          image: directusService.getImageUrl(product.image),
          slug: product.slug,
          stock: product.stock,
          category: product.category
        }));
        setProducts(fallbackProducts);
      } finally {
        setTranslating(false);
      }
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('📦 Fetching featured products from Directus...');
      
      // Intentar obtener productos destacados primero
      let rawProducts: DirectusProduct[] = [];
      
      try {
        rawProducts = await directusService.fetchFeaturedProducts();
        
        // Si no hay productos destacados, obtener todos los productos
        if (rawProducts.length === 0) {
          console.log('⚠️ No featured products found, fetching all products...');
          const allProducts = await directusService.fetchAllProducts();
          rawProducts = allProducts.slice(0, 6); // Tomar los primeros 6
        }
      } catch (featuredError) {
        console.warn('⚠️ Featured products failed, fetching all products:', featuredError);
        const allProducts = await directusService.fetchAllProducts();
        rawProducts = allProducts.slice(0, 6);
      }

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
  };

  // Re-localizar cuando cambie el idioma
  useEffect(() => {
    fetchProducts();
  }, [i18n.language]);

  return {
    products,
    loading,
    translating,
    error,
    refetch: fetchProducts
  };
};