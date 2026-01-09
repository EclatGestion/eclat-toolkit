import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ParallaxCardProps {
  children: React.ReactNode;
  className?: string;
  floatDelay?: number;
  intensity?: number;
}

export function ParallaxCard({ 
  children, 
  className, 
  floatDelay = 0,
  intensity = 15 
}: ParallaxCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    // Calculate rotation based on mouse position
    const rotateXValue = (mouseY / (rect.height / 2)) * -intensity;
    const rotateYValue = (mouseX / (rect.width / 2)) * intensity;
    
    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
  };

  const handleMouseEnter = () => setIsHovering(true);
  
  const handleMouseLeave = () => {
    setIsHovering(false);
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX: isHovering ? rotateX : 0,
        rotateY: isHovering ? rotateY : 0,
        scale: isHovering ? 1.02 : 1,
      }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 30,
      }}
      className={cn(
        "relative bg-card rounded-3xl shadow-2xl shadow-black/10 border border-border/50",
        "animate-float",
        className
      )}
      style={{ 
        animationDelay: `${floatDelay}s`,
        transformStyle: "preserve-3d",
        perspective: "1000px"
      }}
    >
      {/* Highlight effect */}
      <div 
        className={cn(
          "absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-300 pointer-events-none",
          "bg-gradient-to-br from-white/20 via-transparent to-transparent",
          isHovering && "opacity-100"
        )}
        style={{
          transform: `translateZ(1px)`,
        }}
      />
      
      {/* Dynamic shadow based on tilt */}
      <div 
        className="absolute inset-0 rounded-3xl pointer-events-none transition-all duration-300"
        style={{
          boxShadow: isHovering 
            ? `${rotateY * 0.5}px ${rotateX * -0.5}px 40px rgba(0, 0, 0, 0.15)`
            : 'none'
        }}
      />
      
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}
