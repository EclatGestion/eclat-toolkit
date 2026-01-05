import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Crown, Diamond, Check, ArrowRight, Loader2, AlertCircle, Sparkles, XCircle, AlertTriangle } from "lucide-react";
import { usePremium } from "@/hooks/usePremium";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface SubscriptionChangeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type TierType = "premium" | "expert";
type PlanType = "monthly" | "annual";
type ModalStep = "plans" | "confirm-change" | "confirm-cancel";

interface PlanOption {
  id: TierType;
  name: string;
  monthlyPrice: string;
  annualPrice: string;
  icon: typeof Crown;
  features: string[];
  colorClass: string;
  bgClass: string;
  borderClass: string;
}

const plans: PlanOption[] = [
  {
    id: "premium",
    name: "Premium",
    monthlyPrice: "5,99€",
    annualPrice: "49,99€",
    icon: Crown,
    features: [
      "Simulateur IR complet",
      "Simulateur immobilier",
      "Intérêts composés avancé",
      "Assurance-vie & PER",
      "Recommandations IA",
    ],
    colorClass: "text-amber-500",
    bgClass: "bg-amber-500/10",
    borderClass: "border-amber-500/30",
  },
  {
    id: "expert",
    name: "Expert",
    monthlyPrice: "14,99€",
    annualPrice: "149,99€",
    icon: Diamond,
    features: [
      "Tout Premium inclus",
      "Bilan patrimonial IA",
      "Simulateur succession",
      "Comparateur LMNP",
      "Conseiller IA par objectifs",
      "Analyse actions",
      "Export PDF complet",
    ],
    colorClass: "text-violet-500",
    bgClass: "bg-violet-500/10",
    borderClass: "border-violet-500/30",
  },
];

