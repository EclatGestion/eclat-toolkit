import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface DonutChartProps {
  capital: number;
  interets: number;
  coutTotal: number;
}

export function DonutChart({ capital, interets, coutTotal }: DonutChartProps) {
  const data = [
    { name: "Capital", value: capital, color: "hsl(var(--primary))" },
    { name: "Intérêts", value: interets, color: "hsl(var(--destructive))" },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="relative w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      
      {/* Centre du donut */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xs text-muted-foreground">Coût Total</span>
        <span className="text-lg font-bold text-foreground">{formatCurrency(coutTotal)}</span>
      </div>

      {/* Légende */}
      <div className="flex justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary" />
          <span className="text-xs text-muted-foreground">Capital ({formatCurrency(capital)})</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-destructive" />
          <span className="text-xs text-muted-foreground">Intérêts ({formatCurrency(interets)})</span>
        </div>
      </div>
    </div>
  );
}
