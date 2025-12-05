import { useState, useMemo } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Home, Sofa, Lightbulb, TrendingDown, Euro, Building2, Receipt, Hammer, MapPin, AlertTriangle, TrendingUp, Scale, CheckCircle } from "lucide-react";
import { ComparisonBarChart } from "@/components/simulators/lmnp/ComparisonBarChart";
import { PremiumToolLock } from "@/components/premium/PremiumToolLock";
import { RecommendedProducts } from "@/components/academy/RecommendedProducts";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";

// Constantes fiscales 2025
const PRELEVEMENTS_SOCIAUX = 0.172;
const MICRO_FONCIER_ABATTEMENT = 0.30;
const AMORTISSEMENT_BATI_PART = 0.85; // 85% du bien est amortissable
const AMORTISSEMENT_BATI_DUREE = 35; // 35 ans
const AMORTISSEMENT_MEUBLES_DUREE = 7; // 7 ans
const AMORTISSEMENT_TRAVAUX_DUREE = 10; // 10 ans pour travaux d'amélioration
const PLAFOND_MICRO_FONCIER = 15000;
const PLAFOND_DEFICIT_FONCIER = 10700;
const PLAFOND_DEFICIT_FONCIER_ENERGIE = 21400; // Doublé si travaux énergétiques

// Micro-BIC selon type de location (Loi Le Meur 2025)
const MICRO_BIC_LONGUE_DUREE = { abattement: 0.50, plafond: 77700 };
const MICRO_BIC_TOURISME_CLASSE = { abattement: 0.50, plafond: 77700 };
const MICRO_BIC_TOURISME_NON_CLASSE = { abattement: 0.30, plafond: 15000 }; // Loi Le Meur 2025

// Seuil LMP et cotisations
const SEUIL_LMP_RECETTES = 23000;
const TAUX_COTISATIONS_LMP = 0.40; // ~40% de cotisations URSSAF

// Plus-value immobilière
const IMPOT_PLUS_VALUE = 0.19; // 19% d'IR sur plus-value

interface ResultatPlusValue {
  plusValueBruteNue: number;
  plusValueBruteLMNP: number;
  totalAmortissementsReintegres: number;
  abattementDureeIR: number;
  abattementDureePS: number;
  impotPlusValueNue: number;
  impotPlusValueLMNP: number;
  exoneration: { applicable: boolean; raison: string };
}

interface ResultatLocationNue {
  loyersAnnuels: number;
  chargesDeductibles: number;
  travauxDeductibles: number;
  baseImposableMicro: number | null;
  baseImposableReel: number;
  baseImposable: number;
  regimeChoisi: "Micro-Foncier" | "Réel";
  impotTotal: number;
  cashflowNet: number;
  deficitFoncier: number;
  deficitImputeRevenuGlobal: number;
  economieDeficitFoncier: number;
}

interface ResultatLMNP {
  loyersAnnuels: number;
  chargesDeductibles: number;
  baseImposableMicro: number | null;
  baseImposableReel: number;
  baseImposable: number;
  regimeChoisi: "Micro-BIC" | "Réel Simplifié";
  impotTotal: number;
  cashflowNet: number;
  amortissementBati: number;
  amortissementMeubles: number;
  amortissementTravaux: number;
  deficitReportable: number;
  cfeAnnuel: number;
  alerteLMP: boolean;
  tauxSocialApplique: number;
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

  // Section D: Travaux
  const [montantTravaux, setMontantTravaux] = useState(0);
  const [typeTravaux, setTypeTravaux] = useState<"entretien" | "amelioration" | "energie">("entretien");

  // Section E: Type de Location (Loi Le Meur 2025)
  const [typeLocation, setTypeLocation] = useState<"longue_duree" | "tourisme_classe" | "tourisme_non_classe">("longue_duree");

  // Section F: CFE et LMP
  const [cfe, setCfe] = useState(500);
  const [revenusFoyer, setRevenusFoyer] = useState(50000);

  // Section G: Simulation Plus-Value
  const [simulerPlusValue, setSimulerPlusValue] = useState(false);
  const [dureeDetention, setDureeDetention] = useState(10);
  const [prixRevente, setPrixRevente] = useState(250000);
  const [fraisNotaire, setFraisNotaire] = useState(16000);
  const [estResidencePrincipale, setEstResidencePrincipale] = useState(false);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(value);

