import { cn } from "@/lib/utils";

interface BlobProps {
  className?: string;
  color?: "primary" | "accent";
  size?: "sm" | "md" | "lg";
  position: { top?: string; left?: string; right?: string; bottom?: string };
  delay?: number;
}

function Blob({ className, color = "primary", size = "md", position, delay = 0 }: BlobProps) {
  const sizeClasses = {
    sm: "w-32 h-32 md:w-48 md:h-48",
    md: "w-48 h-48 md:w-72 md:h-72",
    lg: "w-64 h-64 md:w-96 md:h-96"
  };

  const colorClasses = {
    primary: "bg-primary/5",
    accent: "bg-accent/5"
  };

  return (
    <div
      className={cn(
        "absolute rounded-full blur-3xl animate-blob-morph pointer-events-none",
        sizeClasses[size],
        colorClasses[color],
        className
      )}
      style={{
        ...position,
        animationDelay: `${delay}s`
      }}
    />
  );
}

interface AnimatedBackgroundProps {
  className?: string;
  variant?: "hero" | "section" | "cta";
}

export function AnimatedBackground({ className, variant = "hero" }: AnimatedBackgroundProps) {
  const variants = {
    hero: (
      <>
        <Blob 
          color="primary" 
          size="lg" 
          position={{ top: "10%", right: "10%" }} 
          delay={0}
        />
        <Blob 
          color="accent" 
          size="md" 
          position={{ bottom: "20%", left: "5%" }} 
          delay={5}
        />
        <Blob 
          color="primary" 
          size="sm" 
          position={{ top: "50%", left: "30%" }} 
          delay={10}
        />
      </>
    ),
    section: (
      <>
        <Blob 
          color="primary" 
          size="md" 
          position={{ top: "0%", left: "10%" }} 
          delay={0}
        />
        <Blob 
          color="accent" 
          size="sm" 
          position={{ bottom: "10%", right: "15%" }} 
          delay={7}
        />
      </>
    ),
    cta: (
      <>
        <Blob 
          color="primary" 
          size="lg" 
          position={{ top: "20%", left: "10%" }} 
          delay={0}
          className="opacity-30"
        />
        <Blob 
          color="accent" 
          size="md" 
          position={{ bottom: "10%", right: "10%" }} 
          delay={5}
          className="opacity-20"
        />
      </>
    )
  };

  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      {variants[variant]}
    </div>
  );
}
