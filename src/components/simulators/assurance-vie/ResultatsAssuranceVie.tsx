import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Wallet, PiggyBank, Percent } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

interface ResultatsAssuranceVieProps {
  valeurFinale: number;
  totalInvesti: number;
  gainNet: number;
  rendementMoyen: number;
  evolutionData: Array<{ annee: number; capital: number; totalVerse: number }>;
}

export function ResultatsAssuranceVie({
  valeurFinale,
  totalInvesti,
  gainNet,
  rendementMoyen,
  evolutionData,
}: ResultatsAssuranceVieProps) {
  const pourcentageGain = totalInvesti > 0 ? (gainNet / totalInvesti) * 100 : 0;

  const pieData = [
    { name: "Versements", value: totalInvesti, color: "hsl(var(--muted-foreground))" },
    { name: "Intérêts générés", value: Math.max(0, gainNet), color: "hsl(var(--primary))" },
  ];

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <div className="space-y-6">
      {/* KPIs principaux */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="rounded-2xl bg-gradient-to-br from-violet-500/10 to-violet-500/5 border-violet-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="h-4 w-4 text-violet-500" />
              <span className="text-xs text-muted-foreground">Valeur finale</span>
            </div>
            <p className="text-2xl font-bold text-violet-600">
              {formatCurrency(valeurFinale)}
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <PiggyBank className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Total versé</span>
            </div>
            <p className="text-2xl font-bold">{formatCurrency(totalInvesti)}</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border-emerald-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              <span className="text-xs text-muted-foreground">Gain net</span>
            </div>
            <p className="text-2xl font-bold text-emerald-600">
              {formatCurrency(gainNet)}
            </p>
            <Badge variant="secondary" className="mt-1 text-xs bg-emerald-500/10 text-emerald-600">
              +{pourcentageGain.toFixed(1)}%
            </Badge>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Percent className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Rend. annuel</span>
            </div>
            <p className="text-2xl font-bold">{rendementMoyen.toFixed(2)}%</p>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Courbe d'évolution */}
        <Card className="rounded-3xl shadow-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Évolution du contrat</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={evolutionData}>
                  <defs>
                    <linearGradient id="colorCapital" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="annee"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(v) => `${v} an${v > 1 ? "s" : ""}`}
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    tickFormatter={(v) =>
                      new Intl.NumberFormat("fr-FR", {
                        notation: "compact",
                        compactDisplay: "short",
                      }).format(v)
                    }
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
                    dataKey="totalVerse"
                    stroke="hsl(var(--muted-foreground))"
                    strokeDasharray="5 5"
                    fill="none"
                    strokeWidth={2}
                    name="Total versé"
                  />
                  <Area
                    type="monotone"
                    dataKey="capital"
                    stroke="hsl(var(--primary))"
                    fill="url(#colorCapital)"
                    strokeWidth={3}
                    name="Valeur du contrat"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Camembert répartition */}
        <Card className="rounded-3xl shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Répartition finale</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend
                    formatter={(value) => (
                      <span className="text-sm text-foreground">{value}</span>
                    )}
                  />
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "12px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
