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
  Frontend: { icon: Globe, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
  Backend: { icon: Code2, color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/20' },
  Database: { icon: Database, color: 'text-purple-500', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
  Tools: { icon: Wrench, color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
  Other: { icon: Star, color: 'text-pink-500', bg: 'bg-pink-500/10', border: 'border-pink-500/20' },
};

const HERO_TEXTS = ['Full Stack Developer', 'React & Node.js Expert', 'API Builder', 'Problem Solver'];

const TESTIMONIALS = [
  { feedback: 'Samuel helped us launch a strong MVP in under a month.', author: 'Amina Kayitesi', role: 'Founder, Kivu Labs', rating: 5 },
  { feedback: 'The product interface is clean, performant, and easy to maintain.', author: 'Jean Mukamana', role: 'Product Lead', rating: 5 },
  { feedback: 'Reliable, detail-oriented, and responsive — Samuel consistently delivered.', author: 'Emily S.', role: 'CTO, LearnHub Rwanda', rating: 5 },
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
      <h2 className="text-3xl md:text-4xl font-bold">{title}</h2>
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
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '', honeypot: '' });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    analyticsApi.track({ page: '/', visitorId: getVisitorId() }).catch(() => {});
  }, []);

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
      } catch (err) {
        toast.error('Failed to load some data');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal:not(.visible)').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, [loading]);

  const skillsByCategory = skills.reduce((acc, s) => {
    (acc[s.category] = acc[s.category] || []).push(s);
    return acc;
  }, {});

  const allTechs = ['All', ...new Set(projects.flatMap(p => p.techStack || []))].slice(0, 9);
  const filteredProjects = techFilter === 'All' ? projects : projects.filter(p => p.techStack?.includes(techFilter));

  const handleContact = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await contactApi.send(contactForm);
      toast.success("Message sent! I'll reply soon.");
      setContactForm({ name: '', email: '', message: '', honeypot: '' });
      analyticsApi.track({ page: '/contact', visitorId: getVisitorId(), event: 'contact_form' }).catch(() => {});
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to send');
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

      {/* Hero Section */}
      <section id="hero" className="relative min-h-screen flex items-center pt-16 px-6 overflow-hidden bg-slate-950">
        <StarBackground />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900/90 to-blue-950/40 pointer-events-none" />
        <div className="relative z-10 max-w-6xl mx-auto w-full py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-medium mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                {profile?.availability || 'Available for Work'}
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.1] mb-3 text-white">
                Hi, I'm <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">{profile?.name?.split(' ')[0] || 'Samuel'}</span>
              </h1>
              <div className="text-xl md:text-2xl lg:text-3xl font-semibold text-slate-300 mb-4">
                <TypingText texts={HERO_TEXTS} />
              </div>
              <p className="text-slate-400 leading-relaxed mb-6 max-w-lg">
                {profile?.bio || 'Building tools used by 500+ users across Africa. I write code that creates real impact.'}
              </p>
              <div className="flex flex-wrap gap-3 mb-10">
                <a href="#projects" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-medium transition-all">View My Work <ChevronRight size={16} /></a>
                <a href={profile?.resumeUrl || '/resume.pdf'} download onClick={trackResume} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-600 text-slate-300 hover:border-blue-500 hover:text-blue-400 transition-all">Download Resume</a>
              </div>
              <div className="flex flex-wrap gap-8">
                <div><p className="text-3xl font-extrabold text-white"><CountUp end={projects.length || 12} suffix="+" /></p><p className="text-xs text-slate-500">Projects Built</p></div>
                <div><p className="text-3xl font-extrabold text-white"><CountUp end={profile?.yearsOfExperience || 2} suffix="+" /></p><p className="text-xs text-slate-500">Years Experience</p></div>
                <div><p className="text-3xl font-extrabold text-white"><CountUp end={certificates.length || 8} suffix="" /></p><p className="text-xs text-slate-500">Certifications</p></div>
              </div>
            </div>
            <div className="hidden lg:flex justify-center">
              <div className="relative animate-float">
                <div className="relative w-80 h-80 rounded-[2rem] overflow-hidden border border-blue-500/20 shadow-2xl bg-slate-900">
                  {profile?.avatar ? <img src={profile.avatar} alt="Profile" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><span className="text-8xl font-black text-blue-500/15">SA</span></div>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-24 px-6 bg-white dark:bg-slate-800/20">
        <div className="max-w-6xl mx-auto">
          <SectionHeader title="Featured Projects" subtitle="Things I've built and shipped" />
          {allTechs.length > 1 && (
            <div className="flex flex-wrap gap-2 justify-center mb-10">
              {allTechs.map(tech => (
                <button key={tech} onClick={() => setTechFilter(tech)} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${techFilter === tech ? 'bg-blue-500 text-white' : 'border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-blue-400 hover:text-blue-500'}`}>
                  {tech}
                </button>
              ))}
            </div>
          )}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map(p => <ProjectCard key={p._id} project={p} />)}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <SectionHeader title="Skills & Tech Stack" subtitle="Technologies I work with daily" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(skillsByCategory).map(([cat, catSkills]) => {
              const cfg = CATEGORY_CFG[cat] || CATEGORY_CFG.Other;
              const Icon = cfg.icon;
              return (
                <div key={cat} className="card-glass p-6 border rounded-2xl">
                  <div className="mb-4 pb-2 border-b">
                    <div className={`inline-flex items-center gap-2 ${cfg.bg} rounded-xl px-3 py-2`}>
                      <Icon size={16} className={cfg.color} />
                      <h3 className={`font-bold ${cfg.color}`}>{cat}</h3>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {catSkills.map(skill => <span key={skill._id} className={`px-3 py-1.5 rounded-full text-xs font-medium ${cfg.bg} ${cfg.color} border`}>{skill.name}</span>)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-24 px-6 bg-white dark:bg-slate-800/20">
        <div className="max-w-6xl mx-auto">
          <SectionHeader title="Work Experience" subtitle="My professional journey" />
          {experience.length > 0 ? <Timeline items={experience} type="experience" /> : <p className="text-center text-slate-500">No experience entries yet.</p>}
        </div>
      </section>

      {/* Education Section */}
      <section id="education" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <SectionHeader title="Education" subtitle="My academic background" />
          {education.length > 0 ? <Timeline items={education} type="education" /> : <p className="text-center text-slate-500">No education entries yet.</p>}
        </div>
      </section>

      {/* Certificates Section */}
      <section id="certificates" className="py-24 px-6 bg-white dark:bg-slate-800/20">
        <div className="max-w-6lx mx-auto">
          <SectionHeader title="Certificates" subtitle="Credentials and certifications earned" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map(cert => <CertificateCard key={cert._id} certificate={cert} />)}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <SectionHeader title="Testimonials" subtitle="What clients and colleagues say" />
          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="card-glass p-6 rounded-2xl">
                <StarRating rating={t.rating} />
                <p className="text-sm italic mt-3 mb-4">"{t.feedback}"</p>
                <div className="pt-3 border-t">
                  <p className="font-semibold text-sm">{t.author}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 px-6 bg-white dark:bg-slate-800/20">
        <div className="max-w-6xl mx-auto">
          <SectionHeader title="Get In Touch" subtitle="Have a project in mind? Let's talk." />
          <div className="grid lg:grid-cols-2 gap-12 max-w-4xl mx-auto">
            <form onSubmit={handleContact} className="space-y-4">
              <input type="text" tabIndex={-1} autoComplete="off" className="hidden" />
              <div><input required placeholder="Your name" value={contactForm.name} onChange={e => setContactForm(f => ({ ...f, name: e.target.value }))} className="w-full px-4 py-3 rounded-xl border dark:bg-slate-800" /></div>
              <div><input required type="email" placeholder="Your email" value={contactForm.email} onChange={e => setContactForm(f => ({ ...f, email: e.target.value }))} className="w-full px-4 py-3 rounded-xl border dark:bg-slate-800" /></div>
              <div><textarea required rows={5} placeholder="Your message" value={contactForm.message} onChange={e => setContactForm(f => ({ ...f, message: e.target.value }))} className="w-full px-4 py-3 rounded-xl border dark:bg-slate-800 resize-none" /></div>
              <button type="submit" disabled={sending} className="w-full py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-medium transition-all">{sending ? 'Sending...' : 'Send Message'}</button>
            </form>
            <div className="space-y-6">
              <div><h3 className="font-semibold mb-4">Connect with me</h3><div className="flex flex-wrap gap-3">{social.github && <a href={social.github} target="_blank" className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-500 hover:text-white"><Github size={20} /></a>}{social.linkedin && <a href={social.linkedin} target="_blank" className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-500 hover:text-white"><Linkedin size={20} /></a>}{social.twitter && <a href={social.twitter} target="_blank" className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-500 hover:text-white"><Twitter size={20} /></a>}{profile?.email && <a href={`mailto:${profile.email}`} className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-500 hover:text-white"><Mail size={20} /></a>}</div></div>
              {profile?.location && <div className="flex items-center gap-3"><MapPin size={16} className="text-blue-500" /><span>{profile.location}</span></div>}
              {profile?.email && <div className="flex items-center gap-3"><Mail size={16} className="text-blue-500" /><a href={`mailto:${profile.email}`}>{profile.email}</a></div>}
            </div>
          </div>
        </div>
      </section>

      <Footer profile={profile} />
    </div>
  );
}