  // Calcul Location Nue
  const resultatLocationNue = useMemo((): ResultatLocationNue => {
    const loyersAnnuels = loyerMensuel * 12 * (1 - tauxVacance / 100);
    const chargesDeductibles = chargesCopro + taxeFonciere + interetsEmprunt + assurancePNO + fraisGestion;
    
    // Travaux: entretien et énergie sont déductibles immédiatement en foncier
    const travauxDeductibles = typeTravaux !== "amelioration" ? montantTravaux : 0;

    // Micro-Foncier (30% abattement si loyers < 15k€)
    const baseImposableMicro = loyersAnnuels <= PLAFOND_MICRO_FONCIER
      ? loyersAnnuels * (1 - MICRO_FONCIER_ABATTEMENT)
      : null;

    // Réel Foncier (peut être négatif = déficit)
    const resultatFoncier = loyersAnnuels - chargesDeductibles - travauxDeductibles;
    const baseImposableReel = Math.max(0, resultatFoncier);
    
    // Déficit foncier
    let deficitFoncier = 0;
    let deficitImputeRevenuGlobal = 0;
    let economieDeficitFoncier = 0;
    
    if (resultatFoncier < 0) {
      deficitFoncier = Math.abs(resultatFoncier);
      const plafond = typeTravaux === "energie" ? PLAFOND_DEFICIT_FONCIER_ENERGIE : PLAFOND_DEFICIT_FONCIER;
      deficitImputeRevenuGlobal = Math.min(deficitFoncier, plafond);
      economieDeficitFoncier = deficitImputeRevenuGlobal * (tmi / 100);
    }

    // Choisir le plus avantageux (si pas de déficit)
    let baseImposable: number;
    let regimeChoisi: "Micro-Foncier" | "Réel";
    
    if (deficitFoncier > 0) {
      baseImposable = 0;
      regimeChoisi = "Réel";
    } else if (baseImposableMicro !== null && baseImposableMicro < baseImposableReel) {
      baseImposable = baseImposableMicro;
      regimeChoisi = "Micro-Foncier";
    } else {
      baseImposable = baseImposableReel;
      regimeChoisi = "Réel";
    }

    // Impôt final (moins économie déficit foncier si applicable)
    const impotBrut = baseImposable * (tmi / 100 + PRELEVEMENTS_SOCIAUX);
    const impotTotal = Math.max(0, impotBrut - economieDeficitFoncier);
    const cashflowNet = loyersAnnuels - chargesDeductibles - travauxDeductibles - impotTotal;

    return { 
      loyersAnnuels,
      chargesDeductibles,
      travauxDeductibles,
      baseImposableMicro, 
      baseImposableReel, 
      baseImposable, 
      regimeChoisi, 
      impotTotal,
      cashflowNet,
      deficitFoncier,
      deficitImputeRevenuGlobal,
      economieDeficitFoncier
    };
  }, [loyerMensuel, tauxVacance, chargesCopro, taxeFonciere, interetsEmprunt, assurancePNO, fraisGestion, tmi, montantTravaux, typeTravaux]);

