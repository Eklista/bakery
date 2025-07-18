// src/sections/home/Products.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ShoppingBag, Star } from 'lucide-react';
import { groqTranslator } from '../../services/groqTranslator';
import { formatPriceByLanguage } from '../../utils/currency';

// Productos base en español con precios en USD (se convertirán a MXN)
const productsFromCMS = [
  {
    id: '1',
    name: 'Cupcake de Chocolate',
    description: 'Delicioso cupcake con chocolate belga y crema de mantequilla suave',
    price: 3.50, // USD
    image: '/cookies.png',
    featured: true
  },
  {
    id: '2',
    name: 'Torta de Tres Leches',
    description: 'Tradicional torta mexicana bañada con tres tipos de leche y canela',
    price: 25.00, // USD
    image: '/cookies.png',
    featured: true
  },
  {
    id: '3',
    name: 'Galletas de Avena',
    description: 'Galletas caseras crujientes con avena, pasas doradas y vainilla',
    price: 2.00, // USD
    image: '/cookies.png',
    featured: true
  },
  {
    id: '4',
    name: 'Cheesecake de Fresa',
    description: 'Cremoso cheesecake estilo New York con fresas frescas de temporada',
    price: 8.50, // USD
    image: '/cookies.png',
    featured: true
  },
  {
    id: '5',
    name: 'Croissant de Almendra',
    description: 'Croissant francés hojaldrado relleno de crema de almendra y almendras tostadas',
    price: 4.25, // USD
    image: '/cookies.png',
    featured: true
  }
];

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  featured: boolean;
}

export const Products: React.FC = () => {
  const { i18n } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setTranslating] = useState(false);
  const [, setError] = useState<string | null>(null);

  const translateProducts = async () => {
    const currentLang = i18n.language;
    
    console.log('🌐 Language:', currentLang);
    
    if (currentLang === 'es') {
      // Español: usar contenido original del CMS
      setProducts(productsFromCMS);
      setLoading(false);
      return;
    }

    if (currentLang === 'en') {
      // Inglés: traducir con GROQ
      setTranslating(true);
      console.log('🔄 Translating to English...');
      
      try {
        const translatedProducts = await Promise.all(
          productsFromCMS.map(async (product) => {
            const [translatedName, translatedDescription] = await Promise.all([
              groqTranslator.translate(product.name),
              groqTranslator.translate(product.description)
            ]);

            return {
              ...product,
              name: translatedName,
              description: translatedDescription
            };
          })
        );
        
        setProducts(translatedProducts);
        setError(null);
        console.log('✅ Translation complete');
        
      } catch (err) {
        console.error('❌ Translation failed:', err);
        setError('Translation failed');
        setProducts(productsFromCMS); // Fallback
      } finally {
        setTranslating(false);
      }
    }
    
    setLoading(false);
  };

  useEffect(() => {
    translateProducts();
  }, [i18n.language]);

  if (loading) {
    return (
      <section className="py-16 bg-neutral-50">
        <div className="max-w-[1600px] mx-auto px-8 lg:px-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
            <p className="mt-4 text-neutral-600">Loading products...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-neutral-50">
      <div className="max-w-[1600px] mx-auto px-8 lg:px-16">
        
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.span 
            className="text-sm font-bold text-amber-600 tracking-[0.3em] uppercase mb-4 block"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {i18n.language === 'es' ? 'PRODUCTOS DESTACADOS' : 'FEATURED PRODUCTS'}
          </motion.span>
          <h2 className="text-4xl lg:text-6xl font-black text-zinc-900 mb-6">
            {i18n.language === 'es' ? 'Nuestros Favoritos' : 'Our Favorites'}
          </h2>
          <p className="text-lg text-neutral-600 max-w-3xl mx-auto leading-relaxed">
            {i18n.language === 'es' 
              ? 'Los productos más populares de nuestra panadería, hechos con amor y los mejores ingredientes'
              : 'The most popular products from our bakery, made with love and the finest ingredients'
            }
          </p>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.filter(p => p.featured).map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              {/* Image */}
              <div className="relative h-64 bg-gradient-to-br from-amber-100 to-orange-100 overflow-hidden">
                <motion.img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                
                <motion.div 
                  className="absolute top-4 left-4 bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <Star size={12} className="fill-current" />
                  <span>{i18n.language === 'es' ? 'Destacado' : 'Featured'}</span>
                </motion.div>

                <motion.div 
                  className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-2"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <span className="text-lg font-black text-zinc-900">
                    {formatPriceByLanguage(product.price, i18n.language)}
                  </span>
                </motion.div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-zinc-900 mb-2 group-hover:text-amber-600 transition-colors">
                  {product.name}
                </h3>
                <p className="text-neutral-600 text-sm mb-4 line-clamp-2">
                  {product.description}
                </p>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <motion.button 
                    className="flex items-center space-x-2 bg-zinc-900 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-amber-600 transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ShoppingBag size={16} />
                    <span>{i18n.language === 'es' ? 'Agregar' : 'Add to Cart'}</span>
                  </motion.button>

                  <motion.button 
                    className="text-amber-600 font-semibold text-sm hover:text-amber-700 transition-colors"
                    whileHover={{ x: 5 }}
                  >
                    {i18n.language === 'es' ? 'Ver más' : 'View more'}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All */}
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <motion.button 
            className="bg-amber-500 text-white font-bold px-8 py-4 rounded-full hover:bg-amber-600 transition-all duration-300 shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            {i18n.language === 'es' ? 'Ver Todos los Productos' : 'View All Products'}
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};