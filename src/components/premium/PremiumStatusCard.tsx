import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Crown, CreditCard, Calendar, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePremium } from "@/hooks/usePremium";
import { UpgradePremiumModal } from "./UpgradePremiumModal";

export function PremiumStatusCard() {
  const { isPremium, isLoading } = usePremium();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="bg-card rounded-3xl p-6 shadow-card animate-pulse">
        <div className="h-6 w-32 bg-muted rounded mb-4" />
        <div className="h-4 w-48 bg-muted rounded" />
      </div>
    );
  }

  if (isPremium) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-primary/5 via-card to-amber-500/5 rounded-3xl p-6 shadow-card border border-primary/20"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Crown className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Plan Premium</h3>
              <p className="text-sm text-muted-foreground">Actif</p>
            </div>
          </div>
          <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 text-xs font-medium rounded-full">
            Actif
          </span>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3 text-sm">
            <CreditCard className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">9,99€/mois</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Prochain renouvellement : 5 janvier 2026</span>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" size="sm" className="gap-2">
            <ExternalLink className="w-4 h-4" />
            Gérer l'abonnement
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-3xl p-6 shadow-card"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Plan Standard</h3>
              <p className="text-sm text-muted-foreground">Gratuit</p>
            </div>
          </div>
          <span className="px-3 py-1 bg-muted text-muted-foreground text-xs font-medium rounded-full">
            Limité
          </span>
        </div>

        <p className="text-sm text-muted-foreground mb-6">
          Débloquez toutes les fonctionnalités avancées avec Premium : analyse IA, 
          coach épargne, et bien plus encore.
        </p>

        <Button onClick={() => setIsModalOpen(true)} className="w-full gap-2">
          <Sparkles className="w-4 h-4" />
          Passer à Premium
        </Button>
      </motion.div>

      <UpgradePremiumModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  );
}
