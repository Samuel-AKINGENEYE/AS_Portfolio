import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

const projects = [
  {
    title: "E-Commerce Platform",
    desc: "Full-stack e-commerce application with real-time inventory, payment processing, and admin dashboard.",
    tags: ["React", "Node.js", "PostgreSQL", "Stripe", "AWS"],
    link: "#",
  },
  {
    title: "Project Management Tool",
    desc: "Collaborative project management app with kanban boards, real-time updates, and team chat.",
    tags: ["Next.js", "TypeScript", "WebSocket", "MongoDB"],
    link: "#",
  },
  {
    title: "Analytics Dashboard",
    desc: "Real-time analytics platform with interactive charts, custom reports, and data export.",
    tags: ["React", "D3.js", "Python", "Redis", "Docker"],
    link: "#",
  },
  {
    title: "Social Media App",
    desc: "Mobile-first social platform with content feeds, messaging, and notification system.",
    tags: ["React Native", "GraphQL", "PostgreSQL", "AWS"],
    link: "#",
  },
];

const ProjectsSection = () => (
  <section id="projects" className="py-24 bg-secondary/30">
    <div className="container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Projects</h2>
        <p className="text-muted-foreground">A selection of my recent work</p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {projects.map((project, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="card-gradient glow-border rounded-xl overflow-hidden group hover:border-primary/50 transition-all"
          >
            <div className="h-48 bg-gradient-to-br from-primary/10 to-secondary flex items-center justify-center">
              <span className="text-4xl text-primary/40 font-mono">{"</>"}</span>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                <a href={project.link} className="text-muted-foreground hover:text-primary transition-colors">
                  <ExternalLink size={16} />
                </a>
              </div>
              <p className="text-sm text-muted-foreground mb-4">{project.desc}</p>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span key={tag} className="px-2 py-1 text-xs rounded bg-secondary text-primary border border-primary/20">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default ProjectsSection;
