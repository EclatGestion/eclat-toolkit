import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, Lightbulb } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { ProfilSelector, type ProfilType } from "./ProfilSelector";

interface DepensesVariablesCardProps {
  depensesVariables: number;
  setDepensesVariables: (value: number) => void;
  profilActif: ProfilType | null;
  setProfilActif: (profil: ProfilType | null) => void;
  useSlider: boolean;
  setUseSlider: (value: boolean) => void;
  revenus?: number;
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
  setUseSlider,
  revenus = 0,
}: DepensesVariablesCardProps) {
  const handleProfilChange = (profil: ProfilType) => {
    setProfilActif(profil);
    setDepensesVariables(PROFILS_VALUES[profil]);
    setUseSlider(false);
  };

  const handleSliderChange = (value: number[]) => {
    setDepensesVariables(value[0]);
    setProfilActif(null);
    setUseSlider(true);
  };

  const pourcentageRevenus = revenus > 0 
    ? Math.round((depensesVariables / revenus) * 100) 
    : null;

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
      <CardContent className="space-y-5">
        {/* Question claire */}
        <p className="text-sm text-muted-foreground">
          Quel est votre style de vie ?
        </p>

        {/* Profils en chips */}
        <ProfilSelector
          profilActif={profilActif}
          onSelect={handleProfilChange}
        />

        {/* Slider d'ajustement */}
        <div className="pt-4 border-t border-border">
          <Label className="text-sm text-muted-foreground">
            Ajustez selon vos habitudes
          </Label>

          <div className="mt-4 px-1">
            <Slider
              value={[depensesVariables]}
              onValueChange={handleSliderChange}
              min={200}
              max={2000}
              step={50}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>200€</span>
              <span>2000€</span>
            </div>
          </div>

          {/* Montant final - grand et centré */}
          <div className="text-center mt-5">
            <span className="text-3xl font-bold text-purple-500">
              {depensesVariables.toLocaleString("fr-FR")} €
            </span>
            <span className="text-sm text-muted-foreground block mt-1">
              par mois
            </span>
          </div>
        </div>

        {/* Insight contextuel */}
        {pourcentageRevenus !== null && pourcentageRevenus > 0 && (
          <div className="flex items-start gap-2 bg-blue-500/10 rounded-xl p-3">
            <Lightbulb className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Cela représente <span className="font-semibold">{pourcentageRevenus}%</span> de vos revenus mensuels
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
