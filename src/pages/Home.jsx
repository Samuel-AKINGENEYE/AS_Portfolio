import { useState, useEffect, useCallback, useRef } from 'react';
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

// ─── Static data ──────────────────────────────────────────────────────────────

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

const SKILL_PAGE = 8;

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
const PAGE_SIZE = 6;

const HERO_ROLES = [
  'Full Stack Developer',
  'React & Node.js Engineer',
  'Problem Solver',
  'Open Source Contributor',
];


// ─── Typing animation hook ────────────────────────────────────────────────────

function useTypingText(words, { typeSpeed = 80, deleteSpeed = 45, pause = 1800 } = {}) {
  const [displayed, setDisplayed] = useState('');
  const [wordIdx, setWordIdx]     = useState(0);
  const [phase, setPhase]         = useState('typing'); // 'typing' | 'pausing' | 'deleting'

  useEffect(() => {
    const word = words[wordIdx];
    let timer;

    if (phase === 'typing') {
      if (displayed.length < word.length) {
        timer = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), typeSpeed);
      } else {
        timer = setTimeout(() => setPhase('pausing'), pause);
      }
    } else if (phase === 'pausing') {
      timer = setTimeout(() => setPhase('deleting'), 200);
    } else {
      if (displayed.length > 0) {
        timer = setTimeout(() => setDisplayed(displayed.slice(0, -1)), deleteSpeed);
      } else {
        setWordIdx((i) => (i + 1) % words.length);
        setPhase('typing');
      }
    }
    return () => clearTimeout(timer);
  }, [displayed, phase, wordIdx, words, typeSpeed, deleteSpeed, pause]);

  return displayed;
}

// ─── Scroll-reveal hook ───────────────────────────────────────────────────────

function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('visible'); io.disconnect(); } },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

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
        <iframe src="/resume.pdf#toolbar=0" title="Resume Preview" className="flex-1 w-full border-0" />
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
  const ref = useReveal();
  return (
    <section id={id} className={`section ${className}`}>
      <div className="container-max reveal" ref={ref}>{children}</div>
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

function ContactForm() {
  const [form, setForm]     = useState({ name: '', email: '', message: '' });
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
      <input required type="text" placeholder="Your name" value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} />
      <input required type="email" placeholder="your@email.com" value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} />
      <textarea required rows={5} placeholder="Your message…" value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
        className={`${inputClass} resize-none`} />
      <button type="submit" disabled={sending}
        className="w-full py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-medium text-sm transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
        {sending
          ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          : <><Send size={15} /> Send Message</>
        }
      </button>
    </form>
  );
}

// ─── Instant skeleton while data loads (no blocking delay) ────────────────────

