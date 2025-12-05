import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

interface ComparisonBarChartProps {
  locationNue: number;
  lmnp: number;
}

export function ComparisonBarChart({ locationNue, lmnp }: ComparisonBarChartProps) {
  const data = [
    { name: "Location Nue", value: locationNue, fill: "hsl(var(--primary))" },
    { name: "LMNP", value: lmnp, fill: "hsl(142, 76%, 36%)" },
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

  return (
    <ChartContainer config={chartConfig} className="h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 10, right: 30, left: 100, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="hsl(var(--border))" />
          <XAxis 
            type="number" 
            tickFormatter={formatCurrency}
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
          />
          <YAxis 
            type="category" 
            dataKey="name" 
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            width={90}
          />
          <Tooltip
            content={<ChartTooltipContent formatter={(value) => formatCurrency(Number(value))} />}
          />
          <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={32}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
