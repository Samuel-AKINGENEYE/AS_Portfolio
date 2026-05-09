import { ExternalLink, Github } from 'lucide-react';

export default function ProjectCard({ project }) {
  return (
    <div
      className="group flex flex-col bg-white dark:bg-slate-800
                 border border-slate-200 dark:border-slate-700
                 rounded-2xl overflow-hidden shadow-sm
                 hover:shadow-2xl hover:scale-[1.02] hover:border-blue-500/50
                 transition-all duration-300 glow-hover"
    >
      <div className="h-48 bg-gradient-to-br from-blue-500/10 via-slate-100 to-purple-500/10 dark:from-blue-500/10 dark:via-slate-800 dark:to-purple-500/10 overflow-hidden">
        {project.imageUrl ? (
          <img
            src={project.imageUrl}
            alt={project.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-5xl font-black text-blue-500/20 select-none">
              {project.title?.charAt(0) ?? '?'}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 p-6">
        <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-2 group-hover:text-blue-500 transition-colors">
          {project.title}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-4 line-clamp-3 flex-1">
          {project.description}
        </p>

        {project.techStack?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-5">
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

        <div className="flex items-center gap-4 pt-1 border-t border-slate-100 dark:border-slate-700/50">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium
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
              className="inline-flex items-center gap-1.5 text-sm font-medium
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
