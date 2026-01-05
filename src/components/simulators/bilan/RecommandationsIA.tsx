import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Sparkles, 
  AlertTriangle, 
  Lightbulb, 
  Clock, 
  Loader2,
  TrendingUp,
  PiggyBank,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Target,
  X
} from "lucide-react";
import { motion } from "framer-motion";

interface Recommandation {
  titre: string;
  description: string;
  impact: string;
}

interface RecoWithPriority extends Recommandation {
  priority: "haute" | "moyenne" | "longTerme";
  index: number;
}

interface ActionWithIndex {
  mois: string;
  action: string;
  index: number;
  total: number;
}

interface RecommandationsIAProps {
  isLoading: boolean;
  synthese?: string;
  haute?: Recommandation[];
  moyenne?: Recommandation[];
  longTerme?: Recommandation[];
  planAction?: { mois: string; action: string }[];
  scoreGlobal?: number;
  patrimoineTotal?: number;
}

// Fonction pour extraire un impact court et lisible
const formatImpact = (impact: string): string => {
  // Extraire les montants principaux
  const euroMatch = impact.match(/(\d[\d\s]*\d?\s*€|\d+\s*[kK]€|\d+\s*000\s*€)/g);
  const percentMatch = impact.match(/(\d+)\s*%/);
  
  if (euroMatch && euroMatch.length > 0) {
    // Prendre le premier montant significatif
    const amount = euroMatch[0].replace(/\s/g, '');
    if (amount.includes('000')) {
      const num = parseInt(amount.replace(/[^\d]/g, ''));
      if (num >= 1000) {
        return `+${Math.round(num / 1000)}k€/an`;
      }
    }
    return `+${amount}/an`;
  }
  
  if (percentMatch) {
    return `-${percentMatch[1]}% impôts`;
  }
  
  // Fallback: raccourcir le texte
  if (impact.length > 25) {
    return impact.substring(0, 22) + '...';
  }
  
  return impact;
};

