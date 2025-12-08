import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag } from "lucide-react";
import { InputSlider } from "../interets-composes/InputSlider";
import { ProfilSelector, type ProfilType } from "./ProfilSelector";

interface DepensesVariablesCardProps {
  depensesVariables: number;
  setDepensesVariables: (value: number) => void;
  profilActif: ProfilType | null;
  setProfilActif: (profil: ProfilType | null) => void;
  useSlider: boolean;
  setUseSlider: (value: boolean) => void;
}

const PROFILS_VALUES: Record<ProfilType, number> = {
  econome: 400,
  standard: 700,
  confort: 1100,
};

export function DepensesVariablesCard({
  depensesVariables,
  setDepensesVariables,
  profilActif,
  setProfilActif,
  useSlider,
  setUseSlider,
}: DepensesVariablesCardProps) {
  const handleProfilChange = (profil: ProfilType) => {
    setProfilActif(profil);
    setDepensesVariables(PROFILS_VALUES[profil]);
    setUseSlider(false);
  };

  const handleSliderChange = (value: number) => {
    setDepensesVariables(value);
    setProfilActif(null);
    setUseSlider(true);
  };

  return (
    <Card className="rounded-3xl shadow-card">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-lg">
          <div className="p-2 rounded-xl bg-purple-500/10">
            <ShoppingBag className="h-5 w-5 text-purple-500" />
          </div>
          Dépenses variables
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Choisissez un profil de dépenses ou définissez un montant personnalisé
          </p>
          
          <ProfilSelector
            profilActif={profilActif}
            onSelect={handleProfilChange}
          />
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">ou</span>
          </div>
        </div>

        <InputSlider
          label="Montant personnalisé"
          value={depensesVariables}
          onChange={handleSliderChange}
          min={0}
          max={3000}
          step={50}
          unit="€"
        />

        <div className="pt-2 border-t border-border">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Dépenses variables</span>
            <span className="text-lg font-semibold text-purple-500">
              {depensesVariables.toLocaleString("fr-FR")} €
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
