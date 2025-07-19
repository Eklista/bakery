// src/App.tsx
import { useState, useEffect, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Layout } from './components/layout/Layout';
import { LanguageModal } from './components/ui/LanguageModal';
import { CookieBanner } from './components/ui/CookieBanner';
import { SmoothScroll } from './components/SmoothScroll';
import { LazyLoader } from './components/LazyLoader';
import { CartProvider } from './contexts/CartContext';
import { DebugProducts } from './views/DebugProducts';

// Lazy load de las páginas
const Home = lazy(() => import('./views/Home').then(module => ({ default: module.Home })));
const About = lazy(() => import('./views/About').then(module => ({ default: module.About })));
const Products = lazy(() => import('./views/Products').then(module => ({ default: module.Products })));

function App() {
  const { i18n } = useTranslation();
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeLanguage = () => {
      const modalShown = localStorage.getItem('bakehaus-modal-shown');
      const savedLanguage = localStorage.getItem('bakehaus-language');

      console.log('🌐 Initializing language...');
      console.log('Modal shown:', modalShown);
      console.log('Saved language:', savedLanguage);

      if (savedLanguage) {
        console.log('✅ Using saved language:', savedLanguage);
        i18n.changeLanguage(savedLanguage);
        setIsInitialized(true);
      } else if (!modalShown) {
        console.log('🔵 Showing language modal for first time');
        setShowLanguageModal(true);
        setIsInitialized(true);
      } else {
        console.log('⚠️ Fallback to English');
        i18n.changeLanguage('en');
        localStorage.setItem('bakehaus-language', 'en');
        setIsInitialized(true);
      }
    };

    initializeLanguage();
  }, [i18n]);

  const handleCloseModal = () => {
    setShowLanguageModal(false);
    localStorage.setItem('bakehaus-modal-shown', 'true');
  };

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <CartProvider>
      <SmoothScroll />
      
      <LanguageModal
        isOpen={showLanguageModal}
        onClose={handleCloseModal}
      />

      <CookieBanner />

      <Layout>
        <Routes>
          <Route
            path="/"
            element={
              <LazyLoader>
                <Home />
              </LazyLoader>
            }
          />
          <Route
            path="/nosotros"
            element={
              <LazyLoader>
                <About />
              </LazyLoader>
            }
          />
          <Route
            path="/productos"
            element={
              <LazyLoader>
                <Products />
              </LazyLoader>
            }
          />
          <Route
            path="/eventos"
            element={
              <div className="pt-20 p-8 text-center">Events - Coming Soon</div>
            }
          />
          <Route
            path="/contacto"
            element={
              <div className="pt-20 p-8 text-center">Contact - Coming Soon</div>
            }
          />
          <Route
            path="/debug-products"
            element={
              <LazyLoader>
                <DebugProducts />
              </LazyLoader>
            }
          />
        </Routes>
      </Layout>
    </CartProvider>
  );
}

export default App;