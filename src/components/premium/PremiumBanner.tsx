import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Zap, Shield, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePremium } from "@/hooks/usePremium";
import { UpgradePremiumModal } from "./UpgradePremiumModal";

export function PremiumBanner() {
  const { isPremium, isLoading } = usePremium();
  const [isDismissed, setIsDismissed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isLoading || isPremium || isDismissed) {
    return null;
  }

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="relative bg-gradient-to-r from-primary/10 via-primary/5 to-amber-500/10 rounded-2xl p-4 mb-6 border border-primary/20"
        >
          <button
            onClick={() => setIsDismissed(true)}
            className="absolute top-3 right-3 p-1 hover:bg-muted rounded-md transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>

            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-1">
                Débloquez tout le potentiel d'Éclat Toolkit
              </h3>
              <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  Analyse IA
                </span>
                <span className="flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                  Coach Épargne
                </span>
                <span className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-primary" />
                  Jauge de Sérénité
                </span>
              </div>
            </div>

            <Button 
              onClick={() => setIsModalOpen(true)}
              className="gap-2 shrink-0"
            >
              <Sparkles className="w-4 h-4" />
              Passer Premium
            </Button>
          </div>
        </motion.div>
      </AnimatePresence>

      <UpgradePremiumModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  );
}
