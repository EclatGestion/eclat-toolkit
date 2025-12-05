import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePremium } from "@/hooks/usePremium";

interface PremiumLockProps {
  children: ReactNode;
  featureName?: string;
}

export function PremiumLock({ children, featureName = "cette fonctionnalité" }: PremiumLockProps) {
  const { isPremium, isLoading } = usePremium();

  if (isLoading) {
    return (
      <div className="relative">
        <div className="opacity-50 pointer-events-none blur-[2px]">
          {children}
        </div>
      </div>
    );
  }

  if (isPremium) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      {/* Blurred content */}
      <div className="opacity-40 pointer-events-none blur-[3px] select-none">
        {children}
      </div>

      {/* Lock overlay */}
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 flex flex-col items-center justify-center bg-card/60 backdrop-blur-[2px] rounded-3xl"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            className="flex flex-col items-center text-center p-6"
          >
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <h4 className="text-lg font-semibold text-foreground mb-2">
              Fonctionnalité Premium
            </h4>
            <p className="text-sm text-muted-foreground mb-4 max-w-[200px]">
              Débloquez {featureName} avec l'abonnement Premium
            </p>
            <Button className="gap-2">
              <Sparkles className="w-4 h-4" />
              Passer Premium
            </Button>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
