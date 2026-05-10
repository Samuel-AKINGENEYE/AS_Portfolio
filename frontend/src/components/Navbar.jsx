import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import DarkModeToggle from './DarkModeToggle.jsx';

const NAV_LINKS = [
  { label: 'Home', href: '#hero' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Experience', href: '#experience' },
  { label: 'Education', href: '#education' },
  { label: 'Hire me', href: '#contact', isButton: true },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-sm border-b border-slate-200/60 dark:border-slate-800/60' : 'bg-transparent'}`}>
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo - SA */}
        <a href="#hero" className="font-bold text-2xl text-slate-900 dark:text-white tracking-tight">
          <span className="text-blue-500">{'{'}</span>SA<span className="text-blue-500">{'}'}</span>
        </a>

        <div className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map(({ label, href, isButton }) => (
            isButton ? (
              <a
                key={label}
                href={href}
                className="px-5 py-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium text-sm transition-all shadow-md hover:shadow-blue-500/30 hover:-translate-y-0.5"
              >
                {label} ✨
              </a>
            ) : (
              <a
                key={label}
                href={href}
                className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
              >
                {label}
              </a>
            )
          ))}
        </div>

        <div className="flex items-center gap-3">
          <DarkModeToggle />
          <button className="md:hidden p-1.5 text-slate-600 dark:text-slate-400" onClick={() => setOpen(!open)} aria-label="Toggle navigation">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 pb-4 animate-fade-in">
          {NAV_LINKS.map(({ label, href, isButton }) => (
            <a
              key={label}
              href={href}
              onClick={() => setOpen(false)}
              className={`block py-3 text-sm font-medium transition-colors border-b border-slate-100 dark:border-slate-800 last:border-0 ${isButton ? 'text-blue-500 font-semibold' : 'text-slate-600 dark:text-slate-400 hover:text-blue-500'}`}
            >
              {label} {isButton && '✨'}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
