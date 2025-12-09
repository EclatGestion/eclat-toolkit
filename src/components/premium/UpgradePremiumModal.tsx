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
  Crown,
  Gem,
  Loader2,
  X
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { usePremium, SubscriptionTier } from "@/hooks/usePremium";
import { cn } from "@/lib/utils";

interface UpgradePremiumModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  targetTier?: "premium" | "expert";
}

type PlanType = "monthly" | "annual";

interface PlanFeature {
  name: string;
  free: boolean;
  premium: boolean;
  expert: boolean;
}

const planFeatures: PlanFeature[] = [
  { name: "Calculateur Inflation", free: true, premium: true, expert: true },
  { name: "Capacité d'Épargne", free: true, premium: true, expert: true },
  { name: "Simulateur IR (basique)", free: true, premium: true, expert: true },
  { name: "Académie Financière", free: true, premium: true, expert: true },
  { name: "Simulateur IR complet (PER/Girardin)", free: false, premium: true, expert: true },
  { name: "Simulateur Immobilier", free: false, premium: true, expert: true },
  { name: "Intérêts Composés (tous scénarios)", free: false, premium: true, expert: true },
  { name: "Simulateur Assurance-Vie", free: false, premium: true, expert: true },
  { name: "Optimisation PER", free: false, premium: true, expert: true },
  { name: "Analyse dépenses IA", free: false, premium: true, expert: true },
  { name: "Simulateur Droits de Succession", free: false, premium: false, expert: true },
  { name: "Comparateur LMNP vs Location Nue", free: false, premium: false, expert: true },
  { name: "Bilan Patrimonial Avancé + IA", free: false, premium: false, expert: true },
  { name: "Export PDF professionnel", free: false, premium: false, expert: true },
];

const plans = [
  {
    id: "free" as const,
    name: "Gratuit",
    icon: Sparkles,
    monthlyPrice: 0,
    annualPrice: 0,
    color: "muted",
    borderColor: "border-border",
    bgColor: "bg-muted/50",
    iconColor: "text-muted-foreground",
  },
  {
    id: "premium" as const,
    name: "Premium",
    icon: Crown,
    monthlyPrice: 5.99,
    annualPrice: 49.99,
    color: "amber",
    borderColor: "border-amber-500/50",
    bgColor: "bg-gradient-to-b from-amber-500/10 to-yellow-500/10",
    iconColor: "text-amber-500",
    popular: true,
  },
  {
    id: "expert" as const,
    name: "Expert",
    icon: Gem,
    monthlyPrice: 14.99,
    annualPrice: 149.99,
    annualSaving: 17,
    color: "violet",
    borderColor: "border-violet-500/50",
    bgColor: "bg-gradient-to-b from-violet-500/10 to-purple-500/10",
    iconColor: "text-violet-500",
  },
];

