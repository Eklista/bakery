// src/contexts/ProductModalContext.tsx
import React, { createContext, useContext, useState, useCallback } from 'react';
import type { ProductCardData } from '../components/products/ProductCard';

interface ProductModalContextType {
  selectedProduct: ProductCardData | null;
  isOpen: boolean;
  openModal: (product: ProductCardData) => void;
  closeModal: () => void;
}

const ProductModalContext = createContext<ProductModalContextType | undefined>(undefined);

export const ProductModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedProduct, setSelectedProduct] = useState<ProductCardData | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const openModal = useCallback((product: ProductCardData) => {
    console.log('👁️ Opening product modal for:', product.title);
    setSelectedProduct(product);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    console.log('❌ Closing product modal');
    setIsOpen(false);
    setTimeout(() => {
      setSelectedProduct(null);
    }, 300);
  }, []);

  const value: ProductModalContextType = {
    selectedProduct,
    isOpen,
    openModal,
    closeModal
  };

  return (
    <ProductModalContext.Provider value={value}>
      {children}
    </ProductModalContext.Provider>
  );
};

export const useProductModal = (): ProductModalContextType => {
  const context = useContext(ProductModalContext);
  if (!context) {
    throw new Error('useProductModal must be used within a ProductModalProvider');
  }
  return context;
};