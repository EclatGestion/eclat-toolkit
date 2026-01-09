import { MainLayout } from "@/components/layout/MainLayout";
import { useNavigate, useSearchParams } from "react-router-dom";
import { 
  Calculator, 
  Scale, 
  Home, 
  Key, 
  TrendingUp, 
  Crown, 
  PiggyBank, 
  TrendingDown, 
  Shield, 
  Target, 
  Brain, 
  Sparkles, 
  MessageSquare, 
  LineChart,
  ArrowRight,
  Rocket
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { usePremium } from "@/hooks/usePremium";
import { UpgradeSuccessModal } from "@/components/premium/UpgradeSuccessModal";
import { useState, useEffect } from "react";

const popularTools = [
  {
    id: "simulateur-ir",
    title: "Impôt Revenu",
    description: "Calculez votre IR et TMI",
    icon: Calculator,
    iconColor: "text-primary",
    iconBg: "bg-primary/10",
    path: "/tools/simulateur-ir",
  },
  {
    id: "simulateur-immobilier",
    title: "Crédit Immo",
    description: "Mensualité et capacité",
    icon: Home,
    iconColor: "text-success",
    iconBg: "bg-success/10",
    path: "/tools/simulateur-immobilier",
  },
  {
    id: "interets-composes",
    title: "Intérêts Composés",
    description: "Projetez vos placements",
    icon: TrendingUp,
    iconColor: "text-accent",
    iconBg: "bg-accent/10",
    path: "/tools/interets-composes",
  },
];

const freeTools = [
  {
    id: "capacite-epargne",
    title: "Épargne Mensuelle",
    description: "Calculez votre potentiel d'épargne.",
    icon: PiggyBank,
    iconColor: "text-chart-3",
    iconBg: "bg-chart-3/10",
    path: "/tools/capacite-epargne",
  },
  {
    id: "inflation",
    title: "Inflation",
    description: "Impact sur votre pouvoir d'achat.",
    icon: TrendingDown,
    iconColor: "text-accent",
    iconBg: "bg-accent/10",
    path: "/tools/inflation",
  },
  {
    id: "simulateur-ir-basique",
    title: "IR Simplifié",
    description: "Calcul rapide de votre TMI.",
    icon: Calculator,
    iconColor: "text-primary",
    iconBg: "bg-primary/10",
    path: "/tools/simulateur-ir",
  },
];

const premiumTools = [
  {
    id: "simulateur-ir-complet",
    title: "Impôt Revenu+",
    description: "TMI + optimisation PER et Girardin.",
    icon: Calculator,
    iconColor: "text-primary",
    iconBg: "bg-primary/10",
    path: "/tools/simulateur-ir",
  },
  {
    id: "simulateur-immobilier",
    title: "Crédit Immobilier",
    description: "Mensualité et capacité d'emprunt.",
    icon: Home,
    iconColor: "text-success",
    iconBg: "bg-success/10",
    path: "/tools/simulateur-immobilier",
  },
  {
    id: "interets-composes",
    title: "Intérêts Composés",
    description: "Projections multi-scénarios.",
    icon: TrendingUp,
    iconColor: "text-accent",
    iconBg: "bg-accent/10",
    path: "/tools/interets-composes",
  },
  {
    id: "assurance-vie",
    title: "Assurance-Vie",
    description: "Projection et impact des frais.",
    icon: Shield,
    iconColor: "text-chart-3",
    iconBg: "bg-chart-3/10",
    path: "/tools/assurance-vie",
  },
  {
    id: "optimisation-per",
    title: "Plan Épargne Retraite",
    description: "Réduction d'impôt et projection.",
    icon: Target,
    iconColor: "text-success",
    iconBg: "bg-success/10",
    path: "/tools/optimisation-per",
  },
];

const expertTools = [
  {
    id: "analyse-action",
    title: "Analyse Actions",
    description: "Scoring IA et recommandation.",
    icon: LineChart,
    iconColor: "text-chart-3",
    iconBg: "bg-chart-3/10",
    path: "/tools/analyse-action",
  },
  {
    id: "goal-based-investment",
    title: "Conseiller IA",
    description: "Stratégie sur mesure par IA.",
    icon: MessageSquare,
    iconColor: "text-chart-3",
    iconBg: "bg-chart-3/10",
    path: "/tools/goal-based-investment",
  },
  {
    id: "droits-succession",
    title: "Succession",
    description: "Droits et optimisation transmission.",
    icon: Scale,
    iconColor: "text-primary",
    iconBg: "bg-primary/10",
    path: "/tools/droits-succession",
  },
  {
    id: "comparateur-lmnp",
    title: "LMNP vs Nu",
    description: "Comparatif fiscalité locative.",
    icon: Key,
    iconColor: "text-warning",
    iconBg: "bg-warning/10",
    path: "/tools/comparateur-lmnp",
  },
];

// Bilan Patrimonial is now FREE (separate section)
const freePremiumTools = [
  {
    id: "bilan-patrimonial",
    title: "Bilan Patrimonial",
    description: "Analyse complète de votre patrimoine avec scores par pilier et recommandations.",
    icon: Brain,
    iconColor: "text-chart-3",
    iconBg: "bg-chart-3/10",
    path: "/tools/bilan-patrimonial",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

interface ToolCardProps {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  iconBg: string;
  path: string;
  badge?: string;
  badgeColor?: string;
}

function ToolCard({ title, description, icon: Icon, iconColor, iconBg, path, badge, badgeColor }: ToolCardProps) {
  const navigate = useNavigate();
  
  return (
    <button
      onClick={() => navigate(path)}
      className="flex items-start gap-4 p-4 bg-card rounded-2xl shadow-card hover:shadow-lg transition-all duration-200 group text-left w-full border border-transparent hover:border-primary/20"
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBg} group-hover:scale-110 transition-transform shrink-0`}>
        <Icon className={`w-6 h-6 ${iconColor}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <p className="font-medium text-foreground">{title}</p>
          {badge && (
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${badgeColor}`}>
              {badge}
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
      </div>
      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-1" />
    </button>
  );
}

export default function Toolbox() {
  const navigate = useNavigate();
  const { refreshSubscription } = usePremium();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  // Check for upgrade success from Stripe
  useEffect(() => {
    if (searchParams.get("upgrade") === "success") {
      setIsSuccessModalOpen(true);
      refreshSubscription();
      setSearchParams({});
    }
  }, [searchParams, setSearchParams, refreshSubscription]);

  return (
    <MainLayout title="Boîte à Outils">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* Hero Section */}
        <motion.div 
          variants={itemVariants}
          className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-3xl p-6 md:p-8 border border-primary/10"
        >
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center shrink-0">
              <Rocket className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">
                Bienvenue dans votre boîte à outils patrimoniale
              </h2>
              <p className="text-muted-foreground">
                Simulez, optimisez et planifiez votre stratégie financière avec nos outils spécialisés.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Popular Tools */}
        <motion.section variants={itemVariants}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              🔥 Outils Populaires
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {popularTools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => navigate(tool.path)}
                className="flex items-center gap-4 p-5 bg-card rounded-2xl shadow-card hover:shadow-lg transition-all duration-200 group text-left border-2 border-transparent hover:border-primary/30"
              >
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${tool.iconBg} group-hover:scale-110 transition-transform`}>
                  <tool.icon className={`w-7 h-7 ${tool.iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground">{tool.title}</p>
                  <p className="text-sm text-muted-foreground">{tool.description}</p>
                </div>
              </button>
            ))}
          </div>
        </motion.section>

        {/* Bilan Patrimonial - Featured Free Tool */}
        <motion.section variants={itemVariants}>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-chart-3" />
              <h3 className="text-lg font-semibold text-foreground">
                Outil Phare
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-chart-3/10 text-chart-3 text-xs font-medium">
              Gratuit
            </span>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Commencez par analyser votre situation patrimoniale complète
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {freePremiumTools.map((tool) => (
              <ToolCard key={tool.id} {...tool} />
            ))}
          </div>
        </motion.section>

        {/* Free Tools */}
        <motion.section variants={itemVariants}>
          <div className="flex items-center gap-3 mb-4">
            <h3 className="text-lg font-semibold text-foreground">
              🆓 Outils Gratuits
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-success/10 text-success text-xs font-medium">
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
        </motion.section>

        {/* Premium Tools */}
        <motion.section variants={itemVariants}>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-amber-500" />
              <h3 className="text-lg font-semibold text-foreground">
                Outils Premium
              </h3>
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
              <ToolCard 
                key={tool.id} 
                {...tool} 
                badge="Premium"
                badgeColor="bg-amber-500/10 text-amber-600"
              />
            ))}
          </div>
        </motion.section>

        {/* Expert Tools */}
        <motion.section variants={itemVariants}>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-chart-3" />
              <h3 className="text-lg font-semibold text-foreground">
                Outils Expert
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-chart-3/10 text-chart-3 text-xs font-medium">
              14,99€/mois
            </span>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Analyses avancées avec intelligence artificielle et simulations fiscales complexes
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {expertTools.map((tool) => (
              <ToolCard 
                key={tool.id} 
                {...tool}
                badge="Expert"
                badgeColor="bg-chart-3/10 text-chart-3"
              />
            ))}
          </div>
        </motion.section>

        {/* CTA Académie */}
        <motion.div variants={itemVariants}>
          <div className="bg-card rounded-3xl p-6 shadow-card border border-border">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-chart-3/10 flex items-center justify-center">
                  <Brain className="w-6 h-6 text-chart-3" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Besoin d'approfondir vos connaissances ?</h4>
                  <p className="text-sm text-muted-foreground">Découvrez nos guides et articles dans l'Académie</p>
                </div>
              </div>
              <Button 
                onClick={() => navigate("/academie-pro")}
                variant="outline"
                className="gap-2 shrink-0"
              >
                Accéder à l'Académie
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <UpgradeSuccessModal open={isSuccessModalOpen} onOpenChange={setIsSuccessModalOpen} />
    </MainLayout>
  );
}
