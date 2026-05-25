import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import {
  Github, Linkedin, Twitter, Mail, MapPin, Calendar,
  Briefcase, Code2, Database, Wrench, Globe,
  Star, StarHalf, MessageSquare, ChevronRight,
  ArrowDown, Send, Award, Eye, ChevronDown, ChevronUp, Download, X, FileText,
  Play, FolderOpen, GitCommit, GraduationCap,
} from 'lucide-react';

import Navbar           from '../components/Navbar.jsx';
import Footer           from '../components/Footer.jsx';
import ProjectCard      from '../components/ProjectCard.jsx';
import CertificateCard  from '../components/CertificateCard.jsx';
import GitHubCalendar   from '../components/GitHubCalendar.jsx';
import { SkillIcon }    from '../components/SkillIcon.jsx';
import { projectsApi, certificatesApi, profileApi, contactApi, experienceApi, educationApi } from '../services/api.js';

// ─── Static skill data (used as display source; SVG icons come from SkillIcon) ─

const SKILLS = {
  Frontend: {
    icon: Globe,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'JavaScript', 'HTML/CSS'],
  },
  Backend: {
    icon: Code2,
    color: 'text-green-500',
    bg: 'bg-green-500/10',
    items: ['Node.js', 'Express', 'Python', 'Java', 'PHP'],
  },
  Database: {
    icon: Database,
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
    items: ['PostgreSQL', 'MongoDB', 'Redis', 'MySQL'],
  },
  Tools: {
    icon: Wrench,
    color: 'text-orange-500',
    bg: 'bg-orange-500/10',
    items: ['Git', 'Docker', 'AWS', 'Figma', 'Linux'],
  },
};

const SKILL_PAGE = 8; // max visible per category before "Show all"

const TESTIMONIALS = [
  {
    feedback: 'Samuel helped us launch a strong MVP in under a month with exceptional product focus and polish.',
    author: 'Amina Kayitesi',
    role: 'Founder, Kivu Labs',
    rating: 5,
  },
  {
    feedback: 'The product interface is clean, performant, and easy to maintain — the team loves working with him.',
    author: 'Jean Mukamana',
    role: 'Product Lead, Kigali Finance',
    rating: 4.8,
  },
  {
    feedback: 'Reliable, detail-oriented, and responsive — Samuel consistently delivered quality code and strong communication.',
    author: 'Emily S.',
    role: 'CTO, LearnHub Rwanda',
    rating: 5,
  },
];

const CERT_CATEGORIES = ['All', 'AI/ML', 'Web Dev', 'Cybersecurity', 'Other'];
const PAGE_SIZE = 6; // default visible items for projects & certs

// ─── Sub-components ───────────────────────────────────────────────────────────

function ResumeModal({ onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl h-[90vh] bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium text-sm">
            <FileText size={16} className="text-blue-500" />
            Samuel AKINGENEYE — Resume
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/resume.pdf"
              download="Samuel_AKINGENEYE_Resume.pdf"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium transition-colors"
            >
              <Download size={13} /> Download
            </a>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* PDF viewer */}
        <iframe
          src="/resume.pdf#toolbar=0"
          title="Resume Preview"
          className="flex-1 w-full border-0"
        />
      </div>
    </div>
  );
}

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => {
        const full = i < Math.floor(rating);
        const half = !full && rating - Math.floor(rating) >= 0.5 && i === Math.floor(rating);
        if (full) return <Star key={i} size={13} className="text-yellow-400 fill-yellow-400" />;
        if (half) return <StarHalf key={i} size={13} className="text-yellow-400 fill-yellow-400" />;
        return <Star key={i} size={13} className="text-slate-300 dark:text-slate-600" />;
      })}
      <span className="text-xs text-slate-400 ml-1">{rating}/5</span>
    </div>
  );
}

function Section({ id, children, className = '' }) {
  return (
    <section id={id} className={`section ${className}`}>
      <div className="container-max">{children}</div>
    </section>
  );
}

function SectionHead({ title, sub }) {
  return (
    <div className="text-center mb-14">
      <h2 className="section-title">{title}</h2>
      {sub && <p className="section-sub">{sub}</p>}
    </div>
  );
}

// Shimmer skeleton cards
function SkeletonCard({ height = 'h-72' }) {
  return <div className={`${height} rounded-2xl skeleton-shimmer`} />;
}

