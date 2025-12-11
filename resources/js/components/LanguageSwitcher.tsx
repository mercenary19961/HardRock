import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-1.5 md:py-2 rounded-lg border border-gray-300 dark:border-white/20 hover:border-brand-purple dark:hover:border-brand-purple transition-all text-black dark:text-white hover:text-brand-purple dark:hover:text-brand-purple"
      aria-label="Switch language"
    >
      <Globe className="w-3.5 h-3.5 md:w-4 md:h-4" />
      <span className="text-xs md:text-sm font-medium">
        {i18n.language === 'en' ? 'عربي' : 'EN'}
      </span>
    </button>
  );
}
