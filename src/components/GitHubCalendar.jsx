import { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { RefreshCw, Github, ExternalLink } from 'lucide-react';

// ── Constants ─────────────────────────────────────────────────────────────────

const CACHE_KEY = 'gh_cal';
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Mon, Wed, Fri visible; empty string = no label for that row
const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

// Eye-friendly soft greens (as specified)
const COLORS = {
  empty_light: '#ebedf0',
  empty_dark:  '#2d333b',
  low:    '#9be9a8', // 1–3
  mid:    '#40c463', // 4–6
  high:   '#30a14e', // 7–9
  max:    '#216e39', // 10+
};

const LEGEND = [COLORS.empty_light, COLORS.low, COLORS.mid, COLORS.high, COLORS.max];

// Cell geometry
const CELL = 11; // px
const GAP  = 2;  // px
const STEP = CELL + GAP; // 13px per column/row

// ── Helpers ───────────────────────────────────────────────────────────────────

function getColor(count, isDark) {
  if (count === 0) return isDark ? COLORS.empty_dark : COLORS.empty_light;
  if (count <= 3)  return COLORS.low;
  if (count <= 6)  return COLORS.mid;
  if (count <= 9)  return COLORS.high;
  return COLORS.max;
}

// ── Cache ─────────────────────────────────────────────────────────────────────

function getCached(year) {
  try {
    const raw = localStorage.getItem(`${CACHE_KEY}_${year}`);
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw);
    if (Date.now() - ts < CACHE_TTL) return data;
  } catch {}
  return null;
}

function setCache(year, data) {
  try {
    localStorage.setItem(`${CACHE_KEY}_${year}`, JSON.stringify({ data, ts: Date.now() }));
  } catch {}
}

// ── Data normalisation ────────────────────────────────────────────────────────

// jogruber API → { totalContributions, weeks[] } matching GitHub GraphQL shape
function normalizePublicData(raw) {
  const { contributions = [], total = {} } = raw;
  if (!contributions.length) return null;

  const totalContributions = Object.values(total).reduce((a, b) => a + Number(b), 0);

  // Sort ascending, then bucket into Sunday-start weeks
  const sorted = [...contributions].sort((a, b) => a.date.localeCompare(b.date));
  const weekMap = new Map();

  for (const day of sorted) {
    const d   = new Date(day.date + 'T00:00:00');
    const dow = d.getDay(); // 0 = Sun
    const sun = new Date(d);
    sun.setDate(d.getDate() - dow);
    const key = sun.toISOString().slice(0, 10);
    if (!weekMap.has(key)) weekMap.set(key, []);
    weekMap.get(key).push({ contributionCount: day.count, date: day.date });
  }

  const weeks = Array.from(weekMap.values()).map(days => ({ contributionDays: days }));
  return { totalContributions, weeks };
}

// Build a 7-slot array (indexed by day-of-week 0=Sun…6=Sat) for one week
function buildWeekGrid(week) {
  const grid = Array(7).fill(null);
  for (const day of week.contributionDays) {
    grid[new Date(day.date + 'T00:00:00').getDay()] = day;
  }
  return grid;
}

