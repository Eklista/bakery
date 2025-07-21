// src/App.tsx
import { useState, useEffect, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Layout } from './components/layout/Layout';
import { LanguageModal } from './components/ui/LanguageModal';
import { CookieBanner } from './components/ui/CookieBanner';
import { SmoothScroll } from './components/SmoothScroll';
import { ScrollToTop } from './components/ScrollToTop';
import { LazyLoader } from './components/LazyLoader';
import { CartProvider } from './contexts/CartContext';
import { ContactProvider } from './contexts/ContactContext';
import { DebugProducts } from './views/DebugProducts';

// Lazy load de las páginas
const Home = lazy(() => import('./views/Home').then(module => ({ default: module.Home })));
const About = lazy(() => import('./views/About').then(module => ({ default: module.About })));
const Products = lazy(() => import('./views/Products').then(module => ({ default: module.Products })));
const Events = lazy(() => import('./views/Events').then(module => ({ default: module.Events })));
const Contact = lazy(() => import('./views/Contact').then(module => ({ default: module.Contact })));
const Checkout = lazy(() => import('./views/Checkout').then(module => ({ default: module.Checkout })));

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
      <ContactProvider>
        <ScrollToTop />
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
                <LazyLoader>
                  <Events />
                </LazyLoader>
              }
            />
            <Route
              path="/contacto"
              element={
                <LazyLoader>
                  <Contact />
                </LazyLoader>
              }
            />
            <Route
              path="/checkout"
              element={
                <LazyLoader>
                  <Checkout />
                </LazyLoader>
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
      </ContactProvider>
    </CartProvider>
  );
}

export default App;