import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import DarkModeToggle from './DarkModeToggle.jsx';

const NAV_LINKS = [
  { label: 'Home', href: '#hero' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Experience', href: '#experience' },
  { label: 'Education', href: '#education' },
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
    <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-sm border-b border-slate-200/60 dark:border-slate-800/60' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#hero" className="inline-flex items-center font-mono font-black text-xl select-none group" title="Samuel AKINGENEYE">
          <span className="text-accent opacity-80 group-hover:opacity-100 transition-opacity">{'{'}</span>
          <span className="text-slate-900 dark:text-white px-1 group-hover:text-accent transition-colors duration-200">SA</span>
          <span className="text-accent opacity-80 group-hover:opacity-100 transition-opacity">{'}'}</span>
          <span className="inline-block w-[2px] h-[18px] ml-1 bg-accent rounded-sm animate-blink" />
        </a>

        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              {label}
            </a>
          ))}

          <a
            href="#contact"
            className="px-5 py-2 rounded-md bg-accent hover:bg-accent-hover text-white font-medium text-sm transition-colors"
          >
            Hire me
          </a>
        </div>

        <div className="flex items-center gap-3">
          <DarkModeToggle />
          <button className="md:hidden p-1.5 text-slate-600 dark:text-slate-400" onClick={() => setOpen(!open)}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 pb-5">
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              onClick={() => setOpen(false)}
              className="block py-3 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-blue-500 transition-colors border-b border-slate-100 dark:border-slate-800 last:border-0"
            >
              {label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="block mt-3 text-center px-4 py-2.5 rounded-md bg-accent hover:bg-accent-hover text-white font-semibold text-sm transition-colors"
          >
            Hire me
          </a>
        </div>
      )}
    </nav>
  );
}
