// src/hooks/useDirectusWithGroq.ts
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { groqTranslator } from '../services/groqTranslator';

// Datos simulados como vendrían de Directus (en español)
const mockDirectusProducts = [
  {
    id: '1',
    name: 'Cupcake de Chocolate',
    description: 'Delicioso cupcake con chocolate belga y crema de mantequilla suave',
    price: 25.00,
    image: '/cookies.png',
    category: 'cupcakes',
    available: true,
    featured: true,
    created_at: '2024-01-15T10:00:00Z'
  },
  {
    id: '2', 
    name: 'Torta de Tres Leches',
    description: 'Tradicional torta guatemalteca bañada con tres tipos de leche y canela',
    price: 120.00,
    image: '/cookies.png',
    category: 'tortas',
    available: true,
    featured: true,
    created_at: '2024-01-14T09:30:00Z'
  },
  {
    id: '3',
    name: 'Galletas de Avena',
    description: 'Galletas caseras crujientes con avena, pasas doradas y un toque de vainilla',
    price: 15.00,
    image: '/cookies.png',
    category: 'galletas',
    available: true,
    featured: true,
    created_at: '2024-01-13T14:20:00Z'
  },
  {
    id: '4',
    name: 'Cheesecake de Fresa',
    description: 'Cremoso cheesecake New York style con fresas frescas de temporada',
    price: 45.00,
    image: '/cookies.png',
    category: 'postres',
    available: true,
    featured: true,
    created_at: '2024-01-11T16:45:00Z'
  },
  {
    id: '5',
    name: 'Croissant de Almendra',
    description: 'Croissant francés hojaldrado relleno de crema de almendra y almendras tostadas',
    price: 28.00,
    image: '/cookies.png',
    category: 'pasteles',
    available: true,
    featured: true,
    created_at: '2024-01-10T07:30:00Z'
  },
  {
    id: '6',
    name: 'Pan Francés Artesanal',
    description: 'Pan rústico horneado diariamente con masa madre y harina europea importada',
    price: 35.00,
    image: '/cookies.png',
    category: 'panes',
    available: true,
    featured: false,
    created_at: '2024-01-12T08:00:00Z'
  }
];

// Interfaces
interface DirectusProduct {
  id: string;
  name: string;        // En español (desde CMS)
  description: string; // En español (desde CMS)
  price: number;
  image: string;
  category: string;
  available: boolean;
  featured: boolean;
  created_at: string;
}

interface LocalizedProduct {
  id: string;
  name: string;        // Traducido según idioma actual
  description: string; // Traducido según idioma actual
  price: number;
  image: string;
  category: string;
  available: boolean;
  featured: boolean;
}

export const useDirectusWithGroq = () => {
  const { i18n } = useTranslation();
  const [products, setProducts] = useState<LocalizedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [translating, setTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Función para localizar productos
  const localizeProducts = async (rawProducts: DirectusProduct[]) => {
    const currentLang = i18n.language;
    
    console.log(`🌐 Localizing ${rawProducts.length} products for language:`, currentLang);
    
    // Si es español, devolver tal como está (contenido original del CMS)
    if (currentLang === 'es') {
      console.log('✅ Language is Spanish, using original content from CMS');
      const localizedProducts = rawProducts.map(product => ({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        image: product.image,
        category: product.category,
        available: product.available,
        featured: product.featured
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
            console.log('🔄 Translating product:', product.name);
            
            // Traducir nombre y descripción en paralelo
            const [translatedName, translatedDescription] = await Promise.all([
              groqTranslator.translate(product.name, 'es', 'en'),
              groqTranslator.translate(product.description, 'es', 'en')
            ]);

            return {
              id: product.id,
              name: translatedName,
              description: translatedDescription,
              price: product.price,
              image: product.image,
              category: product.category,
              available: product.available,
              featured: product.featured
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
          name: product.name,
          description: product.description,
          price: product.price,
          image: product.image,
          category: product.category,
          available: product.available,
          featured: product.featured
        }));
        setProducts(fallbackProducts);
      } finally {
        setTranslating(false);
      }
    }
  };

  // Simular fetch de Directus
  const fetchFromDirectus = async () => {
    try {
      setLoading(true);
      setError(null);

      // Simular delay de API real
      await new Promise(resolve => setTimeout(resolve, 800));

      // En producción real sería:
      // const response = await fetch(`${DIRECTUS_URL}/items/products`);
      // const data = await response.json();
      // await localizeProducts(data.data);

      await localizeProducts(mockDirectusProducts);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      console.error('Error fetching from Directus:', err);
    } finally {
      setLoading(false);
    }
  };

  // Re-localizar cuando cambie el idioma
  useEffect(() => {
    fetchFromDirectus();
  }, [i18n.language]);

  return {
    products,
    loading,
    translating,
    error,
    refetch: fetchFromDirectus
  };
};