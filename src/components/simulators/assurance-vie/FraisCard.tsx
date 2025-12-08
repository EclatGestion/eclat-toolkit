import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Receipt, Lock } from "lucide-react";

interface FraisCardProps {
  fraisGestion: number;
  setFraisGestion: (value: number) => void;
  fraisUC: number;
  setFraisUC: (value: number) => void;
}

export function FraisCard({
  fraisGestion,
  setFraisGestion,
  fraisUC,
  setFraisUC,
}: FraisCardProps) {
  return (
    <Card className="rounded-3xl shadow-card">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="p-2 rounded-xl bg-orange-500/10">
            <Receipt className="h-5 w-5 text-orange-500" />
          </div>
          Frais du contrat
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Frais de gestion du contrat */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label htmlFor="fraisGestion">Frais de gestion annuels</Label>
            <div className="flex items-center gap-1">
              <Input
                id="fraisGestion"
                type="number"
                value={fraisGestion}
                onChange={(e) => setFraisGestion(Number(e.target.value))}
                className="w-20 text-right"
                min={0}
                max={2}
                step={0.1}
              />
              <span className="text-muted-foreground">%</span>
            </div>
          </div>
          <Slider
            value={[fraisGestion]}
            onValueChange={(v) => setFraisGestion(v[0])}
            min={0}
            max={2}
            step={0.1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0%</span>
            <span>2%</span>
          </div>
          <Badge variant="outline" className="text-xs">
            Notre tarif : 1%
          </Badge>
        </div>

        {/* Frais sur UC */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label htmlFor="fraisUC">Frais additionnels sur UC</Label>
            <div className="flex items-center gap-1">
              <Input
                id="fraisUC"
                type="number"
                value={fraisUC}
                onChange={(e) => setFraisUC(Number(e.target.value))}
                className="w-20 text-right"
                min={0}
                max={2}
                step={0.1}
              />
              <span className="text-muted-foreground">%</span>
            </div>
          </div>
          <Slider
            value={[fraisUC]}
            onValueChange={(v) => setFraisUC(v[0])}
            min={0}
            max={2}
            step={0.1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0%</span>
            <span>2%</span>
          </div>
          <Badge variant="outline" className="text-xs">
            Frais liés aux supports UC uniquement
          </Badge>
        </div>

        {/* Aperçu fonctionnalités Premium */}
        <div className="mt-6 p-4 rounded-xl bg-muted/50 border border-dashed border-muted-foreground/30">
          <div className="flex items-center gap-2 mb-2">
            <Lock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">
              Fonctionnalités Premium
            </span>
          </div>
          <ul className="text-xs text-muted-foreground space-y-1 ml-6">
            <li>• Frais d'entrée sur versements</li>
            <li>• Frais d'arbitrage</li>
            <li>• Dégressivité des frais</li>
            <li>• Simulation multi-scénarios</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
