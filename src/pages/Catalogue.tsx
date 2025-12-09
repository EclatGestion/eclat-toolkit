import { MainLayout } from "@/components/layout/MainLayout";
import { ToolCard } from "@/components/catalogue/ToolCard";
import { Calculator, Scale, Home, Key, TrendingUp, Crown, PiggyBank, TrendingDown, Shield, Target, Brain, Sparkles, MessageSquare } from "lucide-react";

const freeTools = [
  {
    id: "capacite-epargne",
    title: "Capacité d'Épargne",
    description: "Calculez votre potentiel d'épargne mensuelle et recevez des conseils.",
    icon: PiggyBank,
    iconColor: "text-teal-500",
    iconBg: "bg-teal-500/10",
    isPremium: false,
  },
  {
    id: "inflation",
    title: "Calculateur d'Inflation",
    description: "Visualisez la perte de pouvoir d'achat face à l'inflation.",
    icon: TrendingDown,
    iconColor: "text-orange-500",
    iconBg: "bg-orange-500/10",
    isPremium: false,
  },
  {
    id: "simulateur-ir",
    title: "Simulateur IR (Basique)",
    description: "Calculez votre TMI et votre impôt net sur le revenu.",
    icon: Calculator,
    iconColor: "text-primary",
    iconBg: "bg-primary/10",
    isPremium: false,
  },
];

const premiumTools = [
  {
    id: "simulateur-ir",
    title: "Simulateur IR (Complet)",
    description: "TMI + Optimisation PER et Girardin Industriel pour réduire vos impôts.",
    icon: Calculator,
    iconColor: "text-primary",
    iconBg: "bg-primary/10",
    isPremium: true,
  },
  {
    id: "simulateur-immobilier",
    title: "Simulateur Immobilier",
    description: "Calculez mensualité et capacité d'emprunt pour votre projet.",
    icon: Home,
    iconColor: "text-emerald-500",
    iconBg: "bg-emerald-500/10",
    isPremium: true,
  },
  {
    id: "interets-composes",
    title: "Intérêts Composés",
    description: "Projetez vos placements avec tous les scénarios de marché.",
    icon: TrendingUp,
    iconColor: "text-rose-500",
    iconBg: "bg-rose-500/10",
    isPremium: true,
  },
  {
    id: "assurance-vie",
    title: "Simulateur Assurance-Vie",
    description: "Projetez l'évolution de votre contrat et l'impact des frais.",
    icon: Shield,
    iconColor: "text-violet-500",
    iconBg: "bg-violet-500/10",
    isPremium: true,
  },
  {
    id: "optimisation-per",
    title: "Optimisation PER",
    description: "Calculez votre réduction d'impôt et projetez la valeur future.",
    icon: Target,
    iconColor: "text-emerald-500",
    iconBg: "bg-emerald-500/10",
    isPremium: true,
  },
];

const expertTools = [
  {
    id: "goal-based-investment",
    title: "Conseiller IA Personnalisé",
    description: "Décrivez votre objectif en langage naturel, l'IA construit votre stratégie.",
    icon: MessageSquare,
    iconColor: "text-indigo-500",
    iconBg: "bg-indigo-500/10",
    isPremium: true,
    isExpert: true,
  },
  {
    id: "bilan-patrimonial",
    title: "Bilan Patrimonial IA",
    description: "Analyse complète de votre patrimoine avec recommandations personnalisées par IA.",
    icon: Brain,
    iconColor: "text-violet-500",
    iconBg: "bg-violet-500/10",
    isPremium: true,
    isExpert: true,
  },
  {
    id: "droits-succession",
    title: "Droits de Succession",
    description: "Estimez les droits à payer et optimisez la transmission de votre patrimoine.",
    icon: Scale,
    iconColor: "text-purple-500",
    iconBg: "bg-purple-500/10",
    isPremium: true,
    isExpert: true,
  },
  {
    id: "comparateur-lmnp",
    title: "Comparateur LMNP vs Location Nue",
    description: "Comparez la fiscalité meublé vs vide avec simulation de plus-value 2025.",
    icon: Key,
    iconColor: "text-amber-500",
    iconBg: "bg-amber-500/10",
    isPremium: true,
    isExpert: true,
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
              🆓 Outils Gratuits
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-medium">
              {freeTools.length} outils
            </span>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Accès libre pour découvrir les fonctionnalités de base
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
              5,99€/mois
            </span>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Simulateurs complets pour optimiser votre stratégie patrimoniale
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {premiumTools.map((tool) => (
              <ToolCard key={`premium-${tool.id}`} {...tool} />
            ))}
          </div>
        </section>

        {/* Section Outils Expert */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-500" />
              <h2 className="text-xl font-semibold text-foreground">
                Outils Expert
              </h2>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 text-xs font-medium">
              14,99€/mois
            </span>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Analyses avancées avec intelligence artificielle et simulations fiscales complexes
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {expertTools.map((tool) => (
              <ToolCard key={`expert-${tool.id}`} {...tool} />
            ))}
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
