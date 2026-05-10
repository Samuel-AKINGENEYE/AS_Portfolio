import { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { ExternalLink } from 'lucide-react';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];
const LEGEND = ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'];

const CELL     = 10;   // px
const GAP      = 2;    // px
const STEP     = CELL + GAP; // 12 px per week column
const LEFT_COL = 28;   // day-of-week label column width

function cellColor(count) {
  if (count <= 0) return '#161b22';
  if (count === 1) return '#0e4429';
  if (count === 2) return '#006d32';
  if (count === 3) return '#26a641';
  return '#39d353';
}

// Avoid toISOString() — it uses UTC, which can shift the date in +UTC timezones
function localDateStr(d) {
  const y  = d.getFullYear();
  const m  = String(d.getMonth() + 1).padStart(2, '0');
  const dy = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dy}`;
}

function buildContribMap(weeks) {
  const map = {};
  for (const week of (weeks || [])) {
    for (const day of (week || [])) {
      if (day?.date) map[day.date] = day.count || 0;
    }
  }
  return map;
}

// Generate the full-year grid (52–53 week columns × 7 rows).
// For the current year, cells after today are treated as 0 (future).
// Cells outside the calendar year (overflow days) are marked inYear=false.
function buildGrid(year, map, currentYear) {
  const today = new Date();
  today.setHours(23, 59, 59, 999); // today counts as not-future

  const jan1  = new Date(year, 0, 1);
  const dec31 = new Date(year, 11, 31);

  // Start on the Sunday on or before Jan 1
  const start = new Date(jan1);
  start.setDate(jan1.getDate() - jan1.getDay());

  // End on the Saturday on or after Dec 31
  const end = new Date(dec31);
  end.setDate(dec31.getDate() + (6 - dec31.getDay()));

  const weeks = [];
  const cur   = new Date(start);

  while (cur <= end) {
    const week = [];
    for (let i = 0; i < 7; i++) {
      const ds     = localDateStr(cur);
      const inYear = cur.getFullYear() === year;
      const future = year === currentYear && cur > today;
      week.push({
        date:   ds,
        count:  inYear && !future ? (map[ds] ?? 0) : 0,
        inYear,
        future,
      });
      cur.setDate(cur.getDate() + 1);
    }
    weeks.push(week);
  }
  return weeks;
}

// For each of the 12 months, record the first week-column index that contains
// a day belonging to that year AND that month.
function getMonthCols(weeks) {
  const cols = Array(12).fill(-1);
  weeks.forEach((week, wi) => {
    for (const day of week) {
      if (!day.inYear) continue;
      const m = new Date(day.date + 'T12:00:00').getMonth();
      if (cols[m] < 0) cols[m] = wi;
    }
  });
  return cols;
}

// ── Cache ─────────────────────────────────────────────────────────────────────
const CACHE_KEY = 'gh_cal_v2';
const CACHE_TTL = 6 * 3600 * 1000; // 6 hours

function readCache(year, ignoreExpiry = false) {
  try {
    const raw = localStorage.getItem(`${CACHE_KEY}_${year}`);
    if (!raw) return null;
    const { payload, ts } = JSON.parse(raw);
    if (ignoreExpiry || Date.now() - ts < CACHE_TTL) return payload;
  } catch {}
  return null;
}

function writeCache(year, payload) {
  try {
    localStorage.setItem(
      `${CACHE_KEY}_${year}`,
      JSON.stringify({ payload, ts: Date.now() })
    );
  } catch {}
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div className="animate-pulse space-y-3">
      <div className="flex justify-between items-center">
        <div className="h-5 w-52 rounded bg-[#21262d]" />
        <div className="flex gap-1">
          {[0, 1, 2].map(i => (
            <div key={i} className="h-6 w-12 rounded bg-[#21262d]" />
          ))}
        </div>
      </div>
      <div className="h-28 rounded bg-[#161b22]" />
      <div className="flex justify-between">
        <div className="h-4 w-44 rounded bg-[#21262d]" />
        <div className="h-4 w-32 rounded bg-[#21262d]" />
      </div>
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────
const GitHubCalendar = memo(function GitHubCalendar({ username }) {
  const apiBase     = import.meta.env.VITE_API_URL || '/api';
  const currentYear = new Date().getFullYear();

  const [year,    setYear]    = useState(currentYear);
  const [map,     setMap]     = useState({});
  const [total,   setTotal]   = useState(0);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [tooltip, setTooltip] = useState(null);

  const fetchData = useCallback(async (yr, force = false) => {
    setLoading(true);
    setError(null);

    if (!force) {
      const cached = readCache(yr);
      if (cached) {
        setMap(cached.map);
        setTotal(cached.total);
        setLoading(false);
        return;
      }
    }

    try {
      // Year as path param: /api/github/contributions/:username/:year
      const res = await fetch(
        `${apiBase}/github/contributions/${username}/${yr}`,
        { signal: AbortSignal.timeout(10_000) }
      );
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          const m = buildContribMap(json.data.weeks);
          const t = json.data.total ?? 0;
          writeCache(yr, { map: m, total: t });
          setMap(m);
          setTotal(t);
          setLoading(false);
          return;
        }
      }
    } catch {}

    // Stale-cache fallback (ignore TTL expiry after API failure)
    const stale = readCache(yr, true);
    if (stale) {
      setMap(stale.map);
      setTotal(stale.total);
      setLoading(false);
      return;
    }

    setError('Could not load contribution data.');
    setLoading(false);
  }, [username, apiBase]);

  useEffect(() => { fetchData(year); }, [year, fetchData]);

  const weeks     = useMemo(() => buildGrid(year, map, currentYear), [year, map, currentYear]);
  const monthCols = useMemo(() => getMonthCols(weeks), [weeks]);
  const nWeeks    = weeks.length;

  // ── States ───────────────────────────────────────────────────────────────────

  if (loading) return <Skeleton />;

  if (error) {
    return (
      <div className="text-center py-8 space-y-3">
        <p className="text-sm text-[#7d8590]">{error}</p>
        <button
          onClick={() => fetchData(year, true)}
          className="text-sm text-blue-400 hover:underline"
        >
          Retry
        </button>
      </div>
    );
  }

  // ── Calendar ─────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-3">

      {/* Header: total count + year selector */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <span className="text-base font-semibold text-white">
          {total.toLocaleString()} contributions in {year}
        </span>
        <div className="flex items-center gap-1">
          {[currentYear, currentYear - 1, currentYear - 2].map(y => (
            <button
              key={y}
              onClick={() => setYear(y)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                y === year
                  ? 'bg-blue-600 text-white'
                  : 'text-[#7d8590] hover:bg-[#21262d] hover:text-white'
              }`}
            >
              {y}
            </button>
          ))}
        </div>
      </div>

      {/* Grid (horizontally scrollable on small screens) */}
      <div className="overflow-x-auto">
        <div style={{ minWidth: `${LEFT_COL + 4 + nWeeks * STEP}px` }}>

          {/* Month labels — absolutely positioned so all 12 are always visible */}
          <div
            className="relative mb-1"
            style={{ height: '13px', marginLeft: `${LEFT_COL + 4}px` }}
          >
            {MONTHS.map((label, m) => {
              const col = monthCols[m];
              if (col < 0) return null;
              return (
                <span
                  key={label}
                  className="absolute text-xs text-[#7d8590] select-none whitespace-nowrap"
                  style={{ left: `${col * STEP}px`, top: 0 }}
                >
                  {label}
                </span>
              );
            })}
          </div>

          {/* Day-of-week labels + week columns */}
          <div className="flex">

            {/* Day labels: only Mon, Wed, Fri are shown */}
            <div
              className="flex flex-col shrink-0"
              style={{ width: `${LEFT_COL}px`, gap: `${GAP}px`, marginRight: '4px' }}
            >
              {DAY_LABELS.map((lbl, i) => (
                <div
                  key={i}
                  className="text-xs text-[#7d8590] flex items-center select-none"
                  style={{ height: `${CELL}px` }}
                >
                  {lbl}
                </div>
              ))}
            </div>

            {/* 52–53 week columns */}
            <div className="flex" style={{ gap: `${GAP}px` }}>
              {weeks.map((week, wi) => (
                <div key={wi} className="flex flex-col" style={{ gap: `${GAP}px` }}>
                  {week.map((day, di) => (
                    <div
                      key={di}
                      style={{
                        width:           `${CELL}px`,
                        height:          `${CELL}px`,
                        borderRadius:    '2px',
                        // Overflow days (outside the year) are transparent gaps
                        backgroundColor: day.inYear
                          ? cellColor(day.count)
                          : 'transparent',
                        cursor:          day.inYear && !day.future
                          ? 'pointer'
                          : 'default',
                      }}
                      onMouseEnter={e => {
                        if (!day.inYear || day.future) return;
                        const r = e.currentTarget.getBoundingClientRect();
                        setTooltip({
                          count: day.count,
                          date:  day.date,
                          x:     r.left + CELL / 2,
                          y:     r.top,
                        });
                      }}
                      onMouseLeave={() => setTooltip(null)}
                    />
                  ))}
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>

      {/* Tooltip (portal-like fixed position) */}
      {tooltip && (
        <div
          className="fixed z-50 px-2.5 py-1.5 rounded-md text-xs pointer-events-none shadow-lg whitespace-nowrap"
          style={{
            left:       tooltip.x,
            top:        tooltip.y - 46,
            transform:  'translateX(-50%)',
            background: '#1b1f23',
            border:     '1px solid #30363d',
            color:      '#e6edf3',
          }}
        >
          <strong>
            {tooltip.count === 0
              ? 'No contributions'
              : `${tooltip.count} contribution${tooltip.count !== 1 ? 's' : ''}`}
          </strong>
          {' on '}
          {new Date(tooltip.date + 'T12:00:00').toLocaleDateString('en-US', {
            weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
          })}
        </div>
      )}

      {/* Footer: GitHub link + legend */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <a
          href={`https://github.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-[#7d8590] hover:text-blue-400 transition-colors inline-flex items-center gap-1"
        >
          Learn how we count contributions
          <ExternalLink size={10} />
        </a>
        <div className="flex items-center gap-1 select-none text-xs text-[#7d8590]">
          <span>Less</span>
          {LEGEND.map((c, i) => (
            <div
              key={i}
              style={{
                width:           `${CELL}px`,
                height:          `${CELL}px`,
                borderRadius:    '2px',
                backgroundColor: c,
              }}
            />
          ))}
          <span>More</span>
        </div>
      </div>

    </div>
  );
});

export default GitHubCalendar;