function SkeletonGrid({ count = 3, height = 'h-72' }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: count }, (_, i) => (
        <SkeletonCard key={i} height={height} />
      ))}
    </div>
  );
}

// "View All / Show Less" toggle button
function ViewAllButton({ showAll, total, visible, onToggle, noun = 'items' }) {
  if (total <= visible) return null;
  return (
    <div className="flex justify-center mt-10">
      <button
        onClick={onToggle}
        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-400 hover:border-blue-500 hover:text-blue-500 dark:hover:border-blue-400 dark:hover:text-blue-400 transition-all"
      >
        {showAll ? (
          <><ChevronUp size={15} /> Show Less</>
        ) : (
          <><Eye size={15} /> View All {total} {noun}</>
        )}
      </button>
    </div>
  );
}

// Contact form
function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await contactApi.send(form);
      toast.success(res.data?.message || "Message sent! I'll get back to you soon.");
      setForm({ name: '', email: '', message: '' });
    } catch {
      toast.error('Failed to send message. Please try again or email me directly.');
    } finally {
      setSending(false);
    }
  };

  const inputClass =
    'w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 ' +
    'bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm ' +
    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ' +
    'placeholder:text-slate-400 transition-colors';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        required type="text" placeholder="Your name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className={inputClass}
      />
      <input
        required type="email" placeholder="your@email.com"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        className={inputClass}
      />
      <textarea
        required rows={5} placeholder="Your message…"
        value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
        className={`${inputClass} resize-none`}
      />
      <button
        type="submit" disabled={sending}
        className="w-full py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-medium text-sm transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
      >
        {sending
          ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          : <><Send size={15} /> Send Message</>
        }
      </button>
    </form>
  );
}

// ── Coder-themed terminal loading screen ──────────────────────────────────────

const BOOT_LINES = [
  { prefix: '$',  text: 'node portfolio.js',              color: '#58a6ff', delay: 0    },
  { prefix: '⟩',  text: 'Loading environment…',           color: '#8b949e', delay: 0.35 },
  { prefix: '✓',  text: 'ENV configured',                 color: '#3fb950', delay: 0.7  },
  { prefix: '⟩',  text: 'Importing modules…',             color: '#8b949e', delay: 1.05 },
  { prefix: '✓',  text: 'React · Express · Tailwind',     color: '#58a6ff', delay: 1.4  },
  { prefix: '⟩',  text: 'Connecting to database…',        color: '#8b949e', delay: 1.7  },
  { prefix: '✓',  text: 'MongoDB connected',              color: '#3fb950', delay: 2.05 },
  { prefix: '⟩',  text: 'Fetching portfolio data…',       color: '#8b949e', delay: 2.35 },
  { prefix: '✓',  text: 'All systems ready',              color: '#f0883e', delay: 2.7  },
];

