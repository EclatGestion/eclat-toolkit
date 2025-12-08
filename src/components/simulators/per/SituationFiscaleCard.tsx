import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InputSlider } from "@/components/simulators/interets-composes/InputSlider";
import { User, Calculator } from "lucide-react";

// Tranches d'imposition 2025
const TAX_BRACKETS = [
  { min: 0, max: 11497, rate: 0 },
  { min: 11498, max: 29315, rate: 11 },
  { min: 29316, max: 83823, rate: 30 },
  { min: 83824, max: 180294, rate: 41 },
  { min: 180295, max: Infinity, rate: 45 },
];

const QUOTIENT_OPTIONS = ["1", "1.5", "2", "2.5", "3", "3.5", "4"];
const TMI_OPTIONS = [0, 11, 30, 41, 45];

interface SituationFiscaleCardProps {
  revenuImposable: number;
  setRevenuImposable: (value: number) => void;
  quotientFamilial: number;
  setQuotientFamilial: (value: number) => void;
  tmiManuel: boolean;
  setTmiManuel: (value: boolean) => void;
  tmiValue: number;
  setTmiValue: (value: number) => void;
  tmiCalcule: number;
}

export function SituationFiscaleCard({
  revenuImposable,
  setRevenuImposable,
  quotientFamilial,
  setQuotientFamilial,
  tmiManuel,
  setTmiManuel,
  tmiValue,
  setTmiValue,
  tmiCalcule,
}: SituationFiscaleCardProps) {
  return (
    <Card className="bg-card border-0 shadow-card rounded-3xl">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-lg font-semibold text-foreground">
          <div className="p-2 rounded-xl bg-primary/10">
            <User className="h-5 w-5 text-primary" />
          </div>
          Situation Fiscale
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <InputSlider
          label="Revenus imposables annuels"
          value={revenuImposable}
          onChange={setRevenuImposable}
          min={10000}
          max={300000}
          step={1000}
          unit="€"
        />

        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">Quotient familial</Label>
          <Select
            value={quotientFamilial.toString()}
            onValueChange={(v) => setQuotientFamilial(parseFloat(v))}
          >
            <SelectTrigger className="bg-muted/50 border-0 rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {QUOTIENT_OPTIONS.map((q) => (
                <SelectItem key={q} value={q}>
                  {q} part{parseFloat(q) > 1 ? "s" : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Taux Marginal d'Imposition (TMI)
            </Label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Auto</span>
              <Switch checked={tmiManuel} onCheckedChange={setTmiManuel} />
              <span className="text-xs text-muted-foreground">Manuel</span>
            </div>
          </div>

          {tmiManuel ? (
            <Select
              value={tmiValue.toString()}
              onValueChange={(v) => setTmiValue(parseInt(v))}
            >
              <SelectTrigger className="bg-muted/50 border-0 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TMI_OPTIONS.map((t) => (
                  <SelectItem key={t} value={t.toString()}>
                    {t}%
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <div className="flex items-center justify-between p-3 bg-emerald-500/10 rounded-xl">
              <span className="text-sm text-muted-foreground">TMI calculé automatiquement</span>
              <span className="text-lg font-bold text-emerald-600">{tmiCalcule}%</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function calculateTMI(revenuImposable: number, quotientFamilial: number): number {
  const quotient = revenuImposable / quotientFamilial;
  for (let i = TAX_BRACKETS.length - 1; i >= 0; i--) {
    if (quotient >= TAX_BRACKETS[i].min) {
      return TAX_BRACKETS[i].rate;
    }
  }
  return 0;
}
