import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Home, Building2, Banknote, CreditCard } from "lucide-react";

interface ImmobilierCardProps {
  residencePrincipale: number;
  setResidencePrincipale: (v: number) => void;
  immobilierLocatif: number;
  setImmobilierLocatif: (v: number) => void;
  loyersPercus: number;
  setLoyersPercus: (v: number) => void;
  creditsImmo: number;
  setCreditsImmo: (v: number) => void;
}

export function ImmobilierCard({
  residencePrincipale,
  setResidencePrincipale,
  immobilierLocatif,
  setImmobilierLocatif,
  loyersPercus,
  setLoyersPercus,
  creditsImmo,
  setCreditsImmo,
}: ImmobilierCardProps) {
  const totalImmobilier = residencePrincipale + immobilierLocatif;
  const rendementLocatif = immobilierLocatif > 0 
    ? ((loyersPercus * 12) / immobilierLocatif * 100).toFixed(1) 
    : "0";
  const valeurNette = totalImmobilier - creditsImmo;

  return (
    <Card className="border-0 shadow-lg bg-card">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-lg">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
            <Home className="w-5 h-5 text-amber-500" />
          </div>
          Immobilier
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Résidence principale */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <Home className="w-4 h-4 text-muted-foreground" />
              Résidence principale
            </Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={residencePrincipale}
                onChange={(e) => setResidencePrincipale(Number(e.target.value))}
                className="w-36 text-right"
              />
              <span className="text-muted-foreground">€</span>
            </div>
          </div>
          <Slider
            value={[residencePrincipale]}
            onValueChange={([v]) => setResidencePrincipale(v)}
            min={0}
            max={2000000}
            step={10000}
            className="py-2"
          />
        </div>

        {/* Immobilier locatif */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-muted-foreground" />
              Immobilier locatif
            </Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={immobilierLocatif}
                onChange={(e) => setImmobilierLocatif(Number(e.target.value))}
                className="w-36 text-right"
              />
              <span className="text-muted-foreground">€</span>
            </div>
          </div>
          <Slider
            value={[immobilierLocatif]}
            onValueChange={([v]) => setImmobilierLocatif(v)}
            min={0}
            max={2000000}
            step={10000}
            className="py-2"
          />
        </div>

        {/* Loyers perçus */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <Banknote className="w-4 h-4 text-muted-foreground" />
              Loyers perçus (mensuel)
            </Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={loyersPercus}
                onChange={(e) => setLoyersPercus(Number(e.target.value))}
                className="w-28 text-right"
              />
              <span className="text-muted-foreground">€</span>
            </div>
          </div>
          <Slider
            value={[loyersPercus]}
            onValueChange={([v]) => setLoyersPercus(v)}
            min={0}
            max={10000}
            step={100}
            className="py-2"
          />
        </div>

        {/* Crédits immobiliers */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-muted-foreground" />
              Crédits immobiliers restants
            </Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={creditsImmo}
                onChange={(e) => setCreditsImmo(Number(e.target.value))}
                className="w-36 text-right"
              />
              <span className="text-muted-foreground">€</span>
            </div>
          </div>
          <Slider
            value={[creditsImmo]}
            onValueChange={([v]) => setCreditsImmo(v)}
            min={0}
            max={1500000}
            step={10000}
            className="py-2"
          />
        </div>

        {/* Indicateurs */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
          <div className="text-center p-3 rounded-xl bg-muted/50">
            <div className="text-xs text-muted-foreground mb-1">Valeur nette immo</div>
            <div className="text-xl font-bold text-foreground">
              {valeurNette.toLocaleString('fr-FR')} €
            </div>
          </div>
          <div className="text-center p-3 rounded-xl bg-muted/50">
            <div className="text-xs text-muted-foreground mb-1">Rendement locatif</div>
            <div className={`text-xl font-bold ${parseFloat(rendementLocatif) >= 5 ? 'text-emerald-500' : parseFloat(rendementLocatif) >= 3 ? 'text-amber-500' : 'text-muted-foreground'}`}>
              {rendementLocatif}%
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
