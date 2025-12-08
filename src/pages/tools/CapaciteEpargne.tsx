import { useState } from "react";
import { motion } from "framer-motion";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Calculator } from "lucide-react";
import { RevenusCard } from "@/components/simulators/epargne/RevenusCard";
import { DepensesFixesCard } from "@/components/simulators/epargne/DepensesFixesCard";
import { DepensesVariablesCard } from "@/components/simulators/epargne/DepensesVariablesCard";
import { ResultatsEpargne } from "@/components/simulators/epargne/ResultatsEpargne";
import type { ProfilType } from "@/components/simulators/epargne/ProfilSelector";

interface Credit {
  id: string;
  label: string;
  montant: number;
}

export default function CapaciteEpargne() {
  // États Revenus
  const [salaireNet, setSalaireNet] = useState(2500);
  const [autresRevenus, setAutresRevenus] = useState(0);

  // États Dépenses fixes
  const [loyer, setLoyer] = useState(800);
  const [credits, setCredits] = useState<Credit[]>([]);
  const [abonnements, setAbonnements] = useState(100);
  const [impots, setImpots] = useState(0);

  // États Dépenses variables
  const [depensesVariables, setDepensesVariables] = useState(700);
  const [profilActif, setProfilActif] = useState<ProfilType | null>("standard");
  const [useSlider, setUseSlider] = useState(false);

  // État affichage résultats
  const [showResults, setShowResults] = useState(false);

  // Calculs
  const revenusTotaux = salaireNet + autresRevenus;
  const totalCredits = credits.reduce((sum, c) => sum + c.montant, 0);
  const depensesFixes = loyer + totalCredits + abonnements + impots;
  const capaciteEpargne = revenusTotaux - depensesFixes - depensesVariables;
  const tauxEpargne = revenusTotaux > 0 ? (capaciteEpargne / revenusTotaux) * 100 : 0;

  const handleCalculer = () => {
    setShowResults(true);
  };

  return (
    <MainLayout title="Capacité d'Épargne Mensuelle">
      <div className="space-y-8">
        {/* Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-2xl mx-auto"
        >
          <p className="text-muted-foreground">
            Calculez votre potentiel d'épargne mensuelle en quelques clics et découvrez
            comment optimiser votre budget pour atteindre vos objectifs financiers.
          </p>
        </motion.div>

        {/* Formulaire */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <RevenusCard
              salaireNet={salaireNet}
              setSalaireNet={setSalaireNet}
              autresRevenus={autresRevenus}
              setAutresRevenus={setAutresRevenus}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <DepensesFixesCard
              loyer={loyer}
              setLoyer={setLoyer}
              credits={credits}
              setCredits={setCredits}
              abonnements={abonnements}
              setAbonnements={setAbonnements}
              impots={impots}
              setImpots={setImpots}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <DepensesVariablesCard
              depensesVariables={depensesVariables}
              setDepensesVariables={setDepensesVariables}
              profilActif={profilActif}
              setProfilActif={setProfilActif}
              useSlider={useSlider}
              setUseSlider={setUseSlider}
            />
          </motion.div>
        </div>

        {/* Bouton Calculer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex justify-center"
        >
          <Button
            size="lg"
            onClick={handleCalculer}
            className="rounded-2xl px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all"
          >
            <Calculator className="mr-2 h-5 w-5" />
            Calculer ma capacité d'épargne
          </Button>
        </motion.div>

        {/* Résultats */}
        {showResults && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ResultatsEpargne
              capaciteEpargne={capaciteEpargne}
              tauxEpargne={tauxEpargne}
              revenusTotaux={revenusTotaux}
              depensesFixes={depensesFixes}
              depensesVariables={depensesVariables}
            />
          </motion.div>
        )}
      </div>
    </MainLayout>
  );
}
