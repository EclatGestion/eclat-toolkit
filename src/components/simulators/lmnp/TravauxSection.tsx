import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Hammer } from "lucide-react";

export type TypeTravaux = "entretien" | "amelioration" | "energie";

interface TravauxSectionProps {
  montantTravaux: number;
  setMontantTravaux: (value: number) => void;
  typeTravaux: TypeTravaux;
  setTypeTravaux: (value: TypeTravaux) => void;
  formatCurrency: (value: number) => string;
}

export function TravauxSection({
  montantTravaux,
  setMontantTravaux,
  typeTravaux,
  setTypeTravaux,
  formatCurrency,
}: TravauxSectionProps) {
  return (
    <Card className="rounded-2xl">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-base">
          <Hammer className="w-5 h-5 text-orange-500" />
          Travaux
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>Montant des travaux</Label>
            <span className="text-sm font-semibold text-primary">{formatCurrency(montantTravaux)}</span>
          </div>
          <Slider
            value={[montantTravaux]}
            onValueChange={([v]) => setMontantTravaux(v)}
            min={0}
            max={100000}
            step={1000}
          />
        </div>
        
        <div className="space-y-2">
          <Label>Type de travaux</Label>
          <Select value={typeTravaux} onValueChange={(v) => setTypeTravaux(v as TypeTravaux)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="entretien">
                <div className="flex flex-col items-start py-1">
                  <span className="font-medium">Entretien / Réparation</span>
                  <span className="text-xs text-muted-foreground">Déductible immédiatement à 100%</span>
                </div>
              </SelectItem>
              <SelectItem value="amelioration">
                <div className="flex flex-col items-start py-1">
                  <span className="font-medium">Amélioration</span>
                  <span className="text-xs text-muted-foreground">Amortissable sur 10 ans (LMNP uniquement)</span>
                </div>
              </SelectItem>
              <SelectItem value="energie">
                <div className="flex flex-col items-start py-1">
                  <span className="font-medium">Rénovation énergétique</span>
                  <span className="text-xs text-emerald-600">🌱 Déficit foncier doublé: 21 400€ (Location Nue)</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
