import { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { ExternalLink } from 'lucide-react';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];
const LEGEND = ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'];

const CELL = 10;
const GAP = 2;
const STEP = CELL + GAP;
const LEFT_COL = 28;

function cellColor(count) {
  if (count <= 0) return '#161b22';
  if (count === 1) return '#0e4429';
  if (count === 2) return '#006d32';
  if (count === 3) return '#26a641';
  return '#39d353';
}

function localDateStr(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
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

// FIXED: Build grid with proper Monday start alignment
function buildGrid(year, map, currentYear) {
  const today = new Date();
  today.setHours(23, 59, 59, 999);

  const jan1 = new Date(year, 0, 1);
  const dec31 = new Date(year, 11, 31);

  // Start on the Monday on or before Jan 1 (GitHub style)
  const start = new Date(jan1);
  const dayOfWeek = start.getDay();
  const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  start.setDate(jan1.getDate() - daysToMonday);

  // End on the Sunday on or after Dec 31
  const end = new Date(dec31);
  const endDayOfWeek = end.getDay();
  const daysToSunday = endDayOfWeek === 0 ? 0 : 7 - endDayOfWeek;
  end.setDate(dec31.getDate() + daysToSunday);

  const weeks = [];
  const cur = new Date(start);

  while (cur <= end) {
    const week = [];
    for (let i = 0; i < 7; i++) {
      const ds = localDateStr(cur);
      const inYear = cur.getFullYear() === year;
      const future = year === currentYear && cur > today;
      week.push({
        date: ds,
        count: inYear && !future ? (map[ds] ?? 0) : 0,
        inYear,
        future,
      });
      cur.setDate(cur.getDate() + 1);
    }
    weeks.push(week);
  }
  return weeks;
}

// FIXED: Get month positions based on the FIRST DAY of each month
function getMonthPositions(weeks) {
  const positions = [];
  for (let month = 0; month < 12; month++) {
    // Find first week that contains the first day of this month
    const firstDayOfMonth = new Date(weeks[0]?.[0]?.date);
    firstDayOfMonth.setMonth(month);
    firstDayOfMonth.setDate(1);
    
    let foundWeekIndex = -1;
    for (let wi = 0; wi < weeks.length; wi++) {
      const week = weeks[wi];
      for (const day of week) {
        if (day.date === localDateStr(firstDayOfMonth)) {
          foundWeekIndex = wi;
          break;
        }
      }
      if (foundWeekIndex !== -1) break;
    }
    
    if (foundWeekIndex !== -1) {
      positions.push({ month: MONTHS[month], weekIndex: foundWeekIndex });
    }
  }
  return positions;
}

const CACHE_KEY = 'gh_cal_v2';
const CACHE_TTL = 6 * 3600 * 1000;

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
    localStorage.setItem(`${CACHE_KEY}_${year}`, JSON.stringify({ payload, ts: Date.now() }));
  } catch {}
}

function Skeleton() {
  return (
    <div className="animate-pulse space-y-3">
      <div className="flex justify-between items-center">
        <div className="h-5 w-52 rounded bg-[#21262d]" />
        <div className="flex gap-1">
          {[0, 1, 2].map(i => <div key={i} className="h-6 w-12 rounded bg-[#21262d]" />)}
        </div>
      </div>
      <div className="h-28 rounded bg-[#161b22]" />
    </div>
  );
}

const GitHubCalendar = memo(function GitHubCalendar({ username }) {
  const apiBase = import.meta.env.VITE_API_URL || '/api';
  const currentYear = new Date().getFullYear();

  const [year, setYear] = useState(currentYear);
  const [map, setMap] = useState({});
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
      const res = await fetch(`${apiBase}/github/contributions/${username}/${yr}`, {
        signal: AbortSignal.timeout(10000)
      });
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

  const weeks = useMemo(() => buildGrid(year, map, currentYear), [year, map, currentYear]);
  const monthPositions = useMemo(() => getMonthPositions(weeks), [weeks]);

  if (loading) return <Skeleton />;

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-[#7d8590]">{error}</p>
        <button onClick={() => fetchData(year, true)} className="text-sm text-blue-400 mt-2">Retry</button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Header */}
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
                y === year ? 'bg-blue-600 text-white' : 'text-[#7d8590] hover:bg-[#21262d] hover:text-white'
              }`}
            >
              {y}
            </button>
          ))}
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="overflow-x-auto">
        <div style={{ minWidth: `${LEFT_COL + 4 + weeks.length * STEP}px` }}>
          {/* Month Labels - FIXED POSITIONING */}
          <div className="relative mb-1" style={{ height: '13px', marginLeft: `${LEFT_COL + 4}px` }}>
            {monthPositions.map(({ month, weekIndex }) => (
              <span
                key={month}
                className="absolute text-xs text-[#7d8590] select-none whitespace-nowrap"
                style={{ left: `${weekIndex * STEP}px`, top: 0 }}
              >
                {month}
              </span>
            ))}
          </div>

          {/* Day labels + weeks */}
          <div className="flex">
            <div className="flex flex-col shrink-0" style={{ width: `${LEFT_COL}px`, gap: `${GAP}px`, marginRight: '4px' }}>
              {DAY_LABELS.map((lbl, i) => (
                <div key={i} className="text-xs text-[#7d8590] flex items-center" style={{ height: `${CELL}px` }}>
                  {lbl}
                </div>
              ))}
            </div>

            <div className="flex" style={{ gap: `${GAP}px` }}>
              {weeks.map((week, wi) => (
                <div key={wi} className="flex flex-col" style={{ gap: `${GAP}px` }}>
                  {week.map((day, di) => (
                    <div
                      key={di}
                      style={{
                        width: `${CELL}px`,
                        height: `${CELL}px`,
                        borderRadius: '2px',
                        backgroundColor: day.inYear ? cellColor(day.count) : 'transparent',
                        cursor: day.inYear && !day.future ? 'pointer' : 'default',
                      }}
                      onMouseEnter={e => {
                        if (!day.inYear || day.future) return;
                        const r = e.currentTarget.getBoundingClientRect();
                        setTooltip({ count: day.count, date: day.date, x: r.left + CELL / 2, y: r.top });
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

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 px-2.5 py-1.5 rounded-md text-xs pointer-events-none shadow-lg whitespace-nowrap"
          style={{
            left: tooltip.x,
            top: tooltip.y - 46,
            transform: 'translateX(-50%)',
            background: '#1b1f23',
            border: '1px solid #30363d',
            color: '#e6edf3',
          }}
        >
          <strong>{tooltip.count === 0 ? 'No contributions' : `${tooltip.count} contribution${tooltip.count !== 1 ? 's' : ''}`}</strong>
          {' on '}
          {new Date(tooltip.date + 'T12:00:00').toLocaleDateString('en-US', {
            weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
          })}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <a href={`https://github.com/${username}`} target="_blank" rel="noopener noreferrer" className="text-xs text-[#7d8590] hover:text-blue-400 inline-flex items-center gap-1">
          Learn how we count contributions <ExternalLink size={10} />
        </a>
        <div className="flex items-center gap-1 text-xs text-[#7d8590]">
          <span>Less</span>
          {LEGEND.map((c, i) => (
            <div key={i} style={{ width: `${CELL}px`, height: `${CELL}px`, borderRadius: '2px', backgroundColor: c }} />
          ))}
          <span>More</span>
        </div>
      </div>
    </div>
  );
});

export default GitHubCalendar;
