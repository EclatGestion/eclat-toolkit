import { cn } from "@/lib/utils";

interface AnimatedUnderlineProps {
  children: React.ReactNode;
  className?: string;
  underlineClassName?: string;
}

export const AnimatedUnderline = ({ 
  children, 
  className,
  underlineClassName 
}: AnimatedUnderlineProps) => (
  <span className={cn("relative inline-block", className)}>
    {children}
    <span 
      className={cn(
        "absolute bottom-0 left-0 h-[3px] bg-accent rounded-full animate-underline-draw",
        underlineClassName
      )} 
    />
  </span>
);
