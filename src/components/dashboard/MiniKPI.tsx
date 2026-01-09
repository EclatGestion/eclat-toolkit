import { Pencil } from "lucide-react";
import { motion } from "framer-motion";

interface MiniKPIProps {
  label: string;
  value: string;
  badge?: string;
  badgeColor?: "green" | "orange" | "red";
  onClick?: () => void;
}

export function MiniKPI({ label, value, badge, badgeColor = "green", onClick }: MiniKPIProps) {
  const badgeColorClasses = {
    green: "bg-success/20 text-success",
    orange: "bg-warning/20 text-warning",
    red: "bg-destructive/20 text-destructive",
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`bg-card rounded-2xl p-4 shadow-card border border-border/50 ${
        onClick ? "cursor-pointer" : ""
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-1">
        <p className="text-xs text-muted-foreground uppercase tracking-wide">{label}</p>
        {onClick && (
          <Pencil className="w-3.5 h-3.5 text-muted-foreground opacity-50" />
        )}
      </div>
      <div className="flex items-baseline gap-2">
        <p className="text-lg font-semibold text-foreground">{value}</p>
        {badge && (
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${badgeColorClasses[badgeColor]}`}>
            {badge}
          </span>
        )}
      </div>
    </motion.div>
  );
}
