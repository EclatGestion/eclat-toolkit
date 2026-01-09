import { motion } from "framer-motion";
import { ArrowRight, LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface ServiceRowProps {
  badge: string;
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  index: number;
  accentColor?: "primary" | "accent";
}

export const ServiceRow = ({
  badge,
  title,
  description,
  href,
  icon: Icon,
  index,
  accentColor = "primary",
}: ServiceRowProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <Link
        to={href}
        className={cn(
          "group flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-8 py-8 border-b border-border/50",
          "hover:border-primary/30 transition-colors duration-500"
        )}
      >
        {/* Badge */}
        <div className="flex-shrink-0">
          <span
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider",
              accentColor === "primary"
                ? "bg-primary/10 text-primary"
                : "bg-accent/10 text-accent"
            )}
          >
            <Icon className="w-3.5 h-3.5" />
            {badge}
          </span>
        </div>

        {/* Title */}
        <h3 className="flex-1 text-2xl lg:text-3xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
          {title}
        </h3>

        {/* Description */}
        <p className="flex-1 text-muted-foreground text-sm lg:text-base max-w-md">
          {description}
        </p>

        {/* Arrow */}
        <div className="flex-shrink-0 flex items-center gap-2 text-primary opacity-0 group-hover:opacity-100 translate-x-0 group-hover:translate-x-2 transition-all duration-300">
          <span className="text-sm font-medium">Découvrir</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      </Link>
    </motion.div>
  );
};
