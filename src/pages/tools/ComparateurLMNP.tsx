import { useState, useMemo } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Building2, Euro, Receipt, User, AlertTriangle, TrendingDown, CheckCircle, Scale, Info, Landmark } from "lucide-react";
import { RecommendedProducts } from "@/components/academy/RecommendedProducts";
import { PremiumToolLock } from "@/components/premium/PremiumToolLock";
import { ComparisonBarChart } from "@/components/simulators/lmnp/ComparisonBarChart";
import { PlusValueComparisonChart } from "@/components/simulators/lmnp/PlusValueComparisonChart";
import { BilanGlobalCard } from "@/components/simulators/lmnp/BilanGlobalCard";
import { TypeLocationSelect, TypeLocation } from "@/components/simulators/lmnp/TypeLocationSelect";
import { TravauxSection, TypeTravaux } from "@/components/simulators/lmnp/TravauxSection";
import { PlusValueSection, ModeTransmission } from "@/components/simulators/lmnp/PlusValueSection";

// ============================================
// CONSTANTES FISCALES 2025 - LOI DE FINANCES + LOI LE MEUR
// ============================================
const PRELEVEMENTS_SOCIAUX = 0.172;
const IMPOT_PLUS_VALUE = 0.19;

// Location Nue
const MICRO_FONCIER_ABATTEMENT = 0.30;
const PLAFOND_MICRO_FONCIER = 15000;
const PLAFOND_DEFICIT_FONCIER_GLOBAL = 10700;
const PLAFOND_DEFICIT_FONCIER_TRAVAUX_ENERGIE = 21400;

// LMNP Longue Durée
const MICRO_BIC_ABATTEMENT_LONGUE_DUREE = 0.50;
const PLAFOND_MICRO_BIC_LONGUE_DUREE = 77700;

// LMNP Tourisme NON CLASSÉ (Loi Le Meur 2025)
const MICRO_BIC_ABATTEMENT_TOURISME_NON_CLASSE = 0.30;
const PLAFOND_MICRO_BIC_TOURISME_NON_CLASSE = 15000;

// LMNP Tourisme CLASSÉ (Loi Le Meur 2025)
const MICRO_BIC_ABATTEMENT_TOURISME_CLASSE = 0.50;
const PLAFOND_MICRO_BIC_TOURISME_CLASSE = 77700;

// Amortissements
const AMORTISSEMENT_BATI_PART = 0.85;
const AMORTISSEMENT_BATI_DUREE = 35;
const AMORTISSEMENT_MEUBLES_DUREE = 7;
const AMORTISSEMENT_TRAVAUX_AMELIORATION_DUREE = 10;

// Seuil LMP
const SEUIL_LMP_RECETTES = 23000;
const COTISATIONS_URSSAF_LMP = 0.40;

// ============================================
// INTERFACES
// ============================================
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
  deficitImputeSurRevenuGlobal: number;
  economieDeficitFoncier: number;
  deficitReportable: number;
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
  totalAmortissements: number;
  alerteLMP: boolean;
  cfeAnnuel: number;
  abattementMicroBIC: number;
  plafondMicroBIC: number;
}

interface ResultatPlusValue {
  prixAcquisition: number;
  prixCession: number;
  plusValueBruteNue: number;
  abattementDureeIRNue: number;
  abattementDureePSNue: number;
  plusValueImposableIRNue: number;
  plusValueImposablePSNue: number;
  impotPlusValueNue: number;
  totalAmortissementsDeduits: number;
  plusValueBruteLMNP: number;
  abattementDureeIRLMNP: number;
  abattementDureePSLMNP: number;
  plusValueImposableIRLMNP: number;
  plusValueImposablePSLMNP: number;
  impotPlusValueLMNP: number;
  exonerationApplicable: boolean;
  raisonExoneration: string;
}

