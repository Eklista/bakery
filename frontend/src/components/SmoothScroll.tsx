// src/components/SmoothScroll.tsx
import { useEffect, useRef } from 'react';
import Lenis from '@studio-freight/lenis';

export const SmoothScroll: React.FC = () => {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.destroy();
    }

    const lenis = new Lenis({
      duration: 1.0,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
      wheelMultiplier: 1,
      gestureOrientation: 'vertical',
      orientation: 'vertical',
      syncTouch: false,
      infinite: false
    });

    lenisRef.current = lenis;

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    // Manejar resize de ventana
    const handleResize = () => {
      lenis.resize();
    };

    // Manejar cambios de orientación en móviles
    const handleOrientationChange = () => {
      setTimeout(() => {
        lenis.resize();
      }, 100);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
      cancelAnimationFrame(rafId);
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
    };
  }, []);

  return null;
};