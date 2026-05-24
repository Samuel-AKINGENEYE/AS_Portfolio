import { Award, ExternalLink, FileText } from 'lucide-react';

const CATEGORY_BADGE = {
  'AI/ML':         'border-purple-500/30 text-purple-400 bg-purple-500/10',
  'Web Dev':       'border-blue-500/30   text-blue-400   bg-blue-500/10',
  'Cybersecurity': 'border-red-500/30    text-red-400    bg-red-500/10',
  'Other':         'border-slate-600     text-slate-400  bg-slate-700/40',
};

function toSlug(str = '') {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

const isPdf = (url) => url && /\.pdf(\?|$)/i.test(url);

export default function CertificateCard({ certificate }) {
  const badgeClass = CATEGORY_BADGE[certificate.category] ?? CATEGORY_BADGE['Other'];
  const s = toSlug(certificate.name);
  const isClickable = !!(certificate.imageUrl || certificate.credentialUrl);

  const handleClick = () => {
    if (certificate.imageUrl) {
      window.open(certificate.imageUrl, '_blank', 'noopener,noreferrer');
    } else if (certificate.credentialUrl) {
      window.open(certificate.credentialUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const issueDate = certificate.issueDate
    ? new Date(certificate.issueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
    : null;

  return (
    <div
      onClick={isClickable ? handleClick : undefined}
      className={`group flex flex-col rounded-xl overflow-hidden border border-slate-700/60 bg-[#0d1117] shadow-xl hover:border-accent/40 hover:shadow-2xl hover:shadow-accent/5 transition-all duration-300${isClickable ? ' cursor-pointer' : ''}`}
    >
      {/* ── macOS title bar ───────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#161b22] border-b border-slate-700/50 shrink-0 gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56] shrink-0" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e] shrink-0" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f] shrink-0" />
          <div className="ml-3 flex items-center gap-1.5 font-mono text-[11px] text-slate-400 min-w-0">
            <span
              className="inline-flex items-center justify-center px-1 h-[15px] rounded-sm text-[8px] font-black text-white tracking-tight select-none shrink-0"
              style={{ background: 'linear-gradient(135deg, #E8703A 0%, #C45520 100%)' }}
            >
              AWD
            </span>
            <span className="truncate">{s}.pdf</span>
          </div>
        </div>

        {certificate.category && (
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[10px] font-mono ${badgeClass}`}>
            {certificate.category}
          </span>
        )}
      </div>

      {/* ── Certificate image / placeholder ──────────────────── */}
      <div className="relative h-36 border-b border-slate-700/50 bg-[#161b22] overflow-hidden flex items-center justify-center">
        {isPdf(certificate.imageUrl) ? (
          <div className="flex flex-col items-center gap-2 text-accent/50 select-none">
            <FileText size={38} strokeWidth={1.5} />
            <span className="font-mono text-[10px] text-slate-500 uppercase tracking-widest">PDF Certificate</span>
          </div>
        ) : certificate.imageUrl ? (
          <>
            <img
              src={certificate.imageUrl}
              alt={certificate.name}
              loading="lazy"
              decoding="async"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
              className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-[#0d1117]/90 rounded-full p-2.5 shadow-lg border border-slate-700">
                <ExternalLink size={16} className="text-accent" />
              </div>
            </div>
          </>
        ) : (
          <Award size={42} className="text-accent/25" strokeWidth={1.5} />
        )}
      </div>

      {/* ── Plain-text content ────────────────────────────────── */}
      <div className="flex-1 flex flex-col p-5 gap-1.5">
        <h3 className="font-display font-semibold text-white text-sm leading-snug group-hover:text-accent transition-colors line-clamp-2">
          {certificate.name}
        </h3>

        {certificate.issuer && (
          <p className="text-xs text-slate-400">{certificate.issuer}</p>
        )}

        {issueDate && (
          <p className="text-xs text-slate-500">{issueDate}</p>
        )}

        {certificate.credentialUrl && (
          <a
            href={certificate.credentialUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="mt-auto pt-3 inline-flex items-center gap-1.5 font-mono text-[11px] text-accent hover:text-accent-hover transition-colors"
          >
            <ExternalLink size={11} /> View Credential
          </a>
        )}
      </div>
    </div>
  );
}
