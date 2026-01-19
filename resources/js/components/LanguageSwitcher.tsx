import { useTranslation } from 'react-i18next';

const GlobeIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
    <path d="M2 12h20" />
  </svg>
);

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    // Get current language and normalize it (handles 'en-US' -> 'en')
    const currentLang = i18n.language?.startsWith('ar') ? 'ar' : 'en';
    const newLang = currentLang === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
  };

  // Get current language for display (normalized)
  const currentLang = i18n.language?.startsWith('ar') ? 'ar' : 'en';

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-1.5 md:py-2 rounded-xl bg-white/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 backdrop-blur-sm shadow-md hover:border-brand-purple dark:hover:border-brand-purple transition-all text-black dark:text-white hover:text-brand-purple dark:hover:text-brand-purple"
      aria-label="Switch language"
    >
      <GlobeIcon className="w-3.5 h-3.5 md:w-4 md:h-4" />
      <span className="text-xs md:text-sm font-medium">
        {currentLang === 'en' ? 'عربي' : 'EN'}
      </span>
    </button>
  );
}