export function UpgradePremiumModal({ open, onOpenChange, targetTier }: UpgradePremiumModalProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<PlanType>("monthly");
  const { tier: currentTier } = usePremium();

  const handleUpgrade = async (planId: "premium" | "expert") => {
    let priceType: string;
    if (planId === "premium") {
      priceType = billingCycle === "annual" ? "premium_annual" : "premium_monthly";
    } else {
      priceType = billingCycle === "annual" ? "expert_annual" : "expert_monthly";
    }
    
    setIsLoading(priceType);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { priceType },
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (error) {
      console.error("Error creating checkout:", error);
      toast.error("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsLoading(null);
    }
  };

  const getButtonText = (planId: SubscriptionTier) => {
    if (planId === "free") return "Plan actuel";
    if (currentTier === planId) return "Plan actuel";
    if (currentTier === "expert" && planId === "premium") return "Downgrade";
    return "Choisir";
  };

  const isCurrentPlan = (planId: SubscriptionTier) => currentTier === planId;
  const canUpgrade = (planId: SubscriptionTier) => {
    if (planId === "free") return false;
    if (currentTier === "expert") return false;
    if (currentTier === "premium" && planId === "premium") return false;
    return true;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            Choisissez votre formule
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          {/* Billing Toggle - Only for Premium */}
          <div className="flex justify-center mb-6">
            <div className="flex gap-2 p-1 bg-muted rounded-xl">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={cn(
                  "py-2 px-4 rounded-lg text-sm font-medium transition-all",
                  billingCycle === "monthly"
                    ? "bg-background shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Mensuel
              </button>
              <button
                onClick={() => setBillingCycle("annual")}
                className={cn(
                  "py-2 px-4 rounded-lg text-sm font-medium transition-all relative",
                  billingCycle === "annual"
                    ? "bg-background shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Annuel
                <span className="absolute -top-2 -right-2 px-1.5 py-0.5 text-[10px] font-bold bg-green-500 text-white rounded-full">
                  -30%
                </span>
              </button>
            </div>
          </div>

          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "relative rounded-2xl border-2 p-5 transition-all",
                  plan.borderColor,
                  plan.bgColor,
                  isCurrentPlan(plan.id) && "ring-2 ring-primary ring-offset-2",
                  targetTier === plan.id && "ring-2 ring-primary ring-offset-2"
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-amber-500 text-white text-xs font-bold rounded-full">
                    POPULAIRE
                  </div>
                )}
                
                {isCurrentPlan(plan.id) && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full">
                    VOTRE PLAN
                  </div>
                )}

                <div className="text-center mb-4">
                  <div className={cn("w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center", plan.bgColor)}>
                    <plan.icon className={cn("w-6 h-6", plan.iconColor)} />
                  </div>
                  <h3 className="text-lg font-bold">{plan.name}</h3>
                  <div className="mt-2">
                    {plan.id === "free" ? (
                      <span className="text-3xl font-bold">0€</span>
                    ) : plan.id === "premium" ? (
                      <>
                        <span className="text-3xl font-bold">
                          {billingCycle === "monthly" ? "5,99€" : "49,99€"}
                        </span>
                        <span className="text-muted-foreground">
                          /{billingCycle === "monthly" ? "mois" : "an"}
                        </span>
                        {billingCycle === "annual" && (
                          <p className="text-xs text-green-600 mt-1">Soit 4,17€/mois</p>
                        )}
                      </>
                    ) : (
                      <>
                        <span className="text-3xl font-bold">
                          {billingCycle === "monthly" ? "14,99€" : "149,99€"}
                        </span>
                        <span className="text-muted-foreground">
                          /{billingCycle === "monthly" ? "mois" : "an"}
                        </span>
                        {billingCycle === "annual" && (
                          <p className="text-xs text-green-600 mt-1">-17% soit 12,50€/mois</p>
                        )}
                      </>
                    )}
                  </div>
                </div>

                <Button
                  className="w-full mb-4"
                  variant={plan.id === "free" ? "outline" : "default"}
                  disabled={!canUpgrade(plan.id) || isLoading !== null}
                  onClick={() => plan.id !== "free" && handleUpgrade(plan.id)}
                >
                  {isLoading && (plan.id === "premium" || plan.id === "expert") ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : null}
                  {getButtonText(plan.id)}
                </Button>

                <div className="space-y-2">
                  {planFeatures.map((feature) => {
                    const hasFeature = feature[plan.id];
                    return (
                      <div
                        key={feature.name}
                        className={cn(
                          "flex items-center gap-2 text-sm",
                          !hasFeature && "opacity-40"
                        )}
                      >
                        {hasFeature ? (
                          <Check className="w-4 h-4 text-green-500 shrink-0" />
                        ) : (
                          <X className="w-4 h-4 text-muted-foreground shrink-0" />
                        )}
                        <span className={cn(!hasFeature && "line-through")}>
                          {feature.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>

          <p className="text-xs text-center text-muted-foreground">
            Paiement sécurisé par Stripe • Sans engagement • Annulable à tout moment
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
