import { Shield, BadgeCheck, Sparkles, Lock, Zap, Award } from "lucide-react";

const badges = [
  { icon: Shield, label: "RGPD Compliant" },
  { icon: BadgeCheck, label: "Made in France" },
  { icon: Sparkles, label: "Propulsé par IA" },
  { icon: Lock, label: "Données sécurisées" },
  { icon: Zap, label: "Temps réel" },
  { icon: Award, label: "Conseils experts" },
];

export const LogoMarquee = () => {
  return (
    <div className="relative w-full overflow-hidden py-8 bg-gradient-to-r from-muted/50 via-muted/30 to-muted/50">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />

      {/* Marquee container */}
      <div className="flex animate-marquee">
        {/* First set */}
        {[...badges, ...badges].map((badge, index) => (
          <div
            key={index}
            className="flex items-center gap-2 mx-8 text-muted-foreground/70 hover:text-primary transition-colors duration-300 whitespace-nowrap"
          >
            <badge.icon className="w-5 h-5" />
            <span className="text-sm font-medium">{badge.label}</span>
          </div>
        ))}
        {/* Duplicate for seamless loop */}
        {[...badges, ...badges].map((badge, index) => (
          <div
            key={`dup-${index}`}
            className="flex items-center gap-2 mx-8 text-muted-foreground/70 hover:text-primary transition-colors duration-300 whitespace-nowrap"
          >
            <badge.icon className="w-5 h-5" />
            <span className="text-sm font-medium">{badge.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
