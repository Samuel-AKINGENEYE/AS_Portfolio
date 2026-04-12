import { motion } from "framer-motion";
import { Code2, Brain, Layout, Lightbulb, Users } from "lucide-react";

const cards = [
  { icon: Code2, title: "Full Stack Development", desc: "Building end-to-end web applications with React, Node.js, and modern JavaScript." },
  { icon: Brain, title: "AI Integration", desc: "Creating AI-powered features like voice chat and intelligent learning systems." },
  { icon: Layout, title: "UI/UX Design", desc: "Crafting clean, intuitive interfaces that prioritize user experience and accessibility." },
  { icon: Lightbulb, title: "Problem Solving", desc: "Turning real-world challenges into practical, technology-driven solutions." },
  { icon: Users, title: "Community Impact", desc: "Building tools that improve education, civic engagement, and daily life." },
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
          Self-taught developer passionate about building impactful digital products
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
          I'm Samuel AKINGENEYE, a self-taught Software Engineer based in Rwanda. My journey into tech started 
          with curiosity and a drive to solve problems — from there I dove into freeCodeCamp's Full Stack 
          Bootcamp and countless online courses, teaching myself everything from frontend frameworks to backend architecture.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          I believe great software should serve people. That's why my projects focus on real-world impact — 
          from AI-powered language learning to platforms that connect citizens with their government. 
          I'm constantly learning, building, and pushing myself to grow as a developer.
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
