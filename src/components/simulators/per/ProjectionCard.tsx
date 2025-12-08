import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InputSlider } from "@/components/simulators/interets-composes/InputSlider";
import { TrendingUp } from "lucide-react";

interface ProjectionCardProps {
  horizon: number;
  setHorizon: (value: number) => void;
  rendementAnnuel: number;
  setRendementAnnuel: (value: number) => void;
  fraisGestion: number;
  setFraisGestion: (value: number) => void;
}

export function ProjectionCard({
  horizon,
  setHorizon,
  rendementAnnuel,
  setRendementAnnuel,
  fraisGestion,
  setFraisGestion,
}: ProjectionCardProps) {
  return (
    <Card className="bg-card border-0 shadow-card rounded-3xl">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-lg font-semibold text-foreground">
          <div className="p-2 rounded-xl bg-blue-500/10">
            <TrendingUp className="h-5 w-5 text-blue-500" />
          </div>
          Projection Long Terme
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <InputSlider
          label="Horizon de placement"
          value={horizon}
          onChange={setHorizon}
          min={5}
          max={40}
          step={1}
          unit="ans"
          formatValue={(v) => `${v} ans`}
        />

        <InputSlider
          label="Rendement annuel estimé"
          value={rendementAnnuel}
          onChange={setRendementAnnuel}
          min={1}
          max={10}
          step={0.5}
          unit="%"
          formatValue={(v) => `${v.toFixed(1)} %`}
        />

        <InputSlider
          label="Frais de gestion annuels"
          value={fraisGestion}
          onChange={setFraisGestion}
          min={0}
          max={2}
          step={0.1}
          unit="%"
          formatValue={(v) => `${v.toFixed(1)} %`}
        />

        <div className="p-3 bg-muted/50 rounded-xl">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Rendement net estimé</span>
            <span className="font-semibold text-foreground">
              {(rendementAnnuel - fraisGestion).toFixed(1)} %
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
