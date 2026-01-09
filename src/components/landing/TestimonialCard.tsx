import { motion } from "framer-motion";
import { Quote } from "lucide-react";

interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
  index: number;
}

export const TestimonialCard = ({
  quote,
  author,
  role,
  index,
}: TestimonialCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.6,
        delay: index * 0.15,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="group relative p-8 rounded-3xl bg-card border border-border/50 hover:border-primary/20 hover:shadow-xl transition-all duration-500"
    >
      {/* Quote icon */}
      <div className="absolute -top-4 left-8">
        <div className="p-3 rounded-2xl bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
          <Quote className="w-5 h-5 text-primary" />
        </div>
      </div>

      {/* Quote text */}
      <p className="mt-4 text-foreground/80 text-lg leading-relaxed italic">
        "{quote}"
      </p>

      {/* Author */}
      <div className="mt-6 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
          <span className="text-lg font-bold text-primary">
            {author.charAt(0)}
          </span>
        </div>
        <div>
          <p className="font-semibold text-foreground">{author}</p>
          <p className="text-sm text-muted-foreground">{role}</p>
        </div>
      </div>
    </motion.div>
  );
};
