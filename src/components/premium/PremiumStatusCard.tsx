import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Crown, CreditCard, Calendar, ExternalLink, Diamond, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePremium } from "@/hooks/usePremium";
import { UpgradePremiumModal } from "./UpgradePremiumModal";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const PLAN_PRICES = {
  premium: { monthly: "5,99€/mois", annual: "49,99€/an" },
  expert: { monthly: "14,99€/mois", annual: "149,99€/an" },
};

const PLAN_LABELS = {
  premium: "Plan Premium",
  expert: "Plan Expert",
};

export function PremiumStatusCard() {
  const { tier, isPremium, isExpert, isLoading, subscriptionData } = usePremium();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isManaging, setIsManaging] = useState(false);

  const handleManageSubscription = async () => {
    setIsManaging(true);
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');
      if (error) throw error;
      if (data?.url) {
        window.open(data.url, '_blank');
      } else {
        throw new Error("URL du portail non reçue");
      }
    } catch (error) {
      console.error("Error opening customer portal:", error);
      toast.error("Impossible d'ouvrir le portail de gestion");
    } finally {
      setIsManaging(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getPriceLabel = () => {
    if (!subscriptionData?.plan_type) return "—";
    const tierKey = tier === "expert" ? "expert" : "premium";
    return PLAN_PRICES[tierKey][subscriptionData.plan_type];
  };

  if (isLoading) {
    return (
      <div className="bg-card rounded-3xl p-6 shadow-card animate-pulse">
        <div className="h-6 w-32 bg-muted rounded mb-4" />
        <div className="h-4 w-48 bg-muted rounded" />
      </div>
    );
  }

  if (isPremium || isExpert) {
    const TierIcon = isExpert ? Diamond : Crown;
    const tierLabel = isExpert ? PLAN_LABELS.expert : PLAN_LABELS.premium;
    const iconColor = isExpert ? "text-violet-500" : "text-primary";
    const iconBg = isExpert ? "bg-violet-500/10" : "bg-primary/10";
    const gradientFrom = isExpert ? "from-violet-500/5" : "from-primary/5";
    const gradientTo = isExpert ? "to-violet-500/5" : "to-amber-500/5";
    const borderColor = isExpert ? "border-violet-500/20" : "border-primary/20";

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-gradient-to-br ${gradientFrom} via-card ${gradientTo} rounded-3xl p-6 shadow-card border ${borderColor}`}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl ${iconBg} flex items-center justify-center`}>
              <TierIcon className={`w-6 h-6 ${iconColor}`} />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{tierLabel}</h3>
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
            <span className="text-muted-foreground">{getPriceLabel()}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              Prochain renouvellement : {formatDate(subscriptionData?.subscription_end ?? null)}
            </span>
          </div>
        </div>

        <div className="flex gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2"
            onClick={handleManageSubscription}
            disabled={isManaging}
          >
            {isManaging ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ExternalLink className="w-4 h-4" />
            )}
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