// Find the week index where each month label should appear
function computeMonthLabels(weeks) {
  const labels = [];
  let lastMonth = -1;
  weeks.forEach((week, wi) => {
    if (!week.contributionDays.length) return;
    const month = new Date(week.contributionDays[0].date + 'T00:00:00').getMonth();
    if (month !== lastMonth) {
      labels.push({ label: MONTHS[month], wi });
      lastMonth = month;
    }
  });
  return labels;
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function CalendarSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="flex justify-between items-center">
        <div className="h-8 w-52 rounded-lg bg-slate-200 dark:bg-slate-700" />
        <div className="flex gap-2">
          <div className="h-8 w-14 rounded-lg bg-slate-200 dark:bg-slate-700" />
          <div className="h-8 w-14 rounded-lg bg-slate-200 dark:bg-slate-700" />
          <div className="h-8 w-14 rounded-lg bg-slate-200 dark:bg-slate-700" />
        </div>
      </div>
      <div className="h-[120px] rounded-xl skeleton-shimmer" />
      <div className="flex justify-between items-center">
        <div className="h-5 w-44 rounded-lg bg-slate-200 dark:bg-slate-700" />
        <div className="h-5 w-36 rounded-lg bg-slate-200 dark:bg-slate-700" />
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

const GitHubCalendar = memo(function GitHubCalendar({ username }) {
  const apiBase    = import.meta.env.VITE_API_URL || '/api';
  const currentYear = new Date().getFullYear();

  // Available years: 2024 → current year
  const years = useMemo(
    () => Array.from({ length: currentYear - 2024 + 1 }, (_, i) => 2024 + i),
    [currentYear]
  );

  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [calendarData, setCalendarData] = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [fromCache, setFromCache] = useState(false);
  const [tooltip, setTooltip]   = useState(null);
  const [isDark, setIsDark]     = useState(
    () => document.documentElement.classList.contains('dark')
  );

  // Track dark-mode class changes
  useEffect(() => {
    const obs = new MutationObserver(() =>
      setIsDark(document.documentElement.classList.contains('dark'))
    );
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);

  const fetchContributions = useCallback(async (year, force = false) => {
    setLoading(true);
    setError(null);
    setFromCache(false);

    // Serve from cache unless forced
    if (!force) {
      const cached = getCached(year);
      if (cached) {
        setCalendarData(cached);
        setFromCache(true);
        setLoading(false);
        return;
      }
    }

    // 1️⃣ Try backend proxy (uses GITHUB_TOKEN for real GraphQL data)
    try {
      const res = await fetch(
        `${apiBase}/github/contributions/${username}?year=${year}`,
        { signal: AbortSignal.timeout(8000) }
      );
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data?.user) {
          const cal = json.data.user.contributionsCollection.contributionCalendar;
          setCache(year, cal);
          setCalendarData(cal);
          setLoading(false);
          return;
        }
      }
    } catch {}

    // 2️⃣ Fallback: public jogruber API (no token needed)
    try {
      const res = await fetch(
        `https://github-contributions-api.jogruber.vercel.app/${username}?y=${year}`,
        { signal: AbortSignal.timeout(8000) }
      );
      if (res.ok) {
        const json = await res.json();
        const normalized = normalizePublicData(json);
        if (normalized) {
          setCache(year, normalized);
          setCalendarData(normalized);
          setLoading(false);
          return;
        }
      }
    } catch {}

    // 3️⃣ Last resort: stale cache (even if expired)
    const stale = getCached(year);
    if (stale) {
      setCalendarData(stale);
      setFromCache(true);
      setLoading(false);
      return;
    }

    setError('Unable to load contribution data. Check your connection and try again.');
    setLoading(false);
  }, [username, apiBase]);

  useEffect(() => {
    fetchContributions(selectedYear);
  }, [selectedYear, fetchContributions]);

  // Derived data
  const weeks     = calendarData?.weeks ?? [];
  const total     = calendarData?.totalContributions ?? 0;
  const weekGrids = useMemo(() => weeks.map(buildWeekGrid), [weeks]);
  const monthLabels = useMemo(() => computeMonthLabels(weeks), [weeks]);

  // ── Render states ────────────────────────────────────────────────────────────

  if (loading) return <CalendarSkeleton />;

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">{error}</p>
        <button
          onClick={() => fetchContributions(selectedYear, true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-400 hover:border-blue-500 hover:text-blue-500 transition-colors"
        >
          <RefreshCw size={14} />
          Retry
        </button>
      </div>
    );
  }

  // ── Full calendar ─────────────────────────────────────────────────────────────

  return (
    <div className="space-y-4">

      {/* ── Header: count + year selector ───────────────────────────────────── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-2xl font-bold text-slate-900 dark:text-white">
            {total.toLocaleString()}
          </span>
          <span className="text-slate-500 dark:text-slate-400 text-sm">
            contributions in {selectedYear}
          </span>
          {fromCache && (
            <span className="text-xs text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
              cached
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {years.map(y => (
            <button
              key={y}
              onClick={() => setSelectedYear(y)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                selectedYear === y
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {y}
            </button>
          ))}
          <button
            onClick={() => fetchContributions(selectedYear, true)}
            title="Refresh data"
            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ml-1"
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* ── Calendar grid (scrollable on small screens) ──────────────────────── */}
      <div className="overflow-x-auto pb-2 -mx-1 px-1">
        <div style={{ minWidth: `${weeks.length * STEP + 34}px` }}>

          {/* Month labels */}
          <div className="flex mb-1" style={{ paddingLeft: '30px' }}>
            {monthLabels.map(({ label, wi }, idx) => {
              const left  = wi * STEP;
              const next  = idx < monthLabels.length - 1
                ? monthLabels[idx + 1].wi * STEP
                : weeks.length * STEP;
              return (
                <div
                  key={`${label}-${wi}`}
                  className="text-xs text-slate-400 dark:text-slate-500 shrink-0 select-none"
                  style={{ width: `${next - left}px` }}
                >
                  {label}
                </div>
              );
            })}
          </div>

          {/* Day labels + week columns */}
          <div className="flex" style={{ gap: 0 }}>
            {/* Day-of-week labels column */}
            <div
              className="flex flex-col shrink-0 mr-1"
              style={{ gap: `${GAP}px`, width: '28px' }}
            >
              {DAY_LABELS.map((lbl, i) => (
                <div
                  key={i}
                  className="text-xs text-slate-400 dark:text-slate-500 flex items-center select-none"
                  style={{ height: `${CELL}px` }}
                >
                  {lbl}
                </div>
              ))}
            </div>

            {/* Weeks */}
            <div className="flex" style={{ gap: `${GAP}px` }}>
              {weekGrids.map((grid, wi) => (
                <div key={wi} className="flex flex-col" style={{ gap: `${GAP}px` }}>
                  {grid.map((day, di) => (
                    <div
                      key={di}
                      className="rounded-[2px] transition-opacity"
                      style={{
                        width:           `${CELL}px`,
                        height:          `${CELL}px`,
                        backgroundColor: day
                          ? getColor(day.contributionCount, isDark)
                          : (isDark ? COLORS.empty_dark : COLORS.empty_light),
                        cursor: day ? 'pointer' : 'default',
                        opacity: 1,
                      }}
                      onMouseEnter={(e) => {
                        if (!day) return;
                        const rect = e.currentTarget.getBoundingClientRect();
                        setTooltip({ day, x: rect.left + CELL / 2, y: rect.top });
                      }}
                      onMouseLeave={() => setTooltip(null)}
                      onClick={() => {
                        if (day) console.log('GitHub contribution day:', day);
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Tooltip (fixed-position, above hovered cell) ─────────────────────── */}
      {tooltip && (
        <div
          className="fixed z-50 px-2.5 py-2 rounded-lg bg-slate-900 dark:bg-slate-700 text-white text-xs pointer-events-none shadow-xl border border-slate-700 dark:border-slate-600"
          style={{ left: tooltip.x, top: tooltip.y - 48, transform: 'translateX(-50%)' }}
        >
          <div className="font-semibold">
            {tooltip.day.contributionCount === 0
              ? 'No contributions'
              : `${tooltip.day.contributionCount} contribution${tooltip.day.contributionCount !== 1 ? 's' : ''}`}
          </div>
          <div className="text-slate-300 mt-0.5">
            {new Date(tooltip.day.date + 'T00:00:00').toLocaleDateString('en-US', {
              weekday: 'short', month: 'long', day: 'numeric', year: 'numeric',
            })}
          </div>
        </div>
      )}

      {/* ── Footer: GitHub link + legend ─────────────────────────────────────── */}
      <div className="flex items-center justify-between flex-wrap gap-3 pt-1">
        <a
          href={`https://github.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors group"
        >
          <Github size={14} />
          View full GitHub profile
          <ExternalLink size={12} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>

        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 select-none">
          <span>Less</span>
          {LEGEND.map((c, i) => (
            <div
              key={i}
              className="rounded-[2px]"
              style={{ width: `${CELL}px`, height: `${CELL}px`, backgroundColor: c }}
            />
          ))}
          <span>More</span>
        </div>
      </div>
    </div>
  );
});

export default GitHubCalendar;
