// src/components/products/ProductDetailModal.tsx
import React, { memo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ShoppingBag, 
  Minus, 
  Plus, 
  Star, 
  Heart, 
  Share2,
  Clock,
  Truck,
  Shield,
  Award
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { formatPriceByLanguage } from '../../utils/currency';
import { useCart } from '../../contexts/CartContext';
import type { ProductCardData } from './ProductCard';

interface ProductDetailModalProps {
  product: ProductCardData | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = memo(({ 
  product, 
  isOpen, 
  onClose 
}) => {
  const { i18n } = useTranslation();
  const { addItem, state: cartState } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  if (!product || !isOpen) return null;

  // Calcular stock disponible
  const cartItem = cartState.items.find(item => item.id === product.id);
  const inCartQuantity = cartItem ? cartItem.quantity : 0;
  const availableStock = Math.max(0, product.stock - inCartQuantity);
  const isOutOfStock = availableStock === 0;

  // Imagenes del producto (simuladas)
  const productImages = [
    product.image,
    product.image, // En un caso real, serían imágenes diferentes
    product.image
  ];

  const handleAddToCart = () => {
    if (!isOutOfStock && quantity <= availableStock) {
      for (let i = 0; i < quantity; i++) {
        addItem({
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
          category: product.category
        });
      }
      console.log(`🛒 Added ${quantity} x ${product.title} to cart`);
      setQuantity(1); // Reset quantity
    }
  };

  const handleQuantityChange = (delta: number) => {
    const newQuantity = Math.max(1, Math.min(availableStock, quantity + delta));
    setQuantity(newQuantity);
  };

  const content = {
    es: {
      addToCart: 'Agregar al Carrito',
      quantity: 'Cantidad',
      available: 'disponibles',
      inStock: 'En stock',
      outOfStock: 'Agotado',
      lowStock: 'Pocas unidades',
      description: 'Descripción',
      features: 'Características',
      ingredients: 'Ingredientes',
      nutritionalInfo: 'Información Nutricional',
      delivery: 'Entrega en 24-48 horas',
      freshness: 'Garantía de frescura',
      quality: 'Ingredientes premium',
      satisfaction: 'Satisfacción garantizada',
      share: 'Compartir',
      close: 'Cerrar',
      inCart: 'Ya tienes {{count}} en el carrito'
    },
    en: {
      addToCart: 'Add to Cart',
      quantity: 'Quantity',
      available: 'available',
      inStock: 'In stock',
      outOfStock: 'Sold out',
      lowStock: 'Low stock',
      description: 'Description',
      features: 'Features',
      ingredients: 'Ingredients',
      nutritionalInfo: 'Nutritional Information',
      delivery: 'Delivery in 24-48 hours',
      freshness: 'Freshness guarantee',
      quality: 'Premium ingredients',
      satisfaction: 'Satisfaction guaranteed',
      share: 'Share',
      close: 'Close',
      inCart: 'You have {{count}} in cart'
    }
  };

  const currentContent = content[i18n.language as 'es' | 'en'] || content.es;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 max-h-[90vh]">
            
            {/* Columna de imagen */}
            <div className="relative bg-gradient-to-br from-neutral-50 to-amber-50/30 p-6 lg:p-8">
              {/* Close button */}
              <motion.button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-neutral-600 hover:text-neutral-900 hover:bg-white transition-all shadow-lg"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={20} />
              </motion.button>

              {/* Badges */}
              <div className="absolute top-4 left-4 z-10 flex flex-col space-y-2">
                {product.featured && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg"
                  >
                    <Star size={12} className="fill-current" />
                    {i18n.language === 'es' ? 'Destacado' : 'Featured'}
                  </motion.div>
                )}
                
                {availableStock < 10 && availableStock > 0 && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg"
                  >
                    {i18n.language === 'es' ? `Solo ${availableStock}` : `Only ${availableStock}`}
                  </motion.div>
                )}
              </div>

              {/* Imagen principal */}
              <div className="flex items-center justify-center h-64 lg:h-80 mb-4">
                <motion.img
                  key={selectedImage}
                  src={productImages[selectedImage]}
                  alt={product.title}
                  className="max-w-full max-h-full object-contain drop-shadow-2xl"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                    (e.target as HTMLImageElement).src = '/cookies.webp';
                  }}
                />
              </div>

              {/* Thumbnails */}
              <div className="flex justify-center space-x-2">
                {productImages.map((img, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === index 
                        ? 'border-amber-500 shadow-lg' 
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <img
                      src={img}
                      alt={`${product.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                        (e.target as HTMLImageElement).src = '/cookies.webp';
                      }}
                    />
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Columna de información */}
            <div className="p-6 lg:p-8 overflow-y-auto">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-2xl lg:text-3xl font-black text-zinc-900 mb-2 leading-tight">
                    {product.title}
                  </h1>
                  
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="text-3xl font-black text-amber-600">
                      {formatPriceByLanguage(product.price / 100, i18n.language)}
                    </div>
                    {availableStock > 0 ? (
                      <span className="text-sm text-green-600 font-semibold bg-green-50 px-2 py-1 rounded-full">
                        {currentContent.inStock}
                      </span>
                    ) : (
                      <span className="text-sm text-red-600 font-semibold bg-red-50 px-2 py-1 rounded-full">
                        {currentContent.outOfStock}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <motion.button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                      isFavorite 
                        ? 'bg-red-100 text-red-500' 
                        : 'bg-neutral-100 text-neutral-400 hover:text-red-500'
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Heart size={20} className={isFavorite ? 'fill-current' : ''} />
                  </motion.button>
                  
                  <motion.button
                    className="w-12 h-12 rounded-full bg-neutral-100 text-neutral-400 hover:text-neutral-600 flex items-center justify-center transition-all"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Share2 size={20} />
                  </motion.button>
                </div>
              </div>

              {/* Descripción */}
              <div className="mb-6">
                <h3 className="font-bold text-zinc-900 mb-2">{currentContent.description}</h3>
                <p className="text-neutral-600 leading-relaxed">{product.description}</p>
              </div>

              {/* Stock warning */}
              {inCartQuantity > 0 && (
                <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                  <p className="text-amber-700 text-sm">
                    {currentContent.inCart.replace('{{count}}', inCartQuantity.toString())}
                  </p>
                </div>
              )}

              {/* Controles de cantidad y agregar al carrito */}
              {!isOutOfStock && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-semibold text-zinc-900">{currentContent.quantity}:</span>
                    <span className="text-sm text-neutral-500">
                      {availableStock} {currentContent.available}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center bg-neutral-100 rounded-xl p-1">
                      <motion.button
                        onClick={() => handleQuantityChange(-1)}
                        disabled={quantity <= 1}
                        className="w-10 h-10 bg-white rounded-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-50 transition-colors"
                        whileHover={{ scale: quantity > 1 ? 1.1 : 1 }}
                        whileTap={{ scale: quantity > 1 ? 0.9 : 1 }}
                      >
                        <Minus size={16} />
                      </motion.button>
                      
                      <span className="w-12 text-center font-bold text-zinc-900">
                        {quantity}
                      </span>
                      
                      <motion.button
                        onClick={() => handleQuantityChange(1)}
                        disabled={quantity >= availableStock}
                        className="w-10 h-10 bg-white rounded-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-50 transition-colors"
                        whileHover={{ scale: quantity < availableStock ? 1.1 : 1 }}
                        whileTap={{ scale: quantity < availableStock ? 0.9 : 1 }}
                      >
                        <Plus size={16} />
                      </motion.button>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-sm text-neutral-500">Total</div>
                      <div className="font-bold text-lg text-zinc-900">
                        {formatPriceByLanguage((product.price * quantity) / 100, i18n.language)}
                      </div>
                    </div>
                  </div>

                  <motion.button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    className="w-full bg-zinc-900 text-white font-bold py-4 rounded-xl hover:bg-amber-500 transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={!isOutOfStock ? { scale: 1.02, y: -2 } : {}}
                    whileTap={!isOutOfStock ? { scale: 0.98 } : {}}
                  >
                    <ShoppingBag size={20} />
                    <span>{currentContent.addToCart}</span>
                    {quantity > 1 && <span>({quantity})</span>}
                  </motion.button>
                </div>
              )}

              {/* Garantías y beneficios */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center space-x-2 p-3 bg-green-50 rounded-xl">
                  <Truck className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-green-700 text-sm font-medium">{currentContent.delivery}</span>
                </div>
                
                <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-xl">
                  <Shield className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <span className="text-blue-700 text-sm font-medium">{currentContent.freshness}</span>
                </div>
                
                <div className="flex items-center space-x-2 p-3 bg-purple-50 rounded-xl">
                  <Award className="w-5 h-5 text-purple-600 flex-shrink-0" />
                  <span className="text-purple-700 text-sm font-medium">{currentContent.quality}</span>
                </div>
                
                <div className="flex items-center space-x-2 p-3 bg-amber-50 rounded-xl">
                  <Clock className="w-5 h-5 text-amber-600 flex-shrink-0" />
                  <span className="text-amber-700 text-sm font-medium">{currentContent.satisfaction}</span>
                </div>
              </div>

              {/* Información adicional */}
              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="font-semibold text-zinc-900 mb-2">{currentContent.ingredients}</h4>
                  <p className="text-neutral-600">
                    {i18n.language === 'es' 
                      ? 'Harina de trigo, azúcar, mantequilla, huevos frescos, vainilla natural, polvo de hornear.'
                      : 'Wheat flour, sugar, butter, fresh eggs, natural vanilla, baking powder.'
                    }
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-zinc-900 mb-2">{currentContent.nutritionalInfo}</h4>
                  <p className="text-neutral-600">
                    {i18n.language === 'es' 
                      ? 'Calorías: 280 por porción. Contiene gluten, huevos y lácteos.'
                      : 'Calories: 280 per serving. Contains gluten, eggs, and dairy.'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
});