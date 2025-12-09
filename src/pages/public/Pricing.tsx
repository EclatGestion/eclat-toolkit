import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PublicPageLayout } from "@/components/layout/PublicPageLayout";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Check, Crown, Gem, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PlanFeature {
  name: string;
  free: boolean;
  premium: boolean;
  expert: boolean;
}

const features: PlanFeature[] = [
  { name: "Calculateur d'inflation", free: true, premium: true, expert: true },
  { name: "Capacité d'épargne mensuelle", free: true, premium: true, expert: true },
  { name: "Simulateur IR (basique)", free: true, premium: true, expert: true },
  { name: "Académie financière", free: true, premium: true, expert: true },
  { name: "Simulateur IR complet (PER, Girardin)", free: false, premium: true, expert: true },
  { name: "Simulateur immobilier complet", free: false, premium: true, expert: true },
  { name: "Intérêts composés (tous scénarios)", free: false, premium: true, expert: true },
  { name: "Simulateur Assurance-Vie", free: false, premium: true, expert: true },
  { name: "Optimisation PER", free: false, premium: true, expert: true },
  { name: "Droits de succession", free: false, premium: false, expert: true },
  { name: "Comparateur LMNP", free: false, premium: false, expert: true },
  { name: "Bilan patrimonial IA", free: false, premium: false, expert: true },
  { name: "Export PDF premium", free: false, premium: false, expert: true },
];

const plans = [
  {
    id: "free",
    name: "Gratuit",
    description: "Pour découvrir les outils essentiels",
    monthlyPrice: 0,
    annualPrice: 0,
    icon: Sparkles,
    color: "text-muted-foreground",
    bgColor: "bg-muted/50",
    borderColor: "border-border",
    buttonVariant: "outline" as const,
  },
  {
    id: "premium",
    name: "Premium",
    description: "Tous les simulateurs avancés",
    monthlyPrice: 5.99,
    annualPrice: 49.99,
    annualSaving: 30,
    icon: Crown,
    color: "text-amber-600",
    bgColor: "bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30",
    borderColor: "border-amber-200 dark:border-amber-800",
    buttonVariant: "default" as const,
    popular: true,
  },
  {
    id: "expert",
    name: "Expert",
    description: "Analyse IA et outils patrimoniaux",
    monthlyPrice: 14.99,
    annualPrice: 149.99,
    annualSaving: 17,
    icon: Gem,
    color: "text-violet-600",
    bgColor: "bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-violet-950/30 dark:to-indigo-950/30",
    borderColor: "border-violet-200 dark:border-violet-800",
    buttonVariant: "default" as const,
  },
];

const jsonLdSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Éclat Toolkit",
  "description": "Application de gestion de patrimoine avec simulateurs fiscaux et financiers",
  "offers": [
    {
      "@type": "Offer",
      "name": "Gratuit",
      "price": "0",
      "priceCurrency": "EUR"
    },
    {
      "@type": "Offer",
      "name": "Premium",
      "price": "5.99",
      "priceCurrency": "EUR",
      "priceValidUntil": "2025-12-31"
    },
    {
      "@type": "Offer",
      "name": "Expert",
      "price": "14.99",
      "priceCurrency": "EUR",
      "priceValidUntil": "2025-12-31"
    }
  ]
};

export default function Pricing() {
  const navigate = useNavigate();
  const [isAnnual, setIsAnnual] = useState(true);

  const getPrice = (plan: typeof plans[0]) => {
    if (plan.id === "free") return "0€";
    return isAnnual 
      ? `${plan.annualPrice?.toFixed(2).replace(".", ",")}€` 
      : `${plan.monthlyPrice.toFixed(2).replace(".", ",")}€`;
  };

  const getPeriod = (plan: typeof plans[0]) => {
    if (plan.id === "free") return "";
    return isAnnual ? "/an" : "/mois";
  };

  return (
    <PublicPageLayout
      title="Tarifs | Éclat Toolkit - Gestion de Patrimoine"
      description="Choisissez la formule adaptée à vos besoins : Gratuit, Premium ou Expert. Simulateurs fiscaux, immobiliers et patrimoniaux."
      jsonLd={jsonLdSchema}
    >
      <div className="space-y-12">
        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4">
          <span className={cn("text-sm font-medium", !isAnnual ? "text-foreground" : "text-muted-foreground")}>
            Mensuel
          </span>
          <Switch checked={isAnnual} onCheckedChange={setIsAnnual} />
          <span className={cn("text-sm font-medium", isAnnual ? "text-foreground" : "text-muted-foreground")}>
            Annuel
            <span className="ml-2 text-xs text-emerald-600 font-semibold">
              Jusqu'à -30%
            </span>
          </span>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "relative rounded-3xl p-6 border-2 transition-all",
                plan.bgColor,
                plan.borderColor,
                plan.popular && "ring-2 ring-amber-500 ring-offset-2"
              )}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Populaire
                  </span>
                </div>
              )}

              <div className="flex items-center gap-3 mb-4">
                <div className={cn("p-2 rounded-xl", plan.id === "free" ? "bg-muted" : plan.id === "premium" ? "bg-amber-100 dark:bg-amber-900/30" : "bg-violet-100 dark:bg-violet-900/30")}>
                  <plan.icon className={cn("w-5 h-5", plan.color)} />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{plan.name}</h3>
                  <p className="text-xs text-muted-foreground">{plan.description}</p>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-foreground">{getPrice(plan)}</span>
                  <span className="text-muted-foreground">{getPeriod(plan)}</span>
                </div>
                {plan.annualSaving && isAnnual && (
                  <p className="text-xs text-emerald-600 mt-1">
                    Économisez {plan.annualSaving}% vs mensuel
                  </p>
                )}
              </div>

              <Button
                variant={plan.buttonVariant}
                onClick={() => navigate("/auth")}
                className={cn(
                  "w-full rounded-xl mb-6",
                  plan.id === "premium" && "bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white",
                  plan.id === "expert" && "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white"
                )}
              >
                {plan.id === "free" ? "Commencer gratuitement" : "S'inscrire"}
              </Button>

              <div className="space-y-3">
                {features.map((feature) => {
                  const hasFeature = plan.id === "free" ? feature.free : plan.id === "premium" ? feature.premium : feature.expert;
                  return (
                    <div
                      key={feature.name}
                      className={cn(
                        "flex items-center gap-2 text-sm",
                        hasFeature ? "text-foreground" : "text-muted-foreground/50"
                      )}
                    >
                      <Check className={cn("w-4 h-4 flex-shrink-0", hasFeature ? "text-emerald-500" : "text-muted-foreground/30")} />
                      <span className={!hasFeature ? "line-through" : ""}>{feature.name}</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>

        {/* FAQ or Trust Section */}
        <div className="text-center py-8 border-t border-gray-100">
          <p className="text-muted-foreground mb-4">
            Des questions ? Consultez notre{" "}
            <button onClick={() => navigate("/blog")} className="text-primary hover:underline">
              blog
            </button>{" "}
            ou{" "}
            <button onClick={() => navigate("/auth")} className="text-primary hover:underline">
              créez un compte gratuit
            </button>{" "}
            pour essayer.
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <span>✓ Sans engagement</span>
            <span>✓ Données sécurisées</span>
            <span>✓ Support réactif</span>
          </div>
        </div>
      </div>
    </PublicPageLayout>
  );
}
