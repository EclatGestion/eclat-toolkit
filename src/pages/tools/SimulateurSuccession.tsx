import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InputSlider } from "@/components/simulators/interets-composes/InputSlider";
import { SuccessionDonutChart } from "@/components/simulators/succession/SuccessionDonutChart";
import { TierLock } from "@/components/premium/TierLock";
import { RecommendedProducts } from "@/components/academy/RecommendedProducts";
import { SaveSimulationButton } from "@/components/simulators/SaveSimulationButton";
import { ArrowLeft, Minus, Plus, AlertTriangle, Shield, Users, Landmark } from "lucide-react";
import { Label } from "@/components/ui/label";

// Constantes fiscales 2024/2025
const ABATTEMENT_LIGNE_DIRECTE = 100_000;
const ABATTEMENT_AV_PAR_BENEFICIAIRE = 152_500;

// Barème progressif des droits de succession en ligne directe
const BAREME_SUCCESSION = [
  { min: 0, max: 8072, rate: 0.05 },
  { min: 8072, max: 12109, rate: 0.10 },
  { min: 12109, max: 15932, rate: 0.15 },
  { min: 15932, max: 552324, rate: 0.20 },
  { min: 552324, max: 902838, rate: 0.30 },
  { min: 902838, max: 1805677, rate: 0.40 },
  { min: 1805677, max: Infinity, rate: 0.45 },
];

// Calcul des droits de succession pour une part taxable donnée
function calculateDroitsSuccession(partTaxable: number): number {
  if (partTaxable <= 0) return 0;
  
  let droits = 0;
  let remainingAmount = partTaxable;

  for (const tranche of BAREME_SUCCESSION) {
    if (remainingAmount <= 0) break;
    
    const trancheSize = tranche.max - tranche.min;
    const amountInTranche = Math.min(remainingAmount, trancheSize);
    droits += amountInTranche * tranche.rate;
    remainingAmount -= amountInTranche;
  }

  return Math.round(droits);
}

