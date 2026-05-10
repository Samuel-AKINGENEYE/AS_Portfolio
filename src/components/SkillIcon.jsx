import { useState } from 'react';

// Devicon CDN icon URLs indexed by skill name
const SKILL_ICONS = {
  'React':        'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
  'Next.js':      'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg',
  'TypeScript':   'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
  'Tailwind CSS': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg',
  'JavaScript':   'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
  'HTML/CSS':     'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',
  'Node.js':      'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
  'Express':      'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg',
  'Python':       'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
  'Java':         'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg',
  'PHP':          'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg',
  'PostgreSQL':   'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
  'MongoDB':      'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg',
  'Redis':        'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg',
  'MySQL':        'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg',
  'SQLite':       'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg',
  'Git':          'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',
  'Docker':       'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg',
  'AWS':          'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg',
  'Figma':        'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg',
  'Linux':        'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg',
  'Nginx':        'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nginx/nginx-original.svg',
  'GraphQL':      'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg',
  'Jest':         'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jest/jest-plain.svg',
  'Kubernetes':   'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg',
  'Vercel':       'https://assets.vercel.com/image/upload/v1607554385/repositories/vercel/logo.png',
};

// Text-emoji fallbacks shown when the CDN image fails to load
const EMOJI_FALLBACKS = {
  'React':        '⚛️',
  'Next.js':      '▲',
  'TypeScript':   '📘',
  'Tailwind CSS': '🎨',
  'JavaScript':   '🟡',
  'HTML/CSS':     '🌐',
  'Node.js':      '🟢',
  'Express':      '🚂',
  'Python':       '🐍',
  'Java':         '☕',
  'PHP':          '🐘',
  'PostgreSQL':   '🐘',
  'MongoDB':      '🍃',
  'Redis':        '🔴',
  'MySQL':        '🐬',
  'Git':          '🔀',
  'Docker':       '🐳',
  'AWS':          '☁️',
  'Figma':        '🎨',
  'Linux':        '🐧',
};

/**
 * Renders a skill's SVG icon from the Devicon CDN.
 * Falls back to an emoji if the image URL is unknown or fails to load.
 */
export function SkillIcon({ name, size = 18 }) {
  const [failed, setFailed] = useState(false);
  const src = SKILL_ICONS[name];

  if (!src || failed) {
    return (
      <span
        role="img"
        aria-label={name}
        style={{ fontSize: `${Math.round(size * 0.8)}px`, lineHeight: 1, display: 'inline-block' }}
      >
        {EMOJI_FALLBACKS[name] ?? '⚙️'}
      </span>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      loading="lazy"
      width={size}
      height={size}
      onError={() => setFailed(true)}
      style={{ width: size, height: size, objectFit: 'contain', display: 'inline-block' }}
    />
  );
}

export default SkillIcon;
