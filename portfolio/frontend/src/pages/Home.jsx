import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  Github, Linkedin, Twitter, Mail, MapPin, Calendar,
  Briefcase, Code2, Database, Wrench, Globe,
  Star, StarHalf, MessageSquare, ChevronRight,
  ArrowDown, Send, Award,
} from 'lucide-react';

import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import ProjectCard from '../components/ProjectCard.jsx';
import CertificateCard from '../components/CertificateCard.jsx';
import SkillBadge from '../components/SkillBadge.jsx';
import { projectsApi, certificatesApi, profileApi } from '../services/api.js';

// ─── Static data ──────────────────────────────────────────────────────────────

const SKILLS = {
  Frontend: {
    icon: Globe,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
  },
  Backend: {
    icon: Code2,
    color: 'text-green-500',
    bg: 'bg-green-500/10',
    items: ['Node.js', 'Express', 'Python'],
  },
  Database: {
    icon: Database,
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
    items: ['PostgreSQL', 'MongoDB', 'Redis'],
  },
  Tools: {
    icon: Wrench,
    color: 'text-orange-500',
    bg: 'bg-orange-500/10',
    items: ['Git', 'Docker', 'AWS'],
  },
};

const TESTIMONIALS = [
  {
    feedback:
      'Samuel helped us launch a strong MVP in under a month with exceptional product focus and polish.',
    author: 'Amina Kayitesi',
    role: 'Founder, Kivu Labs',
    rating: 5,
  },
  {
    feedback:
      'The product interface is clean, performant, and easy to maintain — the team loves working with him.',
    author: 'Jean Mukamana',
    role: 'Product Lead, Kigali Finance',
    rating: 4.8,
  },
  {
    feedback:
      'Reliable, detail-oriented, and responsive — Samuel consistently delivered quality code and strong communication.',
    author: 'Emily S.',
    role: 'CTO, LearnHub Rwanda',
    rating: 5,
  },
];

const CERT_CATEGORIES = ['All', 'AI/ML', 'Web Dev', 'Cybersecurity', 'Other'];

// ─── Star renderer ─────────────────────────────────────────────────────────────

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

// ─── Section wrapper ──────────────────────────────────────────────────────────

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

// ─── Skeleton loader ──────────────────────────────────────────────────────────

function Skeleton({ count = 3, height = 'h-72' }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className={`${height} rounded-2xl bg-slate-200 dark:bg-slate-700 animate-pulse`} />
      ))}
    </div>
  );
}

// ─── Contact form ─────────────────────────────────────────────────────────────

