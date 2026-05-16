import { useState, useEffect } from 'react';
import { Award, ExternalLink, FileText, X, ZoomIn } from 'lucide-react';

const CATEGORY_COLORS = {
  'AI/ML': 'bg-purple-50 text-purple-600 border-purple-100 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20',
  'Web Dev': 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20',
  'Cybersecurity': 'bg-red-50 text-red-600 border-red-100 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20',
  'Other': 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-700 dark:text-slate-400 dark:border-slate-600',
};

const isPdf = (url) => url && /\.pdf(\?|$)/i.test(url);

export default function CertificateCard({ certificate }) {
  const [lightbox, setLightbox] = useState(false);
  const badgeClass = CATEGORY_COLORS[certificate.category] ?? CATEGORY_COLORS['Other'];

  const hasViewableImage = certificate.imageUrl && !isPdf(certificate.imageUrl);
  const pdfLink = isPdf(certificate.imageUrl) ? certificate.imageUrl : null;
  const isClickable = hasViewableImage || !!certificate.credentialUrl || !!pdfLink;

  const handleClick = () => {
    if (hasViewableImage) {
      setLightbox(true);
    } else if (certificate.credentialUrl) {
      window.open(certificate.credentialUrl, '_blank', 'noopener,noreferrer');
    } else if (pdfLink) {
      window.open(pdfLink, '_blank', 'noopener,noreferrer');
    }
  };

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e) => { if (e.key === 'Escape') setLightbox(false); };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [lightbox]);

  return (
    <>
      <div
        onClick={handleClick}
        className={`group flex flex-col bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl hover:scale-[1.02] hover:border-blue-500/50 transition-all duration-300 glow-hover${isClickable ? ' cursor-pointer' : ''}`}
      >
        {/* Image / icon area */}
        <div className="relative h-36 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700/50 overflow-hidden flex items-center justify-center">
          {isPdf(certificate.imageUrl) ? (
            <div className="flex flex-col items-center gap-2 text-blue-500/60 dark:text-blue-400/50 select-none">
              <FileText size={40} strokeWidth={1.5} />
              <span className="text-xs font-medium tracking-wide uppercase">PDF Certificate</span>
            </div>
          ) : certificate.imageUrl ? (
            <>
              <img
                src={certificate.imageUrl}
                alt={certificate.name}
                loading="lazy"
                decoding="async"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 dark:bg-slate-900/90 rounded-full p-2.5 shadow-lg">
                  <ZoomIn size={18} className="text-blue-500" />
                </div>
              </div>
            </>
          ) : (
            <Award size={44} className="text-blue-500/30 dark:text-blue-500/20" />
          )}
        </div>

        {/* Body */}
        <div className="flex flex-col flex-1 p-5">
          <span className={`self-start text-xs font-medium px-2.5 py-1 rounded-full border ${badgeClass} mb-3`}>
            {certificate.category ?? 'Certificate'}
          </span>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white leading-snug line-clamp-2 mb-1 flex-1">
            {certificate.name}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">{certificate.issuer}</p>
          {certificate.issueDate && (
            <p className="text-xs text-slate-400 dark:text-slate-500">
              {new Date(certificate.issueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
            </p>
          )}
          {certificate.credentialUrl && (
            <a
              href={certificate.credentialUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
            >
              <ExternalLink size={12} />
              View Credential
            </a>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
          onClick={() => setLightbox(false)}
        >
          <div
            className="relative max-w-4xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setLightbox(false)}
              className="absolute -top-4 -right-4 z-10 w-10 h-10 rounded-full bg-white/20 hover:bg-white/35 text-white flex items-center justify-center transition-colors shadow-lg"
              aria-label="Close"
            >
              <X size={18} />
            </button>
            <img
              src={certificate.imageUrl}
              alt={certificate.name}
              className="w-full max-h-[78vh] object-contain rounded-xl shadow-2xl"
            />
            <div className="mt-3 flex items-center justify-between gap-4 px-1">
              <div>
                <p className="text-white font-semibold text-sm">{certificate.name}</p>
                <p className="text-white/60 text-xs mt-0.5">{certificate.issuer}</p>
              </div>
              {certificate.credentialUrl && (
                <a
                  href={certificate.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium transition-colors shadow-md"
                >
                  <ExternalLink size={14} /> View Credential
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
