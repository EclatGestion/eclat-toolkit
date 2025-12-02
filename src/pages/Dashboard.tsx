import { MainLayout } from "@/components/layout/MainLayout";
import { KPICard } from "@/components/dashboard/KPICard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { AddAssetModal } from "@/components/dashboard/AddAssetModal";
import { useWealth } from "@/contexts/WealthContext";
import { useAnimatedCounter } from "@/hooks/useAnimatedCounter";
import { Wallet, TrendingUp, TrendingDown, PiggyBank, Plus, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useMemo, useState } from "react";

const monthlyData = [
  { name: "Jan", revenus: 4200, depenses: 2800 },
  { name: "Fév", revenus: 4500, depenses: 3000 },
  { name: "Mar", revenus: 4100, depenses: 2600 },
  { name: "Avr", revenus: 4800, depenses: 3200 },
  { name: "Mai", revenus: 4600, depenses: 2900 },
  { name: "Juin", revenus: 5000, depenses: 3100 },
];

const ASSET_COLORS: Record<string, string> = {
  Immobilier: "hsl(227, 100%, 59%)",
  Bourse: "hsl(172, 66%, 50%)",
  Épargne: "hsl(38, 92%, 50%)",
  Crypto: "hsl(291, 64%, 42%)",
  Cash: "hsl(142, 76%, 36%)",
  Autre: "hsl(0, 0%, 60%)",
};

export default function Dashboard() {
  const { assets, totalPatrimoine, totalRevenus, totalDepenses } = useWealth();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
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

  // Calcul épargne mensuelle (revenus - dépenses)
  const epargneMensuelle = useMemo(() => {
    return Math.max(0, totalRevenus - totalDepenses);
  }, [totalRevenus, totalDepenses]);

  const formatCurrency = (value: number) => {
    return value.toLocaleString("fr-FR") + " €";
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
        
        <KPICard
          title="Revenus Annuels"
          value={formatCurrency(totalRevenus)}
          icon={TrendingUp}
          iconColor="text-emerald-500"
          iconBg="bg-emerald-500/10"
        />
        <KPICard
          title="Dépenses Annuelles"
          value={formatCurrency(totalDepenses)}
          icon={TrendingDown}
          iconColor="text-rose-500"
          iconBg="bg-rose-500/10"
        />
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
        {/* Bar Chart */}
        <div className="lg:col-span-2 bg-card rounded-3xl p-6 shadow-card">
          <h3 className="text-lg font-semibold text-foreground mb-4">Évolution Mensuelle</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthlyData} barGap={8}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))" }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "12px",
                }}
              />
              <Bar dataKey="revenus" fill="hsl(227, 100%, 59%)" radius={[8, 8, 0, 0]} name="Revenus" />
              <Bar dataKey="depenses" fill="hsl(172, 66%, 50%)" radius={[8, 8, 0, 0]} name="Dépenses" />
            </BarChart>
          </ResponsiveContainer>
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
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {patrimoineData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => `${value.toLocaleString()} €`}
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[280px] flex items-center justify-center text-muted-foreground">
              Aucun actif enregistré
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity />
        
        {/* Objectifs */}
        <div className="bg-card rounded-3xl p-6 shadow-card">
          <h3 className="text-lg font-semibold text-foreground mb-4">Objectifs</h3>
          <div className="space-y-4">
            {[
              { label: "Épargne d'urgence", current: 15000, target: 20000, color: "bg-primary" },
              { label: "Apport immobilier", current: 45000, target: 80000, color: "bg-emerald-500" },
              { label: "Retraite", current: 85000, target: 500000, color: "bg-orange-500" },
            ].map((goal) => (
              <div key={goal.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-foreground font-medium">{goal.label}</span>
                  <span className="text-muted-foreground">
                    {goal.current.toLocaleString()} € / {goal.target.toLocaleString()} €
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full ${goal.color} rounded-full transition-all`}
                    style={{ width: `${(goal.current / goal.target) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Asset Modal */}
      <AddAssetModal open={isAddModalOpen} onOpenChange={setIsAddModalOpen} />
    </MainLayout>
  );
}
