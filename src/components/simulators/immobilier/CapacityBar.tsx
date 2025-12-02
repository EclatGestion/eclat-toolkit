interface CapacityBarProps {
  capacite: number;
  apport: number;
}

export function CapacityBar({ capacite, apport }: CapacityBarProps) {
  const total = capacite + apport;
  const capacitePercent = total > 0 ? (capacite / total) * 100 : 0;
  const apportPercent = total > 0 ? (apport / total) * 100 : 0;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Budget Total Estimé</span>
        <span className="font-semibold text-foreground">{formatCurrency(total)}</span>
      </div>
      
      <div className="h-4 bg-muted rounded-full overflow-hidden flex">
        <div
          className="h-full bg-emerald-500 transition-all duration-500"
          style={{ width: `${capacitePercent}%` }}
        />
        {apport > 0 && (
          <div
            className="h-full bg-slate-400 transition-all duration-500"
            style={{ width: `${apportPercent}%` }}
          />
        )}
      </div>

      <div className="flex justify-between text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span className="text-muted-foreground">Capacité : {formatCurrency(capacite)}</span>
        </div>
        {apport > 0 && (
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-400" />
            <span className="text-muted-foreground">Apport : {formatCurrency(apport)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