export default function SimulateurSuccession() {
  const navigate = useNavigate();
  
  // States
  const [patrimoine, setPatrimoine] = useState(400000);
  const [nombreEnfants, setNombreEnfants] = useState(2);
  const [assuranceVieActif, setAssuranceVieActif] = useState(false);
  const [montantAssuranceVie, setMontantAssuranceVie] = useState(150000);

  // Calculs
  const results = useMemo(() => {
    // Sans Assurance-Vie
    const partParEnfant = patrimoine / nombreEnfants;
    const partTaxableSansAV = Math.max(0, partParEnfant - ABATTEMENT_LIGNE_DIRECTE);
    const droitsParEnfantSansAV = calculateDroitsSuccession(partTaxableSansAV);
    const droitsTotauxSansAV = droitsParEnfantSansAV * nombreEnfants;
    const netEnfantsSansAV = patrimoine - droitsTotauxSansAV;

    // Avec Assurance-Vie
    const plafondAV = ABATTEMENT_AV_PAR_BENEFICIAIRE * nombreEnfants;
    const montantAVEffectif = Math.min(montantAssuranceVie, plafondAV);
    const actifSuccessoralReduit = patrimoine - montantAVEffectif;
    const partParEnfantAvecAV = actifSuccessoralReduit / nombreEnfants;
    const partTaxableAvecAV = Math.max(0, partParEnfantAvecAV - ABATTEMENT_LIGNE_DIRECTE);
    const droitsParEnfantAvecAV = calculateDroitsSuccession(partTaxableAvecAV);
    const droitsTotauxAvecAV = droitsParEnfantAvecAV * nombreEnfants;
    const netEnfantsAvecAV = patrimoine - droitsTotauxAvecAV;

    const economie = droitsTotauxSansAV - droitsTotauxAvecAV;

    return {
      sansAV: {
        partParEnfant,
        partTaxable: partTaxableSansAV,
        droitsParEnfant: droitsParEnfantSansAV,
        droitsTotaux: droitsTotauxSansAV,
        netEnfants: netEnfantsSansAV,
      },
      avecAV: {
        montantAVEffectif,
        plafondAV,
        actifSuccessoralReduit,
        partParEnfant: partParEnfantAvecAV,
        partTaxable: partTaxableAvecAV,
        droitsParEnfant: droitsParEnfantAvecAV,
        droitsTotaux: droitsTotauxAvecAV,
        netEnfants: netEnfantsAvecAV,
      },
      economie,
    };
  }, [patrimoine, nombreEnfants, montantAssuranceVie]);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(value);

  // Résultats à afficher selon l'option AV
  const currentResults = assuranceVieActif ? results.avecAV : results.sansAV;

  return (
    <MainLayout title="Simulateur de Succession">
      <TierLock requiredTier="expert" featureName="Simulateur de Droits de Succession" variant="section">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate("/catalogue")}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Droits de Succession</h1>
                <p className="text-muted-foreground">Transmission aux enfants (ligne directe)</p>
              </div>
            </div>
            <SaveSimulationButton
              toolType="simulateur-succession"
              toolLabel="Simulateur Succession"
              parameters={{
                patrimoine,
                nombreEnfants,
                assuranceVieActif,
                montantAssuranceVie,
              }}
              results={{
                droitsTotaux: currentResults.droitsTotaux,
                netEnfants: currentResults.netEnfants,
                economie: results.economie,
                partParEnfant: currentResults.partParEnfant,
                droitsParEnfant: currentResults.droitsParEnfant,
              }}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Colonne gauche - Inputs */}
            <div className="space-y-4">
              {/* Patrimoine */}
              <Card className="rounded-2xl shadow-md border-0 bg-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Landmark className="h-5 w-5 text-primary" />
                    Patrimoine à transmettre
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <InputSlider
                    label="Patrimoine net"
                    value={patrimoine}
                    onChange={setPatrimoine}
                    min={0}
                    max={2000000}
                    step={10000}
                    unit="€"
                  />
                </CardContent>
              </Card>

              {/* Nombre d'enfants */}
              <Card className="rounded-2xl shadow-md border-0 bg-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Users className="h-5 w-5 text-success" />
                    Héritiers (enfants)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm text-muted-foreground">Nombre d'enfants</Label>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9 rounded-xl"
                        onClick={() => setNombreEnfants(Math.max(1, nombreEnfants - 1))}
                        disabled={nombreEnfants <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center text-xl font-bold text-foreground">
                        {nombreEnfants}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9 rounded-xl"
                        onClick={() => setNombreEnfants(nombreEnfants + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Abattement de {formatCurrency(ABATTEMENT_LIGNE_DIRECTE)} par enfant
                  </p>
                </CardContent>
              </Card>

              {/* Bouclier Fiscal - Assurance-Vie */}
              <Card className="rounded-2xl shadow-md border-0 bg-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    Bouclier Fiscal - Assurance-Vie
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Optimiser avec l'Assurance-Vie</Label>
                      <p className="text-xs text-muted-foreground">
                        Versements avant 70 ans = hors succession
                      </p>
                    </div>
                    <Switch
                      checked={assuranceVieActif}
                      onCheckedChange={setAssuranceVieActif}
                    />
                  </div>

                  {assuranceVieActif && (
                    <div className="pt-2 border-t border-border">
                      <InputSlider
                        label="Montant en Assurance-Vie"
                        value={montantAssuranceVie}
                        onChange={setMontantAssuranceVie}
                        min={0}
                        max={Math.min(patrimoine, results.avecAV.plafondAV)}
                        step={5000}
                        unit="€"
                      />
                      <p className="text-xs text-muted-foreground mt-2">
                        Plafond optimal : {formatCurrency(results.avecAV.plafondAV)} ({formatCurrency(ABATTEMENT_AV_PAR_BENEFICIAIRE)} × {nombreEnfants} enfants)
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Colonne droite - Résultats */}
            <div className="space-y-4">
              {/* Donut Chart */}
              <Card className="rounded-2xl shadow-md border-0 bg-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold">Répartition du patrimoine</CardTitle>
                </CardHeader>
                <CardContent>
                  <SuccessionDonutChart
                    netEnfants={currentResults.netEnfants}
                    droitsSuccession={currentResults.droitsTotaux}
                  />
                </CardContent>
              </Card>

              {/* Détail par enfant */}
              <Card className="rounded-2xl shadow-md border-0 bg-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold">Détail par enfant</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Part brute</p>
                      <p className="font-semibold text-foreground">{formatCurrency(currentResults.partParEnfant)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Abattement</p>
                      <p className="font-semibold text-success">- {formatCurrency(ABATTEMENT_LIGNE_DIRECTE)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Part taxable</p>
                      <p className="font-semibold text-foreground">{formatCurrency(currentResults.partTaxable)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Droits à payer</p>
                      <p className="font-semibold text-destructive">{formatCurrency(currentResults.droitsParEnfant)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Comparateur (si AV activé) */}
              {assuranceVieActif && results.economie > 0 && (
                <Card className="rounded-2xl shadow-md border-0 bg-gradient-to-br from-success/10 to-primary/10">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-semibold text-foreground">Comparaison</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Sans préparation</span>
                        <span className="font-semibold text-destructive">{formatCurrency(results.sansAV.droitsTotaux)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Avec Assurance-Vie</span>
                        <span className="font-semibold text-success">{formatCurrency(results.avecAV.droitsTotaux)}</span>
                      </div>
                      <div className="pt-3 border-t border-border">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-foreground">Héritage sauvegardé</span>
                          <span className="text-xl font-bold text-primary">{formatCurrency(results.economie)}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Message pédagogique */}
              {currentResults.droitsTotaux > 10000 && (
                <Card className="rounded-2xl shadow-md border-0 bg-warning/10 border-l-4 border-l-warning">
                  <CardContent className="pt-4">
                    <div className="flex gap-3">
                      <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-foreground">
                        <p className="font-medium mb-1">Important à savoir</p>
                        <p>
                          Vos enfants devront payer {formatCurrency(currentResults.droitsTotaux)} dans les 6 mois suivant le décès, 
                          souvent en vendant un bien immobilier. L'Assurance-Vie permet d'anticiper ces frais et de transmettre 
                          jusqu'à {formatCurrency(ABATTEMENT_AV_PAR_BENEFICIAIRE)} par bénéficiaire en franchise d'impôt.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Produits recommandés */}
          <RecommendedProducts 
            productIds={["assurance-vie"]} 
            title="Produit recommandé pour optimiser votre transmission" 
          />
        </div>
      </TierLock>
    </MainLayout>
  );
}
