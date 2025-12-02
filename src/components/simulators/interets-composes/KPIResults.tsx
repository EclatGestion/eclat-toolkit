import { TrendingUp } from "lucide-react";

interface KPIResultsProps {
  capitalFinal: number;
  totalVerse: number;
  interetsGagnes: number;
}

export function KPIResults({ capitalFinal, totalVerse, interetsGagnes }: KPIResultsProps) {
  const pourcentageGain = totalVerse > 0 ? ((interetsGagnes / totalVerse) * 100).toFixed(0) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
      {/* Capital Final */}
      <div className="bg-primary/5 rounded-2xl p-4 md:p-5 text-center min-w-0">
        <p className="text-xs md:text-sm text-muted-foreground mb-1">Capital Final Estimé</p>
        <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary whitespace-nowrap">
          {capitalFinal.toLocaleString("fr-FR")} €
        </p>
      </div>

      {/* Total Versé */}
      <div className="bg-muted/50 rounded-2xl p-4 md:p-5 text-center min-w-0">
        <p className="text-xs md:text-sm text-muted-foreground mb-1">Total Versé</p>
        <p className="text-lg sm:text-xl lg:text-2xl font-semibold text-foreground whitespace-nowrap">
          {totalVerse.toLocaleString("fr-FR")} €
        </p>
      </div>

      {/* Intérêts Gagnés */}
      <div className="bg-success/10 rounded-2xl p-4 md:p-5 text-center min-w-0">
        <p className="text-xs md:text-sm text-muted-foreground mb-1">Intérêts Gagnés</p>
        <div className="flex items-center justify-center gap-1.5">
          <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-success flex-shrink-0" />
          <p className="text-lg sm:text-xl lg:text-2xl font-semibold text-success whitespace-nowrap">
            {interetsGagnes.toLocaleString("fr-FR")} €
          </p>
        </div>
        <p className="text-xs text-success mt-1">+{pourcentageGain}%</p>
      </div>
    </div>
  );
}
