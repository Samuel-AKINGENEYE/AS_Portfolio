import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import {
  Github, Linkedin, Twitter, Mail, MapPin, Download, Send,
  Code2, Database, Wrench, Globe, ChevronRight, Star, Loader2,
  Home as HomeIcon, Layers, Award,
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
import SkillIcon from '../components/SkillIcon.jsx';
import {
  projectsApi, certificatesApi, profileApi, skillsApi,
  educationApi, experienceApi, analyticsApi, contactApi,
} from '../services/api.js';

const HERO_TEXTS = ['Full Stack Developer', 'React & Node.js Expert', 'API Builder', 'Problem Solver'];

const TESTIMONIALS = [
  { feedback: 'Samuel helped us launch a strong MVP in under a month.', author: 'Amina Kayitesi', role: 'Founder, Kivu Labs', rating: 5 },
  { feedback: 'The product interface is clean, performant, and easy to maintain.', author: 'Jean Mukamana', role: 'Product Lead', rating: 5 },
  { feedback: 'Reliable, detail-oriented, and responsive — Samuel consistently delivered.', author: 'Emily S.', role: 'CTO, LearnHub Rwanda', rating: 5 },
];

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

function StarRating({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star key={i} size={13} className={i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300 dark:text-slate-600'} />
      ))}
    </div>
  );
}

