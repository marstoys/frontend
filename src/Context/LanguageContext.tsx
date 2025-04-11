import React, { createContext, useState, useContext, ReactNode } from 'react';
import en from '../translations/en.json';
import ru from '../translations/ru.json';
import uz from '../translations/uz.json';

type Language = 'en' | 'ru' | 'uz';

interface LanguageContextType {
  language: Language;
  translations: typeof en;
  setLanguage: (lang: Language) => void;
}

const translations = {
  en,
  ru,
  uz,
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('uz');

  const value = {
    language,
    translations: translations[language],
    setLanguage,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}; 