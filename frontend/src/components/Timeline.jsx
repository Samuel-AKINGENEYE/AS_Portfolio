import { MapPin, Calendar } from 'lucide-react';

function fmt(date) {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
}

function toSlug(str = '') {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// ── Shared macOS title bar ────────────────────────────────────────────────────
function TitleBar({ filename, fileBadge, fileBadgeStyle, badge, badgeVariant = 'green' }) {
  const badgeStyles = {
    green: { pill: 'bg-green-500/15 border-green-500/30 text-green-400', dot: 'bg-green-500' },
    blue:  { pill: 'bg-blue-500/15  border-blue-500/30  text-blue-400',  dot: 'bg-blue-400'  },
  };
  const { pill, dot } = badgeStyles[badgeVariant];

  return (
    <div className="flex items-center justify-between px-4 py-2.5 bg-[#161b22] border-b border-slate-700/50 shrink-0 gap-2">
      <div className="flex items-center gap-1.5 min-w-0">
        <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56] shrink-0" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e] shrink-0" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f] shrink-0" />
        <div className="ml-3 flex items-center gap-1.5 font-mono text-[11px] text-slate-400 min-w-0">
          {fileBadge && (
            <span
              className="inline-flex items-center justify-center px-1 h-[15px] rounded-sm text-[8px] font-black text-white tracking-tight select-none shrink-0"
              style={{ background: fileBadgeStyle }}
            >
              {fileBadge}
            </span>
          )}
          <span className="truncate">{filename}</span>
        </div>
      </div>
      {badge && (
        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] font-mono ${pill}`}>
          <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${dot}`} />
          {badge}
        </span>
      )}
    </div>
  );
}

// ── Experience card ───────────────────────────────────────────────────────────
function ExperienceCard({ item, index }) {
  const achievements = (item.achievements ?? []).filter(Boolean);

  return (
    <div className={`reveal reveal-d${Math.min(index + 1, 4)} relative pl-12`}>
      {/* Timeline dot */}
      <div className={`absolute left-[7px] top-4 w-[18px] h-[18px] rounded-full z-10 flex items-center justify-center border-2 ${
        item.current
          ? 'bg-green-500/20 border-green-500 shadow-lg shadow-green-500/25'
          : 'bg-[#0d1117] border-slate-600'
      }`}>
        {item.current
          ? <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          : <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
        }
      </div>

      <div className="rounded-xl overflow-hidden border border-slate-700/60 bg-[#0d1117] shadow-xl hover:border-accent/40 transition-all duration-300">
        <TitleBar
          filename={`${toSlug(item.company)}.ts`}
          badge={item.current ? 'active' : null}
          badgeVariant="green"
        />

        <div className="p-5 flex flex-col gap-2">
          {/* Role */}
          <h3 className="font-display font-semibold text-white text-base leading-snug">
            {item.position}
          </h3>

          {/* Company + location */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm text-accent font-medium">{item.company}</span>
            {item.location && (
              <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                <MapPin size={11} /> {item.location}
              </span>
            )}
          </div>

          {/* Date range */}
          <div className="inline-flex items-center gap-1.5 font-mono text-xs text-slate-500">
            <Calendar size={11} />
            {fmt(item.startDate) || '?'}
            {' — '}
            {item.current
              ? <span className="text-green-400 font-semibold">Present</span>
              : fmt(item.endDate) || '?'
            }
          </div>

          {/* Description */}
          {item.description && (
            <p className="text-sm text-slate-400 leading-relaxed mt-1">
              {item.description}
            </p>
          )}

          {/* Achievements */}
          {achievements.length > 0 && (
            <ul className="mt-1 space-y-1.5">
              {achievements.map((ach, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
                  <span className="text-accent mt-0.5 shrink-0">›</span>
                  {ach}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Education card ────────────────────────────────────────────────────────────
function EducationCard({ item, index }) {
  return (
    <div className={`reveal reveal-d${Math.min(index + 1, 4)}`}>
      <div className="rounded-xl overflow-hidden border border-slate-700/60 bg-[#0d1117] shadow-xl hover:border-accent/40 transition-all duration-300">
        <TitleBar
          filename={`${toSlug(item.institution)}.tsx`}
          fileBadge="TSX"
          fileBadgeStyle="linear-gradient(135deg, #3178c6 55%, #61dafb 100%)"
          badge={item.current ? 'enrolled' : null}
          badgeVariant="blue"
        />

        <div className="p-5 flex flex-col gap-2">
          {/* Degree */}
          <h3 className="font-display font-semibold text-white text-base leading-snug">
            {item.degree}
          </h3>

          {/* Institution */}
          <span className="text-sm text-accent font-medium">{item.institution}</span>

          {/* Field */}
          {item.field && (
            <span className="text-xs text-slate-400">{item.field}</span>
          )}

          {/* Date range */}
          <div className="inline-flex items-center gap-1.5 font-mono text-xs text-slate-500">
            <Calendar size={11} />
            {fmt(item.startDate)}
            {(item.startDate && (item.endDate || item.current)) && ' — '}
            {item.current
              ? <span className="text-blue-400 font-semibold">Present</span>
              : fmt(item.endDate)
            }
          </div>

          {/* Description */}
          {item.description && (
            <p className="text-sm text-slate-400 leading-relaxed mt-1">
              {item.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Public export ─────────────────────────────────────────────────────────────
export default function Timeline({ items = [], type = 'education' }) {
  if (!items.length) return null;

  if (type === 'education') {
    return (
      <div className="grid sm:grid-cols-2 gap-6">
        {items.map((item, i) => (
          <EducationCard key={item._id ?? i} item={item} index={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="absolute left-4 top-5 bottom-5 w-px bg-gradient-to-b from-accent/60 via-slate-700/40 to-transparent" />
      <div className="space-y-8">
        {items.map((item, i) => (
          <ExperienceCard key={item._id ?? i} item={item} index={i} />
        ))}
      </div>
    </div>
  );
}
