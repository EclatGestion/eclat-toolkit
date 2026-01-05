import { Shield, PieChart, Lightbulb, TrendingUp, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { useWealth } from "@/contexts/WealthContext";
import { useMemo } from "react";

export function InsightsSection() {
  const { assets, totalPatrimoine, totalDepenses, epargneMensuelle } = useWealth();

  // Calcul du runway (mois de sérénité financière)
  const runway = useMemo(() => {
    const liquidAssets = assets
      .filter((a) => ["Cash", "Épargne"].includes(a.type))
      .reduce((sum, a) => sum + a.value, 0);
    
    const monthlyExpenses = totalDepenses / 12;
    if (monthlyExpenses <= 0) return null;
    
    return Math.round(liquidAssets / monthlyExpenses);
  }, [assets, totalDepenses]);

  // Score de diversification
  const diversification = useMemo(() => {
    const uniqueTypes = new Set(assets.map((a) => a.type));
    return {
      count: uniqueTypes.size,
      total: 5, // Nombre de classes d'actifs possibles
    };
  }, [assets]);

  // Concentration du patrimoine
  const concentration = useMemo(() => {
    if (totalPatrimoine === 0) return null;
    
    const typeValues: Record<string, number> = {};
    assets.forEach((asset) => {
      typeValues[asset.type] = (typeValues[asset.type] || 0) + asset.value;
    });
    
    const maxType = Object.entries(typeValues).reduce(
      (max, [type, value]) => (value > max.value ? { type, value } : max),
      { type: "", value: 0 }
    );
    
    return {
      type: maxType.type,
      percentage: Math.round((maxType.value / totalPatrimoine) * 100),
    };
  }, [assets, totalPatrimoine]);

  // Génération du conseil personnalisé
  const advice = useMemo(() => {
    if (assets.length === 0) {
      return {
        icon: Lightbulb,
        color: "text-blue-500",
        bgColor: "bg-blue-50 dark:bg-blue-900/20",
        title: "Commencez votre bilan",
        text: "Ajoutez vos actifs pour obtenir des conseils personnalisés sur votre patrimoine.",
      };
    }

    if (concentration && concentration.percentage > 70) {
      return {
        icon: AlertTriangle,
        color: "text-amber-500",
        bgColor: "bg-amber-50 dark:bg-amber-900/20",
        title: "Diversification recommandée",
        text: `Votre patrimoine est concentré à ${concentration.percentage}% en ${concentration.type}. Diversifiez vers d'autres classes d'actifs pour réduire le risque.`,
      };
    }

    if (runway !== null && runway < 6) {
      return {
        icon: Shield,
        color: "text-rose-500",
        bgColor: "bg-rose-50 dark:bg-rose-900/20",
        title: "Épargne de précaution",
        text: "Constituez une épargne de précaution de 6 mois de dépenses minimum pour faire face aux imprévus.",
      };
    }

    if (diversification.count >= 3) {
      return {
        icon: TrendingUp,
        color: "text-emerald-500",
        bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
        title: "Patrimoine équilibré",
        text: "Votre diversification est bonne. Continuez à épargner régulièrement et rééquilibrez annuellement.",
      };
    }

    return {
      icon: Lightbulb,
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      title: "Optimisez votre patrimoine",
      text: "Explorez nos simulateurs pour découvrir les meilleures stratégies d'investissement adaptées à votre profil.",
    };
  }, [assets, concentration, runway, diversification]);

  const getRunwayColor = () => {
    if (runway === null) return "text-muted-foreground";
    if (runway >= 12) return "text-emerald-500";
    if (runway >= 6) return "text-amber-500";
    return "text-rose-500";
  };

  const getRunwayBg = () => {
    if (runway === null) return "bg-muted";
    if (runway >= 12) return "bg-emerald-50 dark:bg-emerald-900/20";
    if (runway >= 6) return "bg-amber-50 dark:bg-amber-900/20";
    return "bg-rose-50 dark:bg-rose-900/20";
  };

  const AdviceIcon = advice.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-card rounded-3xl p-6 shadow-card"
    >
      <div className="flex items-center gap-2 mb-6">
        <Lightbulb className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Insights</h3>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Sérénité */}
        <div className={`rounded-2xl p-4 ${getRunwayBg()}`}>
          <div className="flex items-center gap-2 mb-2">
            <Shield className={`w-4 h-4 ${getRunwayColor()}`} />
            <span className="text-xs text-muted-foreground uppercase tracking-wide">Sérénité</span>
          </div>
          <p className={`text-2xl font-bold ${getRunwayColor()}`}>
            {runway !== null ? `${runway} mois` : "—"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">de runway</p>
        </div>

        {/* Diversification */}
        <div className="rounded-2xl p-4 bg-primary/5">
          <div className="flex items-center gap-2 mb-2">
            <PieChart className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground uppercase tracking-wide">Diversification</span>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {diversification.count}/{diversification.total}
          </p>
          <p className="text-xs text-muted-foreground mt-1">classes d'actifs</p>
        </div>
      </div>

      {/* Advice Card */}
      <div className={`rounded-2xl p-4 ${advice.bgColor}`}>
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${advice.bgColor}`}>
            <AdviceIcon className={`w-5 h-5 ${advice.color}`} />
          </div>
          <div className="flex-1">
            <p className={`font-medium ${advice.color} mb-1`}>{advice.title}</p>
            <p className="text-sm text-muted-foreground leading-relaxed">{advice.text}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
