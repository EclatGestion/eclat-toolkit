import { MainLayout } from "@/components/layout/MainLayout";
import { KPICard } from "@/components/dashboard/KPICard";
import { AddAssetModal } from "@/components/dashboard/AddAssetModal";
import { AddIncomeModal } from "@/components/dashboard/AddIncomeModal";
import { AddExpenseModal } from "@/components/dashboard/AddExpenseModal";
import { GoalsModal } from "@/components/dashboard/GoalsModal";
import { AssetsList } from "@/components/dashboard/AssetsList";
import { ExpenseAnalysis } from "@/components/dashboard/ExpenseAnalysis";
import { SafetyRunway } from "@/components/dashboard/SafetyRunway";
import { SavingsRateBooster } from "@/components/dashboard/SavingsRateBooster";
import { BudgetRuleAnalysis } from "@/components/dashboard/BudgetRuleAnalysis";
import { PremiumLock } from "@/components/premium/PremiumLock";
import { PremiumBanner } from "@/components/premium/PremiumBanner";
import { UpgradeSuccessModal } from "@/components/premium/UpgradeSuccessModal";
import { useWealth, Asset } from "@/contexts/WealthContext";
import { usePremium } from "@/hooks/usePremium";
import { useAnimatedCounter } from "@/hooks/useAnimatedCounter";
import { Wallet, TrendingUp, TrendingDown, PiggyBank, Plus, Pencil, Settings, Calculator, Home, ChartLine, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";
import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";

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

export default function Dashboard() {
  const navigate = useNavigate();
  const { 
    assets, 
    totalPatrimoine, 
    totalEpargne, 
    totalRevenus, 
    totalDepenses, 
    epargneMensuelle, 
    fireGoals 
  } = useWealth();
  const { refreshSubscription } = usePremium();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isGoalsModalOpen, setIsGoalsModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);

  // Check for upgrade success from Stripe
  useEffect(() => {
    if (searchParams.get("upgrade") === "success") {
      setIsSuccessModalOpen(true);
      refreshSubscription();
      setSearchParams({});
    }
  }, [searchParams, setSearchParams, refreshSubscription]);
  
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

  const formatCurrency = (value: number) => {
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
    <MainLayout title="Dashboard">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Premium Banner for Standard Users */}
        <PremiumBanner />

        {/* Header */}
        <motion.div variants={itemVariants} className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-foreground">Vue d'ensemble</h2>
          <Button onClick={() => setIsAddModalOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Ajouter un actif
          </Button>
        </motion.div>

        {/* Quick Access Tools */}
        <motion.div variants={itemVariants} className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Outils Rapides</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate("/catalogue")}
              className="text-primary hover:text-primary/80 gap-1"
            >
              Voir tout
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={() => navigate("/tools/simulateur-ir")}
              className="flex items-center gap-4 p-4 bg-card rounded-2xl shadow-card hover:shadow-lg transition-all duration-200 group text-left"
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Calculator className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">Simulateur IR</p>
                <p className="text-xs text-muted-foreground">Calculez votre impôt</p>
              </div>
            </button>
            
            <button
              onClick={() => navigate("/tools/simulateur-immobilier")}
              className="flex items-center gap-4 p-4 bg-card rounded-2xl shadow-card hover:shadow-lg transition-all duration-200 group text-left"
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-emerald-500/10 group-hover:bg-emerald-500/20 transition-colors">
                <Home className="w-6 h-6 text-emerald-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">Immobilier</p>
                <p className="text-xs text-muted-foreground">Mensualité & Capacité</p>
              </div>
            </button>
            
            <button
              onClick={() => navigate("/tools/interets-composes")}
              className="flex items-center gap-4 p-4 bg-card rounded-2xl shadow-card hover:shadow-lg transition-all duration-200 group text-left"
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-rose-500/10 group-hover:bg-rose-500/20 transition-colors">
                <ChartLine className="w-6 h-6 text-rose-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">Intérêts Composés</p>
                <p className="text-xs text-muted-foreground">Projetez vos placements</p>
              </div>
            </button>
          </div>
        </motion.div>

        {/* KPI Cards */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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

          {/* Épargne Mensuelle */}
          <KPICard
            title="Épargne Mensuelle"
            value={formatCurrency(epargneMensuelle)}
            icon={PiggyBank}
            iconColor="text-teal-500"
            iconBg="bg-teal-500/10"
          />
        </motion.div>

        {/* Premium Analytics Row */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <PremiumLock featureName="la jauge de sérénité">
            <SafetyRunway />
          </PremiumLock>
          
          <PremiumLock featureName="le coach épargne">
            <SavingsRateBooster />
          </PremiumLock>
          
          <PremiumLock featureName="l'analyse 50/30/20">
            <BudgetRuleAnalysis />
          </PremiumLock>
        </motion.div>

        {/* Expense Analysis - Full Width */}
        <motion.div variants={itemVariants} className="mb-6">
          <PremiumLock featureName="l'analyse IA des dépenses">
            <ExpenseAnalysis />
          </PremiumLock>
        </motion.div>

        {/* Assets & Patrimoine Distribution Row */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <AssetsList 
            onAddClick={() => setIsAddModalOpen(true)} 
            onEditClick={handleEditAsset} 
          />
          
          {/* Patrimoine Distribution Pie Chart */}
          <div className="bg-card rounded-3xl p-6 shadow-card">
            <h3 className="text-lg font-semibold text-foreground mb-4">Répartition Patrimoine</h3>
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
                      formatter={(value: number) => `${value.toLocaleString("fr-FR")} €`}
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
                  {patrimoineData.map((entry) => (
                    <div key={entry.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: entry.color }}
                        />
                        <span className="text-sm text-muted-foreground">{entry.name}</span>
                      </div>
                      <span className="text-sm font-medium text-foreground">
                        {formatCurrency(entry.value)}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-[280px] flex items-center justify-center text-muted-foreground">
                Aucun actif enregistré
              </div>
            )}
          </div>
        </motion.div>

        {/* FIRE Goals */}
        <motion.div variants={itemVariants}>
          <div className="bg-card rounded-3xl p-6 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Objectifs FIRE</h3>
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
                        {totalEpargne.toLocaleString("fr-FR")} € / {goal.target.toLocaleString("fr-FR")} €
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
      <UpgradeSuccessModal open={isSuccessModalOpen} onOpenChange={setIsSuccessModalOpen} />
    </MainLayout>
  );
}
