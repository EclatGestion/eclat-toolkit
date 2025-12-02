import { MainLayout } from "@/components/layout/MainLayout";
import { KPICard } from "@/components/dashboard/KPICard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { Wallet, TrendingUp, TrendingDown, PiggyBank } from "lucide-react";
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
  Legend,
} from "recharts";

const monthlyData = [
  { name: "Jan", revenus: 4200, depenses: 2800 },
  { name: "Fév", revenus: 4500, depenses: 3000 },
  { name: "Mar", revenus: 4100, depenses: 2600 },
  { name: "Avr", revenus: 4800, depenses: 3200 },
  { name: "Mai", revenus: 4600, depenses: 2900 },
  { name: "Juin", revenus: 5000, depenses: 3100 },
];

const patrimoineData = [
  { name: "Immobilier", value: 350000, color: "hsl(227, 100%, 59%)" },
  { name: "Actions", value: 85000, color: "hsl(172, 66%, 50%)" },
  { name: "Épargne", value: 45000, color: "hsl(38, 92%, 50%)" },
  { name: "Crypto", value: 20000, color: "hsl(291, 64%, 42%)" },
];

export default function Dashboard() {
  return (
    <MainLayout title="Dashboard">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KPICard
          title="Patrimoine Total"
          value="500 000 €"
          icon={Wallet}
          iconColor="text-amber-500"
          iconBg="bg-amber-500/10"
        />
        <KPICard
          title="Revenus Annuels"
          value="54 000 €"
          icon={TrendingUp}
          iconColor="text-emerald-500"
          iconBg="bg-emerald-500/10"
        />
        <KPICard
          title="Dépenses Annuelles"
          value="35 200 €"
          icon={TrendingDown}
          iconColor="text-rose-500"
          iconBg="bg-rose-500/10"
        />
        <KPICard
          title="Épargne Mensuelle"
          value="1 500 €"
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
    </MainLayout>
  );
}