function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    // Wire to a real email API (e.g. EmailJS, Resend, or your backend) when ready
    await new Promise((r) => setTimeout(r, 900));
    toast.success("Message sent! I'll get back to you soon.");
    setForm({ name: '', email: '', message: '' });
    setSending(false);
  };

  const inputClass =
    'w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 ' +
    'bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm ' +
    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ' +
    'placeholder:text-slate-400 transition-colors';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        required
        type="text"
        placeholder="Your name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className={inputClass}
      />
      <input
        required
        type="email"
        placeholder="your@email.com"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        className={inputClass}
      />
      <textarea
        required
        rows={5}
        placeholder="Your message…"
        value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
        className={inputClass + ' resize-none'}
      />
      <button
        type="submit"
        disabled={sending}
        className="w-full py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-medium text-sm
                   transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
      >
        {sending ? (
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <>
            <Send size={15} />
            Send Message
          </>
        )}
      </button>
    </form>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [profile, setProfile] = useState(null);
  const [certFilter, setCertFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [projRes, certRes, profRes] = await Promise.allSettled([
        projectsApi.getAll(true),
        certificatesApi.getAll(),
        profileApi.get(),
      ]);
      if (projRes.status === 'fulfilled') setProjects(projRes.value.data.data ?? []);
      if (certRes.status === 'fulfilled') setCertificates(certRes.value.data.data ?? []);
      if (profRes.status === 'fulfilled') setProfile(profRes.value.data.data ?? null);
      setLoading(false);
    };
    load();
  }, []);

  const filteredCerts =
    certFilter === 'All' ? certificates : certificates.filter((c) => c.category === certFilter);

  const social = profile?.socialLinks ?? {
    github: 'https://github.com/samuel-akingeneye',
    linkedin: 'https://linkedin.com/in/samuel-akingeneye',
    twitter: 'https://twitter.com/samuel_ak',
  };

  // ── HERO ──────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* ═══════════════════ HERO ═══════════════════ */}
      <section
        id="hero"
        className="relative min-h-screen flex items-center pt-16 px-6 overflow-hidden"
      >
        {/* Subtle radial glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-blue-500/5 blur-3xl" />
        </div>

        <div className="container-max w-full py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left — text */}
            <div className="animate-fade-in">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full
                              bg-green-500/10 border border-green-500/25
                              text-green-600 dark:text-green-400 text-sm font-medium mb-6">
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
                <a
                  href="#projects"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl
                             bg-blue-500 hover:bg-blue-600 text-white font-medium
                             transition-colors shadow-lg shadow-blue-500/25"
                >
                  View My Work <ChevronRight size={16} />
                </a>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl
                             border border-slate-300 dark:border-slate-600
                             text-slate-700 dark:text-slate-300
                             hover:border-blue-500 hover:text-blue-500
                             dark:hover:border-blue-400 dark:hover:text-blue-400
                             font-medium transition-colors"
                >
                  Contact Me <Mail size={16} />
                </a>
              </div>

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg
                              bg-blue-50 dark:bg-blue-500/10
                              border border-blue-100 dark:border-blue-500/20
                              text-blue-700 dark:text-blue-400 text-sm font-medium">
                <Award size={15} />
                8+ Projects Built
              </div>
            </div>

            {/* Right — avatar card */}
            <div className="hidden lg:flex justify-center">
              <div className="relative animate-float">
                <div className="w-80 h-80 rounded-3xl overflow-hidden border border-blue-500/20
                                bg-gradient-to-br from-slate-800 to-slate-900
                                flex items-center justify-center shadow-2xl">
                  <span className="text-8xl font-black text-blue-500/15 select-none">SA</span>
                </div>
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap
                                flex items-center gap-2 bg-white dark:bg-slate-800
                                border border-slate-200 dark:border-slate-700
                                rounded-full px-5 py-2 shadow-lg text-sm font-medium">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-slate-700 dark:text-slate-300">Open to Work</span>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll hint */}
          <div className="flex justify-center mt-16">
            <a
              href="#projects"
              className="text-slate-300 dark:text-slate-600 hover:text-blue-500 transition-colors animate-bounce"
              aria-label="Scroll to projects"
            >
              <ArrowDown size={22} />
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════════════ PROJECTS ═══════════════════ */}
      <Section id="projects" className="bg-white dark:bg-slate-800/30">
        <SectionHead
          title="Featured Projects"
          sub="Real-world applications built to solve actual problems"
        />
        {loading ? (
          <Skeleton count={3} height="h-80" />
        ) : projects.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((p) => (
              <ProjectCard key={p._id} project={p} />
            ))}
          </div>
        ) : (
          <p className="text-center text-slate-400">No projects yet — add some in the admin dashboard.</p>
        )}
      </Section>

      {/* ═══════════════════ SKILLS ═══════════════════ */}
      <Section id="skills">
        <SectionHead
          title="Skills & Tech Stack"
          sub="Tools and technologies I use to build products"
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(SKILLS).map(([category, { icon: Icon, color, bg, items }]) => (
            <div key={category} className="card p-6 glow-hover">
              <div className="flex items-center gap-2.5 mb-5">
                <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center ${color}`}>
                  <Icon size={16} />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white text-sm">{category}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {items.map((skill) => (
                  <SkillBadge key={skill} label={skill} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ═══════════════════ TESTIMONIALS ═══════════════════ */}
      <Section id="testimonials" className="bg-white dark:bg-slate-800/30">
        <SectionHead
          title="Testimonials"
          sub="Feedback from collaborators and clients"
        />
        <div className="grid md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="card p-6 glow-hover flex flex-col">
              <div className="mb-3">
                <StarRating rating={t.rating} />
              </div>
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

      {/* ═══════════════════ CERTIFICATIONS ═══════════════════ */}
      <Section id="certifications">
        <SectionHead
          title="Certifications"
          sub="Verified credentials from leading institutions"
        />

        {/* Filter tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {CERT_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCertFilter(cat)}
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

        {loading ? (
          <Skeleton count={3} height="h-56" />
        ) : filteredCerts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCerts.map((c) => (
              <CertificateCard key={c._id} certificate={c} />
            ))}
          </div>
        ) : (
          <p className="text-center text-slate-400">No certificates in this category.</p>
        )}
      </Section>

      {/* ═══════════════════ ABOUT ═══════════════════ */}
      <Section id="about" className="bg-white dark:bg-slate-800/30">
        <SectionHead title="About Me" />
        <div className="grid lg:grid-cols-2 gap-14 items-start">
          {/* Story */}
          <div>
            <h3 className="text-lg font-semibold text-blue-500 mb-4">My Story</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[15px]">
              {profile?.bio ??
                "I'm a self-taught software engineer from Rwanda who turned curiosity into code. " +
                "After completing freeCodeCamp's full-stack bootcamp, I built real solutions: an " +
                'AI-powered language tutor that helped 300+ learners practice conversational English, ' +
                'and a civic engagement platform that reduced local service request time by 40%. ' +
                "I believe technology should serve people, and I'm driven to create impact through " +
                'clean, scalable web applications.'}
            </p>
          </div>

          {/* Quick facts */}
          <div className="card p-6">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-5">Quick Facts</h3>
            <dl className="space-y-4">
              {[
                {
                  icon: Mail,
                  color: 'bg-blue-500/10 text-blue-500',
                  label: 'Email',
                  value: profile?.email ?? 'samuel@example.com',
                },
                {
                  icon: MapPin,
                  color: 'bg-green-500/10 text-green-500',
                  label: 'Location',
                  value: profile?.location ?? 'Kigali, Rwanda',
                },
                {
                  icon: Calendar,
                  color: 'bg-purple-500/10 text-purple-500',
                  label: 'Availability',
                  value: profile?.availability ?? 'Available Now',
                  valueClass: 'text-green-600 dark:text-green-400',
                },
                {
                  icon: Briefcase,
                  color: 'bg-orange-500/10 text-orange-500',
                  label: 'Experience',
                  value: `${profile?.yearsOfExperience ?? 2}+ Years`,
                },
              ].map(({ icon: Icon, color, label, value, valueClass }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg ${color} flex items-center justify-center shrink-0`}>
                    <Icon size={15} />
                  </div>
                  <div>
                    <dt className="text-xs text-slate-400 dark:text-slate-500">{label}</dt>
                    <dd className={`text-sm font-medium text-slate-900 dark:text-white ${valueClass ?? ''}`}>
                      {value}
                    </dd>
                  </div>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Section>

      {/* ═══════════════════ CONTACT ═══════════════════ */}
      <Section id="contact">
        <SectionHead
          title="Get In Touch"
          sub="Have a project in mind? Let's build something together."
        />
        <div className="grid lg:grid-cols-2 gap-12 max-w-4xl mx-auto">
          {/* Form */}
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-5">Send a Message</h3>
            <ContactForm />
          </div>

          {/* Social links */}
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-5">Connect With Me</h3>
            <div className="space-y-3">
              {[
                { key: 'github', Icon: Github, label: 'GitHub', sub: 'View my open source work', href: social.github },
                { key: 'linkedin', Icon: Linkedin, label: 'LinkedIn', sub: 'Connect professionally', href: social.linkedin },
                { key: 'twitter', Icon: Twitter, label: 'Twitter', sub: 'Follow for dev updates', href: social.twitter },
              ]
                .filter((s) => s.href)
                .map(({ key, Icon, label, sub, href }) => (
                  <a
                    key={key}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 rounded-xl card glow-hover group"
                  >
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
                <a
                  href={`mailto:${profile.email}`}
                  className="flex items-center gap-4 p-4 rounded-xl card glow-hover group"
                >
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
