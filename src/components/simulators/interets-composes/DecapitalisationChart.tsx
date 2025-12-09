import { Area, AreaChart, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

interface DecapitalisationChartProps {
  data: { annee: number; capital: number }[];
  mode: "perpetuelle" | "temporaire";
  duree: number;
}

export function DecapitalisationChart({ data, mode, duree }: DecapitalisationChartProps) {
  const formatYAxis = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}K`;
    }
    return value.toString();
  };

  const formatTooltip = (value: number) => {
    return `${value.toLocaleString("fr-FR")} €`;
  };

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-muted-foreground">
        {mode === "perpetuelle" 
          ? "Évolution du capital (stable)" 
          : "Décapitalisation progressive"
        }
      </p>
      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorCapitalRetraite" x1="0" y1="0" x2="0" y2="1">
                <stop 
                  offset="5%" 
                  stopColor={mode === "perpetuelle" ? "hsl(var(--primary))" : "hsl(var(--warning))"} 
                  stopOpacity={0.3}
                />
                <stop 
                  offset="95%" 
                  stopColor={mode === "perpetuelle" ? "hsl(var(--primary))" : "hsl(var(--warning))"} 
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="annee" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              tickFormatter={(v) => `${v}a`}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              tickFormatter={formatYAxis}
              width={50}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontSize: "12px",
              }}
              formatter={(value: number) => [formatTooltip(value), "Capital"]}
              labelFormatter={(label) => `Année ${label}`}
            />
            <Area
              type="monotone"
              dataKey="capital"
              stroke={mode === "perpetuelle" ? "hsl(var(--primary))" : "hsl(var(--warning))"}
              strokeWidth={2}
              fill="url(#colorCapitalRetraite)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
