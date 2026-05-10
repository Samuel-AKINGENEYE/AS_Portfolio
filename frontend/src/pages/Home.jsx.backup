import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import {
  Github, Linkedin, Twitter, Mail, MapPin, Download, Send,
  Code2, Database, Wrench, Globe, ChevronRight, Star, Loader2,
} from 'lucide-react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import ProjectCard from '../components/ProjectCard.jsx';
import CertificateCard from '../components/CertificateCard.jsx';
import WhatsAppButton from '../components/WhatsAppButton.jsx';
import StarBackground from '../components/StarBackground.jsx';
import TypingText from '../components/TypingText.jsx';
import CountUp from '../components/CountUp.jsx';
import Timeline from '../components/Timeline.jsx';
import {
  projectsApi, certificatesApi, profileApi, skillsApi,
  educationApi, experienceApi, analyticsApi, contactApi,
} from '../services/api.js';

const CATEGORY_CFG = {
  Frontend: { icon: Globe,    color: 'text-blue-500',   bg: 'bg-blue-500/10',   border: 'border-blue-500/20' },
  Backend:  { icon: Code2,    color: 'text-green-500',  bg: 'bg-green-500/10',  border: 'border-green-500/20' },
  Database: { icon: Database, color: 'text-purple-500', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
  Tools:    { icon: Wrench,   color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
  Other:    { icon: Star,     color: 'text-pink-500',   bg: 'bg-pink-500/10',   border: 'border-pink-500/20' },
};

const HERO_TEXTS = [
  'Full Stack Developer',
  'React & Node.js Expert',
  'API Builder',
  'Problem Solver',
];

const TESTIMONIALS = [
  {
    feedback: 'Samuel helped us launch a strong MVP in under a month with exceptional product focus and polish.',
    author: 'Amina Kayitesi', role: 'Founder, Kivu Labs', rating: 5,
  },
  {
    feedback: 'The product interface is clean, performant, and easy to maintain — the team loves working with him.',
    author: 'Jean Mukamana', role: 'Product Lead, Kigali Finance', rating: 5,
  },
  {
    feedback: 'Reliable, detail-oriented, and responsive — Samuel consistently delivered quality code.',
    author: 'Emily S.', role: 'CTO, LearnHub Rwanda', rating: 5,
  },
];

function getVisitorId() {
  let id = localStorage.getItem('_vid');
  if (!id) {
    id = Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem('_vid', id);
  }
  return id;
}

function StarRating({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star key={i} size={13} className={i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300 dark:text-slate-600'} />
      ))}
    </div>
  );
}

function SectionHeader({ title, subtitle }) {
  return (
    <div className="text-center mb-14 reveal">
      <h2 className="section-title">{title}</h2>
      {subtitle && <p className="section-sub">{subtitle}</p>}
    </div>
  );
}

function SkeletonCard({ className = '' }) {
  return <div className={`rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse ${className}`} />;
}

