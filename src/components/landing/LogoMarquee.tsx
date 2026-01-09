import { Shield, Lock, Zap, Award, Users, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface MarqueeItemProps {
  icon: React.ElementType;
  label: string;
}

const marqueeItems: MarqueeItemProps[] = [
  { icon: Shield, label: "RGPD Compliant" },
  { icon: Lock, label: "Données Chiffrées" },
  { icon: Award, label: "Made in France" },
  { icon: Zap, label: "Support Réactif" },
  { icon: Users, label: "80+ Utilisateurs" },
  { icon: Star, label: "4.8/5 Satisfaction" },
];

function MarqueeItem({ icon: Icon, label }: MarqueeItemProps) {
  return (
    <div className="flex items-center gap-3 px-6 py-3 mx-4 bg-card/50 backdrop-blur-sm rounded-full border border-border/30 hover:border-primary/30 transition-colors group">
      <Icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
      <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors whitespace-nowrap">
        {label}
      </span>
    </div>
  );
}

interface LogoMarqueeProps {
  className?: string;
  speed?: "slow" | "normal" | "fast";
  direction?: "left" | "right";
}

export function LogoMarquee({ 
  className, 
  speed = "normal",
  direction = "left" 
}: LogoMarqueeProps) {
  const speedDuration = {
    slow: "60s",
    normal: "40s",
    fast: "25s"
  };

  return (
    <div className={cn("overflow-hidden relative", className)}>
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
      
      <div 
        className="flex animate-marquee"
        style={{
          animationDuration: speedDuration[speed],
          animationDirection: direction === "right" ? "reverse" : "normal"
        }}
      >
        {/* First set */}
        {marqueeItems.map((item, i) => (
          <MarqueeItem key={`first-${i}`} {...item} />
        ))}
        {/* Duplicate for seamless loop */}
        {marqueeItems.map((item, i) => (
          <MarqueeItem key={`second-${i}`} {...item} />
        ))}
      </div>
    </div>
  );
}
