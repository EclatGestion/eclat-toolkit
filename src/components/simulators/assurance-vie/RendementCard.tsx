import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, AlertCircle } from "lucide-react";

interface RendementCardProps {
  modeSimple: boolean;
  setModeSimple: (value: boolean) => void;
  rendementUnique: number;
  setRendementUnique: (value: number) => void;
  fondsEuros: number;
  setFondsEuros: (value: number) => void;
  uc: number;
  setUc: (value: number) => void;
  autres: number;
  setAutres: (value: number) => void;
  tauxFE: number;
  setTauxFE: (value: number) => void;
  tauxUC: number;
  setTauxUC: (value: number) => void;
  tauxAutres: number;
  setTauxAutres: (value: number) => void;
}

export function RendementCard({
  modeSimple,
  setModeSimple,
  rendementUnique,
  setRendementUnique,
  fondsEuros,
  setFondsEuros,
  uc,
  setUc,
  autres,
  setAutres,
  tauxFE,
  setTauxFE,
  tauxUC,
  setTauxUC,
  tauxAutres,
  setTauxAutres,
}: RendementCardProps) {
  const totalRepartition = fondsEuros + uc + autres;
  const isValidRepartition = totalRepartition === 100;

  return (
    <Card className="rounded-3xl shadow-card">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="p-2 rounded-xl bg-emerald-500/10">
              <TrendingUp className="h-5 w-5 text-emerald-500" />
            </div>
            Rendements
          </CardTitle>
          <div className="flex items-center gap-2">
            <Label htmlFor="modeSimple" className="text-sm text-muted-foreground">
              Mode simplifié
            </Label>
            <Switch
              id="modeSimple"
              checked={modeSimple}
              onCheckedChange={setModeSimple}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {modeSimple ? (
          // Mode simplifié - un seul rendement
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label htmlFor="rendementUnique">Rendement annuel estimé</Label>
              <div className="flex items-center gap-1">
                <Input
                  id="rendementUnique"
                  type="number"
                  value={rendementUnique}
                  onChange={(e) => setRendementUnique(Number(e.target.value))}
                  className="w-20 text-right"
                  min={0.5}
                  max={12}
                  step={0.1}
                />
                <span className="text-muted-foreground">%</span>
              </div>
            </div>
            <Slider
              value={[rendementUnique]}
              onValueChange={(v) => setRendementUnique(v[0])}
              min={0.5}
              max={12}
              step={0.1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0.5%</span>
              <span>12%</span>
            </div>
            <div className="flex gap-2 flex-wrap mt-2">
              <Badge variant="outline" className="text-xs">Fonds euros ~2.5%</Badge>
              <Badge variant="outline" className="text-xs">Mixte ~4%</Badge>
              <Badge variant="outline" className="text-xs">Dynamique ~6-8%</Badge>
            </div>
          </div>
        ) : (
          // Mode répartition détaillé
          <div className="space-y-6">
            {/* Indicateur de répartition */}
            <div className={`p-3 rounded-xl flex items-center gap-2 ${isValidRepartition ? 'bg-emerald-500/10' : 'bg-destructive/10'}`}>
              {!isValidRepartition && <AlertCircle className="h-4 w-4 text-destructive" />}
              <span className={`text-sm font-medium ${isValidRepartition ? 'text-emerald-600' : 'text-destructive'}`}>
                Répartition : {totalRepartition}% {isValidRepartition ? '✓' : `(doit être 100%)`}
              </span>
            </div>

            {/* Fonds Euros */}
            <div className="space-y-3 p-4 rounded-xl bg-muted/30">
              <div className="flex justify-between items-center">
                <Label className="font-medium">Fonds Euros</Label>
                <Badge variant="secondary">{fondsEuros}%</Badge>
              </div>
              <Slider
                value={[fondsEuros]}
                onValueChange={(v) => setFondsEuros(v[0])}
                min={0}
                max={100}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Taux de rendement</span>
                <div className="flex items-center gap-1">
                  <Input
                    type="number"
                    value={tauxFE}
                    onChange={(e) => setTauxFE(Number(e.target.value))}
                    className="w-16 text-right h-8 text-sm"
                    min={0}
                    max={5}
                    step={0.1}
                  />
                  <span className="text-xs text-muted-foreground">%</span>
                </div>
              </div>
            </div>

            {/* Unités de Compte */}
            <div className="space-y-3 p-4 rounded-xl bg-muted/30">
              <div className="flex justify-between items-center">
                <Label className="font-medium">Unités de Compte (UC)</Label>
                <Badge variant="secondary">{uc}%</Badge>
              </div>
              <Slider
                value={[uc]}
                onValueChange={(v) => setUc(v[0])}
                min={0}
                max={100}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Taux de rendement</span>
                <div className="flex items-center gap-1">
                  <Input
                    type="number"
                    value={tauxUC}
                    onChange={(e) => setTauxUC(Number(e.target.value))}
                    className="w-16 text-right h-8 text-sm"
                    min={0}
                    max={15}
                    step={0.1}
                  />
                  <span className="text-xs text-muted-foreground">%</span>
                </div>
              </div>
            </div>

            {/* Autres supports */}
            <div className="space-y-3 p-4 rounded-xl bg-muted/30">
              <div className="flex justify-between items-center">
                <Label className="font-medium">Autres supports</Label>
                <Badge variant="secondary">{autres}%</Badge>
              </div>
              <Slider
                value={[autres]}
                onValueChange={(v) => setAutres(v[0])}
                min={0}
                max={100}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Taux de rendement</span>
                <div className="flex items-center gap-1">
                  <Input
                    type="number"
                    value={tauxAutres}
                    onChange={(e) => setTauxAutres(Number(e.target.value))}
                    className="w-16 text-right h-8 text-sm"
                    min={0}
                    max={10}
                    step={0.1}
                  />
                  <span className="text-xs text-muted-foreground">%</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
