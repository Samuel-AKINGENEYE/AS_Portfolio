import { ExternalLink, Github } from 'lucide-react';
import { useState } from 'react';

export default function ProjectCard({ project }) {
  const [imgFailed, setImgFailed] = useState(false);
  const cardLink = project.liveUrl || project.githubUrl || null;

  return (
    <div
      className="group relative flex flex-col bg-white dark:bg-slate-900
                 border border-slate-200 dark:border-slate-800
                 rounded-lg overflow-hidden
                 hover:border-slate-400 dark:hover:border-slate-600
                 transition-colors duration-200"
      style={cardLink ? { cursor: 'pointer' } : undefined}
    >
      {cardLink && (
        <a
          href={cardLink}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 z-[1] rounded-lg"
          aria-label={`Open ${project.title}`}
          tabIndex={-1}
        />
      )}

      {project.imageUrl && !imgFailed && (
        <div className="relative z-[2] h-44 overflow-hidden bg-slate-100 dark:bg-slate-800">
          <img
            src={project.imageUrl}
            alt={project.title}
            loading="lazy"
            decoding="async"
            onError={() => setImgFailed(true)}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="relative z-[2] flex flex-col flex-1 p-5">
        {project.featured && (
          <span className="font-mono text-[10px] text-green-600 dark:text-green-400 uppercase tracking-widest mb-3">
            ● Live
          </span>
        )}

        <h3 className="font-display font-semibold text-slate-900 dark:text-white text-base mb-2 group-hover:text-accent transition-colors">
          {project.title}
        </h3>

        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4 flex-1">
          {project.description}
        </p>

        {project.longDescription && (
          <div className="mb-4 pl-3 border-l-2 border-accent/30">
            <p className="text-xs text-slate-500 dark:text-slate-500 leading-relaxed italic">
              {project.longDescription}
            </p>
          </div>
        )}

        {project.techStack?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="font-mono px-1.5 py-0.5 text-[11px] rounded
                           bg-slate-100 dark:bg-slate-800
                           text-slate-600 dark:text-slate-400
                           border border-slate-200 dark:border-slate-700"
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center gap-4 pt-3 border-t border-slate-100 dark:border-slate-800">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="relative z-[3] inline-flex items-center gap-1.5 text-xs font-medium
                         text-accent hover:text-accent-hover transition-colors"
            >
              <ExternalLink size={12} />
              Live
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="relative z-[3] inline-flex items-center gap-1.5 text-xs font-medium
                         text-slate-500 dark:text-slate-400
                         hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <Github size={12} />
              Code
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
