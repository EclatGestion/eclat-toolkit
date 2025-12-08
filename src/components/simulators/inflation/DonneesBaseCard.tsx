import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InputSlider } from "@/components/simulators/interets-composes/InputSlider";
import { Wallet, TrendingDown, Clock } from "lucide-react";

interface DonneesBaseCardProps {
  montant: number;
  setMontant: (value: number) => void;
  inflation: number;
  setInflation: (value: number) => void;
  duree: number;
  setDuree: (value: number) => void;
}

export function DonneesBaseCard({
  montant,
  setMontant,
  inflation,
  setInflation,
  duree,
  setDuree,
}: DonneesBaseCardProps) {
  return (
    <Card className="rounded-3xl shadow-card">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="p-2 rounded-xl bg-primary/10">
            <Wallet className="h-5 w-5 text-primary" />
          </div>
          Données de base
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <InputSlider
          label="Montant de l'épargne"
          value={montant}
          onChange={setMontant}
          min={1000}
          max={500000}
          step={1000}
          unit="€"
        />

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <TrendingDown className="h-4 w-4 text-destructive" />
            Taux d'inflation annuel
          </div>
          <InputSlider
            label=""
            value={inflation}
            onChange={setInflation}
            min={0.5}
            max={10}
            step={0.1}
            unit="%"
            formatValue={(v) => `${v.toFixed(1)} %`}
          />
          <div className="flex gap-2 flex-wrap">
            {[
              { label: "Faible", value: 1.5, color: "text-green-600 bg-green-500/10" },
              { label: "Modérée", value: 2.5, color: "text-yellow-600 bg-yellow-500/10" },
              { label: "Élevée", value: 4.0, color: "text-orange-600 bg-orange-500/10" },
              { label: "Forte", value: 6.0, color: "text-destructive bg-destructive/10" },
            ].map((preset) => (
              <button
                key={preset.label}
                onClick={() => setInflation(preset.value)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  Math.abs(inflation - preset.value) < 0.1
                    ? preset.color + " ring-2 ring-offset-2 ring-current"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {preset.label} ({preset.value}%)
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Clock className="h-4 w-4 text-primary" />
            Durée de projection
          </div>
          <InputSlider
            label=""
            value={duree}
            onChange={setDuree}
            min={1}
            max={30}
            step={1}
            unit="ans"
            formatValue={(v) => `${v} ans`}
          />
        </div>
      </CardContent>
    </Card>
  );
}
