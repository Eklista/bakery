// src/App.tsx
import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Layout } from './components/layout/Layout';
import { Home } from './views/Home';
import { LanguageModal } from './components/ui/LanguageModal';

function App() {
  const { i18n } = useTranslation();
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  useEffect(() => {
    const modalShown = localStorage.getItem('bakehaus-modal-shown');
    const savedLanguage = localStorage.getItem('bakehaus-language');

    if (!modalShown) {
      setShowLanguageModal(true);
    } else if (savedLanguage) {
      i18n.changeLanguage(savedLanguage);
    } else {
      i18n.changeLanguage('en');
    }
  }, [i18n]);

  const handleCloseModal = () => {
    setShowLanguageModal(false);
    
    const savedLanguage = localStorage.getItem('bakehaus-language');
    if (!savedLanguage) {
      i18n.changeLanguage('en');
      localStorage.setItem('bakehaus-modal-shown', 'true');
    }
  };

  return (
    <>
      <LanguageModal
        isOpen={showLanguageModal}
        onClose={handleCloseModal}
      />
      
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/nosotros" element={<div className="pt-20 p-8 text-center">About - Coming Soon</div>} />
          <Route path="/productos" element={<div className="pt-20 p-8 text-center">Products - Coming Soon</div>} />
          <Route path="/eventos" element={<div className="pt-20 p-8 text-center">Events - Coming Soon</div>} />
          <Route path="/contacto" element={<div className="pt-20 p-8 text-center">Contact - Coming Soon</div>} />
        </Routes>
      </Layout>
    </>
  );
}

export default App;