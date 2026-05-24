import { Github, Linkedin, Twitter, Mail } from 'lucide-react';

export default function Footer({ profile }) {
  const year = new Date().getFullYear();
  const social = profile?.socialLinks ?? {};

  const links = [
    social.github   && { href: social.github,               Icon: Github,   ext: true  },
    social.linkedin && { href: social.linkedin,             Icon: Linkedin, ext: true  },
    social.twitter  && { href: social.twitter,              Icon: Twitter,  ext: true  },
    profile?.email  && { href: `mailto:${profile.email}`,  Icon: Mail,     ext: false },
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

          {/* Social icons — square, minimal */}
          {links.length > 0 && (
            <div className="flex items-center gap-2">
              {links.map(({ href, Icon, ext }) => (
                <a
                  key={href}
                  href={href}
                  {...(ext ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="w-8 h-8 rounded-md border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 hover:border-accent hover:text-accent transition-all duration-200"
                >
                  <Icon size={14} />
                </a>
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
