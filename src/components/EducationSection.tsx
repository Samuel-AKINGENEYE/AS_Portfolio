import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";

const EducationSection = () => (
  <section id="education" className="py-24">
    <div className="container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Education</h2>
        <p className="text-muted-foreground">Academic foundation</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-2xl mx-auto card-gradient glow-border rounded-xl p-8"
      >
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0">
            <GraduationCap className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-semibold">Bachelor's Degree in Computer Science</h3>
            <p className="text-primary font-medium">Your University</p>
            <p className="text-muted-foreground text-sm mt-1">Graduated 2019</p>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="text-primary">▹</span> Data structures and algorithms
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">▹</span> Software engineering best practices
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">▹</span> Distributed systems
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">▹</span> Web development and databases
              </li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

export default EducationSection;
