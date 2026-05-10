import { useState, useEffect } from 'react';
import { Github, ExternalLink } from 'lucide-react';

const GitHubCalendar = ({ username = 'Samuel-AKINGENEYE' }) => {
  const [selectedYear, setSelectedYear] = useState(2025);
  const [weeks, setWeeks] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://github-contributions-api.jogruber.vercel.app/${username}?y=${selectedYear}`);
        const data = await response.json();
        
        if (data && data.contributions) {
          const weeksData = [];
          let currentWeek = [];
          let totalCount = 0;
          
          for (const day of data.contributions) {
            totalCount += day.count || 0;
            currentWeek.push({ date: day.date, count: day.count || 0 });
            if (currentWeek.length === 7) {
              weeksData.push([...currentWeek]);
              currentWeek = [];
            }
          }
          if (currentWeek.length > 0) weeksData.push(currentWeek);
          setWeeks(weeksData);
          setTotal(totalCount);
        }
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedYear, username]);

  const getColor = (count) => {
    if (count === 0) return '#ebedf0';
    if (count === 1) return '#9be9a8';
    if (count <= 3) return '#40c463';
    if (count <= 5) return '#30a14e';
    return '#0e4429';
  };

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const years = [2022, 2023, 2024, 2025, 2026];

  if (loading) {
    return <div className="bg-white dark:bg-slate-800 rounded-xl p-6 animate-pulse h-64"></div>;
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
      <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
        <div>
          <span className="text-2xl font-bold text-slate-900 dark:text-white">{total}</span>
          <span className="text-slate-500 dark:text-slate-400 ml-2">contributions in {selectedYear}</span>
        </div>
        <div className="flex gap-1">
          {years.map(year => (
            <button key={year} onClick={() => setSelectedYear(year)} className={`px-3 py-1 rounded-md text-sm transition-all ${selectedYear === year ? 'bg-blue-500 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
              {year}
            </button>
          ))}
        </div>
      </div>
      
      {total === 0 ? (
        <div className="text-center py-8 text-slate-500">No contribution data available for {selectedYear}</div>
      ) : (
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            <div className="flex ml-8 mb-2">
              {months.map(month => <div key={month} className="text-xs text-slate-400 w-14 text-center">{month}</div>)}
            </div>
            <div className="flex gap-1">
              <div className="flex flex-col gap-1 w-12">
                <div className="h-3 text-[10px] text-slate-400 text-right">Mon</div>
                <div className="h-3 text-[10px] text-slate-400 text-right">Wed</div>
                <div className="h-3 text-[10px] text-slate-400 text-right">Fri</div>
              </div>
              <div className="flex gap-1">
                {weeks.map((week, wi) => (
                  <div key={wi} className="flex flex-col gap-1">
                    {week.map((day, di) => (
                      <div key={di} className="w-3 h-3 rounded-sm transition-transform hover:scale-125 cursor-help" style={{ backgroundColor: getColor(day.count) }} title={`${day.count} contribution${day.count !== 1 ? 's' : ''} on ${day.date}`} />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
        <a href={`https://github.com/${username}`} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:text-blue-600 flex items-center gap-1">
          <Github size={14} /> View full GitHub profile <ExternalLink size={12} />
        </a>
        <div className="flex items-center gap-1 text-xs text-slate-500">
          <span>Less</span>
          <div className="flex gap-0.5">
            <div className="w-3 h-3 rounded-sm bg-[#ebedf0]"></div>
            <div className="w-3 h-3 rounded-sm bg-[#9be9a8]"></div>
            <div className="w-3 h-3 rounded-sm bg-[#40c463]"></div>
            <div className="w-3 h-3 rounded-sm bg-[#30a14e]"></div>
            <div className="w-3 h-3 rounded-sm bg-[#0e4429]"></div>
          </div>
          <span>More</span>
        </div>
      </div>
    </div>
  );
};

export default GitHubCalendar;
