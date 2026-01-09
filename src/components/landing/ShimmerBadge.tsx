import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface ShimmerBadgeProps {
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
}

export const ShimmerBadge = ({
  icon: Icon,
  children,
  className,
}: ShimmerBadgeProps) => {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 px-4 py-2 rounded-full",
        "bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10",
        "border border-primary/20",
        "text-primary text-sm font-medium",
        "relative overflow-hidden",
        className
      )}
    >
      {/* Shimmer effect */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"
        style={{ backgroundSize: "200% 100%" }}
      />

      {/* Content */}
      <span className="relative z-10 flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4" />}
        {children}
      </span>
    </div>
  );
};
