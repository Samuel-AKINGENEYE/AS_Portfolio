import { useState, useEffect } from 'react';
import { Github, ExternalLink, Star, GitFork, Users } from 'lucide-react';

const GitHubStats = ({ username = 'Samuel-AKINGENEYE' }) => {
  const [stats, setStats] = useState({ repos: 0, followers: 0, following: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`https://api.github.com/users/${username}`);
        const data = await response.json();
        
        if (data && !data.message) {
          setStats({
            repos: data.public_repos || 0,
            followers: data.followers || 0,
            following: data.following || 0,
          });
        } else {
          setError('User not found');
        }
      } catch (err) {
        console.error('Error fetching GitHub stats:', err);
        setError('Failed to load');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [username]);

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-32"></div>
          <div className="grid grid-cols-3 gap-4">
            <div className="h-16 bg-slate-200 dark:bg-slate-700 rounded"></div>
            <div className="h-16 bg-slate-200 dark:bg-slate-700 rounded"></div>
            <div className="h-16 bg-slate-200 dark:bg-slate-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 text-center">
        <p className="text-red-500">Unable to load GitHub stats</p>
        <a href={`https://github.com/${username}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 text-sm mt-2 inline-block">
          View GitHub Profile →
        </a>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
          {username.charAt(0)}
        </div>
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-white">GitHub Activity</h3>
          <p className="text-sm text-slate-500">@{username}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
          <GitFork size={18} className="text-blue-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.repos}</p>
          <p className="text-xs text-slate-500">Repositories</p>
        </div>
        <div className="text-center p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
          <Users size={18} className="text-green-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.followers}</p>
          <p className="text-xs text-slate-500">Followers</p>
        </div>
        <div className="text-center p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
          <Star size={18} className="text-yellow-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.following}</p>
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

export default GitHubStats;
