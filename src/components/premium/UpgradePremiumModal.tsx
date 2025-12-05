import { useState } from "react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Sparkles, 
  Check, 
  Shield, 
  TrendingUp, 
  PieChart,
  Brain,
  Zap,
  Loader2
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UpgradePremiumModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const premiumFeatures = [
  {
    icon: Shield,
    title: "Jauge de Sérénité",
    description: "Visualisez votre coussin de sécurité financière en mois de dépenses",
  },
  {
    icon: TrendingUp,
    title: "Coach Épargne",
    description: "Simulez l'impact d'une réduction de vos dépenses sur votre taux d'épargne",
  },
  {
    icon: PieChart,
    title: "Analyse 50/30/20",
    description: "Comparez votre budget à la règle d'or de la gestion financière",
  },
  {
    icon: Brain,
    title: "Analyse IA des dépenses",
    description: "Import de relevés bancaires avec catégorisation automatique par IA",
  },
  {
    icon: Zap,
    title: "Recommandations personnalisées",
    description: "Conseils d'optimisation basés sur vos habitudes de dépenses",
  },
];

type PlanType = "monthly" | "annual";

export function UpgradePremiumModal({ open, onOpenChange }: UpgradePremiumModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanType>("monthly");

  const handleUpgrade = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { priceType: selectedPlan },
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (error) {
      console.error("Error creating checkout:", error);
      toast.error("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            Passez à Premium
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          {/* Plan Toggle */}
          <div className="flex gap-2 p-1 bg-muted rounded-xl mb-4">
            <button
              onClick={() => setSelectedPlan("monthly")}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                selectedPlan === "monthly"
                  ? "bg-background shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Mensuel
            </button>
            <button
              onClick={() => setSelectedPlan("annual")}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all relative ${
                selectedPlan === "annual"
                  ? "bg-background shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Annuel
              <span className="absolute -top-2 -right-2 px-1.5 py-0.5 text-[10px] font-bold bg-success text-white rounded-full">
                -30%
              </span>
            </button>
          </div>

          {/* Price */}
          <div className="bg-gradient-to-r from-primary/10 to-amber-500/10 rounded-2xl p-6 text-center mb-6">
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-4xl font-bold text-foreground">
                {selectedPlan === "monthly" ? "5,99€" : "49,99€"}
              </span>
              <span className="text-muted-foreground">
                /{selectedPlan === "monthly" ? "mois" : "an"}
              </span>
            </div>
            {selectedPlan === "annual" && (
              <p className="text-sm text-success mt-2 font-medium">
                Soit 4,17€/mois • Économisez 21,89€
              </p>
            )}
            <p className="text-sm text-muted-foreground mt-2">
              Sans engagement • Annulable à tout moment
            </p>
          </div>

          {/* Features */}
          <div className="space-y-3 mb-6">
            {premiumFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-start gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <feature.icon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground text-sm">{feature.title}</p>
                  <p className="text-xs text-muted-foreground">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <Button 
            onClick={handleUpgrade} 
            className="w-full gap-2" 
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Chargement...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Passer à Premium
              </>
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground mt-3">
            Paiement sécurisé par Stripe
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
