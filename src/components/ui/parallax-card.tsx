import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ParallaxCardProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
  glowColor?: string;
}

export const ParallaxCard = ({
  children,
  className,
  intensity = 10,
  glowColor = "hsl(var(--primary))",
}: ParallaxCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    const rotateXValue = (mouseY / (rect.height / 2)) * -intensity;
    const rotateYValue = (mouseX / (rect.width / 2)) * intensity;

    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setIsHovering(false);
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      style={{
        transformStyle: "preserve-3d",
        perspective: "1000px",
      }}
      animate={{
        rotateX,
        rotateY,
        scale: isHovering ? 1.02 : 1,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
      className={cn(
        "relative rounded-2xl bg-card border border-border/50 shadow-xl",
        "before:absolute before:inset-0 before:rounded-2xl before:opacity-0 before:transition-opacity before:duration-300",
        "before:bg-gradient-to-br before:from-white/20 before:to-transparent",
        isHovering && "before:opacity-100",
        className
      )}
    >
      {/* Glow effect */}
      <div
        className={cn(
          "absolute -inset-1 rounded-2xl opacity-0 blur-xl transition-opacity duration-500",
          isHovering && "opacity-30"
        )}
        style={{ background: glowColor }}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>

      {/* Highlight reflection */}
      <div
        className={cn(
          "absolute top-0 left-0 w-1/2 h-1/2 rounded-tl-2xl",
          "bg-gradient-to-br from-white/10 to-transparent",
          "opacity-0 transition-opacity duration-300",
          isHovering && "opacity-100"
        )}
      />
    </motion.div>
  );
};
