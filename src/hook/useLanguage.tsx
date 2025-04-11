import React, { createContext, useContext, useState, useEffect } from 'react';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import uzTranslations from '../translations/uz.json';
import ruTranslations from '../translations/ru.json';
import enTranslations from '../translations/en.json';

// Initialize i18next
i18n
  .use(initReactI18next)
  .init({
    resources: {
      uz: {
        translation: uzTranslations
      },
      ru: {
        translation: ruTranslations
      },
      en: {
        translation: enTranslations
      }
    },
    lng: 'uz', // default language
    fallbackLng: 'uz',
    interpolation: {
      escapeValue: false
    }
  });

type LanguageContextType = {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'uz',
  setLanguage: () => {},
  t: () => ''
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState('uz');

  const setLanguage = (lang: string) => {
    setLanguageState(lang);
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang);
  };

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      setLanguage(savedLanguage);
      i18n.changeLanguage(savedLanguage);
    }
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: i18n.t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext); 