import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, Plus } from "lucide-react";
import { InputSlider } from "../interets-composes/InputSlider";

interface RevenusCardProps {
  salaireNet: number;
  setSalaireNet: (value: number) => void;
  autresRevenus: number;
  setAutresRevenus: (value: number) => void;
}

export function RevenusCard({
  salaireNet,
  setSalaireNet,
  autresRevenus,
  setAutresRevenus,
}: RevenusCardProps) {
  return (
    <Card className="rounded-3xl shadow-card">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-lg">
          <div className="p-2 rounded-xl bg-emerald-500/10">
            <Wallet className="h-5 w-5 text-emerald-500" />
          </div>
          Revenus mensuels
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <InputSlider
          label="Salaire net mensuel"
          value={salaireNet}
          onChange={setSalaireNet}
          min={0}
          max={15000}
          step={100}
          unit="€"
        />
        
        <InputSlider
          label="Autres revenus"
          value={autresRevenus}
          onChange={setAutresRevenus}
          min={0}
          max={5000}
          step={50}
          unit="€"
        />
        
        <div className="pt-2 border-t border-border">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total revenus</span>
            <span className="text-lg font-semibold text-emerald-500">
              {(salaireNet + autresRevenus).toLocaleString("fr-FR")} €
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
