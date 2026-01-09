import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ServiceBadge {
  label: string;
  variant: "primary" | "accent" | "expert";
}

interface ServiceCardProps {
  title: string;
  description: string;
  badges: ServiceBadge[];
  route: string;
  illustration?: React.ReactNode;
  index?: number;
}

export function ServiceCard({ 
  title, 
  description, 
  badges, 
  route, 
  illustration,
  index = 0 
}: ServiceCardProps) {
  const badgeColors = {
    primary: "bg-primary/10 text-primary",
    accent: "bg-accent/10 text-accent",
    expert: "bg-violet-100 text-violet-700"
  };

  return (
    <motion.article 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="group flex flex-col md:flex-row items-start gap-8 py-12 border-b border-border/30 last:border-0"
    >
      <div className="flex-1 space-y-4">
        {/* Badges */}
        <div className="flex flex-wrap items-center gap-3">
          {badges.map((badge, i) => (
            <span 
              key={i}
              className={cn(
                "px-3 py-1 text-xs font-bold rounded-full",
                badgeColors[badge.variant]
              )}
            >
              {badge.label}
            </span>
          ))}
        </div>
        
        {/* Title */}
        <h3 className="text-2xl md:text-3xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
          {title}
        </h3>
        
        {/* Description */}
        <p className="text-muted-foreground text-lg leading-relaxed max-w-xl">
          {description}
        </p>
        
        {/* Link */}
        <Link 
          to={route}
          className="inline-flex items-center gap-2 text-primary font-semibold mt-2 link-underline"
        >
          En savoir plus 
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
        </Link>
      </div>
      
      {/* Illustration placeholder */}
      <div className="w-full md:w-80 h-48 bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl flex items-center justify-center overflow-hidden group-hover:shadow-lg transition-shadow duration-300">
        {illustration || (
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <ArrowRight className="w-8 h-8 text-primary" />
          </div>
        )}
      </div>
    </motion.article>
  );
}
