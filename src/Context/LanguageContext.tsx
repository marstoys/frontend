import React, { createContext, useState, useContext, ReactNode } from 'react';
import en from '../translations/en.json';
import ru from '../translations/ru.json';
import uz from '../translations/uz.json';

type Language = 'en' | 'ru' | 'uz';

interface Translation {
  header: {
    home: string;
    allProducts: string;
    basket: string;
    orders: string;
    search: string;
    catalog: string;
    myOrders: string;
  };
  footer: {
    aboutUs: string;
    address: string;
    phoneNumber: string;
    copyright: string;
    socialMedia: string;
  };
  Hero: {
    subtitle: string;
    buttonText: string;
  };
  allProducts: {
    title: string;
    productsFound: string;
    all: string;
    men: string;
    girl: string;
    view: string;
    loading: string;
    buyNow: string;
  };
  basket: {
    company: string;
    rating: string;
    timesSold: string;
    commentTitle: string;
    comment: string;
    sum: string;
    addToCart: string;
    noProductSelected: string;
    buyToy: string;
    backtoButton: string;
    backtoSale: string;
    saleTitle: string;
    count: string;
    total: string;
    deleteButton: string;
    toOrder: string;
    totalProduct: string;
    writeComment: string;
    commentModalTitle: string;
    commentModalButton: string;
    commentModalCancel: string;
    commentModalInputPlaceholder: string;
    commentNotFound: string;
    emptyBasket: string;
    like: string;
  };
  order: {
    allOrder: string;
    active: string;
    BuyerName: string;
    ProductName: string;
    status: string;
    money: string;
    deliveryDate: string;
    submittedAddress: string;
    totalPrice: string;
    product: string;
    price: string;
    quantity: string;
    name: string;
    order: string;
    productCount: string;
    count: string;
  };
  saleInfo: {
    formName: string;
    formSurname: string;
    phoneNumber: string;
    address: string;
    ordery: string;
    products: string;
    count: string;
    total: string;
    processingOrders: string;
    money: string;
    productCount: string;
    verifySms: string;
    addVerifyCode: string;
    verifyCodeAdd: string;
    verifyCodeButtonText: string;
    payment: string;
    verifyCode: string;
  };
  newProducts: {
    title: string;
    buyText: string;
    allProductsButtonTxt: string;
  };
  catalog: {
    title: string;
  };
  common: {
    [key: string]: string;
  };
}

interface LanguageContextType {
  language: Language;
  translations: Translation;
  setLanguage: (lang: Language) => void;
}

const translations: Record<Language, Translation> = {
  en,
  ru,
  uz,
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('uz');

  const value: LanguageContextType = {
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