import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Wallet, PiggyBank, Percent } from "lucide-react";

interface ResultsKPIProps {
  capitalFinal: number;
  versementMensuelRecommande: number;
  rendementPondere: number;
  horizon: number;
}

export function ResultsKPI({ 
  capitalFinal, 
  versementMensuelRecommande, 
  rendementPondere,
  horizon 
}: ResultsKPIProps) {
  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(2)}M€`;
    }
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const kpis = [
    {
      label: "Capital Final Projeté",
      value: formatCurrency(capitalFinal),
      icon: TrendingUp,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "Épargne Recommandée",
      value: `${versementMensuelRecommande.toLocaleString('fr-FR')}€/mois`,
      icon: PiggyBank,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      label: "Rendement Moyen",
      value: `${rendementPondere}%/an`,
      icon: Percent,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
    {
      label: "Horizon",
      value: `${horizon} ans`,
      icon: Wallet,
      color: "text-violet-500",
      bgColor: "bg-violet-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi, index) => {
        const Icon = kpi.icon;
        return (
          <Card key={index} className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${kpi.bgColor}`}>
                  <Icon className={`w-5 h-5 ${kpi.color}`} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{kpi.label}</p>
                  <p className={`text-lg font-bold ${kpi.color}`}>{kpi.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
