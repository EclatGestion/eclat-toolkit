import { useState, useMemo } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ArrowLeft, User, Users, Minus, Plus, TrendingDown, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { InputSlider } from "@/components/simulators/interets-composes/InputSlider";
import { useAnimatedCounter } from "@/hooks/useAnimatedCounter";
import { TMIGauge } from "@/components/simulators/ir/TMIGauge";

// Barème 2025 officiel
const TAX_BRACKETS = [
  { min: 0, max: 11497, rate: 0 },
  { min: 11498, max: 29315, rate: 0.11 },
  { min: 29316, max: 83823, rate: 0.30 },
  { min: 83824, max: 180294, rate: 0.41 },
  { min: 180295, max: Infinity, rate: 0.45 },
];

// Calcul du nombre de parts
function calculateParts(isCouple: boolean, children: number): number {
  let parts = isCouple ? 2 : 1;
  if (children >= 1) parts += 0.5;
  if (children >= 2) parts += 0.5;
  if (children >= 3) parts += children - 2; // 1 part entière par enfant à partir du 3ème
  return parts;
}

// Calcul de l'impôt progressif
function calculateTax(revenuImposable: number, parts: number): { tax: number; tmi: number } {
  const quotient = revenuImposable / parts;
  let taxPerPart = 0;
  let tmi = 0;

  for (const bracket of TAX_BRACKETS) {
    if (quotient > bracket.min) {
      const taxableInBracket = Math.min(quotient, bracket.max) - bracket.min;
      taxPerPart += taxableInBracket * bracket.rate;
      if (quotient > bracket.min) {
        tmi = bracket.rate * 100;
      }
    }
  }

  return {
    tax: Math.round(taxPerPart * parts),
    tmi,
  };
}

