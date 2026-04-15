import { motion } from "framer-motion";
import { ExternalLink, Award } from "lucide-react";
import { certificates } from "../lib/certificates";

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
