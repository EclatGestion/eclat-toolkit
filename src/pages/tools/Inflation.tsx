import { useState, useEffect, useMemo } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { DonneesBaseCard } from "@/components/simulators/inflation/DonneesBaseCard";
import { ComparatifCard } from "@/components/simulators/inflation/ComparatifCard";
import { ResultatsInflation } from "@/components/simulators/inflation/ResultatsInflation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { BookOpen, TrendingDown, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { SaveSimulationButton } from "@/components/simulators/SaveSimulationButton";

export default function Inflation() {
  const location = useLocation();

  // États pour les inputs
  const [montant, setMontant] = useState(10000);
  const [inflation, setInflation] = useState(2.5);
  const [duree, setDuree] = useState(10);
  const [comparatifActif, setComparatifActif] = useState(false);
  const [rendement, setRendement] = useState(3);

  // Load saved simulation
  useEffect(() => {
    const loadSimulation = location.state?.loadSimulation;
    if (loadSimulation?.parameters) {
      const p = loadSimulation.parameters;
      if (p.montant !== undefined) setMontant(p.montant);
      if (p.inflation !== undefined) setInflation(p.inflation);
      if (p.duree !== undefined) setDuree(p.duree);
      if (p.comparatifActif !== undefined) setComparatifActif(p.comparatifActif);
      if (p.rendement !== undefined) setRendement(p.rendement);
    }
  }, [location.state]);

  // Calculate results for saving
  const results = useMemo(() => {
    const pouvoirAchatFinal = montant * Math.pow(1 - inflation / 100, duree);
    const perteValeur = montant - pouvoirAchatFinal;
    const valeurInvestie = comparatifActif ? montant * Math.pow(1 + (rendement - inflation) / 100, duree) : undefined;
    return { pouvoirAchatFinal, perteValeur, valeurInvestie };
  }, [montant, inflation, duree, comparatifActif, rendement]);

  return (
    <MainLayout title="Calculateur d'Inflation">
      <div className="space-y-6">
        {/* Header pédagogique */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-2xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
            <TrendingDown className="h-4 w-4" />
            Fondamentaux Financiers
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Calculateur d'Inflation & Perte de Pouvoir d'Achat
          </h1>
          <p className="text-muted-foreground">
            Visualisez l'impact de l'inflation sur votre épargne et comprenez pourquoi laisser dormir son argent coûte cher.
          </p>
        </motion.div>

        {/* Layout principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Colonne gauche - Inputs */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <DonneesBaseCard
                montant={montant}
                setMontant={setMontant}
                inflation={inflation}
                setInflation={setInflation}
                duree={duree}
                setDuree={setDuree}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <ComparatifCard
                comparatifActif={comparatifActif}
                setComparatifActif={setComparatifActif}
                rendement={rendement}
                setRendement={setRendement}
              />
            </motion.div>

            {/* Préparation Premium - Section grisée */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="rounded-3xl shadow-card border-dashed border-muted-foreground/30 bg-muted/30">
                <CardContent className="py-4">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <div className="p-2 rounded-xl bg-muted">
                      <Lock className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Fonctionnalités Premium</p>
                      <p className="text-xs">
                        Scénarios multiples, ETF vs Fonds €, Export PDF
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Colonne droite - Résultats */}
          <div className="lg:col-span-2 space-y-4">
            <ResultatsInflation
              montant={montant}
              inflation={inflation}
              duree={duree}
              comparatifActif={comparatifActif}
              rendement={rendement}
            />
            <div className="flex justify-end">
              <SaveSimulationButton
                toolType="inflation"
                toolLabel="Calculateur d'Inflation"
                parameters={{
                  montant,
                  inflation,
                  duree,
                  comparatifActif,
                  rendement,
                }}
                results={results}
              />
            </div>
          </div>
        </div>

        {/* Bloc pédagogique en bas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="rounded-3xl shadow-card bg-gradient-to-br from-primary/5 via-background to-chart-2/5">
            <CardContent className="py-6">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="p-4 rounded-2xl bg-primary/10 shrink-0">
                  <BookOpen className="h-8 w-8 text-primary" />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="font-semibold text-lg text-foreground mb-1">
                    En savoir plus : Pourquoi l'inflation est l'ennemie de l'épargne ?
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Découvrez comment protéger votre patrimoine de l'érosion monétaire et les stratégies pour faire fructifier votre épargne.
                  </p>
                </div>
                <Button asChild className="shrink-0 rounded-xl">
                  <Link to="/blog/inflation-ennemie-epargne">
                    Lire l'article
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </MainLayout>
  );
}
