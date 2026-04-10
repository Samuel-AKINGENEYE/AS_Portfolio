import { motion } from "framer-motion";

const skillGroups = [
  {
    title: "Frontend",
    skills: ["React", "TypeScript", "Next.js", "Tailwind CSS", "Framer Motion", "HTML5/CSS3"],
  },
  {
    title: "Backend",
    skills: ["Node.js", "Express", "Python", "REST APIs", "GraphQL", "WebSocket"],
  },
  {
    title: "Database & Cloud",
    skills: ["PostgreSQL", "MongoDB", "Redis", "AWS", "Docker", "CI/CD"],
  },
  {
    title: "Tools & Practices",
    skills: ["Git", "Figma", "Agile/Scrum", "Testing", "Code Review", "Documentation"],
  },
];

const SkillsSection = () => (
  <section id="skills" className="py-24 bg-secondary/30">
    <div className="container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Skills & Expertise</h2>
        <p className="text-muted-foreground">Technologies I work with</p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {skillGroups.map((group, gi) => (
          <motion.div
            key={group.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: gi * 0.1 }}
            className="card-gradient glow-border rounded-xl p-6"
          >
            <h3 className="text-lg font-semibold text-primary mb-4">{group.title}</h3>
            <div className="flex flex-wrap gap-2">
              {group.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1.5 text-sm rounded-lg bg-secondary text-foreground border border-border hover:border-primary/50 transition-colors"
                >
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default SkillsSection;
