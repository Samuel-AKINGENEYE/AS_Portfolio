import { useState } from 'react';

function GitHubIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function LinkedInIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function XIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function MailIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function SocialButton({ href, Icon, label, hoverColor, ext }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={href}
      aria-label={label}
      {...(ext ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200"
      style={{
        border: `1px solid ${hovered ? hoverColor : 'rgba(148,163,184,0.15)'}`,
        color: hovered ? hoverColor : 'rgb(100,116,139)',
        background: hovered ? `${hoverColor}18` : 'transparent',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
        boxShadow: hovered ? `0 4px 16px ${hoverColor}30` : 'none',
      }}
    >
      <Icon size={18} />
      <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded font-mono text-[10px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-slate-900 dark:bg-slate-800 text-slate-200 border border-slate-700">
        {label}
      </span>
    </a>
  );
}

export default function Footer({ profile }) {
  const year = new Date().getFullYear();
  const social = profile?.socialLinks ?? {};

  const links = [
    social.github   && { href: social.github,              Icon: GitHubIcon,   label: 'GitHub',   hoverColor: '#e2e8f0', ext: true  },
    social.linkedin && { href: social.linkedin,            Icon: LinkedInIcon, label: 'LinkedIn', hoverColor: '#0a66c2', ext: true  },
    social.twitter  && { href: social.twitter,             Icon: XIcon,        label: 'X',        hoverColor: '#e2e8f0', ext: true  },
    profile?.email  && { href: `mailto:${profile.email}`, Icon: MailIcon,     label: 'Email',    hoverColor: '#10b981', ext: false },
  ].filter(Boolean);

  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">

          {/* Brand */}
          <div>
            <div className="font-mono font-black text-2xl select-none mb-1.5">
              <span className="text-accent">{'{ '}</span>
              <span className="text-slate-900 dark:text-white">SA</span>
              <span className="text-accent">{' }'}</span>
            </div>
            <p className="font-mono text-xs text-slate-400 dark:text-slate-500">
              {profile?.title ?? 'Full-Stack Engineer'} · Kigali, Rwanda
            </p>
          </div>

          {/* Social icons */}
          {links.length > 0 && (
            <div className="flex items-center gap-2">
              {links.map((link) => (
                <SocialButton key={link.href} {...link} />
              ))}
            </div>
          )}
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-mono text-[11px] text-slate-400 dark:text-slate-600">
            <span className="text-slate-300 dark:text-slate-700 select-none">{'// '}</span>
            © {year} Samuel AKINGENEYE — React · Node.js · MongoDB
          </p>
          <p className="font-mono text-[11px] text-slate-300 dark:text-slate-700 select-none">
            <span className="text-accent/60">const </span>
            <span>status </span>
            <span className="text-slate-400">=</span>
            <span className="text-green-500 dark:text-green-600"> "available"</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
