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

        {/* Locked Results Preview */}
        <Card className="border-2 border-dashed border-gray-300 bg-gray-50/50">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-lg text-gray-500 flex items-center justify-center gap-2">
              <Lock className="w-5 h-5" />
              Vos résultats sont prêts
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            {/* Teaser des scores */}
            <div className="grid grid-cols-5 gap-2 max-w-md mx-auto">
              {[
                { label: "Finances", score: scores.finances },
                { label: "Épargne", score: scores.epargne },
                { label: "Immobilier", score: scores.immobilier },
                { label: "Fiscalité", score: scores.fiscalite },
                { label: "Transmission", score: scores.transmission },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-1 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent blur-sm" />
                    <span className="text-lg font-bold text-gray-400">?</span>
                  </div>
                  <p className="text-xs text-gray-400 truncate">{item.label}</p>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <p className="text-gray-600">
                Créez un compte gratuit pour découvrir :
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li className="flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  Votre score patrimonial global
                </li>
                <li className="flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  L'analyse détaillée par pilier
                </li>
                <li className="flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  La répartition de votre patrimoine
                </li>
              </ul>
            </div>

            <Button onClick={handleViewResults} size="lg" className="gap-2">
              Voir mes résultats
              <ArrowRight className="w-4 h-4" />
            </Button>

            <p className="text-xs text-gray-400">
              Vos données sont sauvegardées automatiquement
            </p>
          </CardContent>
        </Card>
      </div>
    </PublicPageLayout>
  );
}
