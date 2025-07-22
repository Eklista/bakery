// src/components/GlobalProductModal.tsx
import React, { memo } from 'react';
import { ProductDetailModal } from './products/ProductDetailModal';
import { useProductModal } from '../contexts/ProductModalContext';

export const GlobalProductModal: React.FC = memo(() => {
  const { selectedProduct, isOpen, closeModal } = useProductModal();

  return (
    <ProductDetailModal
      product={selectedProduct}
      isOpen={isOpen}
      onClose={closeModal}
    />
  );
});