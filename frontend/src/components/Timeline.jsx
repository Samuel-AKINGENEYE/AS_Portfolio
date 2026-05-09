import { Calendar, MapPin } from 'lucide-react';

function fmt(date) {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
}

export default function Timeline({ items = [], type = 'education' }) {
  if (!items.length) return null;

  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-4 top-2 bottom-2 w-px bg-gradient-to-b from-blue-500 via-blue-400/40 to-transparent" />

      <div className="space-y-8">
        {items.map((item, i) => (
          <div key={item._id || i} className={`reveal reveal-d${Math.min(i + 1, 4)} relative pl-12`}>
            {/* Dot */}
            <div className="absolute left-[11px] top-5 w-[10px] h-[10px] rounded-full bg-blue-500 border-2 border-white dark:border-slate-900 shadow shadow-blue-500/50" />

            <div className="card-glass glow-hover p-6 rounded-2xl">
              <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                <div>
                  {type === 'education' ? (
                    <>
                      <h3 className="font-semibold text-slate-900 dark:text-white">{item.degree}</h3>
                      <p className="text-blue-500 font-medium text-sm mt-0.5">{item.institution}</p>
                      {item.field && <p className="text-xs text-slate-500 mt-0.5">{item.field}</p>}
                    </>
                  ) : (
                    <>
                      <h3 className="font-semibold text-slate-900 dark:text-white">{item.position}</h3>
                      <p className="text-blue-500 font-medium text-sm mt-0.5">{item.company}</p>
                      {item.location && (
                        <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                          <MapPin size={10} />{item.location}
                        </p>
                      )}
                    </>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-500 whitespace-nowrap">
                  <Calendar size={11} />
                  <span>
                    {fmt(item.startDate)} —{' '}
                    {item.current
                      ? <span className="text-green-500 font-semibold">Present</span>
                      : fmt(item.endDate)}
                  </span>
                </div>
              </div>

              {item.description && (
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              )}

              {type === 'experience' && item.achievements?.length > 0 && (
                <ul className="mt-3 space-y-1.5">
                  {item.achievements.filter(Boolean).map((ach, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <span className="text-blue-500 mt-0.5 shrink-0 font-bold">›</span>
                      <span>{ach}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
