import { useState, useMemo, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ArrowLeft, User, Users, Minus, Plus, TrendingDown, AlertTriangle, Info, PiggyBank, Palmtree } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { InputSlider } from "@/components/simulators/interets-composes/InputSlider";
import { useAnimatedCounter } from "@/hooks/useAnimatedCounter";
import { TMIGauge } from "@/components/simulators/ir/TMIGauge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { RecommendedProducts } from "@/components/academy/RecommendedProducts";
import { TierLock } from "@/components/premium/TierLock";
import { SaveSimulationButton } from "@/components/simulators/SaveSimulationButton";

// ============= CONSTANTES FISCALES 2025 =============
const TAX_BRACKETS = [
  { min: 0, max: 11497, rate: 0 },
  { min: 11498, max: 29315, rate: 0.11 },
  { min: 29316, max: 83823, rate: 0.30 },
  { min: 83824, max: 180294, rate: 0.41 },
  { min: 180295, max: Infinity, rate: 0.45 },
];

// Plafonnement du quotient familial
const PLAFOND_QF_PAR_DEMI_PART = 1759; // € par demi-part (2025)

// PER - Plan d'Épargne Retraite
const PER_TAUX_DEDUCTION = 0.10; // 10% des revenus
const PER_PLANCHER = 4399; // Minimum déductible
const PER_PLAFOND_BASE = 35194; // Maximum déductible (hors report)

// Girardin - Investissement Outre-Mer
const GIRARDIN_RENDEMENT = 0.15; // 15% de rendement (10k€ investi = 11.5k€ crédit)
const GIRARDIN_TAUX_NICHES = 0.41; // 41% dans le plafond niches fiscales
const PLAFOND_NICHES_OUTREMER = 18000; // Plafond niches fiscales outre-mer

// ============= FONCTIONS DE CALCUL =============

// Calcul des parts enfants uniquement
function calculateChildParts(children: number): number {
  let childParts = 0;
  if (children >= 1) childParts += 0.5;
  if (children >= 2) childParts += 0.5;
  if (children >= 3) childParts += children - 2;
  return childParts;
}

// Calcul du nombre total de parts
function calculateParts(isCouple: boolean, children: number): number {
  const baseParts = isCouple ? 2 : 1;
  return baseParts + calculateChildParts(children);
}

