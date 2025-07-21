// src/contexts/ContactContext.tsx
import React, { createContext, useContext, useState, useCallback } from 'react';

interface ContactFormData {
  eventType?: string;
  eventDate?: string;
  subject?: string;
}

interface ContactContextType {
  prefillData: ContactFormData;
  setPrefillData: (data: ContactFormData) => void;
  clearPrefillData: () => void;
}

const ContactContext = createContext<ContactContextType | undefined>(undefined);

export const ContactProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [prefillData, setPrefillDataState] = useState<ContactFormData>({});

  const setPrefillData = useCallback((data: ContactFormData) => {
    console.log('📝 Setting prefill data:', data);
    setPrefillDataState(data);
  }, []);

  const clearPrefillData = useCallback(() => {
    console.log('🧹 Clearing prefill data');
    setPrefillDataState({});
  }, []);

  const value: ContactContextType = {
    prefillData,
    setPrefillData,
    clearPrefillData
  };

  return (
    <ContactContext.Provider value={value}>
      {children}
    </ContactContext.Provider>
  );
};

export const useContact = (): ContactContextType => {
  const context = useContext(ContactContext);
  if (!context) {
    throw new Error('useContact must be used within a ContactProvider');
  }
  return context;
};