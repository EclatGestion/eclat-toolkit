import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

interface ProjectionChartProps {
  projection: Array<{
    annee: number;
    capital: number;
    versements: number;
  }>;
  montantCible: number;
}

export function ProjectionChart({ projection, montantCible }: ProjectionChartProps) {
  const data = projection.map((item) => ({
    ...item,
    objectif: montantCible,
  }));

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M€`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}k€`;
    }
    return `${value}€`;
  };

  return (
    <Card className="shadow-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" />
          Projection du Capital
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCapital" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(227, 100%, 59%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(227, 100%, 59%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorVersements" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(172, 66%, 50%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(172, 66%, 50%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="annee" 
                tickFormatter={(value) => `An ${value}`}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              />
              <YAxis
                tickFormatter={formatCurrency}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                width={60}
              />
              <Tooltip
                formatter={(value: number, name: string) => [
                  formatCurrency(value),
                  name === "capital" ? "Capital projeté" : 
                  name === "versements" ? "Versements cumulés" : "Objectif"
                ]}
                labelFormatter={(label) => `Année ${label}`}
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Legend 
                formatter={(value) => (
                  <span className="text-sm text-foreground">
                    {value === "capital" ? "Capital projeté" : 
                     value === "versements" ? "Versements cumulés" : "Objectif"}
                  </span>
                )}
              />
              <Area
                type="monotone"
                dataKey="versements"
                stroke="hsl(172, 66%, 50%)"
                fill="url(#colorVersements)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="capital"
                stroke="hsl(227, 100%, 59%)"
                fill="url(#colorCapital)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="objectif"
                stroke="hsl(var(--destructive))"
                fill="none"
                strokeWidth={2}
                strokeDasharray="5 5"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