export function SubscriptionChangeModal({ open, onOpenChange }: SubscriptionChangeModalProps) {
  const { tier, subscriptionData, refreshSubscription } = usePremium();
  const [selectedPlan, setSelectedPlan] = useState<TierType | null>(null);
  const [billingCycle, setBillingCycle] = useState<PlanType>("monthly");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<ModalStep>("plans");
  const [cancelImmediate, setCancelImmediate] = useState(false);

  const currentTier = tier as TierType;
  const tierOrder = { free: 0, premium: 1, expert: 2 };

  const isUpgrade = (planId: TierType) => tierOrder[planId] > tierOrder[currentTier];
  const isDowngrade = (planId: TierType) => tierOrder[planId] < tierOrder[currentTier];
  const isCurrent = (planId: TierType) => planId === currentTier;

  const handleSelectPlan = (planId: TierType) => {
    if (isCurrent(planId)) return;
    setSelectedPlan(planId);
    setStep("confirm-change");
  };

  const handleConfirmChange = async () => {
    if (!selectedPlan) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('update-subscription', {
        body: { newTier: selectedPlan, newPlanType: billingCycle }
      });

      if (error) throw error;

      if (data?.success) {
        toast.success(data.message);
        await refreshSubscription();
        handleClose();
      } else {
        throw new Error(data?.message || "Échec de la mise à jour");
      }
    } catch (error) {
      console.error("Error updating subscription:", error);
      toast.error(error instanceof Error ? error.message : "Impossible de modifier l'abonnement");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('cancel-subscription', {
        body: { immediate: cancelImmediate }
      });

      if (error) throw error;

      if (data?.success) {
        toast.success(data.message);
        await refreshSubscription();
        handleClose();
      } else {
        throw new Error(data?.message || "Échec de l'annulation");
      }
    } catch (error) {
      console.error("Error canceling subscription:", error);
      toast.error(error instanceof Error ? error.message : "Impossible d'annuler l'abonnement");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setStep("plans");
    setSelectedPlan(null);
    setCancelImmediate(false);
  };

  const handleClose = () => {
    onOpenChange(false);
    setStep("plans");
    setSelectedPlan(null);
    setCancelImmediate(false);
  };

  const getButtonText = (planId: TierType) => {
    if (isCurrent(planId)) return "Votre plan actuel";
    if (isUpgrade(planId)) return "Passer à Expert";
    return "Rétrograder";
  };

  const getButtonVariant = (planId: TierType) => {
    if (isCurrent(planId)) return "outline";
    if (isUpgrade(planId)) return "default";
    return "secondary";
  };

  const renewalDate = subscriptionData?.subscription_end
    ? new Date(subscriptionData.subscription_end).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    : null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {step === "confirm-cancel" 
              ? "Annuler l'abonnement" 
              : step === "confirm-change" 
                ? "Confirmer le changement" 
                : "Changer de formule"}
          </DialogTitle>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {step === "plans" && (
            <motion.div
              key="plans"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              {/* Billing cycle toggle */}
              <div className="flex justify-center">
                <div className="inline-flex items-center gap-2 p-1 bg-muted rounded-full">
                  <button
                    onClick={() => setBillingCycle("monthly")}
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-medium transition-all",
                      billingCycle === "monthly"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Mensuel
                  </button>
                  <button
                    onClick={() => setBillingCycle("annual")}
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-medium transition-all",
                      billingCycle === "annual"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Annuel
                    <span className="ml-1 text-xs text-emerald-500">-17%</span>
                  </button>
                </div>
              </div>

              {/* Plan cards */}
              <div className="grid md:grid-cols-2 gap-4">
                {plans.map((plan) => {
                  const Icon = plan.icon;
                  const current = isCurrent(plan.id);
                  const upgrade = isUpgrade(plan.id);
                  const price = billingCycle === "monthly" ? plan.monthlyPrice : plan.annualPrice;
                  const period = billingCycle === "monthly" ? "/mois" : "/an";

                  return (
                    <motion.div
                      key={plan.id}
                      whileHover={{ scale: current ? 1 : 1.02 }}
                      className={cn(
                        "relative rounded-2xl p-5 border-2 transition-all",
                        current ? `${plan.borderClass} ${plan.bgClass}` : "border-border bg-card hover:border-muted-foreground/30",
                        !current && "cursor-pointer"
                      )}
                      onClick={() => !current && handleSelectPlan(plan.id)}
                    >
                      {current && (
                        <span className="absolute -top-3 left-4 px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                          Votre plan
                        </span>
                      )}
                      
                      <div className="flex items-center gap-3 mb-4">
                        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", plan.bgClass)}>
                          <Icon className={cn("w-5 h-5", plan.colorClass)} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{plan.name}</h3>
                          <p className="text-lg font-bold text-foreground">
                            {price}<span className="text-sm font-normal text-muted-foreground">{period}</span>
                          </p>
                        </div>
                      </div>

                      <ul className="space-y-2 mb-4">
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Check className={cn("w-4 h-4", plan.colorClass)} />
                            {feature}
                          </li>
                        ))}
                      </ul>

                      {!current && (
                        <Button
                          variant={getButtonVariant(plan.id) as "default" | "secondary"}
                          className={cn(
                            "w-full gap-2",
                            upgrade && "bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700"
                          )}
                        >
                          {getButtonText(plan.id)}
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {/* Info box */}
              <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-xl text-sm">
                <AlertCircle className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                <div className="text-muted-foreground">
                  <p className="font-medium text-foreground mb-1">Comment ça marche ?</p>
                  <ul className="space-y-1">
                    <li>• <strong>Upgrade :</strong> Changement immédiat, prorata facturé</li>
                    <li>• <strong>Downgrade :</strong> Effectif à la fin de votre période actuelle</li>
                  </ul>
                </div>
              </div>

              {/* Cancel subscription button */}
              <div className="pt-4 border-t border-border">
                <Button
                  variant="ghost"
                  className="w-full text-destructive hover:text-destructive hover:bg-destructive/10 gap-2"
                  onClick={() => setStep("confirm-cancel")}
                >
                  <XCircle className="w-4 h-4" />
                  Annuler mon abonnement
                </Button>
              </div>
            </motion.div>
          )}

          {step === "confirm-change" && selectedPlan && (
            <motion.div
              key="confirm-change"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Change summary */}
              <div className="p-5 bg-muted/50 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center",
                      currentTier === "premium" ? "bg-amber-500/10" : "bg-violet-500/10"
                    )}>
                      {currentTier === "premium" ? (
                        <Crown className="w-5 h-5 text-amber-500" />
                      ) : (
                        <Diamond className="w-5 h-5 text-violet-500" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Actuel</p>
                      <p className="font-medium text-foreground capitalize">{currentTier}</p>
                    </div>
                  </div>
                  
                  <ArrowRight className="w-5 h-5 text-muted-foreground" />
                  
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center",
                      selectedPlan === "premium" ? "bg-amber-500/10" : "bg-violet-500/10"
                    )}>
                      {selectedPlan === "premium" ? (
                        <Crown className="w-5 h-5 text-amber-500" />
                      ) : (
                        <Diamond className="w-5 h-5 text-violet-500" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Nouveau</p>
                      <p className="font-medium text-foreground capitalize">{selectedPlan}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Warning/Info based on change type */}
              <div className={cn(
                "p-4 rounded-xl flex items-start gap-3",
                isUpgrade(selectedPlan) ? "bg-emerald-500/10" : "bg-amber-500/10"
              )}>
                {isUpgrade(selectedPlan) ? (
                  <Sparkles className="w-5 h-5 text-emerald-500 shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
                )}
                <div className="text-sm">
                  {isUpgrade(selectedPlan) ? (
                    <>
                      <p className="font-medium text-foreground mb-1">Upgrade immédiat</p>
                      <p className="text-muted-foreground">
                        Votre abonnement sera mis à niveau immédiatement. Un prorata sera calculé 
                        et facturé pour la période restante.
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="font-medium text-foreground mb-1">Changement programmé</p>
                      <p className="text-muted-foreground">
                        Votre abonnement restera actif jusqu'au {renewalDate}. 
                        Le nouveau plan prendra effet à cette date.
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3">
                <Button variant="outline" onClick={handleBack} className="flex-1">
                  Retour
                </Button>
                <Button 
                  onClick={handleConfirmChange} 
                  disabled={isLoading}
                  className={cn(
                    "flex-1 gap-2",
                    isUpgrade(selectedPlan) && "bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700"
                  )}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Traitement...
                    </>
                  ) : (
                    <>
                      Confirmer le changement
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          )}

          {step === "confirm-cancel" && (
            <motion.div
              key="confirm-cancel"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Warning */}
              <div className="p-5 bg-destructive/10 rounded-2xl flex items-start gap-4">
                <AlertTriangle className="w-8 h-8 text-destructive shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Êtes-vous sûr de vouloir annuler ?</h3>
                  <p className="text-sm text-muted-foreground">
                    Vous perdrez l'accès à toutes les fonctionnalités premium, notamment :
                  </p>
                  <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                    <li>• Simulateurs avancés (IR, immobilier, succession...)</li>
                    <li>• Recommandations IA personnalisées</li>
                    <li>• Export PDF des bilans</li>
                    <li>• Conseiller IA par objectifs</li>
                  </ul>
                </div>
              </div>

              {/* Cancel options */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-foreground">Quand souhaitez-vous annuler ?</p>
                
                <div
                  className={cn(
                    "p-4 rounded-xl border-2 cursor-pointer transition-all",
                    !cancelImmediate ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground/30"
                  )}
                  onClick={() => setCancelImmediate(false)}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                      !cancelImmediate ? "border-primary" : "border-muted-foreground"
                    )}>
                      {!cancelImmediate && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">À la fin de la période</p>
                      <p className="text-sm text-muted-foreground">
                        Conservez l'accès jusqu'au {renewalDate}
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  className={cn(
                    "p-4 rounded-xl border-2 cursor-pointer transition-all",
                    cancelImmediate ? "border-destructive bg-destructive/5" : "border-border hover:border-muted-foreground/30"
                  )}
                  onClick={() => setCancelImmediate(true)}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                      cancelImmediate ? "border-destructive" : "border-muted-foreground"
                    )}>
                      {cancelImmediate && <div className="w-2.5 h-2.5 rounded-full bg-destructive" />}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Immédiatement</p>
                      <p className="text-sm text-muted-foreground">
                        Perte immédiate de l'accès premium (sans remboursement)
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3">
                <Button variant="outline" onClick={handleBack} className="flex-1">
                  Retour
                </Button>
                <Button 
                  variant="destructive"
                  onClick={handleCancelSubscription} 
                  disabled={isLoading}
                  className="flex-1 gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Annulation...
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4" />
                      Confirmer l'annulation
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
