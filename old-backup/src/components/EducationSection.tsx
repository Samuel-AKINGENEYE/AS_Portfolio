import { motion } from "framer-motion";
import { GraduationCap, Award } from "lucide-react";

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
        <p className="text-muted-foreground">My learning foundation</p>
      </motion.div>

      <div className="max-w-2xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="card-gradient glow-border rounded-xl p-8"
        >
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0">
              <Award className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Full Stack Web Development Bootcamp</h3>
              <p className="text-primary font-medium">freeCodeCamp</p>
              <p className="text-muted-foreground text-sm mt-1">Completed · Online</p>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="text-primary">▹</span> Responsive Web Design
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">▹</span> JavaScript Algorithms & Data Structures
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">▹</span> Front End Libraries (React)
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">▹</span> Back End Development & APIs
                </li>
              </ul>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="card-gradient glow-border rounded-xl p-8"
        >
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0">
              <GraduationCap className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">High School Diploma</h3>
              <p className="text-primary font-medium">Rwanda</p>
              <p className="text-muted-foreground text-sm mt-1">Completed</p>
              <p className="text-muted-foreground text-sm mt-3">
                Foundation education that sparked my curiosity for technology and problem-solving, 
                leading me to pursue software engineering through self-directed learning.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

export default EducationSection;
