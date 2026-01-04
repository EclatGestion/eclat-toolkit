import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PublicPageLayout } from "@/components/layout/PublicPageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FinancesPersonnellesCard } from "@/components/simulators/bilan/FinancesPersonnellesCard";
import { EpargneInvestissementsCard } from "@/components/simulators/bilan/EpargneInvestissementsCard";
import { ImmobilierCard } from "@/components/simulators/bilan/ImmobilierCard";
import { FiscaliteCard } from "@/components/simulators/bilan/FiscaliteCard";
import { TransmissionCard } from "@/components/simulators/bilan/TransmissionCard";
import { Brain, Lock, ArrowRight, Sparkles } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

const STORAGE_KEY = "eclat_diagnostic_data";

export default function DiagnosticPatrimonial() {
  const navigate = useNavigate();

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

  // Calcul du pourcentage de complétion
  const completionPercentage = useMemo(() => {
    let completed = 0;
    
    // Pilier 1: Finances Personnelles (20%) - revenus > 0
    if (revenus > 0) completed += 20;
    
    // Pilier 2: Épargne & Investissements (20%) - au moins 1 valeur renseignée
    if (liquidites > 0 || assuranceVie > 0 || per > 0 || peaCto > 0) completed += 20;
    
    // Pilier 3: Immobilier (20%) - considéré comme rempli par défaut (0 = pas d'immo)
    completed += 20;
    
    // Pilier 4: Fiscalité (20%) - revenus imposables > 0
    if (revenusImposables > 0) completed += 20;
    
    // Pilier 5: Transmission (20%) - situation familiale renseignée
    if (situationFamiliale) completed += 20;
    
    return completed;
  }, [revenus, liquidites, assuranceVie, per, peaCto, revenusImposables, situationFamiliale]);

  const getProgressMessage = () => {
    if (completionPercentage < 50) return "Complétez les sections pour un diagnostic précis";
    if (completionPercentage < 100) return "Encore quelques informations pour un diagnostic complet";
    return "Formulaire complet ! Débloquez vos résultats";
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

        {/* Dynamic Progress Bar */}
        <motion.div 
          className="sticky top-4 z-20 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-sm border"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Progression du diagnostic
            </span>
            <span className="text-sm font-bold text-primary">
              {completionPercentage}%
            </span>
          </div>
          <div className="relative h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-violet-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${completionPercentage}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {getProgressMessage()}
          </p>
        </motion.div>

        {/* Inputs Section */}
        <Accordion type="multiple" defaultValue={["finances"]} className="space-y-4">
          <AccordionItem value="finances" className="border-0">
            <AccordionTrigger className="bg-white rounded-xl px-4 py-3 hover:no-underline shadow-sm border">
              1. Finances Personnelles
            </AccordionTrigger>
            <AccordionContent className="pt-4">
              <FinancesPersonnellesCard
                revenus={revenus} setRevenus={setRevenus}
                depenses={depenses} setDepenses={setDepenses}
                epargneMensuelle={epargne} setEpargneMensuelle={setEpargne}
                creditsRestants={creditsRestants} setCreditsRestants={setCreditsRestants}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="epargne" className="border-0">
            <AccordionTrigger className="bg-white rounded-xl px-4 py-3 hover:no-underline shadow-sm border">
              2. Épargne & Investissements
            </AccordionTrigger>
            <AccordionContent className="pt-4">
              <EpargneInvestissementsCard
                liquidites={liquidites} setLiquidites={setLiquidites}
                assuranceVie={assuranceVie} setAssuranceVie={setAssuranceVie}
                per={per} setPer={setPer}
                peaCto={peaCto} setPeaCto={setPeaCto}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="immobilier" className="border-0">
            <AccordionTrigger className="bg-white rounded-xl px-4 py-3 hover:no-underline shadow-sm border">
              3. Immobilier
            </AccordionTrigger>
            <AccordionContent className="pt-4">
              <ImmobilierCard
                residencePrincipale={residencePrincipale} setResidencePrincipale={setResidencePrincipale}
                immobilierLocatif={immobilierLocatif} setImmobilierLocatif={setImmobilierLocatif}
                loyersPercus={loyersPercus} setLoyersPercus={setLoyersPercus}
                creditsImmo={creditsImmo} setCreditsImmo={setCreditsImmo}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="fiscalite" className="border-0">
            <AccordionTrigger className="bg-white rounded-xl px-4 py-3 hover:no-underline shadow-sm border">
              4. Fiscalité
            </AccordionTrigger>
            <AccordionContent className="pt-4">
              <FiscaliteCard
                revenusImposables={revenusImposables} setRevenusImposables={setRevenusImposables}
                tmi={tmi} setTmi={setTmi}
                perUtilise={perUtilise} setPerUtilise={setPerUtilise}
                lmnpUtilise={lmnpUtilise} setLmnpUtilise={setLmnpUtilise}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="transmission" className="border-0">
            <AccordionTrigger className="bg-white rounded-xl px-4 py-3 hover:no-underline shadow-sm border">
              5. Transmission & Protection
            </AccordionTrigger>
            <AccordionContent className="pt-4">
              <TransmissionCard
                situationFamiliale={situationFamiliale} setSituationFamiliale={setSituationFamiliale}
                nombreEnfants={nombreEnfants} setNombreEnfants={setNombreEnfants}
                donationsRealisees={donationsRealisees} setDonationsRealisees={setDonationsRealisees}
                assuranceVieBeneficiaire={assuranceVieBeneficiaire} setAssuranceVieBeneficiaire={setAssuranceVieBeneficiaire}
                patrimoineTotal={patrimoineTotal}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Results Section - Conditional display based on data entry */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {hasFilledData ? (
            /* Locked Results Preview with Visual Teasing - Shown when user has entered data */
            <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-violet-500/5 overflow-hidden">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl text-gray-900 flex items-center justify-center gap-2">
                  <motion.div
                    animate={{ rotate: [0, 15, -15, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  >
                    <Sparkles className="w-5 h-5 text-primary" />
                  </motion.div>
                  Vos résultats sont prêts !
                </CardTitle>
                <p className="text-sm text-gray-500 mt-1">Créez un compte gratuit pour les débloquer</p>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Global Score Teaser */}
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-2">Score Patrimonial Global</p>
                  <div className="relative inline-block">
                    <motion.div 
                      className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 to-violet-500/20 flex items-center justify-center mx-auto relative overflow-hidden"
                      animate={{ 
                        boxShadow: [
                          "0 0 0 0 rgba(45, 96, 255, 0)",
                          "0 0 0 12px rgba(45, 96, 255, 0.1)",
                          "0 0 0 0 rgba(45, 96, 255, 0)"
                        ]
                      }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                      {/* Actual score shown blurred */}
                      <motion.div 
                        className="absolute inset-0 flex items-center justify-center blur-md"
                        animate={{ opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <span className="text-5xl font-bold text-primary">{scoreGlobal}</span>
                      </motion.div>
                      {/* Lock overlay */}
                      <div className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-[2px]">
                        <motion.div 
                          className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center"
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        >
                          <Lock className="w-6 h-6 text-gray-400" />
                        </motion.div>
                      </div>
                    </motion.div>
                    <p className="text-xs text-gray-400 mt-2">/100</p>
                  </div>
                </div>

                {/* Pillar Scores Teaser - Blurred but visible */}
                <div className="relative">
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
                          {/* Score circle with blur and pulse */}
                          <motion.div 
                            className={`w-14 h-14 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center mx-auto mb-2 relative overflow-hidden`}
                            animate={{ 
                              scale: [1, 1.08, 1],
                              opacity: [0.9, 1, 0.9]
                            }}
                            transition={{ 
                              duration: 2.5, 
                              repeat: Infinity, 
                              ease: "easeInOut",
                              delay: index * 0.2
                            }}
                          >
                            <span className="text-lg font-bold text-white blur-[3px]">{item.score}</span>
                            {/* Subtle lock overlay */}
                            <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px] flex items-center justify-center">
                              <Lock className="w-4 h-4 text-white/80" />
                            </div>
                          </motion.div>
                        </div>
                        <p className="text-xs text-gray-600 font-medium truncate">{item.label}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Patrimoine Preview */}
                <div className="relative bg-white/50 rounded-xl p-4 border border-gray-200">
                  <p className="text-sm font-medium text-gray-700 mb-3 text-center">Répartition de votre patrimoine</p>
                  <div className="flex items-center justify-center gap-6 relative">
                    {/* Blurred bars with animation */}
                    <div className="flex items-end gap-2 h-20">
                      {[
                        { value: repartitionPatrimoine.immobilier, color: "from-blue-500 to-blue-300", delay: 0 },
                        { value: repartitionPatrimoine.financier, color: "from-emerald-500 to-emerald-300", delay: 0.1 },
                        { value: repartitionPatrimoine.liquidites, color: "from-amber-500 to-amber-300", delay: 0.2 },
                      ].map((bar, index) => (
                        <motion.div 
                          key={index}
                          className={`w-16 bg-gradient-to-t ${bar.color} rounded-t-lg blur-[2px]`}
                          initial={{ height: 0 }}
                          animate={{ height: `${Math.max(20, bar.value)}%` }}
                          transition={{ duration: 0.8, delay: 0.5 + bar.delay, ease: "easeOut" }}
                        />
                      ))}
                    </div>
                    {/* Lock overlay */}
                    <motion.div 
                      className="absolute inset-0 flex items-center justify-center bg-white/30 backdrop-blur-[1px] rounded-xl"
                      animate={{ opacity: [0.8, 1, 0.8] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <div className="flex items-center gap-2 text-gray-500 text-sm">
                        <Lock className="w-4 h-4" />
                        <span>Débloquez l'analyse</span>
                      </div>
                    </motion.div>
                  </div>
                  <div className="flex justify-center gap-4 mt-3 text-xs text-gray-400">
                    <span>Immobilier</span>
                    <span>Financier</span>
                    <span>Liquidités</span>
                  </div>
                </div>

                {/* CTA Section */}
                <div className="text-center space-y-4 pt-2">
                  <motion.div
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button onClick={handleViewResults} size="lg" className="gap-2 px-8 shadow-lg">
                      Débloquer mes résultats gratuitement
                      <motion.div
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <ArrowRight className="w-4 h-4" />
                      </motion.div>
                    </Button>
                  </motion.div>
                  <p className="text-xs text-gray-400">
                    ✓ Gratuit · ✓ Sans engagement · ✓ Données sauvegardées
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
