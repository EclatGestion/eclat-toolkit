import { MainLayout } from "@/components/layout/MainLayout";
import { AddAssetModal } from "@/components/dashboard/AddAssetModal";
import { AddIncomeModal } from "@/components/dashboard/AddIncomeModal";
import { AddExpenseModal } from "@/components/dashboard/AddExpenseModal";
import { AssetsGrouped } from "@/components/dashboard/AssetsGrouped";
import { InsightsSection } from "@/components/dashboard/InsightsSection";
import { MiniKPI } from "@/components/dashboard/MiniKPI";
import { useWealth, Asset } from "@/contexts/WealthContext";
import { useAnimatedCounter } from "@/hooks/useAnimatedCounter";
import { useState } from "react";
import { motion } from "framer-motion";

export default function Patrimoine() {
  const { 
    totalPatrimoine, 
    totalRevenus, 
    totalDepenses, 
    epargneMensuelle 
  } = useWealth();
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  
  const animatedPatrimoine = useAnimatedCounter(totalPatrimoine);

  // Calcul du taux d'épargne
  const tauxEpargne = totalRevenus > 0 
    ? Math.round((epargneMensuelle * 12 / totalRevenus) * 100) 
    : 0;

  const getTauxEpargneColor = (): "green" | "orange" | "red" => {
    if (tauxEpargne >= 20) return "green";
    if (tauxEpargne >= 10) return "orange";
    return "red";
  };

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return (value / 1000000).toFixed(2).replace('.', ',') + " M€";
    }
    if (value >= 1000) {
      return Math.round(value / 1000) + " k€";
    }
    return value.toLocaleString("fr-FR") + " €";
  };

  const handleEditAsset = (asset: Asset) => {
    setEditingAsset(asset);
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = (open: boolean) => {
    setIsAddModalOpen(open);
    if (!open) setEditingAsset(null);
  };

  return (
    <MainLayout title="Mon Patrimoine">
      <div className="space-y-6">
        {/* Hero Section - Patrimoine Total */}
        <motion.section
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-3xl p-8 text-center"
        >
          {/* Decorative elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-primary/5 rounded-full blur-2xl" />
          </div>
          
          <div className="relative z-10">
            <p className="text-sm text-muted-foreground uppercase tracking-widest mb-2">
              Patrimoine Total
            </p>
            <motion.h1
              key={animatedPatrimoine}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="text-5xl md:text-6xl font-bold text-foreground mb-1"
            >
              {formatCurrency(animatedPatrimoine)}
            </motion.h1>
          </div>
        </motion.section>

        {/* Mini KPIs Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-3 md:gap-4"
        >
          <MiniKPI
            label="Revenus"
            value={`${formatCurrency(totalRevenus / 12)}/mois`}
            onClick={() => setIsIncomeModalOpen(true)}
          />
          <MiniKPI
            label="Dépenses"
            value={`${formatCurrency(totalDepenses / 12)}/mois`}
            onClick={() => setIsExpenseModalOpen(true)}
          />
          <MiniKPI
            label="Épargne"
            value={`${formatCurrency(epargneMensuelle)}/mois`}
            badge={`${tauxEpargne}%`}
            badgeColor={getTauxEpargneColor()}
          />
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Assets Grouped */}
          <AssetsGrouped
            onAddClick={() => setIsAddModalOpen(true)}
            onEditClick={handleEditAsset}
          />

          {/* Insights Section */}
          <InsightsSection />
        </div>
      </div>

      {/* Modals */}
      <AddAssetModal 
        open={isAddModalOpen} 
        onOpenChange={handleCloseAddModal} 
        editAsset={editingAsset}
      />
      <AddIncomeModal open={isIncomeModalOpen} onOpenChange={setIsIncomeModalOpen} />
      <AddExpenseModal open={isExpenseModalOpen} onOpenChange={setIsExpenseModalOpen} />
    </MainLayout>
  );
}
