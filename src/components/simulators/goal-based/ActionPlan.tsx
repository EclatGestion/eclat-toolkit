import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList, CheckCircle2, Circle, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface ActionItem {
  mois: number;
  action: string;
  priorite: 'haute' | 'moyenne' | 'basse';
  categorie: string;
}

interface ActionPlanProps {
  actions: ActionItem[];
}

const PRIORITE_COLORS = {
  haute: "bg-destructive/10 text-destructive border-destructive/20",
  moyenne: "bg-warning/10 text-warning border-warning/20",
  basse: "bg-muted text-muted-foreground border-border",
};

const CATEGORIE_COLORS: Record<string, string> = {
  "Enveloppes": "bg-primary/10 text-primary",
  "Investissement": "bg-success/10 text-success",
  "Épargne": "bg-emerald-500/10 text-emerald-600",
  "Allocation": "bg-violet-500/10 text-violet-600",
  "Suivi": "bg-amber-500/10 text-amber-600",
  "Fiscalité": "bg-rose-500/10 text-rose-600",
  "Sécurisation": "bg-cyan-500/10 text-cyan-600",
  "Revenus": "bg-indigo-500/10 text-indigo-600",
};

export function ActionPlan({ actions }: ActionPlanProps) {
  // Grouper par trimestre
  const trimestres = [
    { label: "T1 (Mois 1-3)", actions: actions.filter(a => a.mois <= 3) },
    { label: "T2 (Mois 4-6)", actions: actions.filter(a => a.mois > 3 && a.mois <= 6) },
    { label: "T3 (Mois 7-9)", actions: actions.filter(a => a.mois > 6 && a.mois <= 9) },
    { label: "T4 (Mois 10-12)", actions: actions.filter(a => a.mois > 9 && a.mois <= 12) },
  ].filter(t => t.actions.length > 0);

  return (
    <Card className="shadow-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <ClipboardList className="w-4 h-4 text-primary" />
          Plan d'Action sur 12 Mois
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {trimestres.map((trimestre, tIndex) => (
            <div key={tIndex}>
              <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary" />
                {trimestre.label}
              </h4>
              <div className="space-y-2 ml-4 border-l-2 border-border pl-4">
                {trimestre.actions.map((action, aIndex) => (
                  <div
                    key={aIndex}
                    className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <Circle className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground">{action.action}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge 
                          variant="outline" 
                          className={cn("text-xs", PRIORITE_COLORS[action.priorite])}
                        >
                          {action.priorite === 'haute' ? 'Priorité haute' : 
                           action.priorite === 'moyenne' ? 'Priorité moyenne' : 'Optionnel'}
                        </Badge>
                        <Badge 
                          variant="secondary"
                          className={cn("text-xs", CATEGORIE_COLORS[action.categorie] || "bg-muted")}
                        >
                          {action.categorie}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/10">
          <div className="flex items-center gap-2 text-sm">
            <ArrowRight className="w-4 h-4 text-primary" />
            <p className="text-muted-foreground">
              <span className="font-medium text-foreground">Conseil :</span> Cochez les actions au fur et à mesure de votre progression pour suivre votre avancement.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
