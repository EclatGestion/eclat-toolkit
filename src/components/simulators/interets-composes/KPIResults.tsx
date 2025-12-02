import { TrendingUp } from "lucide-react";

interface KPIResultsProps {
  capitalFinal: number;
  totalVerse: number;
  interetsGagnes: number;
}

export function KPIResults({ capitalFinal, totalVerse, interetsGagnes }: KPIResultsProps) {
  const pourcentageGain = totalVerse > 0 ? ((interetsGagnes / totalVerse) * 100).toFixed(0) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
      {/* Capital Final */}
      <div className="bg-primary/5 rounded-2xl p-4 text-center">
        <p className="text-sm text-muted-foreground mb-1">Capital Final Estimé</p>
        <p className="text-2xl md:text-3xl font-bold text-primary">
          {capitalFinal.toLocaleString("fr-FR")} €
        </p>
      </div>

      {/* Total Versé */}
      <div className="bg-muted/50 rounded-2xl p-4 text-center">
        <p className="text-sm text-muted-foreground mb-1">Total Versé</p>
        <p className="text-xl md:text-2xl font-semibold text-foreground">
          {totalVerse.toLocaleString("fr-FR")} €
        </p>
      </div>

      {/* Intérêts Gagnés */}
      <div className="bg-success/10 rounded-2xl p-4 text-center">
        <p className="text-sm text-muted-foreground mb-1">Intérêts Gagnés</p>
        <div className="flex items-center justify-center gap-2">
          <TrendingUp className="w-5 h-5 text-success" />
          <p className="text-xl md:text-2xl font-semibold text-success">
            {interetsGagnes.toLocaleString("fr-FR")} €
          </p>
        </div>
        <p className="text-xs text-success mt-1">+{pourcentageGain}%</p>
      </div>
    </div>
  );
}
