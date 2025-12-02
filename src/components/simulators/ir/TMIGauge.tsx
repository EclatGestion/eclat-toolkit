interface TMIGaugeProps {
  tmi: number;
}

const TRANCHES = [
  { rate: 0, label: "0%", color: "bg-emerald-400" },
  { rate: 11, label: "11%", color: "bg-emerald-500" },
  { rate: 30, label: "30%", color: "bg-amber-400" },
  { rate: 41, label: "41%", color: "bg-orange-500" },
  { rate: 45, label: "45%", color: "bg-red-500" },
];

export function TMIGauge({ tmi }: TMIGaugeProps) {
  const activeIndex = TRANCHES.findIndex((t) => t.rate === tmi);

  return (
    <div className="space-y-4">
      {/* Affichage du TMI */}
      <div className="text-center">
        <span className="text-5xl font-bold text-foreground">{tmi}%</span>
        <p className="text-sm text-muted-foreground mt-1">Tranche Marginale</p>
      </div>

      {/* Barre segmentée */}
      <div className="flex gap-1 h-4 rounded-full overflow-hidden">
        {TRANCHES.map((tranche, index) => (
          <div
            key={tranche.rate}
            className={`flex-1 transition-all duration-300 ${tranche.color} ${
              index <= activeIndex ? "opacity-100" : "opacity-20"
            }`}
          />
        ))}
      </div>

      {/* Labels */}
      <div className="flex justify-between text-xs text-muted-foreground">
        {TRANCHES.map((tranche, index) => (
          <span
            key={tranche.rate}
            className={`transition-colors ${
              index === activeIndex ? "text-foreground font-semibold" : ""
            }`}
          >
            {tranche.label}
          </span>
        ))}
      </div>
    </div>
  );
}
