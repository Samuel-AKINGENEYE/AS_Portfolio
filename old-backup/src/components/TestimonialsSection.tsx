import { motion } from "framer-motion";
import { MessageSquare, Star, StarHalf } from "lucide-react";

const testimonials = [
  {
    feedback: "Samuel helped us launch a strong MVP in under a month with exceptional product focus and polish.",
    author: "Amina Kayitesi",
    role: "Founder, Kivu Labs",
    rating: 5,
  },
  {
    feedback: "The product interface is clean, performant, and easy to maintain — the team loves working with him.",
    author: "Jean Mukamana",
    role: "Product Lead, Kigali Finance",
    rating: 4.8,
  },
  {
    feedback: "Reliable, detail-oriented, and responsive — Samuel consistently delivered quality code and strong communication.",
    author: "Emily S.",
    role: "CTO, LearnHub Rwanda",
    rating: 5,
  },
];

const TestimonialsSection = () => (
  <section id="testimonials" className="py-24 bg-secondary/10">
    <div className="container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <MessageSquare size={28} />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Testimonials</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Feedback from collaborators and clients who have worked with me on software projects.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={testimonial.author}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="card-gradient glow-border rounded-3xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="inline-flex items-center gap-2 text-primary">
                {Array.from({ length: 5 }, (_, starIndex) => {
                  const fullStars = Math.floor(testimonial.rating);
                  const hasHalf = testimonial.rating - fullStars >= 0.5;

                  if (starIndex < fullStars) {
                    return (
                      <Star
                        key={starIndex}
                        size={16}
                        fill="currentColor"
                        className="text-primary"
                      />
                    );
                  }

                  if (hasHalf && starIndex === fullStars) {
                    return (
                      <StarHalf
                        key={starIndex}
                        size={16}
                        className="text-primary"
                      />
                    );
                  }

                  return (
                    <Star
                      key={starIndex}
                      size={16}
                      className="text-muted-foreground"
                    />
                  );
                })}
              </div>
              <span className="text-sm font-semibold text-muted-foreground">
                {testimonial.rating.toFixed(1)} / 5
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              “{testimonial.feedback}”
            </p>
            <div>
              <p className="text-sm font-semibold text-primary">{testimonial.author}</p>
              <p className="text-xs text-muted-foreground">{testimonial.role}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default TestimonialsSection;
