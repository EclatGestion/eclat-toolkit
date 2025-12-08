import { useState, useMemo } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ContratInfoCard } from "@/components/simulators/assurance-vie/ContratInfoCard";
import { RendementCard } from "@/components/simulators/assurance-vie/RendementCard";
import { FraisCard } from "@/components/simulators/assurance-vie/FraisCard";
import { ResultatsAssuranceVie } from "@/components/simulators/assurance-vie/ResultatsAssuranceVie";
import { Shield, Calculator, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function AssuranceVie() {
  // État du contrat
  const [montantInitial, setMontantInitial] = useState(10000);
  const [versementMensuel, setVersementMensuel] = useState(200);
  const [horizon, setHorizon] = useState(15);

  // État des rendements
  const [modeSimple, setModeSimple] = useState(true);
  const [rendementUnique, setRendementUnique] = useState(4);
  const [fondsEuros, setFondsEuros] = useState(60);
  const [uc, setUc] = useState(30);
  const [autres, setAutres] = useState(10);
  const [tauxFE, setTauxFE] = useState(2.5);
  const [tauxUC, setTauxUC] = useState(6);
  const [tauxAutres, setTauxAutres] = useState(4);

  // État des frais
  const [fraisGestion, setFraisGestion] = useState(1);
  const [fraisUC, setFraisUC] = useState(0.8);

  // État de la simulation
  const [showResults, setShowResults] = useState(false);

  // Validation de la répartition
  const totalRepartition = fondsEuros + uc + autres;
  const isValidRepartition = modeSimple || totalRepartition === 100;

  // Calculs
  const results = useMemo(() => {
    // Calcul du rendement brut
    let rendementBrut: number;
    if (modeSimple) {
      rendementBrut = rendementUnique;
    } else {
      rendementBrut =
        (fondsEuros / 100) * tauxFE +
        (uc / 100) * tauxUC +
        (autres / 100) * tauxAutres;
    }

    // Calcul du rendement net après frais
    // Frais de gestion s'appliquent sur tout le contrat
    // Frais UC s'appliquent uniquement sur la part UC
    const fraisEffectifs = modeSimple
      ? fraisGestion + fraisUC * 0.3 // Hypothèse 30% UC en mode simple
      : fraisGestion + (uc / 100) * fraisUC;

    const rendementNet = (rendementBrut - fraisEffectifs) / 100;

    // Projection annuelle
    let capital = montantInitial;
    const evolutionData: Array<{ annee: number; capital: number; totalVerse: number }> = [];
    const versementsAnnuels = versementMensuel * 12;

    for (let annee = 1; annee <= horizon; annee++) {
      // Versements en début d'année + capitalisation
      capital = (capital + versementsAnnuels) * (1 + rendementNet);
      const totalVerse = montantInitial + versementsAnnuels * annee;
      evolutionData.push({
        annee,
        capital: Math.round(capital),
        totalVerse,
      });
    }

    const valeurFinale = capital;
    const totalInvesti = montantInitial + versementsAnnuels * horizon;
    const gainNet = valeurFinale - totalInvesti;

    // Rendement annuel moyen = rendement net appliqué (après frais)
    const rendementMoyen = rendementNet * 100;

    return {
      valeurFinale,
      totalInvesti,
      gainNet,
      rendementMoyen,
      evolutionData,
    };
  }, [
    montantInitial,
    versementMensuel,
    horizon,
    modeSimple,
    rendementUnique,
    fondsEuros,
    uc,
    autres,
    tauxFE,
    tauxUC,
    tauxAutres,
    fraisGestion,
    fraisUC,
  ]);

  const handleSimuler = () => {
    if (!isValidRepartition) return;
    setShowResults(true);
  };

  return (
    <MainLayout title="Simulateur d'Assurance-Vie">
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4"
        >
          <div className="p-3 rounded-2xl bg-violet-500/10">
            <Shield className="h-8 w-8 text-violet-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Simulateur d'Assurance-Vie</h1>
            <p className="text-muted-foreground">
              Projetez l'évolution de votre contrat et comprenez l'impact des frais
            </p>
          </div>
        </motion.div>

        {/* Inputs */}
        <div className="grid lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <ContratInfoCard
              montantInitial={montantInitial}
              setMontantInitial={setMontantInitial}
              versementMensuel={versementMensuel}
              setVersementMensuel={setVersementMensuel}
              horizon={horizon}
              setHorizon={setHorizon}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <RendementCard
              modeSimple={modeSimple}
              setModeSimple={setModeSimple}
              rendementUnique={rendementUnique}
              setRendementUnique={setRendementUnique}
              fondsEuros={fondsEuros}
              setFondsEuros={setFondsEuros}
              uc={uc}
              setUc={setUc}
              autres={autres}
              setAutres={setAutres}
              tauxFE={tauxFE}
              setTauxFE={setTauxFE}
              tauxUC={tauxUC}
              setTauxUC={setTauxUC}
              tauxAutres={tauxAutres}
              setTauxAutres={setTauxAutres}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <FraisCard
              fraisGestion={fraisGestion}
              setFraisGestion={setFraisGestion}
              fraisUC={fraisUC}
              setFraisUC={setFraisUC}
            />
          </motion.div>
        </div>

        {/* Bouton Simuler */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex justify-center"
        >
          <Button
            size="lg"
            onClick={handleSimuler}
            disabled={!isValidRepartition}
            className="gap-2 px-8"
          >
            <Calculator className="h-5 w-5" />
            Simuler mon contrat
          </Button>
        </motion.div>

        {/* Résultats */}
        {showResults && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <ResultatsAssuranceVie
              valeurFinale={results.valeurFinale}
              totalInvesti={results.totalInvesti}
              gainNet={results.gainNet}
              rendementMoyen={results.rendementMoyen}
              evolutionData={results.evolutionData}
            />
          </motion.div>
        )}

        {/* Bloc pédagogique */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="rounded-3xl bg-gradient-to-r from-violet-500/5 to-primary/5 border-violet-500/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-violet-500/10">
                  <BookOpen className="h-6 w-6 text-violet-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">
                    Comment fonctionne une assurance-vie ?
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Découvrez les avantages fiscaux, la différence entre fonds euros et UC,
                    et les stratégies pour optimiser votre contrat.
                  </p>
                </div>
                <Link to="/blog/guide-assurance-vie-2025">
                  <Button variant="outline" className="gap-2">
                    <BookOpen className="h-4 w-4" />
                    En savoir plus
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </MainLayout>
  );
}
