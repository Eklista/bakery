// src/hooks/useProductModal.ts
import { useState, useCallback } from 'react';
import type { ProductCardData } from '../components/products/ProductCard';

export const useProductModal = () => {
  const [selectedProduct, setSelectedProduct] = useState<ProductCardData | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const openModal = useCallback((product: ProductCardData) => {
    setSelectedProduct(product);
    setIsOpen(true);
    console.log('👁️ Opening product modal for:', product.title);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setTimeout(() => {
      setSelectedProduct(null);
    }, 300); // Delay to allow exit animation
    console.log('❌ Closing product modal');
  }, []);

  return {
    selectedProduct,
    isOpen,
    openModal,
    closeModal
  };
};