// Calcul de l'impôt brut (sans plafonnement)
function calculateRawTax(revenuImposable: number, parts: number): { tax: number; tmi: number } {
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

// Calcul de l'impôt avec plafonnement du quotient familial
function calculateTaxWithCap(
  revenuImposable: number, 
  isCouple: boolean, 
  children: number
): { tax: number; tmi: number; plafonnementApplique: boolean; gainPlafonne: number } {
  const baseParts = isCouple ? 2 : 1;
  const childParts = calculateChildParts(children);
  const totalParts = baseParts + childParts;

  // Si pas d'enfants, pas de plafonnement
  if (childParts === 0) {
    const result = calculateRawTax(revenuImposable, totalParts);
    return { ...result, plafonnementApplique: false, gainPlafonne: 0 };
  }

  // Impôt de référence (sans enfants)
  const taxWithoutChildren = calculateRawTax(revenuImposable, baseParts);
  
  // Impôt avec enfants (non plafonné)
  const taxWithChildren = calculateRawTax(revenuImposable, totalParts);
  
  // Gain fiscal grâce aux enfants
  const gainFiscalEnfants = taxWithoutChildren.tax - taxWithChildren.tax;
  
  // Plafond = 1759€ × nombre de demi-parts enfants × 2
  // (car 1759€ est par demi-part, et childParts est en parts entières/demi-parts)
  const nombreDemiParts = childParts * 2;
  const plafondGain = PLAFOND_QF_PAR_DEMI_PART * nombreDemiParts;
  
  // Vérifier si plafonnement s'applique
  if (gainFiscalEnfants > plafondGain) {
    // Le gain est limité au plafond
    const impotFinal = taxWithoutChildren.tax - plafondGain;
    return {
      tax: Math.round(impotFinal),
      tmi: taxWithChildren.tmi, // TMI reste celui du quotient avec enfants
      plafonnementApplique: true,
      gainPlafonne: gainFiscalEnfants - plafondGain,
    };
  }

  return {
    ...taxWithChildren,
    plafonnementApplique: false,
    gainPlafonne: 0,
  };
}

export default function SimulateurIR() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // ============= STATES =============
  const [revenuNet, setRevenuNet] = useState(60000);
  const [isCouple, setIsCouple] = useState(false);
  const [children, setChildren] = useState(0);
  
  // PER
  const [perActif, setPerActif] = useState(false);
  const [montantPER, setMontantPER] = useState(5000);
  const [reportPER, setReportPER] = useState(0); // Report des 3 années antérieures
  
  // Girardin
  const [girardinActif, setGirardinActif] = useState(false);
  const [montantGirardin, setMontantGirardin] = useState(10000);

  // Load saved simulation if navigating from Simulations page
  useEffect(() => {
    const loadSimulation = location.state?.loadSimulation;
    if (loadSimulation?.parameters) {
      const p = loadSimulation.parameters;
      if (p.revenuNet !== undefined) setRevenuNet(p.revenuNet);
      if (p.isCouple !== undefined) setIsCouple(p.isCouple);
      if (p.children !== undefined) setChildren(p.children);
      if (p.perActif !== undefined) setPerActif(p.perActif);
      if (p.montantPER !== undefined) setMontantPER(p.montantPER);
      if (p.reportPER !== undefined) setReportPER(p.reportPER);
      if (p.girardinActif !== undefined) setGirardinActif(p.girardinActif);
      if (p.montantGirardin !== undefined) setMontantGirardin(p.montantGirardin);
    }
  }, [location.state]);

  // ============= CALCULS =============
  const parts = useMemo(() => calculateParts(isCouple, children), [isCouple, children]);
  
  // Plafond PER dynamique
  const plafondPER = useMemo(() => {
    const base = Math.max(PER_PLANCHER, Math.min(revenuNet * PER_TAUX_DEDUCTION, PER_PLAFOND_BASE));
    return base + reportPER;
  }, [revenuNet, reportPER]);

  // Résultat initial (sans optimisation)
  const resultatInitial = useMemo(() => 
    calculateTaxWithCap(revenuNet, isCouple, children), 
    [revenuNet, isCouple, children]
  );
  
  // Plafond Girardin dynamique (limité par l'impôt ET les niches fiscales)
  const plafondGirardin = useMemo(() => {
    // Le crédit Girardin ne peut pas dépasser l'impôt dû
    const maxParImpot = resultatInitial.tax / (1 + GIRARDIN_RENDEMENT);
    // Maximum selon les niches fiscales : 18000€ / 41% = 43 902€ de crédit max
    const maxCreditNiches = PLAFOND_NICHES_OUTREMER / GIRARDIN_TAUX_NICHES;
    const maxInvestNiches = maxCreditNiches / (1 + GIRARDIN_RENDEMENT);
    return Math.min(maxParImpot, maxInvestNiches);
  }, [resultatInitial.tax]);

  // Résultat optimisé (avec PER et/ou Girardin)
  const resultatOptimise = useMemo(() => {
    let revenuAjuste = revenuNet;
    let deductionPEREffective = 0;
    
    // PER : déduction du revenu imposable
    if (perActif && montantPER > 0) {
      deductionPEREffective = Math.min(montantPER, plafondPER);
      revenuAjuste = Math.max(0, revenuAjuste - deductionPEREffective);
    }
    
    // Calcul de l'impôt sur le revenu ajusté
    const impotApresPER = calculateTaxWithCap(revenuAjuste, isCouple, children);
    
    // Girardin : crédit d'impôt (après calcul de l'impôt)
    let creditGirardin = 0;
    let investissementGirardinEffectif = 0;
    let impactNiches = 0;
    
    if (girardinActif && montantGirardin > 0) {
      investissementGirardinEffectif = Math.min(montantGirardin, plafondGirardin);
      creditGirardin = investissementGirardinEffectif * (1 + GIRARDIN_RENDEMENT);
      // Le crédit ne peut pas dépasser l'impôt dû
      creditGirardin = Math.min(creditGirardin, impotApresPER.tax);
      // Impact sur les niches fiscales
      impactNiches = creditGirardin * GIRARDIN_TAUX_NICHES;
    }
    
    return {
      tax: Math.max(0, impotApresPER.tax - creditGirardin),
      tmi: impotApresPER.tmi,
      plafonnementApplique: impotApresPER.plafonnementApplique,
      gainPlafonne: impotApresPER.gainPlafonne,
      deductionPER: deductionPEREffective,
      creditGirardin,
      investissementGirardin: investissementGirardinEffectif,
      impactNiches,
    };
  }, [revenuNet, perActif, montantPER, plafondPER, girardinActif, montantGirardin, plafondGirardin, isCouple, children]);

  const economie = resultatInitial.tax - resultatOptimise.tax;
  const hasOptimisation = perActif || girardinActif;

  // Animated values
  const animatedTaxInitial = useAnimatedCounter(resultatInitial.tax);
  const animatedTaxOptimise = useAnimatedCounter(resultatOptimise.tax);
  const animatedEconomie = useAnimatedCounter(economie);

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(value);

  return (
    <MainLayout title="Simulateur Impôt sur le Revenu 2025">
      <TooltipProvider>
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
                  {resultatInitial.plafonnementApplique && (
                    <span className="block text-amber-600 text-xs mt-1">
                      ⚠️ Plafonnement QF appliqué
                    </span>
                  )}
                </div>
              </div>

              {/* PER - Plan d'Épargne Retraite */}
              <TierLock 
                requiredTier="premium"
                featureName="Optimisation PER"
              >
                <div className="bg-card rounded-3xl p-6 shadow-card">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-500/10 rounded-xl">
                        <PiggyBank className="w-5 h-5 text-emerald-500" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">PER - Épargne Retraite</h3>
                        <p className="text-xs text-muted-foreground">Réduit votre revenu imposable</p>
                      </div>
                    </div>
                    <Switch
                      checked={perActif}
                      onCheckedChange={setPerActif}
                    />
                  </div>

                  {perActif && (
                    <div className="pt-4 border-t border-border space-y-4">
                      <InputSlider
                        label="Versement sur le PER"
                        value={montantPER}
                        onChange={setMontantPER}
                        min={0}
                        max={Math.ceil(plafondPER / 1000) * 1000}
                        step={500}
                        unit="€"
                      />
                      
                      <div className="p-3 bg-muted/50 rounded-xl space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground flex items-center gap-1">
                            Plafond disponible
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="w-3 h-3" />
                              </TooltipTrigger>
                              <TooltipContent className="max-w-xs">
                                <p>10% de vos revenus (min {formatCurrency(PER_PLANCHER)}, max {formatCurrency(PER_PLAFOND_BASE)}) + report des 3 années antérieures</p>
                              </TooltipContent>
                            </Tooltip>
                          </span>
                          <span className="font-medium text-foreground">{formatCurrency(plafondPER)}</span>
                        </div>
                        
                        <InputSlider
                          label="Report années antérieures"
                          value={reportPER}
                          onChange={setReportPER}
                          min={0}
                          max={100000}
                          step={1000}
                          unit="€"
                        />
                      </div>

                      {montantPER > plafondPER && (
                        <div className="flex items-center gap-2 p-2 bg-amber-500/10 text-amber-600 rounded-lg text-xs">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Montant limité au plafond de {formatCurrency(plafondPER)}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </TierLock>

              {/* Girardin - Investissement Outre-Mer */}
              <TierLock 
                requiredTier="premium"
                featureName="Optimisation Girardin"
              >
                <div className="bg-card rounded-3xl p-6 shadow-card">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-500/10 rounded-xl">
                        <Palmtree className="w-5 h-5 text-blue-500" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">Girardin Industriel</h3>
                        <p className="text-xs text-muted-foreground">Crédit d'impôt one-shot (+15%)</p>
                      </div>
                    </div>
                    <Switch
                      checked={girardinActif}
                      onCheckedChange={setGirardinActif}
                    />
                  </div>

                  {girardinActif && (
                    <div className="pt-4 border-t border-border space-y-4">
                      <InputSlider
                        label="Montant investi"
                        value={montantGirardin}
                        onChange={setMontantGirardin}
                        min={0}
                        max={Math.max(1000, Math.ceil(plafondGirardin / 1000) * 1000)}
                        step={500}
                        unit="€"
                      />
                      
                      <div className="p-3 bg-blue-500/10 rounded-xl space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Crédit d'impôt obtenu</span>
                          <span className="font-bold text-blue-500">
                            {formatCurrency(Math.min(montantGirardin, plafondGirardin) * (1 + GIRARDIN_RENDEMENT))}
                          </span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Rendement</span>
                          <span className="text-emerald-500 font-medium">+15%</span>
                        </div>
                      </div>

                      <div className="p-3 bg-muted/50 rounded-xl space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground flex items-center gap-1">
                            Plafond par impôt
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="w-3 h-3" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Le crédit ne peut pas dépasser votre impôt dû</p>
                              </TooltipContent>
                            </Tooltip>
                          </span>
                          <span className="font-medium">{formatCurrency(resultatInitial.tax / (1 + GIRARDIN_RENDEMENT))}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground flex items-center gap-1">
                            Plafond niches fiscales
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="w-3 h-3" />
                              </TooltipTrigger>
                              <TooltipContent className="max-w-xs">
                                <p>Girardin impacte les niches à 41%. Plafond outre-mer : 18 000€ → max crédit ~43 902€</p>
                              </TooltipContent>
                            </Tooltip>
                          </span>
                          <span className="font-medium">{formatCurrency(PLAFOND_NICHES_OUTREMER / GIRARDIN_TAUX_NICHES / (1 + GIRARDIN_RENDEMENT))}</span>
                        </div>
                      </div>

                      {montantGirardin > plafondGirardin && (
                        <div className="flex items-center gap-2 p-2 bg-amber-500/10 text-amber-600 rounded-lg text-xs">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Montant limité à {formatCurrency(plafondGirardin)}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </TierLock>
            </div>

            {/* Colonne Droite - Résultats */}
            <div className="space-y-6">
              {/* TMI Gauge */}
              <div className="bg-card rounded-3xl p-6 shadow-card">
                <h3 className="text-lg font-semibold text-foreground mb-4">Tranche Marginale d'Imposition</h3>
                <TMIGauge tmi={hasOptimisation ? resultatOptimise.tmi : resultatInitial.tmi} />
                
                {(hasOptimisation ? resultatOptimise.tmi : resultatInitial.tmi) >= 30 && (
                  <div className="mt-4 flex items-center gap-2 p-3 bg-amber-500/10 text-amber-600 rounded-xl text-sm">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    <span>Niveau d'imposition élevé - Des solutions existent !</span>
                  </div>
                )}
              </div>

              {/* Comparateur */}
              <div className="bg-card rounded-3xl p-6 shadow-card">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  {hasOptimisation ? "Comparaison" : "Votre impôt"}
                </h3>

                {hasOptimisation ? (
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
                      {resultatInitial.tax > 0 && (
                        <div className="flex items-center justify-center gap-1 mt-2 text-emerald-500 text-sm">
                          <TrendingDown className="w-4 h-4" />
                          <span>-{((economie / resultatInitial.tax) * 100).toFixed(1)}% d'impôt</span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="p-6 bg-muted/50 rounded-2xl text-center">
                    <p className="text-sm text-muted-foreground mb-1">Impôt estimé</p>
                    <p className="text-4xl font-bold text-foreground">
                      {formatCurrency(animatedTaxInitial)}
                    </p>
                    {revenuNet > 0 && (
                      <p className="text-sm text-muted-foreground mt-2">
                        Taux effectif : {((resultatInitial.tax / revenuNet) * 100).toFixed(1)}%
                      </p>
                    )}
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
                  
                  {perActif && resultatOptimise.deductionPER > 0 && (
                    <div className="flex justify-between text-emerald-500">
                      <span>Déduction PER</span>
                      <span className="font-medium">-{formatCurrency(resultatOptimise.deductionPER)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Nombre de parts</span>
                    <span className="font-medium">{parts}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Quotient familial</span>
                    <span className="font-medium">
                      {formatCurrency((perActif ? revenuNet - resultatOptimise.deductionPER : revenuNet) / parts)}
                    </span>
                  </div>

                  {resultatOptimise.plafonnementApplique && (
                    <div className="flex justify-between text-amber-600">
                      <span className="flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        Plafonnement QF
                      </span>
                      <span className="font-medium">+{formatCurrency(resultatOptimise.gainPlafonne)}</span>
                    </div>
                  )}

                  {girardinActif && resultatOptimise.creditGirardin > 0 && (
                    <>
                      <div className="flex justify-between text-blue-500">
                        <span>Crédit Girardin</span>
                        <span className="font-medium">-{formatCurrency(resultatOptimise.creditGirardin)}</span>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Impact niches fiscales</span>
                        <span>{formatCurrency(resultatOptimise.impactNiches)} / {formatCurrency(PLAFOND_NICHES_OUTREMER)}</span>
                      </div>
                    </>
                  )}
                  
                  <div className="border-t border-border pt-2 flex justify-between">
                    <span className="text-muted-foreground">TMI</span>
                    <span className="font-bold text-primary">
                      {hasOptimisation ? resultatOptimise.tmi : resultatInitial.tmi}%
                    </span>
                  </div>
                </div>
              </div>

              {/* CTA */}
              {hasOptimisation && economie > 0 && (
                <Button 
                  className="w-full py-6 text-lg rounded-2xl bg-primary hover:bg-primary/90"
                  onClick={() => {/* Future: ouvrir modal contact */}}
                >
                  Comment réduire mon impôt de {formatCurrency(economie)} ?
                </Button>
              )}

              {/* Save Simulation Button */}
              <div className="flex justify-end">
                <SaveSimulationButton
                  toolType="simulateur-ir"
                  toolLabel="Simulateur IR"
                  parameters={{
                    revenuNet,
                    isCouple,
                    children,
                    perActif,
                    montantPER,
                    reportPER,
                    girardinActif,
                    montantGirardin,
                  }}
                  results={{
                    impot: hasOptimisation ? resultatOptimise.tax : resultatInitial.tax,
                    tmi: hasOptimisation ? resultatOptimise.tmi : resultatInitial.tmi,
                    economie,
                    parts,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Recommended Products */}
        <div className="mt-6">
          <RecommendedProducts
            productIds={["per", "girardin"]}
            title="Comment réduire ce montant ? Nos solutions dédiées :"
          />
        </div>
      </TooltipProvider>
    </MainLayout>
  );
}
