import { motion } from "framer-motion";
import { ArrowRight, Download, Github, Twitter, Mail, MessageCircle } from "lucide-react";
import avatarImg from "@/assets/avatar.png";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Particle-like background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(174_72%_50%_/_0.08)_0%,_transparent_70%)]" />
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-background to-transparent" />
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-primary/30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-6 pt-24 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-primary text-lg mb-2">Hi, I am</p>
            <h1 className="text-5xl md:text-7xl font-bold mb-4">
              Samuel <span className="text-gradient">AKINGENEYE</span>
            </h1>
            <p className="text-primary text-xl font-semibold mb-2">
              Software Engineer
            </p>
            <p className="text-muted-foreground mb-2">Based in Rwanda.</p>
            <p className="text-muted-foreground max-w-lg mb-6 leading-relaxed">
              I build modern, user-focused web applications that solve real-world problems. 
              From AI-powered learning platforms to civic engagement tools, I'm passionate about 
              using technology to create meaningful impact in communities.
            </p>

            {/* Social icons */}
            <div className="flex gap-4 mb-8">
              <a href="https://github.com/samuelakingeneye" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Github size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter size={20} />
              </a>
              <a href="mailto:freshtalent491@gmail.com" className="text-muted-foreground hover:text-primary transition-colors">
                <Mail size={20} />
              </a>
              <a href="https://wa.me/250790663921" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <MessageCircle size={20} />
              </a>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-4">
              <a
                href="#projects"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
              >
                View Projects <ArrowRight size={16} />
              </a>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-border text-foreground hover:border-primary transition-colors"
              >
                Get in Touch <Mail size={16} />
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative">
              <div className="w-72 h-72 md:w-80 md:h-80 rounded-2xl overflow-hidden glow-border animate-float">
                <img
                  src={avatarImg}
                  alt="Samuel AKINGENEYE"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-3 -right-3 bg-card border border-border rounded-full px-4 py-2 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm text-foreground">Open to Work</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