export function RecommandationsIA({
  isLoading,
  synthese,
  haute = [],
  moyenne = [],
  longTerme = [],
  planAction = [],
  scoreGlobal = 0,
  patrimoineTotal = 0,
}: RecommandationsIAProps) {
  const [selectedReco, setSelectedReco] = useState<RecoWithPriority | null>(null);
  const [selectedAction, setSelectedAction] = useState<ActionWithIndex | null>(null);

  // Créer une liste plate de toutes les recommandations pour la navigation
  const allRecos: RecoWithPriority[] = [
    ...haute.map((r, i) => ({ ...r, priority: "haute" as const, index: i })),
    ...moyenne.map((r, i) => ({ ...r, priority: "moyenne" as const, index: i })),
    ...longTerme.map((r, i) => ({ ...r, priority: "longTerme" as const, index: i })),
  ];

  const findRecoGlobalIndex = (reco: RecoWithPriority) => {
    return allRecos.findIndex(
      r => r.priority === reco.priority && r.index === reco.index
    );
  };

  const navigateReco = (direction: "prev" | "next") => {
    if (!selectedReco) return;
    const currentIndex = findRecoGlobalIndex(selectedReco);
    const newIndex = direction === "next" ? currentIndex + 1 : currentIndex - 1;
    if (newIndex >= 0 && newIndex < allRecos.length) {
      setSelectedReco(allRecos[newIndex]);
    }
  };

  const navigateAction = (direction: "prev" | "next") => {
    if (!selectedAction) return;
    const newIndex = direction === "next" ? selectedAction.index + 1 : selectedAction.index - 1;
    if (newIndex >= 0 && newIndex < planAction.length) {
      setSelectedAction({
        ...planAction[newIndex],
        index: newIndex,
        total: planAction.length
      });
    }
  };

  if (isLoading) {
    return (
      <Card className="border-0 shadow-lg bg-card">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
            <Loader2 className="w-12 h-12 text-primary animate-spin relative z-10" />
          </div>
          <p className="text-lg font-medium text-foreground mt-6">Analyse IA en cours...</p>
          <p className="text-sm text-muted-foreground">Génération des recommandations personnalisées</p>
        </CardContent>
      </Card>
    );
  }

  if (!synthese) {
    return (
      <Card className="border-0 shadow-lg bg-card">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <p className="text-lg font-medium text-foreground">Prêt pour l'analyse</p>
          <p className="text-sm text-muted-foreground text-center">
            Cliquez sur "Générer le bilan" pour obtenir vos recommandations IA
          </p>
        </CardContent>
      </Card>
    );
  }

  // Calculate potential annual savings
  const calculatePotentiel = () => {
    let total = 0;
    [...haute, ...moyenne, ...longTerme].forEach((reco) => {
      const match = reco.impact.match(/[\d\s]+/g);
      if (match) {
        const num = parseInt(match[0].replace(/\s/g, ""));
        if (!isNaN(num)) total += num;
      }
    });
    return total || 5000;
  };

  const potentielAnnuel = calculatePotentiel();
  const actionsUrgentes = haute.length;

  const getPriorityConfig = (priority: "haute" | "moyenne" | "longTerme") => {
    switch (priority) {
      case "haute":
        return {
          icon: AlertTriangle,
          title: "Priorité Haute",
          subtitle: "À réaliser sous 3 mois",
          gradient: "from-red-500 to-orange-500",
          bg: "bg-red-50 dark:bg-red-500/10",
          border: "border-red-200 dark:border-red-500/20",
          badge: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400",
          dot: "bg-red-500",
          iconColor: "text-red-500",
        };
      case "moyenne":
        return {
          icon: Lightbulb,
          title: "Priorité Moyenne",
          subtitle: "À planifier sous 6 mois",
          gradient: "from-amber-500 to-yellow-500",
          bg: "bg-amber-50 dark:bg-amber-500/10",
          border: "border-amber-200 dark:border-amber-500/20",
          badge: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400",
          dot: "bg-amber-500",
          iconColor: "text-amber-500",
        };
      case "longTerme":
        return {
          icon: Clock,
          title: "Vision Long Terme",
          subtitle: "Stratégie 1-3 ans",
          gradient: "from-blue-500 to-indigo-500",
          bg: "bg-blue-50 dark:bg-blue-500/10",
          border: "border-blue-200 dark:border-blue-500/20",
          badge: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400",
          dot: "bg-blue-500",
          iconColor: "text-blue-500",
        };
    }
  };

  const handleRecoClick = (reco: Recommandation, priority: "haute" | "moyenne" | "longTerme", index: number) => {
    setSelectedReco({ ...reco, priority, index });
  };

  const handleActionClick = (action: { mois: string; action: string }, index: number) => {
    setSelectedAction({ ...action, index, total: planAction.length });
  };

  const RecommendationCard = ({ 
    reco, 
    index, 
    config,
    priority,
    delay 
  }: { 
    reco: Recommandation; 
    index: number; 
    config: ReturnType<typeof getPriorityConfig>;
    priority: "haute" | "moyenne" | "longTerme";
    delay: number;
  }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: delay + index * 0.1 }}
      onClick={() => handleRecoClick(reco, priority, index)}
      className={`relative ${config.bg} ${config.border} border rounded-xl p-4 hover:shadow-md transition-all cursor-pointer group hover:scale-[1.01]`}
    >
      <div className="flex items-start gap-3">
        {/* Numéro */}
        <div className={`flex-shrink-0 w-7 h-7 rounded-full ${config.dot} text-white text-sm font-bold flex items-center justify-center`}>
          {index + 1}
        </div>
        
        {/* Contenu */}
        <div className="flex-1 min-w-0">
          {/* Header avec titre et badge */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
            <h4 className="font-semibold text-foreground text-sm leading-tight">
              {reco.titre}
            </h4>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${config.badge}`}>
              <TrendingUp className="w-3 h-3" />
              {formatImpact(reco.impact)}
            </span>
          </div>
          
          {/* Description concise */}
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
            {reco.description}
          </p>
        </div>
        
        {/* Chevron avec animation */}
        <ChevronRight className="flex-shrink-0 w-5 h-5 text-muted-foreground/50 group-hover:text-primary transition-colors group-hover:translate-x-0.5" />
      </div>
    </motion.div>
  );

  const renderSection = (
    recos: Recommandation[],
    priority: "haute" | "moyenne" | "longTerme",
    delay: number
  ) => {
    if (recos.length === 0) return null;

    const config = getPriorityConfig(priority);
    const Icon = config.icon;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        className="space-y-3"
      >
        {/* Section Header */}
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl bg-gradient-to-br ${config.gradient} text-white`}>
            <Icon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-sm">{config.title}</h3>
            <p className="text-xs text-muted-foreground">{config.subtitle}</p>
          </div>
          <div className={`ml-auto px-2 py-0.5 rounded-full text-xs font-medium ${config.badge}`}>
            {recos.length} action{recos.length > 1 ? 's' : ''}
          </div>
        </div>

        {/* Cards */}
        <div className="space-y-2">
          {recos.map((reco, index) => (
            <RecommendationCard
              key={index}
              reco={reco}
              index={index}
              config={config}
              priority={priority}
              delay={delay}
            />
          ))}
        </div>
      </motion.div>
    );
  };

  // Modal pour les recommandations
  const RecoModal = () => {
    if (!selectedReco) return null;
    const config = getPriorityConfig(selectedReco.priority);
    const Icon = config.icon;
    const globalIndex = findRecoGlobalIndex(selectedReco);
    const canPrev = globalIndex > 0;
    const canNext = globalIndex < allRecos.length - 1;

    return (
      <Dialog open={!!selectedReco} onOpenChange={() => setSelectedReco(null)}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader className="pb-4 border-b border-border/50">
            <div className="flex items-start gap-3">
              <div className={`flex-shrink-0 p-2.5 rounded-xl bg-gradient-to-br ${config.gradient} text-white`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <DialogTitle className="text-lg font-semibold leading-tight pr-8">
                  {selectedReco.titre}
                </DialogTitle>
                <p className="text-sm text-muted-foreground mt-1">{config.title} • {config.subtitle}</p>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-5 py-4">
            {/* Impact */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                Impact estimé
              </div>
              <div className={`p-4 rounded-xl ${config.bg} ${config.border} border`}>
                <p className="text-sm text-foreground leading-relaxed">
                  {selectedReco.impact}
                </p>
              </div>
            </div>

            {/* Description complète */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Target className="w-4 h-4 text-primary" />
                Détails de l'action
              </div>
              <div className="p-4 rounded-xl bg-muted/50 border border-border/50">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {selectedReco.description}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-4 border-t border-border/50">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateReco("prev")}
              disabled={!canPrev}
              className="gap-1.5"
            >
              <ChevronLeft className="w-4 h-4" />
              Précédent
            </Button>
            <span className="text-xs text-muted-foreground">
              {globalIndex + 1} / {allRecos.length}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateReco("next")}
              disabled={!canNext}
              className="gap-1.5"
            >
              Suivant
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  // Modal pour les actions de la feuille de route
  const ActionModal = () => {
    if (!selectedAction) return null;
    const canPrev = selectedAction.index > 0;
    const canNext = selectedAction.index < selectedAction.total - 1;

    return (
      <Dialog open={!!selectedAction} onOpenChange={() => setSelectedAction(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="pb-4 border-b border-border/50">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center text-white font-bold shadow-lg">
                {selectedAction.index + 1}
              </div>
              <div className="flex-1">
                <DialogTitle className="text-lg font-semibold">
                  {selectedAction.mois}
                </DialogTitle>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Étape {selectedAction.index + 1} sur {selectedAction.total}
                </p>
              </div>
            </div>
          </DialogHeader>

          <div className="py-5">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Target className="w-4 h-4 text-primary" />
                Action à réaliser
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-br from-muted/50 to-muted/30 border border-border/50">
                <p className="text-sm text-foreground leading-relaxed">
                  {selectedAction.action}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-4 border-t border-border/50">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateAction("prev")}
              disabled={!canPrev}
              className="gap-1.5"
            >
              <ChevronLeft className="w-4 h-4" />
              Précédent
            </Button>
            <span className="text-xs text-muted-foreground">
              {selectedAction.index + 1} / {selectedAction.total}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateAction("next")}
              disabled={!canNext}
              className="gap-1.5"
            >
              Suivant
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="space-y-6">
      {/* Modales */}
      <RecoModal />
      <ActionModal />

      {/* Synthèse avec KPIs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="border-0 shadow-lg overflow-hidden">
          <div className="bg-gradient-to-br from-primary/5 via-violet-500/5 to-primary/5">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-violet-500 text-white">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-base font-semibold">Synthèse de votre situation</span>
                  <p className="text-xs font-normal text-muted-foreground mt-0.5">
                    Analyse générée par intelligence artificielle
                  </p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* KPI Cards - Plus compacts */}
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-background rounded-xl p-3 text-center border border-border/50 shadow-sm">
                  <div className={`text-2xl font-bold ${actionsUrgentes > 0 ? "text-red-500" : "text-emerald-500"}`}>
                    {actionsUrgentes}
                  </div>
                  <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium mt-1">
                    Actions urgentes
                  </div>
                </div>
                <div className="bg-background rounded-xl p-3 text-center border border-border/50 shadow-sm">
                  <div className="text-2xl font-bold text-primary">
                    {patrimoineTotal >= 1000000
                      ? `${(patrimoineTotal / 1000000).toFixed(1)}M€`
                      : `${Math.round(patrimoineTotal / 1000)}k€`}
                  </div>
                  <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium mt-1">
                    Patrimoine
                  </div>
                </div>
                <div className="bg-background rounded-xl p-3 text-center border border-border/50 shadow-sm">
                  <div className="text-2xl font-bold text-emerald-500">
                    +{potentielAnnuel >= 1000 ? `${Math.round(potentielAnnuel / 1000)}k€` : `${potentielAnnuel}€`}
                  </div>
                  <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium mt-1">
                    Potentiel/an
                  </div>
                </div>
              </div>

              {/* Synthèse Text - Plus lisible */}
              <div className="bg-background/80 rounded-xl p-4 border border-border/50">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {synthese}
                </p>
              </div>
            </CardContent>
          </div>
        </Card>
      </motion.div>

      {/* Recommandations - Nouveau design épuré */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-semibold">Plan d'optimisation patrimoniale</span>
              <p className="text-xs font-normal text-muted-foreground mt-0.5">
                {haute.length + moyenne.length + longTerme.length} recommandations personnalisées • Cliquez pour voir les détails
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {renderSection(haute, "haute", 0.1)}
          {renderSection(moyenne, "moyenne", 0.2)}
          {renderSection(longTerme, "longTerme", 0.3)}
        </CardContent>
      </Card>

      {/* Plan d'action 12 mois */}
      {planAction.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 text-white">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-base font-semibold">Feuille de route 12 mois</span>
                  <p className="text-xs font-normal text-muted-foreground mt-0.5">
                    Cliquez sur une étape pour voir les détails
                  </p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Timeline compacte et lisible */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {planAction.map((action, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                    onClick={() => handleActionClick(action, index)}
                    className="relative bg-gradient-to-br from-muted/50 to-muted/30 rounded-xl p-3 border border-border/50 hover:shadow-md transition-all cursor-pointer group hover:scale-[1.02] hover:border-primary/30"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center text-white text-xs font-bold shadow-sm group-hover:scale-110 transition-transform">
                        {index + 1}
                      </div>
                      <span className="text-xs font-semibold text-primary">
                        {action.mois}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                      {action.action}
                    </p>
                    <ChevronRight className="absolute bottom-3 right-3 w-4 h-4 text-muted-foreground/30 group-hover:text-primary/70 transition-colors" />
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}