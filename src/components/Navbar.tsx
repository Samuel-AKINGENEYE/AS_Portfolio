import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X, SunMoon } from "lucide-react";

const navItems = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Projects", href: "#projects" },
  { label: "Certifications", href: "#certifications" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    const systemLight = window.matchMedia("(prefers-color-scheme: light)").matches;
    const initialTheme = storedTheme === "light" || (storedTheme === null && systemLight) ? "light" : "dark";
    setTheme(initialTheme);
    document.documentElement.classList.toggle("light", initialTheme === "light");
    document.documentElement.classList.toggle("dark", initialTheme === "dark");

    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
    document.documentElement.classList.toggle("light", nextTheme === "light");
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
  };

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/80 backdrop-blur-xl border-b border-border" : ""
      }`}
    >
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <a href="#" className="brand-logo brand-logo-as text-xl font-bold font-mono">
          <span className="brand-logo-brace">{"{"}</span>
          <span className="brand-logo-letter brand-logo-letter-a">A</span>
          <span className="brand-logo-letter brand-logo-letter-s">S</span>
          <span className="brand-logo-brace">{"}"}</span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm text-muted-foreground transition-colors nav-link"
            >
              {item.label}
            </a>
          ))}
          <a
            href="#contact"
            className="px-4 py-2 rounded-lg border border-primary text-primary text-sm hover:bg-primary hover:text-primary-foreground transition-all"
          >
            Get in Touch
          </a>

          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-border text-muted-foreground hover:text-primary hover:border-primary transition-all"
            aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            title={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
          >
            <SunMoon size={18} />
          </button>
        </div>

        <button
          className="md:hidden text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border px-6 pb-6"
        >
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="block py-3 text-muted-foreground transition-colors nav-link"
            >
              {item.label}
            </a>
          ))}
          <button
            type="button"
            onClick={toggleTheme}
            className="mt-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <SunMoon size={18} />
            Theme
          </button>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
