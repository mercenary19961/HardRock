import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations
import enCommon from './locales/en/common.json';
import enHero from './locales/en/hero.json';
import enWhyHardRock from './locales/en/whyHardRock.json';
import enServices from './locales/en/services.json';
import arCommon from './locales/ar/common.json';
import arHero from './locales/ar/hero.json';
import arWhyHardRock from './locales/ar/whyHardRock.json';
import arServices from './locales/ar/services.json';

i18n
  .use(LanguageDetector) // Detect user language
  .use(initReactI18next) // Pass i18n to react-i18next
  .init({
    resources: {
      en: {
        common: enCommon,
        hero: enHero,
        whyHardRock: enWhyHardRock,
        services: enServices,
      },
      ar: {
        common: arCommon,
        hero: arHero,
        whyHardRock: arWhyHardRock,
        services: arServices,
      },
    },
    fallbackLng: 'en', // Default language
    defaultNS: 'common',

    // Language detection configuration
    detection: {
      // Order of detection
      order: ['localStorage', 'navigator'],

      // Cache user's choice
      caches: ['localStorage'],

      // localStorage key
      lookupLocalStorage: 'hardrock_language',
    },

    interpolation: {
      escapeValue: false, // React already escapes
    },
  });

// Update HTML attributes when language changes
i18n.on('languageChanged', (lng) => {
  document.documentElement.lang = lng;
  document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
});

// Set initial direction on page load
const initialLang = i18n.language || 'en';
document.documentElement.lang = initialLang;
document.documentElement.dir = initialLang === 'ar' ? 'rtl' : 'ltr';

export default i18n;
