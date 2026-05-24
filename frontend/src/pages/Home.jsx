import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import {
  Github, Linkedin, Twitter, Mail, MapPin, Download, Send,
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
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '', honeypot: '' });
  const [sending, setSending] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [visibleLines, setVisibleLines] = useState(0);

  // Typing animation — reveal one line every 110ms
  useEffect(() => {
    if (visibleLines >= 12) return;
    const t = setTimeout(() => setVisibleLines(v => v + 1), 110);
    return () => clearTimeout(t);
  }, [visibleLines]);

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
      setContactForm({ name: '', email: '', message: '', honeypot: '' });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to send');
    } finally {
      setSending(false);
    }
  };

  const social = profile?.socialLinks ?? {};

  const handleResumeDownload = useCallback((e) => {
    e?.preventDefault();
    if (!profile?.resumeUrl) return;
    // Add fl_attachment so Cloudinary sends Content-Disposition: attachment,
    // triggering a real browser download without any fetch/CORS complications.
    const url = profile.resumeUrl.includes('res.cloudinary.com')
      ? profile.resumeUrl.replace(/\/upload\/(?!fl_attachment)/, '/upload/fl_attachment/')
      : profile.resumeUrl;
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Samuel_AKINGENEYE_Resume.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    analyticsApi.track({ page: '/', visitorId: getVisitorId(), event: 'resume_download' }).catch(() => {});
  }, [profile?.resumeUrl]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-8 bg-white dark:bg-slate-900">
        <div className="relative animate-fade-in">
          <span className="text-6xl font-black tracking-tight text-slate-900 dark:text-white select-none">
            <span className="text-blue-500">{'{'}</span>SA<span className="text-blue-500">{'}'}</span>
          </span>
          <span className="absolute inset-x-0 -bottom-2 h-0.5 rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500 opacity-80" />
        </div>
        <div className="flex gap-2.5">
          {[0, 1, 2, 3].map(i => (
            <div
              key={i}
              className="w-2.5 h-2.5 rounded-full bg-blue-500"
              style={{ animation: `dotBounce 1.2s ease-in-out ${i * 0.18}s infinite` }}
            />
          ))}
        </div>
        <p className="text-sm text-slate-400 animate-pulse tracking-wide">
          {slow ? 'Server is waking up, hang tight…' : 'Loading portfolio…'}
        </p>
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
      <section id="hero" className="relative min-h-screen flex items-center pt-16 px-6 bg-white dark:bg-slate-900 transition-colors duration-300">
        <div className="relative z-10 max-w-6xl mx-auto w-full py-24 lg:py-32">
          <div className="grid lg:grid-cols-[1fr_380px] gap-12 items-start">
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
                {profile?.resumeUrl && (
                  <button
                    onClick={handleResumeDownload}
                    className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-500 dark:hover:border-slate-500 font-medium rounded-md transition-colors text-sm"
                  >
                    <Download size={14} /> Resume
                  </button>
                )}
              </div>
            </div>

            {/* Right — VS Code editor card */}
            <div className="flex justify-center lg:justify-end animate-slide-right">
              <div className="relative w-full max-w-[380px] animate-float">

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
                <div className="rounded-xl overflow-hidden border border-slate-700/60 bg-[#0d1117] shadow-2xl shadow-black/60">

                  {/* Title bar */}
                  <div className="flex items-center gap-1.5 px-4 py-2.5 bg-[#161b22] border-b border-slate-700/50">
                    <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                    <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                    <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
                    <div className="ml-3 flex items-center gap-1.5 font-mono text-[11px] text-slate-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                      portfolio.tsx
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

                    {/* Blinking cursor after last visible line */}
                    {visibleLines < 12 && (
                      <div className="flex gap-3">
                        <span className="text-slate-600 w-5 text-right shrink-0">{visibleLines + 1}</span>
                        <span className="inline-block w-2 h-[14px] bg-accent animate-blink rounded-sm" />
                      </div>
                    )}
                  </div>

                  {/* Single button */}
                  <div className="px-4 pb-4 pt-1">
                    <button
                      onClick={() => setShowProfileModal(true)}
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
      <section id="projects" className="py-16 md:py-24 px-6 bg-white dark:bg-slate-900">
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
      <section id="skills" className="py-16 md:py-24 px-6 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <SectionHeader title="Stack" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            {hasApiSkills
              ? Object.entries(skillsByCategory).map(([category, items], idx) => (
                  <div key={category} className={`reveal reveal-d${Math.min(idx + 1, 6)}`}>
                    <p className="font-mono text-[11px] text-accent uppercase tracking-widest mb-4">{category}</p>
                    <ul className="space-y-2.5">
                      {[...items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).map(s => (
                        <li key={s._id} className="flex items-center gap-3">
                          <SkillIcon name={s.name} size={16} className="shrink-0 text-slate-400" />
                          <span className="font-mono text-sm text-slate-700 dark:text-slate-300">{s.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
              : STATIC_SKILLS.map(({ category, items }, idx) => (
                  <div key={category} className={`reveal reveal-d${idx + 1}`}>
                    <p className="font-mono text-[11px] text-accent uppercase tracking-widest mb-4">{category}</p>
                    <ul className="space-y-2.5">
                      {items.map(name => (
                        <li key={name} className="flex items-center gap-3">
                          <SkillIcon name={name} size={16} className="shrink-0 text-slate-400" />
                          <span className="font-mono text-sm text-slate-700 dark:text-slate-300">{name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
            }
          </div>
        </div>
      </section>

      {/* ── Experience ───────────────────────────────────────────────── */}
      <section id="experience" className="py-16 md:py-24 px-6 bg-white dark:bg-slate-900">
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
      <section id="education" className="py-16 md:py-24 px-6 bg-slate-50 dark:bg-slate-800/20">
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
      <section id="certificates" className="py-16 md:py-24 px-6 bg-white dark:bg-slate-900">
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
      <section id="contact" className="py-16 md:py-24 px-6 bg-white dark:bg-slate-900">
        <div className="max-w-6xl mx-auto">
          <SectionHeader title="Contact" />
          <div className="grid lg:grid-cols-2 gap-10 md:gap-12 max-w-4xl mx-auto">
            {/* Contact form */}
            <form onSubmit={handleContact} className="space-y-4 reveal reveal-d1">
              <input
                type="text" tabIndex={-1} autoComplete="off" className="hidden"
                value={contactForm.honeypot}
                onChange={e => setContactForm(f => ({ ...f, honeypot: e.target.value }))}
              />
              <input
                required placeholder="Your name"
                value={contactForm.name}
                onChange={e => setContactForm(f => ({ ...f, name: e.target.value }))}
                className="w-full px-4 py-3 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-colors"
              />
              <input
                required type="email" placeholder="Your email"
                value={contactForm.email}
                onChange={e => setContactForm(f => ({ ...f, email: e.target.value }))}
                className="w-full px-4 py-3 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-colors"
              />
              <textarea
                required rows={5} placeholder="Your message"
                value={contactForm.message}
                onChange={e => setContactForm(f => ({ ...f, message: e.target.value }))}
                className="w-full px-4 py-3 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-colors"
              />
              <button
                type="submit" disabled={sending}
                className="w-full py-3 rounded-md bg-accent hover:bg-accent-hover text-white font-medium transition-colors disabled:opacity-60"
              >
                {sending ? 'Sending...' : 'Send Message'}
              </button>
            </form>

            {/* Connect + resume */}
            <div className="space-y-5 reveal reveal-d2">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Connect with me</h3>
                <div className="flex flex-wrap gap-3">
                  {social.github && <a href={social.github} target="_blank" rel="noopener noreferrer" className="p-3 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-accent hover:text-accent transition-colors"><Github size={18} /></a>}
                  {social.linkedin && <a href={social.linkedin} target="_blank" rel="noopener noreferrer" className="p-3 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-accent hover:text-accent transition-colors"><Linkedin size={18} /></a>}
                  {social.twitter && <a href={social.twitter} target="_blank" rel="noopener noreferrer" className="p-3 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-accent hover:text-accent transition-colors"><Twitter size={18} /></a>}
                  {profile?.email && <a href={`mailto:${profile.email}`} className="p-3 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-accent hover:text-accent transition-colors"><Mail size={18} /></a>}
                </div>
              </div>
              {profile?.location && (
                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                  <MapPin size={16} className="text-accent" />
                  <span>{profile.location}</span>
                </div>
              )}
              {profile?.email && (
                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                  <Mail size={16} className="text-accent" />
                  <a href={`mailto:${profile.email}`} className="hover:text-accent">{profile.email}</a>
                </div>
              )}

              {/* Resume button — uses admin-uploaded PDF when available */}
              {profile?.resumeUrl && (
                <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                  <button
                    onClick={handleResumeDownload}
                    className="inline-flex items-center justify-center w-full gap-2 px-6 py-3 rounded-md border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-accent hover:text-accent transition-colors font-medium"
                  >
                    <Download size={16} />
                    Download Resume
                  </button>
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
          {profile?.resumeUrl && (
            <button
              onClick={handleResumeDownload}
              className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 active:scale-95 transition-all"
            >
              <Download size={20} />
              <span className="text-[10px] font-medium">Resume</span>
            </button>
          )}
        </div>
      </nav>
    </div>
  );
}