export default function Home() {
  const [projects, setProjects]       = useState([]);
  const [certificates, setCerts]      = useState([]);
  const [profile, setProfile]         = useState(null);
  const [skills, setSkills]           = useState([]);
  const [education, setEducation]     = useState([]);
  const [experience, setExperience]   = useState([]);
  const [loading, setLoading]         = useState(true);
  const [techFilter, setTechFilter]   = useState('All');
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '', honeypot: '' });
  const [sending, setSending]         = useState(false);

  // Track page view once
  useEffect(() => {
    analyticsApi.track({ page: '/', visitorId: getVisitorId() }).catch(() => {});
  }, []);

  // Load all data
  useEffect(() => {
    const load = async () => {
      try {
        const [projRes, certRes, profRes, skillRes, eduRes, expRes] = await Promise.all([
          projectsApi.getAll(true),
          certificatesApi.getAll(),
          profileApi.get(),
          skillsApi.getAll(),
          educationApi.getAll(),
          experienceApi.getAll(),
        ]);
        setProjects(projRes.data.data ?? []);
        setCerts(certRes.data.data ?? []);
        setProfile(profRes.data.data ?? null);
        setSkills(skillRes.data.data ?? []);
        setEducation(eduRes.data.data ?? []);
        setExperience(expRes.data.data ?? []);
      } catch {
        toast.error('Failed to load some data');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Scroll-reveal: observe all .reveal elements, re-run when data loads
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal:not(.visible)').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, [loading]);

  // Group skills by category
  const skillsByCategory = skills.reduce((acc, s) => {
    (acc[s.category] = acc[s.category] || []).push(s);
    return acc;
  }, {});

  // Tech filter options from project data
  const allTechs = ['All', ...new Set(projects.flatMap(p => p.techStack || []))].slice(0, 9);
  const filteredProjects = techFilter === 'All'
    ? projects
    : projects.filter(p => p.techStack?.includes(techFilter));

  const handleContact = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await contactApi.send(contactForm);
      toast.success("Message sent! I'll reply soon.");
      setContactForm({ name: '', email: '', message: '', honeypot: '' });
      analyticsApi.track({ page: '/contact', visitorId: getVisitorId(), event: 'contact_form' }).catch(() => {});
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to send. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const social = profile?.socialLinks ?? {};

  const trackResume = useCallback(() => {
    analyticsApi.track({ page: '/', visitorId: getVisitorId(), event: 'resume_download' }).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <WhatsAppButton />

      {/* ═══════════════════════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════════════════════ */}
      <section
        id="hero"
        className="relative min-h-screen flex items-center pt-16 px-6 overflow-hidden bg-slate-950"
      >
        <StarBackground />
        {/* Mesh gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900/90 to-blue-950/40 pointer-events-none" />
        {/* Radial glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-blue-500/5 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto w-full py-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left — text */}
            <div className="animate-slide-up">
              {/* Availability pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-medium mb-7">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                {profile?.availability || 'Available for Work'}
              </div>

              <h1 className="text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-[1.1] mb-4 text-white">
                Hi, I'm{' '}
                <span className="text-gradient">
                  {profile?.name?.split(' ')[0] || 'Samuel'}
                </span>
              </h1>

              <div className="text-2xl lg:text-3xl font-semibold text-slate-300 mb-5 min-h-[2.5rem]">
                <TypingText texts={HERO_TEXTS} />
              </div>

              <p className="text-slate-400 leading-relaxed mb-8 max-w-lg">
                {profile?.bio ||
                  'Building tools used by 500+ users across Africa. From AI-powered language tutors to civic engagement platforms — I write code that creates real impact.'}
              </p>

              <div className="flex flex-wrap gap-3 mb-12">
                <a
                  href="#projects"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-600
                             text-white font-medium transition-all shadow-lg shadow-blue-500/25
                             hover:shadow-blue-500/40 hover:-translate-y-0.5"
                >
                  View My Work <ChevronRight size={16} />
                </a>
                <a
                  href="/resume.pdf"
                  download
                  onClick={trackResume}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl
                             border border-slate-600 text-slate-300
                             hover:border-blue-500 hover:text-blue-400 font-medium
                             transition-all hover:-translate-y-0.5"
                >
                  <Download size={16} /> Resume
                </a>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-10">
                {[
                  { value: projects.length || 12, suffix: '+', label: 'Projects Built' },
                  { value: profile?.yearsOfExperience || 2, suffix: '+', label: 'Years Experience' },
                  { value: certificates.length || 8, suffix: '',  label: 'Certifications' },
                ].map(({ value, suffix, label }) => (
                  <div key={label}>
                    <p className="text-4xl font-extrabold text-white stat-num">
                      <CountUp end={value} suffix={suffix} />
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5 tracking-wide uppercase">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — avatar */}
            <div className="hidden lg:flex justify-center animate-slide-up-d2">
              <div className="relative">
                {/* Outer glow ring */}
                <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-blue-500/30 to-cyan-500/20 blur-2xl" />
                <div className="relative w-80 h-80 rounded-[2rem] overflow-hidden border border-blue-500/20 shadow-2xl bg-slate-900">
                  {profile?.avatar ? (
                    <img
                      src={profile.avatar}
                      alt={profile.name || 'Profile'}
                      className="w-full h-full object-cover"
                      loading="eager"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-8xl font-black text-blue-500/15 select-none">SA</span>
                    </div>
                  )}
                </div>
                {profile?.location && (
                  <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 card-glass px-4 py-2 shadow-xl rounded-full flex items-center gap-2 whitespace-nowrap">
                    <MapPin size={13} className="text-blue-400" />
                    <span className="text-sm font-medium text-slate-800 dark:text-white">{profile.location}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-float">
          <div className="w-6 h-10 rounded-full border-2 border-slate-600 flex items-start justify-center p-1.5">
            <div className="w-1 h-2.5 bg-slate-400 rounded-full animate-[slideUp_1.5s_ease-in-out_infinite]" />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          PROJECTS
      ═══════════════════════════════════════════════════════════ */}
      <section id="projects" className="section bg-white dark:bg-slate-800/20">
        <div className="container-max">
          <SectionHeader title="Featured Projects" subtitle="Things I've built and shipped" />

          {/* Tech filter pills */}
          {allTechs.length > 1 && (
            <div className="flex flex-wrap gap-2 justify-center mb-10 reveal">
              {allTechs.map(tech => (
                <button
                  key={tech}
                  onClick={() => setTechFilter(tech)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${
                    techFilter === tech
                      ? 'bg-blue-500 text-white border-blue-500 shadow-lg shadow-blue-500/20'
                      : 'border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-blue-400 hover:text-blue-500'
                  }`}
                >
                  {tech}
                </button>
              ))}
            </div>
          )}

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => <SkeletonCard key={i} className="h-64" />)}
            </div>
          ) : filteredProjects.length === 0 ? (
            <p className="text-center text-slate-500 py-12">No projects for this filter.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((p, i) => (
                <div key={p._id} className={`reveal reveal-d${Math.min(i + 1, 4)}`}>
                  <ProjectCard project={p} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SKILLS
      ═══════════════════════════════════════════════════════════ */}
      <section id="skills" className="section">
        <div className="container-max">
          <SectionHeader title="Skills & Tech Stack" subtitle="Technologies I work with daily" />

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => <SkeletonCard key={i} className="h-48" />)}
            </div>
          ) : Object.keys(skillsByCategory).length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.entries(skillsByCategory).map(([cat, catSkills], i) => {
                const cfg = CATEGORY_CFG[cat] || CATEGORY_CFG.Other;
                const Icon = cfg.icon;
                return (
                  <div
                    key={cat}
                    className={`reveal reveal-d${Math.min(i + 1, 4)} card-glass glow-hover p-6 border ${cfg.border}`}
                  >
                    <div className={`inline-flex items-center gap-2 ${cfg.bg} rounded-xl px-3 py-2 mb-5`}>
                      <Icon size={15} className={cfg.color} />
                      <span className={`text-sm font-semibold ${cfg.color}`}>{cat}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {catSkills.map(skill => (
                        <span
                          key={skill._id}
                          className={`px-3 py-1 rounded-full text-xs font-medium ${cfg.bg} ${cfg.color} border ${cfg.border} hover:scale-105 transition-transform cursor-default select-none`}
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Fallback static skills when DB is empty */
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.entries({
                Frontend: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
                Backend:  ['Node.js', 'Express', 'Python'],
                Database: ['PostgreSQL', 'MongoDB', 'Redis'],
                Tools:    ['Git', 'Docker', 'AWS'],
              }).map(([cat, items], i) => {
                const cfg = CATEGORY_CFG[cat];
                const Icon = cfg.icon;
                return (
                  <div key={cat} className={`reveal reveal-d${Math.min(i + 1, 4)} card-glass glow-hover p-6 border ${cfg.border}`}>
                    <div className={`inline-flex items-center gap-2 ${cfg.bg} rounded-xl px-3 py-2 mb-5`}>
                      <Icon size={15} className={cfg.color} />
                      <span className={`text-sm font-semibold ${cfg.color}`}>{cat}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {items.map(s => (
                        <span key={s} className={`px-3 py-1 rounded-full text-xs font-medium ${cfg.bg} ${cfg.color} border ${cfg.border}`}>{s}</span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          EXPERIENCE
      ═══════════════════════════════════════════════════════════ */}
      <section id="experience" className="section bg-white dark:bg-slate-800/20">
        <div className="container-max">
          <SectionHeader title="Work Experience" subtitle="My professional journey" />
          {loading ? (
            <div className="space-y-6 max-w-3xl mx-auto">
              {[1, 2].map(i => <SkeletonCard key={i} className="h-36" />)}
            </div>
          ) : experience.length > 0 ? (
            <div className="max-w-3xl mx-auto">
              <Timeline items={experience} type="experience" />
            </div>
          ) : (
            <p className="text-center text-slate-500 text-sm py-8">No experience entries yet.</p>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          EDUCATION
      ═══════════════════════════════════════════════════════════ */}
      <section id="education" className="section">
        <div className="container-max">
          <SectionHeader title="Education" subtitle="My academic background" />
          {loading ? (
            <div className="space-y-6 max-w-3xl mx-auto">
              {[1, 2].map(i => <SkeletonCard key={i} className="h-28" />)}
            </div>
          ) : education.length > 0 ? (
            <div className="max-w-3xl mx-auto">
              <Timeline items={education} type="education" />
            </div>
          ) : (
            <p className="text-center text-slate-500 text-sm py-8">No education entries yet.</p>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          CERTIFICATES
      ═══════════════════════════════════════════════════════════ */}
      <section id="certificates" className="section bg-white dark:bg-slate-800/20">
        <div className="container-max">
          <SectionHeader title="Certificates" subtitle="Credentials and certifications earned" />
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => <SkeletonCard key={i} className="h-48" />)}
            </div>
          ) : certificates.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {certificates.map((cert, i) => (
                <div key={cert._id} className={`reveal reveal-d${Math.min(i + 1, 4)}`}>
                  <CertificateCard certificate={cert} />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-slate-500 text-sm py-8">No certificates added yet.</p>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          TESTIMONIALS
      ═══════════════════════════════════════════════════════════ */}
      <section id="testimonials" className="section">
        <div className="container-max">
          <SectionHeader title="Testimonials" subtitle="What clients and colleagues say" />
          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className={`reveal reveal-d${i + 1} card-glass glow-hover p-6`}>
                <StarRating rating={t.rating} />
                <p className="text-sm italic mt-3 mb-4 text-slate-600 dark:text-slate-400 leading-relaxed">
                  "{t.feedback}"
                </p>
                <div className="pt-3 border-t border-slate-200 dark:border-slate-700/60">
                  <p className="font-semibold text-sm text-slate-900 dark:text-white">{t.author}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          CONTACT
      ═══════════════════════════════════════════════════════════ */}
      <section id="contact" className="section bg-white dark:bg-slate-800/20">
        <div className="container-max">
          <SectionHeader title="Get In Touch" subtitle="Have a project in mind? Let's talk." />

          <div className="grid lg:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {/* Contact form */}
            <form onSubmit={handleContact} className="reveal space-y-4">
              {/* Honeypot (hidden from real users) */}
              <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
                value={contactForm.honeypot}
                onChange={e => setContactForm(f => ({ ...f, honeypot: e.target.value }))}
              />

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Name
                </label>
                <input
                  required
                  value={contactForm.name}
                  onChange={e => setContactForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Your full name"
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Email
                </label>
                <input
                  required
                  type="email"
                  value={contactForm.email}
                  onChange={e => setContactForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="you@example.com"
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Message
                </label>
                <textarea
                  required
                  rows={5}
                  value={contactForm.message}
                  onChange={e => setContactForm(f => ({ ...f, message: e.target.value }))}
                  placeholder="Tell me about your project..."
                  className="input resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl
                           bg-blue-500 hover:bg-blue-600 disabled:opacity-60 text-white font-medium
                           transition-all shadow-lg shadow-blue-500/20 hover:-translate-y-0.5"
              >
                {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                {sending ? 'Sending…' : 'Send Message'}
              </button>
            </form>

            {/* Contact info */}
            <div className="reveal reveal-d2 space-y-7">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Connect with me</h3>
                <div className="flex flex-wrap gap-3">
                  {social.github && (
                    <a href={social.github} target="_blank" rel="noopener noreferrer"
                      className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-500 hover:text-white text-slate-700 dark:text-slate-300 transition-all hover:scale-110">
                      <Github size={20} />
                    </a>
                  )}
                  {social.linkedin && (
                    <a href={social.linkedin} target="_blank" rel="noopener noreferrer"
                      className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-500 hover:text-white text-slate-700 dark:text-slate-300 transition-all hover:scale-110">
                      <Linkedin size={20} />
                    </a>
                  )}
                  {social.twitter && (
                    <a href={social.twitter} target="_blank" rel="noopener noreferrer"
                      className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-500 hover:text-white text-slate-700 dark:text-slate-300 transition-all hover:scale-110">
                      <Twitter size={20} />
                    </a>
                  )}
                  {profile?.email && (
                    <a href={`mailto:${profile.email}`}
                      className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-500 hover:text-white text-slate-700 dark:text-slate-300 transition-all hover:scale-110">
                      <Mail size={20} />
                    </a>
                  )}
                </div>
              </div>

              {profile?.email && (
                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                  <Mail size={16} className="text-blue-500 shrink-0" />
                  <a href={`mailto:${profile.email}`} className="hover:text-blue-500 transition-colors text-sm">
                    {profile.email}
                  </a>
                </div>
              )}

              {profile?.location && (
                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                  <MapPin size={16} className="text-blue-500 shrink-0" />
                  <span className="text-sm">{profile.location}</span>
                </div>
              )}

              <a
                href="/resume.pdf"
                download
                onClick={trackResume}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-blue-500/30
                           text-blue-500 hover:bg-blue-500 hover:text-white transition-all text-sm font-medium
                           hover:-translate-y-0.5"
              >
                <Download size={16} /> Download Resume
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer profile={profile} />
    </div>
  );
}
