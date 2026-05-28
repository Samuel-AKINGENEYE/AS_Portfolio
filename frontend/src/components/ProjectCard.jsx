import { ExternalLink, Github } from 'lucide-react';
import { useState } from 'react';

function toSlug(str = '') {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export default function ProjectCard({ project }) {
  const [imgFailed, setImgFailed] = useState(false);
  const s = toSlug(project.title);
  const cardHref = project.liveUrl || project.githubUrl || null;

  return (
    <a
      href={cardHref ?? undefined}
      target={cardHref ? '_blank' : undefined}
      rel={cardHref ? 'noopener noreferrer' : undefined}
      className="group flex flex-col h-[420px] rounded-xl overflow-hidden border border-slate-700/60 bg-[#0d1117] shadow-xl hover:border-accent/40 hover:shadow-2xl hover:shadow-accent/5 transition-all duration-300"
      style={!cardHref ? { pointerEvents: 'none' } : undefined}
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
              style={{ background: 'linear-gradient(135deg, #3178c6 55%, #61dafb 100%)' }}
            >
              TSX
            </span>
            <span className="truncate">{s}.tsx</span>
          </div>
        </div>

        {project.featured && (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-500/15 border border-green-500/30 text-green-400 text-[10px] font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            live
          </span>
        )}
      </div>

      {/* ── Browser-chrome image preview ─────────────────────── */}
      {project.imageUrl && !imgFailed && (
        <div className="border-b border-slate-700/50">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#0d1117]">
            <div className="flex gap-1 shrink-0">
              <span className="w-2 h-2 rounded-full bg-slate-700" />
              <span className="w-2 h-2 rounded-full bg-slate-700" />
              <span className="w-2 h-2 rounded-full bg-slate-700" />
            </div>
            <div className="flex-1 mx-2 px-2 py-0.5 rounded bg-slate-800/80 font-mono text-[10px] text-slate-600 truncate">
              localhost:3000/{s}
            </div>
          </div>
          <div className="h-40 overflow-hidden">
            <img
              src={project.imageUrl}
              alt={project.title}
              loading="lazy"
              decoding="async"
              onError={() => setImgFailed(true)}
              className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300"
            />
          </div>
        </div>
      )}

      {/* ── Plain-text content ────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-h-0 p-5 gap-2 overflow-hidden">
        <h3 className="font-display font-semibold text-white text-base leading-snug group-hover:text-accent transition-colors line-clamp-1">
          {project.title}
        </h3>

        {project.description && (
          <p className="text-sm text-slate-400 leading-relaxed line-clamp-2">
            {project.description}
          </p>
        )}

        {project.longDescription && (
          <p className="text-xs text-slate-500 italic leading-relaxed pl-3 border-l-2 border-slate-700 line-clamp-2">
            {project.longDescription}
          </p>
        )}

        <div className="flex-1" />

        {project.techStack?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 max-h-[52px] overflow-hidden flex-shrink-0">
            {project.techStack.map((t) => (
              <span
                key={t}
                className="font-mono text-[11px] px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400"
              >
                {t}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ── Footer terminal bar ───────────────────────────────── */}
      {(project.liveUrl || project.githubUrl) && (
        <div className="flex items-center gap-4 px-5 py-3 border-t border-slate-700/50 bg-[#161b22]">
          <span className="font-mono text-[10px] text-slate-600 select-none flex-1 truncate">
            {'> run '}{s}
          </span>
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 font-mono text-[11px] text-accent hover:text-accent-hover transition-colors shrink-0"
            >
              <ExternalLink size={11} /> Live
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 font-mono text-[11px] text-slate-400 hover:text-white transition-colors shrink-0"
            >
              <Github size={11} /> Code
            </a>
          )}
        </div>
      )}
    </a>
  );
}
