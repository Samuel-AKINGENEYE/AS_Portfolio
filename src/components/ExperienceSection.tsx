import { motion } from "framer-motion";

const experiences = [
  {
    abbr: "CMP",
    role: "Senior Full Stack Developer",
    company: "Company Name",
    period: "Jan 2023 - Present",
    location: "Remote",
    desc: "Leading development of scalable web applications. Building microservices architecture and mentoring junior developers.",
    skills: ["React", "Node.js", "TypeScript", "AWS", "PostgreSQL"],
  },
  {
    abbr: "STR",
    role: "Full Stack Developer",
    company: "Startup Inc",
    period: "Jun 2021 - Dec 2022",
    location: "San Francisco, CA",
    desc: "Built and shipped multiple features for a SaaS platform serving thousands of users. Optimized performance and implemented CI/CD pipelines.",
    skills: ["React", "Python", "Docker", "MongoDB", "Redis"],
  },
  {
    abbr: "AGN",
    role: "Frontend Developer",
    company: "Agency Co",
    period: "Jan 2019 - May 2021",
    location: "New York, NY",
    desc: "Developed responsive web applications for enterprise clients. Collaborated with design teams to implement pixel-perfect UIs.",
    skills: ["React", "TypeScript", "CSS3", "Figma", "REST APIs"],
  },
];

const ExperienceSection = () => (
  <section id="experience" className="py-24">
    <div className="container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Professional Journey</h2>
        <p className="text-muted-foreground">My career path and growth</p>
      </motion.div>

      <div className="max-w-3xl mx-auto space-y-8">
        {experiences.map((exp, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className="card-gradient glow-border rounded-xl p-6 hover:border-primary/50 transition-all"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center text-primary font-mono text-xs font-bold shrink-0">
                {exp.abbr}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{exp.role}</h3>
                <p className="text-primary text-sm font-medium">{exp.company}</p>
                <p className="text-muted-foreground text-xs mt-1">
                  {exp.period} · {exp.location}
                </p>
                <p className="text-muted-foreground text-sm mt-3">{exp.desc}</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {exp.skills.map((s) => (
                    <span key={s} className="px-2 py-1 text-xs rounded bg-secondary text-foreground border border-border">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default ExperienceSection;
