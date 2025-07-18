// src/App.tsx
import { useState, useEffect, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Layout } from './components/layout/Layout';
import { LanguageModal } from './components/ui/LanguageModal';
import { CookieBanner } from './components/ui/CookieBanner';
import { SmoothScroll } from './components/SmoothScroll';
import { LazyLoader } from './components/LazyLoader';

const Home = lazy(() => import('./views/Home').then(module => ({ default: module.Home })));

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
        // Si hay idioma guardado, usarlo
        console.log('✅ Using saved language:', savedLanguage);
        i18n.changeLanguage(savedLanguage);
        setIsInitialized(true);
      } else if (!modalShown) {
        // Si no hay idioma guardado y no se ha mostrado el modal
        console.log('🔵 Showing language modal for first time');
        setShowLanguageModal(true);
        setIsInitialized(true);
      } else {
        // Fallback al inglés
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
    <>
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
              <div className="pt-20 p-8 text-center">About - Coming Soon</div>
            } 
          />
          <Route 
            path="/productos" 
            element={
              <div className="pt-20 p-8 text-center">Products - Coming Soon</div>
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
        </Routes>
      </Layout>
    </>
  );
}

export default App;