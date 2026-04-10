import { motion } from "framer-motion";
import { Rocket } from "lucide-react";

const ExperienceSection = () => (
  <section id="experience" className="py-24">
    <div className="container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4">My Journey</h2>
        <p className="text-muted-foreground">Building skills through personal projects and continuous learning</p>
      </motion.div>

      <div className="max-w-3xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="card-gradient glow-border rounded-xl p-6"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center text-primary shrink-0">
              <Rocket size={20} />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Independent Software Engineer</h3>
              <p className="text-primary text-sm font-medium">Self-Directed Projects</p>
              <p className="text-muted-foreground text-xs mt-1">Ongoing · Rwanda</p>
              <p className="text-muted-foreground text-sm mt-3">
                Building real-world applications as personal projects to sharpen my skills and solve 
                problems that matter. From AI-powered learning tools to civic platforms, each project 
                pushes my growth as a full stack developer.
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                {["React", "Node.js", "JavaScript", "AI Integration", "Full Stack"].map((s) => (
                  <span key={s} className="px-2 py-1 text-xs rounded bg-secondary text-foreground border border-border">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="card-gradient glow-border rounded-xl p-6"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center text-primary font-mono text-xs font-bold shrink-0">
              FCC
            </div>
            <div>
              <h3 className="text-lg font-semibold">Full Stack Web Development</h3>
              <p className="text-primary text-sm font-medium">freeCodeCamp Bootcamp</p>
              <p className="text-muted-foreground text-xs mt-1">Completed · Online</p>
              <p className="text-muted-foreground text-sm mt-3">
                Completed the comprehensive full stack bootcamp covering HTML, CSS, JavaScript, 
                React, Node.js, databases, and more. Built multiple certification projects along the way.
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                {["HTML/CSS", "JavaScript", "React", "Node.js", "MongoDB", "APIs"].map((s) => (
                  <span key={s} className="px-2 py-1 text-xs rounded bg-secondary text-foreground border border-border">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="card-gradient glow-border rounded-xl p-6"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center text-primary font-mono text-xs font-bold shrink-0">
              📚
            </div>
            <div>
              <h3 className="text-lg font-semibold">Self-Taught Learning</h3>
              <p className="text-primary text-sm font-medium">Online Courses & Resources</p>
              <p className="text-muted-foreground text-xs mt-1">Ongoing · Self-Directed</p>
              <p className="text-muted-foreground text-sm mt-3">
                Continuously expanding my skill set through online courses, tutorials, documentation, 
                and hands-on project building. Focused on modern web technologies, AI, and best practices.
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                {["TypeScript", "AI/ML", "System Design", "DevOps", "Problem Solving"].map((s) => (
                  <span key={s} className="px-2 py-1 text-xs rounded bg-secondary text-foreground border border-border">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

export default ExperienceSection;
