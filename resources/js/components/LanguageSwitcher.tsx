import { useTranslation } from 'react-i18next';
import { setLanguageCookie, type AppLanguage } from '@/i18n';

/**
 * The translate glyph (a character beside a letter), not a globe. A globe reads as
 * "region" or "country"; this button changes the language, and the two are not the
 * same choice.
 */
const LanguagesIcon = ({ className }: { className?: string }) => (
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
    <path d="m5 8 6 6" />
    <path d="m4 14 6-6 2-3" />
    <path d="M2 5h12" />
    <path d="M7 2h1" />
    <path d="m22 22-5-10-5 10" />
    <path d="M14 18h6" />
  </svg>
);

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const currentLang: AppLanguage = i18n.language?.startsWith('ar') ? 'ar' : 'en';
    const newLang: AppLanguage = currentLang === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
    setLanguageCookie(newLang);
  };

  // Get current language for display (normalized)
  const currentLang = i18n.language?.startsWith('ar') ? 'ar' : 'en';

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-1.5 md:py-2 rounded-xl bg-white/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 backdrop-blur-sm shadow-md hover:border-brand-purple dark:hover:border-brand-purple transition-all text-black dark:text-white hover:text-brand-purple dark:hover:text-brand-purple"
      aria-label={currentLang === 'en' ? 'Switch to Arabic' : 'Switch to English'}
    >
      <LanguagesIcon className="w-3.5 h-3.5 md:w-4 md:h-4" />
      {/* The label is the language you would be switching TO, in Latin script both
          ways — the same two letters sit at the same width whichever way round the
          button is, so it never reflows when the site flips to RTL. */}
      <span className="text-xs md:text-sm font-medium">
        {currentLang === 'en' ? 'AR' : 'EN'}
      </span>
    </button>
  );
}
