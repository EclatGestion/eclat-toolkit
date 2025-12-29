import { MainLayout } from "@/components/layout/MainLayout";
import { AddAssetModal } from "@/components/dashboard/AddAssetModal";
import { AddIncomeModal } from "@/components/dashboard/AddIncomeModal";
import { AddExpenseModal } from "@/components/dashboard/AddExpenseModal";
import { GoalsModal } from "@/components/dashboard/GoalsModal";
import { AssetsList } from "@/components/dashboard/AssetsList";
import { useWealth, Asset } from "@/contexts/WealthContext";
import { useAnimatedCounter } from "@/hooks/useAnimatedCounter";
import { Wallet, TrendingUp, TrendingDown, PiggyBank, Plus, Pencil, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";

const ASSET_COLORS: Record<string, string> = {
  Immobilier: "#2D60FF",
  Bourse: "#16DBCC",
  Épargne: "#FFBB38",
  Crypto: "#9333EA",
  Cash: "#22C55E",
  Autre: "#718EBF",
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function Patrimoine() {
  const { 
    assets, 
    totalPatrimoine, 
    totalEpargne, 
    totalRevenus, 
    totalDepenses, 
    epargneMensuelle, 
    fireGoals 
  } = useWealth();
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isGoalsModalOpen, setIsGoalsModalOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  
  const animatedPatrimoine = useAnimatedCounter(totalPatrimoine);

  const patrimoineData = useMemo(() => {
    const grouped = assets.reduce((acc, asset) => {
      const existing = acc.find((a) => a.name === asset.type);
      if (existing) {
        existing.value += asset.value;
      } else {
        acc.push({
          name: asset.type,
          value: asset.value,
          color: ASSET_COLORS[asset.type] || ASSET_COLORS.Autre,
        });
      }
      return acc;
    }, [] as { name: string; value: number; color: string }[]);
    return grouped;
  }, [assets]);

  // Calcul du taux d'épargne
  const tauxEpargne = totalRevenus > 0 
    ? Math.round((epargneMensuelle * 12 / totalRevenus) * 100) 
    : 0;

  const getTauxEpargneColor = () => {
    if (tauxEpargne >= 20) return "text-emerald-500";
    if (tauxEpargne >= 10) return "text-amber-500";
    return "text-rose-500";
  };

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return (value / 1000000).toFixed(2).replace('.', ',') + " M€";
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
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* KPI Cards */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Patrimoine Card */}
          <div className="bg-card rounded-3xl p-5 shadow-card">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full flex items-center justify-center bg-amber-500/10">
                <Wallet className="w-6 h-6 text-amber-500" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Patrimoine Total</p>
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="p-1 hover:bg-muted rounded-md transition-colors"
                    title="Modifier"
                  >
                    <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>
                </div>
                <p className="text-xl font-semibold text-foreground">
                  {formatCurrency(animatedPatrimoine)}
                </p>
              </div>
            </div>
          </div>
          
          {/* Revenus Card */}
          <div className="bg-card rounded-3xl p-5 shadow-card">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full flex items-center justify-center bg-emerald-500/10">
                <TrendingUp className="w-6 h-6 text-emerald-500" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Revenus Annuels</p>
                  <button
                    onClick={() => setIsIncomeModalOpen(true)}
                    className="p-1 hover:bg-muted rounded-md transition-colors"
                    title="Modifier"
                  >
                    <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>
                </div>
                <p className="text-xl font-semibold text-foreground">
                  {formatCurrency(totalRevenus)}
                </p>
              </div>
            </div>
          </div>

          {/* Dépenses Card */}
          <div className="bg-card rounded-3xl p-5 shadow-card">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full flex items-center justify-center bg-rose-500/10">
                <TrendingDown className="w-6 h-6 text-rose-500" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Dépenses Annuelles</p>
                  <button
                    onClick={() => setIsExpenseModalOpen(true)}
                    className="p-1 hover:bg-muted rounded-md transition-colors"
                    title="Modifier"
                  >
                    <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>
                </div>
                <p className="text-xl font-semibold text-foreground">
                  {formatCurrency(totalDepenses)}
                </p>
              </div>
            </div>
          </div>

          {/* Épargne Mensuelle + Taux */}
          <div className="bg-card rounded-3xl p-5 shadow-card">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full flex items-center justify-center bg-teal-500/10">
                <PiggyBank className="w-6 h-6 text-teal-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Épargne Mensuelle</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-xl font-semibold text-foreground">
                    {formatCurrency(epargneMensuelle)}
                  </p>
                  <span className={`text-sm font-medium ${getTauxEpargneColor()}`}>
                    {tauxEpargne}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Assets & Patrimoine Distribution Row */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AssetsList 
            onAddClick={() => setIsAddModalOpen(true)} 
            onEditClick={handleEditAsset} 
          />
          
          {/* Patrimoine Distribution Pie Chart */}
          <div className="bg-card rounded-3xl p-6 shadow-card">
            <h3 className="text-lg font-semibold text-foreground mb-4">📊 Répartition Patrimoine</h3>
            {patrimoineData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={patrimoineData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                      stroke="none"
                    >
                      {patrimoineData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => formatCurrency(value)}
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "12px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                {/* Legend with values */}
                <div className="space-y-2 mt-4">
                  {patrimoineData.map((entry) => {
                    const percentage = totalPatrimoine > 0 
                      ? Math.round((entry.value / totalPatrimoine) * 100) 
                      : 0;
                    return (
                      <div key={entry.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: entry.color }}
                          />
                          <span className="text-sm text-muted-foreground">{entry.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-foreground">
                            {formatCurrency(entry.value)}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            ({percentage}%)
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="h-[280px] flex flex-col items-center justify-center text-muted-foreground">
                <Wallet className="w-12 h-12 mb-4 opacity-30" />
                <p>Aucun actif enregistré</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-4"
                  onClick={() => setIsAddModalOpen(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter un actif
                </Button>
              </div>
            )}
          </div>
        </motion.div>

        {/* FIRE Goals */}
        <motion.div variants={itemVariants}>
          <div className="bg-card rounded-3xl p-6 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">🎯 Objectifs FIRE</h3>
              <button
                onClick={() => setIsGoalsModalOpen(true)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
                title="Gérer les objectifs"
              >
                <Settings className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            
            {fireGoals.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {fireGoals.map((goal) => {
                  const progress = Math.min((totalEpargne / goal.target) * 100, 100);
                  
                  return (
                    <div key={goal.id} className="p-4 bg-muted/30 rounded-2xl">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-foreground font-medium">{goal.label}</span>
                        <span className="text-muted-foreground">
                          {progress.toFixed(0)}%
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden mb-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: goal.color }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {formatCurrency(totalEpargne)} / {formatCurrency(goal.target)}
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">Aucun objectif défini</p>
                <Button 
                  variant="outline" 
                  onClick={() => setIsGoalsModalOpen(true)}
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Créer un objectif
                </Button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* Modals */}
      <AddAssetModal 
        open={isAddModalOpen} 
        onOpenChange={handleCloseAddModal} 
        editAsset={editingAsset}
      />
      <AddIncomeModal open={isIncomeModalOpen} onOpenChange={setIsIncomeModalOpen} />
      <AddExpenseModal open={isExpenseModalOpen} onOpenChange={setIsExpenseModalOpen} />
      <GoalsModal open={isGoalsModalOpen} onOpenChange={setIsGoalsModalOpen} />
    </MainLayout>
  );
}
