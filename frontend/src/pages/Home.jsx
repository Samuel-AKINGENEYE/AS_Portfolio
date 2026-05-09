import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Github, Linkedin, Twitter, Mail, MapPin, Calendar, Briefcase, Code2, Database, Wrench, Globe, Star, StarHalf, MessageSquare, ChevronRight, ArrowDown, Send, Award } from 'lucide-react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import ProjectCard from '../components/ProjectCard.jsx';
import CertificateCard from '../components/CertificateCard.jsx';
import SkillBadge from '../components/SkillBadge.jsx';
import WhatsAppButton from '../components/WhatsAppButton.jsx';
import { projectsApi, certificatesApi, profileApi } from '../services/api.js';

const SKILLS = {
  Frontend: { icon: Globe, color: 'text-blue-500', bg: 'bg-blue-500/10', items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'] },
  Backend: { icon: Code2, color: 'text-green-500', bg: 'bg-green-500/10', items: ['Node.js', 'Express', 'Python'] },
  Database: { icon: Database, color: 'text-purple-500', bg: 'bg-purple-500/10', items: ['PostgreSQL', 'MongoDB', 'Redis'] },
  Tools: { icon: Wrench, color: 'text-orange-500', bg: 'bg-orange-500/10', items: ['Git', 'Docker', 'AWS'] },
};

const TESTIMONIALS = [
  { feedback: 'Samuel helped us launch a strong MVP in under a month with exceptional product focus and polish.', author: 'Amina Kayitesi', role: 'Founder, Kivu Labs', rating: 5 },
  { feedback: 'The product interface is clean, performant, and easy to maintain — the team loves working with him.', author: 'Jean Mukamana', role: 'Product Lead, Kigali Finance', rating: 4.8 },
  { feedback: 'Reliable, detail-oriented, and responsive — Samuel consistently delivered quality code.', author: 'Emily S.', role: 'CTO, LearnHub Rwanda', rating: 5 },
];

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star key={i} size={13} className={i < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300 dark:text-slate-600'} />
      ))}
      <span className="text-xs text-slate-400 ml-1">{rating}/5</span>
    </div>
  );
}

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [projRes, certRes, profRes] = await Promise.all([
          projectsApi.getAll(true),
          certificatesApi.getAll(),
          profileApi.get(),
        ]);
        setProjects(projRes.data.data ?? []);
        setCertificates(certRes.data.data ?? []);
        setProfile(profRes.data.data ?? null);
      } catch (err) {
        console.error('Error loading data:', err);
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const social = profile?.socialLinks ?? {
    github: 'https://github.com/samuel-akingeneye',
    linkedin: 'https://linkedin.com/in/samuel-akingeneye',
    twitter: 'https://twitter.com/samuel_ak',
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <WhatsAppButton />

      {/* Hero Section */}
      <section id="hero" className="relative min-h-screen flex items-center pt-16 px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto w-full py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h1 className="text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white leading-tight mb-4">
                Hi, I'm <span className="text-gradient">Samuel</span>
                <br />
                <span className="text-gradient">AKINGENEYE</span>
              </h1>
              <p className="text-xl font-semibold text-slate-600 dark:text-slate-300 mb-3">Full Stack Developer</p>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-8 max-w-lg">
                Building tools used by 500+ users across Africa. From AI-powered language tutors
                to civic engagement platforms — I write code that creates real impact.
              </p>
              <div className="flex flex-wrap gap-4">
                <a href="#projects" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-medium transition-all">View My Work <ChevronRight size={16} /></a>
                <a href="#contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:border-blue-500 hover:text-blue-500 font-medium transition-all">Contact Me <Mail size={16} /></a>
              </div>
            </div>

            <div className="hidden lg:flex justify-center">
              <div className="relative">
                <div className="w-80 h-80 rounded-3xl overflow-hidden border-2 border-blue-500/30 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center shadow-2xl">
                  {profile?.avatar ? (
                    <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-8xl font-black text-blue-500/20 select-none">SA</span>
                  )}
                </div>
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white dark:bg-slate-800 border rounded-full px-5 py-2 shadow-lg">
                  <span className="text-sm font-medium">{profile?.availability || 'Open to Work'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-24 px-6 bg-white dark:bg-slate-800/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-14">Featured Projects</h2>
          {loading ? (
            <div className="text-center">Loading...</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((p) => <ProjectCard key={p._id} project={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-14">Skills & Tech Stack</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(SKILLS).map(([category, { icon: Icon, color, bg, items }]) => (
              <div key={category} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
                <div className="flex items-center gap-2.5 mb-5">
                  <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center ${color}`}><Icon size={16} /></div>
                  <h3 className="font-semibold">{category}</h3>
                </div>
                <div className="flex flex-wrap gap-2">{items.map((skill) => <SkillBadge key={skill} label={skill} />)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 px-6 bg-white dark:bg-slate-800/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-14">Testimonials</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
                <StarRating rating={t.rating} />
                <p className="text-sm italic mt-3">"{t.feedback}"</p>
                <div className="mt-4 pt-3 border-t"><p className="font-semibold">{t.author}</p><p className="text-xs text-slate-500">{t.role}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-14">Get In Touch</h2>
          <div className="flex justify-center gap-4">
            {social.github && <a href={social.github} target="_blank" className="p-3 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-blue-500 hover:text-white transition-colors"><Github size={20} /></a>}
            {social.linkedin && <a href={social.linkedin} target="_blank" className="p-3 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-blue-500 hover:text-white transition-colors"><Linkedin size={20} /></a>}
            {social.twitter && <a href={social.twitter} target="_blank" className="p-3 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-blue-500 hover:text-white transition-colors"><Twitter size={20} /></a>}
            {profile?.email && <a href={`mailto:${profile.email}`} className="p-3 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-blue-500 hover:text-white transition-colors"><Mail size={20} /></a>}
          </div>
        </div>
      </section>

      <Footer profile={profile} />
    </div>
  );
}
