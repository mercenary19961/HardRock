import { useTheme } from '@/contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-1.5 md:p-2.5 rounded-full border border-gray-300 dark:border-white/20 md:border-2 hover:border-brand-purple dark:hover:border-brand-purple transition-all text-black dark:text-white hover:text-brand-purple dark:hover:text-brand-purple"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <Moon className="w-4 h-4 md:w-5 md:h-5" />
      ) : (
        <Sun className="w-4 h-4 md:w-5 md:h-5" />
      )}
    </button>
  );
}
