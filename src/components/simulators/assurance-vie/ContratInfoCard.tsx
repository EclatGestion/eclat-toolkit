import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Wallet } from "lucide-react";

interface ContratInfoCardProps {
  montantInitial: number;
  setMontantInitial: (value: number) => void;
  versementMensuel: number;
  setVersementMensuel: (value: number) => void;
  horizon: number;
  setHorizon: (value: number) => void;
}

export function ContratInfoCard({
  montantInitial,
  setMontantInitial,
  versementMensuel,
  setVersementMensuel,
  horizon,
  setHorizon,
}: ContratInfoCardProps) {
  return (
    <Card className="rounded-3xl shadow-card">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="p-2 rounded-xl bg-violet-500/10">
            <Wallet className="h-5 w-5 text-violet-500" />
          </div>
          Informations du contrat
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Montant initial */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label htmlFor="montantInitial">Montant initial</Label>
            <div className="flex items-center gap-1">
              <Input
                id="montantInitial"
                type="number"
                value={montantInitial}
                onChange={(e) => setMontantInitial(Number(e.target.value))}
                className="w-28 text-right"
                min={1000}
                max={500000}
              />
              <span className="text-muted-foreground">€</span>
            </div>
          </div>
          <Slider
            value={[montantInitial]}
            onValueChange={(v) => setMontantInitial(v[0])}
            min={1000}
            max={500000}
            step={1000}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>1 000 €</span>
            <span>500 000 €</span>
          </div>
        </div>

        {/* Versement mensuel */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label htmlFor="versementMensuel">Versement mensuel</Label>
            <div className="flex items-center gap-1">
              <Input
                id="versementMensuel"
                type="number"
                value={versementMensuel}
                onChange={(e) => setVersementMensuel(Number(e.target.value))}
                className="w-28 text-right"
                min={0}
                max={5000}
              />
              <span className="text-muted-foreground">€</span>
            </div>
          </div>
          <Slider
            value={[versementMensuel]}
            onValueChange={(v) => setVersementMensuel(v[0])}
            min={0}
            max={5000}
            step={50}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0 €</span>
            <span>5 000 €</span>
          </div>
        </div>

        {/* Horizon de placement */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label htmlFor="horizon">Horizon de placement</Label>
            <div className="flex items-center gap-1">
              <Input
                id="horizon"
                type="number"
                value={horizon}
                onChange={(e) => setHorizon(Number(e.target.value))}
                className="w-20 text-right"
                min={1}
                max={40}
              />
              <span className="text-muted-foreground">ans</span>
            </div>
          </div>
          <Slider
            value={[horizon]}
            onValueChange={(v) => setHorizon(v[0])}
            min={1}
            max={40}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>1 an</span>
            <span>40 ans</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
