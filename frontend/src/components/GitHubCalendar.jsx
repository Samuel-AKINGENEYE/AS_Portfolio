import { useState, useEffect } from 'react';
import { Github, ExternalLink, ChevronDown } from 'lucide-react';

const GitHubCalendar = ({ username = 'Samuel-AKINGENEYE' }) => {
  const [selectedYear, setSelectedYear] = useState(2026);
  const [weeks, setWeeks] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

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

  // GitHub's official contribution colors
  const getColor = (count) => {
    if (count === 0) return '#ebedf0';
    if (count === 1 || count === 2) return '#9be9a8';
    if (count === 3 || count === 4) return '#40c463';
    if (count === 5 || count === 6) return '#30a14e';
    return '#216e39';
  };

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const years = [2026, 2025, 2024];

  // Calculate month positions for the header
  const getMonthPositions = () => {
    if (!weeks.length) return [];
    const positions = [];
    let currentMonth = -1;
    weeks.forEach((week, weekIndex) => {
      if (week.length > 0 && week[0].date) {
        const month = new Date(week[0].date).getMonth();
        if (month !== currentMonth) {
          positions.push({ month: months[month], weekIndex });
          currentMonth = month;
        }
      }
    });
    return positions;
  };

  const monthPositions = getMonthPositions();

  if (loading) {
    return <div className="bg-white dark:bg-slate-800 rounded-xl p-6 animate-pulse h-48"></div>;
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6">
      {/* Header with contribution count and year selector */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xl font-semibold text-slate-900 dark:text-white">{total}</span>
          <span className="text-slate-600 dark:text-slate-400">contributions in {selectedYear}</span>
        </div>
        <div className="relative">
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            Contribution settings <ChevronDown size={14} />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="overflow-x-auto">
        <div className="min-w-[750px]">
          {/* Month labels */}
          <div className="flex mb-1 text-xs text-slate-500">
            <div className="w-8"></div>
            <div className="flex-1 flex">
              {monthPositions.map((pos, i) => (
                <div 
                  key={i} 
                  className="text-left"
                  style={{ width: `${(pos.weekIndex === 0 ? pos.weekIndex + 1 : pos.weekIndex) * 13}px` }}
                >
                  <span className="ml-1">{pos.month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Day labels and contribution grid */}
          <div className="flex">
            {/* Day labels */}
            <div className="w-8 flex flex-col text-xs text-slate-500">
              <div className="h-3 mb-1">Mon</div>
              <div className="h-3 mb-1"></div>
              <div className="h-3 mb-1">Wed</div>
              <div className="h-3 mb-1"></div>
              <div className="h-3 mb-1">Fri</div>
            </div>

            {/* Contribution weeks */}
            <div className="flex gap-1">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-1">
                  {week.slice(0, 7).map((day, dayIndex) => (
                    <div
                      key={dayIndex}
                      className="w-3 h-3 rounded-sm transition-all hover:ring-1 hover:ring-slate-400"
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

      {/* Footer with legend and GitHub link */}
      <div className="flex justify-between items-center mt-4 text-xs text-slate-500">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span>Learn how we count contributions</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span>Less</span>
          <div className="flex gap-0.5">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#ebedf0' }}></div>
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#9be9a8' }}></div>
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#40c463' }}></div>
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#30a14e' }}></div>
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#216e39' }}></div>
          </div>
          <span>More</span>
        </div>
      </div>

      {/* Footer link */}
      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
        <a 
          href={`https://github.com/${username}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-sm text-blue-500 hover:text-blue-600 flex items-center gap-1"
        >
          <Github size={14} /> View full GitHub profile <ExternalLink size={12} />
        </a>
      </div>
    </div>
  );
};

export default GitHubCalendar;
