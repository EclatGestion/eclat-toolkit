import { cn } from "@/lib/utils";

interface ShimmerBadgeProps {
  children: React.ReactNode;
  className?: string;
}

export function ShimmerBadge({ children, className }: ShimmerBadgeProps) {
  return (
    <span 
      className={cn(
        "inline-block px-5 py-2 rounded-full text-sm font-semibold",
        "bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20",
        "text-primary border border-primary/20",
        "relative overflow-hidden",
        className
      )}
    >
      {/* Shimmer effect */}
      <span 
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"
        style={{ backgroundSize: "200% 100%" }}
      />
      <span className="relative z-10">{children}</span>
    </span>
  );
}
