import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext.jsx';

export default function DarkModeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="p-2 rounded-full border border-slate-200 dark:border-slate-700
                 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400
                 hover:bg-slate-100 dark:hover:bg-slate-700
                 hover:text-blue-500 dark:hover:text-blue-400
                 transition-all duration-300"
    >
      {isDark ? <Sun size={17} /> : <Moon size={17} />}
    </button>
  );
}
