export default function SkillBadge({ label }) {
  return (
    <span
      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
                 bg-slate-100 dark:bg-slate-700
                 text-slate-700 dark:text-slate-300
                 border border-slate-200 dark:border-slate-600
                 hover:bg-blue-50 dark:hover:bg-blue-500/10
                 hover:text-blue-600 dark:hover:text-blue-400
                 hover:border-blue-200 dark:hover:border-blue-500/30
                 transition-colors duration-200 cursor-default"
    >
      {label}
    </span>
  );
}
