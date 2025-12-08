import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Home, CreditCard, Plus, X } from "lucide-react";
import { InputSlider } from "../interets-composes/InputSlider";

interface Credit {
  id: string;
  label: string;
  montant: number;
}

interface DepensesFixesCardProps {
  loyer: number;
  setLoyer: (value: number) => void;
  credits: Credit[];
  setCredits: (credits: Credit[]) => void;
  abonnements: number;
  setAbonnements: (value: number) => void;
  impots: number;
  setImpots: (value: number) => void;
}

export function DepensesFixesCard({
  loyer,
  setLoyer,
  credits,
  setCredits,
  abonnements,
  setAbonnements,
  impots,
  setImpots,
}: DepensesFixesCardProps) {
  const [newCreditLabel, setNewCreditLabel] = useState("");
  const [newCreditMontant, setNewCreditMontant] = useState("");

  const totalCredits = credits.reduce((sum, c) => sum + c.montant, 0);
  const totalDepensesFixes = loyer + totalCredits + abonnements + impots;

  const addCredit = () => {
    if (newCreditLabel && newCreditMontant) {
      setCredits([
        ...credits,
        {
          id: Date.now().toString(),
          label: newCreditLabel,
          montant: parseFloat(newCreditMontant) || 0,
        },
      ]);
      setNewCreditLabel("");
      setNewCreditMontant("");
    }
  };

  const removeCredit = (id: string) => {
    setCredits(credits.filter((c) => c.id !== id));
  };

  return (
    <Card className="rounded-3xl shadow-card">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-lg">
          <div className="p-2 rounded-xl bg-orange-500/10">
            <Home className="h-5 w-5 text-orange-500" />
          </div>
          Dépenses fixes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <InputSlider
          label="Loyer / Crédit résidence principale"
          value={loyer}
          onChange={setLoyer}
          min={0}
          max={3000}
          step={50}
          unit="€"
        />

        {/* Crédits en cours */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Crédits en cours</span>
          </div>
          
          {credits.map((credit) => (
            <div
              key={credit.id}
              className="flex items-center justify-between p-3 bg-muted/50 rounded-xl"
            >
              <span className="text-sm">{credit.label}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{credit.montant} €</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => removeCredit(credit.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}

          <div className="flex gap-2">
            <Input
              placeholder="Libellé"
              value={newCreditLabel}
              onChange={(e) => setNewCreditLabel(e.target.value)}
              className="flex-1 rounded-xl"
            />
            <Input
              type="number"
              placeholder="Montant"
              value={newCreditMontant}
              onChange={(e) => setNewCreditMontant(e.target.value)}
              className="w-24 rounded-xl"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={addCredit}
              className="rounded-xl"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <InputSlider
          label="Abonnements fixes (téléphone, internet, assurances)"
          value={abonnements}
          onChange={setAbonnements}
          min={0}
          max={500}
          step={10}
          unit="€"
        />

        <InputSlider
          label="Impôts mensualisés"
          value={impots}
          onChange={setImpots}
          min={0}
          max={2000}
          step={50}
          unit="€"
        />

        <div className="pt-2 border-t border-border">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total dépenses fixes</span>
            <span className="text-lg font-semibold text-orange-500">
              {totalDepensesFixes.toLocaleString("fr-FR")} €
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
