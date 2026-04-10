import { motion } from "framer-motion";
import { ExternalLink, Award } from "lucide-react";

const certificates = [
  {
    title: "Artificial Intelligence Fundamentals",
    description: "Certificate for core AI concepts and applications.",
    file: "/certificates/Artificial intelligence fundamentals.pdf",
    provider: "IBM",
  },
  {
    title: "B1 English for Developers",
    description: "English proficiency certification tailored for developers.",
    file: "/certificates/B1_English_for_Developers.png",
    provider: "FreeCodeCamp",
  },
  {
    title: "Computer Fundamentals",
    description: "Certificate in essential computer science and IT fundamentals.",
    file: "/certificates/Computer foundamentals.pdf",
    provider: "IT Fundamentals",
  },
  {
    title: "Email Marketing",
    description: "Certificate covering digital marketing, email campaigns, and strategy.",
    file: "/certificates/Email marketing.png",
    provider: "HubSpot",
  },
  {
    title: "Introduction to Cybersecurity",
    description: "Certificate in cybersecurity basics and best practices.",
    file: "/certificates/Introduction to cybersecurity.pdf",
    provider: "Cisco Networking Academy",
  },
  {
    title: "IoT and Digital Transformation",
    description: "Certificate focused on IoT-driven digital innovation.",
    file: "/certificates/IoT and digital transformation.pdf",
    provider: "Cisco Networking Academy",
  },
  {
    title: "JavaScript Algorithms & Data Structures",
    description: "Certificate for algorithm and data structure mastery in JavaScript.",
    file: "/certificates/Javascript Algorithm and Data Structures.pdf",
    provider: "FreeCodeCamp",
  },
  {
    title: "Responsive Web Design",
    description: "Certificate covering responsive, mobile-first web design.",
    file: "/certificates/Responsive Web Design.pdf",
    provider: "FreeCodeCamp",
  },
  {
    title: "182 Pathway Term 1-2 Certificate",
    description: "Certificate earned from the 182 Pathway learning program.",
    file: "/certificates/182-pathway-term-1-2-certificate-samuel-akingeneye.png",
    provider: "ALX Africa",
  },
];

const CertificationsSection = () => (
  <section id="certifications" className="py-24">
    <div className="container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Award size={28} />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Certifications</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Verified certificates and training achievements that validate my technical skills and continuous learning.
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {certificates.map((certificate) => (
          <motion.div
            key={certificate.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="card-gradient glow-border rounded-2xl p-6 flex flex-col justify-between"
          >
            <div>
              <div className="inline-flex items-center gap-2 text-primary mb-3">
                <span className="text-sm font-semibold">{certificate.provider}</span>
                <span className="h-1 w-1 rounded-full bg-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{certificate.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {certificate.description}
              </p>
            </div>
            <a
              href={certificate.file}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center justify-between rounded-full border border-border bg-background/70 px-4 py-3 text-sm font-semibold text-primary hover:border-primary hover:bg-primary/10 transition-all"
            >
              View Certificate
              <ExternalLink size={16} />
            </a>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default CertificationsSection;