// ============================================
// COMPOSANT PRINCIPAL
// ============================================
export default function ComparateurLMNP() {
  // Section A: Le Projet Immobilier
  const [prixBien, setPrixBien] = useState(200000);
  const [fraisNotaire, setFraisNotaire] = useState(16000);
  const [montantMeubles, setMontantMeubles] = useState(12000);
  const [loyerMensuel, setLoyerMensuel] = useState(900);
  const [tauxVacance, setTauxVacance] = useState(5);
  const [typeLocation, setTypeLocation] = useState<TypeLocation>("longue_duree");

  // Section B: Les Charges Annuelles
  const [chargesCopro, setChargesCopro] = useState(1200);
  const [taxeFonciere, setTaxeFonciere] = useState(800);
  const [interetsEmprunt, setInteretsEmprunt] = useState(3500);
  const [assurancePNO, setAssurancePNO] = useState(250);
  const [fraisGestion, setFraisGestion] = useState(0);
  const [cfe, setCfe] = useState(500);

  // Section C: Les Travaux
  const [montantTravaux, setMontantTravaux] = useState(0);
  const [typeTravaux, setTypeTravaux] = useState<TypeTravaux>("entretien");

  // Section D: Profil Fiscal
  const [tmi, setTmi] = useState(30);
  const [revenusFoyer, setRevenusFoyer] = useState(60000);

  // Section E: Simulation Plus-Value
  const [simulerPlusValue, setSimulerPlusValue] = useState(false);
  const [dureeDetention, setDureeDetention] = useState(10);
  const [prixReventeEstime, setPrixReventeEstime] = useState(250000);
  const [estResidencePrincipale, setEstResidencePrincipale] = useState(false);
  const [modeTransmission, setModeTransmission] = useState<ModeTransmission>("vente");

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(value);

  // ============================================
  // CALCUL LOCATION NUE
  // ============================================
  const resultatLocationNue = useMemo((): ResultatLocationNue => {
    const loyersAnnuels = loyerMensuel * 12 * (1 - tauxVacance / 100);
    const chargesDeductiblesTotal = chargesCopro + taxeFonciere + interetsEmprunt + assurancePNO + fraisGestion;
    const travauxDeductibles = typeTravaux === "amelioration" ? 0 : montantTravaux;

    const plafondDeficitGlobal = typeTravaux === "energie"
      ? PLAFOND_DEFICIT_FONCIER_TRAVAUX_ENERGIE
      : PLAFOND_DEFICIT_FONCIER_GLOBAL;

    const resultatFoncier = loyersAnnuels - chargesDeductiblesTotal - travauxDeductibles;

    let deficitFoncier = 0;
    let deficitImputeSurRevenuGlobal = 0;
    let economieDeficitFoncier = 0;
    let deficitReportable = 0;

    if (resultatFoncier < 0) {
      deficitFoncier = Math.abs(resultatFoncier);
      const deficitHorsInterets = Math.abs(loyersAnnuels - (chargesDeductiblesTotal - interetsEmprunt) - travauxDeductibles);
      deficitImputeSurRevenuGlobal = Math.min(deficitHorsInterets, plafondDeficitGlobal);
      economieDeficitFoncier = deficitImputeSurRevenuGlobal * (tmi / 100);
      deficitReportable = Math.max(0, deficitFoncier - deficitImputeSurRevenuGlobal);
    }

    const baseImposableMicro = loyersAnnuels <= PLAFOND_MICRO_FONCIER
      ? loyersAnnuels * (1 - MICRO_FONCIER_ABATTEMENT)
      : null;
    const baseImposableReel = Math.max(0, resultatFoncier);

    let regimeChoisi: "Micro-Foncier" | "Réel";
    let baseImposable: number;

    if (baseImposableMicro !== null && baseImposableMicro < baseImposableReel && deficitFoncier === 0) {
      regimeChoisi = "Micro-Foncier";
      baseImposable = baseImposableMicro;
    } else {
      regimeChoisi = "Réel";
      baseImposable = baseImposableReel;
    }

    const impotRevenusFonciers = baseImposable * (tmi / 100 + PRELEVEMENTS_SOCIAUX);
    const impotTotal = Math.max(0, impotRevenusFonciers - economieDeficitFoncier);
    const cashflowNet = loyersAnnuels - chargesDeductiblesTotal - travauxDeductibles - impotTotal;

    return {
      loyersAnnuels,
      chargesDeductibles: chargesDeductiblesTotal,
      travauxDeductibles,
      baseImposableMicro,
      baseImposableReel,
      baseImposable,
      regimeChoisi,
      impotTotal,
      cashflowNet,
      deficitFoncier,
      deficitImputeSurRevenuGlobal,
      economieDeficitFoncier,
      deficitReportable,
    };
  }, [loyerMensuel, tauxVacance, chargesCopro, taxeFonciere, interetsEmprunt, assurancePNO, fraisGestion, montantTravaux, typeTravaux, tmi]);

  // ============================================
  // CALCUL LMNP
  // ============================================
  const resultatLMNP = useMemo((): ResultatLMNP => {
    const loyersAnnuels = loyerMensuel * 12 * (1 - tauxVacance / 100);
    const alerteLMP = loyersAnnuels > SEUIL_LMP_RECETTES && loyersAnnuels > revenusFoyer;

    let abattementMicroBIC: number;
    let plafondMicroBIC: number;

    switch (typeLocation) {
      case "tourisme_non_classe":
        abattementMicroBIC = MICRO_BIC_ABATTEMENT_TOURISME_NON_CLASSE;
        plafondMicroBIC = PLAFOND_MICRO_BIC_TOURISME_NON_CLASSE;
        break;
      case "tourisme_classe":
        abattementMicroBIC = MICRO_BIC_ABATTEMENT_TOURISME_CLASSE;
        plafondMicroBIC = PLAFOND_MICRO_BIC_TOURISME_CLASSE;
        break;
      default:
        abattementMicroBIC = MICRO_BIC_ABATTEMENT_LONGUE_DUREE;
        plafondMicroBIC = PLAFOND_MICRO_BIC_LONGUE_DUREE;
    }

    const baseImposableMicro = loyersAnnuels <= plafondMicroBIC
      ? loyersAnnuels * (1 - abattementMicroBIC)
      : null;

    const amortissementBati = (prixBien * AMORTISSEMENT_BATI_PART) / AMORTISSEMENT_BATI_DUREE;
    const amortissementMeubles = montantMeubles / AMORTISSEMENT_MEUBLES_DUREE;
    const amortissementTravaux = typeTravaux === "amelioration"
      ? montantTravaux / AMORTISSEMENT_TRAVAUX_AMELIORATION_DUREE
      : 0;
    const travauxDeductiblesImmediat = typeTravaux !== "amelioration" ? montantTravaux : 0;

    const totalAmortissements = amortissementBati + amortissementMeubles + amortissementTravaux;
    const chargesDeductiblesTotal = chargesCopro + taxeFonciere + interetsEmprunt + assurancePNO + fraisGestion + cfe + travauxDeductiblesImmediat;

    const resultatBIC = loyersAnnuels - chargesDeductiblesTotal - totalAmortissements;
    const deficitReportable = resultatBIC < 0 ? Math.abs(resultatBIC) : 0;
    const baseImposableReel = Math.max(0, resultatBIC);

    let regimeChoisi: "Micro-BIC" | "Réel Simplifié";
    let baseImposable: number;

    if (baseImposableMicro !== null && baseImposableMicro < baseImposableReel) {
      regimeChoisi = "Micro-BIC";
      baseImposable = baseImposableMicro;
    } else {
      regimeChoisi = "Réel Simplifié";
      baseImposable = baseImposableReel;
    }

    const tauxSocial = alerteLMP ? COTISATIONS_URSSAF_LMP : PRELEVEMENTS_SOCIAUX;
    const impotTotal = baseImposable * (tmi / 100 + tauxSocial);
    const cashflowNet = loyersAnnuels - chargesDeductiblesTotal - impotTotal;

    return {
      loyersAnnuels,
      chargesDeductibles: chargesDeductiblesTotal,
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
      totalAmortissements,
      alerteLMP,
      cfeAnnuel: cfe,
      abattementMicroBIC,
      plafondMicroBIC,
    };
  }, [loyerMensuel, tauxVacance, prixBien, montantMeubles, chargesCopro, taxeFonciere, interetsEmprunt, assurancePNO, fraisGestion, cfe, montantTravaux, typeTravaux, tmi, typeLocation, revenusFoyer]);

  // ============================================
  // CALCUL PLUS-VALUE
  // ============================================
  const resultatPlusValue = useMemo((): ResultatPlusValue | null => {
    if (!simulerPlusValue) return null;

    const prixAcquisition = prixBien + fraisNotaire;
    const prixCession = prixReventeEstime;

    let exonerationApplicable = false;
    let raisonExoneration = "";

    if (estResidencePrincipale && modeTransmission === "vente") {
      exonerationApplicable = true;
      raisonExoneration = "Exonération totale : résidence principale";
    } else if (modeTransmission === "donation") {
      exonerationApplicable = true;
      raisonExoneration = "Exonération totale : transmission par donation";
    } else if (modeTransmission === "succession") {
      exonerationApplicable = true;
      raisonExoneration = "Exonération totale : transmission par succession";
    } else if (dureeDetention >= 30) {
      exonerationApplicable = true;
      raisonExoneration = "Exonération totale : détention > 30 ans";
    }

    if (exonerationApplicable) {
      return {
        prixAcquisition,
        prixCession,
        plusValueBruteNue: 0,
        abattementDureeIRNue: 1,
        abattementDureePSNue: 1,
        plusValueImposableIRNue: 0,
        plusValueImposablePSNue: 0,
        impotPlusValueNue: 0,
        totalAmortissementsDeduits: 0,
        plusValueBruteLMNP: 0,
        abattementDureeIRLMNP: 1,
        abattementDureePSLMNP: 1,
        plusValueImposableIRLMNP: 0,
        plusValueImposablePSLMNP: 0,
        impotPlusValueLMNP: 0,
        exonerationApplicable,
        raisonExoneration,
      };
    }

    const calculAbattementIR = (annees: number) => {
      if (annees < 6) return 0;
      if (annees >= 22) return 1;
      if (annees <= 21) return (annees - 5) * 0.06;
      return (21 - 5) * 0.06 + 0.04;
    };

    const calculAbattementPS = (annees: number) => {
      if (annees < 6) return 0;
      if (annees >= 30) return 1;
      if (annees <= 21) return (annees - 5) * 0.0165;
      if (annees === 22) return (21 - 5) * 0.0165 + 0.016;
      return Math.min(1, (21 - 5) * 0.0165 + 0.016 + (annees - 22) * 0.09);
    };

    // Location Nue
    const plusValueBruteNue = Math.max(0, prixCession - prixAcquisition);
    const abattementDureeIRNue = calculAbattementIR(dureeDetention);
    const abattementDureePSNue = calculAbattementPS(dureeDetention);
    const plusValueImposableIRNue = plusValueBruteNue * (1 - abattementDureeIRNue);
    const plusValueImposablePSNue = plusValueBruteNue * (1 - abattementDureePSNue);
    const impotPlusValueNue = plusValueImposableIRNue * IMPOT_PLUS_VALUE + plusValueImposablePSNue * PRELEVEMENTS_SOCIAUX;

    // LMNP avec réintégration des amortissements (Loi 2025)
    const totalAmortissementsDeduits = resultatLMNP.totalAmortissements * dureeDetention;
    const plusValueBruteLMNP = Math.max(0, prixCession - (prixAcquisition - totalAmortissementsDeduits));
    const abattementDureeIRLMNP = calculAbattementIR(dureeDetention);
    const abattementDureePSLMNP = calculAbattementPS(dureeDetention);
    const plusValueImposableIRLMNP = plusValueBruteLMNP * (1 - abattementDureeIRLMNP);
    const plusValueImposablePSLMNP = plusValueBruteLMNP * (1 - abattementDureePSLMNP);
    const impotPlusValueLMNP = plusValueImposableIRLMNP * IMPOT_PLUS_VALUE + plusValueImposablePSLMNP * PRELEVEMENTS_SOCIAUX;

    return {
      prixAcquisition,
      prixCession,
      plusValueBruteNue,
      abattementDureeIRNue,
      abattementDureePSNue,
      plusValueImposableIRNue,
      plusValueImposablePSNue,
      impotPlusValueNue,
      totalAmortissementsDeduits,
      plusValueBruteLMNP,
      abattementDureeIRLMNP,
      abattementDureePSLMNP,
      plusValueImposableIRLMNP,
      plusValueImposablePSLMNP,
      impotPlusValueLMNP,
      exonerationApplicable,
      raisonExoneration,
    };
  }, [simulerPlusValue, prixBien, fraisNotaire, prixReventeEstime, estResidencePrincipale, modeTransmission, dureeDetention, resultatLMNP.totalAmortissements]);

  // ============================================
  // BILAN GLOBAL
  // ============================================
  const bilanGlobal = useMemo(() => {
    const annees = simulerPlusValue ? dureeDetention : 10;

    const totalImpotNue = resultatLocationNue.impotTotal * annees;
    const totalCashflowNue = resultatLocationNue.cashflowNet * annees;
    const plusValueNue = resultatPlusValue?.impotPlusValueNue || 0;
    const bilanNetNue = totalCashflowNue - plusValueNue;

    const totalImpotLMNP = resultatLMNP.impotTotal * annees;
    const totalCashflowLMNP = resultatLMNP.cashflowNet * annees;
    const plusValueLMNP = resultatPlusValue?.impotPlusValueLMNP || 0;
    const bilanNetLMNP = totalCashflowLMNP - plusValueLMNP;

    return {
      annees,
      totalImpotNue,
      totalCashflowNue,
      plusValueNue,
      bilanNetNue,
      totalImpotLMNP,
      totalCashflowLMNP,
      plusValueLMNP,
      bilanNetLMNP,
      gagnant: bilanNetLMNP > bilanNetNue ? "LMNP" as const : "Location Nue" as const,
      economieGlobale: Math.abs(bilanNetLMNP - bilanNetNue),
    };
  }, [simulerPlusValue, dureeDetention, resultatLocationNue, resultatLMNP, resultatPlusValue]);

  const economieAnnuelle = resultatLocationNue.impotTotal - resultatLMNP.impotTotal;

  return (
    <MainLayout title="Comparateur LMNP vs Location Nue">
      <PremiumToolLock featureName="Comparateur LMNP vs Location Nue" variant="section">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Badges réforme 2025 */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800">
              <Info className="w-3 h-3 mr-1" /> Loi Le Meur 2025
            </Badge>
            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-800">
              <AlertTriangle className="w-3 h-3 mr-1" /> Réintégration amortissements PV
            </Badge>
            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800">
              <TrendingDown className="w-3 h-3 mr-1" /> Déficit foncier 21 400€
            </Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Colonne Gauche - Inputs */}
            <div className="space-y-4">
              {/* Section A: Projet Immobilier */}
              <Card className="rounded-2xl">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Building2 className="w-5 h-5 text-primary" />
                    Le Projet Immobilier
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Prix du bien</Label>
                      <span className="text-sm font-semibold text-primary">{formatCurrency(prixBien)}</span>
                    </div>
                    <Slider value={[prixBien]} onValueChange={([v]) => setPrixBien(v)} min={50000} max={1000000} step={5000} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Frais de notaire</Label>
                      <span className="text-sm font-semibold">{formatCurrency(fraisNotaire)}</span>
                    </div>
                    <Slider value={[fraisNotaire]} onValueChange={([v]) => setFraisNotaire(v)} min={0} max={Math.round(prixBien * 0.12)} step={500} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Mobilier (LMNP)</Label>
                      <span className="text-sm font-semibold">{formatCurrency(montantMeubles)}</span>
                    </div>
                    <Slider value={[montantMeubles]} onValueChange={([v]) => setMontantMeubles(v)} min={0} max={50000} step={500} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Loyer mensuel</Label>
                      <span className="text-sm font-semibold text-emerald-600">{formatCurrency(loyerMensuel)}</span>
                    </div>
                    <Slider value={[loyerMensuel]} onValueChange={([v]) => setLoyerMensuel(v)} min={300} max={3000} step={50} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Taux de vacance</Label>
                      <span className="text-sm font-semibold">{tauxVacance}%</span>
                    </div>
                    <Slider value={[tauxVacance]} onValueChange={([v]) => setTauxVacance(v)} min={0} max={20} step={1} />
                  </div>
                </CardContent>
              </Card>

              {/* Section Type Location */}
              <TypeLocationSelect value={typeLocation} onChange={setTypeLocation} />

              {/* Section B: Charges Annuelles */}
              <Card className="rounded-2xl">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Receipt className="w-5 h-5 text-amber-500" />
                    Charges Annuelles
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Charges copropriété</Label>
                      <span className="text-sm font-semibold">{formatCurrency(chargesCopro)}</span>
                    </div>
                    <Slider value={[chargesCopro]} onValueChange={([v]) => setChargesCopro(v)} min={0} max={5000} step={100} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Taxe foncière</Label>
                      <span className="text-sm font-semibold">{formatCurrency(taxeFonciere)}</span>
                    </div>
                    <Slider value={[taxeFonciere]} onValueChange={([v]) => setTaxeFonciere(v)} min={0} max={3000} step={50} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Intérêts d'emprunt annuels</Label>
                      <span className="text-sm font-semibold">{formatCurrency(interetsEmprunt)}</span>
                    </div>
                    <Slider value={[interetsEmprunt]} onValueChange={([v]) => setInteretsEmprunt(v)} min={0} max={15000} step={100} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Assurance PNO</Label>
                      <span className="text-sm font-semibold">{formatCurrency(assurancePNO)}</span>
                    </div>
                    <Slider value={[assurancePNO]} onValueChange={([v]) => setAssurancePNO(v)} min={0} max={1000} step={25} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Frais de gestion</Label>
                      <span className="text-sm font-semibold">{formatCurrency(fraisGestion)}</span>
                    </div>
                    <Slider value={[fraisGestion]} onValueChange={([v]) => setFraisGestion(v)} min={0} max={2000} step={50} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label className="flex items-center gap-1">
                        CFE
                        <Badge variant="outline" className="text-[10px] ml-1">LMNP uniquement</Badge>
                      </Label>
                      <span className="text-sm font-semibold">{formatCurrency(cfe)}</span>
                    </div>
                    <Slider value={[cfe]} onValueChange={([v]) => setCfe(v)} min={0} max={2000} step={50} />
                  </div>
                </CardContent>
              </Card>

              {/* Section C: Travaux */}
              <TravauxSection
                montantTravaux={montantTravaux}
                setMontantTravaux={setMontantTravaux}
                typeTravaux={typeTravaux}
                setTypeTravaux={setTypeTravaux}
                formatCurrency={formatCurrency}
              />

              {/* Section D: Profil Fiscal */}
              <Card className="rounded-2xl">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <User className="w-5 h-5 text-rose-500" />
                    Profil Fiscal
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Tranche Marginale d'Imposition (TMI)</Label>
                    <div className="flex gap-2 flex-wrap">
                      {[0, 11, 30, 41, 45].map((t) => (
                        <Badge
                          key={t}
                          variant={tmi === t ? "default" : "outline"}
                          className="cursor-pointer hover:bg-primary/10"
                          onClick={() => setTmi(t)}
                        >
                          {t}%
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Revenus du foyer (hors location)</Label>
                      <span className="text-sm font-semibold">{formatCurrency(revenusFoyer)}</span>
                    </div>
                    <Slider value={[revenusFoyer]} onValueChange={([v]) => setRevenusFoyer(v)} min={0} max={200000} step={1000} />
                    <p className="text-xs text-muted-foreground">Pour déterminer le passage éventuel en LMP</p>
                  </div>
                </CardContent>
              </Card>

              {/* Section E: Plus-Value */}
              <PlusValueSection
                simulerPlusValue={simulerPlusValue}
                setSimulerPlusValue={setSimulerPlusValue}
                modeTransmission={modeTransmission}
                setModeTransmission={setModeTransmission}
                estResidencePrincipale={estResidencePrincipale}
                setEstResidencePrincipale={setEstResidencePrincipale}
                dureeDetention={dureeDetention}
                setDureeDetention={setDureeDetention}
                prixReventeEstime={prixReventeEstime}
                setPrixReventeEstime={setPrixReventeEstime}
                prixBien={prixBien}
                formatCurrency={formatCurrency}
              />
            </div>

            {/* Colonne Droite - Résultats */}
            <div className="space-y-4">
              {/* Alerte LMP */}
              {resultatLMNP.alerteLMP && (
                <Card className="rounded-2xl border-red-300 bg-red-100/50 dark:bg-red-950/30">
                  <CardContent className="py-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-destructive">
                          ⚠️ Passage en Loueur Meublé Professionnel (LMP)
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Vos recettes ({formatCurrency(resultatLMNP.loyersAnnuels)}) dépassent {formatCurrency(SEUIL_LMP_RECETTES)} ET sont supérieures à vos autres revenus. 
                          Vous basculez en LMP avec des cotisations URSSAF (~40%) au lieu des prélèvements sociaux (17,2%).
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Graphique Comparatif */}
              <Card className="rounded-2xl">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Comparaison Fiscale Annuelle</CardTitle>
                  <CardDescription>Impôt total (IR + Prélèvements Sociaux)</CardDescription>
                </CardHeader>
                <CardContent>
                  <ComparisonBarChart
                    locationNue={resultatLocationNue.impotTotal}
                    lmnp={resultatLMNP.impotTotal}
                  />
                </CardContent>
              </Card>

              {/* Déficit Foncier */}
              {resultatLocationNue.deficitImputeSurRevenuGlobal > 0 && (
                <Card className="rounded-2xl border-blue-200 bg-blue-50/50 dark:bg-blue-950/20">
                  <CardContent className="py-4">
                    <div className="flex items-start gap-3">
                      <TrendingDown className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-foreground">
                          Déficit foncier imputable : {formatCurrency(resultatLocationNue.deficitImputeSurRevenuGlobal)}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Économie d'impôt immédiate : <span className="font-bold text-blue-600">{formatCurrency(resultatLocationNue.economieDeficitFoncier)}</span>
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Maximum {typeTravaux === "energie" ? "21 400€" : "10 700€"}/an sur le revenu global
                          {typeTravaux === "energie" && <span className="text-emerald-600 ml-1">(doublé pour travaux énergétiques)</span>}
                        </p>
                        {resultatLocationNue.deficitReportable > 0 && (
                          <p className="text-xs text-amber-600 mt-1">
                            + {formatCurrency(resultatLocationNue.deficitReportable)} reportable sur 10 ans
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Carte Location Nue */}
              <Card className="rounded-2xl">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Landmark className="w-5 h-5 text-primary" />
                    Location Nue
                    <Badge variant="outline" className="ml-auto">{resultatLocationNue.regimeChoisi}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell className="text-sm">Loyers annuels nets</TableCell>
                        <TableCell className="text-right font-medium">{formatCurrency(resultatLocationNue.loyersAnnuels)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="text-sm">Charges déductibles</TableCell>
                        <TableCell className="text-right text-destructive">-{formatCurrency(resultatLocationNue.chargesDeductibles)}</TableCell>
                      </TableRow>
                      {resultatLocationNue.travauxDeductibles > 0 && (
                        <TableRow>
                          <TableCell className="text-sm">Travaux déductibles</TableCell>
                          <TableCell className="text-right text-destructive">-{formatCurrency(resultatLocationNue.travauxDeductibles)}</TableCell>
                        </TableRow>
                      )}
                      <TableRow>
                        <TableCell className="text-sm">Base imposable</TableCell>
                        <TableCell className="text-right">{formatCurrency(resultatLocationNue.baseImposable)}</TableCell>
                      </TableRow>
                      <TableRow className="border-t">
                        <TableCell className="font-medium">Impôt total</TableCell>
                        <TableCell className="text-right font-bold text-destructive">{formatCurrency(resultatLocationNue.impotTotal)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Cashflow net</TableCell>
                        <TableCell className={`text-right font-bold ${resultatLocationNue.cashflowNet >= 0 ? "text-emerald-600" : "text-destructive"}`}>
                          {formatCurrency(resultatLocationNue.cashflowNet)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Carte LMNP */}
              <Card className="rounded-2xl border-emerald-200">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Euro className="w-5 h-5 text-emerald-600" />
                    LMNP
                    <Badge variant="outline" className="ml-auto bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400">
                      {resultatLMNP.regimeChoisi}
                    </Badge>
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Abattement Micro-BIC: {Math.round(resultatLMNP.abattementMicroBIC * 100)}% (plafond {formatCurrency(resultatLMNP.plafondMicroBIC)})
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell className="text-sm">Loyers annuels nets</TableCell>
                        <TableCell className="text-right font-medium">{formatCurrency(resultatLMNP.loyersAnnuels)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="text-sm">Charges déductibles (+ CFE)</TableCell>
                        <TableCell className="text-right text-destructive">-{formatCurrency(resultatLMNP.chargesDeductibles)}</TableCell>
                      </TableRow>
                      {resultatLMNP.regimeChoisi === "Réel Simplifié" && (
                        <TableRow>
                          <TableCell className="text-sm">Amortissements</TableCell>
                          <TableCell className="text-right text-emerald-600">-{formatCurrency(resultatLMNP.totalAmortissements)}</TableCell>
                        </TableRow>
                      )}
                      <TableRow>
                        <TableCell className="text-sm">Base imposable</TableCell>
                        <TableCell className="text-right">{formatCurrency(resultatLMNP.baseImposable)}</TableCell>
                      </TableRow>
                      <TableRow className="border-t">
                        <TableCell className="font-medium">Impôt total</TableCell>
                        <TableCell className="text-right font-bold text-emerald-600">{formatCurrency(resultatLMNP.impotTotal)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Cashflow net</TableCell>
                        <TableCell className={`text-right font-bold ${resultatLMNP.cashflowNet >= 0 ? "text-emerald-600" : "text-destructive"}`}>
                          {formatCurrency(resultatLMNP.cashflowNet)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Détail Amortissements */}
              {resultatLMNP.regimeChoisi === "Réel Simplifié" && (
                <Card className="rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Détail des Amortissements LMNP</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell className="text-sm">Bâti (85% sur 35 ans)</TableCell>
                          <TableCell className="text-right font-semibold text-emerald-600">-{formatCurrency(resultatLMNP.amortissementBati)}/an</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="text-sm">Meubles (sur 7 ans)</TableCell>
                          <TableCell className="text-right font-semibold text-emerald-600">-{formatCurrency(resultatLMNP.amortissementMeubles)}/an</TableCell>
                        </TableRow>
                        {resultatLMNP.amortissementTravaux > 0 && (
                          <TableRow>
                            <TableCell className="text-sm">Travaux amélioration (sur 10 ans)</TableCell>
                            <TableCell className="text-right font-semibold text-emerald-600">-{formatCurrency(resultatLMNP.amortissementTravaux)}/an</TableCell>
                          </TableRow>
                        )}
                        <TableRow className="border-t-2">
                          <TableCell className="font-medium">Total déductible</TableCell>
                          <TableCell className="text-right font-bold text-emerald-600">-{formatCurrency(resultatLMNP.totalAmortissements)}/an</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}

              {/* Simulation Plus-Value */}
              {simulerPlusValue && resultatPlusValue && (
                <Card className="rounded-2xl border-red-200 bg-red-50/50 dark:bg-red-950/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Scale className="w-5 h-5 text-red-600" />
                      Impact Plus-Value à la Revente
                      <Badge variant="destructive" className="ml-auto text-xs">Loi 2025</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {resultatPlusValue.exonerationApplicable ? (
                      <div className="flex items-center gap-2 text-emerald-600 py-2">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-medium">{resultatPlusValue.raisonExoneration}</span>
                      </div>
                    ) : (
                      <>
                        <PlusValueComparisonChart
                          plusValueNue={resultatPlusValue.impotPlusValueNue}
                          plusValueLMNP={resultatPlusValue.impotPlusValueLMNP}
                          amortissementsReintegres={resultatPlusValue.totalAmortissementsDeduits}
                        />
                        <Table className="mt-2">
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[160px]"></TableHead>
                              <TableHead className="text-right text-xs">Location Nue</TableHead>
                              <TableHead className="text-right text-xs">LMNP</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow>
                              <TableCell className="text-xs">Plus-value brute</TableCell>
                              <TableCell className="text-right text-xs">{formatCurrency(resultatPlusValue.plusValueBruteNue)}</TableCell>
                              <TableCell className="text-right text-xs">{formatCurrency(resultatPlusValue.plusValueBruteLMNP)}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="text-xs">Amort. réintégrés</TableCell>
                              <TableCell className="text-right text-xs">—</TableCell>
                              <TableCell className="text-right text-xs text-destructive">+{formatCurrency(resultatPlusValue.totalAmortissementsDeduits)}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="text-xs">Abattement ({dureeDetention} ans)</TableCell>
                              <TableCell className="text-right text-xs text-emerald-600">-{Math.round(resultatPlusValue.abattementDureeIRNue * 100)}% IR</TableCell>
                              <TableCell className="text-right text-xs text-emerald-600">-{Math.round(resultatPlusValue.abattementDureeIRLMNP * 100)}% IR</TableCell>
                            </TableRow>
                            <TableRow className="border-t">
                              <TableCell className="text-xs font-medium">Impôt Plus-Value</TableCell>
                              <TableCell className="text-right font-bold">{formatCurrency(resultatPlusValue.impotPlusValueNue)}</TableCell>
                              <TableCell className="text-right font-bold text-destructive">{formatCurrency(resultatPlusValue.impotPlusValueLMNP)}</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                        
                        {resultatPlusValue.impotPlusValueLMNP > resultatPlusValue.impotPlusValueNue && (
                          <Alert className="mt-3 border-amber-200 bg-amber-50/50 dark:bg-amber-950/30 dark:border-amber-800">
                            <AlertTriangle className="h-4 w-4 text-amber-600" />
                            <AlertDescription className="text-xs text-amber-700 dark:text-amber-400">
                              <strong>Attention Loi 2025 :</strong> La réintégration des amortissements augmente 
                              la plus-value de {formatCurrency(resultatPlusValue.totalAmortissementsDeduits)} en LMNP. 
                              Surcoût à la revente : <strong>{formatCurrency(resultatPlusValue.impotPlusValueLMNP - resultatPlusValue.impotPlusValueNue)}</strong>.
                            </AlertDescription>
                          </Alert>
                        )}
                      </>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Bilan Global */}
              <BilanGlobalCard
                dureeDetention={bilanGlobal.annees}
                totalImpotNue={bilanGlobal.totalImpotNue}
                totalCashflowNue={bilanGlobal.totalCashflowNue}
                plusValueNue={bilanGlobal.plusValueNue}
                bilanNetNue={bilanGlobal.bilanNetNue}
                totalImpotLMNP={bilanGlobal.totalImpotLMNP}
                totalCashflowLMNP={bilanGlobal.totalCashflowLMNP}
                plusValueLMNP={bilanGlobal.plusValueLMNP}
                bilanNetLMNP={bilanGlobal.bilanNetLMNP}
                gagnant={bilanGlobal.gagnant}
                economieGlobale={bilanGlobal.economieGlobale}
                simulerPlusValue={simulerPlusValue}
              />

              {/* Message Conseil */}
              {economieAnnuelle > 500 && (
                <Alert className="border-emerald-200 bg-emerald-50/50 dark:bg-emerald-950/20">
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                  <AlertDescription className="text-sm text-emerald-700 dark:text-emerald-400">
                    Le <strong>LMNP</strong> vous fait économiser <strong>{formatCurrency(economieAnnuelle)}/an</strong> d'impôts 
                    grâce aux amortissements. {simulerPlusValue && "Attention à l'impact sur la plus-value à la revente !"}
                  </AlertDescription>
                </Alert>
              )}

              {economieAnnuelle < -500 && (
                <Alert className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/20">
                  <Info className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-sm text-blue-700 dark:text-blue-400">
                    La <strong>Location Nue</strong> est plus avantageuse dans votre situation, 
                    {resultatLocationNue.deficitFoncier > 0 ? " notamment grâce au déficit foncier imputable sur vos revenus." : " grâce au régime Micro-Foncier."}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>

          {/* Produits recommandés */}
          <RecommendedProducts 
            productIds={["scpi", "assurance-vie", "per"]} 
            title="Produits recommandés pour l'investissement immobilier" 
          />
        </div>
      </PremiumToolLock>
    </MainLayout>
  );
}
