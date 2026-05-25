import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  Github, Linkedin, Twitter, Mail, MapPin, Send,
  Code2, Database, Wrench, Globe, ChevronRight, Loader2,
  Home as HomeIcon, Layers, Award, Play, FolderOpen,
} from 'lucide-react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import ProjectCard from '../components/ProjectCard.jsx';
import CertificateCard from '../components/CertificateCard.jsx';
import WhatsAppButton from '../components/WhatsAppButton.jsx';
import Timeline from '../components/Timeline.jsx';
import SkillIcon from '../components/SkillIcon.jsx';
import {
  portfolioApi, analyticsApi, contactApi,
} from '../services/api.js';

const STATIC_SKILLS = [
  { category: 'Frontend', items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'HTML/CSS', 'JavaScript', 'Figma'] },
  { category: 'Backend', items: ['Node.js', 'Express', 'Python', 'Java', 'PHP'] },
  { category: 'Database', items: ['PostgreSQL', 'MongoDB', 'Redis', 'MySQL'] },
  { category: 'Tools', items: ['Git', 'Docker', 'AWS', 'Vercel'] },
];

function getVisitorId() {
  let id = localStorage.getItem('_vid');
  if (!id) {
    id = Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem('_vid', id);
  }
  return id;
}

function RunProfileModal({ profile, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-xl overflow-hidden border border-slate-700/60 bg-[#0d1117] shadow-2xl animate-fade-in"
        onClick={e => e.stopPropagation()}
      >
        {/* Title bar */}
        <div className="flex items-center gap-1.5 px-4 py-2.5 bg-[#161b22] border-b border-slate-700/50">
          <button onClick={onClose} className="w-3 h-3 rounded-full bg-[#ff5f56] hover:opacity-80 transition-opacity" />
          <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
          <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
          <div className="ml-3 flex items-center gap-1.5 font-mono text-[11px] text-slate-400">
            <span className="text-accent">{'> _'}</span>
            <span>user_profile.log</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 font-mono text-sm space-y-6 max-h-[70vh] overflow-y-auto">

          {/* whoami */}
          <div>
            <p className="flex items-center gap-2 text-slate-300 mb-3">
              <span className="text-accent font-bold">→</span>
              <span className="text-[#82aaff]">whoami</span>
            </p>
            <p className="text-slate-400 leading-relaxed pl-4 border-l-2 border-slate-700 text-[13px]">
              {profile?.bio ||
                'A self-taught software engineer from Rwanda who turned curiosity into code. ' +
                'After completing freeCodeCamp\'s full-stack programme and the ALX Africa Pathway, ' +
                'I built real solutions — an AI-powered language tutor used by 300+ learners and ' +
                'a civic engagement platform that reduced local service request time by 40%.'}
            </p>
          </div>

          {/* cat mission.txt */}
          <div>
            <p className="flex items-center gap-2 text-slate-300 mb-3">
              <span className="text-accent font-bold">→</span>
              <span className="text-[#82aaff]">cat </span>
              <span className="text-slate-300">mission.txt</span>
            </p>
            <p className="text-slate-400 leading-relaxed pl-4 border-l-2 border-slate-700 text-[13px]">
              Building real-world solutions that create impact across Africa.
              Currently focused on{' '}
              <span className="text-accent font-semibold">Clean Architecture</span>,{' '}
              <span className="text-accent font-semibold">Real-time Systems</span>, and{' '}
              <span className="text-accent font-semibold">AI Integration</span>.
            </p>
          </div>

          {/* Quick stats */}
          <div>
            <p className="flex items-center gap-2 text-slate-300 mb-3">
              <span className="text-accent font-bold">→</span>
              <span className="text-[#82aaff]">cat </span>
              <span className="text-slate-300">stats.json</span>
            </p>
            <div className="pl-4 border-l-2 border-slate-700 space-y-1 text-[13px]">
              {[
                { k: 'location',  v: profile?.location  || 'Kigali, Rwanda' },
                { k: 'stack',     v: 'MERN · React · Node.js' },
                { k: 'status',    v: profile?.availability || 'Available for work' },
                { k: 'email',     v: profile?.email || 'freshtalent491@gmail.com' },
              ].map(({ k, v }) => (
                <p key={k}>
                  <span className="text-[#ffcb6b]">{k}</span>
                  <span className="text-slate-600 mx-2">:</span>
                  <span className="text-[#c3e88d]">"{v}"</span>
                </p>
              ))}
            </div>
          </div>

          <p className="text-slate-600 text-xs flex items-center gap-2">
            <span className="text-accent">{'>'}</span>
            <span className="animate-blink">█</span>
          </p>
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ title, subtitle, className = '' }) {
  return (
    <div className={`mb-12 reveal ${className}`}>
      <p className="font-mono text-[11px] text-accent/40 dark:text-accent/30 mb-2 tracking-widest select-none">
        {'// '}{title.toLowerCase()}
      </p>
      <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">{title}</h2>
      {subtitle && <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">{subtitle}</p>}
    </div>
  );
}

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [certificates, setCerts] = useState([]);
  const [profile, setProfile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [education, setEducation] = useState([]);
  const [experience, setExperience] = useState([]);
  const [loading, setLoading] = useState(true);
  const [slow, setSlow] = useState(false);
  const [techFilter, setTechFilter] = useState('All');
  const [certFilter, setCertFilter] = useState('All');
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '', honeypot: '' });
  const [sending, setSending] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [visibleLines, setVisibleLines] = useState(0);
  const [isEditorHovered, setIsEditorHovered] = useState(false);

  // Typing animation — slow by default (400 ms/line), fast when hovered (40 ms/line)
  useEffect(() => {
    if (visibleLines >= 12) return;
    const t = setTimeout(() => setVisibleLines(v => v + 1), isEditorHovered ? 40 : 400);
    return () => clearTimeout(t);
  }, [visibleLines, isEditorHovered]);

  useEffect(() => {
    analyticsApi.track({ page: '/', visitorId: getVisitorId() }).catch(() => {});
  }, []);

  useEffect(() => {
    const cached = portfolioApi.getCached();
    if (cached) {
      setProjects(cached.projects ?? []);
      setCerts(cached.certificates ?? []);
      setProfile(cached.profile);
      setSkills(cached.skills ?? []);
      setEducation(cached.education ?? []);
      setExperience(cached.experience ?? []);
      setLoading(false);
    }

    let slowTimer;
    if (!cached) slowTimer = setTimeout(() => setSlow(true), 5000);

    portfolioApi.getAll()
      .then((res) => {
        const data = res.data.data;
        portfolioApi.setCache(data);
        setProjects(data.projects ?? []);
        setCerts(data.certificates ?? []);
        setProfile(data.profile);
        setSkills(data.skills ?? []);
        setEducation(data.education ?? []);
        setExperience(data.experience ?? []);
      })
      .catch(() => {
        if (!cached) toast.error('Failed to load portfolio. Please refresh.');
      })
      .finally(() => {
        clearTimeout(slowTimer);
        setSlow(false);
        if (!cached) setLoading(false);
      });
  }, []);

  // Scroll-reveal: observe all .reveal* elements once loading clears
  useEffect(() => {
    if (loading) return;
    const io = new IntersectionObserver(
      entries => entries.forEach(el => {
        if (el.isIntersecting) { el.target.classList.add('visible'); io.unobserve(el.target); }
      }),
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('.reveal, .reveal-left, .reveal-scale').forEach(el => io.observe(el));
    return () => io.disconnect();
  }, [loading]);

  // Group API skills by category; fall back to STATIC_SKILLS when empty
  const skillsByCategory = skills.reduce((acc, s) => {
    (acc[s.category] = acc[s.category] || []).push(s);
    return acc;
  }, {});
  const hasApiSkills = Object.keys(skillsByCategory).length > 0;

  const allTechs = ['All', ...new Set(projects.flatMap(p => p.techStack || []))].slice(0, 9);
  const filteredProjects = techFilter === 'All' ? projects : projects.filter(p => p.techStack?.includes(techFilter));

  const allCertCategories = ['All', ...new Set(certificates.map(c => c.category).filter(Boolean))];
  const filteredCerts = certFilter === 'All' ? certificates : certificates.filter(c => c.category === certFilter);

  const handleContact = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await contactApi.send({ ...contactForm, visitorId: getVisitorId() });
      toast.success("Message sent! I'll reply soon.");
      setContactForm({ name: '', email: '', subject: '', message: '', honeypot: '' });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to send');
    } finally {
      setSending(false);
    }
  };

  const social = profile?.socialLinks ?? {};


  if (loading) {
    const bootLines = [
      { prefix: '$',  text: 'node portfolio.js',          color: '#58a6ff', delay: 0    },
      { prefix: '⟩',  text: 'Loading environment…',        color: '#8b949e', delay: 0.35 },
      { prefix: '✓',  text: 'ENV configured',              color: '#3fb950', delay: 0.7  },
      { prefix: '⟩',  text: 'Importing modules…',          color: '#8b949e', delay: 1.05 },
      { prefix: '✓',  text: 'React · Express · Tailwind',  color: '#58a6ff', delay: 1.4  },
      { prefix: '⟩',  text: 'Connecting to database…',     color: '#8b949e', delay: 1.7  },
      { prefix: '✓',  text: 'MongoDB connected',           color: '#3fb950', delay: 2.05 },
      { prefix: '⟩',  text: slow ? 'Server warming up, hang tight…' : 'Fetching portfolio data…', color: '#8b949e', delay: 2.35 },
      { prefix: '✓',  text: 'All systems ready',           color: '#f0883e', delay: 2.7  },
    ];
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: '#0d1117' }}>
        <div className="w-full max-w-lg mx-4 sm:mx-auto">
          {/* macOS-style title bar */}
          <div
            className="flex items-center gap-2 px-4 py-3 rounded-t-xl border border-b-0"
            style={{ background: '#161b22', borderColor: '#30363d' }}
          >
            <span className="w-3 h-3 rounded-full" style={{ background: '#ff5f57' }} />
            <span className="w-3 h-3 rounded-full" style={{ background: '#febc2e' }} />
            <span className="w-3 h-3 rounded-full" style={{ background: '#28c840' }} />
            <span className="ml-3 font-mono text-xs" style={{ color: '#8b949e' }}>
              ~/portfolio — zsh
            </span>
          </div>
          {/* Terminal body */}
          <div
            className="px-6 py-5 rounded-b-xl border font-mono text-sm leading-relaxed"
            style={{ background: '#0d1117', borderColor: '#30363d' }}
          >
            {bootLines.map((line, i) => (
              <div
                key={i}
                className="flex items-baseline gap-3 mb-1.5 opacity-0"
                style={{ animation: 'termLine 0.25s ease forwards', animationDelay: `${line.delay}s` }}
              >
                <span className="font-bold shrink-0 w-4 text-center" style={{ color: line.color }}>
                  {line.prefix}
                </span>
                <span style={{ color: '#e6edf3' }}>{line.text}</span>
              </div>
            ))}
            {/* Blinking cursor */}
            <div
              className="flex items-baseline gap-3 mt-2 opacity-0"
              style={{ animation: 'termLine 0.25s ease forwards', animationDelay: '3s' }}
            >
              <span className="font-bold w-4 text-center" style={{ color: '#3fb950' }}>$</span>
              <span
                className="inline-block w-2 h-[1em] align-middle"
                style={{ background: '#3fb950', animation: 'termBlink 1s step-end infinite' }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-300 pb-16 md:pb-0">
      {showProfileModal && (
        <RunProfileModal profile={profile} onClose={() => setShowProfileModal(false)} />
      )}
      <Navbar />
      <WhatsAppButton />

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section id="hero" className="relative min-h-screen flex items-center pt-16 px-4 sm:px-6 bg-white dark:bg-slate-900 transition-colors duration-300 overflow-hidden">
        {/* Dot-grid background */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.35] dark:opacity-[0.12]"
          style={{ backgroundImage: 'radial-gradient(circle, rgba(148,163,184,0.3) 1px, transparent 1px)', backgroundSize: '36px 36px' }}
        />
        {/* Ambient colour blobs */}
        <div className="absolute -top-24 -left-24 w-[480px] h-[480px] bg-accent/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[360px] h-[360px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-6xl mx-auto w-full py-24 lg:py-32">
          <div className="grid lg:grid-cols-[1fr_460px] gap-12 items-start">
            {/* Left — text */}
            <div>
              <p className="font-mono text-xs text-green-600 dark:text-green-400 mb-10 tracking-widest uppercase animate-slide-up">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 mr-2 align-middle" />
                {profile?.availability || 'Available for work'}
              </p>

              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight text-slate-900 dark:text-white mb-6 animate-slide-up-d1">
                I build software<br />
                <span className="text-accent">for the African web.</span>
              </h1>

              <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-3 max-w-xl animate-slide-up-d2">
                {profile?.bio || 'Full-stack engineer based in Kigali, Rwanda — building production tools used by 500+ users across Africa.'}
              </p>

              <p className="font-mono text-sm text-slate-400 dark:text-slate-500 mb-10 animate-slide-up-d3">
                {profile?.location ? `${profile.location} · ` : ''}Node.js · React · MongoDB
              </p>

              <div className="flex flex-wrap gap-3 animate-slide-up-d4">
                <a
                  href="#projects"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent-hover text-white font-medium rounded-md transition-colors text-sm"
                >
                  See my work <ChevronRight size={14} />
                </a>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-500 dark:hover:border-slate-500 font-medium rounded-md transition-colors text-sm"
                >
                  Get in touch
                </a>
              </div>
            </div>

            {/* Right — VS Code editor card */}
            <div className="flex justify-center lg:justify-end animate-slide-right">
              <div className="relative w-full max-w-[460px] animate-float">

                {/* Floating avatar — static, no spin */}
                <div className="absolute -top-5 -right-5 z-10 w-14 h-14 rounded-full border-2 border-dashed border-accent/70 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-accent/40 bg-slate-900 flex items-center justify-center shadow-lg">
                    {profile?.avatar
                      ? <img src={profile.avatar} alt="avatar" className="w-full h-full object-cover" />
                      : <span className="font-mono text-[10px] font-bold text-accent select-none">SA</span>
                    }
                  </div>
                </div>

                {/* Editor window */}
                <div
                  className="rounded-xl overflow-hidden border border-slate-700/60 bg-[#0d1117] shadow-2xl shadow-black/60"
                  onMouseEnter={() => setIsEditorHovered(true)}
                  onMouseLeave={() => setIsEditorHovered(false)}
                >

                  {/* Title bar */}
                  <div className="flex items-center gap-1.5 px-4 py-2.5 bg-[#161b22] border-b border-slate-700/50">
                    <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                    <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                    <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
                    <div className="ml-3 flex items-center gap-2 font-mono text-[11px]">
                      {/* TypeScript + React file-type icon */}
                      <span
                        className="inline-flex items-center justify-center px-1 h-[15px] rounded-sm text-[8px] font-black text-white tracking-tight select-none"
                        style={{ background: 'linear-gradient(135deg, #3178c6 55%, #61dafb 100%)' }}
                      >
                        TSX
                      </span>
                      <span className="text-slate-400">portfolio.tsx</span>
                      <span className="text-slate-600 ml-0.5">×</span>
                    </div>
                  </div>

                  {/* Code — lines reveal one-by-one like live typing */}
                  <div className="px-4 py-4 font-mono text-[11px] leading-[1.8] select-none overflow-x-auto">
                    {[
                      /* 1  */ <span className="text-slate-500">{'// Welcome to my workspace'}</span>,
                      /* 2  */ <span>
                                 <span className="text-[#c792ea]">import </span>
                                 <span className="text-slate-300">{'{ '}</span>
                                 <span className="text-[#82aaff]">Developer</span>
                                 <span className="text-slate-300">{' } '}</span>
                                 <span className="text-[#c792ea]">from </span>
                                 <span className="text-[#c3e88d]">'./universe'</span>
                                 <span className="text-slate-300">;</span>
                               </span>,
                      /* 3  */ <span>&nbsp;</span>,
                      /* 4  */ <span>
                                 <span className="text-[#c792ea]">const </span>
                                 <span className="text-[#82aaff]">Portfolio </span>
                                 <span className="text-slate-300">{'= () '}</span>
                                 <span className="text-[#89ddff]">{'=> '}</span>
                                 <span className="text-slate-300">{'{'}</span>
                               </span>,
                      /* 5  */ <span className="pl-4"><span className="text-[#c792ea]">return </span><span className="text-slate-300">(</span></span>,
                      /* 6  */ <span className="pl-8"><span className="text-[#89ddff]">{'<'}</span><span className="text-[#f07178]">Developer</span></span>,
                      /* 7  */ <span className="pl-12"><span className="text-[#ffcb6b]">name</span><span className="text-slate-300">=</span><span className="text-[#c3e88d]">{`"${profile?.name ?? 'Samuel AKINGENEYE'}"`}</span></span>,
                      /* 8  */ <span className="pl-12"><span className="text-[#ffcb6b]">role</span><span className="text-slate-300">=</span><span className="text-[#c3e88d]">"Junior Software Engineer"</span></span>,
                      /* 9  */ <span className="pl-12"><span className="text-[#ffcb6b]">passion</span><span className="text-slate-300">=</span><span className="text-[#c3e88d]">"Building Real Impact"</span></span>,
                      /* 10 */ <span className="pl-8 text-[#89ddff]">{'/>'}</span>,
                      /* 11 */ <span className="pl-4 text-slate-300">);</span>,
                      /* 12 */ <span className="text-slate-300">{'};'}</span>,
                    ].map((content, i) => (
                      visibleLines > i && (
                        <div key={i} className="flex gap-3 animate-fade-in">
                          <span className="text-slate-600 w-5 text-right shrink-0">{i + 1}</span>
                          {content}
                        </div>
                      )
                    ))}

                    {/* Blinking cursor — thin vertical line, always visible like a real editor */}
                    <div className="flex gap-3">
                      <span className="text-slate-600 w-5 text-right shrink-0 select-none">
                        {visibleLines < 12 ? visibleLines + 1 : 13}
                      </span>
                      <span className="inline-block w-[2px] h-[14px] bg-accent animate-blink rounded-full" />
                    </div>
                  </div>

                  {/* Single button */}
                  <div className="px-4 pb-4 pt-1">
                    <button
                      onClick={() => {
                        setShowProfileModal(true);
                        analyticsApi.track({ page: '/', visitorId: getVisitorId(), event: 'profile_view' }).catch(() => {});
                      }}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-accent hover:bg-accent-hover text-white text-xs font-semibold transition-colors shadow-lg shadow-accent/25"
                    >
                      <Play size={11} className="fill-white" /> Run Profile
                    </button>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Projects ─────────────────────────────────────────────────── */}
      <section id="projects" className="py-16 md:py-24 px-4 sm:px-6 bg-white dark:bg-slate-900">
        <div className="max-w-6xl mx-auto">
          <SectionHeader title="Work" />
          {allTechs.length > 1 && (
            <div className="flex flex-wrap gap-2 justify-center mb-10">
              {allTechs.map(tech => (
                <button
                  key={tech}
                  onClick={() => setTechFilter(tech)}
                  className={`font-mono px-3 py-1 rounded text-xs font-medium transition-colors border ${
                    techFilter === tech
                      ? 'bg-accent text-white border-accent'
                      : 'border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-accent/50 hover:text-accent'
                  }`}
                >
                  {tech}
                </button>
              ))}
            </div>
          )}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredProjects.map((p, i) => (
              <div key={p._id || p.id} className={`reveal reveal-d${(i % 3) + 1}`}>
                <ProjectCard project={p} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stack ────────────────────────────────────────────────────── */}
      <section id="skills" className="py-16 md:py-24 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <SectionHeader title="Stack" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(hasApiSkills
              ? Object.entries(skillsByCategory).map(([cat, items]) => ({
                  category: cat,
                  skills: [...items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).map(s => s.name),
                }))
              : STATIC_SKILLS.map(({ category, items }) => ({ category, skills: items }))
            ).map(({ category, skills }, idx) => {
              const fileSlug = category.toLowerCase().replace(/[^a-z0-9]+/g, '-');
              const varName  = category.replace(/\s+/g, '');
              return (
                <div
                  key={category}
                  className={`reveal reveal-d${Math.min(idx + 1, 4)} rounded-xl overflow-hidden border border-slate-700/60 bg-[#0d1117] shadow-xl hover:border-accent/40 transition-all duration-300`}
                >
                  {/* macOS title bar */}
                  <div className="flex items-center gap-1.5 px-4 py-2.5 bg-[#161b22] border-b border-slate-700/50 min-w-0">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56] shrink-0" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e] shrink-0" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f] shrink-0" />
                    <div className="ml-3 flex items-center gap-1.5 font-mono text-[11px] text-slate-400 min-w-0">
                      <span
                        className="inline-flex items-center justify-center px-1 h-[15px] rounded-sm text-[8px] font-black text-white tracking-tight select-none shrink-0"
                        style={{ background: 'linear-gradient(135deg, #3178c6 55%, #61dafb 100%)' }}
                      >
                        TS
                      </span>
                      <span className="truncate">{fileSlug}.ts</span>
                    </div>
                  </div>

                  {/* Code body */}
                  <div className="px-4 py-4 font-mono text-[12px] leading-[1.85]">
                    {/* L1: const Category = [ */}
                    <div className="flex gap-3">
                      <span className="text-slate-600 w-5 text-right shrink-0 select-none">1</span>
                      <span>
                        <span className="text-[#c792ea]">const </span>
                        <span className="text-[#82aaff]">{varName} </span>
                        <span className="text-slate-400">= [</span>
                      </span>
                    </div>

                    {/* L2+: each skill */}
                    {skills.map((name, si) => (
                      <div key={name} className="flex gap-3 min-w-0">
                        <span className="text-slate-600 w-5 text-right shrink-0 select-none">{si + 2}</span>
                        <span className="pl-4 flex items-center gap-2 min-w-0">
                          <SkillIcon name={name} size={13} className="shrink-0" />
                          <span className="text-[#c3e88d] truncate">"{name}"</span>
                          <span className="text-slate-500 shrink-0">,</span>
                        </span>
                      </div>
                    ))}

                    {/* Last line: ] */}
                    <div className="flex gap-3">
                      <span className="text-slate-600 w-5 text-right shrink-0 select-none">{skills.length + 2}</span>
                      <span className="text-slate-400">];</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Experience ───────────────────────────────────────────────── */}
      <section id="experience" className="py-16 md:py-24 px-4 sm:px-6 bg-white dark:bg-slate-900">
        <div className="max-w-6xl mx-auto">
          <SectionHeader title="Experience" />
          <div className="max-w-3xl mx-auto">
            {experience.length > 0
              ? <Timeline items={experience} type="experience" />
              : <p className="text-center text-slate-500">No experience entries yet.</p>
            }
          </div>
        </div>
      </section>

      {/* ── Education ────────────────────────────────────────────────── */}
      <section id="education" className="py-16 md:py-24 px-4 sm:px-6 bg-slate-50 dark:bg-slate-800/20">
        <div className="max-w-6xl mx-auto">
          <SectionHeader title="Education" />
          <div className="max-w-3xl mx-auto">
            {education.length > 0
              ? <Timeline items={education} type="education" />
              : <p className="text-center text-slate-500">No education entries yet.</p>
            }
          </div>
        </div>
      </section>

      {/* ── Certificates ─────────────────────────────────────────────── */}
      <section id="certificates" className="py-16 md:py-24 px-4 sm:px-6 bg-white dark:bg-slate-900">
        <div className="max-w-6xl mx-auto">
          <SectionHeader title="Certificates" />
          {allCertCategories.length > 1 && (
            <div className="flex flex-wrap gap-2 justify-center mb-10">
              {allCertCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCertFilter(cat)}
                  className={`font-mono px-3 py-1 rounded text-xs font-medium transition-colors border ${
                    certFilter === cat
                      ? 'bg-accent text-white border-accent'
                      : 'border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-accent/50 hover:text-accent'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {filteredCerts.map((cert, i) => (
              <div key={cert._id || cert.id} className={`reveal reveal-d${(i % 3) + 1}`}>
                <CertificateCard certificate={cert} />
              </div>
            ))}
          </div>
          {filteredCerts.length === 0 && (
            <p className="text-center text-slate-500 dark:text-slate-400 py-8">No certificates in this category.</p>
          )}
        </div>
      </section>

      {/* ── Contact ──────────────────────────────────────────────────── */}
      <section id="contact" className="py-16 md:py-24 px-4 sm:px-6 bg-white dark:bg-slate-900">
        <div className="max-w-6xl mx-auto">
          <SectionHeader title="Contact" />
          <div className="grid lg:grid-cols-2 gap-10 md:gap-12 max-w-5xl mx-auto">
            {/* Contact form — terminal mail-compose style */}
            <div className="reveal reveal-d1 rounded-xl overflow-hidden border border-slate-700/60 bg-[#0d1117] shadow-2xl shadow-black/40">

              {/* Tab bar */}
              <div className="flex items-center gap-1.5 px-4 py-2.5 bg-[#161b22] border-b border-slate-700/50">
                <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
                <div className="ml-3 flex items-center gap-2 font-mono text-[11px]">
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-500 text-white">TS</span>
                  <span className="text-slate-400">sendMessage.ts</span>
                  <span className="text-slate-600 ml-1">×</span>
                </div>
              </div>

              {/* Mail header */}
              <div className="px-5 pt-4 pb-3 border-b border-slate-800 font-mono">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="flex items-center gap-2 text-slate-300">
                    <Mail size={12} className="text-accent" />
                    mail.compose
                  </span>
                  <span className="text-slate-600">secure channel</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">
                    to: <span className="text-accent">{profile?.email || 'freshtalent491@gmail.com'}</span>
                  </span>
                  <span className="text-slate-600">response: <span className="text-[#c3e88d]">within 24h</span></span>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleContact} className="p-5 space-y-4">
                <input type="text" tabIndex={-1} autoComplete="off" className="hidden"
                  value={contactForm.honeypot}
                  onChange={e => setContactForm(f => ({ ...f, honeypot: e.target.value }))} />

                {/* Name + Email row */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-[10px] text-slate-500 tracking-widest mb-1.5">NAME</label>
                    <input
                      required placeholder="Your Name"
                      value={contactForm.name}
                      onChange={e => setContactForm(f => ({ ...f, name: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-md bg-[#161b22] border border-slate-700/60 text-slate-300 font-mono text-xs placeholder:text-slate-600 focus:outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/30 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] text-slate-500 tracking-widest mb-1.5">EMAIL</label>
                    <input
                      required type="email" placeholder="your@email.com"
                      value={contactForm.email}
                      onChange={e => setContactForm(f => ({ ...f, email: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-md bg-[#161b22] border border-slate-700/60 text-slate-300 font-mono text-xs placeholder:text-slate-600 focus:outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/30 transition-colors"
                    />
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label className="block font-mono text-[10px] text-slate-500 tracking-widest mb-1.5">SUBJECT</label>
                  <input
                    placeholder="Project inquiry / Collaboration"
                    value={contactForm.subject}
                    onChange={e => setContactForm(f => ({ ...f, subject: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-md bg-[#161b22] border border-slate-700/60 text-slate-300 font-mono text-xs placeholder:text-slate-600 focus:outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/30 transition-colors"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block font-mono text-[10px] text-slate-500 tracking-widest mb-1.5">MESSAGE</label>
                  <textarea
                    required rows={5} placeholder="Tell me about your project, timeline, and goals..."
                    value={contactForm.message}
                    onChange={e => setContactForm(f => ({ ...f, message: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-md bg-[#161b22] border border-slate-700/60 text-slate-300 font-mono text-xs placeholder:text-slate-600 focus:outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/30 transition-colors resize-none"
                  />
                </div>

                {/* Footer comment */}
                <p className="font-mono text-[11px] text-slate-600">
                  {'// Protected by spam filters and rate limits'}
                </p>

                {/* Submit */}
                <button
                  type="submit" disabled={sending}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-md bg-accent hover:bg-accent-hover text-white font-mono font-semibold text-sm tracking-wider transition-colors disabled:opacity-60 shadow-lg shadow-accent/20"
                >
                  {sending
                    ? <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> SENDING...</>
                    : <><Play size={13} className="fill-white" /> SEND MESSAGE</>
                  }
                </button>
              </form>
            </div>

            {/* Connect */}
            <div className="space-y-6 reveal reveal-d2">
              <div>
                <p className="font-mono text-[10px] text-accent/40 tracking-widest uppercase mb-1 select-none">{'// connect'}</p>
                <h3 className="font-display font-semibold text-slate-900 dark:text-white mb-4">Let's work together</h3>

                {/* Terminal-style link rows */}
                <div className="space-y-2">
                  {[
                    social.github   && { href: social.github,   Icon: Github,   label: 'GitHub',          comment: 'view_code',   ext: true  },
                    social.linkedin && { href: social.linkedin, Icon: Linkedin, label: 'LinkedIn',         comment: 'connect',     ext: true  },
                    social.twitter  && { href: social.twitter,  Icon: Twitter,  label: 'Twitter',          comment: 'follow',      ext: true  },
                    profile?.email  && { href: `mailto:${profile.email}`, Icon: Mail, label: profile.email, comment: 'send_mail', ext: false },
                  ].filter(Boolean).map(({ href, Icon, label, comment, ext }) => (
                    <a
                      key={href}
                      href={href}
                      {...(ext ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 hover:border-accent/50 hover:bg-accent/5 group transition-all"
                    >
                      <span className="font-mono text-accent/40 text-xs select-none shrink-0">{'→'}</span>
                      <Icon size={14} className="text-slate-400 dark:text-slate-500 group-hover:text-accent transition-colors shrink-0" />
                      <span className="font-mono text-xs text-slate-700 dark:text-slate-300 group-hover:text-accent transition-colors truncate">{label}</span>
                      <span className="ml-auto font-mono text-[10px] text-slate-300 dark:text-slate-600 shrink-0 pl-2">{'// '}{comment}</span>
                    </a>
                  ))}
                </div>
              </div>

              {profile?.location && (
                <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400 dark:text-slate-500 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <MapPin size={11} className="text-accent/60 shrink-0" />
                  <span>{profile.location}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer profile={profile} />

      {/* ── Mobile bottom navigation ─────────────────────────────────── */}
      <nav className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-around px-1 py-2">
          {[
            { href: '#hero',         Icon: HomeIcon, label: 'Home'    },
            { href: '#projects',     Icon: Layers,   label: 'Work'    },
            { href: '#certificates', Icon: Award,    label: 'Certs'   },
            { href: '#contact',      Icon: Mail,     label: 'Contact' },
          ].map(({ href, Icon, label }) => (
            <a
              key={label}
              href={href}
              className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 active:scale-95 transition-all"
            >
              <Icon size={20} />
              <span className="text-[10px] font-medium">{label}</span>
            </a>
          ))}
        </div>
      </nav>
    </div>
  );
}
