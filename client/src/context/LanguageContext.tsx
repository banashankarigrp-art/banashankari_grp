import React, { createContext, useContext, useState, useEffect } from 'react';
import { knTranslations } from '../translations/kannada';

export type Language = 'en' | 'kn';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  isKn: boolean;
  t: (key: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('bse_language');
      if (saved === 'kn' || saved === 'en') {
        return saved;
      }
    } catch {
      // ignore localStorage errors
    }
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('bse_language', lang);
    } catch {
      // ignore localStorage errors
    }
  };

  useEffect(() => {
    try {
      document.documentElement.lang = language;
    } catch {
      // ignore
    }
  }, [language]);

  const isKn = language === 'kn';

  const t = (key: string, fallback?: string): string => {
    if (!isKn) {
      return fallback !== undefined ? fallback : key;
    }
    // In Kannada mode, look up translation
    if (knTranslations[key]) {
      return knTranslations[key];
    }
    // Check if fallback itself is a key
    if (fallback && knTranslations[fallback]) {
      return knTranslations[fallback];
    }
    // Fallback to provided fallback or key
    return fallback !== undefined ? fallback : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, isKn, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
