import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import speakSmartImg from "@/assets/project-screenshots/speak-smart.png";
import smartLearnImg from "@/assets/project-screenshots/smart-learn-rwanda.png";
import smartCitizenImg from "@/assets/project-screenshots/smart-citizen-request.png";
import shopeasyImg from "@/assets/project-screenshots/midrand-shopeasy.png";
import internshipBookingImg from "@/assets/project-screenshots/internship-booking-system.png";
import oneHealthImg from "@/assets/project-screenshots/one-health.png";

const projects = [
  {
    title: "SpeakSmart",
    image: speakSmartImg,
    desc: "An AI-powered language learning platform that helps users improve English speaking skills through interactive voice chat. It simulates real conversations to build fluency, confidence, and pronunciation.",
    tags: ["React", "AI", "Voice Chat", "Node.js", "API Integration"],
    link: "https://voice-ai-english.lovable.app/",
  },
  {
    title: "Smart Learn Rwanda",
    image: smartLearnImg,
    desc: "A digital learning platform designed to support Rwandan students with accessible academic resources for studying from home. Simplifying learning and improving access to quality education.",
    tags: ["React", "Education", "REST API", "Responsive Design"],
    link: "https://fresh-talent-solutions-z8ax.vercel.app",
  },
  {
    title: "Smart Citizen Request System",
    image: smartCitizenImg,
    desc: "A civic engagement platform that allows citizens to report local issues and submit service requests directly to government authorities. Improves communication and transparency.",
    tags: ["Full Stack", "Node.js", "Database", "Government Tech"],
    link: "https://samuel-akingeneye.github.io/Smart-Citizen-Service-Request-System/",
  },
  {
    title: "E-Commerce Website",
    image: shopeasyImg,
    desc: "A full-featured online shopping platform with product browsing, cart management, and checkout flow. Demonstrates core e-commerce functionality and user-friendly navigation.",
    tags: ["React", "E-Commerce", "Cart System", "CSS", "JavaScript"],
    link: "https://midrand-shop-easy.lovable.app",
  },
  {
    title: "Alpha Scholars Rwanda",
    image: "https://image.thum.io/get/https://alphascholarsrwanda.lovable.app",
    desc: "Responsible for helping alumni of high school apply for universities through a streamlined application support portal.",
    tags: ["React", "Education", "University Applications", "Support Platform"],
    link: "https://alphascholarsrwanda.lovable.app",
  },
  {
    title: "One health",
    image: oneHealthImg,
    desc: "A community health education platform delivering trusted local guidance on menstrual hygiene, mental health, nutrition, malaria prevention, first aid, and adolescent health with Kinyarwanda support.",
    tags: ["Health", "Public Health", "Community", "Kinyarwanda", "Education"],
    link: "https://health-hub-connect-three.vercel.app/",
  },
  {
    title: "Internship Booking System",
    image: internshipBookingImg,
    desc: "A booking platform for managing internship applications, matching students with opportunities and streamlining scheduling for recruiters.",
    tags: ["React", "Booking System", "Internships", "Student Portal"],
    link: "https://internship-booking-system.vercel.app",
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
        <p className="text-muted-foreground">Real-world applications I've built</p>
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
            <a href={project.link} target="_blank" rel="noopener noreferrer" className="block h-48 overflow-hidden bg-[#070c12]">
              <img
                src={project.image}
                alt={`${project.title} preview`}
                width={720}
                height={288}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </a>
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
