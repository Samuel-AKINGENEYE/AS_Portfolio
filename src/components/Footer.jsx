import { Github, Linkedin, Twitter, Mail } from 'lucide-react';

const ICON_MAP = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
};

export default function Footer({ profile }) {
  const year = new Date().getFullYear();
  const social = profile?.socialLinks ?? {};

  return (
    <footer className="bg-slate-900 dark:bg-black text-slate-400 py-8 sm:py-14 px-4 sm:px-6 border-t border-slate-800">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
          {/* Brand */}
          <div className="text-center md:text-left">
            <p className="font-bold text-xl text-white">
              Samuel <span className="text-blue-500">AKINGENEYE</span>
            </p>
            <p className="text-sm mt-1">
              {profile?.title ?? 'Software Engineer'} &middot; Kigali, Rwanda
            </p>
          </div>

          {/* Socials */}
          <div className="flex items-center gap-4">
            {Object.entries(ICON_MAP).map(([key, Icon]) =>
              social[key] ? (
                <a
                  key={key}
                  href={social[key]}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={key}
                  className="w-9 h-9 rounded-full border border-slate-700 flex items-center justify-center
                             text-slate-400 hover:text-white hover:border-blue-500 hover:bg-blue-500/10
                             transition-all duration-200"
                >
                  <Icon size={17} />
                </a>
              ) : null
            )}
            {profile?.email && (
              <a
                href={`mailto:${profile.email}`}
                aria-label="Email"
                className="w-9 h-9 rounded-full border border-slate-700 flex items-center justify-center
                           text-slate-400 hover:text-white hover:border-blue-500 hover:bg-blue-500/10
                           transition-all duration-200"
              >
                <Mail size={17} />
              </a>
            )}
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-800 text-center text-xs text-slate-600">
          &copy; {year} Samuel AKINGENEYE &mdash; Built with React, Node.js &amp; MongoDB.
        </div>
      </div>
    </footer>
  );
}
