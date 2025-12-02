import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface ChartDataPoint {
  year: number;
  totalVerse: number;
  votreScenario: number;
  scenarioSecurise: number;
}

interface ComparisonChartProps {
  data: ChartDataPoint[];
  showComparison: boolean;
}

const formatCurrency = (value: number) => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M €`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(0)}k €`;
  }
  return `${value} €`;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-2xl p-4 shadow-lg">
        <p className="font-semibold text-foreground mb-2">Année {label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value.toLocaleString("fr-FR")} €
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function ComparisonChart({ data, showComparison }: ComparisonChartProps) {
  return (
    <div className="h-[300px] md:h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorVotre" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorVerse" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0.2} />
              <stop offset="95%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            dataKey="year"
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}an${value > 1 ? "s" : ""}`}
          />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={formatCurrency}
            width={70}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ paddingTop: "20px" }}
            formatter={(value) => <span className="text-sm text-foreground">{value}</span>}
          />
          
          {/* Total Versé - Toujours visible */}
          <Area
            type="monotone"
            dataKey="totalVerse"
            name="Total Versé"
            stroke="hsl(var(--muted-foreground))"
            strokeWidth={2}
            fill="url(#colorVerse)"
          />
          
          {/* Scénario Sécurisé - Visible si comparaison active */}
          {showComparison && (
            <Area
              type="monotone"
              dataKey="scenarioSecurise"
              name="Scénario Sécurisé (3%)"
              stroke="hsl(var(--muted-foreground))"
              strokeWidth={2}
              strokeDasharray="5 5"
              fill="none"
            />
          )}
          
          {/* Votre Scénario - Toujours visible */}
          <Area
            type="monotone"
            dataKey="votreScenario"
            name="Votre Scénario"
            stroke="hsl(var(--primary))"
            strokeWidth={3}
            fill="url(#colorVotre)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
