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
import { Brain, Lock, ArrowRight, ArrowLeft, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const STORAGE_KEY = "eclat_diagnostic_data";

const STEPS = [
  { id: 1, label: "Finances Personnelles", shortLabel: "Finances" },
  { id: 2, label: "Épargne & Investissements", shortLabel: "Épargne" },
  { id: 3, label: "Immobilier", shortLabel: "Immo" },
  { id: 4, label: "Fiscalité", shortLabel: "Fiscal" },
  { id: 5, label: "Transmission", shortLabel: "Transm." },
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

  const repartitionPatrimoine = useMemo(() => {
    const immo = residencePrincipale + immobilierLocatif - creditsImmo;
    const financier = assuranceVie + per + peaCto;
    const total = immo + financier + liquidites;
    return {
      immobilier: total > 0 ? Math.round((immo / total) * 100) : 0,
      financier: total > 0 ? Math.round((financier / total) * 100) : 0,
      liquidites: total > 0 ? Math.round((liquidites / total) * 100) : 0,
    };
  }, [residencePrincipale, immobilierLocatif, creditsImmo, assuranceVie, per, peaCto, liquidites]);

  // Calcul des scores (même logique que BilanPatrimonialAvance)
  const scores = useMemo(() => {
    const tauxEpargne = revenus > 0 ? (epargne / revenus) * 100 : 0;
    const tauxEndettement = revenus > 0 ? (creditsRestants / (revenus * 12)) * 100 : 0;
    
    const financesScore = Math.min(100, Math.max(0, tauxEpargne * 3 + (100 - tauxEndettement) * 0.7));
    
    const diversification = [liquidites, assuranceVie, per, peaCto].filter(v => v > 0).length;
    const epargneScore = Math.min(100, diversification * 20 + (patrimoineTotal > 100000 ? 20 : patrimoineTotal / 5000));
    
    const ratioImmo = repartitionPatrimoine.immobilier;
    const rendementLocatif = immobilierLocatif > 0 ? (loyersPercus * 12) / immobilierLocatif * 100 : 0;
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
  }, [revenus, epargne, creditsRestants, liquidites, assuranceVie, per, peaCto, patrimoineTotal, repartitionPatrimoine, immobilierLocatif, loyersPercus, perUtilise, lmnpUtilise, tmi, assuranceVieBeneficiaire, donationsRealisees, nombreEnfants, situationFamiliale]);

  const scoreGlobal = Math.round((scores.finances + scores.epargne + scores.immobilier + scores.fiscalite + scores.transmission) / 5);

  // Déterminer si l'utilisateur a saisi des données significatives
  const hasFilledData = useMemo(() => {
    const defaultRevenus = 4000;
    const defaultDepenses = 2500;
    const defaultEpargne = 500;
    const defaultLiquidites = 15000;
    const defaultSituationFamiliale = "marie";
    const defaultNombreEnfants = 2;
    
    const hasChangedDefaults = 
      revenus !== defaultRevenus ||
      depenses !== defaultDepenses ||
      epargne !== defaultEpargne ||
      liquidites !== defaultLiquidites ||
      situationFamiliale !== defaultSituationFamiliale ||
      nombreEnfants !== defaultNombreEnfants;
    
    const hasAddedValues = 
      assuranceVie > 0 ||
      per > 0 ||
      peaCto > 0 ||
      residencePrincipale > 0 ||
      immobilierLocatif > 0 ||
      loyersPercus > 0 ||
      creditsImmo > 0 ||
      creditsRestants > 0 ||
      donationsRealisees > 0 ||
      perUtilise ||
      lmnpUtilise ||
      assuranceVieBeneficiaire;
    
    return hasChangedDefaults || hasAddedValues;
  }, [revenus, depenses, epargne, liquidites, situationFamiliale, nombreEnfants, assuranceVie, per, peaCto, residencePrincipale, immobilierLocatif, loyersPercus, creditsImmo, creditsRestants, donationsRealisees, perUtilise, lmnpUtilise, assuranceVieBeneficiaire]);

  // Calcul du pourcentage de complétion basé sur l'étape actuelle
  const completionPercentage = useMemo(() => {
    return currentStep * 20;
  }, [currentStep]);

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleStepClick = (stepId: number) => {
    if (stepId <= currentStep) {
      setCurrentStep(stepId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Sauvegarder les données dans localStorage à chaque changement
  useEffect(() => {
    const data = {
      revenus, depenses, epargne, creditsRestants,
      liquidites, assuranceVie, per, peaCto,
      residencePrincipale, immobilierLocatif, loyersPercus, creditsImmo,
      revenusImposables, tmi, perUtilise, lmnpUtilise,
      situationFamiliale, nombreEnfants, donationsRealisees, assuranceVieBeneficiaire,
      patrimoineTotal,
      scores,
      scoreGlobal,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [revenus, depenses, epargne, creditsRestants, liquidites, assuranceVie, per, peaCto, residencePrincipale, immobilierLocatif, loyersPercus, creditsImmo, revenusImposables, tmi, perUtilise, lmnpUtilise, situationFamiliale, nombreEnfants, donationsRealisees, assuranceVieBeneficiaire, patrimoineTotal, scores, scoreGlobal]);

  const handleViewResults = () => {
    navigate("/auth?redirect=/tools/bilan-patrimonial&restore=true");
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
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            Votre Diagnostic Patrimonial Gratuit
          </h1>
          <p className="text-gray-600">
            Renseignez vos informations financières et découvrez votre score patrimonial personnalisé avec des recommandations sur mesure.
          </p>
        </motion.div>

        {/* Step Progress Indicator */}
        <motion.div 
          className="sticky top-4 z-20 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-sm border"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Progress bar */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-700">
              Étape {currentStep} sur 5
            </span>
            <span className="text-sm font-bold text-primary">
              {completionPercentage}%
            </span>
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
            {STEPS.map((step, index) => {
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
                        ? "bg-primary text-white cursor-pointer hover:bg-primary/90" 
                        : isCurrent 
                          ? "bg-primary text-white ring-4 ring-primary/20" 
                          : "bg-muted text-muted-foreground cursor-not-allowed"
                      }
                    `}
                  >
                    {isCompleted ? <Check className="w-4 h-4" /> : step.id}
                  </button>
                  <span className={`text-[10px] sm:text-xs mt-1 ${isCurrent ? "text-primary font-medium" : "text-muted-foreground"}`}>
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
                    revenus={revenus} setRevenus={setRevenus}
                    depenses={depenses} setDepenses={setDepenses}
                    epargneMensuelle={epargne} setEpargneMensuelle={setEpargne}
                    creditsRestants={creditsRestants} setCreditsRestants={setCreditsRestants}
                  />
                </CardContent>
              </Card>
            )}
            
            {currentStep === 2 && (
              <Card className="border shadow-sm">
                <CardContent className="pt-6">
                  <h2 className="text-lg font-semibold mb-4">2. Épargne & Investissements</h2>
                  <EpargneInvestissementsCard
                    liquidites={liquidites} setLiquidites={setLiquidites}
                    assuranceVie={assuranceVie} setAssuranceVie={setAssuranceVie}
                    per={per} setPer={setPer}
                    peaCto={peaCto} setPeaCto={setPeaCto}
                  />
                </CardContent>
              </Card>
            )}
            
            {currentStep === 3 && (
              <Card className="border shadow-sm">
                <CardContent className="pt-6">
                  <h2 className="text-lg font-semibold mb-4">3. Immobilier</h2>
                  <ImmobilierCard
                    residencePrincipale={residencePrincipale} setResidencePrincipale={setResidencePrincipale}
                    immobilierLocatif={immobilierLocatif} setImmobilierLocatif={setImmobilierLocatif}
                    loyersPercus={loyersPercus} setLoyersPercus={setLoyersPercus}
                    creditsImmo={creditsImmo} setCreditsImmo={setCreditsImmo}
                  />
                </CardContent>
              </Card>
            )}
            
            {currentStep === 4 && (
              <Card className="border shadow-sm">
                <CardContent className="pt-6">
                  <h2 className="text-lg font-semibold mb-4">4. Fiscalité</h2>
                  <FiscaliteCard
                    revenusImposables={revenusImposables} setRevenusImposables={setRevenusImposables}
                    tmi={tmi} setTmi={setTmi}
                    perUtilise={perUtilise} setPerUtilise={setPerUtilise}
                    lmnpUtilise={lmnpUtilise} setLmnpUtilise={setLmnpUtilise}
                  />
                </CardContent>
              </Card>
            )}
            
            {currentStep === 5 && (
              <Card className="border shadow-sm">
                <CardContent className="pt-6">
                  <h2 className="text-lg font-semibold mb-4">5. Transmission & Protection</h2>
                  <TransmissionCard
                    situationFamiliale={situationFamiliale} setSituationFamiliale={setSituationFamiliale}
                    nombreEnfants={nombreEnfants} setNombreEnfants={setNombreEnfants}
                    donationsRealisees={donationsRealisees} setDonationsRealisees={setDonationsRealisees}
                    assuranceVieBeneficiaire={assuranceVieBeneficiaire} setAssuranceVieBeneficiaire={setAssuranceVieBeneficiaire}
                    patrimoineTotal={patrimoineTotal}
                  />
                </CardContent>
              </Card>
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
              ) : (
                <div /> // Empty div for spacing on last step
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Results Section - Conditional display based on data entry */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {hasFilledData ? (
            /* Locked Results Preview with Visual Teasing - Shown when user has entered data */
            <Card className="border border-primary/20 bg-gradient-to-br from-white to-primary/5 overflow-hidden">
              <CardContent className="pt-6 space-y-6">
                {/* Pillar Scores Teaser - Blurred but visible */}
                <div className="grid grid-cols-5 gap-3 max-w-lg mx-auto">
                  {[
                    { label: "Finances", score: scores.finances, color: "from-blue-400 to-blue-600", delay: 0 },
                    { label: "Épargne", score: scores.epargne, color: "from-emerald-400 to-emerald-600", delay: 0.1 },
                    { label: "Immobilier", score: scores.immobilier, color: "from-amber-400 to-amber-600", delay: 0.2 },
                    { label: "Fiscalité", score: scores.fiscalite, color: "from-rose-400 to-rose-600", delay: 0.3 },
                    { label: "Transmission", score: scores.transmission, color: "from-violet-400 to-violet-600", delay: 0.4 },
                  ].map((item, index) => (
                    <motion.div 
                      key={item.label} 
                      className="text-center"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.3 + item.delay }}
                    >
                      <div className="relative">
                        <motion.div 
                          className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center mx-auto mb-2 relative overflow-hidden`}
                          animate={{ 
                            scale: [1, 1.05, 1],
                            opacity: [0.9, 1, 0.9]
                          }}
                          transition={{ 
                            duration: 2.5, 
                            repeat: Infinity, 
                            ease: "easeInOut",
                            delay: index * 0.2
                          }}
                        >
                          <span className="text-base sm:text-lg font-bold text-white blur-[3px]">{item.score}</span>
                          <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px] flex items-center justify-center">
                            <Lock className="w-3 h-3 sm:w-4 sm:h-4 text-white/80" />
                          </div>
                        </motion.div>
                      </div>
                      <p className="text-[10px] sm:text-xs text-gray-600 font-medium truncate">{item.label}</p>
                    </motion.div>
                  ))}
                </div>

                {/* CTA Section - Modern & Clean */}
                <div className="text-center pt-4">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button 
                      onClick={handleViewResults} 
                      size="lg" 
                      className="gap-2 px-8 py-6 text-base shadow-xl bg-gradient-to-r from-primary to-violet-600 hover:from-primary/90 hover:to-violet-600/90"
                    >
                      <Lock className="w-4 h-4" />
                      Débloquer mes résultats
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </motion.div>
                  <p className="text-xs text-muted-foreground mt-3">
                    Gratuit · Sans engagement
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            /* Placeholder when no data has been entered yet */
            <Card className="border border-dashed border-gray-300 bg-gray-50/50">
              <CardContent className="py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto">
                  <Lock className="w-8 h-8 text-gray-400" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-700">Complétez votre diagnostic</h3>
                  <p className="text-sm text-gray-500 max-w-md mx-auto">
                    Remplissez les sections ci-dessus pour découvrir votre score patrimonial personnalisé et recevoir des recommandations sur mesure.
                  </p>
                </div>
                <div className="flex items-center justify-center gap-4 pt-4 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-gray-300" />
                    Score global
                  </span>
                  <span className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-gray-300" />
                    5 piliers analysés
                  </span>
                  <span className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-gray-300" />
                    Recommandations IA
                  </span>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </PublicPageLayout>
  );
}
