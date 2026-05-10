import { useState, useEffect } from 'react';
import { Github, ExternalLink, GitCommit, GitPullRequest, AlertCircle, Calendar } from 'lucide-react';

const GitHubPresence = ({ username = 'Samuel-AKINGENEYE' }) => {
  const [stats, setStats] = useState({
    contributions: 0,
    commits: 0,
    pullRequests: 0,
    issues: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGitHubData = async () => {
      try {
        // Fetch user events
        const eventsRes = await fetch(`https://api.github.com/users/${username}/events?per_page=100`);
        
        if (!eventsRes.ok) {
          throw new Error(`GitHub API returned ${eventsRes.status}`);
        }
        
        const events = await eventsRes.json();
        
        if (Array.isArray(events) && events.length > 0) {
          let commits = 0;
          let pullRequests = 0;
          let issues = 0;
          const currentYear = new Date().getFullYear();
          
          events.forEach(event => {
            const eventYear = new Date(event.created_at).getFullYear();
            if (eventYear === currentYear) {
              if (event.type === 'PushEvent') {
                commits += event.payload?.commits?.length || 1;
              }
              if (event.type === 'PullRequestEvent' && event.payload?.action === 'opened') {
                pullRequests++;
              }
              if (event.type === 'IssuesEvent' && event.payload?.action === 'opened') {
                issues++;
              }
            }
          });
          
          // Try to get contributions count
          let contributions = commits;
          try {
            const contribRes = await fetch(`https://github-contributions-api.jogruber.vercel.app/${username}?y=${currentYear}`);
            if (contribRes.ok) {
              const contribData = await contribRes.json();
              contributions = contribData?.total || commits;
            }
          } catch (err) {
            console.log('Contributions API failed, using commit count');
          }
          
          setStats({ contributions, commits, pullRequests, issues });
        } else {
          // No events found, show placeholder
          setStats({ contributions: 0, commits: 0, pullRequests: 0, issues: 0 });
        }
      } catch (err) {
        console.error('Error fetching GitHub data:', err);
        setError('Unable to load GitHub data');
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
            <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
            <div className="h-5 w-32 bg-slate-200 dark:bg-slate-700 rounded"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1,2,3,4].map(i => (
              <div key={i} className="h-24 bg-slate-200 dark:bg-slate-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 text-center">
        <p className="text-red-500 mb-2">{error}</p>
        <p className="text-sm text-slate-500 mb-3">GitHub API may be rate-limited</p>
        <a href={`https://github.com/${username}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-blue-500 text-sm">
          <Github size={16} /> View GitHub Profile →
        </a>
      </div>
    );
  }

  const statCards = [
    { icon: Calendar, label: 'Contributions', value: stats.contributions, color: 'text-green-500', bg: 'bg-green-500/10' },
    { icon: GitCommit, label: 'Commits', value: stats.commits, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { icon: GitPullRequest, label: 'Pull Requests', value: stats.pullRequests, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { icon: AlertCircle, label: 'Issues', value: stats.issues, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  ];

  const totalActivities = stats.commits + stats.pullRequests + stats.issues;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
          {username.charAt(0)}
        </div>
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-white">GitHub Presence</h3>
          <p className="text-sm text-slate-500">{totalActivities} activities in {new Date().getFullYear()}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <div key={index} className={`p-4 rounded-xl ${stat.bg} border border-slate-200 dark:border-slate-700`}>
            <div className="flex items-center gap-2 mb-2">
              <stat.icon size={16} className={stat.color} />
              <span className="text-xs text-slate-500 dark:text-slate-400">{stat.label}</span>
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value.toLocaleString()}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700 text-center">
        <a
          href={`https://github.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-blue-500 hover:text-blue-600 transition-colors"
        >
          <Github size={16} /> View full GitHub profile for detailed contribution graph <ExternalLink size={12} />
        </a>
      </div>
    </div>
  );
};

export default GitHubPresence;
