import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

interface PatrimoineDonutChartProps {
  immobilier: number;
  financier: number;
  liquidites: number;
}

const COLORS = [
  "hsl(var(--chart-1))", // Immobilier
  "hsl(var(--chart-2))", // Financier
  "hsl(var(--chart-3))", // Liquidités
];

export function PatrimoineDonutChart({
  immobilier,
  financier,
  liquidites,
}: PatrimoineDonutChartProps) {
  const total = immobilier + financier + liquidites;
  
  const data = [
    { name: "Immobilier", value: immobilier, percentage: total > 0 ? ((immobilier / total) * 100).toFixed(1) : 0 },
    { name: "Financier", value: financier, percentage: total > 0 ? ((financier / total) * 100).toFixed(1) : 0 },
    { name: "Liquidités", value: liquidites, percentage: total > 0 ? ((liquidites / total) * 100).toFixed(1) : 0 },
  ].filter(d => d.value > 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-sm text-muted-foreground">
            {payload[0].value.toLocaleString('fr-FR')} € ({payload[0].payload.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col items-center">
      <div className="text-center mb-2">
        <div className="text-sm text-muted-foreground">Patrimoine Total</div>
        <div className="text-3xl font-bold text-primary">
          {total.toLocaleString('fr-FR')} €
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      {/* Légende */}
      <div className="flex flex-wrap justify-center gap-4 mt-2">
        {data.map((item, index) => (
          <div key={item.name} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span className="text-sm text-muted-foreground">
              {item.name} ({item.percentage}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
