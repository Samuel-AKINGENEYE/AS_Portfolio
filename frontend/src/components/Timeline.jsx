import { GraduationCap } from 'lucide-react';

function fmt(date) {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
}

function slug(str = '') {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function classname(str = '') {
  return str.replace(/[^a-zA-Z0-9]/g, '');
}

// ── Shared VS Code–style editor card ─────────────────────────────────────────
function EditorCard({ filename, badge, badgeVariant = 'green', fileIcon, children }) {
  const badge_styles = {
    green: { pill: 'bg-green-500/15 border-green-500/30 text-green-400', dot: 'bg-green-500' },
    blue:  { pill: 'bg-blue-500/15  border-blue-500/30  text-blue-400',  dot: 'bg-blue-400'  },
  };
  const { pill, dot } = badge_styles[badgeVariant];

  return (
    <div className="rounded-xl overflow-hidden border border-slate-700/60 bg-[#0d1117] shadow-xl glow-hover transition-all duration-300">
      {/* Title bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#161b22] border-b border-slate-700/50">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
          <div className="ml-3 flex items-center gap-1.5 font-mono text-[11px] text-slate-400">
            {fileIcon}
            {filename}
          </div>
        </div>
        {badge && (
          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] font-mono ${pill}`}>
            <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${dot}`} />
            {badge}
          </span>
        )}
      </div>

      {/* Code body */}
      <div className="px-5 py-4 font-mono text-[12px] leading-[1.85]">
        {children}
      </div>
    </div>
  );
}

// ── Line with number ──────────────────────────────────────────────────────────
function L({ n, children }) {
  return (
    <div className="flex gap-3">
      <span className="text-slate-600 w-5 text-right shrink-0 select-none">{n}</span>
      <span className="flex-1 min-w-0">{children}</span>
    </div>
  );
}

// ── Experience card (VS Code file = git-flavoured const declarations) ─────────
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

      <EditorCard
        filename={`${slug(item.company)}.ts`}
        badge={item.current ? 'active' : null}
        badgeVariant="green"
      >
        {/* company · location */}
        <L n={1}>
          <span className="text-slate-500">
            {'// '}{item.company}{item.location ? ` · ${item.location}` : ''}
          </span>
        </L>
        {/* role */}
        <L n={2}>
          <span className="text-[#c792ea]">const </span>
          <span className="text-[#82aaff]">role </span>
          <span className="text-slate-400">= </span>
          <span className="text-[#c3e88d]">"{item.position}"</span>
          <span className="text-slate-500">;</span>
        </L>
        {/* date range */}
        <L n={3}>
          <span className="text-slate-500">
            {'// '}
            {fmt(item.startDate) || '?'}
            {' → '}
            {item.current ? 'Present' : (fmt(item.endDate) || '?')}
          </span>
        </L>
        {/* blank */}
        <L n={4}><span>&nbsp;</span></L>

        {achievements.length > 0 ? (
          <>
            <L n={5}>
              <span className="text-[#c792ea]">const </span>
              <span className="text-[#82aaff]">highlights </span>
              <span className="text-slate-400">= [</span>
            </L>
            {achievements.map((ach, ai) => (
              <L key={ai} n={6 + ai}>
                <span className="pl-4 break-words">
                  <span className="text-[#c3e88d]">"{ach}"</span>
                  {ai < achievements.length - 1 && <span className="text-slate-500">,</span>}
                </span>
              </L>
            ))}
            <L n={6 + achievements.length}>
              <span className="text-slate-400">];</span>
            </L>
          </>
        ) : item.description ? (
          <L n={5}>
            <span className="text-slate-500 break-words whitespace-pre-wrap">
              {'/* '}{item.description}{' */'}
            </span>
          </L>
        ) : null}
      </EditorCard>
    </div>
  );
}

// ── Education card (VS Code file = class definition) ─────────────────────────
function EducationCard({ item, index }) {
  const lo = item.field ? 1 : 0;

  return (
    <div className={`reveal reveal-d${Math.min(index + 1, 4)}`}>
      <EditorCard
        filename={`${slug(item.institution)}.ts`}
        badge={item.current ? 'enrolled' : null}
        badgeVariant="blue"
        fileIcon={<GraduationCap size={12} className="text-purple-400" />}
      >
        {/* class Institution { */}
        <L n={1}>
          <span className="text-[#c792ea]">class </span>
          <span className="text-[#f07178]">{classname(item.institution)}</span>
          <span className="text-slate-300"> {'{'}</span>
        </L>
        {/* degree = "..." */}
        <L n={2}>
          <span className="pl-4">
            <span className="text-[#ffcb6b]">degree</span>
            <span className="text-slate-400"> = </span>
            <span className="text-[#c3e88d]">"{item.degree}"</span>
            <span className="text-slate-500">;</span>
          </span>
        </L>
        {/* field = "..." (optional) */}
        {item.field && (
          <L n={3}>
            <span className="pl-4">
              <span className="text-[#ffcb6b]">field</span>
              <span className="text-slate-400"> = </span>
              <span className="text-[#c3e88d]">"{item.field}"</span>
              <span className="text-slate-500">;</span>
            </span>
          </L>
        )}
        {/* // dates */}
        <L n={3 + lo}>
          <span className="pl-4 text-slate-500">
            {'// '}
            {fmt(item.startDate)}
            {(item.startDate && (item.endDate || item.current)) ? ' → ' : ''}
            {item.current ? 'Present' : fmt(item.endDate)}
          </span>
        </L>
        {/* } */}
        <L n={4 + lo}>
          <span className="text-slate-300">{'}'}</span>
        </L>
        {/* description block comment */}
        {item.description && (
          <>
            <L n={5 + lo}><span>&nbsp;</span></L>
            <L n={6 + lo}>
              <span className="text-slate-500 break-words whitespace-pre-wrap">
                {'/* '}{item.description}{' */'}
              </span>
            </L>
          </>
        )}
      </EditorCard>
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
      {/* Vertical timeline connector */}
      <div className="absolute left-4 top-5 bottom-5 w-px bg-gradient-to-b from-accent/60 via-slate-700/40 to-transparent" />
      <div className="space-y-8">
        {items.map((item, i) => (
          <ExperienceCard key={item._id ?? i} item={item} index={i} />
        ))}
      </div>
    </div>
  );
}