function SectionHeader({ title, subtitle, className = '' }) {
  return (
    <div className={`text-center mb-12 reveal ${className}`}>
      <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">{title}</h2>
      {subtitle && <p className="text-slate-500 dark:text-slate-400 mt-3">{subtitle}</p>}
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
  const [techFilter, setTechFilter] = useState('All');
  const [certFilter, setCertFilter] = useState('All');
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '', honeypot: '' });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    analyticsApi.track({ page: '/', visitorId: getVisitorId() }).catch(() => {});
  }, []);

  useEffect(() => {
    const load = async () => {
      const results = await Promise.allSettled([
        projectsApi.getAll(true),
        certificatesApi.getAll(),
        profileApi.get(),
        skillsApi.getAll(),
        educationApi.getAll(),
        experienceApi.getAll(),
      ]);

      const val = (i) => results[i].status === 'fulfilled' ? results[i].value.data.data : null;
      const failed = results.filter((r) => r.status === 'rejected');

      if (val(0) !== null) setProjects(val(0) ?? []);
      if (val(1) !== null) setCerts(val(1) ?? []);
      if (val(2) !== null) setProfile(val(2));
      if (val(3) !== null) setSkills(val(3) ?? []);
      if (val(4) !== null) setEducation(val(4) ?? []);
      if (val(5) !== null) setExperience(val(5) ?? []);

      if (failed.length === results.length) {
        toast.error('Failed to load portfolio data. Please refresh.');
      } else if (failed.length > 0) {
        toast.error('Some data failed to load.');
      }

      setLoading(false);
    };
    load();
  }, []);

  // Don't block on cold-start API delays beyond 3 s
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(t);
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

  const projectCount = projects.length;
  const certificateCount = certificates.length;
  const skillCount = skills.length;
  const experienceCount = experience.length;

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
        <p className="text-sm text-slate-400 animate-pulse tracking-wide">Loading portfolio…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-300 pb-16 md:pb-0">
      <Navbar />
      <WhatsAppButton />

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center pt-16 px-6 overflow-hidden bg-gradient-to-br from-white via-slate-50 to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-950 transition-colors duration-300">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-blue-500/5 dark:bg-blue-500/10 blur-3xl" />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto w-full py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left — text */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 dark:bg-blue-500/20 border border-blue-500/20 text-blue-600 dark:text-blue-300 text-xs font-medium mb-6 animate-slide-up">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                {profile?.availability || 'Available for Work'}
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.1] mb-3 text-slate-900 dark:text-white animate-slide-up-d1">
                Hi, I'm{' '}
                <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                  {profile?.name?.split(' ')[0] || 'Samuel'}
                </span>
              </h1>
              <div className="text-xl md:text-2xl lg:text-3xl font-semibold text-slate-600 dark:text-slate-300 mb-4 animate-slide-up-d2">
                <TypingText texts={HERO_TEXTS} />
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6 max-w-lg animate-slide-up-d3">
                {profile?.bio || 'Building tools used by 500+ users across Africa. I write code that creates real impact.'}
              </p>
              <div className="flex flex-wrap gap-3 mb-6 animate-slide-up-d4">
                <a href="#projects" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-medium transition-all">
                  View My Work <ChevronRight size={16} />
                </a>
                <a href="#contact" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:border-blue-500 hover:text-blue-500 transition-all">
                  Contact Me
                </a>
              </div>

              {/* Mobile profile card — only shown on small screens */}
              <div className="lg:hidden flex items-center gap-4 p-4 rounded-2xl bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 animate-slide-up-d4">
                {profile?.avatar ? (
                  <img
                    src={profile.avatar}
                    alt={profile?.name || 'Profile'}
                    className="w-14 h-14 rounded-full object-cover border-2 border-blue-500/30 shrink-0"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center shrink-0">
                    <span className="text-xl font-bold text-blue-500/40 select-none">SA</span>
                  </div>
                )}
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white text-sm">
                    {profile?.name || 'Samuel AKINGENEYE'}
                  </p>
                  {profile?.location && (
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin size={11} className="text-blue-500" />
                      {profile.location}
                    </p>
                  )}
                  <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    {profile?.availability || 'Available for work'}
                  </p>
                </div>
              </div>
            </div>

            {/* Right — floating avatar (desktop only) */}
            <div className="hidden lg:flex justify-center animate-slide-right">
              <div className="relative animate-float">
                <div className="relative w-80 h-80 rounded-[2rem] overflow-hidden border border-blue-500/20 shadow-2xl bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-900">
                  {profile?.avatar
                    ? <img src={profile.avatar} alt="Profile" className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center"><span className="text-8xl font-black text-blue-500/30 dark:text-blue-500/20">SA</span></div>
                  }
                </div>
                {profile?.location && (
                  <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg flex items-center gap-2 whitespace-nowrap border border-slate-200 dark:border-slate-700">
                    <MapPin size={14} className="text-blue-500" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{profile.location}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────────────── */}
      <section className="py-14 px-6 bg-slate-50 dark:bg-slate-800/20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { end: projectCount, suffix: '+', label: 'Projects Built', color: 'text-blue-500', delay: 'reveal-d1' },
              { end: certificateCount, suffix: '', label: 'Certifications', color: 'text-green-500', delay: 'reveal-d2' },
              { end: skillCount, suffix: '', label: 'Skills', color: 'text-purple-500', delay: 'reveal-d3' },
              { end: experienceCount, suffix: '', label: 'Years Active', color: 'text-orange-500', delay: 'reveal-d4' },
            ].map(({ end, suffix, label, color, delay }) => (
              <div key={label} className={`text-center p-5 md:p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 reveal ${delay}`}>
                <p className={`text-3xl md:text-4xl font-bold ${color}`}><CountUp end={end} />{suffix}</p>
                <p className="text-xs md:text-sm text-slate-500 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Projects ─────────────────────────────────────────────────── */}
      <section id="projects" className="py-16 md:py-24 px-6 bg-white dark:bg-slate-900">
        <div className="max-w-6xl mx-auto">
          <SectionHeader title="Featured Projects" subtitle="Things I've built and shipped" />
          {allTechs.length > 1 && (
            <div className="flex flex-wrap gap-2 justify-center mb-10">
              {allTechs.map(tech => (
                <button
                  key={tech}
                  onClick={() => setTechFilter(tech)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${
                    techFilter === tech
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-blue-400 hover:text-blue-500'
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

      {/* ── Skills ───────────────────────────────────────────────────── */}
      <section id="skills" className="py-16 md:py-24 px-6 bg-slate-50 dark:bg-slate-800/20">
        <div className="max-w-6xl mx-auto">
          <SectionHeader title="Skills" subtitle="Technologies and tools I work with" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {hasApiSkills
              ? Object.entries(skillsByCategory).map(([category, items], idx) => (
                  <div key={category} className={`bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 reveal reveal-d${Math.min(idx + 1, 6)}`}>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 pb-2 border-b border-slate-200 dark:border-slate-700 text-center sm:text-left">{category}</h3>
                    <ul className="space-y-3">
                      {[...items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).map(s => (
                        <li key={s._id} className="text-slate-600 dark:text-slate-400 text-sm flex items-center justify-center sm:justify-start gap-3">
                          <SkillIcon name={s.name} size={18} />
                          {s.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
              : STATIC_SKILLS.map(({ category, items }, idx) => (
                  <div key={category} className={`bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 reveal reveal-d${idx + 1}`}>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 pb-2 border-b border-slate-200 dark:border-slate-700 text-center sm:text-left">{category}</h3>
                    <ul className="space-y-3">
                      {items.map(name => (
                        <li key={name} className="text-slate-600 dark:text-slate-400 text-sm flex items-center justify-center sm:justify-start gap-3">
                          <SkillIcon name={name} size={18} />
                          {name}
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
          <SectionHeader title="Work Experience" subtitle="My professional journey" />
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
          <SectionHeader title="Education" subtitle="My academic background" />
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
          <SectionHeader title="Certificates" subtitle="Credentials and certifications earned" />
          {allCertCategories.length > 1 && (
            <div className="flex flex-wrap gap-2 justify-center mb-10">
              {allCertCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCertFilter(cat)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${
                    certFilter === cat
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-blue-400 hover:text-blue-500'
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

      {/* ── Testimonials ─────────────────────────────────────────────── */}
      <section id="testimonials" className="py-16 md:py-24 px-6 bg-slate-50 dark:bg-slate-800/20">
        <div className="max-w-6xl mx-auto">
          <SectionHeader title="Testimonials" subtitle="What clients and colleagues say" />
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className={`bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm reveal reveal-d${i + 1}`}>
                <StarRating rating={t.rating} />
                <p className="text-sm italic mt-3 mb-4 text-slate-600 dark:text-slate-400">"{t.feedback}"</p>
                <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                  <p className="font-semibold text-sm text-slate-900 dark:text-white">{t.author}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact ──────────────────────────────────────────────────── */}
      <section id="contact" className="py-16 md:py-24 px-6 bg-white dark:bg-slate-900">
        <div className="max-w-6xl mx-auto">
          <SectionHeader title="Get In Touch" subtitle="Have a project in mind? Let's talk." />
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
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              />
              <input
                required type="email" placeholder="Your email"
                value={contactForm.email}
                onChange={e => setContactForm(f => ({ ...f, email: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              />
              <textarea
                required rows={5} placeholder="Your message"
                value={contactForm.message}
                onChange={e => setContactForm(f => ({ ...f, message: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              />
              <button
                type="submit" disabled={sending}
                className="w-full py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-medium transition-all disabled:opacity-60"
              >
                {sending ? 'Sending...' : 'Send Message'}
              </button>
            </form>

            {/* Connect + resume */}
            <div className="space-y-5 reveal reveal-d2">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Connect with me</h3>
                <div className="flex flex-wrap gap-3">
                  {social.github && <a href={social.github} target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-500 hover:text-white transition-all"><Github size={20} /></a>}
                  {social.linkedin && <a href={social.linkedin} target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-500 hover:text-white transition-all"><Linkedin size={20} /></a>}
                  {social.twitter && <a href={social.twitter} target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-500 hover:text-white transition-all"><Twitter size={20} /></a>}
                  {profile?.email && <a href={`mailto:${profile.email}`} className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-500 hover:text-white transition-all"><Mail size={20} /></a>}
                </div>
              </div>
              {profile?.location && (
                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                  <MapPin size={16} className="text-blue-500" />
                  <span>{profile.location}</span>
                </div>
              )}
              {profile?.email && (
                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                  <Mail size={16} className="text-blue-500" />
                  <a href={`mailto:${profile.email}`} className="hover:text-blue-500">{profile.email}</a>
                </div>
              )}

              {/* Resume button — uses admin-uploaded PDF when available */}
              {profile?.resumeUrl && (
                <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                  <button
                    onClick={handleResumeDownload}
                    className="inline-flex items-center justify-center w-full gap-2 px-6 py-3 rounded-xl bg-white dark:bg-slate-800 border-2 border-blue-500/20 text-blue-500 hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all duration-200 font-medium"
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
