import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

interface ComparisonBarChartProps {
  locationNue: number;
  lmnp: number;
}

export function ComparisonBarChart({ locationNue, lmnp }: ComparisonBarChartProps) {
  const lmnpGagnant = lmnp < locationNue;
  
  const data = [
    { 
      name: "Location Nue", 
      value: locationNue, 
      fill: lmnpGagnant ? "hsl(var(--muted-foreground))" : "hsl(var(--primary))",
    },
    { 
      name: "LMNP", 
      value: lmnp, 
      fill: lmnpGagnant ? "hsl(142, 76%, 36%)" : "hsl(var(--muted-foreground))",
    },
  ];

  const chartConfig = {
    locationNue: {
      label: "Location Nue",
      color: "hsl(var(--primary))",
    },
    lmnp: {
      label: "LMNP",
      color: "hsl(142, 76%, 36%)",
    },
  };

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(value);

  const formatCompact = (value: number) => {
    if (value === 0) return "0 €";
    if (value >= 1000) return `${(value / 1000).toFixed(1)}k €`;
    return `${value} €`;
  };

  // Calculate max for better visualization
  const maxValue = Math.max(locationNue, lmnp, 1);

  return (
    <ChartContainer config={chartConfig} className="h-[160px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
          data={data} 
          layout="vertical" 
          margin={{ top: 20, right: 60, left: 90, bottom: 10 }}
          barCategoryGap="30%"
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="hsl(var(--border))" />
          <XAxis 
            type="number" 
            domain={[0, maxValue * 1.2]}
            tickFormatter={formatCompact}
            stroke="hsl(var(--muted-foreground))"
            fontSize={11}
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            type="category" 
            dataKey="name" 
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            width={85}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            content={<ChartTooltipContent formatter={(value) => formatCurrency(Number(value))} />}
          />
          <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={28} minPointSize={5}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
            <LabelList 
              dataKey="value" 
              position="right" 
              formatter={formatCurrency}
              style={{ 
                fontSize: '12px', 
                fontWeight: 600,
                fill: 'hsl(var(--foreground))'
              }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
