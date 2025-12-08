import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InputSlider } from "@/components/simulators/interets-composes/InputSlider";
import { Badge } from "@/components/ui/badge";
import { PiggyBank, AlertTriangle, Info, Lock } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const PASS_2025 = 46368;
const PER_PLANCHER = 4637;
const PER_PLAFOND_MAX = Math.round(PASS_2025 * 8 * 0.10);

interface VersementsPERCardProps {
  montantVersement: number;
  setMontantVersement: (value: number) => void;
  plafondPER: number;
  revenuImposable: number;
}

export function VersementsPERCard({
  montantVersement,
  setMontantVersement,
  plafondPER,
  revenuImposable,
}: VersementsPERCardProps) {
  const depassePlafond = montantVersement > plafondPER;

  return (
    <Card className="bg-card border-0 shadow-card rounded-3xl">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-lg font-semibold text-foreground">
          <div className="p-2 rounded-xl bg-emerald-500/10">
            <PiggyBank className="h-5 w-5 text-emerald-500" />
          </div>
          Versements PER
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <InputSlider
          label="Montant envisagé de versement"
          value={montantVersement}
          onChange={setMontantVersement}
          min={500}
          max={Math.max(plafondPER, 40000)}
          step={100}
          unit="€"
        />

        {depassePlafond && (
          <div className="flex items-center gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
            <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0" />
            <span className="text-sm text-amber-700 dark:text-amber-400">
              Montant limité au plafond de {plafondPER.toLocaleString("fr-FR")} €
            </span>
          </div>
        )}

        <div className="p-4 bg-muted/50 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">Plafond disponible</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>Plafond = min(10% des revenus, 8 × PASS × 10%)</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Minimum: {PER_PLANCHER.toLocaleString("fr-FR")} € | Maximum: {PER_PLAFOND_MAX.toLocaleString("fr-FR")} €
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Badge variant="secondary" className="text-base font-semibold">
              {plafondPER.toLocaleString("fr-FR")} €
            </Badge>
          </div>

          <p className="text-xs text-muted-foreground">
            Indicatif simplifié basé sur vos revenus de l'année en cours.
          </p>

          <div className="flex items-center gap-2 p-2 bg-primary/5 rounded-lg opacity-60">
            <Lock className="h-3 w-3 text-primary" />
            <span className="text-xs text-primary">
              Premium : Plafonds N-1, N-2, N-3 disponibles
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function calculatePlafondPER(revenuImposable: number): number {
  const plafond10Pourcent = revenuImposable * 0.10;
  return Math.max(PER_PLANCHER, Math.min(plafond10Pourcent, PER_PLAFOND_MAX));
}
