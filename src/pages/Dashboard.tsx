import { MainLayout } from "@/components/layout/MainLayout";
import { KPICard } from "@/components/dashboard/KPICard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { AddAssetModal } from "@/components/dashboard/AddAssetModal";
import { AddIncomeModal } from "@/components/dashboard/AddIncomeModal";
import { AddExpenseModal } from "@/components/dashboard/AddExpenseModal";
import { GoalsModal } from "@/components/dashboard/GoalsModal";
import { AssetsList } from "@/components/dashboard/AssetsList";
import { ExpenseAnalysis } from "@/components/dashboard/ExpenseAnalysis";
import { useWealth, Asset } from "@/contexts/WealthContext";
import { useAnimatedCounter } from "@/hooks/useAnimatedCounter";
import { Wallet, TrendingUp, TrendingDown, PiggyBank, Plus, Pencil, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import { useMemo, useState } from "react";

// Données statiques pour l'historique du solde (évolution mensuelle)
const balanceHistory = [
  { name: "Jan", balance: 12500 },
  { name: "Fév", balance: 14200 },
  { name: "Mar", balance: 13800 },
  { name: "Avr", balance: 16500 },
  { name: "Mai", balance: 18200 },
  { name: "Juin", balance: 21000 },
  { name: "Juil", balance: 19800 },
  { name: "Août", balance: 22500 },
];

const ASSET_COLORS: Record<string, string> = {
  Immobilier: "#2D60FF",
  Bourse: "#16DBCC",
  Épargne: "#FFBB38",
  Crypto: "#9333EA",
  Cash: "#22C55E",
  Autre: "#718EBF",
};

export default function Dashboard() {
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
  
  // Animated counter for patrimoine
  const animatedPatrimoine = useAnimatedCounter(totalPatrimoine);

  // Données pour le pie chart - agrégées par type d'actif
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
      {/* Header with Add Button */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">Vue d'ensemble</h2>
        <Button onClick={() => setIsAddModalOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Ajouter un actif
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Patrimoine Card with Edit Button */}
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
        
        {/* Revenus Card - Editable */}
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

        {/* Dépenses Card - Editable */}
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

        {/* Épargne Mensuelle - Calculée automatiquement */}
        <KPICard
          title="Épargne Mensuelle"
          value={formatCurrency(epargneMensuelle)}
          icon={PiggyBank}
          iconColor="text-teal-500"
          iconBg="bg-teal-500/10"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Expense Analysis with AI */}
        <div className="lg:col-span-2">
          <ExpenseAnalysis />
        </div>

        {/* Pie Chart */}
        <div className="bg-card rounded-3xl p-6 shadow-card">
          <h3 className="text-lg font-semibold text-foreground mb-4">Répartition Patrimoine</h3>
          {patrimoineData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={patrimoineData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
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
          ) : (
            <div className="h-[280px] flex items-center justify-center text-muted-foreground">
              Aucun actif enregistré
            </div>
          )}
          {/* Legend */}
          {patrimoineData.length > 0 && (
            <div className="flex flex-wrap justify-center gap-3 mt-2">
              {patrimoineData.map((entry) => (
                <div key={entry.name} className="flex items-center gap-1.5">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-xs text-muted-foreground">{entry.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Balance History Chart */}
      <div className="bg-card rounded-3xl p-6 shadow-card mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Historique du Solde</h3>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={balanceHistory}>
            <defs>
              <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2D60FF" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#2D60FF" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.3)" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: "#718EBF", fontSize: 12 }}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: "#718EBF", fontSize: 12 }}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
              formatter={(value: number) => [`${value.toLocaleString("fr-FR")} €`, "Solde"]}
              labelStyle={{ color: "#343C6A", fontWeight: 600 }}
            />
            <Area 
              type="monotone"
              dataKey="balance" 
              stroke="#2D60FF" 
              strokeWidth={3}
              fill="url(#balanceGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Assets List */}
      <div className="mb-6">
        <AssetsList 
          onAddClick={() => setIsAddModalOpen(true)} 
          onEditClick={handleEditAsset} 
        />
      </div>

      {/* Recent Activity & Objectifs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity />
        
        {/* Objectifs FIRE - Basé sur l'épargne (Cash + Épargne) */}
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
            <div className="space-y-5">
              {fireGoals.map((goal) => {
                // Utiliser totalEpargne au lieu de totalPatrimoine
                const progress = Math.min((totalEpargne / goal.target) * 100, 100);
                
                return (
                  <div key={goal.id}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-foreground font-medium">{goal.label}</span>
                      <span className="text-muted-foreground">
                        {totalEpargne.toLocaleString("fr-FR")} € / {goal.target.toLocaleString("fr-FR")} €
                      </span>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500 ease-out"
                        style={{ 
                          width: `${progress}%`,
                          backgroundColor: goal.color,
                        }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {progress.toFixed(0)}% atteint
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
          
          {/* Info épargne */}
          {fireGoals.length > 0 && (
            <p className="text-xs text-muted-foreground mt-4 text-center">
              Basé sur votre épargne liquide (Cash + Épargne)
            </p>
          )}
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
      <GoalsModal open={isGoalsModalOpen} onOpenChange={setIsGoalsModalOpen} />
    </MainLayout>
  );
}
