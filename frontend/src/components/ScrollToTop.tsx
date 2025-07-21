// src/components/ScrollToTop.tsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll hacia arriba cuando cambie la ruta
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth' // Para un scroll suave
    });

    console.log('📍 Navigated to:', pathname, '- Scrolling to top');
  }, [pathname]);

  return null; // Este componente no renderiza nada
};