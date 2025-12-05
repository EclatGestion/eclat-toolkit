import { useMemo } from "react";
import { motion } from "framer-motion";
import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";
import { Shield, AlertTriangle, CheckCircle } from "lucide-react";
import { useWealth } from "@/contexts/WealthContext";

export function SafetyRunway() {
  const { totalEpargne, totalDepenses } = useWealth();

  const { months, status, color, Icon, message } = useMemo(() => {
    const monthlyExpenses = totalDepenses / 12;
    const runwayMonths = monthlyExpenses > 0 ? totalEpargne / monthlyExpenses : 0;
    const cappedMonths = Math.min(runwayMonths, 12);

    if (runwayMonths < 3) {
      return {
        months: cappedMonths,
        status: "Critique",
        color: "hsl(0 84% 60%)",
        Icon: AlertTriangle,
        message: "Constituez une épargne de précaution",
      };
    } else if (runwayMonths < 6) {
      return {
        months: cappedMonths,
        status: "À surveiller",
        color: "hsl(38 92% 50%)",
        Icon: Shield,
        message: "Continuez à renforcer votre épargne",
      };
    } else {
      return {
        months: cappedMonths,
        status: "Sécurisé",
        color: "hsl(142 76% 36%)",
        Icon: CheckCircle,
        message: "Votre matelas de sécurité est solide",
      };
    }
  }, [totalEpargne, totalDepenses]);

  const chartData = [
    {
      name: "Runway",
      value: (months / 12) * 100,
      fill: color,
    },
  ];

  return (
    <div className="bg-card rounded-3xl p-6 shadow-card">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-foreground">Sérénité Financière</h3>
        <div 
          className="px-3 py-1 rounded-full text-xs font-medium"
          style={{ backgroundColor: `${color}20`, color }}
        >
          {status}
        </div>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Combien de mois pouvez-vous tenir sans revenu ?
      </p>

      <div className="relative h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            cx="50%"
            cy="100%"
            innerRadius="80%"
            outerRadius="100%"
            startAngle={180}
            endAngle={0}
            data={chartData}
            barSize={16}
          >
            <RadialBar
              dataKey="value"
              cornerRadius={10}
              background={{ fill: "hsl(var(--muted))" }}
            />
          </RadialBarChart>
        </ResponsiveContainer>

        {/* Center content */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          className="absolute inset-0 flex flex-col items-center justify-end pb-4"
        >
          <Icon className="w-8 h-8 mb-2" style={{ color }} />
          <span className="text-4xl font-bold text-foreground">
            {months.toFixed(1)}
          </span>
          <span className="text-sm text-muted-foreground">mois</span>
        </motion.div>
      </div>

      {/* Scale indicators */}
      <div className="flex justify-between px-4 mt-2 text-xs text-muted-foreground">
        <span>0</span>
        <span>3</span>
        <span>6</span>
        <span>12+</span>
      </div>

      {/* Message */}
      <motion.p
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center text-sm mt-4 px-4 py-2 rounded-xl"
        style={{ backgroundColor: `${color}10`, color }}
      >
        {message}
      </motion.p>
    </div>
  );
}