function PageSkeleton() {
  return (
    <div className="min-h-screen animate-fade-in">
      {/* Navbar placeholder */}
      <div className="fixed top-0 inset-x-0 z-50 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800/60" />

      {/* Hero skeleton */}
      <div className="min-h-screen flex items-center pt-16 px-6">
        <div className="container-max w-full py-20 grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-5">
            <div className="h-6 w-40 rounded-full skeleton-shimmer" />
            <div className="h-14 w-3/4 rounded-xl skeleton-shimmer" />
            <div className="h-10 w-1/2 rounded-xl skeleton-shimmer" />
            <div className="h-5 w-full rounded-lg skeleton-shimmer" />
            <div className="h-5 w-5/6 rounded-lg skeleton-shimmer" />
            <div className="flex gap-3 pt-2">
              <div className="h-12 w-36 rounded-xl skeleton-shimmer" />
              <div className="h-12 w-36 rounded-xl skeleton-shimmer" />
            </div>
          </div>
          <div className="hidden lg:block h-80 rounded-2xl skeleton-shimmer" />
        </div>
      </div>

      {/* Projects skeleton */}
      <div className="section px-6">
        <div className="container-max">
          <div className="text-center mb-14 space-y-3">
            <div className="h-9 w-56 rounded-xl skeleton-shimmer mx-auto" />
            <div className="h-5 w-80 rounded-lg skeleton-shimmer mx-auto" />
          </div>
          <SkeletonGrid count={3} />
        </div>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function Home() {
  const [projects,     setProjects]     = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [experience,   setExperience]   = useState([]);
  const [education,    setEducation]    = useState([]);
  const [profile,      setProfile]      = useState(null);
  const [certFilter,   setCertFilter]   = useState('All');
  const [loading,      setLoading]      = useState(true);
  const [showResume,   setShowResume]   = useState(false);

  const [showAllProjects, setShowAllProjects] = useState(false);
  const [showAllCerts,    setShowAllCerts]    = useState(false);
  const [expandedSkills,  setExpandedSkills]  = useState({});

  const typingRole = useTypingText(HERO_ROLES);

  useEffect(() => {
    Promise.allSettled([
      projectsApi.getAll(true),
      certificatesApi.getAll(),
      profileApi.get(),
      experienceApi.getAll(),
      educationApi.getAll(),
    ]).then(([projRes, certRes, profRes, expRes, eduRes]) => {
      if (projRes.status === 'fulfilled') setProjects(projRes.value.data.data ?? []);
      if (certRes.status === 'fulfilled') setCertificates(certRes.value.data.data ?? []);
      if (profRes.status === 'fulfilled') setProfile(profRes.value.data.data ?? null);
      if (expRes.status === 'fulfilled')  setExperience(expRes.value.data.data ?? []);
      if (eduRes.status === 'fulfilled')  setEducation(eduRes.value.data.data ?? []);
      setLoading(false);
    });
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

  if (loading) return <PageSkeleton />;

  return (
    <div className="min-h-screen">
      {showResume && <ResumeModal onClose={() => setShowResume(false)} />}
      <Navbar />

      {/* ══════════════════════ HERO ══════════════════════ */}
      <section id="hero" className="relative min-h-screen flex items-center pt-16 px-4 sm:px-6 overflow-hidden hero-mesh">

        {/* Decorative grid */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.04]"
          style={{
            backgroundImage: 'linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(to right, #3b82f6 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        <div className="container-max w-full py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">

            {/* Left — text */}
            <div className="animate-fade-in-up">

              {/* Status badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-green-500/10 border border-green-500/25 text-green-600 dark:text-green-400 text-sm font-medium mb-6">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Available Now!
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white leading-tight mb-4">
                Hi, I'm{' '}
                <span className="text-gradient">Samuel</span>
                <br />
                <span className="text-gradient">AKINGENEYE</span>
              </h1>

              {/* Typing animation */}
              <p className="text-base sm:text-lg md:text-xl font-semibold text-slate-600 dark:text-slate-300 mb-3 min-h-[2rem]">
                <span className="typing-cursor text-blue-500">{typingRole}</span>
              </p>

              <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-8 max-w-lg">
                Building tools used by 500+ users across Africa. From AI-powered language tutors
                to civic engagement platforms — I write code that creates real impact.
              </p>

              {/* CTA buttons */}
              <div className="flex flex-wrap gap-3 sm:gap-4 mb-10">
                <a href="#projects"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-medium transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5">
                  View My Work <ChevronRight size={16} />
                </a>
                <a href="#contact"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:border-blue-500 hover:text-blue-500 dark:hover:border-blue-400 dark:hover:text-blue-400 font-medium transition-all hover:-translate-y-0.5">
                  Contact Me <Mail size={16} />
                </a>
                <button onClick={() => setShowResume(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:border-green-500 hover:text-green-500 dark:hover:border-green-400 dark:hover:text-green-400 font-medium transition-all hover:-translate-y-0.5">
                  View CV <FileText size={16} />
                </button>
              </div>

            </div>

            {/* Right — VS Code editor card */}
            <div className="flex justify-center animate-slide-right" style={{ animationDelay: '0.2s' }}>
              <div className="relative w-full max-w-xs sm:max-w-sm animate-float">

                {/* Floating avatar circle */}
                <div className="absolute -top-4 -right-4 z-10 w-12 h-12 rounded-full border-2 border-dashed border-orange-500/70 bg-[#0d1117] flex items-center justify-center shadow-xl shadow-orange-500/10 animate-spin-slow">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500/30 to-purple-500/30 border border-blue-500/40 flex items-center justify-center">
                    <span className="text-[10px] font-black text-blue-400 select-none font-mono">SA</span>
                  </div>
                </div>

                {/* Glow backdrop */}
                <div className="absolute -inset-4 bg-blue-500/10 rounded-3xl blur-2xl pointer-events-none" />

                {/* Editor window */}
                <div className="relative rounded-xl overflow-hidden border border-slate-700/60 bg-[#0d1117] shadow-2xl shadow-black/50">

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
                    <div className="flex gap-3">
                      <span className="text-slate-600 w-4 text-right shrink-0">1</span>
                      <span className="text-slate-500">{'// Welcome to my workspace'}</span>
                    </div>
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
                    <div className="flex gap-3">
                      <span className="text-slate-600 w-4 text-right shrink-0">3</span>
                      <span>&nbsp;</span>
                    </div>
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
                    <div className="flex gap-3">
                      <span className="text-slate-600 w-4 text-right shrink-0">5</span>
                      <span className="pl-4">
                        <span className="text-[#c792ea]">return </span>
                        <span className="text-slate-300">(</span>
                      </span>
                    </div>
                    <div className="flex gap-3">
                      <span className="text-slate-600 w-4 text-right shrink-0">6</span>
                      <span className="pl-8">
                        <span className="text-[#89ddff]">{'<'}</span>
                        <span className="text-[#f07178]">Developer</span>
                      </span>
                    </div>
                    {[
                      { n: 7,  attr: 'name',    val: '"Samuel AKINGENEYE"' },
                      { n: 8,  attr: 'role',    val: '"Full Stack Dev"' },
                      { n: 9,  attr: 'passion', val: '"Real Impact"' },
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
                    <div className="flex gap-3">
                      <span className="text-slate-600 w-4 text-right shrink-0">10</span>
                      <span className="pl-8"><span className="text-[#89ddff]">{'/>'}</span></span>
                    </div>
                    <div className="flex gap-3">
                      <span className="text-slate-600 w-4 text-right shrink-0">11</span>
                      <span className="pl-4 text-slate-300">);</span>
                    </div>
                    <div className="flex gap-3">
                      <span className="text-slate-600 w-4 text-right shrink-0">12</span>
                      <span className="text-slate-300">{'};'}</span>
                    </div>
                  </div>

                  {/* Bottom buttons */}
                  <div className="flex gap-3 px-4 pb-4 pt-1">
                    <a href="#projects"
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-400 text-white text-xs font-semibold transition-colors shadow-lg shadow-orange-500/25">
                      <Play size={11} className="fill-white" /> Run Profile
                    </a>
                    <a href="#projects"
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-600 hover:border-slate-400 text-slate-300 hover:text-white text-xs font-semibold transition-colors">
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
        <SectionHead title="Featured Projects" sub="Real-world applications built to solve actual problems" />
        {projects.length > 0 ? (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {displayProjects.map(p => <ProjectCard key={p._id} project={p} />)}
            </div>
            <ViewAllButton showAll={showAllProjects} total={projects.length} visible={PAGE_SIZE}
              onToggle={() => setShowAllProjects(v => !v)} noun="Projects" />
          </>
        ) : (
          <p className="text-center text-slate-400">No projects yet — add some in the admin dashboard.</p>
        )}
      </Section>

      {/* ══════════════════════ SKILLS ══════════════════════ */}
      <Section id="skills">
        <SectionHead title="Skills & Tech Stack" sub="Tools and technologies I use to build products" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(SKILLS).map(([category, { icon: Icon, color, bg, items }]) => {
            const expanded  = expandedSkills[category];
            const displayed = expanded ? items : items.slice(0, SKILL_PAGE);
            const hasMore   = items.length > SKILL_PAGE;
            return (
              <div key={category} className="card p-6 glow-hover flex flex-col">
                <div className="flex items-center gap-2.5 mb-5">
                  <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center ${color}`}>
                    <Icon size={16} />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white text-sm">{category}</h3>
                </div>
                <div className="flex flex-wrap gap-2 flex-1">
                  {displayed.map(skill => (
                    <span key={skill}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 hover:bg-blue-500 hover:text-white hover:border-blue-500 dark:hover:bg-blue-500 dark:hover:text-white dark:hover:border-blue-500 transition-all duration-200 cursor-default select-none">
                      <SkillIcon name={skill} size={14} />
                      {skill}
                    </span>
                  ))}
                </div>
                {hasMore && (
                  <button onClick={() => toggleSkillCategory(category)}
                    className="mt-4 text-xs text-blue-500 hover:text-blue-600 font-medium flex items-center gap-1 transition-colors">
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
        <SectionHead title="GitHub Activity" sub="My open-source contributions, commit by commit" />
        <div className="card p-6 md:p-8">
          <GitHubCalendar username="Samuel-AKINGENEYE" />
        </div>
      </Section>

      {/* ══════════════════════ TESTIMONIALS ══════════════════════ */}
      <Section id="testimonials">
        <SectionHead title="Testimonials" sub="Feedback from collaborators and clients" />
        <div className="grid md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
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
        <SectionHead title="Experience" sub="Professional journey and key contributions" />
        {experience.length > 0 ? (
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="absolute left-[19px] top-5 bottom-5 w-px bg-gradient-to-b from-blue-500/60 via-slate-300/40 dark:via-slate-600/40 to-transparent" />
              <div className="space-y-8">
                {experience.map((exp) => (
                  <div key={exp._id} className="relative flex gap-3 sm:gap-6">
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
                    <div className="flex-1 rounded-xl overflow-hidden border border-slate-700/60 bg-[#0d1117] shadow-xl glow-hover">
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
                      <div className="px-5 py-4 font-mono text-[12px] leading-[1.85] space-y-0">
                        <div className="flex gap-3">
                          <span className="text-slate-600 w-5 text-right shrink-0 select-none">1</span>
                          <span className="text-slate-500">{'// '}{exp.company}{exp.location ? ` · ${exp.location}` : ''}</span>
                        </div>
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
                        <div className="flex gap-3">
                          <span className="text-slate-600 w-5 text-right shrink-0 select-none">3</span>
                          <span className="text-slate-500">
                            {'// '}
                            {exp.startDate ? fmtDate(exp.startDate) : '?'}{' → '}
                            {exp.current ? 'Present' : (exp.endDate ? fmtDate(exp.endDate) : '?')}
                          </span>
                        </div>
                        <div className="flex gap-3">
                          <span className="text-slate-600 w-5 text-right shrink-0 select-none">4</span>
                          <span>&nbsp;</span>
                        </div>
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
            <span className="text-slate-600">// </span>No experience entries yet.
          </p>
        )}
      </Section>

      {/* ══════════════════════ EDUCATION ══════════════════════ */}
      <Section id="education">
        <SectionHead title="Education" sub="The foundation behind my technical mindset" />
        {education.length > 0 ? (
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-4 sm:gap-6">
            {education.map((edu) => {
              const lineOffset = edu.field ? 1 : 0;
              return (
                <div key={edu._id} className="rounded-xl overflow-hidden border border-slate-700/60 bg-[#0d1117] shadow-xl glow-hover">
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
                  <div className="px-5 py-4 font-mono text-[12px] leading-[1.85] space-y-0">
                    <div className="flex gap-3">
                      <span className="text-slate-600 w-5 text-right shrink-0 select-none">1</span>
                      <span>
                        <span className="text-[#c792ea]">class </span>
                        <span className="text-[#f07178]">{edu.institution.replace(/[^a-zA-Z0-9]/g, '')}</span>
                        <span className="text-slate-300"> {'{'}</span>
                      </span>
                    </div>
                    <div className="flex gap-3">
                      <span className="text-slate-600 w-5 text-right shrink-0 select-none">2</span>
                      <span className="pl-4">
                        <span className="text-[#ffcb6b]">degree</span>
                        <span className="text-slate-400"> = </span>
                        <span className="text-[#c3e88d]">"{edu.degree}"</span>
                        <span className="text-slate-400">;</span>
                      </span>
                    </div>
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
                    <div className="flex gap-3">
                      <span className="text-slate-600 w-5 text-right shrink-0 select-none">{3 + lineOffset}</span>
                      <span className="pl-4 text-slate-500">
                        {'// '}
                        {edu.startDate ? fmtDate(edu.startDate) : ''}
                        {(edu.startDate && (edu.endDate || edu.current)) ? ' → ' : ''}
                        {edu.current ? 'Present' : (edu.endDate ? fmtDate(edu.endDate) : '')}
                      </span>
                    </div>
                    <div className="flex gap-3">
                      <span className="text-slate-600 w-5 text-right shrink-0 select-none">{4 + lineOffset}</span>
                      <span className="text-slate-300">{'}'}</span>
                    </div>
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
            <span className="text-slate-600">// </span>No education entries yet.
          </p>
        )}
      </Section>

      {/* ══════════════════════ CERTIFICATIONS ══════════════════════ */}
      <Section id="certifications" className="bg-white dark:bg-slate-800/30">
        <SectionHead title="Certifications" sub="Verified credentials from leading institutions" />
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {CERT_CATEGORIES.map(cat => (
            <button key={cat}
              onClick={() => { setCertFilter(cat); setShowAllCerts(false); }}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                certFilter === cat
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                  : 'border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-blue-500 hover:text-blue-500'
              }`}>
              {cat}
            </button>
          ))}
        </div>
        {filteredCerts.length > 0 ? (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {displayCerts.map(c => <CertificateCard key={c._id} certificate={c} />)}
            </div>
            <ViewAllButton showAll={showAllCerts} total={filteredCerts.length} visible={PAGE_SIZE}
              onToggle={() => setShowAllCerts(v => !v)} noun="Certificates" />
          </>
        ) : (
          <p className="text-center text-slate-400">No certificates in this category.</p>
        )}
      </Section>

      {/* ══════════════════════ ABOUT ══════════════════════ */}
      <Section id="about">
        <SectionHead title="About Me" />
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-14 items-start">
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
                { icon: Mail,      color: 'bg-blue-500/10 text-blue-500',     label: 'Email',        value: profile?.email        ?? 'samuel@example.com' },
                { icon: MapPin,    color: 'bg-green-500/10 text-green-500',   label: 'Location',     value: profile?.location     ?? 'Kigali, Rwanda' },
                { icon: Calendar,  color: 'bg-purple-500/10 text-purple-500', label: 'Availability', value: profile?.availability ?? 'Available Now', valueClass: 'text-green-600 dark:text-green-400' },
                { icon: Briefcase, color: 'bg-orange-500/10 text-orange-500', label: 'Experience',   value: `${profile?.yearsOfExperience ?? 2}+ Years` },
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
        <SectionHead title="Get In Touch" sub="Have a project in mind? Let's build something together." />
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 max-w-4xl mx-auto">
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
                <a key={key} href={href} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-xl card glow-hover group">
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
                <a href={`mailto:${profile.email}`}
                  className="flex items-center gap-4 p-4 rounded-xl card glow-hover group">
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
