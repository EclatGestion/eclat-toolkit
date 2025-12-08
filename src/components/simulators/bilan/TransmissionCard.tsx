import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Baby, Gift, Shield } from "lucide-react";

interface TransmissionCardProps {
  situationFamiliale: string;
  setSituationFamiliale: (v: string) => void;
  nombreEnfants: number;
  setNombreEnfants: (v: number) => void;
  donationsRealisees: number;
  setDonationsRealisees: (v: number) => void;
  assuranceVieBeneficiaire: boolean;
  setAssuranceVieBeneficiaire: (v: boolean) => void;
  patrimoineTotal: number;
}

const SITUATIONS = [
  { value: "celibataire", label: "Célibataire" },
  { value: "marie", label: "Marié(e)" },
  { value: "pacse", label: "Pacsé(e)" },
  { value: "divorce", label: "Divorcé(e)" },
  { value: "veuf", label: "Veuf/Veuve" },
];

export function TransmissionCard({
  situationFamiliale,
  setSituationFamiliale,
  nombreEnfants,
  setNombreEnfants,
  donationsRealisees,
  setDonationsRealisees,
  assuranceVieBeneficiaire,
  setAssuranceVieBeneficiaire,
  patrimoineTotal,
}: TransmissionCardProps) {
  // Calcul simplifié des droits de succession
  const calculerDroitsSuccession = () => {
    if (nombreEnfants === 0) return 0;
    
    const abattementParEnfant = 100000;
    const partParEnfant = patrimoineTotal / nombreEnfants;
    const baseImposableParEnfant = Math.max(0, partParEnfant - abattementParEnfant - (donationsRealisees / nombreEnfants));
    
    // Barème simplifié
    const calculerImpotParEnfant = (base: number) => {
      if (base <= 8072) return base * 0.05;
      if (base <= 12109) return 8072 * 0.05 + (base - 8072) * 0.10;
      if (base <= 15932) return 8072 * 0.05 + 4037 * 0.10 + (base - 12109) * 0.15;
      if (base <= 552324) return 8072 * 0.05 + 4037 * 0.10 + 3823 * 0.15 + (base - 15932) * 0.20;
      return 8072 * 0.05 + 4037 * 0.10 + 3823 * 0.15 + 536392 * 0.20 + (base - 552324) * 0.30;
    };

    return Math.round(calculerImpotParEnfant(baseImposableParEnfant) * nombreEnfants);
  };

  const droitsSuccession = calculerDroitsSuccession();
  const partNette = patrimoineTotal - droitsSuccession;

  return (
    <Card className="border-0 shadow-lg bg-card">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-lg">
          <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
            <Users className="w-5 h-5 text-violet-500" />
          </div>
          Transmission & Protection
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Situation familiale */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              Situation familiale
            </Label>
            <Select value={situationFamiliale} onValueChange={setSituationFamiliale}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SITUATIONS.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Nombre d'enfants */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <Baby className="w-4 h-4 text-muted-foreground" />
              Nombre d'enfants
            </Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={nombreEnfants}
                onChange={(e) => setNombreEnfants(Math.max(0, Number(e.target.value)))}
                className="w-20 text-right"
                min={0}
                max={10}
              />
            </div>
          </div>
          <Slider
            value={[nombreEnfants]}
            onValueChange={([v]) => setNombreEnfants(v)}
            min={0}
            max={10}
            step={1}
            className="py-2"
          />
        </div>

        {/* Donations déjà réalisées */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <Gift className="w-4 h-4 text-muted-foreground" />
              Donations déjà réalisées
            </Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={donationsRealisees}
                onChange={(e) => setDonationsRealisees(Number(e.target.value))}
                className="w-32 text-right"
              />
              <span className="text-muted-foreground">€</span>
            </div>
          </div>
          <Slider
            value={[donationsRealisees]}
            onValueChange={([v]) => setDonationsRealisees(v)}
            min={0}
            max={500000}
            step={10000}
            className="py-2"
          />
        </div>

        {/* Assurance-vie avec bénéficiaire */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
          <div className="flex items-center gap-3">
            <Shield className={`w-5 h-5 ${assuranceVieBeneficiaire ? 'text-emerald-500' : 'text-muted-foreground'}`} />
            <span className="text-sm">AV avec clause bénéficiaire</span>
          </div>
          <Switch checked={assuranceVieBeneficiaire} onCheckedChange={setAssuranceVieBeneficiaire} />
        </div>

        {/* Estimation succession */}
        {nombreEnfants > 0 && (
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
            <div className="text-center p-3 rounded-xl bg-muted/50">
              <div className="text-xs text-muted-foreground mb-1">Droits succession estimés</div>
              <div className="text-xl font-bold text-red-500">
                {droitsSuccession.toLocaleString('fr-FR')} €
              </div>
            </div>
            <div className="text-center p-3 rounded-xl bg-muted/50">
              <div className="text-xs text-muted-foreground mb-1">Part nette transmise</div>
              <div className="text-xl font-bold text-emerald-500">
                {partNette.toLocaleString('fr-FR')} €
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
