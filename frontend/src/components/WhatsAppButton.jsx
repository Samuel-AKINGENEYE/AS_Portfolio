import { useState } from 'react';

const WHATSAPP_NUMBER = '250790663921';
const PREFILLED_MSG = encodeURIComponent(
  "Hi Samuel! I found your portfolio and I'd like to connect."
);

export default function WhatsAppButton() {
  const [hovered, setHovered] = useState(false);
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${PREFILLED_MSG}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with me on WhatsApp"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 group"
    >
      <span className={`text-sm font-medium text-white bg-slate-800 dark:bg-slate-700 px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap transition-all duration-300 pointer-events-none ${hovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
        Chat with me
      </span>

      {/* WhatsApp button - opposite breathing animation (bi-directional) */}
      <div
        className={`
          w-14 h-14 rounded-full flex items-center justify-center
          shadow-lg cursor-pointer transition-transform duration-200
          ${hovered ? 'scale-110' : 'scale-100'}
          animate-float-opposite
        `}
        style={{ backgroundColor: '#25D366' }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="28" height="28" fill="white" aria-hidden="true">
          <path d="M16 0C7.163 0 0 7.163 0 16c0 2.822.737 5.469 2.027 7.773L0 32l8.469-2.007A15.933 15.933 0 0016 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.333a13.28 13.28 0 01-6.775-1.853l-.487-.289-5.028 1.191 1.217-4.895-.32-.504A13.247 13.247 0 012.667 16C2.667 8.636 8.636 2.667 16 2.667S29.333 8.636 29.333 16 23.364 29.333 16 29.333zm7.245-9.84c-.397-.199-2.351-1.16-2.716-1.292-.364-.131-.63-.197-.895.199-.265.396-1.028 1.292-1.26 1.558-.232.266-.464.299-.862.1-.397-.199-1.676-.617-3.194-1.97-1.18-1.052-1.977-2.352-2.21-2.748-.232-.397-.025-.611.175-.808.18-.178.397-.464.596-.696.199-.232.265-.397.397-.662.133-.265.067-.497-.033-.696-.1-.199-.895-2.156-1.227-2.95-.323-.773-.65-.668-.895-.68l-.762-.013c-.265 0-.695.1-1.06.497-.364.397-1.392 1.36-1.392 3.316s1.425 3.847 1.624 4.112c.199.265 2.804 4.28 6.795 5.999.95.41 1.692.655 2.27.839.953.303 1.82.26 2.505.158.764-.114 2.351-.96 2.683-1.888.33-.928.33-1.724.232-1.888-.099-.165-.364-.265-.762-.464z" />
        </svg>
      </div>
    </a>
  );
}
