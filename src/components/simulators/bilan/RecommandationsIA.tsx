import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, AlertTriangle, Lightbulb, Clock, Loader2 } from "lucide-react";
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
}

export function RecommandationsIA({
  isLoading,
  synthese,
  haute = [],
  moyenne = [],
  longTerme = [],
  planAction = [],
}: RecommandationsIAProps) {
  if (isLoading) {
    return (
      <Card className="border-0 shadow-lg bg-card">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
          <p className="text-lg font-medium text-foreground">Analyse IA en cours...</p>
          <p className="text-sm text-muted-foreground">Génération des recommandations personnalisées</p>
        </CardContent>
      </Card>
    );
  }

  if (!synthese) {
    return (
      <Card className="border-0 shadow-lg bg-card">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Sparkles className="w-12 h-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium text-foreground">Prêt pour l'analyse</p>
          <p className="text-sm text-muted-foreground">Cliquez sur "Générer le bilan" pour obtenir vos recommandations IA</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Synthèse */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/5 to-primary/10">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="w-5 h-5 text-primary" />
            Synthèse IA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">{synthese}</p>
        </CardContent>
      </Card>

      {/* Recommandations prioritaires */}
      {haute.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-0 shadow-lg bg-card border-l-4 border-l-red-500">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                Priorité Haute
                <Badge variant="destructive" className="ml-2">Impact élevé</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {haute.map((reco, index) => (
                <div key={index} className="p-4 rounded-xl bg-muted/50">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-foreground">{reco.titre}</h4>
                    <Badge variant="outline" className="text-emerald-500 border-emerald-500">
                      {reco.impact}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{reco.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Recommandations moyennes */}
      {moyenne.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-0 shadow-lg bg-card border-l-4 border-l-amber-500">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Lightbulb className="w-5 h-5 text-amber-500" />
                Priorité Moyenne
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {moyenne.map((reco, index) => (
                <div key={index} className="p-4 rounded-xl bg-muted/50">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-foreground">{reco.titre}</h4>
                    <Badge variant="outline" className="text-amber-500 border-amber-500">
                      {reco.impact}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{reco.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Optimisations long terme */}
      {longTerme.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-0 shadow-lg bg-card border-l-4 border-l-blue-500">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock className="w-5 h-5 text-blue-500" />
                Long Terme
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {longTerme.map((reco, index) => (
                <div key={index} className="p-4 rounded-xl bg-muted/50">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-foreground">{reco.titre}</h4>
                    <Badge variant="outline" className="text-blue-500 border-blue-500">
                      {reco.impact}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{reco.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Plan d'action 12 mois */}
      {planAction.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-0 shadow-lg bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                📅 Plan d'action 12 mois
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {planAction.map((action, index) => (
                  <div key={index} className="p-3 rounded-xl bg-muted/50 border border-border">
                    <div className="text-xs font-semibold text-primary mb-1">{action.mois}</div>
                    <div className="text-sm text-foreground">{action.action}</div>
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