function LoadingScreen() {
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
          {BOOT_LINES.map((line, i) => (
            <div
              key={i}
              className="flex items-baseline gap-3 mb-1.5 opacity-0"
              style={{
                animation: 'termLine 0.25s ease forwards',
                animationDelay: `${line.delay}s`,
              }}
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
            style={{
              animation: 'termLine 0.25s ease forwards',
              animationDelay: '3s',
            }}
          >
            <span className="font-bold w-4 text-center" style={{ color: '#3fb950' }}>$</span>
            <span
              className="inline-block w-2 h-4 align-middle"
              style={{ background: '#3fb950', animation: 'blink 1s step-end infinite' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function Home() {
  const [projects,      setProjects]      = useState([]);
  const [certificates,  setCertificates]  = useState([]);
  const [experience,    setExperience]    = useState([]);
  const [education,     setEducation]     = useState([]);
  const [profile,       setProfile]       = useState(null);
  const [certFilter,    setCertFilter]    = useState('All');
  const [loading,       setLoading]       = useState(true);
  const [showResume,    setShowResume]    = useState(false);

  // Pagination state
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [showAllCerts,    setShowAllCerts]    = useState(false);
  // Per-category skill expansion (keyed by category name)
  const [expandedSkills, setExpandedSkills] = useState({});

  useEffect(() => {
    const load = async () => {
      const [projRes, certRes, profRes, expRes, eduRes] = await Promise.allSettled([
        projectsApi.getAll(true),
        certificatesApi.getAll(),
        profileApi.get(),
        experienceApi.getAll(),
        educationApi.getAll(),
      ]);
      if (projRes.status === 'fulfilled') setProjects(projRes.value.data.data ?? []);
      if (certRes.status === 'fulfilled') setCertificates(certRes.value.data.data ?? []);
      if (profRes.status === 'fulfilled') setProfile(profRes.value.data.data ?? null);
      if (expRes.status === 'fulfilled') setExperience(expRes.value.data.data ?? []);
      if (eduRes.status === 'fulfilled') setEducation(eduRes.value.data.data ?? []);
      setLoading(false);
    };
    load();
  }, []);

  const toggleSkillCategory = useCallback((cat) => {
    setExpandedSkills(prev => ({ ...prev, [cat]: !prev[cat] }));
  }, []);

  const filteredCerts   = certFilter === 'All' ? certificates : certificates.filter(c => c.category === certFilter);
  const displayProjects = showAllProjects ? projects      : projects.slice(0, PAGE_SIZE);
  const displayCerts    = showAllCerts    ? filteredCerts : filteredCerts.slice(0, PAGE_SIZE);

  const fmtDate = (d) => {
    if (!d) return '';
    return new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const social = profile?.socialLinks ?? {
    github:   'https://github.com/Samuel-AKINGENEYE',
    linkedin: 'https://linkedin.com/in/samuel-akingeneye',
    twitter:  'https://twitter.com/samuel_ak',
  };

  if (loading) return <LoadingScreen />;

  // ─── Page ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen">
      {showResume && <ResumeModal onClose={() => setShowResume(false)} />}
      <Navbar />

      {/* ══════════════════════ HERO ══════════════════════ */}
      <section
        id="hero"
        className="relative min-h-screen flex items-center pt-16 px-6 overflow-hidden"
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-blue-500/5 blur-3xl" />
        </div>

        <div className="container-max w-full py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left — text */}
            <div className="animate-fade-in">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-green-500/10 border border-green-500/25 text-green-600 dark:text-green-400 text-sm font-medium mb-6">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Available Now!
              </div>

              <h1 className="text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white leading-tight mb-4">
                Hi, I'm{' '}
                <span className="text-gradient">Samuel</span>
                <br />
                <span className="text-gradient">AKINGENEYE</span>
              </h1>

              <p className="text-xl font-semibold text-slate-600 dark:text-slate-300 mb-3">
                Full Stack Developer
              </p>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-8 max-w-lg">
                Building tools used by 500+ users across Africa. From AI-powered language tutors
                to civic engagement platforms — I write code that creates real impact.
              </p>

              <div className="flex flex-wrap gap-4 mb-10">
                <a href="#projects" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors shadow-lg shadow-blue-500/25">
                  View My Work <ChevronRight size={16} />
                </a>
                <a href="#contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:border-blue-500 hover:text-blue-500 dark:hover:border-blue-400 dark:hover:text-blue-400 font-medium transition-colors">
                  Contact Me <Mail size={16} />
                </a>
                <button
                  onClick={() => setShowResume(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:border-green-500 hover:text-green-500 dark:hover:border-green-400 dark:hover:text-green-400 font-medium transition-colors"
                >
                  View CV <FileText size={16} />
                </button>
              </div>

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 text-blue-700 dark:text-blue-400 text-sm font-medium">
                <Award size={15} />
                8+ Projects Built
              </div>
            </div>

            {/* Right — VS Code editor card */}
            <div className="flex justify-center animate-fade-in">
              <div className="relative w-full max-w-sm animate-float">

                {/* Floating avatar circle */}
                <div className="absolute -top-4 -right-4 z-10 w-12 h-12 rounded-full border-2 border-dashed border-orange-500/70 bg-[#0d1117] flex items-center justify-center shadow-xl shadow-orange-500/10 animate-spin-slow">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500/30 to-purple-500/30 border border-blue-500/40 flex items-center justify-center">
                    <span className="text-[10px] font-black text-blue-400 select-none font-mono">SA</span>
                  </div>
                </div>

                {/* Editor window */}
                <div className="rounded-xl overflow-hidden border border-slate-700/60 bg-[#0d1117] shadow-2xl shadow-black/50">

                  {/* Title bar */}
                  <div className="flex items-center gap-1.5 px-4 py-2.5 bg-[#161b22] border-b border-slate-700/50">
                    <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                    <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                    <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
                    <div className="ml-3 flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                      portfolio.tsx
                    </div>
                  </div>

                  {/* Code body */}
                  <div className="px-4 py-4 font-mono text-[11px] sm:text-xs leading-[1.75] select-none">

                    {/* L1 comment */}
                    <div className="flex gap-3">
                      <span className="text-slate-600 w-4 text-right shrink-0">1</span>
                      <span className="text-slate-500">{'// Welcome to my workspace'}</span>
                    </div>

                    {/* L2 import */}
                    <div className="flex gap-3">
                      <span className="text-slate-600 w-4 text-right shrink-0">2</span>
                      <span>
                        <span className="text-[#c792ea]">import </span>
                        <span className="text-slate-300">{'{ '}</span>
                        <span className="text-[#82aaff]">Developer</span>
                        <span className="text-slate-300">{' } '}</span>
                        <span className="text-[#c792ea]">from </span>
                        <span className="text-[#c3e88d]">'./universe'</span>
                        <span className="text-slate-300">;</span>
                      </span>
                    </div>

                    {/* L3 blank */}
                    <div className="flex gap-3">
                      <span className="text-slate-600 w-4 text-right shrink-0">3</span>
                      <span>&nbsp;</span>
                    </div>

                    {/* L4 const */}
                    <div className="flex gap-3">
                      <span className="text-slate-600 w-4 text-right shrink-0">4</span>
                      <span>
                        <span className="text-[#c792ea]">const </span>
                        <span className="text-[#82aaff]">Portfolio </span>
                        <span className="text-slate-300">= () </span>
                        <span className="text-[#89ddff]">{'=> '}</span>
                        <span className="text-slate-300">{'{'}</span>
                      </span>
                    </div>

                    {/* L5 return */}
                    <div className="flex gap-3">
                      <span className="text-slate-600 w-4 text-right shrink-0">5</span>
                      <span className="pl-4">
                        <span className="text-[#c792ea]">return </span>
                        <span className="text-slate-300">(</span>
                      </span>
                    </div>

                    {/* L6 <Developer */}
                    <div className="flex gap-3">
                      <span className="text-slate-600 w-4 text-right shrink-0">6</span>
                      <span className="pl-8">
                        <span className="text-[#89ddff]">{'<'}</span>
                        <span className="text-[#f07178]">Developer</span>
                      </span>
                    </div>

                    {/* L7–9 props */}
                    {[
                      { n: 7,  attr: 'name',    val: '"Samuel AKINGENEYE"' },
                      { n: 8,  attr: 'role',    val: '"Junior Software Engineer"' },
                      { n: 9,  attr: 'passion', val: '"Building Real Impact"' },
                    ].map(({ n, attr, val }) => (
                      <div key={attr} className="flex gap-3">
                        <span className="text-slate-600 w-4 text-right shrink-0">{n}</span>
                        <span className="pl-12">
                          <span className="text-[#ffcb6b]">{attr}</span>
                          <span className="text-slate-300">=</span>
                          <span className="text-[#c3e88d]">{val}</span>
                        </span>
                      </div>
                    ))}

                    {/* L10 /> */}
                    <div className="flex gap-3">
                      <span className="text-slate-600 w-4 text-right shrink-0">10</span>
                      <span className="pl-8">
                        <span className="text-[#89ddff]">{'/>'}</span>
                      </span>
                    </div>

                    {/* L11 ); */}
                    <div className="flex gap-3">
                      <span className="text-slate-600 w-4 text-right shrink-0">11</span>
                      <span className="pl-4 text-slate-300">);</span>
                    </div>

                    {/* L12 }; */}
                    <div className="flex gap-3">
                      <span className="text-slate-600 w-4 text-right shrink-0">12</span>
                      <span className="text-slate-300">{'};'}</span>
                    </div>
                  </div>

                  {/* Bottom buttons */}
                  <div className="flex gap-3 px-4 pb-4 pt-1">
                    <a
                      href="#projects"
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-400 text-white text-xs font-semibold transition-colors shadow-lg shadow-orange-500/25"
                    >
                      <Play size={11} className="fill-white" /> Run Profile
                    </a>
                    <a
                      href="#projects"
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-600 hover:border-slate-400 text-slate-300 hover:text-white text-xs font-semibold transition-colors"
                    >
                      <FolderOpen size={11} /> View Projects
                    </a>
                  </div>

                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-16">
            <a href="#projects" className="text-slate-300 dark:text-slate-600 hover:text-blue-500 transition-colors animate-bounce" aria-label="Scroll to projects">
              <ArrowDown size={22} />
            </a>
          </div>
        </div>
      </section>

      {/* ══════════════════════ PROJECTS ══════════════════════ */}
      <Section id="projects" className="bg-white dark:bg-slate-800/30">
        <SectionHead
          title="Featured Projects"
          sub="Real-world applications built to solve actual problems"
        />

        {projects.length > 0 ? (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayProjects.map(p => <ProjectCard key={p._id} project={p} />)}
            </div>
            <ViewAllButton
              showAll={showAllProjects}
              total={projects.length}
              visible={PAGE_SIZE}
              onToggle={() => setShowAllProjects(v => !v)}
              noun="Projects"
            />
          </>
        ) : (
          <p className="text-center text-slate-400">No projects yet — add some in the admin dashboard.</p>
        )}
      </Section>

      {/* ══════════════════════ SKILLS ══════════════════════ */}
      <Section id="skills">
        <SectionHead
          title="Skills & Tech Stack"
          sub="Tools and technologies I use to build products"
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(SKILLS).map(([category, { icon: Icon, color, bg, items }]) => {
            const expanded  = expandedSkills[category];
            const displayed = expanded ? items : items.slice(0, SKILL_PAGE);
            const hasMore   = items.length > SKILL_PAGE;

            return (
              <div key={category} className="card p-6 glow-hover flex flex-col">
                {/* Category header */}
                <div className="flex items-center gap-2.5 mb-5">
                  <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center ${color}`}>
                    <Icon size={16} />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white text-sm">{category}</h3>
                </div>

                {/* Skill badges with SVG icons */}
                <div className="flex flex-wrap gap-2 flex-1">
                  {displayed.map(skill => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 hover:bg-blue-500 hover:text-white hover:border-blue-500 dark:hover:bg-blue-500 dark:hover:text-white dark:hover:border-blue-500 transition-all duration-200 cursor-default select-none group"
                    >
                      <SkillIcon name={skill} size={14} />
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Expand / collapse for long categories */}
                {hasMore && (
                  <button
                    onClick={() => toggleSkillCategory(category)}
                    className="mt-4 text-xs text-blue-500 hover:text-blue-600 font-medium flex items-center gap-1 transition-colors"
                  >
                    {expanded
                      ? <><ChevronUp size={12} /> Show less</>
                      : <><ChevronDown size={12} /> Show all {items.length} skills</>
                    }
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </Section>

      {/* ══════════════════════ GITHUB ACTIVITY ══════════════════════ */}
      <Section id="github" className="bg-white dark:bg-slate-800/30">
        <SectionHead
          title="GitHub Activity"
          sub="My open-source contributions, commit by commit"
        />
        <div className="card p-6 md:p-8">
          <GitHubCalendar username="Samuel-AKINGENEYE" />
        </div>
      </Section>

      {/* ══════════════════════ TESTIMONIALS ══════════════════════ */}
      <Section id="testimonials">
        <SectionHead
          title="Testimonials"
          sub="Feedback from collaborators and clients"
        />
        <div className="grid md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="card p-6 glow-hover flex flex-col">
              <div className="mb-3"><StarRating rating={t.rating} /></div>
              <div className="mb-4 text-slate-600 dark:text-slate-300">
                <MessageSquare size={18} className="text-blue-500/40 mb-2" />
                <p className="text-sm leading-relaxed italic">"{t.feedback}"</p>
              </div>
              <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-700">
                <p className="font-semibold text-slate-900 dark:text-white text-sm">{t.author}</p>
                <p className="text-xs text-slate-500 mt-0.5">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ══════════════════════ EXPERIENCE ══════════════════════ */}
      <Section id="experience" className="bg-white dark:bg-slate-800/30">
        <SectionHead
          title="Experience"
          sub="Professional journey and key contributions"
        />
        {experience.length > 0 ? (
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Vertical timeline line */}
              <div className="absolute left-[19px] top-5 bottom-5 w-px bg-gradient-to-b from-blue-500/60 via-slate-300/40 dark:via-slate-600/40 to-transparent" />

              <div className="space-y-8">
                {experience.map((exp) => (
                  <div key={exp._id} className="relative flex gap-6">
                    {/* Timeline dot */}
                    <div className="relative z-10 flex-shrink-0 mt-3.5">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                        exp.current
                          ? 'bg-green-500/15 border-green-500 shadow-lg shadow-green-500/20'
                          : 'bg-[#0d1117] border-slate-600'
                      }`}>
                        {exp.current
                          ? <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                          : <GitCommit size={15} className="text-blue-400/70" />
                        }
                      </div>
                    </div>

                    {/* VS Code–style editor card */}
                    <div className="flex-1 rounded-xl overflow-hidden border border-slate-700/60 bg-[#0d1117] shadow-xl glow-hover">
                      {/* Title bar */}
                      <div className="flex items-center justify-between px-4 py-2.5 bg-[#161b22] border-b border-slate-700/50">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                          <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                          <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                          <span className="ml-3 font-mono text-[11px] text-slate-400">
                            {exp.company.toLowerCase().replace(/\s+/g, '-')}.ts
                          </span>
                        </div>
                        {exp.current && (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-500/15 border border-green-500/30 text-green-400 text-[10px] font-mono">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            active
                          </span>
                        )}
                      </div>

                      {/* Code body */}
                      <div className="px-5 py-4 font-mono text-[12px] leading-[1.85] space-y-0">
                        {/* L1 — company comment */}
                        <div className="flex gap-3">
                          <span className="text-slate-600 w-5 text-right shrink-0 select-none">1</span>
                          <span className="text-slate-500">
                            {'// '}{exp.company}{exp.location ? ` · ${exp.location}` : ''}
                          </span>
                        </div>
                        {/* L2 — role */}
                        <div className="flex gap-3">
                          <span className="text-slate-600 w-5 text-right shrink-0 select-none">2</span>
                          <span>
                            <span className="text-[#c792ea]">const </span>
                            <span className="text-[#82aaff]">role </span>
                            <span className="text-slate-300">= </span>
                            <span className="text-[#c3e88d]">"{exp.position}"</span>
                            <span className="text-slate-400">;</span>
                          </span>
                        </div>
                        {/* L3 — date range */}
                        <div className="flex gap-3">
                          <span className="text-slate-600 w-5 text-right shrink-0 select-none">3</span>
                          <span className="text-slate-500">
                            {'// '}
                            {exp.startDate ? fmtDate(exp.startDate) : '?'}{' → '}
                            {exp.current ? 'Present' : (exp.endDate ? fmtDate(exp.endDate) : '?')}
                          </span>
                        </div>
                        {/* L4 — blank */}
                        <div className="flex gap-3">
                          <span className="text-slate-600 w-5 text-right shrink-0 select-none">4</span>
                          <span>&nbsp;</span>
                        </div>
                        {/* L5+ — achievements array */}
                        {exp.achievements?.length > 0 ? (
                          <>
                            <div className="flex gap-3">
                              <span className="text-slate-600 w-5 text-right shrink-0 select-none">5</span>
                              <span>
                                <span className="text-[#c792ea]">const </span>
                                <span className="text-[#82aaff]">highlights </span>
                                <span className="text-slate-300">= [</span>
                              </span>
                            </div>
                            {exp.achievements.map((ach, ai) => (
                              <div key={ai} className="flex gap-3">
                                <span className="text-slate-600 w-5 text-right shrink-0 select-none">{6 + ai}</span>
                                <span className="pl-4 break-words">
                                  <span className="text-[#c3e88d]">"{ach}"</span>
                                  {ai < exp.achievements.length - 1 && <span className="text-slate-400">,</span>}
                                </span>
                              </div>
                            ))}
                            <div className="flex gap-3">
                              <span className="text-slate-600 w-5 text-right shrink-0 select-none">{6 + exp.achievements.length}</span>
                              <span className="text-slate-300">];</span>
                            </div>
                          </>
                        ) : exp.description ? (
                          <div className="flex gap-3">
                            <span className="text-slate-600 w-5 text-right shrink-0 select-none">5</span>
                            <span className="text-slate-500 break-words">{'/* '}{exp.description}{' */'}</span>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-slate-400 font-mono text-sm">
            <span className="text-slate-600">// </span>No experience entries yet — add some in the admin dashboard.
          </p>
        )}
      </Section>

      {/* ══════════════════════ EDUCATION ══════════════════════ */}
      <Section id="education">
        <SectionHead
          title="Education"
          sub="The foundation behind my technical mindset"
        />
        {education.length > 0 ? (
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
            {education.map((edu) => {
              const lineOffset = edu.field ? 1 : 0;
              return (
                <div key={edu._id} className="rounded-xl overflow-hidden border border-slate-700/60 bg-[#0d1117] shadow-xl glow-hover">
                  {/* Title bar */}
                  <div className="flex items-center justify-between px-4 py-2.5 bg-[#161b22] border-b border-slate-700/50">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                      <div className="ml-3 flex items-center gap-1.5 font-mono text-[11px] text-slate-400">
                        <GraduationCap size={12} className="text-purple-400" />
                        {edu.institution.toLowerCase().replace(/\s+/g, '-')}.ts
                      </div>
                    </div>
                    {edu.current && (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-400 text-[10px] font-mono">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                        enrolled
                      </span>
                    )}
                  </div>

                  {/* Code body */}
                  <div className="px-5 py-4 font-mono text-[12px] leading-[1.85] space-y-0">
                    {/* L1 — class declaration */}
                    <div className="flex gap-3">
                      <span className="text-slate-600 w-5 text-right shrink-0 select-none">1</span>
                      <span>
                        <span className="text-[#c792ea]">class </span>
                        <span className="text-[#f07178]">
                          {edu.institution.replace(/[^a-zA-Z0-9]/g, '')}
                        </span>
                        <span className="text-slate-300"> {'{'}</span>
                      </span>
                    </div>
                    {/* L2 — degree */}
                    <div className="flex gap-3">
                      <span className="text-slate-600 w-5 text-right shrink-0 select-none">2</span>
                      <span className="pl-4">
                        <span className="text-[#ffcb6b]">degree</span>
                        <span className="text-slate-400"> = </span>
                        <span className="text-[#c3e88d]">"{edu.degree}"</span>
                        <span className="text-slate-400">;</span>
                      </span>
                    </div>
                    {/* L3 — field (optional) */}
                    {edu.field && (
                      <div className="flex gap-3">
                        <span className="text-slate-600 w-5 text-right shrink-0 select-none">3</span>
                        <span className="pl-4">
                          <span className="text-[#ffcb6b]">field</span>
                          <span className="text-slate-400"> = </span>
                          <span className="text-[#c3e88d]">"{edu.field}"</span>
                          <span className="text-slate-400">;</span>
                        </span>
                      </div>
                    )}
                    {/* L3/4 — dates comment */}
                    <div className="flex gap-3">
                      <span className="text-slate-600 w-5 text-right shrink-0 select-none">{3 + lineOffset}</span>
                      <span className="pl-4 text-slate-500">
                        {'// '}
                        {edu.startDate ? fmtDate(edu.startDate) : ''}
                        {(edu.startDate && (edu.endDate || edu.current)) ? ' → ' : ''}
                        {edu.current ? 'Present' : (edu.endDate ? fmtDate(edu.endDate) : '')}
                      </span>
                    </div>
                    {/* closing brace */}
                    <div className="flex gap-3">
                      <span className="text-slate-600 w-5 text-right shrink-0 select-none">{4 + lineOffset}</span>
                      <span className="text-slate-300">{'}'}</span>
                    </div>
                    {/* description block comment */}
                    {edu.description && (
                      <>
                        <div className="flex gap-3">
                          <span className="text-slate-600 w-5 text-right shrink-0 select-none">{5 + lineOffset}</span>
                          <span>&nbsp;</span>
                        </div>
                        <div className="flex gap-3">
                          <span className="text-slate-600 w-5 text-right shrink-0 select-none">{6 + lineOffset}</span>
                          <span className="text-slate-500 break-words">{'/* '}{edu.description}{' */'}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-slate-400 font-mono text-sm">
            <span className="text-slate-600">// </span>No education entries yet — add some in the admin dashboard.
          </p>
        )}
      </Section>

      {/* ══════════════════════ CERTIFICATIONS ══════════════════════ */}
      <Section id="certifications" className="bg-white dark:bg-slate-800/30">
        <SectionHead
          title="Certifications"
          sub="Verified credentials from leading institutions"
        />

        {/* Filter tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {CERT_CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => { setCertFilter(cat); setShowAllCerts(false); }}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                certFilter === cat
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                  : 'border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-blue-500 hover:text-blue-500'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {filteredCerts.length > 0 ? (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayCerts.map(c => <CertificateCard key={c._id} certificate={c} />)}
            </div>
            <ViewAllButton
              showAll={showAllCerts}
              total={filteredCerts.length}
              visible={PAGE_SIZE}
              onToggle={() => setShowAllCerts(v => !v)}
              noun="Certificates"
            />
          </>
        ) : (
          <p className="text-center text-slate-400">No certificates in this category.</p>
        )}
      </Section>

      {/* ══════════════════════ ABOUT ══════════════════════ */}
      <Section id="about">
        <SectionHead title="About Me" />
        <div className="grid lg:grid-cols-2 gap-14 items-start">
          <div>
            <h3 className="text-lg font-semibold text-blue-500 mb-4">My Story</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[15px]">
              {profile?.bio ??
                "I'm a self-taught software engineer from Rwanda who turned curiosity into code. " +
                'After completing freeCodeCamp\'s full-stack bootcamp, I built real solutions: an ' +
                'AI-powered language tutor that helped 300+ learners practice conversational English, ' +
                'and a civic engagement platform that reduced local service request time by 40%. ' +
                "I believe technology should serve people, and I'm driven to create impact through " +
                'clean, scalable web applications.'}
            </p>
          </div>

          <div className="card p-6">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-5">Quick Facts</h3>
            <dl className="space-y-4">
              {[
                { icon: Mail,     color: 'bg-blue-500/10 text-blue-500',   label: 'Email',        value: profile?.email        ?? 'samuel@example.com' },
                { icon: MapPin,   color: 'bg-green-500/10 text-green-500', label: 'Location',     value: profile?.location     ?? 'Kigali, Rwanda' },
                { icon: Calendar, color: 'bg-purple-500/10 text-purple-500', label: 'Availability', value: profile?.availability ?? 'Available Now', valueClass: 'text-green-600 dark:text-green-400' },
                { icon: Briefcase,color: 'bg-orange-500/10 text-orange-500', label: 'Experience',  value: `${profile?.yearsOfExperience ?? 2}+ Years` },
              ].map(({ icon: Icon, color, label, value, valueClass }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg ${color} flex items-center justify-center shrink-0`}>
                    <Icon size={15} />
                  </div>
                  <div>
                    <dt className="text-xs text-slate-400 dark:text-slate-500">{label}</dt>
                    <dd className={`text-sm font-medium text-slate-900 dark:text-white ${valueClass ?? ''}`}>{value}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Section>

      {/* ══════════════════════ CONTACT ══════════════════════ */}
      <Section id="contact" className="bg-white dark:bg-slate-800/30">
        <SectionHead
          title="Get In Touch"
          sub="Have a project in mind? Let's build something together."
        />
        <div className="grid lg:grid-cols-2 gap-12 max-w-4xl mx-auto">
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-5">Send a Message</h3>
            <ContactForm />
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-5">Connect With Me</h3>
            <div className="space-y-3">
              {[
                { key: 'github',   Icon: Github,   label: 'GitHub',   sub: 'View my open source work',  href: social.github },
                { key: 'linkedin', Icon: Linkedin,  label: 'LinkedIn', sub: 'Connect professionally',    href: social.linkedin },
                { key: 'twitter',  Icon: Twitter,   label: 'Twitter',  sub: 'Follow for dev updates',    href: social.twitter },
              ].filter(s => s.href).map(({ key, Icon, label, sub, href }) => (
                <a key={key} href={href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 rounded-xl card glow-hover group">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                    <Icon size={20} />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white text-sm">{label}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{sub}</p>
                  </div>
                </a>
              ))}

              {profile?.email && (
                <a href={`mailto:${profile.email}`} className="flex items-center gap-4 p-4 rounded-xl card glow-hover group">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white text-sm">Email</p>
                    <p className="text-xs text-slate-500 mt-0.5">{profile.email}</p>
                  </div>
                </a>
              )}
            </div>
          </div>
        </div>
      </Section>

      <Footer profile={profile} />
    </div>
  );
}
