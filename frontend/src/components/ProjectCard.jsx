import { ExternalLink, Github } from 'lucide-react';
import { useState } from 'react';

function toSlug(str = '') {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function toCamel(s = '') {
  return s.replace(/-([a-z])/g, (_, c) => c.toUpperCase()) || 'project';
}

export default function ProjectCard({ project }) {
  const [imgFailed, setImgFailed] = useState(false);

  const s   = toSlug(project.title);
  const v   = toCamel(s);
  const hasDesc  = !!project.description;
  const hasLong  = !!project.longDescription;
  const hasStack = (project.techStack?.length ?? 0) > 0;

  // Build sequential lines so numbers are always contiguous
  const lines = [
    // L1  // title
    <span key="l1" className="text-slate-500">{'// '}{project.title}</span>,

    // L2  const varName = {
    <span key="l2">
      <span className="text-[#c792ea]">const </span>
      <span className="text-[#82aaff]">{v} </span>
      <span className="text-slate-400">= {'{'}</span>
    </span>,

    // L3  desc: "..."  (only if description exists)
    ...(hasDesc ? [
      <span key="l3" className="pl-4 break-words">
        <span className="text-[#ffcb6b]">desc</span>
        <span className="text-slate-400">: </span>
        <span className="text-[#c3e88d]">"{project.description}"</span>
        <span className="text-slate-500">,</span>
      </span>,
    ] : []),

    // long description as block comment
    ...(hasLong ? [
      <span key="llong" className="text-slate-500 break-words">
        {'/* '}{project.longDescription}{' */'}
      </span>,
    ] : []),

    // stack: ["React", ...]
    ...(hasStack ? [
      <span key="lstack" className="pl-4 break-words">
        <span className="text-[#ffcb6b]">stack</span>
        <span className="text-slate-400">: [</span>
        {project.techStack.map((t, i) => (
          <span key={t}>
            <span className="text-[#c3e88d]">"{t}"</span>
            {i < project.techStack.length - 1 && (
              <span className="text-slate-500">, </span>
            )}
          </span>
        ))}
        <span className="text-slate-400">]</span>
        <span className="text-slate-500">,</span>
      </span>,
    ] : []),

    // closing };
    <span key="lclose" className="text-slate-400">{'};'}</span>,
  ];

  return (
    <div className="group flex flex-col rounded-xl overflow-hidden border border-slate-700/60 bg-[#0d1117] shadow-xl hover:border-accent/40 hover:shadow-2xl hover:shadow-accent/5 transition-all duration-300">

      {/* ── VS Code title bar ─────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#161b22] border-b border-slate-700/50 shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
          <div className="ml-3 flex items-center gap-1.5 font-mono text-[11px] text-slate-400">
            <span
              className="inline-flex items-center justify-center px-1 h-[15px] rounded-sm text-[8px] font-black text-white tracking-tight select-none"
              style={{ background: 'linear-gradient(135deg, #3178c6 55%, #61dafb 100%)' }}
            >
              TSX
            </span>
            {s}.tsx
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
          {/* Fake browser bar */}
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

      {/* ── Code body ────────────────────────────────────────── */}
      <div className="flex-1 px-5 py-4 font-mono text-[12px] leading-[1.85]">
        {lines.map((content, i) => (
          <div key={i} className="flex gap-3">
            <span className="text-slate-600 w-5 text-right shrink-0 select-none">{i + 1}</span>
            <span className="flex-1 min-w-0">{content}</span>
          </div>
        ))}
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
              className="inline-flex items-center gap-1.5 font-mono text-[11px] text-slate-400 hover:text-white transition-colors shrink-0"
            >
              <Github size={11} /> Code
            </a>
          )}
        </div>
      )}
    </div>
  );
}
