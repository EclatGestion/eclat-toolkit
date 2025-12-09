import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface SuccessProbabilityProps {
  probability: number;
  capitalFinal: number;
  montantCible: number;
}

export function SuccessProbability({ probability, capitalFinal, montantCible }: SuccessProbabilityProps) {
  const getStatus = () => {
    if (probability >= 100) return { 
      label: "Objectif dépassé", 
      color: "text-success", 
      bgColor: "bg-success/10",
      icon: CheckCircle2,
      message: "Votre stratégie vous permet d'atteindre et de dépasser votre objectif !"
    };
    if (probability >= 80) return { 
      label: "Très probable", 
      color: "text-success", 
      bgColor: "bg-success/10",
      icon: CheckCircle2,
      message: "Excellentes chances d'atteindre votre objectif avec cette stratégie."
    };
    if (probability >= 60) return { 
      label: "Probable", 
      color: "text-warning", 
      bgColor: "bg-warning/10",
      icon: AlertTriangle,
      message: "Bonnes chances, mais considérez d'augmenter votre épargne mensuelle."
    };
    return { 
      label: "Difficile", 
      color: "text-destructive", 
      bgColor: "bg-destructive/10",
      icon: XCircle,
      message: "Objectif ambitieux. Augmentez votre épargne ou allongez l'horizon."
    };
  };

  const status = getStatus();
  const StatusIcon = status.icon;
  const displayProbability = Math.min(probability, 100);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Card className="shadow-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <Target className="w-4 h-4 text-primary" />
          Probabilité de Succès
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Gauge */}
        <div className="relative pt-4">
          <div className="flex justify-between text-xs text-muted-foreground mb-2">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
          <div className="h-4 bg-muted rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-1000",
                probability >= 80 ? "bg-success" :
                probability >= 60 ? "bg-warning" : "bg-destructive"
              )}
              style={{ width: `${displayProbability}%` }}
            />
          </div>
          <div className="mt-4 text-center">
            <span className={cn("text-4xl font-bold", status.color)}>
              {displayProbability}%
            </span>
          </div>
        </div>

        {/* Status Badge */}
        <div className={cn("flex items-center gap-2 p-3 rounded-lg", status.bgColor)}>
          <StatusIcon className={cn("w-5 h-5", status.color)} />
          <div>
            <p className={cn("font-medium", status.color)}>{status.label}</p>
            <p className="text-sm text-muted-foreground">{status.message}</p>
          </div>
        </div>

        {/* Comparison */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Capital projeté</p>
            <p className="text-lg font-semibold text-foreground">
              {formatCurrency(capitalFinal)}
            </p>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Objectif</p>
            <p className="text-lg font-semibold text-foreground">
              {formatCurrency(montantCible)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
