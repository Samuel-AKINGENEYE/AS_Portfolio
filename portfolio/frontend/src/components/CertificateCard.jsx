import { useState } from 'react';
import { Award, ExternalLink, FileText, X, Maximize2 } from 'lucide-react';

const CATEGORY_COLORS = {
  'AI/ML': 'bg-purple-50 text-purple-600 border-purple-100 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20',
  'Web Dev': 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20',
  'Cybersecurity': 'bg-red-50 text-red-600 border-red-100 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20',
  'Other': 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-700 dark:text-slate-400 dark:border-slate-600',
};

function PdfModal({ certificate, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl h-[90vh] bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200 dark:border-slate-700 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <FileText size={16} className="text-blue-500 shrink-0" />
            <span className="text-sm font-medium text-slate-900 dark:text-white truncate">{certificate.name}</span>
          </div>
          <div className="flex items-center gap-2 ml-3 shrink-0">
            <a
              href={certificate.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
            >
              <Maximize2 size={12} />
              Open in tab
            </a>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* PDF viewer */}
        <iframe
          src={certificate.pdfUrl}
          title={certificate.name}
          className="flex-1 w-full border-none"
        />
      </div>
    </div>
  );
}

export default function CertificateCard({ certificate }) {
  const [showPdf, setShowPdf] = useState(false);
  const badgeClass = CATEGORY_COLORS[certificate.category] ?? CATEGORY_COLORS['Other'];

  const handleCardClick = () => {
    if (certificate.pdfUrl) setShowPdf(true);
  };

  return (
    <>
      <div
        onClick={handleCardClick}
        className={`group flex flex-col bg-white dark:bg-slate-800
                   border border-slate-200 dark:border-slate-700
                   rounded-2xl overflow-hidden shadow-sm
                   hover:shadow-xl hover:scale-[1.02] hover:border-blue-500/50
                   transition-all duration-300 glow-hover
                   ${certificate.pdfUrl ? 'cursor-pointer' : ''}`}
      >
        {/* Image / icon area */}
        <div className="relative h-36 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700/50 overflow-hidden flex items-center justify-center">
          {certificate.imageUrl ? (
            <img
              src={certificate.imageUrl}
              alt={certificate.name}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <Award size={44} className="text-blue-500/30 dark:text-blue-500/20" />
          )}
          {certificate.pdfUrl && (
            <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-full bg-blue-600/90 text-white text-xs font-medium shadow">
              <FileText size={10} />
              PDF
            </div>
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
              {new Date(certificate.issueDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
              })}
            </p>
          )}

          {certificate.pdfUrl && (
            <p className="mt-3 text-xs text-blue-500 dark:text-blue-400 font-medium">
              Click to view certificate
            </p>
          )}

          {certificate.credentialUrl && certificate.credentialUrl !== '' && (
            <a
              href={certificate.credentialUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium
                         text-blue-600 dark:text-blue-400
                         hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
            >
              <ExternalLink size={12} />
              View Credential
            </a>
          )}
        </div>
      </div>

      {showPdf && <PdfModal certificate={certificate} onClose={() => setShowPdf(false)} />}
    </>
  );
}
