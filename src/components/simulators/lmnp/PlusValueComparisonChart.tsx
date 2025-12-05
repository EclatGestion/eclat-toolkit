import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

interface PlusValueComparisonChartProps {
  plusValueNue: number;
  plusValueLMNP: number;
  amortissementsReintegres?: number;
}

export function PlusValueComparisonChart({ 
  plusValueNue, 
  plusValueLMNP,
}: PlusValueComparisonChartProps) {
  const data = [
    { 
      name: "Location Nue", 
      value: plusValueNue, 
      fill: "hsl(var(--primary))" 
    },
    { 
      name: "LMNP", 
      value: plusValueLMNP, 
      fill: "hsl(var(--destructive))"
    },
  ];

  const chartConfig = {
    locationNue: {
      label: "Location Nue",
      color: "hsl(var(--primary))",
    },
    lmnp: {
      label: "LMNP",
      color: "hsl(var(--destructive))",
    },
  };

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(value);

  return (
    <ChartContainer config={chartConfig} className="h-[180px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 10, right: 80, left: 100, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="hsl(var(--border))" />
          <XAxis 
            type="number" 
            tickFormatter={formatCurrency}
            stroke="hsl(var(--muted-foreground))"
            fontSize={11}
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
          <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={28}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
            <LabelList 
              dataKey="value" 
              position="right" 
              formatter={(value: number) => formatCurrency(value)}
              fontSize={11}
              fill="hsl(var(--foreground))"
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
