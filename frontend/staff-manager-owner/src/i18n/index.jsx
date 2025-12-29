import React, { createContext, useContext, useState } from 'react';

// Translation files
import en from './locales/en.json';
import es from './locales/es.json'; // Spanish
import fr from './locales/fr.json'; // French
import hi from './locales/hi.json'; // Hindi

const translations = {
  en,
  es,
  fr,
  hi
};

const I18nContext = createContext();

export const I18nProvider = ({ children }) => {
  const [locale, setLocale] = useState('en');

  const t = (key, params) => {
    let translation = key.split('.').reduce((obj, k) => obj?.[k], translations[locale]);
    
    if (!translation) {
      // Fallback to English if translation doesn't exist
      translation = key.split('.').reduce((obj, k) => obj?.[k], translations.en);
    }
    
    if (!translation) {
      return key; // Return the key if no translation found
    }
    
    // Replace parameters if provided
    if (params) {
      Object.keys(params).forEach(param => {
        translation = translation.replace(`{{${param}}}`, params[param]);
      });
    }
    
    return translation;
  };

  const value = {
    t,
    locale,
    setLocale,
    availableLocales: Object.keys(translations)
  };

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useTranslation must be used within an I18nProvider');
  }
  return context;
};