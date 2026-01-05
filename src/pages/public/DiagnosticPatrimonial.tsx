import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PublicPageLayout } from "@/components/layout/PublicPageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FinancesPersonnellesCard } from "@/components/simulators/bilan/FinancesPersonnellesCard";
import { EpargneInvestissementsCard } from "@/components/simulators/bilan/EpargneInvestissementsCard";
import { ImmobilierCard } from "@/components/simulators/bilan/ImmobilierCard";
import { FiscaliteCard } from "@/components/simulators/bilan/FiscaliteCard";
import { TransmissionCard } from "@/components/simulators/bilan/TransmissionCard";
import { ScoreRadarChart } from "@/components/simulators/bilan/ScoreRadarChart";
import { PatrimoineDonutChart } from "@/components/simulators/bilan/PatrimoineDonutChart";
import { Brain, Lock, ArrowRight, ArrowLeft, Check, Sparkles, UserPlus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const STORAGE_KEY = "eclat_diagnostic_data";

const STEPS = [
  { id: 1, label: "Finances Personnelles", shortLabel: "Finances" },
  { id: 2, label: "Épargne & Investissements", shortLabel: "Épargne" },
  { id: 3, label: "Immobilier", shortLabel: "Immo" },
  { id: 4, label: "Fiscalité", shortLabel: "Fiscal" },
  { id: 5, label: "Transmission", shortLabel: "Transm." },
  { id: 6, label: "Mes Résultats", shortLabel: "Résultats" },
];

export default function DiagnosticPatrimonial() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  
  // Finances personnelles
  const [revenus, setRevenus] = useState(4000);
  const [depenses, setDepenses] = useState(2500);
  const [epargne, setEpargne] = useState(500);
  const [creditsRestants, setCreditsRestants] = useState(0);

  // Épargne & Investissements
  const [liquidites, setLiquidites] = useState(15000);
  const [assuranceVie, setAssuranceVie] = useState(0);
  const [per, setPer] = useState(0);
  const [peaCto, setPeaCto] = useState(0);

  // Immobilier
  const [residencePrincipale, setResidencePrincipale] = useState(0);
  const [immobilierLocatif, setImmobilierLocatif] = useState(0);
  const [loyersPercus, setLoyersPercus] = useState(0);
  const [creditsImmo, setCreditsImmo] = useState(0);

  // Fiscalité
  const [revenusImposables, setRevenusImposables] = useState(revenus * 12);
  const [tmi, setTmi] = useState(30);
  const [perUtilise, setPerUtilise] = useState(false);
  const [lmnpUtilise, setLmnpUtilise] = useState(false);

  // Transmission
  const [situationFamiliale, setSituationFamiliale] = useState("marie");
  const [nombreEnfants, setNombreEnfants] = useState(2);
  const [donationsRealisees, setDonationsRealisees] = useState(0);
  const [assuranceVieBeneficiaire, setAssuranceVieBeneficiaire] = useState(false);

  // Calculs dérivés
  const patrimoineTotal = useMemo(() => {
    return liquidites + assuranceVie + per + peaCto + residencePrincipale + immobilierLocatif - creditsImmo;
  }, [liquidites, assuranceVie, per, peaCto, residencePrincipale, immobilierLocatif, creditsImmo]);

  const patrimoineImmobilier = useMemo(() => {
    return residencePrincipale + immobilierLocatif - creditsImmo;
  }, [residencePrincipale, immobilierLocatif, creditsImmo]);

  const patrimoineFinancier = useMemo(() => {
    return assuranceVie + per + peaCto;
  }, [assuranceVie, per, peaCto]);

  // Calcul des scores (même logique que BilanPatrimonialAvance)
  const scores = useMemo(() => {
    const tauxEpargne = revenus > 0 ? (epargne / revenus) * 100 : 0;
    const tauxEndettement = revenus > 0 ? (creditsRestants / (revenus * 12)) * 100 : 0;
    const financesScore = Math.min(100, Math.max(0, tauxEpargne * 3 + (100 - tauxEndettement) * 0.7));
    
    const diversification = [liquidites, assuranceVie, per, peaCto].filter((v) => v > 0).length;
    const epargneScore = Math.min(100, diversification * 20 + (patrimoineTotal > 100000 ? 20 : patrimoineTotal / 5000));
    
    const ratioImmo = patrimoineTotal > 0 ? (patrimoineImmobilier / patrimoineTotal) * 100 : 0;
    const rendementLocatif = immobilierLocatif > 0 ? (loyersPercus * 12 / immobilierLocatif) * 100 : 0;
    const immobilierScore = Math.min(100, (ratioImmo >= 30 && ratioImmo <= 60 ? 50 : 30) + Math.min(50, rendementLocatif * 8));
    
    let fiscaliteScore = 40;
    if (perUtilise) fiscaliteScore += 25;
    if (lmnpUtilise) fiscaliteScore += 25;
    if (tmi <= 11) fiscaliteScore += 10;
    
    let transmissionScore = 20;
    if (assuranceVieBeneficiaire) transmissionScore += 30;
    if (donationsRealisees > 0) transmissionScore += 25;
    if (nombreEnfants > 0) transmissionScore += 15;
    if (situationFamiliale === "marie" || situationFamiliale === "pacse") transmissionScore += 10;

    return {
      finances: Math.round(Math.min(100, financesScore)),
      epargne: Math.round(Math.min(100, epargneScore)),
      immobilier: Math.round(Math.min(100, immobilierScore)),
      fiscalite: Math.round(Math.min(100, fiscaliteScore)),
      transmission: Math.round(Math.min(100, transmissionScore)),
    };
  }, [revenus, epargne, creditsRestants, liquidites, assuranceVie, per, peaCto, patrimoineTotal, patrimoineImmobilier, immobilierLocatif, loyersPercus, perUtilise, lmnpUtilise, tmi, assuranceVieBeneficiaire, donationsRealisees, nombreEnfants, situationFamiliale]);

  const scoreGlobal = Math.round(
    (scores.finances + scores.epargne + scores.immobilier + scores.fiscalite + scores.transmission) / 5
  );

  // Calcul du pourcentage de complétion basé sur l'étape actuelle
  const completionPercentage = useMemo(() => {
    // 6 étapes : chaque étape = ~16.67%, on arrondit
    return Math.round((currentStep / 6) * 100);
  }, [currentStep]);

  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleStepClick = (stepId: number) => {
    if (stepId <= currentStep) {
      setCurrentStep(stepId);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Sauvegarder les données dans localStorage à chaque changement
  useEffect(() => {
    const data = {
      revenus,
      depenses,
      epargne,
      creditsRestants,
      liquidites,
      assuranceVie,
      per,
      peaCto,
      residencePrincipale,
      immobilierLocatif,
      loyersPercus,
      creditsImmo,
      revenusImposables,
      tmi,
      perUtilise,
      lmnpUtilise,
      situationFamiliale,
      nombreEnfants,
      donationsRealisees,
      assuranceVieBeneficiaire,
      patrimoineTotal,
      scores,
      scoreGlobal,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [revenus, depenses, epargne, creditsRestants, liquidites, assuranceVie, per, peaCto, residencePrincipale, immobilierLocatif, loyersPercus, creditsImmo, revenusImposables, tmi, perUtilise, lmnpUtilise, situationFamiliale, nombreEnfants, donationsRealisees, assuranceVieBeneficiaire, patrimoineTotal, scores, scoreGlobal]);

  const handleUnlockIA = () => {
    navigate("/auth?redirect=/tools/bilan-patrimonial&restore=true");
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-emerald-500";
    if (score >= 50) return "text-amber-500";
    return "text-red-500";
  };

  return (
    <PublicPageLayout
      title="Diagnostic Patrimonial Gratuit | Éclat Toolkit"
      description="Analysez votre situation patrimoniale en 5 minutes. Remplissez le formulaire et découvrez votre score personnalisé."
    >
      <div className="space-y-8 pb-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-2xl mx-auto"
        >
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Brain className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            Votre Diagnostic Patrimonial Gratuit
          </h1>
          <p className="text-muted-foreground">
            Renseignez vos informations financières et découvrez votre score patrimonial personnalisé avec des recommandations sur mesure.
          </p>
        </motion.div>

        {/* Step Progress Indicator */}
        <motion.div
          className="sticky top-4 z-20 bg-background/95 backdrop-blur-sm rounded-xl p-4 shadow-sm border"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Progress bar */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-foreground">
              Étape {currentStep} sur 6
            </span>
            <span className="text-sm font-bold text-primary">{completionPercentage}%</span>
          </div>
          <div className="relative h-2 bg-muted rounded-full overflow-hidden mb-4">
            <motion.div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-violet-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${completionPercentage}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>

          {/* Step indicators */}
          <div className="flex items-center justify-between">
            {STEPS.map((step) => {
              const isCompleted = currentStep > step.id;
              const isCurrent = currentStep === step.id;
              const isClickable = step.id <= currentStep;

              return (
                <div key={step.id} className="flex flex-col items-center flex-1">
                  <button
                    onClick={() => handleStepClick(step.id)}
                    disabled={!isClickable}
                    className={`
                      w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all
                      ${isCompleted
                        ? "bg-primary text-primary-foreground cursor-pointer hover:bg-primary/90"
                        : isCurrent
                        ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                        : "bg-muted text-muted-foreground cursor-not-allowed"
                      }
                    `}
                  >
                    {isCompleted ? <Check className="w-4 h-4" /> : step.id}
                  </button>
                  <span
                    className={`text-[10px] sm:text-xs mt-1 ${
                      isCurrent ? "text-primary font-medium" : "text-muted-foreground"
                    }`}
                  >
                    <span className="hidden sm:inline">{step.label}</span>
                    <span className="sm:hidden">{step.shortLabel}</span>
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {currentStep === 1 && (
              <Card className="border shadow-sm">
                <CardContent className="pt-6">
                  <h2 className="text-lg font-semibold mb-4">1. Finances Personnelles</h2>
                  <FinancesPersonnellesCard
                    revenus={revenus}
                    setRevenus={setRevenus}
                    depenses={depenses}
                    setDepenses={setDepenses}
                    epargneMensuelle={epargne}
                    setEpargneMensuelle={setEpargne}
                    creditsRestants={creditsRestants}
                    setCreditsRestants={setCreditsRestants}
                  />
                </CardContent>
              </Card>
            )}

            {currentStep === 2 && (
              <Card className="border shadow-sm">
                <CardContent className="pt-6">
                  <h2 className="text-lg font-semibold mb-4">2. Épargne & Investissements</h2>
                  <EpargneInvestissementsCard
                    liquidites={liquidites}
                    setLiquidites={setLiquidites}
                    assuranceVie={assuranceVie}
                    setAssuranceVie={setAssuranceVie}
                    per={per}
                    setPer={setPer}
                    peaCto={peaCto}
                    setPeaCto={setPeaCto}
                  />
                </CardContent>
              </Card>
            )}

            {currentStep === 3 && (
              <Card className="border shadow-sm">
                <CardContent className="pt-6">
                  <h2 className="text-lg font-semibold mb-4">3. Immobilier</h2>
                  <ImmobilierCard
                    residencePrincipale={residencePrincipale}
                    setResidencePrincipale={setResidencePrincipale}
                    immobilierLocatif={immobilierLocatif}
                    setImmobilierLocatif={setImmobilierLocatif}
                    loyersPercus={loyersPercus}
                    setLoyersPercus={setLoyersPercus}
                    creditsImmo={creditsImmo}
                    setCreditsImmo={setCreditsImmo}
                  />
                </CardContent>
              </Card>
            )}

            {currentStep === 4 && (
              <Card className="border shadow-sm">
                <CardContent className="pt-6">
                  <h2 className="text-lg font-semibold mb-4">4. Fiscalité</h2>
                  <FiscaliteCard
                    revenusImposables={revenusImposables}
                    setRevenusImposables={setRevenusImposables}
                    tmi={tmi}
                    setTmi={setTmi}
                    perUtilise={perUtilise}
                    setPerUtilise={setPerUtilise}
                    lmnpUtilise={lmnpUtilise}
                    setLmnpUtilise={setLmnpUtilise}
                  />
                </CardContent>
              </Card>
            )}

            {currentStep === 5 && (
              <Card className="border shadow-sm">
                <CardContent className="pt-6">
                  <h2 className="text-lg font-semibold mb-4">5. Transmission & Protection</h2>
                  <TransmissionCard
                    situationFamiliale={situationFamiliale}
                    setSituationFamiliale={setSituationFamiliale}
                    nombreEnfants={nombreEnfants}
                    setNombreEnfants={setNombreEnfants}
                    donationsRealisees={donationsRealisees}
                    setDonationsRealisees={setDonationsRealisees}
                    assuranceVieBeneficiaire={assuranceVieBeneficiaire}
                    setAssuranceVieBeneficiaire={setAssuranceVieBeneficiaire}
                    patrimoineTotal={patrimoineTotal}
                  />
                </CardContent>
              </Card>
            )}

            {/* Step 6: Results */}
            {currentStep === 6 && (
              <div className="space-y-6">
                {/* Congratulations Header */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-center"
                >
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-violet-500/20 flex items-center justify-center mx-auto mb-4">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    >
                      <Check className="w-10 h-10 text-primary" />
                    </motion.div>
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    Diagnostic terminé !
                  </h2>
                  <p className="text-muted-foreground">
                    Voici votre situation patrimoniale en détail
                  </p>
                </motion.div>

                {/* Score Global Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Card className="border-0 shadow-lg bg-gradient-to-br from-background to-primary/5">
                    <CardContent className="pt-6">
                      <ScoreRadarChart
                        financesScore={scores.finances}
                        epargneScore={scores.epargne}
                        immobilierScore={scores.immobilier}
                        fiscaliteScore={scores.fiscalite}
                        transmissionScore={scores.transmission}
                      />
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Patrimoine Distribution */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Card className="border-0 shadow-lg">
                    <CardContent className="pt-6">
                      <PatrimoineDonutChart
                        immobilier={patrimoineImmobilier}
                        financier={patrimoineFinancier}
                        liquidites={liquidites}
                      />
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Quick Insights */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="grid grid-cols-2 md:grid-cols-4 gap-3"
                >
                  <Card className="border-0 shadow-sm bg-card">
                    <CardContent className="p-4 text-center">
                      <div className="text-xs text-muted-foreground mb-1">Score Global</div>
                      <div className={`text-2xl font-bold ${getScoreColor(scoreGlobal)}`}>
                        {scoreGlobal}/100
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-0 shadow-sm bg-card">
                    <CardContent className="p-4 text-center">
                      <div className="text-xs text-muted-foreground mb-1">Patrimoine</div>
                      <div className="text-2xl font-bold text-primary">
                        {patrimoineTotal >= 1000000
                          ? `${(patrimoineTotal / 1000000).toFixed(1)}M€`
                          : `${(patrimoineTotal / 1000).toFixed(0)}k€`}
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-0 shadow-sm bg-card">
                    <CardContent className="p-4 text-center">
                      <div className="text-xs text-muted-foreground mb-1">Épargne/mois</div>
                      <div className="text-2xl font-bold text-emerald-500">
                        {epargne.toLocaleString("fr-FR")}€
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-0 shadow-sm bg-card">
                    <CardContent className="p-4 text-center">
                      <div className="text-xs text-muted-foreground mb-1">TMI</div>
                      <div className="text-2xl font-bold text-amber-500">{tmi}%</div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Locked AI Analysis Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Card className="border-2 border-dashed border-primary/30 bg-gradient-to-br from-primary/5 via-violet-500/5 to-primary/5 overflow-hidden relative">
                    {/* Blur overlay */}
                    <div className="absolute inset-0 backdrop-blur-sm bg-background/30 z-10 flex flex-col items-center justify-center p-6">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5, type: "spring" }}
                        className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center mb-4 shadow-lg"
                      >
                        <Sparkles className="w-8 h-8 text-white" />
                      </motion.div>
                      <h3 className="text-xl font-bold text-foreground mb-2 text-center">
                        Débloquez l'analyse IA personnalisée
                      </h3>
                      <p className="text-muted-foreground text-center max-w-md mb-6">
                        Créez un compte gratuit pour obtenir des recommandations personnalisées, 
                        un plan d'action sur 12 mois et des conseils d'optimisation fiscale.
                      </p>
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          onClick={handleUnlockIA}
                          size="lg"
                          className="gap-2 px-8 py-6 text-base shadow-xl bg-gradient-to-r from-primary to-violet-600 hover:from-primary/90 hover:to-violet-600/90"
                        >
                          <UserPlus className="w-5 h-5" />
                          Créer mon compte gratuit
                          <ArrowRight className="w-5 h-5" />
                        </Button>
                      </motion.div>
                      <p className="text-xs text-muted-foreground mt-3">
                        Gratuit · Sans engagement · Données sécurisées
                      </p>
                    </div>

                    {/* Blurred preview content */}
                    <CardContent className="pt-6 pb-8 opacity-50">
                      <div className="flex items-center gap-2 mb-4">
                        <Sparkles className="w-5 h-5 text-primary" />
                        <h3 className="font-semibold">Synthèse IA</h3>
                      </div>
                      <div className="space-y-3">
                        <div className="h-4 bg-muted rounded w-full" />
                        <div className="h-4 bg-muted rounded w-5/6" />
                        <div className="h-4 bg-muted rounded w-4/5" />
                      </div>
                      <div className="mt-6 grid grid-cols-3 gap-4">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="p-4 rounded-xl bg-muted/50">
                            <div className="h-3 bg-muted rounded w-1/2 mb-2" />
                            <div className="h-6 bg-muted rounded w-3/4" />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* CTA Section - End of Diagnostic */}
                {revenus > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-8 p-6 rounded-xl bg-gradient-to-r from-primary/10 to-violet-500/10 border border-primary/20"
                  >
                    <div className="text-center">
                      <h3 className="text-lg font-semibold mb-2">
                        Prêt à passer à l'action ?
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4">
                        Créez votre compte pour sauvegarder votre diagnostic et accéder à votre espace personnalisé.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Button onClick={handleUnlockIA} className="gap-2">
                          <UserPlus className="w-4 h-4" />
                          Créer mon compte et sauvegarder
                        </Button>
                        <Button variant="outline" onClick={() => setCurrentStep(1)}>
                          Modifier mes données
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-4">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Précédent
              </Button>

              {currentStep < 5 ? (
                <Button onClick={handleNext} className="gap-2">
                  Suivant
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : currentStep === 5 ? (
                <Button
                  onClick={handleNext}
                  className="gap-2 bg-gradient-to-r from-primary to-violet-600 hover:from-primary/90 hover:to-violet-600/90"
                >
                  Voir mes résultats
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : null}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </PublicPageLayout>
  );
}
