import { useState, useMemo } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Home, Sofa, Lightbulb, TrendingDown, Euro, Building2, Receipt } from "lucide-react";
import { ComparisonBarChart } from "@/components/simulators/lmnp/ComparisonBarChart";
import { PremiumToolLock } from "@/components/premium/PremiumToolLock";
import { RecommendedProducts } from "@/components/academy/RecommendedProducts";

// Constantes fiscales 2025
const PRELEVEMENTS_SOCIAUX = 0.172;
const MICRO_FONCIER_ABATTEMENT = 0.30;
const MICRO_BIC_ABATTEMENT = 0.50;
const AMORTISSEMENT_BATI_PART = 0.85; // 85% du bien est amortissable
const AMORTISSEMENT_BATI_DUREE = 35; // 35 ans
const AMORTISSEMENT_MEUBLES_DUREE = 7; // 7 ans
const PLAFOND_MICRO_FONCIER = 15000;
const PLAFOND_MICRO_BIC = 77700;

interface ResultatLocationNue {
  loyersAnnuels: number;
  baseImposableMicro: number | null;
  baseImposableReel: number;
  baseImposable: number;
  regimeChoisi: "Micro-Foncier" | "Réel";
  impotTotal: number;
  cashflowNet: number;
}

interface ResultatLMNP {
  loyersAnnuels: number;
  baseImposableMicro: number | null;
  baseImposableReel: number;
  baseImposable: number;
  regimeChoisi: "Micro-BIC" | "Réel Simplifié";
  impotTotal: number;
  cashflowNet: number;
  amortissementBati: number;
  amortissementMeubles: number;
  deficitReportable: number;
}

