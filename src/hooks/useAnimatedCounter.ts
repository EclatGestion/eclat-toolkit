import { useState, useEffect, useRef } from "react";

export function useAnimatedCounter(endValue: number, duration: number = 500) {
  const [displayValue, setDisplayValue] = useState(endValue);
  const previousValue = useRef(endValue);
  const animationRef = useRef<number>();

  useEffect(() => {
    const startValue = previousValue.current;
    const diff = endValue - startValue;
    
    if (diff === 0) return;

    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      const currentValue = startValue + diff * easeOut;
      setDisplayValue(Math.round(currentValue));

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        previousValue.current = endValue;
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [endValue, duration]);

  return displayValue;
}
