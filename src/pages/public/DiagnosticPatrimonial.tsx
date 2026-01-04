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
import { Brain, Lock, ArrowRight, Sparkles, ChevronRight } from "lucide-react";
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

        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
          <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-medium">1</span>
          <span className="text-primary font-medium">Remplir le formulaire</span>
          <ChevronRight className="w-4 h-4" />
          <span className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-medium">2</span>
          <span>Créer un compte</span>
          <ChevronRight className="w-4 h-4" />
          <span className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-medium">3</span>
          <span>Voir mes résultats</span>
        </div>

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

        {/* Locked Results Preview with Visual Teasing */}
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-violet-500/5 overflow-hidden">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl text-gray-900 flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Vos résultats sont prêts !
            </CardTitle>
            <p className="text-sm text-gray-500 mt-1">Créez un compte gratuit pour les débloquer</p>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Global Score Teaser */}
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-2">Score Patrimonial Global</p>
              <div className="relative inline-block">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 to-violet-500/20 flex items-center justify-center mx-auto relative overflow-hidden">
                  {/* Actual score shown blurred */}
                  <div className="absolute inset-0 flex items-center justify-center blur-md">
                    <span className="text-5xl font-bold text-primary">{scoreGlobal}</span>
                  </div>
                  {/* Lock overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-[2px]">
                    <div className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center">
                      <Lock className="w-6 h-6 text-gray-400" />
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-2">/100</p>
              </div>
            </div>

            {/* Pillar Scores Teaser - Blurred but visible */}
            <div className="relative">
              <div className="grid grid-cols-5 gap-3 max-w-lg mx-auto">
                {[
                  { label: "Finances", score: scores.finances, color: "from-blue-400 to-blue-600" },
                  { label: "Épargne", score: scores.epargne, color: "from-emerald-400 to-emerald-600" },
                  { label: "Immobilier", score: scores.immobilier, color: "from-amber-400 to-amber-600" },
                  { label: "Fiscalité", score: scores.fiscalite, color: "from-rose-400 to-rose-600" },
                  { label: "Transmission", score: scores.transmission, color: "from-violet-400 to-violet-600" },
                ].map((item) => (
                  <div key={item.label} className="text-center">
                    <div className="relative">
                      {/* Score circle with blur */}
                      <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center mx-auto mb-2 relative overflow-hidden`}>
                        <span className="text-lg font-bold text-white blur-[3px]">{item.score}</span>
                        {/* Subtle lock overlay */}
                        <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px] flex items-center justify-center">
                          <Lock className="w-4 h-4 text-white/80" />
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 font-medium truncate">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Patrimoine Preview */}
            <div className="relative bg-white/50 rounded-xl p-4 border border-gray-200">
              <p className="text-sm font-medium text-gray-700 mb-3 text-center">Répartition de votre patrimoine</p>
              <div className="flex items-center justify-center gap-6 relative">
                {/* Blurred bars */}
                <div className="flex items-end gap-2 h-20">
                  <div className="w-16 bg-gradient-to-t from-blue-500 to-blue-300 rounded-t-lg blur-[2px]" style={{ height: `${Math.max(20, repartitionPatrimoine.immobilier)}%` }} />
                  <div className="w-16 bg-gradient-to-t from-emerald-500 to-emerald-300 rounded-t-lg blur-[2px]" style={{ height: `${Math.max(20, repartitionPatrimoine.financier)}%` }} />
                  <div className="w-16 bg-gradient-to-t from-amber-500 to-amber-300 rounded-t-lg blur-[2px]" style={{ height: `${Math.max(20, repartitionPatrimoine.liquidites)}%` }} />
                </div>
                {/* Lock overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-white/30 backdrop-blur-[1px] rounded-xl">
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <Lock className="w-4 h-4" />
                    <span>Débloquez l'analyse</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-center gap-4 mt-3 text-xs text-gray-400">
                <span>Immobilier</span>
                <span>Financier</span>
                <span>Liquidités</span>
              </div>
            </div>

            {/* CTA Section */}
            <div className="text-center space-y-4 pt-2">
              <Button onClick={handleViewResults} size="lg" className="gap-2 px-8 shadow-lg">
                Débloquer mes résultats gratuitement
                <ArrowRight className="w-4 h-4" />
              </Button>
              <p className="text-xs text-gray-400">
                ✓ Gratuit · ✓ Sans engagement · ✓ Données sauvegardées
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </PublicPageLayout>
  );
}
