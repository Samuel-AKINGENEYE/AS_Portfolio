import { motion } from "framer-motion";
import { Code2, Brain, Layout, Server, Cloud, Users } from "lucide-react";

const cards = [
  { icon: Code2, title: "Full Stack Development", desc: "End-to-end applications with React, Node.js, TypeScript, and Python." },
  { icon: Brain, title: "Problem Solving", desc: "Analytical thinking and creative solutions for complex technical challenges." },
  { icon: Layout, title: "UI/UX Design", desc: "Clean, intuitive interfaces with modern design patterns and accessibility." },
  { icon: Server, title: "Backend Architecture", desc: "Scalable APIs, microservices, and database design for production systems." },
  { icon: Cloud, title: "Cloud & DevOps", desc: "AWS, Docker, CI/CD pipelines, and infrastructure automation." },
  { icon: Users, title: "Team Collaboration", desc: "Agile workflows, code reviews, and cross-functional team leadership." },
];

const AboutSection = () => (
  <section id="about" className="py-24">
    <div className="container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4">About Me</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Passionate developer focused on building impactful digital products
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-3xl mx-auto mb-16"
      >
        <h3 className="text-xl font-semibold mb-4 text-primary">Background</h3>
        <p className="text-muted-foreground leading-relaxed mb-4">
          With a strong foundation in computer science and years of hands-on experience, I've built my career 
          creating modern web applications and scalable backend systems. I'm passionate about clean code, 
          great user experiences, and continuous learning.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          My expertise spans the full stack — from crafting pixel-perfect UIs with React and Tailwind to 
          designing robust APIs and deploying to cloud infrastructure. I thrive in collaborative environments 
          where innovation drives real-world impact.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="card-gradient glow-border rounded-xl p-6 hover:border-primary/50 transition-all group"
          >
            <card.icon className="w-8 h-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
            <h4 className="font-semibold mb-2">{card.title}</h4>
            <p className="text-sm text-muted-foreground">{card.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default AboutSection;
