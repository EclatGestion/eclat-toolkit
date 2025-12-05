import { useMemo } from "react";
import { motion } from "framer-motion";
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

  return (
    <div className="bg-card rounded-3xl p-6 shadow-card h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Sérénité Financière</h3>
        <div 
          className="px-3 py-1 rounded-full text-xs font-medium"
          style={{ backgroundColor: `${color}20`, color }}
        >
          {status}
        </div>
      </div>

      {/* Main content - centered number */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="flex flex-col items-center"
        >
          <Icon className="w-10 h-10 mb-3" style={{ color }} />
          <span className="text-5xl font-bold text-foreground">
            {months.toFixed(1)}
          </span>
          <span className="text-base text-muted-foreground mt-1">mois</span>
        </motion.div>
        
        {/* Progress bar */}
        <div className="w-full mt-6">
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(months / 12) * 100}%` }}
              transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
              className="h-full rounded-full"
              style={{ backgroundColor: color }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>0</span>
            <span>3</span>
            <span>6</span>
            <span>12+</span>
          </div>
        </div>
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