  // Calcul LMNP
  const resultatLMNP = useMemo((): ResultatLMNP => {
    const loyersAnnuels = loyerMensuel * 12 * (1 - tauxVacance / 100);
    const cfeAnnuel = cfe;
    
    // Alerte LMP: > 23k€ ET > revenus pro du foyer
    const alerteLMP = loyersAnnuels > SEUIL_LMP_RECETTES && loyersAnnuels > revenusFoyer;
    
    // Taux social selon LMP ou LMNP
    const tauxSocialApplique = alerteLMP ? TAUX_COTISATIONS_LMP : PRELEVEMENTS_SOCIAUX;
    
    // Charges déductibles (incluant CFE pour LMNP)
    const chargesDeductibles = chargesCopro + taxeFonciere + interetsEmprunt + assurancePNO + fraisGestion + cfeAnnuel;

    // Micro-BIC selon type de location (Loi Le Meur 2025)
    const getMicroBICParams = () => {
      switch (typeLocation) {
        case "tourisme_non_classe":
          return MICRO_BIC_TOURISME_NON_CLASSE;
        case "tourisme_classe":
          return MICRO_BIC_TOURISME_CLASSE;
        default:
          return MICRO_BIC_LONGUE_DUREE;
      }
    };

    const microBICParams = getMicroBICParams();
    const baseImposableMicro = loyersAnnuels <= microBICParams.plafond
      ? loyersAnnuels * (1 - microBICParams.abattement)
      : null;

    // Amortissements standards
    const amortissementBati = (prixBien * AMORTISSEMENT_BATI_PART) / AMORTISSEMENT_BATI_DUREE;
    const amortissementMeubles = montantMeubles / AMORTISSEMENT_MEUBLES_DUREE;
    
    // Travaux en LMNP
    let amortissementTravaux = 0;
    let travauxDeductiblesImmediat = 0;
    
    if (typeTravaux === "amelioration") {
      amortissementTravaux = montantTravaux / AMORTISSEMENT_TRAVAUX_DUREE;
    } else {
      travauxDeductiblesImmediat = montantTravaux;
    }

    // Réel Simplifié
    const totalAmortissements = amortissementBati + amortissementMeubles + amortissementTravaux;
    const resultatBIC = loyersAnnuels - chargesDeductibles - travauxDeductiblesImmediat - totalAmortissements;
    const deficitReportable = Math.min(0, resultatBIC);
    const baseImposableReel = Math.max(0, resultatBIC);

    // Choisir le plus avantageux
    const baseImposable = baseImposableMicro !== null
      ? Math.min(baseImposableMicro, baseImposableReel)
      : baseImposableReel;
    const regimeChoisi: "Micro-BIC" | "Réel Simplifié" = baseImposable === baseImposableMicro ? "Micro-BIC" : "Réel Simplifié";

    // Impôt (avec taux social adapté selon LMP/LMNP)
    const impotTotal = baseImposable * (tmi / 100 + tauxSocialApplique);
    const cashflowNet = loyersAnnuels - chargesDeductibles - travauxDeductiblesImmediat - impotTotal;

    return {
      loyersAnnuels,
      chargesDeductibles,
      baseImposableMicro,
      baseImposableReel,
      baseImposable,
      regimeChoisi,
      impotTotal,
      cashflowNet,
      amortissementBati,
      amortissementMeubles,
      amortissementTravaux,
      deficitReportable,
      cfeAnnuel,
      alerteLMP,
      tauxSocialApplique,
    };
  }, [loyerMensuel, tauxVacance, chargesCopro, taxeFonciere, interetsEmprunt, assurancePNO, fraisGestion, prixBien, montantMeubles, tmi, montantTravaux, typeTravaux, typeLocation, cfe, revenusFoyer]);

