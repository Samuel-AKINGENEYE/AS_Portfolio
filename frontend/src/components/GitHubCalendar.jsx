import { useState, useEffect } from 'react';
import { Github, ExternalLink } from 'lucide-react';

const GitHubCalendar = ({ username = 'Samuel-AKINGENEYE' }) => {
  const [selectedYear, setSelectedYear] = useState(2026);
  const [weeks, setWeeks] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://samuel-ak-portfolio-api.onrender.com/api/github/contributions/${username}/${selectedYear}`);
        const data = await response.json();
        if (data.success && data.data) {
          setWeeks(data.data.weeks || []);
          setTotal(data.data.total || 0);
        }
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedYear, username]);

  // Same colors as GitHub
  const getColor = (count) => {
    if (count === 0) return '#161b22';      // Dark mode empty cell
    if (count === 1) return '#0e4429';
    if (count === 2) return '#006d32';
    if (count === 3) return '#26a641';
    return '#39d353';
  };

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const years = [2026, 2025, 2024];
  const days = ['Mon', 'Wed', 'Fri'];

  if (loading) {
    return <div className="p-4"><div className="animate-pulse h-32 bg-slate-200 dark:bg-slate-700 rounded"></div></div>;
  }

  return (
    <div className="p-4">
      {/* Header with year selector */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-2xl font-bold text-slate-900 dark:text-white">{total}</div>
        <div className="flex gap-4">
          {years.map(year => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={`text-sm ${selectedYear === year ? 'text-blue-500 font-semibold' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
              {year}
            </button>
          ))}
          <span className="text-slate-400 text-sm">▼</span>
        </div>
      </div>

      {/* Calendar grid */}
      <div className="overflow-x-auto">
        <div className="min-w-[650px]">
          {/* Month labels row */}
          <div className="flex mb-1 ml-7">
            {months.map(month => (
              <div key={month} className="text-xs text-slate-500 w-10 text-center">{month}</div>
            ))}
          </div>

          {/* Day labels + contribution cells */}
          <div className="flex">
            {/* Day labels column */}
            <div className="flex flex-col justify-between text-xs text-slate-500 pr-2 py-0.5">
              {days.map(day => (
                <div key={day} className="h-3 mb-1">{day}</div>
              ))}
            </div>

            {/* Contribution cells */}
            <div className="flex gap-1">
              {weeks.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-1">
                  {week.slice(0, 7).map((day, di) => (
                    <div
                      key={di}
                      className="w-3 h-3 rounded-sm"
                      style={{ backgroundColor: getColor(day.count) }}
                      title={`${day.count} contributions on ${day.date}`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center mt-4 text-xs">
        <span className="text-slate-500">Learn how we count contributions</span>
        <div className="flex items-center gap-2">
          <span className="text-slate-500">Less</span>
          <div className="flex gap-0.5">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#161b22' }}></div>
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#0e4429' }}></div>
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#006d32' }}></div>
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#26a641' }}></div>
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#39d353' }}></div>
          </div>
          <span className="text-slate-500">More</span>
        </div>
      </div>

      {/* GitHub link */}
      <div className="mt-4">
        <a href={`https://github.com/${username}`} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline">
          View full GitHub profile →
        </a>
      </div>
    </div>
  );
};

export default GitHubCalendar;
