import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext.jsx';

export default function DarkModeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="w-9 h-9 rounded-lg border border-slate-200 dark:border-slate-700
                 bg-white dark:bg-slate-800
                 flex items-center justify-center
                 text-slate-500 dark:text-slate-400
                 hover:text-accent hover:border-accent
                 dark:hover:text-accent dark:hover:border-accent
                 transition-all duration-200"
    >
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
