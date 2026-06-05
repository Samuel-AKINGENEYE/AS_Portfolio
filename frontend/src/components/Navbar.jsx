import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import DarkModeToggle from './DarkModeToggle.jsx';

const NAV_LINKS = [
  { num: '01', label: 'Work',       href: '#projects'   },
  { num: '02', label: 'Stack',      href: '#skills'      },
  { num: '03', label: 'Experience', href: '#experience'  },
  { num: '04', label: 'Education',  href: '#education'   },
];

const SECTION_IDS = ['hero', 'projects', 'skills', 'experience', 'education', 'contact'];

function useActiveSection() {
  const [active, setActive] = useState('hero');
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); }),
      { rootMargin: '-30% 0px -60% 0px', threshold: 0 }
    );
    SECTION_IDS.forEach(id => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, []);
  return active;
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const active = useActiveSection();

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

        {/* Logo */}
        <a href="#hero" className="inline-flex items-center font-mono font-black text-xl select-none group" title="Samuel AKINGENEYE">
          <span className="text-accent opacity-80 group-hover:opacity-100 transition-opacity">{'{'}</span>
          <span className="text-slate-900 dark:text-white px-1 group-hover:text-accent transition-colors duration-200">SA</span>
          <span className="text-accent opacity-80 group-hover:opacity-100 transition-opacity">{'}'}</span>
          <span className="inline-block w-[2px] h-[18px] ml-1 bg-accent rounded-sm animate-blink" />
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map(({ num, label, href }) => {
            const isActive = active === href.slice(1);
            return (
              <a
                key={label}
                href={href}
                className={`group relative flex items-baseline gap-1 transition-colors ${isActive ? 'text-accent' : ''}`}
              >
                <span className={`font-mono text-[10px] transition-colors leading-none ${isActive ? 'text-accent' : 'text-accent/60 group-hover:text-accent'}`}>
                  {num}.
                </span>
                <span className={`text-sm font-medium transition-colors ${isActive ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white'}`}>
                  {label}
                </span>
                {isActive && <span className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-accent" />}
              </a>
            );
          })}

          <a
            href="#contact"
            className="font-mono text-xs font-semibold px-4 py-2 rounded-md border border-accent text-accent hover:bg-accent hover:text-white transition-all duration-200 tracking-wide"
          >
            hire_me
          </a>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <DarkModeToggle />
          <button
            className="md:hidden p-1.5 text-slate-600 dark:text-slate-400 hover:text-accent transition-colors"
            onClick={() => setOpen(!open)}
            aria-label="Toggle navigation"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 pb-5 animate-fade-in">
          {NAV_LINKS.map(({ num, label, href }) => (
            <a
              key={label}
              href={href}
              onClick={() => setOpen(false)}
              className="flex items-baseline gap-2 py-3 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-accent transition-colors border-b border-slate-100 dark:border-slate-800 last:border-0"
            >
              <span className="font-mono text-[10px] text-accent/50 leading-none shrink-0">{num}.</span>
              {label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="block mt-4 text-center font-mono text-sm font-semibold px-4 py-2.5 rounded-md border border-accent text-accent hover:bg-accent hover:text-white transition-all duration-200"
          >
            hire_me
          </a>
        </div>
      )}
    </nav>
  );
}
