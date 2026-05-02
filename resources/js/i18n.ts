import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enCommon from './locales/en/common.json';
import enHero from './locales/en/hero.json';
import enWhyHardRock from './locales/en/whyHardRock.json';
import enServices from './locales/en/services.json';
import enContactUs from './locales/en/contactUs.json';
import enFooter from './locales/en/footer.json';
import enServiceDetail from './locales/en/serviceDetail.json';
import enConsultation from './locales/en/consultation.json';
import arCommon from './locales/ar/common.json';
import arHero from './locales/ar/hero.json';
import arWhyHardRock from './locales/ar/whyHardRock.json';
import arServices from './locales/ar/services.json';
import arContactUs from './locales/ar/contactUs.json';
import arFooter from './locales/ar/footer.json';
import arServiceDetail from './locales/ar/serviceDetail.json';
import arConsultation from './locales/ar/consultation.json';

export type AppLanguage = 'en' | 'ar';

const resources = {
  en: {
    common: enCommon,
    hero: enHero,
    whyHardRock: enWhyHardRock,
    services: enServices,
    contactUs: enContactUs,
    footer: enFooter,
    serviceDetail: enServiceDetail,
    consultation: enConsultation,
  },
  ar: {
    common: arCommon,
    hero: arHero,
    whyHardRock: arWhyHardRock,
    services: arServices,
    contactUs: arContactUs,
    footer: arFooter,
    serviceDetail: arServiceDetail,
    consultation: arConsultation,
  },
};

export function initI18n(language: AppLanguage) {
  i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: language,
      fallbackLng: 'en',
      defaultNS: 'common',
      interpolation: {
        escapeValue: false,
      },
      react: {
        useSuspense: false,
      },
    });

  return i18n;
}

export function setLanguageCookie(language: AppLanguage) {
  if (typeof document === 'undefined') return;
  const oneYear = 60 * 60 * 24 * 365;
  document.cookie = `language=${language}; path=/; max-age=${oneYear}; SameSite=Lax`;
  document.documentElement.lang = language;
  document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
}

export default i18n;
