import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { TrendingUp, Sparkles } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { useWealth } from "@/contexts/WealthContext";

export function SavingsRateBooster() {
  const { totalRevenus, totalDepenses } = useWealth();
  const [reduction, setReduction] = useState(0);

  const { currentRate, boostedRate, monthlySavings, boostedSavings } = useMemo(() => {
    const monthlyIncome = totalRevenus / 12;
    const monthlyExpenses = totalDepenses / 12;
    const currentSavings = monthlyIncome - monthlyExpenses;
    const currentSavingsRate = monthlyIncome > 0 ? (currentSavings / monthlyIncome) * 100 : 0;

    const newExpenses = monthlyExpenses - reduction;
    const newSavings = monthlyIncome - newExpenses;
    const newRate = monthlyIncome > 0 ? (newSavings / monthlyIncome) * 100 : 0;

    return {
      currentRate: Math.max(0, currentSavingsRate),
      boostedRate: Math.max(0, Math.min(100, newRate)),
      monthlySavings: Math.max(0, currentSavings),
      boostedSavings: Math.max(0, newSavings),
    };
  }, [totalRevenus, totalDepenses, reduction]);

  const displayRate = reduction > 0 ? boostedRate : currentRate;
  const chartData = [
    { name: "Épargne", value: displayRate, fill: "hsl(var(--primary))" },
    { name: "Dépenses", value: 100 - displayRate, fill: "hsl(var(--muted))" },
  ];

  const getMessage = () => {
    if (displayRate >= 30) return "Excellent ! Vous êtes sur la voie de l'indépendance financière 🎯";
    if (displayRate >= 20) return "Très bien ! Vous dépassez la règle des 20% 💪";
    if (displayRate >= 10) return "Bon début ! Visez 20% pour accélérer 📈";
    return "Chaque euro compte, commencez petit 🌱";
  };

  return (
    <div className="bg-card rounded-3xl p-6 shadow-card">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-foreground">Coach Épargne</h3>
        <div className="flex items-center gap-1 text-primary">
          <TrendingUp className="w-4 h-4" />
          <span className="text-sm font-medium">{displayRate.toFixed(0)}%</span>
        </div>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Votre taux d'épargne mensuel
      </p>

      {/* Donut Chart */}
      <div className="relative h-[160px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={70}
              startAngle={90}
              endAngle={-270}
              dataKey="value"
              stroke="none"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center content */}
        <motion.div
          key={displayRate}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="absolute inset-0 flex flex-col items-center justify-center"
        >
          <span className="text-3xl font-bold text-foreground">
            {displayRate.toFixed(0)}%
          </span>
          <span className="text-xs text-muted-foreground">d'épargne</span>
        </motion.div>
      </div>

      {/* Savings amount */}
      <div className="text-center mb-4">
        <motion.p
          key={reduction}
          initial={{ y: -5, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-lg font-semibold text-foreground"
        >
          {(reduction > 0 ? boostedSavings : monthlySavings).toLocaleString("fr-FR")} €
          <span className="text-sm font-normal text-muted-foreground">/mois</span>
        </motion.p>
        {reduction > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-success flex items-center justify-center gap-1"
          >
            <Sparkles className="w-3 h-3" />
            +{(boostedSavings - monthlySavings).toLocaleString("fr-FR")} € économisés
          </motion.p>
        )}
      </div>

      {/* Slider */}
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Réduire mes dépenses de</span>
          <span className="font-medium text-foreground">{reduction} €/mois</span>
        </div>
        <Slider
          value={[reduction]}
          onValueChange={([value]) => setReduction(value)}
          max={500}
          step={10}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>0 €</span>
          <span>500 €</span>
        </div>
      </div>

      {/* Motivational message */}
      <motion.p
        key={getMessage()}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center text-sm mt-4 p-3 bg-primary/5 rounded-xl text-primary"
      >
        {getMessage()}
      </motion.p>
    </div>
  );
}