export default function SimulateurIR() {
  const navigate = useNavigate();
  
  // States
  const [revenuNet, setRevenuNet] = useState(60000);
  const [isCouple, setIsCouple] = useState(false);
  const [children, setChildren] = useState(0);
  const [defiscalisation, setDefiscalisation] = useState(false);
  const [montantInvesti, setMontantInvesti] = useState(5000);

  // Calculs
  const parts = useMemo(() => calculateParts(isCouple, children), [isCouple, children]);
  
  const resultatInitial = useMemo(() => calculateTax(revenuNet, parts), [revenuNet, parts]);
  
  const resultatOptimise = useMemo(() => {
    if (!defiscalisation) return resultatInitial;
    const revenuReduit = Math.max(0, revenuNet - montantInvesti);
    return calculateTax(revenuReduit, parts);
  }, [revenuNet, parts, defiscalisation, montantInvesti, resultatInitial]);

  const economie = resultatInitial.tax - resultatOptimise.tax;

  // Animated values
  const animatedTaxInitial = useAnimatedCounter(resultatInitial.tax);
  const animatedTaxOptimise = useAnimatedCounter(resultatOptimise.tax);
  const animatedEconomie = useAnimatedCounter(economie);

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(value);

  return (
    <MainLayout title="Simulateur Impôt sur le Revenu 2025">
      <div className="max-w-6xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate("/catalogue")}
          className="mb-6 rounded-2xl hover:bg-muted"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour au catalogue
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Colonne Gauche - Inputs */}
          <div className="space-y-6">
            {/* Revenus */}
            <div className="bg-card rounded-3xl p-6 shadow-card">
              <h3 className="text-lg font-semibold text-foreground mb-4">Vos revenus</h3>
              <InputSlider
                label="Revenu Net Imposable (Foyer)"
                value={revenuNet}
                onChange={setRevenuNet}
                min={0}
                max={250000}
                step={1000}
                unit="€"
              />
            </div>

            {/* Situation Familiale */}
            <div className="bg-card rounded-3xl p-6 shadow-card">
              <h3 className="text-lg font-semibold text-foreground mb-4">Situation familiale</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <button
                  onClick={() => setIsCouple(false)}
                  className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                    !isCouple 
                      ? "border-primary bg-primary/10 text-primary" 
                      : "border-border bg-muted/30 text-muted-foreground hover:border-primary/50"
                  }`}
                >
                  <User className="w-8 h-8" />
                  <span className="font-medium">Célibataire</span>
                  <span className="text-xs opacity-70">1 part</span>
                </button>
                <button
                  onClick={() => setIsCouple(true)}
                  className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                    isCouple 
                      ? "border-primary bg-primary/10 text-primary" 
                      : "border-border bg-muted/30 text-muted-foreground hover:border-primary/50"
                  }`}
                >
                  <Users className="w-8 h-8" />
                  <span className="font-medium">Couple</span>
                  <span className="text-xs opacity-70">2 parts</span>
                </button>
              </div>

              {/* Compteur enfants */}
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Nombre d'enfants</Label>
                  <p className="text-xs text-muted-foreground">
                    +0.5 part (1er/2ème) puis +1 part
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full h-10 w-10"
                    onClick={() => setChildren(Math.max(0, children - 1))}
                    disabled={children === 0}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="text-2xl font-bold w-8 text-center">{children}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full h-10 w-10"
                    onClick={() => setChildren(children + 1)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="mt-4 p-3 bg-muted/50 rounded-xl text-sm text-muted-foreground text-center">
                Quotient familial : <span className="font-semibold text-foreground">{parts} part{parts > 1 ? "s" : ""}</span>
              </div>
            </div>

            {/* Défiscalisation */}
            <div className="bg-card rounded-3xl p-6 shadow-card">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Levier Défiscalisation</h3>
                  <p className="text-sm text-muted-foreground">PER, Girardin, FCPI...</p>
                </div>
                <Switch
                  checked={defiscalisation}
                  onCheckedChange={setDefiscalisation}
                />
              </div>

              {defiscalisation && (
                <div className="pt-4 border-t border-border">
                  <InputSlider
                    label="Montant investi (déductible)"
                    value={montantInvesti}
                    onChange={setMontantInvesti}
                    min={0}
                    max={30000}
                    step={500}
                    unit="€"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Ce montant sera déduit de votre revenu imposable
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Colonne Droite - Résultats */}
          <div className="space-y-6">
            {/* TMI Gauge */}
            <div className="bg-card rounded-3xl p-6 shadow-card">
              <h3 className="text-lg font-semibold text-foreground mb-4">Tranche Marginale d'Imposition</h3>
              <TMIGauge tmi={defiscalisation ? resultatOptimise.tmi : resultatInitial.tmi} />
              
              {(defiscalisation ? resultatOptimise.tmi : resultatInitial.tmi) >= 30 && (
                <div className="mt-4 flex items-center gap-2 p-3 bg-amber-500/10 text-amber-600 rounded-xl text-sm">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>Niveau d'imposition élevé - Des solutions existent !</span>
                </div>
              )}
            </div>

            {/* Comparateur */}
            <div className="bg-card rounded-3xl p-6 shadow-card">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                {defiscalisation ? "Comparaison" : "Votre impôt"}
              </h3>

              {defiscalisation ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-red-500/10 rounded-2xl text-center">
                      <p className="text-sm text-muted-foreground mb-1">Impôt Initial</p>
                      <p className="text-2xl font-bold text-red-500">
                        {formatCurrency(animatedTaxInitial)}
                      </p>
                    </div>
                    <div className="p-4 bg-emerald-500/10 rounded-2xl text-center">
                      <p className="text-sm text-muted-foreground mb-1">Impôt Optimisé</p>
                      <p className="text-2xl font-bold text-emerald-500">
                        {formatCurrency(animatedTaxOptimise)}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl text-center border border-primary/20">
                    <p className="text-sm text-muted-foreground mb-1">Économie réalisée</p>
                    <p className="text-4xl font-bold text-primary">
                      {formatCurrency(animatedEconomie)}
                    </p>
                    <div className="flex items-center justify-center gap-1 mt-2 text-emerald-500 text-sm">
                      <TrendingDown className="w-4 h-4" />
                      <span>-{((economie / resultatInitial.tax) * 100).toFixed(1)}% d'impôt</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6 bg-muted/50 rounded-2xl text-center">
                  <p className="text-sm text-muted-foreground mb-1">Impôt estimé</p>
                  <p className="text-4xl font-bold text-foreground">
                    {formatCurrency(animatedTaxInitial)}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Taux effectif : {((resultatInitial.tax / revenuNet) * 100).toFixed(1)}%
                  </p>
                </div>
              )}
            </div>

            {/* Détail calcul */}
            <div className="bg-card rounded-3xl p-6 shadow-card">
              <h3 className="text-lg font-semibold text-foreground mb-4">Détail du calcul</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Revenu net imposable</span>
                  <span className="font-medium">{formatCurrency(revenuNet)}</span>
                </div>
                {defiscalisation && (
                  <div className="flex justify-between text-emerald-500">
                    <span>Déduction fiscale</span>
                    <span className="font-medium">-{formatCurrency(montantInvesti)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Nombre de parts</span>
                  <span className="font-medium">{parts}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Quotient familial</span>
                  <span className="font-medium">
                    {formatCurrency((defiscalisation ? revenuNet - montantInvesti : revenuNet) / parts)}
                  </span>
                </div>
                <div className="border-t border-border pt-2 flex justify-between">
                  <span className="text-muted-foreground">TMI</span>
                  <span className="font-bold text-primary">
                    {defiscalisation ? resultatOptimise.tmi : resultatInitial.tmi}%
                  </span>
                </div>
              </div>
            </div>

            {/* CTA */}
            {defiscalisation && economie > 0 && (
              <Button 
                className="w-full py-6 text-lg rounded-2xl bg-primary hover:bg-primary/90"
                onClick={() => {/* Future: ouvrir modal contact */}}
              >
                Comment réduire mon impôt de {formatCurrency(economie)} ?
              </Button>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
