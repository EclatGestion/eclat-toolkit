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

interface BilanScores {
  finances: number;
  epargne: number;
  immobilier: number;
  fiscalite: number;
  transmission: number;
}

interface BilanPdfExportParams {
  recommandations: RecommandationsData;
  scores: BilanScores;
  scoreGlobal: number;
  patrimoineTotal: number;
  radarChartRef: React.RefObject<HTMLDivElement>;
  donutChartRef: React.RefObject<HTMLDivElement>;
}

const drawProgressBar = (
  doc: jsPDF,
  x: number,
  y: number,
  width: number,
  percentage: number,
  color: [number, number, number]
) => {
  doc.setFillColor(230, 230, 230);
  doc.roundedRect(x, y, width, 6, 3, 3, "F");
  doc.setFillColor(...color);
  doc.roundedRect(x, y, width * (percentage / 100), 6, 3, 3, "F");
};

const getScoreColor = (score: number): [number, number, number] => {
  if (score >= 70) return [16, 185, 129];
  if (score >= 50) return [245, 158, 11];
  return [239, 68, 68];
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);

export async function exportBilanPdf({
  recommandations,
  scores,
  scoreGlobal,
  patrimoineTotal,
  radarChartRef,
  donutChartRef,
}: BilanPdfExportParams): Promise<void> {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;

  // ============ PAGE 1: COUVERTURE ============
  doc.setFillColor(45, 96, 255);
  doc.rect(0, 0, pageWidth, 50, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.setFont("helvetica", "bold");
  doc.text("ÉCLAT", margin, 30);
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("Bilan Patrimonial Avancé", margin, 40);

  doc.setTextColor(200, 210, 255);
  doc.setFontSize(10);
  doc.text(
    `Généré le ${new Date().toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })}`,
    pageWidth - margin - 60,
    35
  );

  doc.setTextColor(45, 96, 255);
  doc.setFontSize(72);
  doc.setFont("helvetica", "bold");
  doc.text(`${scoreGlobal}`, pageWidth / 2, 100, { align: "center" });

  doc.setFontSize(24);
  doc.setTextColor(100, 100, 100);
  doc.text("/ 100", pageWidth / 2 + 30, 100);

  doc.setFontSize(16);
  doc.setTextColor(60, 60, 60);
  doc.text("Score Global Patrimonial", pageWidth / 2, 115, { align: "center" });

  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, 130, contentWidth, 30, 5, 5, "F");
  doc.setFontSize(14);
  doc.setTextColor(100, 100, 100);
  doc.text("Patrimoine Total Estimé", margin + 10, 145);
  doc.setFontSize(22);
  doc.setTextColor(45, 96, 255);
  doc.setFont("helvetica", "bold");
  doc.text(formatCurrency(patrimoineTotal), pageWidth - margin - 10, 150, {
    align: "right",
  });

  if (recommandations.synthese) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(80, 80, 80);
    const syntheseLines = doc.splitTextToSize(
      recommandations.synthese,
      contentWidth - 10
    );
    doc.text(syntheseLines, margin + 5, 180);
  }

  // ============ PAGE 2: ANALYSE DES 5 PILIERS ============
  doc.addPage();

  doc.setFillColor(45, 96, 255);
  doc.rect(0, 0, pageWidth, 25, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Analyse des 5 Piliers Patrimoniaux", margin, 17);

  let radarY = 35;
  if (radarChartRef.current) {
    try {
      const radarCanvas = await html2canvas(radarChartRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
      });
      const radarImg = radarCanvas.toDataURL("image/png");
      const radarWidth = 90;
      const radarHeight = (radarCanvas.height / radarCanvas.width) * radarWidth;
      doc.addImage(radarImg, "PNG", margin, radarY, radarWidth, radarHeight);
      radarY += radarHeight + 5;
    } catch (e) {
      console.error("Error capturing radar chart:", e);
    }
  }

  if (donutChartRef.current) {
    try {
      const donutCanvas = await html2canvas(donutChartRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
      });
      const donutImg = donutCanvas.toDataURL("image/png");
      const donutWidth = 80;
      const donutHeight = (donutCanvas.height / donutCanvas.width) * donutWidth;
      doc.addImage(
        donutImg,
        "PNG",
        pageWidth - margin - donutWidth,
        35,
        donutWidth,
        donutHeight
      );
    } catch (e) {
      console.error("Error capturing donut chart:", e);
    }
  }

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
  scoreItems.forEach((item) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(60, 60, 60);
    doc.text(item.label, margin, scoreY);

    drawProgressBar(doc, margin + 70, scoreY - 4, 80, item.score, getScoreColor(item.score));

    doc.setFont("helvetica", "bold");
    doc.setTextColor(...getScoreColor(item.score));
    doc.text(`${item.score}/100`, margin + 160, scoreY);

    scoreY += 15;
  });

  // ============ PAGE 3: RECOMMANDATIONS IA ============
  doc.addPage();

  doc.setFillColor(45, 96, 255);
  doc.rect(0, 0, pageWidth, 25, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Recommandations IA Personnalisées", margin, 17);

  let recoY = 35;

  const renderRecommendationSection = (
    items: Recommandation[] | undefined,
    title: string,
    bgColor: [number, number, number],
    textColor: [number, number, number]
  ) => {
    if (!items?.length) return;

    if (recoY > pageHeight - 50) {
      doc.addPage();
      recoY = 20;
    }

    doc.setFillColor(...bgColor);
    doc.roundedRect(margin, recoY, contentWidth, 8, 2, 2, "F");
    doc.setFontSize(12);
    doc.setTextColor(...textColor);
    doc.setFont("helvetica", "bold");
    doc.text(title, margin + 5, recoY + 6);
    recoY += 15;

    items.forEach((r) => {
      if (recoY > pageHeight - 40) {
        doc.addPage();
        recoY = 20;
      }
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
    recoY += 5;
  };

  renderRecommendationSection(
    recommandations.haute,
    "🔥 PRIORITÉ HAUTE",
    [254, 242, 242],
    [220, 38, 38]
  );
  renderRecommendationSection(
    recommandations.moyenne,
    "⚡ PRIORITÉ MOYENNE",
    [255, 251, 235],
    [217, 119, 6]
  );
  renderRecommendationSection(
    recommandations.longTerme,
    "🌱 OPTIMISATIONS LONG TERME",
    [236, 253, 245],
    [5, 150, 105]
  );

  // ============ PAGE 4: PLAN D'ACTION ============
  if (recommandations.planAction?.length > 0) {
    doc.addPage();

    doc.setFillColor(45, 96, 255);
    doc.rect(0, 0, pageWidth, 25, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Plan d'Action 12 Mois", margin, 17);

    let planY = 40;
    doc.setFillColor(248, 250, 252);
    doc.rect(margin, planY - 5, contentWidth, 12, "F");
    doc.setFontSize(11);
    doc.setTextColor(60, 60, 60);
    doc.setFont("helvetica", "bold");
    doc.text("Mois", margin + 5, planY + 3);
    doc.text("Action", margin + 35, planY + 3);
    planY += 15;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    recommandations.planAction.forEach((action, index) => {
      if (planY > pageHeight - 30) {
        doc.addPage();
        planY = 30;
      }

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

    planY += 20;
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(margin, planY, contentWidth, 25, 3, 3, "F");
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(
      "Ce bilan patrimonial a été généré par l'IA d'Éclat Toolkit.",
      margin + 5,
      planY + 10
    );
    doc.text(
      "Pour toute question, contactez-nous sur eclat-gp.com",
      margin + 5,
      planY + 18
    );
  }

  const dateStr = new Date().toISOString().split("T")[0];
  doc.save(`bilan-patrimonial-eclat-${dateStr}.pdf`);
}
