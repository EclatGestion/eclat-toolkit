import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SituationFiscaleCard, calculateTMI } from "@/components/simulators/per/SituationFiscaleCard";
import { VersementsPERCard, calculatePlafondPER } from "@/components/simulators/per/VersementsPERCard";
import { ProjectionCard } from "@/components/simulators/per/ProjectionCard";
import { ResultatsPER } from "@/components/simulators/per/ResultatsPER";
import { RecommendedProducts } from "@/components/academy/RecommendedProducts";
import { Target, BookOpen, Lock, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function OptimisationPER() {
  // Bloc 1 - Situation fiscale
  const [revenuImposable, setRevenuImposable] = useState(50000);
  const [quotientFamilial, setQuotientFamilial] = useState(1);
  const [tmiManuel, setTmiManuel] = useState(false);
  const [tmiValue, setTmiValue] = useState(30);

  // Bloc 2 - Versements PER
  const [montantVersement, setMontantVersement] = useState(5000);
  const [versementMensuel, setVersementMensuel] = useState(200);

  // Bloc 3 - Projection
  const [horizon, setHorizon] = useState(20);
  const [rendementAnnuel, setRendementAnnuel] = useState(4);
  const [fraisGestion, setFraisGestion] = useState(1);

  // Calculs dérivés
  const tmiCalcule = useMemo(
    () => calculateTMI(revenuImposable, quotientFamilial),
    [revenuImposable, quotientFamilial]
  );

  const tmiEffectif = tmiManuel ? tmiValue : tmiCalcule;

  const plafondPER = useMemo(
    () => calculatePlafondPER(revenuImposable),
    [revenuImposable]
  );

  // Limiter les versements au plafond
  const versementAnnuelTotal = montantVersement + versementMensuel * 12;
  const ratioPlafond = versementAnnuelTotal > plafondPER ? plafondPER / versementAnnuelTotal : 1;
  const versementInitialEffectif = Math.round(montantVersement * ratioPlafond);
  const versementMensuelEffectif = Math.round(versementMensuel * ratioPlafond);
  const totalVersementsEffectifs = versementInitialEffectif + versementMensuelEffectif * 12;

  // Calculs des résultats
  const resultats = useMemo(() => {
    // Réduction IR sur le total annuel de la 1ère année
    const reductionIRAnnee1 = totalVersementsEffectifs * (tmiEffectif / 100);
    const effortReelAnnee1 = totalVersementsEffectifs - reductionIRAnnee1;

    const rendementNet = (rendementAnnuel - fraisGestion) / 100;
    let capital = versementInitialEffectif;
    const evolutionData: Array<{ annee: number; capital: number; versementsCumules: number }> = [];
    let versementsCumules = versementInitialEffectif;

    for (let annee = 1; annee <= horizon; annee++) {
      // Ajout des versements mensuels de l'année
      capital = capital + versementMensuelEffectif * 12;
      versementsCumules += versementMensuelEffectif * 12;
      // Rendement sur le capital
      capital = capital * (1 + rendementNet);
      evolutionData.push({ 
        annee, 
        capital: Math.round(capital),
        versementsCumules: Math.round(versementsCumules)
      });
    }

    const valeurFuture = Math.round(capital);
    const totalVerse = versementInitialEffectif + versementMensuelEffectif * 12 * horizon;
    const reductionIRTotale = totalVerse * (tmiEffectif / 100);
    const effortReelTotal = totalVerse - reductionIRTotale;
    const gainTotal = valeurFuture - effortReelTotal;

    return {
      reductionIR: reductionIRTotale,
      effortReel: effortReelTotal,
      valeurFuture,
      gainTotal,
      totalVerse,
      evolutionData,
    };
  }, [versementInitialEffectif, versementMensuelEffectif, totalVersementsEffectifs, tmiEffectif, rendementAnnuel, fraisGestion, horizon]);

  return (
    <MainLayout title="Optimisation PER">
      <div className="space-y-8 pb-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-2"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-primary/20">
              <Target className="h-6 w-6 text-emerald-500" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
                Optimisation PER
              </h1>
              <p className="text-muted-foreground">
                Réduction d'Impôt & Projection Long Terme
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="text-xs">
            Stratégies Patrimoniales • Freemium
          </Badge>
        </motion.div>

        {/* 3 Blocs d'inputs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          <SituationFiscaleCard
            revenuImposable={revenuImposable}
            setRevenuImposable={setRevenuImposable}
            quotientFamilial={quotientFamilial}
            setQuotientFamilial={setQuotientFamilial}
            tmiManuel={tmiManuel}
            setTmiManuel={setTmiManuel}
            tmiValue={tmiValue}
            setTmiValue={setTmiValue}
            tmiCalcule={tmiCalcule}
          />

          <VersementsPERCard
            montantVersement={montantVersement}
            setMontantVersement={setMontantVersement}
            versementMensuel={versementMensuel}
            setVersementMensuel={setVersementMensuel}
            plafondPER={plafondPER}
            revenuImposable={revenuImposable}
          />

          <ProjectionCard
            horizon={horizon}
            setHorizon={setHorizon}
            rendementAnnuel={rendementAnnuel}
            setRendementAnnuel={setRendementAnnuel}
            fraisGestion={fraisGestion}
            setFraisGestion={setFraisGestion}
          />
        </motion.div>

        {/* Résultats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <ResultatsPER
            reductionIR={resultats.reductionIR}
            effortReel={resultats.effortReel}
            valeurFuture={resultats.valeurFuture}
            gainTotal={resultats.gainTotal}
            totalVerse={resultats.totalVerse}
            evolutionData={resultats.evolutionData}
          />
        </motion.div>

        {/* Section Premium (teaser) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="bg-gradient-to-r from-primary/5 to-amber-500/5 border-0 rounded-3xl">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-xl bg-amber-500/10">
                  <Lock className="h-5 w-5 text-amber-500" />
                </div>
                <div className="flex-1 space-y-3">
                  <h3 className="text-lg font-semibold text-foreground">
                    Fonctionnalités Premium
                  </h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <Lock className="h-3 w-3" /> Plafonds N-1, N-2, N-3 (report)
                    </li>
                    <li className="flex items-center gap-2">
                      <Lock className="h-3 w-3" /> Optimisation automatique
                    </li>
                    <li className="flex items-center gap-2">
                      <Lock className="h-3 w-3" /> Simulation sortie capital vs rente
                    </li>
                    <li className="flex items-center gap-2">
                      <Lock className="h-3 w-3" /> Comparatif PER vs AV vs CTO
                    </li>
                    <li className="flex items-center gap-2">
                      <Lock className="h-3 w-3" /> Export PDF du rapport
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Bloc Pédagogique */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="bg-gradient-to-r from-emerald-500/10 to-primary/10 border-0 rounded-3xl overflow-hidden">
            <CardContent className="p-6 flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="p-3 rounded-2xl bg-emerald-500/20">
                <BookOpen className="h-6 w-6 text-emerald-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  Comment fonctionne la réduction d'impôt du PER ?
                </h3>
                <p className="text-sm text-muted-foreground">
                  Découvrez les plafonds, la sortie capital/rente, et les stratégies d'optimisation fiscale.
                </p>
              </div>
              <Link to="/blog/per-plan-epargne-retraite-guide-2025">
                <Button variant="default" className="gap-2">
                  En savoir plus
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>

        {/* Produits recommandés */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <RecommendedProducts
            productIds={["per", "assurance-vie", "girardin-industriel"]}
            title="Produits recommandés"
          />
        </motion.div>
      </div>
    </MainLayout>
  );
}
