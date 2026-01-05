import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  AlertTriangle, 
  Lightbulb, 
  Clock, 
  Loader2,
  TrendingUp,
  PiggyBank,
  ArrowRight,
  CheckCircle2
} from "lucide-react";
import { motion } from "framer-motion";

interface Recommandation {
  titre: string;
  description: string;
  impact: string;
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
          <p className="text-sm text-muted-foreground">Cliquez sur "Générer le bilan" pour obtenir vos recommandations IA</p>
        </CardContent>
      </Card>
    );
  }

  // Parse potential annual savings from recommendations
  const calculatePotentiel = () => {
    let total = 0;
    [...haute, ...moyenne, ...longTerme].forEach((reco) => {
      const match = reco.impact.match(/[\d\s]+/g);
      if (match) {
        const num = parseInt(match[0].replace(/\s/g, ""));
        if (!isNaN(num)) total += num;
      }
    });
    return total || 5000; // Default fallback
  };

  const potentielAnnuel = calculatePotentiel();
  const actionsUrgentes = haute.length;

  const getPriorityIcon = (priority: "haute" | "moyenne" | "longTerme") => {
    switch (priority) {
      case "haute":
        return <AlertTriangle className="w-5 h-5" />;
      case "moyenne":
        return <Lightbulb className="w-5 h-5" />;
      case "longTerme":
        return <Clock className="w-5 h-5" />;
    }
  };

  const getPriorityColors = (priority: "haute" | "moyenne" | "longTerme") => {
    switch (priority) {
      case "haute":
        return {
          bg: "bg-red-500/10",
          border: "border-red-500/30",
          text: "text-red-500",
          icon: "text-red-500",
          line: "bg-gradient-to-b from-red-500 to-red-300",
        };
      case "moyenne":
        return {
          bg: "bg-amber-500/10",
          border: "border-amber-500/30",
          text: "text-amber-500",
          icon: "text-amber-500",
          line: "bg-gradient-to-b from-amber-500 to-amber-300",
        };
      case "longTerme":
        return {
          bg: "bg-blue-500/10",
          border: "border-blue-500/30",
          text: "text-blue-500",
          icon: "text-blue-500",
          line: "bg-gradient-to-b from-blue-500 to-blue-300",
        };
    }
  };

  const renderRecommandations = (
    recos: Recommandation[],
    priority: "haute" | "moyenne" | "longTerme",
    title: string,
    delay: number
  ) => {
    if (recos.length === 0) return null;

    const colors = getPriorityColors(priority);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        className="relative"
      >
        {/* Section Header */}
        <div className={`flex items-center gap-3 mb-4`}>
          <div className={`p-2 rounded-xl ${colors.bg}`}>
            <span className={colors.icon}>{getPriorityIcon(priority)}</span>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{title}</h3>
            <p className="text-xs text-muted-foreground">
              {priority === "haute" && "Actions à réaliser dans les 3 prochains mois"}
              {priority === "moyenne" && "À planifier sur les 6 prochains mois"}
              {priority === "longTerme" && "Vision stratégique sur 1-3 ans"}
            </p>
          </div>
        </div>

        {/* Timeline */}
        <div className="relative pl-8">
          {/* Vertical line */}
          <div className={`absolute left-3 top-0 bottom-0 w-0.5 ${colors.line} rounded-full`} />

          <div className="space-y-4">
            {recos.map((reco, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: delay + index * 0.1 }}
                className={`relative p-4 rounded-xl border ${colors.border} ${colors.bg} backdrop-blur-sm`}
              >
                {/* Timeline dot */}
                <div
                  className={`absolute -left-5 top-5 w-3 h-3 rounded-full border-2 border-background ${colors.text.replace("text-", "bg-")}`}
                />

                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                  <h4 className="font-semibold text-foreground flex items-center gap-2">
                    <ArrowRight className={`w-4 h-4 ${colors.text}`} />
                    {reco.titre}
                  </h4>
                  <Badge
                    variant="outline"
                    className={`${colors.text} ${colors.border} whitespace-nowrap self-start`}
                  >
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {reco.impact}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed pl-6">
                  {reco.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Synthèse with KPI Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="border-0 shadow-lg overflow-hidden">
          <div className="bg-gradient-to-br from-primary/10 via-violet-500/5 to-primary/10">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-primary/20">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <span className="text-lg">Synthèse de votre situation</span>
                  <p className="text-xs font-normal text-muted-foreground mt-0.5">
                    Analyse générée par intelligence artificielle
                  </p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* KPI Cards */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-background/80 backdrop-blur-sm rounded-xl p-4 text-center border border-border/50">
                  <AlertTriangle className={`w-5 h-5 mx-auto mb-2 ${actionsUrgentes > 0 ? "text-red-500" : "text-emerald-500"}`} />
                  <div className="text-xs text-muted-foreground mb-1">Actions Urgentes</div>
                  <div className={`text-2xl font-bold ${actionsUrgentes > 0 ? "text-red-500" : "text-emerald-500"}`}>
                    {actionsUrgentes}
                  </div>
                </div>
                <div className="bg-background/80 backdrop-blur-sm rounded-xl p-4 text-center border border-border/50">
                  <PiggyBank className="w-5 h-5 mx-auto mb-2 text-primary" />
                  <div className="text-xs text-muted-foreground mb-1">Patrimoine</div>
                  <div className="text-2xl font-bold text-primary">
                    {patrimoineTotal >= 1000000
                      ? `${(patrimoineTotal / 1000000).toFixed(1)}M€`
                      : `${Math.round(patrimoineTotal / 1000)}k€`}
                  </div>
                </div>
                <div className="bg-background/80 backdrop-blur-sm rounded-xl p-4 text-center border border-border/50">
                  <TrendingUp className="w-5 h-5 mx-auto mb-2 text-emerald-500" />
                  <div className="text-xs text-muted-foreground mb-1">Potentiel/an</div>
                  <div className="text-2xl font-bold text-emerald-500">
                    +{potentielAnnuel >= 1000 ? `${Math.round(potentielAnnuel / 1000)}k€` : `${potentielAnnuel}€`}
                  </div>
                </div>
              </div>

              {/* Synthèse Text */}
              <div className="bg-background/60 rounded-xl p-4 border border-border/50">
                <p className="text-muted-foreground leading-relaxed">{synthese}</p>
              </div>
            </CardContent>
          </div>
        </Card>
      </motion.div>

      {/* Recommandations Timeline */}
      <div className="space-y-8">
        {renderRecommandations(haute, "haute", "Priorité Haute", 0.1)}
        {renderRecommandations(moyenne, "moyenne", "Priorité Moyenne", 0.2)}
        {renderRecommandations(longTerme, "longTerme", "Vision Long Terme", 0.3)}
      </div>

      {/* Plan d'action 12 mois - Horizontal Timeline */}
      {planAction.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-0 shadow-lg overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-violet-500/10">
                  <CheckCircle2 className="w-5 h-5 text-violet-500" />
                </div>
                <div>
                  <span className="text-lg">Plan d'action 12 mois</span>
                  <p className="text-xs font-normal text-muted-foreground mt-0.5">
                    Feuille de route personnalisée
                  </p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Horizontal Timeline */}
              <div className="relative overflow-x-auto pb-4">
                <div className="flex gap-4 min-w-max">
                  {planAction.map((action, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.05 }}
                      className="relative flex flex-col items-center"
                    >
                      {/* Connector line */}
                      {index < planAction.length - 1 && (
                        <div className="absolute top-4 left-1/2 w-full h-0.5 bg-gradient-to-r from-primary/50 to-violet-500/50" />
                      )}

                      {/* Timeline node */}
                      <div className="relative z-10 w-8 h-8 rounded-full bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center text-white text-xs font-bold shadow-lg">
                        {index + 1}
                      </div>

                      {/* Content card */}
                      <div className="mt-3 p-3 rounded-xl bg-muted/50 border border-border/50 w-36 text-center">
                        <div className="text-xs font-semibold text-primary mb-1">
                          {action.mois}
                        </div>
                        <div className="text-xs text-muted-foreground leading-tight">
                          {action.action}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Mobile friendly alternative grid */}
              <div className="grid grid-cols-2 sm:hidden gap-2 mt-4">
                {planAction.map((action, index) => (
                  <div
                    key={index}
                    className="p-3 rounded-xl bg-muted/50 border border-border/50"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center text-white text-[10px] font-bold">
                        {index + 1}
                      </div>
                      <span className="text-xs font-semibold text-primary">
                        {action.mois}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">{action.action}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
