import { useMemo } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts";
import { AlertTriangle, CheckCircle, Info } from "lucide-react";
import { useWealth } from "@/contexts/WealthContext";

// Mapping des catégories selon la règle 50/30/20
const CATEGORY_MAPPING = {
  besoins: ["Logement", "Alimentation", "Transport", "Santé"],
  envies: ["Loisirs", "Shopping", "Abonnements"],
};

export function BudgetRuleAnalysis() {
  const { totalRevenus, totalDepenses, expensesByCategory, lastAnalysis } = useWealth();

  const { analysis, alerts, hasData } = useMemo(() => {
    const monthlyIncome = totalRevenus / 12;
    
    // Check if we have categorized expense data
    const hasCsvData = lastAnalysis && expensesByCategory && Object.keys(expensesByCategory).length > 0;
    
    let besoinsAmount = 0;
    let enviesAmount = 0;
    let epargneAmount = 0;

    if (hasCsvData) {
      // Use real categorized data from CSV analysis
      besoinsAmount = CATEGORY_MAPPING.besoins.reduce(
        (sum, cat) => sum + (expensesByCategory[cat] || 0),
        0
      );
      enviesAmount = CATEGORY_MAPPING.envies.reduce(
        (sum, cat) => sum + (expensesByCategory[cat] || 0),
        0
      );
      // Épargne from CSV if available, otherwise calculate
      epargneAmount = expensesByCategory["Épargne"] || Math.max(0, monthlyIncome - besoinsAmount - enviesAmount);
    } else {
      // Fallback: use manual expenses with estimated 60/40 split
      const monthlyExpenses = totalDepenses / 12;
      besoinsAmount = monthlyExpenses * 0.6;
      enviesAmount = monthlyExpenses * 0.4;
      epargneAmount = Math.max(0, monthlyIncome - monthlyExpenses);
    }

    const besoinsPercent = monthlyIncome > 0 ? (besoinsAmount / monthlyIncome) * 100 : 0;
    const enviesPercent = monthlyIncome > 0 ? (enviesAmount / monthlyIncome) * 100 : 0;
    const epargnePercent = monthlyIncome > 0 ? (epargneAmount / monthlyIncome) * 100 : 0;

    const analysisData = [
      {
        category: "Besoins",
        actual: Math.min(besoinsPercent, 100),
        target: 50,
        color: besoinsPercent > 55 ? "hsl(0 84% 60%)" : "hsl(var(--chart-1))",
        isOver: besoinsPercent > 55,
        amount: besoinsAmount,
      },
      {
        category: "Envies",
        actual: Math.min(enviesPercent, 100),
        target: 30,
        color: enviesPercent > 35 ? "hsl(0 84% 60%)" : "hsl(var(--chart-2))",
        isOver: enviesPercent > 35,
        amount: enviesAmount,
      },
      {
        category: "Épargne",
        actual: Math.max(0, Math.min(epargnePercent, 100)),
        target: 20,
        color: epargnePercent < 15 ? "hsl(38 92% 50%)" : "hsl(var(--chart-4))",
        isUnder: epargnePercent < 15,
        amount: epargneAmount,
      },
    ];

    const alertsList: string[] = [];
    if (besoinsPercent > 55) alertsList.push("Vos besoins dépassent 50% de vos revenus");
    if (enviesPercent > 35) alertsList.push("Vos envies dépassent 30% de vos revenus");
    if (epargnePercent < 15) alertsList.push("Votre épargne est inférieure à 20%");

    return { 
      analysis: analysisData, 
      alerts: alertsList,
      hasData: hasCsvData,
    };
  }, [totalRevenus, totalDepenses, expensesByCategory, lastAnalysis]);

  const hasAlerts = alerts.length > 0;

  return (
    <div className="bg-card rounded-3xl p-6 shadow-card h-full flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-foreground">Règle 50/30/20</h3>
        {hasAlerts ? (
          <div className="flex items-center gap-1 text-warning">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-xs font-medium">{alerts.length} alerte{alerts.length > 1 ? "s" : ""}</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-success">
            <CheckCircle className="w-4 h-4" />
            <span className="text-xs font-medium">Équilibré</span>
          </div>
        )}
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Comparez votre budget à la règle idéale
      </p>

      {/* Chart */}
      <div className="h-[180px] flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={analysis}
            layout="vertical"
            margin={{ top: 0, right: 20, left: 0, bottom: 0 }}
            barGap={8}
          >
            <XAxis type="number" domain={[0, 100]} hide />
            <YAxis
              type="category"
              dataKey="category"
              axisLine={false}
              tickLine={false}
              width={70}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            />
            {/* Target bar (background) */}
            <Bar
              dataKey="target"
              fill="hsl(var(--muted))"
              radius={[0, 6, 6, 0]}
              barSize={24}
            />
            {/* Actual bar (overlay) */}
            <Bar
              dataKey="actual"
              radius={[0, 6, 6, 0]}
              barSize={24}
            >
              {analysis.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-6 mt-2 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-muted" />
          <span className="text-xs text-muted-foreground">Objectif</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-primary" />
          <span className="text-xs text-muted-foreground">Réel</span>
        </div>
      </div>

      {/* Alerts */}
      {hasAlerts && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          {alerts.map((alert, index) => (
            <div
              key={index}
              className="flex items-start gap-2 p-2 bg-warning/10 rounded-lg text-sm"
            >
              <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
              <span className="text-foreground">{alert}</span>
            </div>
          ))}
        </motion.div>
      )}

      {/* Info */}
      {!hasAlerts && (
        <div className="flex items-start gap-2 p-3 bg-success/10 rounded-xl text-sm">
          <CheckCircle className="w-4 h-4 text-success shrink-0 mt-0.5" />
          <span className="text-foreground">
            Votre budget respecte la règle 50/30/20. Continuez ainsi !
          </span>
        </div>
      )}

      {/* Tooltip info */}
      <div className="flex items-start gap-2 mt-3 text-xs text-muted-foreground">
        <Info className="w-3 h-3 shrink-0 mt-0.5" />
        <span>
          {hasData 
            ? "Basé sur vos données CSV importées"
            : "50% besoins essentiels, 30% envies, 20% épargne"
          }
        </span>
      </div>
    </div>
  );
}
