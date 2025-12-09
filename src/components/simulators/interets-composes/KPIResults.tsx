import { TrendingUp } from "lucide-react";

interface KPIResultsProps {
  capitalFinal: number;
  totalVerse: number;
  interetsGagnes: number;
}

// Format large numbers compactly
function formatMontant(value: number): string {
  if (value >= 1000000) {
    return `${(value / 1000000).toLocaleString("fr-FR", { maximumFractionDigits: 2 })}M`;
  }
  if (value >= 1000) {
    return `${Math.round(value / 1000).toLocaleString("fr-FR")}K`;
  }
  return value.toLocaleString("fr-FR");
}

export function KPIResults({
  capitalFinal,
  totalVerse,
  interetsGagnes
}: KPIResultsProps) {
  const pourcentageGain = totalVerse > 0 ? (interetsGagnes / totalVerse * 100).toFixed(0) : 0;
  
  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-6">
      {/* Capital Final */}
      <div className="bg-primary/5 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center">
        <p className="text-[10px] sm:text-xs text-muted-foreground mb-1">Capital Final</p>
        <p className="text-sm sm:text-lg md:text-xl font-bold text-primary">
          {formatMontant(capitalFinal)} €
        </p>
      </div>

      {/* Total Versé */}
      <div className="bg-muted/50 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center">
        <p className="text-[10px] sm:text-xs text-muted-foreground mb-1">Total Versé</p>
        <p className="text-sm sm:text-lg md:text-xl font-semibold text-foreground">
          {formatMontant(totalVerse)} €
        </p>
      </div>

      {/* Intérêts Gagnés */}
      <div className="bg-success/10 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center">
        <p className="text-[10px] sm:text-xs text-muted-foreground mb-1">Intérêts</p>
        <div className="flex items-center justify-center gap-1">
          <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-success flex-shrink-0" />
          <p className="text-sm sm:text-lg md:text-xl font-semibold text-success">
            {formatMontant(interetsGagnes)} €
          </p>
        </div>
        <p className="text-[10px] sm:text-xs text-success mt-0.5">+{pourcentageGain}%</p>
      </div>
    </div>
  );
}