  // Calcul Plus-Value (Réforme 2025)
  const resultatPlusValue = useMemo((): ResultatPlusValue | null => {
    if (!simulerPlusValue) return null;
    
    const prixAcquisition = prixBien + fraisNotaire;
    
    // Vérifier exonérations
    if (estResidencePrincipale) {
      return {
        plusValueBruteNue: 0,
        plusValueBruteLMNP: 0,
        totalAmortissementsReintegres: 0,
        abattementDureeIR: 1,
        abattementDureePS: 1,
        impotPlusValueNue: 0,
        impotPlusValueLMNP: 0,
        exoneration: { applicable: true, raison: "Résidence principale" },
      };
    }
    
    if (dureeDetention >= 30) {
      return {
        plusValueBruteNue: 0,
        plusValueBruteLMNP: 0,
        totalAmortissementsReintegres: 0,
        abattementDureeIR: 1,
        abattementDureePS: 1,
        impotPlusValueNue: 0,
        impotPlusValueLMNP: 0,
        exoneration: { applicable: true, raison: "Détention > 30 ans" },
      };
    }
    
    // Calcul abattements pour durée de détention
    const calculAbattementIR = (annees: number) => {
      if (annees < 6) return 0;
      if (annees >= 22) return 1;
      return Math.min(1, (annees - 5) * 0.06);
    };
    
    const calculAbattementPS = (annees: number) => {
      if (annees < 6) return 0;
      if (annees >= 30) return 1;
      if (annees <= 21) return (annees - 5) * 0.0165;
      return Math.min(1, 0.264 + (annees - 21) * 0.09);
    };
    
    const abattementDureeIR = calculAbattementIR(dureeDetention);
    const abattementDureePS = calculAbattementPS(dureeDetention);
    
    // Location Nue - Plus-value classique
    const plusValueBruteNue = Math.max(0, prixRevente - prixAcquisition);
    const pvImposableIRNue = plusValueBruteNue * (1 - abattementDureeIR);
    const pvImposablePSNue = plusValueBruteNue * (1 - abattementDureePS);
    const impotPlusValueNue = pvImposableIRNue * IMPOT_PLUS_VALUE + pvImposablePSNue * PRELEVEMENTS_SOCIAUX;
    
    // LMNP - Plus-value avec réintégration des amortissements (LOI 2025)
    const totalAmortissementsReintegres = (resultatLMNP.amortissementBati + resultatLMNP.amortissementMeubles + resultatLMNP.amortissementTravaux) * dureeDetention;
    const plusValueBruteLMNP = Math.max(0, prixRevente - prixAcquisition + totalAmortissementsReintegres);
    const pvImposableIRLMNP = plusValueBruteLMNP * (1 - abattementDureeIR);
    const pvImposablePSLMNP = plusValueBruteLMNP * (1 - abattementDureePS);
    const impotPlusValueLMNP = pvImposableIRLMNP * IMPOT_PLUS_VALUE + pvImposablePSLMNP * PRELEVEMENTS_SOCIAUX;
    
    return {
      plusValueBruteNue,
      plusValueBruteLMNP,
      totalAmortissementsReintegres,
      abattementDureeIR,
      abattementDureePS,
      impotPlusValueNue,
      impotPlusValueLMNP,
      exoneration: { applicable: false, raison: "" },
    };
  }, [simulerPlusValue, prixBien, fraisNotaire, prixRevente, dureeDetention, estResidencePrincipale, resultatLMNP]);

  const economieAnnuelle = resultatLocationNue.impotTotal - resultatLMNP.impotTotal;
  const lmnpGagnant = resultatLMNP.impotTotal < resultatLocationNue.impotTotal;

  return (
    <MainLayout title="Comparateur LMNP vs Location Nue">
      <PremiumToolLock featureName="Comparateur LMNP vs Location Nue" variant="section">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Colonne Gauche: Inputs */}
          <div className="space-y-6">
            {/* Section E: Type de Location (Loi Le Meur 2025) */}
            <Card className="rounded-2xl">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-base">
                  <MapPin className="w-5 h-5 text-violet-500" />
                  Type de Location
                  <Badge variant="outline" className="ml-2 text-xs">Loi Le Meur 2025</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={typeLocation} onValueChange={(v) => setTypeLocation(v as typeof typeLocation)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="longue_duree">Location longue durée (50% - 77 700€)</SelectItem>
                    <SelectItem value="tourisme_classe">Meublé tourisme classé (50% - 77 700€)</SelectItem>
                    <SelectItem value="tourisme_non_classe">Meublé tourisme non classé (30% - 15 000€)</SelectItem>
                  </SelectContent>
                </Select>
                {typeLocation === "tourisme_non_classe" && (
                  <p className="text-xs text-amber-600 mt-2">
                    ⚠️ Loi Le Meur 2025 : L'abattement Micro-BIC est réduit à 30% avec un plafond de 15 000€ pour les meublés de tourisme non classés.
                  </p>
                )}
                {typeLocation === "tourisme_classe" && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Les meublés de tourisme classés conservent un abattement de 50% jusqu'à 77 700€ de recettes.
                  </p>
                )}
              </CardContent>
            </Card>

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

