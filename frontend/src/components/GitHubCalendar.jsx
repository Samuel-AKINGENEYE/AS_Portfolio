import { useState, useEffect } from 'react';

const GitHubCalendar = ({ username = 'Samuel-AKINGENEYE' }) => {
  const [year, setYear] = useState(2025);
  const [total, setTotal] = useState(0);
  const [weeks, setWeeks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`https://samuel-ak-portfolio-api.onrender.com/api/github/contributions/${username}/${year}`)
      .then(res => res.json())
      .then(result => {
        if (result.success && result.data) {
          setTotal(result.data.total);
          setWeeks(result.data.weeks || []);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [year, username]);

  const getColor = (count) => {
    if (count === 0) return '#ebedf0';
    if (count <= 2) return '#c6e48b';
    if (count <= 4) return '#7bc96f';
    if (count <= 6) return '#239a3b';
    return '#196127';
  };

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const years = [2022, 2023, 2024, 2025, 2026];

  if (loading) {
    return <div className="bg-white dark:bg-slate-800 rounded-xl p-6 text-center">Loading...</div>;
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6">
      <div className="flex justify-between items-center flex-wrap gap-3 mb-4">
        <div>
          <span className="text-2xl font-bold">{total}</span>
          <span className="text-gray-500 ml-2">contributions in {year}</span>
        </div>
        <div className="flex gap-2">
          {years.map(y => (
            <button key={y} onClick={() => setYear(y)} className={`px-3 py-1 rounded text-sm ${y === year ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>
              {y}
            </button>
          ))}
        </div>
      </div>
      <div className="overflow-x-auto">
        <div className="min-w-[750px]">
          <div className="flex ml-8 mb-2">
            {months.map(m => <div key={m} className="text-xs text-gray-400 w-14 text-center">{m}</div>)}
          </div>
          <div className="flex gap-1">
            <div className="flex flex-col gap-1 w-12">
              <div className="h-3 text-[10px] text-gray-400">Mon</div>
              <div className="h-3 text-[10px] text-gray-400">Wed</div>
              <div className="h-3 text-[10px] text-gray-400">Fri</div>
            </div>
            <div className="flex gap-1">
              {weeks.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-1">
                  {week.map((day, di) => (
                    <div key={di} className="w-3 h-3 rounded-sm" style={{ backgroundColor: getColor(day.count) }} title={`${day.count} on ${day.date}`} />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 text-center">
        <a href={`https://github.com/${username}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 text-sm">View GitHub Profile →</a>
      </div>
    </div>
  );
};

export default GitHubCalendar;
