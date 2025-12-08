import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Euro, ArrowDownRight, TrendingUp, Sparkles } from "lucide-react";
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface ResultatsPERProps {
  reductionIR: number;
  effortReel: number;
  valeurFuture: number;
  gainTotal: number;
  evolutionData: Array<{ annee: number; capital: number }>;
}

export function ResultatsPER({
  reductionIR,
  effortReel,
  valeurFuture,
  gainTotal,
  evolutionData,
}: ResultatsPERProps) {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(value);

  const barData = [
    { name: "Effort Réel", value: effortReel, color: "hsl(var(--muted-foreground))" },
    { name: "Valeur Future", value: valeurFuture, color: "hsl(var(--primary))" },
  ];

  return (
    <div className="space-y-6">
      {/* KPIs principaux */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border-0 rounded-2xl">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Euro className="h-4 w-4 text-emerald-500" />
              <span className="text-xs font-medium text-muted-foreground">Réduction d'impôt</span>
            </div>
            <p className="text-2xl lg:text-3xl font-bold text-emerald-600 dark:text-emerald-400">
              {formatCurrency(reductionIR)}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-0 shadow-card rounded-2xl">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <ArrowDownRight className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground">Effort net réel</span>
            </div>
            <p className="text-2xl lg:text-3xl font-bold text-foreground">
              {formatCurrency(effortReel)}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-0 rounded-2xl">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="text-xs font-medium text-muted-foreground">Valeur future du PER</span>
            </div>
            <p className="text-2xl lg:text-3xl font-bold text-primary">
              {formatCurrency(valeurFuture)}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-500/10 to-amber-500/5 border-0 rounded-2xl">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-amber-500" />
              <span className="text-xs font-medium text-muted-foreground">Gain total</span>
            </div>
            <p className="text-2xl lg:text-3xl font-bold text-amber-600 dark:text-amber-400">
              {formatCurrency(gainTotal)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart - Effort vs Valeur */}
        <Card className="bg-card border-0 shadow-card rounded-3xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-foreground">
              Effort réel vs Valeur future
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} layout="vertical" margin={{ left: 20, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="hsl(var(--border))" />
                  <XAxis type="number" tickFormatter={(v) => `${(v / 1000).toFixed(0)}k€`} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} width={100} />
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "12px",
                    }}
                  />
                  <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={32}>
                    {barData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Area Chart - Évolution */}
        <Card className="bg-card border-0 shadow-card rounded-3xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-foreground">
              Évolution du capital
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={evolutionData} margin={{ left: 0, right: 10 }}>
                  <defs>
                    <linearGradient id="colorCapital" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="annee"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickFormatter={(v) => `${v} ans`}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                    labelFormatter={(label) => `Année ${label}`}
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "12px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="capital"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorCapital)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
