import { useState, useEffect } from 'react';
import { Github, ExternalLink } from 'lucide-react';

const GitHubCalendar = ({ username = 'Samuel-AKINGENEYE' }) => {
  const [stats, setStats] = useState({ repos: 0, followers: 0, following: 0, name: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Use the full Render backend URL directly (no relative path)
  const BACKEND_URL = 'https://samuel-ak-portfolio-api.onrender.com';

  useEffect(() => {
    const fetchGitHubData = async () => {
      setLoading(true);
      try {
        const url = `${BACKEND_URL}/api/github-proxy/user/${username}`;
        console.log('Fetching GitHub data from:', url);
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.success) {
          setStats(data.data);
        } else {
          setError(data.error || 'Failed to load data');
        }
      } catch (err) {
        console.error('GitHub fetch error:', err);
        setError('Cannot connect to server');
      } finally {
        setLoading(false);
      }
    };
    
    fetchGitHubData();
  }, [username]);

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
        <div className="animate-pulse space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700"></div>
            <div className="flex-1">
              <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
              <div className="h-3 w-24 bg-slate-200 dark:bg-slate-700 rounded"></div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="h-20 bg-slate-200 dark:bg-slate-700 rounded"></div>
            <div className="h-20 bg-slate-200 dark:bg-slate-700 rounded"></div>
            <div className="h-20 bg-slate-200 dark:bg-slate-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 text-center">
        <p className="text-red-500 mb-2">Unable to load GitHub data</p>
        <p className="text-xs text-slate-500 mb-3">{error}</p>
        <a href={`https://github.com/${username}`} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:text-blue-600 inline-flex items-center gap-1">
          <Github size={14} /> View on GitHub <ExternalLink size={12} />
        </a>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl">
          {stats.name ? stats.name.charAt(0) : 'S'}
        </div>
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-white">{stats.name || username}</h3>
          {stats.location && <p className="text-xs text-slate-500">{stats.location}</p>}
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
          <p className="text-2xl font-bold text-blue-500">{stats.public_repos}</p>
          <p className="text-xs text-slate-500">Repositories</p>
        </div>
        <div className="text-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
          <p className="text-2xl font-bold text-green-500">{stats.followers}</p>
          <p className="text-xs text-slate-500">Followers</p>
        </div>
        <div className="text-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
          <p className="text-2xl font-bold text-purple-500">{stats.following}</p>
          <p className="text-xs text-slate-500">Following</p>
        </div>
      </div>
      
      <a 
        href={`https://github.com/${username}`} 
        target="_blank" 
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-sm text-blue-500 hover:text-blue-600 transition-colors"
      >
        <Github size={16} /> View full GitHub profile <ExternalLink size={12} />
      </a>
    </div>
  );
};

export default GitHubCalendar;
