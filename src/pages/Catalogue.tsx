import { MainLayout } from "@/components/layout/MainLayout";
import { ToolCard } from "@/components/catalogue/ToolCard";
import { Calculator, Scale, Home, Key, TrendingUp, Crown, PiggyBank, TrendingDown, Shield, Target, Brain } from "lucide-react";

const freeTools = [
  {
    id: "capacite-epargne",
    title: "Capacité d'Épargne Mensuelle",
    description: "Calculez votre potentiel d'épargne et recevez des conseils personnalisés.",
    icon: PiggyBank,
    iconColor: "text-teal-500",
    iconBg: "bg-teal-500/10",
    isPremium: false,
  },
  {
    id: "inflation",
    title: "Calculateur d'Inflation",
    description: "Visualisez la perte de pouvoir d'achat de votre épargne face à l'inflation.",
    icon: TrendingDown,
    iconColor: "text-orange-500",
    iconBg: "bg-orange-500/10",
    isPremium: false,
  },
  {
    id: "assurance-vie",
    title: "Simulateur Assurance-Vie",
    description: "Projetez l'évolution de votre contrat et comprenez l'impact des frais.",
    icon: Shield,
    iconColor: "text-violet-500",
    iconBg: "bg-violet-500/10",
    isPremium: false,
  },
  {
    id: "simulateur-ir",
    title: "Simulateur Impôt sur le Revenu",
    description: "Calculez votre TMI et votre impôt net. Optimisation PER/Girardin en Premium.",
    icon: Calculator,
    iconColor: "text-primary",
    iconBg: "bg-primary/10",
    isPremium: false,
  },
  {
    id: "simulateur-immobilier",
    title: "Simulateur Immobilier",
    description: "Calculez votre mensualité. Capacité d'emprunt en Premium.",
    icon: Home,
    iconColor: "text-emerald-500",
    iconBg: "bg-emerald-500/10",
    isPremium: false,
  },
  {
    id: "interets-composes",
    title: "Intérêts Composés",
    description: "Projetez vos placements avec le scénario Équilibré. Tous scénarios en Premium.",
    icon: TrendingUp,
    iconColor: "text-rose-500",
    iconBg: "bg-rose-500/10",
    isPremium: false,
  },
  {
    id: "optimisation-per",
    title: "Optimisation PER",
    description: "Calculez votre réduction d'impôt et projetez la valeur future de votre PER.",
    icon: Target,
    iconColor: "text-emerald-500",
    iconBg: "bg-emerald-500/10",
    isPremium: false,
  },
];

const premiumTools = [
  {
    id: "bilan-patrimonial",
    title: "Bilan Patrimonial Avancé",
    description: "Analyse complète de votre patrimoine avec recommandations IA personnalisées",
    icon: Brain,
    iconColor: "text-indigo-500",
    iconBg: "bg-indigo-500/10",
    isPremium: true,
  },
  {
    id: "droits-succession",
    title: "Droits de Succession",
    description: "Estimez les droits à payer lors d'une succession et optimisez la transmission",
    icon: Scale,
    iconColor: "text-purple-500",
    iconBg: "bg-purple-500/10",
    isPremium: true,
  },
  {
    id: "comparateur-lmnp",
    title: "Comparateur LMNP vs Location Nue",
    description: "Comparez la fiscalité meublé vs vide et optimisez vos revenus locatifs",
    icon: Key,
    iconColor: "text-amber-500",
    iconBg: "bg-amber-500/10",
    isPremium: true,
  },
];

export default function Catalogue() {
  return (
    <MainLayout title="Catalogue d'Outils">
      <div className="space-y-10">
        {/* Section Outils Gratuits */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-xl font-semibold text-foreground">
              🚀 Outils Gratuits
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-medium">
              {freeTools.length} outils
            </span>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Accédez aux fonctionnalités de base pour gérer votre patrimoine
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {freeTools.map((tool) => (
              <ToolCard key={tool.id} {...tool} />
            ))}
          </div>
        </section>

        {/* Section Outils Premium */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-amber-500" />
              <h2 className="text-xl font-semibold text-foreground">
                Outils Premium
              </h2>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 text-xs font-medium">
              {premiumTools.length} outils
            </span>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Débloquez des analyses avancées pour optimiser votre stratégie patrimoniale
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {premiumTools.map((tool) => (
              <ToolCard key={tool.id} {...tool} />
            ))}
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
