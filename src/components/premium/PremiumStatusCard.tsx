import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, Crown, CreditCard, Calendar, ExternalLink, Diamond, Loader2, History, ArrowUpRight, FileText } from "lucide-react";
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

interface Invoice {
  id: string;
  number: string;
  date: number;
  amount: number;
  currency: string;
  status: string;
  pdfUrl: string | null;
  hostedUrl: string | null;
  description: string;
}

export function PremiumStatusCard() {
  const { tier, isPremium, isExpert, isLoading, subscriptionData } = usePremium();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isManaging, setIsManaging] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

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

  const loadPaymentHistory = async () => {
    if (invoices.length > 0) {
      setShowHistory(!showHistory);
      return;
    }
    
    setIsLoadingHistory(true);
    try {
      const { data, error } = await supabase.functions.invoke('payment-history');
      if (error) throw error;
      setInvoices(data?.invoices || []);
      setShowHistory(true);
    } catch (error) {
      console.error("Error loading payment history:", error);
      toast.error("Impossible de charger l'historique");
    } finally {
      setIsLoadingHistory(false);
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

  const formatInvoiceDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100);
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

        <div className="flex flex-wrap gap-3 mb-4">
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
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-2"
            onClick={loadPaymentHistory}
            disabled={isLoadingHistory}
          >
            {isLoadingHistory ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <History className="w-4 h-4" />
            )}
            Historique
          </Button>
        </div>

        {/* Upgrade/Downgrade hint */}
        <p className="text-xs text-muted-foreground mb-4">
          Pour changer de formule (upgrade vers Expert ou passer à une offre inférieure), 
          cliquez sur "Gérer l'abonnement" pour accéder au portail de gestion.
        </p>

        {/* Payment History */}
        {showHistory && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="border-t border-border pt-4 mt-4"
          >
            <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
              <History className="w-4 h-4" />
              Historique des paiements
            </h4>
            {invoices.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucun paiement enregistré</p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {invoices.map((invoice) => (
                  <div 
                    key={invoice.id}
                    className="flex items-center justify-between py-2 px-3 bg-background/50 rounded-lg text-sm"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-foreground">
                          {formatAmount(invoice.amount, invoice.currency)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatInvoiceDate(invoice.date)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 text-xs rounded-full ${
                        invoice.status === 'paid' 
                          ? 'bg-emerald-500/10 text-emerald-600' 
                          : 'bg-amber-500/10 text-amber-600'
                      }`}>
                        {invoice.status === 'paid' ? 'Payé' : invoice.status}
                      </span>
                      {invoice.pdfUrl && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0"
                          onClick={() => window.open(invoice.pdfUrl!, '_blank')}
                        >
                          <ArrowUpRight className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
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
