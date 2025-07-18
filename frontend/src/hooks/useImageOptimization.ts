// src/hooks/useImageOptimization.ts
import { useState, useEffect, useRef } from 'react';

interface UseImageOptimizationProps {
  src: string;
  placeholder?: string;
}

export const useImageOptimization = ({
  src,
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PC9zdmc+'
}: UseImageOptimizationProps) => {
  const [imageSrc, setImageSrc] = useState<string>(placeholder);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = new Image();
    imgRef.current = img;

    img.onload = () => {
      setImageSrc(src);
      setIsLoaded(true);
    };

    img.onerror = () => {
      setError(true);
    };

    // Detectar soporte de WebP
    const supportsWebP = (): boolean => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
      } catch {
        return false;
      }
    };

    // Usar WebP si está disponible y el src contiene una extensión de imagen
    if (supportsWebP() && /\.(jpg|jpeg|png)$/i.test(src)) {
      const webpSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
      img.src = webpSrc;
      
      // Si WebP falla, usar la imagen original
      img.onerror = () => {
        img.src = src;
        img.onerror = () => setError(true);
      };
    } else {
      img.src = src;
    }

    return () => {
      if (imgRef.current) {
        imgRef.current.onload = null;
        imgRef.current.onerror = null;
      }
    };
  }, [src]);

  return { imageSrc, isLoaded, error };
};