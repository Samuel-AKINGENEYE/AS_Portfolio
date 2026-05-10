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
    <div className="text-center mb-14">
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

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-300">
      <Navbar />
      <WhatsAppButton />

      {/* Hero Section - Fixed Dark Mode */}
      <section className="relative min-h-screen flex items-center pt-16 px-6 overflow-hidden bg-gradient-to-br from-white via-slate-50 to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-950 transition-colors duration-300">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-blue-500/5 dark:bg-blue-500/10 blur-3xl" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto w-full py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 dark:bg-blue-500/20 border border-blue-500/20 text-blue-600 dark:text-blue-300 text-xs font-medium mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                {profile?.availability || 'Available for Work'}
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.1] mb-3 text-slate-900 dark:text-white">
                Hi, I'm <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">{profile?.name?.split(' ')[0] || 'Samuel'}</span>
              </h1>
              <div className="text-xl md:text-2xl lg:text-3xl font-semibold text-slate-600 dark:text-slate-300 mb-4">
                <TypingText texts={HERO_TEXTS} />
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6 max-w-lg">
                {profile?.bio || 'Building tools used by 500+ users across Africa. I write code that creates real impact.'}
              </p>
              <div className="flex flex-wrap gap-3 mb-10">
                <a href="#projects" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-medium transition-all">View My Work <ChevronRight size={16} /></a>
                <a href={profile?.resumeUrl || '/resume.pdf'} download onClick={trackResume} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:border-blue-500 hover:text-blue-500 transition-all">Download Resume</a>
              </div>
            </div>
            <div className="hidden lg:flex justify-center">
              <div className="relative animate-float">
                <div className="relative w-80 h-80 rounded-[2rem] overflow-hidden border border-blue-500/20 shadow-2xl bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-900">
                  {profile?.avatar ? <img src={profile.avatar} alt="Profile" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><span className="text-8xl font-black text-blue-500/30 dark:text-blue-500/20">SA</span></div>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-24 px-6 bg-slate-50 dark:bg-slate-800/20 transition-colors duration-300">
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

      {/* Additional sections... */}
      <section id="skills" className="py-24 px-6 bg-white dark:bg-slate-900 transition-colors duration-300">
        <div className="max-w-6xl mx-auto">
          <SectionHeader title="Skills & Tech Stack" subtitle="Technologies I work with daily" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(skillsByCategory).map(([cat, catSkills]) => {
              const cfg = CATEGORY_CFG[cat] || CATEGORY_CFG.Other;
              const Icon = cfg.icon;
              return (
                <div key={cat} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
                  <div className="mb-4 pb-2 border-b border-slate-200 dark:border-slate-700">
                    <div className={`inline-flex items-center gap-2 ${cfg.bg} rounded-xl px-3 py-2`}>
                      <Icon size={16} className={cfg.color} />
                      <h3 className={`font-bold ${cfg.color}`}>{cat}</h3>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {catSkills.map(skill => <span key={skill._id} className={`px-3 py-1.5 rounded-full text-xs font-medium ${cfg.bg} ${cfg.color} border ${cfg.border}`}>{skill.name}</span>)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer profile={profile} />
    </div>
  );
}