export default function ComparateurLMNP() {
  // Section A: Le Projet
  const [prixBien, setPrixBien] = useState(200000);
  const [montantMeubles, setMontantMeubles] = useState(12000);
  const [loyerMensuel, setLoyerMensuel] = useState(900);
  const [tauxVacance, setTauxVacance] = useState(5);

  // Section B: Les Charges
  const [chargesCopro, setChargesCopro] = useState(1200);
  const [taxeFonciere, setTaxeFonciere] = useState(800);
  const [interetsEmprunt, setInteretsEmprunt] = useState(3500);
  const [assurancePNO, setAssurancePNO] = useState(250);
  const [fraisGestion, setFraisGestion] = useState(0);

  // Section C: Profil Fiscal
  const [tmi, setTmi] = useState(30);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(value);

  // Calcul Location Nue
  const resultatLocationNue = useMemo((): ResultatLocationNue => {
    const loyersAnnuels = loyerMensuel * 12 * (1 - tauxVacance / 100);
    const chargesDeductibles = chargesCopro + taxeFonciere + interetsEmprunt + assurancePNO + fraisGestion;

    // Micro-Foncier (30% abattement si loyers < 15k€)
    const baseImposableMicro = loyersAnnuels <= PLAFOND_MICRO_FONCIER
      ? loyersAnnuels * (1 - MICRO_FONCIER_ABATTEMENT)
      : null;

    // Réel Foncier
    const baseImposableReel = Math.max(0, loyersAnnuels - chargesDeductibles);

    // Choisir le plus avantageux
    const baseImposable = baseImposableMicro !== null
      ? Math.min(baseImposableMicro, baseImposableReel)
      : baseImposableReel;
    const regimeChoisi: "Micro-Foncier" | "Réel" = baseImposable === baseImposableMicro ? "Micro-Foncier" : "Réel";

    // Impôt = TMI + PS
    const impotTotal = baseImposable * (tmi / 100 + PRELEVEMENTS_SOCIAUX);
    const cashflowNet = loyersAnnuels - chargesDeductibles - impotTotal;

    return { loyersAnnuels, baseImposableMicro, baseImposableReel, baseImposable, regimeChoisi, impotTotal, cashflowNet };
  }, [loyerMensuel, tauxVacance, chargesCopro, taxeFonciere, interetsEmprunt, assurancePNO, fraisGestion, tmi]);

  // Calcul LMNP
  const resultatLMNP = useMemo((): ResultatLMNP => {
    const loyersAnnuels = loyerMensuel * 12 * (1 - tauxVacance / 100);
    const chargesDeductibles = chargesCopro + taxeFonciere + interetsEmprunt + assurancePNO + fraisGestion;

    // Micro-BIC (50% abattement si loyers < 77.7k€)
    const baseImposableMicro = loyersAnnuels <= PLAFOND_MICRO_BIC
      ? loyersAnnuels * (1 - MICRO_BIC_ABATTEMENT)
      : null;

    // Amortissements
    const amortissementBati = (prixBien * AMORTISSEMENT_BATI_PART) / AMORTISSEMENT_BATI_DUREE;
    const amortissementMeubles = montantMeubles / AMORTISSEMENT_MEUBLES_DUREE;

    // Réel Simplifié
    const resultatAvantImpot = loyersAnnuels - chargesDeductibles - amortissementBati - amortissementMeubles;
    const deficitReportable = Math.min(0, resultatAvantImpot);
    const baseImposableReel = Math.max(0, resultatAvantImpot);

    // Choisir le plus avantageux
    const baseImposable = baseImposableMicro !== null
      ? Math.min(baseImposableMicro, baseImposableReel)
      : baseImposableReel;
    const regimeChoisi: "Micro-BIC" | "Réel Simplifié" = baseImposable === baseImposableMicro ? "Micro-BIC" : "Réel Simplifié";

    // Impôt
    const impotTotal = baseImposable * (tmi / 100 + PRELEVEMENTS_SOCIAUX);
    const cashflowNet = loyersAnnuels - chargesDeductibles - impotTotal;

    return {
      loyersAnnuels,
      baseImposableMicro,
      baseImposableReel,
      baseImposable,
      regimeChoisi,
      impotTotal,
      cashflowNet,
      amortissementBati,
      amortissementMeubles,
      deficitReportable,
    };
  }, [loyerMensuel, tauxVacance, chargesCopro, taxeFonciere, interetsEmprunt, assurancePNO, fraisGestion, prixBien, montantMeubles, tmi]);

  const economieAnnuelle = resultatLocationNue.impotTotal - resultatLMNP.impotTotal;
  const lmnpGagnant = resultatLMNP.impotTotal < resultatLocationNue.impotTotal;

  return (
    <MainLayout title="Comparateur LMNP vs Location Nue">
      <PremiumToolLock featureName="Comparateur LMNP vs Location Nue" variant="section">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Colonne Gauche: Inputs */}
          <div className="space-y-6">
            {/* Section A: Le Projet */}
            <Card className="rounded-2xl">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Building2 className="w-5 h-5 text-primary" />
                  Le Projet Immobilier
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Prix du bien (FAI)</Label>
                    <span className="text-sm font-semibold text-primary">{formatCurrency(prixBien)}</span>
                  </div>
                  <Slider
                    value={[prixBien]}
                    onValueChange={([v]) => setPrixBien(v)}
                    min={50000}
                    max={1000000}
                    step={5000}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Montant des meubles (si LMNP)</Label>
                    <span className="text-sm font-semibold text-primary">{formatCurrency(montantMeubles)}</span>
                  </div>
                  <Slider
                    value={[montantMeubles]}
                    onValueChange={([v]) => setMontantMeubles(v)}
                    min={0}
                    max={50000}
                    step={500}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Loyer mensuel CC</Label>
                    <span className="text-sm font-semibold text-primary">{formatCurrency(loyerMensuel)}</span>
                  </div>
                  <Slider
                    value={[loyerMensuel]}
                    onValueChange={([v]) => setLoyerMensuel(v)}
                    min={300}
                    max={3000}
                    step={50}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Taux de vacance locative</Label>
                    <span className="text-sm font-semibold text-amber-600">{tauxVacance}%</span>
                  </div>
                  <Slider
                    value={[tauxVacance]}
                    onValueChange={([v]) => setTauxVacance(v)}
                    min={0}
                    max={15}
                    step={1}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Section B: Les Charges */}
            <Card className="rounded-2xl">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Receipt className="w-5 h-5 text-amber-500" />
                  Les Charges Annuelles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs">Charges de copropriété</Label>
                    <Input
                      type="number"
                      value={chargesCopro}
                      onChange={(e) => setChargesCopro(Number(e.target.value))}
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Taxe foncière</Label>
                    <Input
                      type="number"
                      value={taxeFonciere}
                      onChange={(e) => setTaxeFonciere(Number(e.target.value))}
                      className="h-9"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs">Intérêts d'emprunt (annuel)</Label>
                    <Input
                      type="number"
                      value={interetsEmprunt}
                      onChange={(e) => setInteretsEmprunt(Number(e.target.value))}
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Assurance PNO</Label>
                    <Input
                      type="number"
                      value={assurancePNO}
                      onChange={(e) => setAssurancePNO(Number(e.target.value))}
                      className="h-9"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs">Frais de gestion (si agence)</Label>
                  <Input
                    type="number"
                    value={fraisGestion}
                    onChange={(e) => setFraisGestion(Number(e.target.value))}
                    className="h-9"
                    placeholder="0"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Section C: Profil Fiscal */}
            <Card className="rounded-2xl">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Euro className="w-5 h-5 text-emerald-500" />
                  Votre Profil Fiscal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label>Tranche Marginale d'Imposition (TMI)</Label>
                  <Select value={String(tmi)} onValueChange={(v) => setTmi(Number(v))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">0%</SelectItem>
                      <SelectItem value="11">11%</SelectItem>
                      <SelectItem value="30">30%</SelectItem>
                      <SelectItem value="41">41%</SelectItem>
                      <SelectItem value="45">45%</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    + 17,2% de prélèvements sociaux = {tmi + 17.2}% d'imposition totale
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Colonne Droite: Résultats */}
          <div className="space-y-6">
            {/* Graphique Comparatif */}
            <Card className="rounded-2xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Impôt Annuel Comparé</CardTitle>
              </CardHeader>
              <CardContent>
                <ComparisonBarChart
                  locationNue={resultatLocationNue.impotTotal}
                  lmnp={resultatLMNP.impotTotal}
                />
              </CardContent>
            </Card>

            {/* Cartes de Résultats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Carte Location Nue */}
              <Card className="rounded-2xl border-l-4 border-l-primary">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Home className="w-4 h-4 text-primary" />
                    Location Nue
                    <span className="ml-auto text-xs font-normal px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                      {resultatLocationNue.regimeChoisi}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Loyers annuels</span>
                    <span className="font-medium">{formatCurrency(resultatLocationNue.loyersAnnuels)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Base imposable</span>
                    <span className="font-medium">{formatCurrency(resultatLocationNue.baseImposable)}</span>
                  </div>
                  <div className="flex justify-between text-sm border-t pt-2">
                    <span className="text-muted-foreground">Impôt total</span>
                    <span className="font-bold text-destructive">{formatCurrency(resultatLocationNue.impotTotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm border-t pt-2">
                    <span className="text-muted-foreground">Cashflow net</span>
                    <span className="font-semibold">{formatCurrency(resultatLocationNue.cashflowNet)}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Carte LMNP */}
              <Card className={`rounded-2xl border-l-4 ${lmnpGagnant ? "border-l-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20" : "border-l-emerald-500"}`}>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Sofa className="w-4 h-4 text-emerald-500" />
                    LMNP
                    <span className="ml-auto text-xs font-normal px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300">
                      {resultatLMNP.regimeChoisi}
                    </span>
                    {lmnpGagnant && (
                      <span className="px-2 py-0.5 bg-emerald-500 text-white text-xs rounded-full">GAGNANT</span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Loyers annuels</span>
                    <span className="font-medium">{formatCurrency(resultatLMNP.loyersAnnuels)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Base imposable</span>
                    <span className="font-medium">{formatCurrency(resultatLMNP.baseImposable)}</span>
                  </div>
                  <div className="flex justify-between text-sm border-t pt-2">
                    <span className="text-muted-foreground">Impôt total</span>
                    <span className={`font-bold ${resultatLMNP.impotTotal === 0 ? "text-emerald-600" : "text-amber-600"}`}>
                      {formatCurrency(resultatLMNP.impotTotal)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm border-t pt-2">
                    <span className="text-muted-foreground">Cashflow net</span>
                    <span className="font-semibold">{formatCurrency(resultatLMNP.cashflowNet)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Bandeau Conseil */}
            {economieAnnuelle > 500 && (
              <Card className="rounded-2xl bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-950/30 dark:to-blue-950/30 border-0">
                <CardContent className="py-4">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-foreground">
                        En passant en meublé, vous économisez {formatCurrency(economieAnnuelle)} d'impôts par an
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Soit environ {formatCurrency(economieAnnuelle * 10)} sur 10 ans grâce aux amortissements
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Déficit reportable */}
            {resultatLMNP.deficitReportable < 0 && (
              <Card className="rounded-2xl border-amber-200 bg-amber-50/50 dark:bg-amber-950/20">
                <CardContent className="py-4">
                  <div className="flex items-start gap-3">
                    <TrendingDown className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground text-sm">
                        Déficit LMNP reportable : {formatCurrency(Math.abs(resultatLMNP.deficitReportable))}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Ce déficit est reportable pendant 10 ans sur vos futurs revenus BIC meublés
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tableau Amortissements */}
            <Card className="rounded-2xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Détail des amortissements LMNP</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell className="text-sm">Amortissement bâti (85% sur 35 ans)</TableCell>
                      <TableCell className="text-right font-semibold text-emerald-600">
                        - {formatCurrency(resultatLMNP.amortissementBati)}/an
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-sm">Amortissement meubles (100% sur 7 ans)</TableCell>
                      <TableCell className="text-right font-semibold text-emerald-600">
                        - {formatCurrency(resultatLMNP.amortissementMeubles)}/an
                      </TableCell>
                    </TableRow>
                    <TableRow className="border-t-2">
                      <TableCell className="font-medium">Total déductible</TableCell>
                      <TableCell className="text-right font-bold text-emerald-600">
                        - {formatCurrency(resultatLMNP.amortissementBati + resultatLMNP.amortissementMeubles)}/an
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Produits Recommandés */}
        <div className="mt-8">
          <RecommendedProducts
            productIds={["scpi", "crowdfunding-immobilier"]}
            title="Diversifiez votre investissement immobilier"
          />
        </div>
      </PremiumToolLock>
    </MainLayout>
  );
}
