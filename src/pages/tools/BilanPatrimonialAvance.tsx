import { useState, useMemo } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { PremiumToolLock } from "@/components/premium/PremiumToolLock";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FinancesPersonnellesCard } from "@/components/simulators/bilan/FinancesPersonnellesCard";
import { EpargneInvestissementsCard } from "@/components/simulators/bilan/EpargneInvestissementsCard";
import { ImmobilierCard } from "@/components/simulators/bilan/ImmobilierCard";
import { FiscaliteCard } from "@/components/simulators/bilan/FiscaliteCard";
import { TransmissionCard } from "@/components/simulators/bilan/TransmissionCard";
import { ScoreRadarChart } from "@/components/simulators/bilan/ScoreRadarChart";
import { PatrimoineDonutChart } from "@/components/simulators/bilan/PatrimoineDonutChart";
import { RecommandationsIA } from "@/components/simulators/bilan/RecommandationsIA";
import { useWealth } from "@/contexts/WealthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Brain, FileDown, Sparkles } from "lucide-react";
import jsPDF from "jspdf";

interface Recommandation {
  titre: string;
  description: string;
  impact: string;
}

interface RecommandationsData {
  synthese: string;
  haute: Recommandation[];
  moyenne: Recommandation[];
  longTerme: Recommandation[];
  planAction: { mois: string; action: string }[];
}