                <div className="space-y-2">
                  <Label className="text-xs">CFE (LMNP uniquement)</Label>
                  <Input
                    type="number"
                    value={cfe}
                    onChange={(e) => setCfe(Number(e.target.value))}
                    className="h-9"
                    placeholder="500"
                  />
                  <p className="text-xs text-muted-foreground">
                    Cotisation Foncière des Entreprises, applicable en LMNP
                  </p>
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
              <CardContent className="space-y-4">
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

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Revenus professionnels du foyer</Label>
                    <span className="text-sm font-semibold">{formatCurrency(revenusFoyer)}</span>
                  </div>
                  <Slider
                    value={[revenusFoyer]}
                    onValueChange={([v]) => setRevenusFoyer(v)}
                    min={0}
                    max={200000}
                    step={5000}
                  />
                  <p className="text-xs text-muted-foreground">
                    Utilisé pour déterminer le passage en LMP (si recettes &gt; 23k€ ET &gt; revenus pro)
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Section D: Travaux */}
            <Card className="rounded-2xl">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Hammer className="w-5 h-5 text-orange-500" />
                  Travaux
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Montant des travaux</Label>
                    <span className="text-sm font-semibold text-primary">{formatCurrency(montantTravaux)}</span>
                  </div>
                  <Slider
                    value={[montantTravaux]}
                    onValueChange={([v]) => setMontantTravaux(v)}
                    min={0}
                    max={100000}
                    step={1000}
                  />
                </div>
                
                {montantTravaux > 0 && (
                  <div className="space-y-2">
                    <Label className="text-sm">Type de travaux</Label>
                    <Select value={typeTravaux} onValueChange={(v) => setTypeTravaux(v as "entretien" | "amelioration" | "energie")}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="entretien">Entretien / Réparation (déduction immédiate)</SelectItem>
                        <SelectItem value="amelioration">Amélioration (amorti sur 10 ans en LMNP)</SelectItem>
                        <SelectItem value="energie">Rénovation énergétique (déficit doublé)</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    {typeTravaux === "energie" && (
                      <p className="text-xs text-emerald-600 mt-1">
                        🌱 Déficit foncier doublé : jusqu'à 21 400€ imputables sur le revenu global
                      </p>
                    )}
                    {typeTravaux === "amelioration" && (
                      <p className="text-xs text-muted-foreground mt-1">
                        En LMNP, les travaux d'amélioration sont amortis sur 10 ans
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Section G: Simulation Plus-Value */}
            <Card className="rounded-2xl">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-base">
                  <TrendingUp className="w-5 h-5 text-red-500" />
                  Simulation Plus-Value
                  <Badge variant="destructive" className="ml-2 text-xs">Réforme 2025</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Activer la simulation</Label>
                  <Switch checked={simulerPlusValue} onCheckedChange={setSimulerPlusValue} />
                </div>
                
                {simulerPlusValue && (
                  <>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="residence-principale"
                        checked={estResidencePrincipale} 
                        onCheckedChange={(v) => setEstResidencePrincipale(v === true)} 
                      />
                      <Label htmlFor="residence-principale" className="text-sm">
                        Deviendra ma résidence principale avant vente
                      </Label>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>Durée de détention prévue</Label>
                        <span className="text-sm font-semibold">{dureeDetention} ans</span>
                      </div>
                      <Slider
                        value={[dureeDetention]}
                        onValueChange={([v]) => setDureeDetention(v)}
                        min={1}
                        max={35}
                        step={1}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>Prix de revente estimé</Label>
                        <span className="text-sm font-semibold text-primary">{formatCurrency(prixRevente)}</span>
                      </div>
                      <Slider
                        value={[prixRevente]}
                        onValueChange={([v]) => setPrixRevente(v)}
                        min={prixBien}
                        max={prixBien * 2}
                        step={10000}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>Frais de notaire (acquisition)</Label>
                        <span className="text-sm font-semibold">{formatCurrency(fraisNotaire)}</span>
                      </div>
                      <Slider
                        value={[fraisNotaire]}
                        onValueChange={([v]) => setFraisNotaire(v)}
                        min={0}
                        max={30000}
                        step={500}
                      />
                    </div>
                  </>
                )}
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

            {/* Résultats Plus-Value */}
            {resultatPlusValue && (
              <Card className="rounded-2xl border-red-200 bg-red-50/50 dark:bg-red-950/20">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Scale className="w-4 h-4 text-red-600" />
                    Impact Plus-Value à la Revente
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {resultatPlusValue.exoneration.applicable ? (
                    <div className="flex items-center gap-2 text-emerald-600">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-medium text-sm">Exonération : {resultatPlusValue.exoneration.raison}</span>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div></div>
                        <div className="text-center font-medium text-primary">Location Nue</div>
                        <div className="text-center font-medium text-emerald-600">LMNP</div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="text-muted-foreground">PV brute</div>
                        <div className="text-center">{formatCurrency(resultatPlusValue.plusValueBruteNue)}</div>
                        <div className="text-center">{formatCurrency(resultatPlusValue.plusValueBruteLMNP)}</div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="text-muted-foreground">Amort. réintégrés</div>
                        <div className="text-center">—</div>
                        <div className="text-center text-red-600">+{formatCurrency(resultatPlusValue.totalAmortissementsReintegres)}</div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="text-muted-foreground">Abattement ({dureeDetention} ans)</div>
                        <div className="text-center text-emerald-600">-{Math.round(resultatPlusValue.abattementDureeIR * 100)}%</div>
                        <div className="text-center text-emerald-600">-{Math.round(resultatPlusValue.abattementDureeIR * 100)}%</div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm border-t pt-2">
                        <div className="font-medium">Impôt PV</div>
                        <div className="text-center font-bold">{formatCurrency(resultatPlusValue.impotPlusValueNue)}</div>
                        <div className="text-center font-bold text-red-600">{formatCurrency(resultatPlusValue.impotPlusValueLMNP)}</div>
                      </div>
                      
                      {resultatPlusValue.impotPlusValueLMNP > resultatPlusValue.impotPlusValueNue && (
                        <p className="text-xs text-amber-600 mt-2 p-2 bg-amber-50 dark:bg-amber-950/30 rounded">
                          ⚠️ La réforme 2025 augmente l'impôt plus-value LMNP de {formatCurrency(resultatPlusValue.impotPlusValueLMNP - resultatPlusValue.impotPlusValueNue)} via la réintégration des amortissements.
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
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

            {/* Alerte LMP */}
            {resultatLMNP.alerteLMP && (
              <Card className="rounded-2xl border-red-300 bg-red-50 dark:bg-red-950/30">
                <CardContent className="py-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-red-700 dark:text-red-400 text-sm">
                        ⚠️ Passage en Loueur Meublé Professionnel (LMP)
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Vos recettes ({formatCurrency(resultatLMNP.loyersAnnuels)}) dépassent 23 000€ ET vos revenus pro ({formatCurrency(revenusFoyer)}).
                        Cotisations URSSAF ~40% au lieu de 17,2% de PS.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Déficit Foncier Location Nue */}
            {resultatLocationNue.deficitImputeRevenuGlobal > 0 && (
              <Card className="rounded-2xl border-blue-200 bg-blue-50/50 dark:bg-blue-950/20">
                <CardContent className="py-4">
                  <div className="flex items-start gap-3">
                    <TrendingDown className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-foreground text-sm">
                        Déficit foncier (Location Nue) : {formatCurrency(resultatLocationNue.deficitImputeRevenuGlobal)}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Économie d'impôt immédiate : <span className="font-bold text-blue-600">{formatCurrency(resultatLocationNue.economieDeficitFoncier)}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Imputable sur votre revenu global (max {typeTravaux === "energie" ? "21 400€" : "10 700€"}/an)
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Déficit reportable LMNP */}
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
                    {resultatLMNP.amortissementTravaux > 0 && (
                      <TableRow>
                        <TableCell className="text-sm">Amortissement travaux (sur 10 ans)</TableCell>
                        <TableCell className="text-right font-semibold text-emerald-600">
                          - {formatCurrency(resultatLMNP.amortissementTravaux)}/an
                        </TableCell>
                      </TableRow>
                    )}
                    <TableRow className="border-t-2">
                      <TableCell className="font-medium">Total déductible</TableCell>
                      <TableCell className="text-right font-bold text-emerald-600">
                        - {formatCurrency(resultatLMNP.amortissementBati + resultatLMNP.amortissementMeubles + resultatLMNP.amortissementTravaux)}/an
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
