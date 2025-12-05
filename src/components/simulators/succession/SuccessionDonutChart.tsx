import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface SuccessionDonutChartProps {
  netEnfants: number;
  droitsSuccession: number;
}

export function SuccessionDonutChart({ netEnfants, droitsSuccession }: SuccessionDonutChartProps) {
  const total = netEnfants + droitsSuccession;
  
  const data = [
    { name: "Net pour les Enfants", value: netEnfants, color: "#10B981" },
    { name: "Droits de Succession", value: droitsSuccession, color: "#EF4444" },
  ];

  // Filter out zero values for clean display
  const filteredData = data.filter(d => d.value > 0);

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(value);

  const percentageState = total > 0 ? ((droitsSuccession / total) * 100).toFixed(1) : "0";

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={filteredData}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
              strokeWidth={0}
            >
              {filteredData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-xs text-muted-foreground">Droits à payer</span>
          <span className="text-2xl font-bold text-destructive">
            {formatCurrency(droitsSuccession)}
          </span>
          <span className="text-xs text-muted-foreground">
            ({percentageState}% du patrimoine)
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-6 mt-4">
        {data.map((entry) => (
          <div key={entry.name} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }} 
            />
            <div className="text-sm">
              <span className="text-muted-foreground">{entry.name}</span>
              <span className="ml-2 font-semibold text-foreground">
                {formatCurrency(entry.value)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