export default function BilanPatrimonialAvance() {
  const { totalRevenus, totalDepenses, epargneMensuelle, assets } = useWealth();

  // Finances personnelles
  const [revenus, setRevenus] = useState(Math.round(totalRevenus / 12) || 4000);
  const [depenses, setDepenses] = useState(Math.round(totalDepenses / 12) || 2500);
  const [epargne, setEpargne] = useState(epargneMensuelle || 500);
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
  const [perUtilise, setPerUtilise] = useState(per > 0);
  const [lmnpUtilise, setLmnpUtilise] = useState(false);

  // Transmission
  const [situationFamiliale, setSituationFamiliale] = useState("marie");
  const [nombreEnfants, setNombreEnfants] = useState(2);
  const [donationsRealisees, setDonationsRealisees] = useState(0);
  const [assuranceVieBeneficiaire, setAssuranceVieBeneficiaire] = useState(assuranceVie > 0);

  // IA State
  const [isLoadingIA, setIsLoadingIA] = useState(false);
  const [recommandations, setRecommandations] = useState<RecommandationsData | null>(null);

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

  // Calcul des scores
  const scores = useMemo(() => {
    const tauxEpargne = revenus > 0 ? (epargne / revenus) * 100 : 0;
    const tauxEndettement = revenus > 0 ? (creditsRestants / (revenus * 12)) * 100 : 0;
    
    // Finances: épargne + faible endettement
    const financesScore = Math.min(100, Math.max(0, tauxEpargne * 3 + (100 - tauxEndettement) * 0.7));
    
    // Épargne: diversification + montant
    const diversification = [liquidites, assuranceVie, per, peaCto].filter(v => v > 0).length;
    const epargneScore = Math.min(100, diversification * 20 + (patrimoineTotal > 100000 ? 20 : patrimoineTotal / 5000));
    
    // Immobilier: équilibre + rendement
    const ratioImmo = repartitionPatrimoine.immobilier;
    const rendementLocatif = immobilierLocatif > 0 ? (loyersPercus * 12) / immobilierLocatif * 100 : 0;
    const immobilierScore = Math.min(100, (ratioImmo >= 30 && ratioImmo <= 60 ? 50 : 30) + Math.min(50, rendementLocatif * 8));
    
    // Fiscalité: leviers utilisés
    let fiscaliteScore = 40;
    if (perUtilise) fiscaliteScore += 25;
    if (lmnpUtilise) fiscaliteScore += 25;
    if (tmi <= 11) fiscaliteScore += 10;
    
    // Transmission: préparation
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

  const handleGenerateBilan = async () => {
    setIsLoadingIA(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-bilan-ia", {
        body: {
          financesScore: scores.finances,
          epargneScore: scores.epargne,
          immobilierScore: scores.immobilier,
          fiscaliteScore: scores.fiscalite,
          transmissionScore: scores.transmission,
          scoreGlobal,
          tauxEpargne: revenus > 0 ? Math.round((epargne / revenus) * 100) : 0,
          tauxEndettement: revenus > 0 ? Math.round((creditsRestants / (revenus * 12)) * 100) : 0,
          epargneMensuelle: epargne,
          revenus,
          depenses,
          repartitionPatrimoine,
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
          patrimoineTotal,
          donationsRealisees,
          assuranceVieBeneficiaire,
        },
      });

      if (error) throw error;
      setRecommandations(data);
      toast.success("Analyse IA générée avec succès !");
    } catch (err) {
      console.error("Error generating bilan:", err);
      toast.error("Erreur lors de la génération du bilan");
    } finally {
      setIsLoadingIA(false);
    }
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    
    // Page 1: Couverture
    doc.setFontSize(24);
    doc.setTextColor(45, 96, 255);
    doc.text("Bilan Patrimonial Avancé", 20, 30);
    
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, 20, 45);
    
    doc.setFontSize(36);
    doc.setTextColor(45, 96, 255);
    doc.text(`${scoreGlobal}/100`, 85, 80);
    doc.setFontSize(14);
    doc.text("Score Global", 85, 90);
    
    // Scores
    doc.setFontSize(12);
    doc.setTextColor(50);
    const scoresY = 110;
    doc.text(`Finances: ${scores.finances}/100`, 20, scoresY);
    doc.text(`Épargne: ${scores.epargne}/100`, 20, scoresY + 10);
    doc.text(`Immobilier: ${scores.immobilier}/100`, 20, scoresY + 20);
    doc.text(`Fiscalité: ${scores.fiscalite}/100`, 20, scoresY + 30);
    doc.text(`Transmission: ${scores.transmission}/100`, 20, scoresY + 40);

    // Patrimoine
    doc.setFontSize(14);
    doc.text(`Patrimoine Total: ${patrimoineTotal.toLocaleString('fr-FR')} €`, 20, 170);

    // Recommandations
    if (recommandations) {
      doc.addPage();
      doc.setFontSize(18);
      doc.setTextColor(45, 96, 255);
      doc.text("Recommandations IA", 20, 20);
      
      doc.setFontSize(10);
      doc.setTextColor(50);
      let y = 35;
      
      if (recommandations.synthese) {
        const lines = doc.splitTextToSize(recommandations.synthese, 170);
        doc.text(lines, 20, y);
        y += lines.length * 5 + 10;
      }

      recommandations.haute?.forEach((r, i) => {
        if (y > 270) { doc.addPage(); y = 20; }
        doc.setTextColor(220, 50, 50);
        doc.text(`🔥 ${r.titre}`, 20, y);
        doc.setTextColor(50);
        const desc = doc.splitTextToSize(r.description, 160);
        doc.text(desc, 25, y + 6);
        y += desc.length * 5 + 15;
      });
    }

    doc.save("bilan-patrimonial-eclat.pdf");
    toast.success("PDF exporté avec succès !");
  };

  return (
    <MainLayout title="Bilan Patrimonial Avancé">
      <PremiumToolLock featureName="Bilan Patrimonial Avancé" variant="tab">
        <div className="space-y-8 pb-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <Brain className="w-7 h-7 text-primary" />
                Bilan Patrimonial Avancé
              </h1>
              <p className="text-muted-foreground">Analyse complète avec recommandations IA personnalisées</p>
            </div>
            <div className="flex gap-3">
              <Button onClick={handleGenerateBilan} disabled={isLoadingIA} className="gap-2">
                <Sparkles className="w-4 h-4" />
                Générer le bilan
              </Button>
              <Button variant="outline" onClick={handleExportPDF} disabled={!recommandations} className="gap-2">
                <FileDown className="w-4 h-4" />
                Exporter PDF
              </Button>
            </div>
          </div>

          {/* Inputs Section */}
          <Accordion type="multiple" defaultValue={["finances"]} className="space-y-4">
            <AccordionItem value="finances" className="border-0">
              <AccordionTrigger className="bg-card rounded-xl px-4 py-3 hover:no-underline">
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
              <AccordionTrigger className="bg-card rounded-xl px-4 py-3 hover:no-underline">
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
              <AccordionTrigger className="bg-card rounded-xl px-4 py-3 hover:no-underline">
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
              <AccordionTrigger className="bg-card rounded-xl px-4 py-3 hover:no-underline">
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
              <AccordionTrigger className="bg-card rounded-xl px-4 py-3 hover:no-underline">
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

          {/* Results Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Scores par Pilier</CardTitle>
              </CardHeader>
              <CardContent>
                <ScoreRadarChart
                  financesScore={scores.finances}
                  epargneScore={scores.epargne}
                  immobilierScore={scores.immobilier}
                  fiscaliteScore={scores.fiscalite}
                  transmissionScore={scores.transmission}
                />
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Répartition du Patrimoine</CardTitle>
              </CardHeader>
              <CardContent>
                <PatrimoineDonutChart
                  immobilier={residencePrincipale + immobilierLocatif - creditsImmo}
                  financier={assuranceVie + per + peaCto}
                  liquidites={liquidites}
                />
              </CardContent>
            </Card>
          </div>

          {/* Bottom Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={handleGenerateBilan} disabled={isLoadingIA} className="gap-2" size="lg">
              <Sparkles className="w-4 h-4" />
              Générer le bilan IA
            </Button>
            <Button variant="outline" onClick={handleExportPDF} disabled={!recommandations} className="gap-2" size="lg">
              <FileDown className="w-4 h-4" />
              Exporter PDF
            </Button>
          </div>

          {/* IA Recommendations */}
          <RecommandationsIA
            isLoading={isLoadingIA}
            synthese={recommandations?.synthese}
            haute={recommandations?.haute}
            moyenne={recommandations?.moyenne}
            longTerme={recommandations?.longTerme}
            planAction={recommandations?.planAction}
          />
        </div>
      </PremiumToolLock>
    </MainLayout>
  );
}
