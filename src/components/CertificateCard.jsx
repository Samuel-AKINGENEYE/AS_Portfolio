import { Award, ExternalLink, FileText } from 'lucide-react';

const CATEGORY_COLORS = {
  'AI/ML': 'bg-purple-50 text-purple-600 border-purple-100 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20',
  'Web Dev': 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20',
  'Cybersecurity': 'bg-red-50 text-red-600 border-red-100 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20',
  'Other': 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-700 dark:text-slate-400 dark:border-slate-600',
};

const isPdf = (url) => url && /\.pdf(\?|$)/i.test(url);

export default function CertificateCard({ certificate }) {
  const badgeClass = CATEGORY_COLORS[certificate.category] ?? CATEGORY_COLORS['Other'];
  const cardLink = certificate.credentialUrl
    || (isPdf(certificate.imageUrl) ? certificate.imageUrl : null)
    || certificate.imageUrl
    || null;

  return (
    <div
      className="group relative flex flex-col bg-white dark:bg-slate-800
                 border border-slate-200 dark:border-slate-700
                 rounded-2xl overflow-hidden shadow-sm
                 hover:shadow-xl hover:scale-[1.02] hover:border-blue-500/50
                 transition-all duration-300 glow-hover"
      style={cardLink ? { cursor: 'pointer' } : undefined}
    >
      {cardLink && (
        <a
          href={cardLink}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 z-[1] rounded-2xl"
          aria-label={`View ${certificate.name}`}
          tabIndex={-1}
        />
      )}

      {/* Image / icon area */}
      <div className="relative z-[2] h-36 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700/50 overflow-hidden flex items-center justify-center">
        {isPdf(certificate.imageUrl) ? (
          <div className="flex flex-col items-center gap-2 text-blue-500/60 dark:text-blue-400/50 select-none">
            <FileText size={40} strokeWidth={1.5} />
            <span className="text-xs font-medium tracking-wide uppercase">PDF Certificate</span>
          </div>
        ) : certificate.imageUrl ? (
          <img
            src={certificate.imageUrl}
            alt={certificate.name}
            loading="lazy"
            decoding="async"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.removeAttribute('style');
            }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : null}
        {!isPdf(certificate.imageUrl) && (
          <Award
            size={44}
            className="text-blue-500/30 dark:text-blue-500/20 absolute"
            style={certificate.imageUrl ? { display: 'none' } : undefined}
          />
        )}
      </div>

      {/* Body */}
      <div className="relative z-[2] flex flex-col flex-1 p-5">
        <span className={`self-start text-xs font-medium px-2.5 py-1 rounded-full border ${badgeClass} mb-3`}>
          {certificate.category ?? 'Certificate'}
        </span>

        <h3 className="text-sm font-semibold text-slate-900 dark:text-white leading-snug line-clamp-2 mb-1 flex-1">
          {certificate.name}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">{certificate.issuer}</p>
        {certificate.issueDate && (
          <p className="text-xs text-slate-400 dark:text-slate-500">
            {new Date(certificate.issueDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
            })}
          </p>
        )}

        {certificate.credentialUrl && (
          <a
            href={certificate.credentialUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="relative z-[3] mt-4 inline-flex items-center gap-1.5 text-xs font-medium
                       text-blue-600 dark:text-blue-400
                       hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
          >
            <ExternalLink size={12} />
            View Credential
          </a>
        )}
      </div>
    </div>
  );
}
