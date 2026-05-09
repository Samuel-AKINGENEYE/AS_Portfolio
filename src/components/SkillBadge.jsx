export default function SkillBadge({ label, icon: Icon }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium
                 rounded-full border border-slate-200 dark:border-slate-600
                 bg-white dark:bg-slate-800/50
                 text-slate-700 dark:text-slate-300
                 hover:bg-blue-500 hover:text-white hover:border-blue-500
                 dark:hover:bg-blue-500 dark:hover:text-white dark:hover:border-blue-500
                 transition-all duration-200 cursor-default select-none"
    >
      {Icon && <Icon size={13} />}
      {label}
    </span>
  );
}
