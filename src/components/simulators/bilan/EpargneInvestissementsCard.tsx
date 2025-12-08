import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Landmark, Umbrella, Briefcase, Coins } from "lucide-react";

interface EpargneInvestissementsCardProps {
  liquidites: number;
  setLiquidites: (v: number) => void;
  assuranceVie: number;
  setAssuranceVie: (v: number) => void;
  per: number;
  setPer: (v: number) => void;
  peaCto: number;
  setPeaCto: (v: number) => void;
}

export function EpargneInvestissementsCard({
  liquidites,
  setLiquidites,
  assuranceVie,
  setAssuranceVie,
  per,
  setPer,
  peaCto,
  setPeaCto,
}: EpargneInvestissementsCardProps) {
  const totalEpargne = liquidites + assuranceVie + per + peaCto;
  
  const getPercentage = (value: number) => totalEpargne > 0 ? Math.round((value / totalEpargne) * 100) : 0;
  
  const diversificationScore = [liquidites, assuranceVie, per, peaCto].filter(v => v > 0).length;

  return (
    <Card className="border-0 shadow-lg bg-card">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-lg">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
            <Landmark className="w-5 h-5 text-blue-500" />
          </div>
          Épargne & Investissements
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Liquidités */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <Coins className="w-4 h-4 text-muted-foreground" />
              Liquidités (Livrets, Comptes)
            </Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={liquidites}
                onChange={(e) => setLiquidites(Number(e.target.value))}
                className="w-32 text-right"
              />
              <span className="text-muted-foreground">€</span>
            </div>
          </div>
          <Slider
            value={[liquidites]}
            onValueChange={([v]) => setLiquidites(v)}
            min={0}
            max={200000}
            step={1000}
            className="py-2"
          />
        </div>

        {/* Assurance-vie */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <Umbrella className="w-4 h-4 text-muted-foreground" />
              Assurance-vie
            </Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={assuranceVie}
                onChange={(e) => setAssuranceVie(Number(e.target.value))}
                className="w-32 text-right"
              />
              <span className="text-muted-foreground">€</span>
            </div>
          </div>
          <Slider
            value={[assuranceVie]}
            onValueChange={([v]) => setAssuranceVie(v)}
            min={0}
            max={500000}
            step={1000}
            className="py-2"
          />
        </div>

        {/* PER */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-muted-foreground" />
              PER (Plan Épargne Retraite)
            </Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={per}
                onChange={(e) => setPer(Number(e.target.value))}
                className="w-32 text-right"
              />
              <span className="text-muted-foreground">€</span>
            </div>
          </div>
          <Slider
            value={[per]}
            onValueChange={([v]) => setPer(v)}
            min={0}
            max={200000}
            step={1000}
            className="py-2"
          />
        </div>

        {/* PEA / CTO */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <Landmark className="w-4 h-4 text-muted-foreground" />
              PEA / Compte-titres
            </Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={peaCto}
                onChange={(e) => setPeaCto(Number(e.target.value))}
                className="w-32 text-right"
              />
              <span className="text-muted-foreground">€</span>
            </div>
          </div>
          <Slider
            value={[peaCto]}
            onValueChange={([v]) => setPeaCto(v)}
            min={0}
            max={500000}
            step={1000}
            className="py-2"
          />
        </div>

        {/* Résumé */}
        <div className="pt-4 border-t border-border space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total épargne financière</span>
            <span className="text-xl font-bold text-primary">
              {totalEpargne.toLocaleString('fr-FR')} €
            </span>
          </div>
          
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <div className="p-2 rounded-lg bg-muted/50">
              <div className="text-muted-foreground">Liquidités</div>
              <div className="font-semibold">{getPercentage(liquidites)}%</div>
            </div>
            <div className="p-2 rounded-lg bg-muted/50">
              <div className="text-muted-foreground">AV</div>
              <div className="font-semibold">{getPercentage(assuranceVie)}%</div>
            </div>
            <div className="p-2 rounded-lg bg-muted/50">
              <div className="text-muted-foreground">PER</div>
              <div className="font-semibold">{getPercentage(per)}%</div>
            </div>
            <div className="p-2 rounded-lg bg-muted/50">
              <div className="text-muted-foreground">PEA/CTO</div>
              <div className="font-semibold">{getPercentage(peaCto)}%</div>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Score diversification</span>
            <span className={`font-semibold ${diversificationScore >= 3 ? 'text-emerald-500' : diversificationScore >= 2 ? 'text-amber-500' : 'text-red-500'}`}>
              {diversificationScore}/4 enveloppes
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
