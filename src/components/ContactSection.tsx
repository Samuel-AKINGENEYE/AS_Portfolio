import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Github, Twitter, MessageCircle } from "lucide-react";

const ContactSection = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Thanks for reaching out! (Form submission not connected yet)");
  };

  return (
    <section id="contact" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Let's Connect</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Have a project in mind or want to collaborate? I'd love to hear from you!
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-semibold mb-6">Get in Touch</h3>
            <div className="space-y-4 mb-8">
              <a href="mailto:freshtalent491@gmail.com" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors">
                <Mail size={18} className="text-primary" />
                freshtalent491@gmail.com
              </a>
              <a href="https://wa.me/250790663921" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors">
                <MessageCircle size={18} className="text-primary" />
                +250 790 663 921
              </a>
              <div className="flex items-center gap-3 text-muted-foreground">
                <MapPin size={18} className="text-primary" />
                Rwanda
              </div>
            </div>
            <p className="text-muted-foreground text-sm mb-4">Connect on social media</p>
            <div className="flex gap-4">
              <a href="https://github.com/samuelakingeneye" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-secondary border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-all">
                <Github size={18} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-secondary border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-all">
                <Twitter size={18} />
              </a>
              <a href="https://wa.me/250790663921" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-secondary border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-all">
                <MessageCircle size={18} />
              </a>
            </div>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            {(["name", "email", "subject"] as const).map((field) => (
              <input
                key={field}
                type={field === "email" ? "email" : "text"}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                value={form[field]}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                required
              />
            ))}
            <textarea
              placeholder="Message"
              rows={4}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors resize-none"
              required
            />
            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
            >
              Send Message
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
