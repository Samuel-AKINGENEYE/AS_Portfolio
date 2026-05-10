import { Github, Linkedin, Twitter, Mail } from 'lucide-react';

const ICON_MAP = { github: Github, linkedin: Linkedin, twitter: Twitter };

export default function Footer({ profile }) {
  const year = new Date().getFullYear();
  const social = profile?.socialLinks ?? {};

  return (
    <footer className="bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 py-14 px-6 border-t border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <p className="font-bold text-xl text-slate-900 dark:text-white">
              Samuel <span className="text-blue-500">AKINGENEYE</span>
            </p>
            <p className="text-sm mt-1">
              {profile?.title ?? 'Software Engineer'} &middot; Kigali, Rwanda
            </p>
          </div>

          <div className="flex items-center gap-4">
            {social.github && (
              <a href={social.github} target="_blank" rel="noopener noreferrer" 
                className="w-9 h-9 rounded-full border border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-white hover:bg-blue-500 hover:border-blue-500 transition-all duration-200">
                <Github size={17} />
              </a>
            )}
            {social.linkedin && (
              <a href={social.linkedin} target="_blank" rel="noopener noreferrer" 
                className="w-9 h-9 rounded-full border border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-white hover:bg-blue-500 hover:border-blue-500 transition-all duration-200">
                <Linkedin size={17} />
              </a>
            )}
            {social.twitter && (
              <a href={social.twitter} target="_blank" rel="noopener noreferrer" 
                className="w-9 h-9 rounded-full border border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-white hover:bg-blue-500 hover:border-blue-500 transition-all duration-200">
                <Twitter size={17} />
              </a>
            )}
            {profile?.email && (
              <a href={`mailto:${profile.email}`} 
                className="w-9 h-9 rounded-full border border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-white hover:bg-blue-500 hover:border-blue-500 transition-all duration-200">
                <Mail size={17} />
              </a>
            )}
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-600">
          &copy; {year} Samuel AKINGENEYE &mdash; Built with React, Node.js &amp; MongoDB.
        </div>
      </div>
    </footer>
  );
}
