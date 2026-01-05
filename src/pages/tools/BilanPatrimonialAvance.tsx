import { useState, useMemo, useRef, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { TierLock } from "@/components/premium/TierLock";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { FinancesPersonnellesCard } from "@/components/simulators/bilan/FinancesPersonnellesCard";
import { EpargneInvestissementsCard } from "@/components/simulators/bilan/EpargneInvestissementsCard";
import { ImmobilierCard } from "@/components/simulators/bilan/ImmobilierCard";
import { FiscaliteCard } from "@/components/simulators/bilan/FiscaliteCard";
import { TransmissionCard } from "@/components/simulators/bilan/TransmissionCard";
import { ScoreRadarChart } from "@/components/simulators/bilan/ScoreRadarChart";
import { PatrimoineDonutChart } from "@/components/simulators/bilan/PatrimoineDonutChart";
import { RecommandationsIA } from "@/components/simulators/bilan/RecommandationsIA";
import { useWealth } from "@/contexts/WealthContext";
import { useDiagnostics, DiagnosticInput } from "@/hooks/useDiagnostics";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Brain, FileDown, Sparkles, Loader2, Save, FolderOpen, Plus, Trash2 } from "lucide-react";
import { exportBilanPdf } from "@/utils/bilanPdfExport";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const STORAGE_KEY = "eclat_diagnostic_data";

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
  const { totalRevenus, totalDepenses, epargneMensuelle } = useWealth();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const loadId = searchParams.get("load");
  const shouldRestore = searchParams.get("restore") === "true";
  
  const { diagnostics, createDiagnostic, updateDiagnostic, deleteDiagnostic, isLoading: diagnosticsLoading } = useDiagnostics();

  // Current diagnostic being edited
  const [currentDiagnosticId, setCurrentDiagnosticId] = useState<string | null>(null);
  const [diagnosticName, setDiagnosticName] = useState("Mon diagnostic");
  const [showSaveAsDialog, setShowSaveAsDialog] = useState(false);
  const [newDiagnosticName, setNewDiagnosticName] = useState("");

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
  const [isSaving, setIsSaving] = useState(false);
  const [recommandations, setRecommandations] = useState<RecommandationsData | null>(null);

  // Load diagnostic from URL param
  useEffect(() => {
    if (loadId && diagnostics.length > 0) {
      const diagnostic = diagnostics.find(d => d.id === loadId);
      if (diagnostic) {
        loadDiagnosticData(diagnostic);
        setCurrentDiagnosticId(diagnostic.id);
        setDiagnosticName(diagnostic.name);
        // Clear the URL param
        setSearchParams({});
      }
    }
  }, [loadId, diagnostics]);

  // Restore from localStorage (coming from public diagnostic)
  useEffect(() => {
    if (shouldRestore && !loadId) {
      try {
        const savedData = localStorage.getItem(STORAGE_KEY);
        if (savedData) {
          const data = JSON.parse(savedData);
          setRevenus(data.revenus ?? revenus);
          setDepenses(data.depenses ?? depenses);
          setEpargne(data.epargne ?? epargne);
          setCreditsRestants(data.creditsRestants ?? creditsRestants);
          setLiquidites(data.liquidites ?? liquidites);
          setAssuranceVie(data.assuranceVie ?? assuranceVie);
          setPer(data.per ?? per);
          setPeaCto(data.peaCto ?? peaCto);
          setResidencePrincipale(data.residencePrincipale ?? residencePrincipale);
          setImmobilierLocatif(data.immobilierLocatif ?? immobilierLocatif);
          setLoyersPercus(data.loyersPercus ?? loyersPercus);
          setCreditsImmo(data.creditsImmo ?? creditsImmo);
          setRevenusImposables(data.revenusImposables ?? revenusImposables);
          setTmi(data.tmi ?? tmi);
          setPerUtilise(data.perUtilise ?? perUtilise);
          setLmnpUtilise(data.lmnpUtilise ?? lmnpUtilise);
          setSituationFamiliale(data.situationFamiliale ?? situationFamiliale);
          setNombreEnfants(data.nombreEnfants ?? nombreEnfants);
          setDonationsRealisees(data.donationsRealisees ?? donationsRealisees);
          setAssuranceVieBeneficiaire(data.assuranceVieBeneficiaire ?? assuranceVieBeneficiaire);
          toast.success("Données du diagnostic restaurées !");
          localStorage.removeItem(STORAGE_KEY);
          setSearchParams({});
        }
      } catch (e) {
        console.error("Error restoring diagnostic data:", e);
      }
    }
  }, [shouldRestore, loadId]);

  const loadDiagnosticData = (diagnostic: any) => {
    setRevenus(diagnostic.revenus || 4000);
    setDepenses(diagnostic.depenses || 2500);
    setEpargne(diagnostic.epargne || 500);
    setCreditsRestants(diagnostic.credits_restants || 0);
    setLiquidites(diagnostic.liquidites || 15000);
    setAssuranceVie(diagnostic.assurance_vie || 0);
    setPer(diagnostic.per || 0);
    setPeaCto(diagnostic.pea_cto || 0);
    setResidencePrincipale(diagnostic.residence_principale || 0);
    setImmobilierLocatif(diagnostic.immobilier_locatif || 0);
    setLoyersPercus(diagnostic.loyers_percus || 0);
    setCreditsImmo(diagnostic.credits_immo || 0);
    setRevenusImposables(diagnostic.revenus_imposables || revenus * 12);
    setTmi(diagnostic.tmi || 30);
    setPerUtilise(diagnostic.per_utilise || false);
    setLmnpUtilise(diagnostic.lmnp_utilise || false);
    setSituationFamiliale(diagnostic.situation_familiale || "marie");
    setNombreEnfants(diagnostic.nombre_enfants || 2);
    setDonationsRealisees(diagnostic.donations_realisees || 0);
    setAssuranceVieBeneficiaire(diagnostic.assurance_vie_beneficiaire || false);
  };

  // Refs for chart capture
  const radarChartRef = useRef<HTMLDivElement>(null);
  const donutChartRef = useRef<HTMLDivElement>(null);

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

  const getDiagnosticInput = (): DiagnosticInput => ({
    name: diagnosticName,
    revenus,
    depenses,
    epargne,
    credits_restants: creditsRestants,
    liquidites,
    assurance_vie: assuranceVie,
    per,
    pea_cto: peaCto,
    residence_principale: residencePrincipale,
    immobilier_locatif: immobilierLocatif,
    loyers_percus: loyersPercus,
    credits_immo: creditsImmo,
    revenus_imposables: revenusImposables,
    tmi,
    per_utilise: perUtilise,
    lmnp_utilise: lmnpUtilise,
    situation_familiale: situationFamiliale,
    nombre_enfants: nombreEnfants,
    donations_realisees: donationsRealisees,
    assurance_vie_beneficiaire: assuranceVieBeneficiaire,
    score_global: scoreGlobal,
    patrimoine_total: patrimoineTotal,
  });

  const handleSave = async () => {
    if (!user) {
      toast.error("Connectez-vous pour sauvegarder");
      return;
    }

    setIsSaving(true);
    try {
      if (currentDiagnosticId) {
        const success = await updateDiagnostic(currentDiagnosticId, getDiagnosticInput());
        if (success) toast.success("Diagnostic mis à jour !");
      } else {
        const created = await createDiagnostic(getDiagnosticInput());
        if (created) {
          setCurrentDiagnosticId(created.id);
          toast.success("Diagnostic sauvegardé !");
        }
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAs = async () => {
    if (!user || !newDiagnosticName.trim()) return;

    setIsSaving(true);
    try {
      const created = await createDiagnostic({
        ...getDiagnosticInput(),
        name: newDiagnosticName.trim(),
      });
      if (created) {
        setCurrentDiagnosticId(created.id);
        setDiagnosticName(newDiagnosticName.trim());
        toast.success("Nouveau diagnostic créé !");
      }
    } finally {
      setIsSaving(false);
      setShowSaveAsDialog(false);
      setNewDiagnosticName("");
    }
  };

  const handleNew = () => {
    setCurrentDiagnosticId(null);
    setDiagnosticName("Nouveau diagnostic");
    setRevenus(4000);
    setDepenses(2500);
    setEpargne(500);
    setCreditsRestants(0);
    setLiquidites(15000);
    setAssuranceVie(0);
    setPer(0);
    setPeaCto(0);
    setResidencePrincipale(0);
    setImmobilierLocatif(0);
    setLoyersPercus(0);
    setCreditsImmo(0);
    setRevenusImposables(48000);
    setTmi(30);
    setPerUtilise(false);
    setLmnpUtilise(false);
    setSituationFamiliale("marie");
    setNombreEnfants(2);
    setDonationsRealisees(0);
    setAssuranceVieBeneficiaire(false);
    setRecommandations(null);
  };

  const handleDelete = async () => {
    if (!currentDiagnosticId) return;
    
    const success = await deleteDiagnostic(currentDiagnosticId);
    if (success) {
      handleNew();
    }
  };

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
      await exportBilanPdf({
        recommandations,
        scores,
        scoreGlobal,
        patrimoineTotal,
        radarChartRef,
        donutChartRef,
      });
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
      <div className="space-y-8 pb-8">
        {/* Header with Save Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Brain className="w-7 h-7 text-primary" />
              Bilan Patrimonial Avancé
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <Input
                value={diagnosticName}
                onChange={(e) => setDiagnosticName(e.target.value)}
                className="h-8 w-48 text-sm bg-transparent border-dashed"
                placeholder="Nom du diagnostic"
              />
              {currentDiagnosticId && (
                <span className="text-xs text-muted-foreground px-2 py-1 bg-muted rounded">
                  Sauvegardé
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Dropdown for loading diagnostics */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <FolderOpen className="w-4 h-4" />
                  Ouvrir
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={handleNew}>
                  <Plus className="w-4 h-4 mr-2" />
                  Nouveau diagnostic
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {diagnosticsLoading ? (
                  <DropdownMenuItem disabled>Chargement...</DropdownMenuItem>
                ) : diagnostics.length === 0 ? (
                  <DropdownMenuItem disabled>Aucun diagnostic</DropdownMenuItem>
                ) : (
                  diagnostics.map((diag) => (
                    <DropdownMenuItem
                      key={diag.id}
                      onClick={() => {
                        loadDiagnosticData(diag);
                        setCurrentDiagnosticId(diag.id);
                        setDiagnosticName(diag.name);
                      }}
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{diag.name}</span>
                        <span className="text-xs text-muted-foreground">
                          Score: {diag.score_global}/100 • {new Date(diag.updated_at).toLocaleDateString("fr-FR")}
                        </span>
                      </div>
                    </DropdownMenuItem>
                  ))
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Save button */}
            <Button onClick={handleSave} disabled={isSaving} size="sm" className="gap-2">
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {currentDiagnosticId ? "Mettre à jour" : "Sauvegarder"}
            </Button>

            {/* Save As button */}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                setNewDiagnosticName(diagnosticName + " (copie)");
                setShowSaveAsDialog(true);
              }}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Dupliquer
            </Button>

            {/* Delete button */}
            {currentDiagnosticId && (
              <Button variant="ghost" size="sm" onClick={handleDelete} className="text-destructive hover:text-destructive">
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
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
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="text-xl">📊 Vos Résultats</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">Analyse basée sur vos données</p>
              </div>
              <div className={`px-4 py-2 rounded-full text-sm font-semibold ${
                scoreGlobal >= 70 
                  ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/30" 
                  : scoreGlobal >= 50 
                    ? "bg-amber-500/10 text-amber-600 border border-amber-500/30"
                    : "bg-red-500/10 text-red-600 border border-red-500/30"
              }`}>
                {scoreGlobal >= 70 ? "✓ Excellent" : scoreGlobal >= 50 ? "⚠ À améliorer" : "⚡ Action requise"}
                {" • "}Score : {scoreGlobal}/100
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div ref={radarChartRef}>
                <h3 className="text-sm font-medium text-muted-foreground mb-3">Scores par Pilier</h3>
                <ScoreRadarChart
                  financesScore={scores.finances}
                  epargneScore={scores.epargne}
                  immobilierScore={scores.immobilier}
                  fiscaliteScore={scores.fiscalite}
                  transmissionScore={scores.transmission}
                />
              </div>
              <div ref={donutChartRef}>
                <h3 className="text-sm font-medium text-muted-foreground mb-3">Répartition du Patrimoine</h3>
                <PatrimoineDonutChart
                  immobilier={residencePrincipale + immobilierLocatif - creditsImmo}
                  financier={assuranceVie + per + peaCto}
                  liquidites={liquidites}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Recommendations - PREMIUM LOCKED */}
        <TierLock requiredTier="premium" featureName="Recommandations IA" variant="section">
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={handleGenerateBilan} disabled={isLoadingIA} className="gap-2" size="lg">
                {isLoadingIA ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {isLoadingIA ? "Analyse en cours..." : "Générer le bilan IA"}
              </Button>
              
              <TierLock requiredTier="expert" featureName="Export PDF Premium" variant="inline">
                <Button variant="outline" onClick={handleExportPDF} disabled={!recommandations || isExportingPDF} className="gap-2" size="lg">
                  {isExportingPDF ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />}
                  {isExportingPDF ? "Export en cours..." : "Exporter PDF Premium"}
                </Button>
              </TierLock>
            </div>

            <RecommandationsIA
              isLoading={isLoadingIA}
              synthese={recommandations?.synthese}
              haute={recommandations?.haute}
              moyenne={recommandations?.moyenne}
              longTerme={recommandations?.longTerme}
              planAction={recommandations?.planAction}
              scoreGlobal={scoreGlobal}
              patrimoineTotal={patrimoineTotal}
            />
          </div>
        </TierLock>
      </div>

      {/* Save As Dialog */}
      <Dialog open={showSaveAsDialog} onOpenChange={setShowSaveAsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dupliquer le diagnostic</DialogTitle>
            <DialogDescription>
              Créez une copie de ce diagnostic pour tester différents scénarios.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={newDiagnosticName}
              onChange={(e) => setNewDiagnosticName(e.target.value)}
              placeholder="Nom du nouveau diagnostic"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSaveAsDialog(false)}>
              Annuler
            </Button>
            <Button onClick={handleSaveAs} disabled={isSaving || !newDiagnosticName.trim()}>
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Créer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
