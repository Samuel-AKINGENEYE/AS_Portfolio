import { ExternalLink, Github } from 'lucide-react';
import { useState } from 'react';

function screenshotUrl(url) {
  return `https://image.thum.io/get/width/600/crop/400/${url}`;
}

export default function ProjectCard({ project }) {
  const [imgFailed, setImgFailed] = useState(false);
  const cardLink = project.liveUrl || project.githubUrl || null;

  // Use stored image, fall back to live-URL screenshot, then placeholder
  const thumbSrc =
    (project.imageUrl && !imgFailed)
      ? project.imageUrl
      : (!imgFailed && project.liveUrl)
        ? screenshotUrl(project.liveUrl)
        : null;

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
          aria-label={`Open ${project.title}`}
          tabIndex={-1}
        />
      )}

      {/* Thumbnail — fixed 160 px so every card shares the same image band */}
      <div className="relative z-[2] h-40 flex-shrink-0 bg-gradient-to-br from-blue-500/10 via-slate-100 to-purple-500/10 dark:from-blue-500/10 dark:via-slate-800 dark:to-purple-500/10 overflow-hidden flex items-center justify-center">
        {thumbSrc ? (
          <img
            src={thumbSrc}
            alt={project.title}
            loading="lazy"
            decoding="async"
            onError={() => setImgFailed(true)}
            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <span className="text-5xl font-black text-blue-500/20 select-none">
            {project.title?.charAt(0) ?? '?'}
          </span>
        )}
      </div>

      {/* Body — 280 px remaining, laid out top→description→spacer→tech→footer */}
      <div className="relative z-[2] flex flex-col flex-1 min-h-0 p-5">
        {/* Title */}
        <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-2 group-hover:text-blue-500 transition-colors">
          {project.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
          {project.description}
        </p>

        {/* Problem */}
        {project.problem && (
          <div className="mb-3">
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wide bg-red-500/10 text-red-500 dark:text-red-400 border border-red-500/20 mb-1.5">
              Problem
            </span>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              {project.problem}
            </p>
          </div>
        )}

        {/* Solution */}
        {project.solution && (
          <div className="mb-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wide bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20 mb-1.5">
              Solution
            </span>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              {project.solution}
            </p>
          </div>
        )}

        {/* Spacer — pushes tech + footer to the bottom */}
        <div className="flex-1" />

        {/* Tech stack — capped at 2 rows */}
        {project.techStack?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3 max-h-[52px] overflow-hidden flex-shrink-0">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="px-2 py-0.5 text-xs rounded-md
                           bg-blue-50 dark:bg-blue-500/10
                           text-blue-600 dark:text-blue-400
                           border border-blue-100 dark:border-blue-500/20"
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        {/* Footer links */}
        <div className="flex items-center gap-4 pt-3 border-t border-slate-100 dark:border-slate-700/50 flex-shrink-0">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="relative z-[3] inline-flex items-center gap-1.5 text-sm font-medium
                         text-blue-600 dark:text-blue-400
                         hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
            >
              <ExternalLink size={14} />
              Live Demo
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="relative z-[3] inline-flex items-center gap-1.5 text-sm font-medium
                         text-slate-500 dark:text-slate-400
                         hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <Github size={14} />
              Source
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
