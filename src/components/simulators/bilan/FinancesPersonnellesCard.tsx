import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Wallet, TrendingDown, PiggyBank, CreditCard } from "lucide-react";

interface FinancesPersonnellesCardProps {
  revenus: number;
  setRevenus: (v: number) => void;
  depenses: number;
  setDepenses: (v: number) => void;
  epargneMensuelle: number;
  setEpargneMensuelle: (v: number) => void;
  creditsRestants: number;
  setCreditsRestants: (v: number) => void;
}

export function FinancesPersonnellesCard({
  revenus,
  setRevenus,
  depenses,
  setDepenses,
  epargneMensuelle,
  setEpargneMensuelle,
  creditsRestants,
  setCreditsRestants,
}: FinancesPersonnellesCardProps) {
  const tauxEpargne = revenus > 0 ? Math.round((epargneMensuelle / revenus) * 100) : 0;
  const tauxEndettement = revenus > 0 ? Math.round((creditsRestants / (revenus * 12)) * 100) : 0;

  return (
    <Card className="border-0 shadow-lg bg-card">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-lg">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
            <Wallet className="w-5 h-5 text-emerald-500" />
          </div>
          Finances Personnelles
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Revenus mensuels */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-muted-foreground rotate-180" />
              Revenus nets mensuels
            </Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={revenus}
                onChange={(e) => setRevenus(Number(e.target.value))}
                className="w-28 text-right"
              />
              <span className="text-muted-foreground">€</span>
            </div>
          </div>
          <Slider
            value={[revenus]}
            onValueChange={([v]) => setRevenus(v)}
            min={0}
            max={20000}
            step={100}
            className="py-2"
          />
        </div>

        {/* Dépenses mensuelles */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-muted-foreground" />
              Dépenses mensuelles
            </Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={depenses}
                onChange={(e) => setDepenses(Number(e.target.value))}
                className="w-28 text-right"
              />
              <span className="text-muted-foreground">€</span>
            </div>
          </div>
          <Slider
            value={[depenses]}
            onValueChange={([v]) => setDepenses(v)}
            min={0}
            max={15000}
            step={100}
            className="py-2"
          />
        </div>

        {/* Épargne mensuelle */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <PiggyBank className="w-4 h-4 text-muted-foreground" />
              Épargne mensuelle
            </Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={epargneMensuelle}
                onChange={(e) => setEpargneMensuelle(Number(e.target.value))}
                className="w-28 text-right"
              />
              <span className="text-muted-foreground">€</span>
            </div>
          </div>
          <Slider
            value={[epargneMensuelle]}
            onValueChange={([v]) => setEpargneMensuelle(v)}
            min={0}
            max={5000}
            step={50}
            className="py-2"
          />
        </div>

        {/* Crédits restants */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-muted-foreground" />
              Crédits restants (hors immo)
            </Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={creditsRestants}
                onChange={(e) => setCreditsRestants(Number(e.target.value))}
                className="w-28 text-right"
              />
              <span className="text-muted-foreground">€</span>
            </div>
          </div>
          <Slider
            value={[creditsRestants]}
            onValueChange={([v]) => setCreditsRestants(v)}
            min={0}
            max={100000}
            step={1000}
            className="py-2"
          />
        </div>

        {/* Indicateurs */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
          <div className="text-center p-3 rounded-xl bg-muted/50">
            <div className="text-xs text-muted-foreground mb-1">Taux d'épargne</div>
            <div className={`text-xl font-bold ${tauxEpargne >= 15 ? 'text-emerald-500' : tauxEpargne >= 10 ? 'text-amber-500' : 'text-red-500'}`}>
              {tauxEpargne}%
            </div>
          </div>
          <div className="text-center p-3 rounded-xl bg-muted/50">
            <div className="text-xs text-muted-foreground mb-1">Taux d'endettement</div>
            <div className={`text-xl font-bold ${tauxEndettement <= 33 ? 'text-emerald-500' : tauxEndettement <= 50 ? 'text-amber-500' : 'text-red-500'}`}>
              {tauxEndettement}%
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
