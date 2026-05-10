import { useState, useEffect } from 'react';
import { Github, ExternalLink, Star, GitFork, Users, Code, Award, Briefcase, GraduationCap, Layers } from 'lucide-react';

const GitHubStats = ({ username = 'Samuel-AKINGENEYE' }) => {
  const [githubStats, setGithubStats] = useState({ repos: 0, followers: 0, following: 0 });
  const [dbStats, setDbStats] = useState({
    projects: 0,
    certificates: 0,
    skills: 0,
    education: 0,
    experience: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const apiBase = import.meta.env.VITE_API_URL || '/api';

  useEffect(() => {
    const fetchAllStats = async () => {
      try {
        // Fetch GitHub stats
        const githubRes = await fetch(`https://api.github.com/users/${username}`);
        const githubData = await githubRes.json();
        
        // Fetch database stats
        const [projectsRes, certificatesRes, skillsRes, educationRes, experienceRes] = await Promise.all([
          fetch(`${apiBase}/projects`),
          fetch(`${apiBase}/certificates`),
          fetch(`${apiBase}/skills`),
          fetch(`${apiBase}/education`),
          fetch(`${apiBase}/experience`)
        ]);
        
        const projects = await projectsRes.json();
        const certificates = await certificatesRes.json();
        const skills = await skillsRes.json();
        const education = await educationRes.json();
        const experience = await experienceRes.json();
        
        if (githubData && !githubData.message) {
          setGithubStats({
            repos: githubData.public_repos || 0,
            followers: githubData.followers || 0,
            following: githubData.following || 0,
          });
        }
        
        setDbStats({
          projects: projects.data?.length || 0,
          certificates: certificates.data?.length || 0,
          skills: skills.data?.length || 0,
          education: education.data?.length || 0,
          experience: experience.data?.length || 0,
        });
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError('Failed to load some stats');
      } finally {
        setLoading(false);
      }
    };
    fetchAllStats();
  }, [username, apiBase]);

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-32"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="h-20 bg-slate-200 dark:bg-slate-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const allStats = [
    { icon: Code, label: 'Repositories', value: githubStats.repos, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { icon: Users, label: 'GitHub Followers', value: githubStats.followers, color: 'text-green-500', bg: 'bg-green-500/10' },
    { icon: Star, label: 'Following', value: githubStats.following, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
    { icon: Layers, label: 'Projects', value: dbStats.projects, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { icon: Award, label: 'Certificates', value: dbStats.certificates, color: 'text-pink-500', bg: 'bg-pink-500/10' },
    { icon: GraduationCap, label: 'Education', value: dbStats.education, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
    { icon: Briefcase, label: 'Experience', value: dbStats.experience, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { icon: GitFork, label: 'Skills', value: dbStats.skills, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
  ];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {allStats.map((stat, index) => (
          <div key={index} className={`p-4 rounded-xl ${stat.bg} border border-slate-200 dark:border-slate-700`}>
            <div className="flex items-center gap-2 mb-2">
              <stat.icon size={16} className={stat.color} />
              <span className="text-xs text-slate-500 dark:text-slate-400">{stat.label}</span>
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* GitHub Profile Link */}
      <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700 text-center">
        <a
          href={`https://github.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-blue-500 hover:text-blue-600 transition-colors"
        >
          <Github size={16} /> View full GitHub profile for contribution graph <ExternalLink size={12} />
        </a>
      </div>
    </div>
  );
};

export default GitHubStats;
