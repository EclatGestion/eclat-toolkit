import { motion } from "framer-motion";
import { ParallaxCard } from "@/components/ui/parallax-card";
import { TrendingUp, Target, PiggyBank, ArrowUpRight } from "lucide-react";

const floatingCards = [
  {
    id: 1,
    title: "Patrimoine",
    value: "247 500 €",
    change: "+12.4%",
    icon: TrendingUp,
    position: "top-8 right-0 lg:right-12",
    delay: 0.4,
    floatDelay: "0s",
  },
  {
    id: 2,
    title: "Objectif FIRE",
    value: "68%",
    subtitle: "En bonne voie",
    icon: Target,
    position: "top-48 -left-8 lg:left-0",
    delay: 0.6,
    floatDelay: "1.5s",
  },
  {
    id: 3,
    title: "Économie fiscale",
    value: "-3 240 €",
    subtitle: "Cette année",
    icon: PiggyBank,
    position: "bottom-8 right-8 lg:right-24",
    delay: 0.8,
    floatDelay: "3s",
  },
];

export const HeroFloatingCards = () => {
  return (
    <div className="relative w-full h-[400px] lg:h-[500px]">
      {floatingCards.map((card) => (
        <motion.div
          key={card.id}
          initial={{ opacity: 0, y: 40, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 0.8,
            delay: card.delay,
            ease: [0.16, 1, 0.3, 1],
          }}
          className={`absolute ${card.position}`}
          style={{ animationDelay: card.floatDelay }}
        >
          <div
            className="animate-float"
            style={{ animationDelay: card.floatDelay }}
          >
            <ParallaxCard
              className="p-5 min-w-[180px] backdrop-blur-sm bg-card/90"
              intensity={8}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground font-medium">
                    {card.title}
                  </span>
                  <span className="text-xl font-bold text-foreground">
                    {card.value}
                  </span>
                  {card.change && (
                    <span className="text-xs text-success font-medium flex items-center gap-0.5">
                      <ArrowUpRight className="w-3 h-3" />
                      {card.change}
                    </span>
                  )}
                  {card.subtitle && (
                    <span className="text-xs text-muted-foreground">
                      {card.subtitle}
                    </span>
                  )}
                </div>
                <div className="p-2 rounded-xl bg-primary/10">
                  <card.icon className="w-4 h-4 text-primary" />
                </div>
              </div>
            </ParallaxCard>
          </div>
        </motion.div>
      ))}

      {/* Decorative elements */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border border-primary/10 animate-pulse-soft"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full border border-primary/5 animate-pulse-soft"
        style={{ animationDelay: "1s" }}
      />
    </div>
  );
};
