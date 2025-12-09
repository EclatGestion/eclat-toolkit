import { useState, useMemo, useRef } from "react";
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
import { Brain, FileDown, Sparkles, Loader2 } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

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
  const [isExportingPDF, setIsExportingPDF] = useState(false);

  // Refs for chart capture
  const radarChartRef = useRef<HTMLDivElement>(null);
  const donutChartRef = useRef<HTMLDivElement>(null);
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

  const handleExportPDF = async () => {
    if (!recommandations) return;
    
    setIsExportingPDF(true);
    toast.loading("Génération du PDF en cours...", { id: "pdf-export" });

    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      const contentWidth = pageWidth - margin * 2;

      // Helper functions
      const drawProgressBar = (x: number, y: number, width: number, percentage: number, color: [number, number, number]) => {
        // Background
        doc.setFillColor(230, 230, 230);
        doc.roundedRect(x, y, width, 6, 3, 3, "F");
        // Progress
        doc.setFillColor(...color);
        doc.roundedRect(x, y, width * (percentage / 100), 6, 3, 3, "F");
      };

      const getScoreColor = (score: number): [number, number, number] => {
        if (score >= 70) return [16, 185, 129]; // Green
        if (score >= 50) return [245, 158, 11]; // Orange
        return [239, 68, 68]; // Red
      };

      const formatCurrency = (value: number) => 
        new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value);

      // ============ PAGE 1: COUVERTURE ============
      // Header avec logo
      doc.setFillColor(45, 96, 255);
      doc.rect(0, 0, pageWidth, 50, "F");
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(28);
      doc.setFont("helvetica", "bold");
      doc.text("ÉCLAT", margin, 30);
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text("Bilan Patrimonial Avancé", margin, 40);

      // Date
      doc.setTextColor(200, 210, 255);
      doc.setFontSize(10);
      doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}`, pageWidth - margin - 60, 35);

      // Score global centré
      doc.setTextColor(45, 96, 255);
      doc.setFontSize(72);
      doc.setFont("helvetica", "bold");
      const scoreText = `${scoreGlobal}`;
      doc.text(scoreText, pageWidth / 2, 100, { align: "center" });
      
      doc.setFontSize(24);
      doc.setTextColor(100, 100, 100);
      doc.text("/ 100", pageWidth / 2 + 30, 100);
      
      doc.setFontSize(16);
      doc.setTextColor(60, 60, 60);
      doc.text("Score Global Patrimonial", pageWidth / 2, 115, { align: "center" });

      // Patrimoine total
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(margin, 130, contentWidth, 30, 5, 5, "F");
      doc.setFontSize(14);
      doc.setTextColor(100, 100, 100);
      doc.text("Patrimoine Total Estimé", margin + 10, 145);
      doc.setFontSize(22);
      doc.setTextColor(45, 96, 255);
      doc.setFont("helvetica", "bold");
      doc.text(formatCurrency(patrimoineTotal), pageWidth - margin - 10, 150, { align: "right" });

      // Synthèse IA
      if (recommandations.synthese) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        doc.setTextColor(80, 80, 80);
        const syntheseLines = doc.splitTextToSize(recommandations.synthese, contentWidth - 10);
        doc.text(syntheseLines, margin + 5, 180);
      }

      // ============ PAGE 2: ANALYSE DES 5 PILIERS ============
      doc.addPage();
      
      // Titre
      doc.setFillColor(45, 96, 255);
      doc.rect(0, 0, pageWidth, 25, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("Analyse des 5 Piliers Patrimoniaux", margin, 17);

      // Capture radar chart
      let radarY = 35;
      if (radarChartRef.current) {
        try {
          const radarCanvas = await html2canvas(radarChartRef.current, { scale: 2, backgroundColor: "#ffffff" });
          const radarImg = radarCanvas.toDataURL("image/png");
          const radarWidth = 90;
          const radarHeight = (radarCanvas.height / radarCanvas.width) * radarWidth;
          doc.addImage(radarImg, "PNG", margin, radarY, radarWidth, radarHeight);
          radarY += radarHeight + 5;
        } catch (e) {
          console.error("Error capturing radar chart:", e);
        }
      }

      // Capture donut chart
      if (donutChartRef.current) {
        try {
          const donutCanvas = await html2canvas(donutChartRef.current, { scale: 2, backgroundColor: "#ffffff" });
          const donutImg = donutCanvas.toDataURL("image/png");
          const donutWidth = 80;
          const donutHeight = (donutCanvas.height / donutCanvas.width) * donutWidth;
          doc.addImage(donutImg, "PNG", pageWidth - margin - donutWidth, 35, donutWidth, donutHeight);
        } catch (e) {
          console.error("Error capturing donut chart:", e);
        }
      }

      // Tableau des scores
      const scoresStartY = Math.max(radarY + 10, 150);
      doc.setFontSize(14);
      doc.setTextColor(45, 96, 255);
      doc.setFont("helvetica", "bold");
      doc.text("Détail des Scores", margin, scoresStartY);

      const scoreItems = [
        { label: "Finances Personnelles", score: scores.finances },
        { label: "Épargne & Investissements", score: scores.epargne },
        { label: "Immobilier", score: scores.immobilier },
        { label: "Fiscalité", score: scores.fiscalite },
        { label: "Transmission", score: scores.transmission },
      ];

      let scoreY = scoresStartY + 15;
      scoreItems.forEach(item => {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        doc.setTextColor(60, 60, 60);
        doc.text(item.label, margin, scoreY);
        
        drawProgressBar(margin + 70, scoreY - 4, 80, item.score, getScoreColor(item.score));
        
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...getScoreColor(item.score));
        doc.text(`${item.score}/100`, margin + 160, scoreY);
        
        scoreY += 15;
      });

      // ============ PAGE 3: RECOMMANDATIONS IA ============
      doc.addPage();
      
      // Titre
      doc.setFillColor(45, 96, 255);
      doc.rect(0, 0, pageWidth, 25, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("Recommandations IA Personnalisées", margin, 17);

      let recoY = 35;

      // Priorité Haute
      if (recommandations.haute?.length > 0) {
        doc.setFillColor(254, 242, 242);
        doc.roundedRect(margin, recoY, contentWidth, 8, 2, 2, "F");
        doc.setFontSize(12);
        doc.setTextColor(220, 38, 38);
        doc.setFont("helvetica", "bold");
        doc.text("🔥 PRIORITÉ HAUTE", margin + 5, recoY + 6);
        recoY += 15;

        recommandations.haute.forEach(r => {
          if (recoY > pageHeight - 40) { doc.addPage(); recoY = 20; }
          doc.setFontSize(11);
          doc.setTextColor(60, 60, 60);
          doc.setFont("helvetica", "bold");
          doc.text(`• ${r.titre}`, margin + 5, recoY);
          recoY += 6;
          doc.setFont("helvetica", "normal");
          doc.setFontSize(10);
          doc.setTextColor(100, 100, 100);
          const descLines = doc.splitTextToSize(r.description, contentWidth - 15);
          doc.text(descLines, margin + 10, recoY);
          recoY += descLines.length * 5;
          if (r.impact) {
            doc.setTextColor(16, 185, 129);
            doc.text(`Impact: ${r.impact}`, margin + 10, recoY);
            recoY += 5;
          }
          recoY += 5;
        });
      }

      // Priorité Moyenne
      if (recommandations.moyenne?.length > 0) {
        recoY += 5;
        if (recoY > pageHeight - 50) { doc.addPage(); recoY = 20; }
        
        doc.setFillColor(255, 251, 235);
        doc.roundedRect(margin, recoY, contentWidth, 8, 2, 2, "F");
        doc.setFontSize(12);
        doc.setTextColor(217, 119, 6);
        doc.setFont("helvetica", "bold");
        doc.text("⚡ PRIORITÉ MOYENNE", margin + 5, recoY + 6);
        recoY += 15;

        recommandations.moyenne.forEach(r => {
          if (recoY > pageHeight - 40) { doc.addPage(); recoY = 20; }
          doc.setFontSize(11);
          doc.setTextColor(60, 60, 60);
          doc.setFont("helvetica", "bold");
          doc.text(`• ${r.titre}`, margin + 5, recoY);
          recoY += 6;
          doc.setFont("helvetica", "normal");
          doc.setFontSize(10);
          doc.setTextColor(100, 100, 100);
          const descLines = doc.splitTextToSize(r.description, contentWidth - 15);
          doc.text(descLines, margin + 10, recoY);
          recoY += descLines.length * 5;
          if (r.impact) {
            doc.setTextColor(16, 185, 129);
            doc.text(`Impact: ${r.impact}`, margin + 10, recoY);
            recoY += 5;
          }
          recoY += 5;
        });
      }

      // Long Terme
      if (recommandations.longTerme?.length > 0) {
        recoY += 5;
        if (recoY > pageHeight - 50) { doc.addPage(); recoY = 20; }
        
        doc.setFillColor(236, 253, 245);
        doc.roundedRect(margin, recoY, contentWidth, 8, 2, 2, "F");
        doc.setFontSize(12);
        doc.setTextColor(5, 150, 105);
        doc.setFont("helvetica", "bold");
        doc.text("🌱 OPTIMISATIONS LONG TERME", margin + 5, recoY + 6);
        recoY += 15;

        recommandations.longTerme.forEach(r => {
          if (recoY > pageHeight - 40) { doc.addPage(); recoY = 20; }
          doc.setFontSize(11);
          doc.setTextColor(60, 60, 60);
          doc.setFont("helvetica", "bold");
          doc.text(`• ${r.titre}`, margin + 5, recoY);
          recoY += 6;
          doc.setFont("helvetica", "normal");
          doc.setFontSize(10);
          doc.setTextColor(100, 100, 100);
          const descLines = doc.splitTextToSize(r.description, contentWidth - 15);
          doc.text(descLines, margin + 10, recoY);
          recoY += descLines.length * 5;
          if (r.impact) {
            doc.setTextColor(16, 185, 129);
            doc.text(`Impact: ${r.impact}`, margin + 10, recoY);
            recoY += 5;
          }
          recoY += 5;
        });
      }

      // ============ PAGE 4: PLAN D'ACTION ============
      if (recommandations.planAction?.length > 0) {
        doc.addPage();
        
        // Titre
        doc.setFillColor(45, 96, 255);
        doc.rect(0, 0, pageWidth, 25, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text("Plan d'Action 12 Mois", margin, 17);

        // Table header
        let planY = 40;
        doc.setFillColor(248, 250, 252);
        doc.rect(margin, planY - 5, contentWidth, 12, "F");
        doc.setFontSize(11);
        doc.setTextColor(60, 60, 60);
        doc.setFont("helvetica", "bold");
        doc.text("Mois", margin + 5, planY + 3);
        doc.text("Action", margin + 35, planY + 3);
        planY += 15;

        // Table rows
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        recommandations.planAction.forEach((action, index) => {
          if (planY > pageHeight - 30) { doc.addPage(); planY = 30; }
          
          // Alternating background
          if (index % 2 === 0) {
            doc.setFillColor(252, 252, 253);
            doc.rect(margin, planY - 4, contentWidth, 10, "F");
          }
          
          doc.setTextColor(45, 96, 255);
          doc.setFont("helvetica", "bold");
          doc.text(action.mois, margin + 5, planY + 2);
          doc.setTextColor(60, 60, 60);
          doc.setFont("helvetica", "normal");
          const actionLines = doc.splitTextToSize(action.action, contentWidth - 45);
          doc.text(actionLines, margin + 35, planY + 2);
          planY += Math.max(12, actionLines.length * 6);
        });

        // Footer
        planY += 20;
        doc.setFillColor(248, 250, 252);
        doc.roundedRect(margin, planY, contentWidth, 25, 3, 3, "F");
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        doc.text("Ce bilan patrimonial a été généré par l'IA d'Éclat Toolkit.", margin + 5, planY + 10);
        doc.text("Pour toute question, contactez-nous sur eclat-gp.com", margin + 5, planY + 18);
      }

      // Save
      const dateStr = new Date().toISOString().split('T')[0];
      doc.save(`bilan-patrimonial-eclat-${dateStr}.pdf`);
      toast.success("PDF exporté avec succès !", { id: "pdf-export" });
    } catch (error) {
      console.error("Error exporting PDF:", error);
      toast.error("Erreur lors de l'export PDF", { id: "pdf-export" });
    } finally {
      setIsExportingPDF(false);
    }
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
                {isLoadingIA ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {isLoadingIA ? "Analyse..." : "Générer le bilan"}
              </Button>
              <Button variant="outline" onClick={handleExportPDF} disabled={!recommandations || isExportingPDF} className="gap-2">
                {isExportingPDF ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />}
                {isExportingPDF ? "Export..." : "Exporter PDF"}
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
                <div ref={radarChartRef}>
                  <ScoreRadarChart
                    financesScore={scores.finances}
                    epargneScore={scores.epargne}
                    immobilierScore={scores.immobilier}
                    fiscaliteScore={scores.fiscalite}
                    transmissionScore={scores.transmission}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Répartition du Patrimoine</CardTitle>
              </CardHeader>
              <CardContent>
                <div ref={donutChartRef}>
                  <PatrimoineDonutChart
                    immobilier={residencePrincipale + immobilierLocatif - creditsImmo}
                    financier={assuranceVie + per + peaCto}
                    liquidites={liquidites}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bottom Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={handleGenerateBilan} disabled={isLoadingIA} className="gap-2" size="lg">
              {isLoadingIA ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {isLoadingIA ? "Analyse en cours..." : "Générer le bilan IA"}
            </Button>
            <Button variant="outline" onClick={handleExportPDF} disabled={!recommandations || isExportingPDF} className="gap-2" size="lg">
              {isExportingPDF ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />}
              {isExportingPDF ? "Export en cours..." : "Exporter PDF Premium"}
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
