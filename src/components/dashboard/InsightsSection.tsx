import { Shield, PieChart, Lightbulb, TrendingUp, AlertTriangle, Coins, Target, Brain, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";
import { useWealth } from "@/contexts/WealthContext";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function InsightsSection() {
  const { assets, totalPatrimoine, totalDepenses, epargneMensuelle } = useWealth();
  const navigate = useNavigate();

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

  // Rendement potentiel mensuel (5% annuel estimé)
  const potentialReturn = useMemo(() => {
    const annualReturn = totalPatrimoine * 0.05;
    return Math.round(annualReturn / 12);
  }, [totalPatrimoine]);

  // Objectif FIRE (Financial Independence - règle des 4%)
  const fireProgress = useMemo(() => {
    const monthlyExpenses = totalDepenses / 12;
    const targetPatrimoine = monthlyExpenses * 12 * 25; // 25x dépenses annuelles
    if (targetPatrimoine === 0) return 0;
    return Math.min(100, Math.round((totalPatrimoine / targetPatrimoine) * 100));
  }, [totalPatrimoine, totalDepenses]);

  // Génération du conseil personnalisé
  const advice = useMemo(() => {
    if (assets.length === 0) {
      return {
        icon: Lightbulb,
        color: "text-primary",
        bgColor: "bg-primary/10",
        title: "Commencez votre bilan",
        text: "Ajoutez vos actifs pour obtenir des conseils personnalisés sur votre patrimoine.",
      };
    }

    if (concentration && concentration.percentage > 70) {
      return {
        icon: AlertTriangle,
        color: "text-accent",
        bgColor: "bg-accent/10",
        title: "Diversification recommandée",
        text: `Votre patrimoine est concentré à ${concentration.percentage}% en ${concentration.type}. Diversifiez vers d'autres classes d'actifs pour réduire le risque.`,
      };
    }

    if (runway !== null && runway < 6) {
      return {
        icon: Shield,
        color: "text-destructive",
        bgColor: "bg-destructive/10",
        title: "Épargne de précaution",
        text: "Constituez une épargne de précaution de 6 mois de dépenses minimum pour faire face aux imprévus.",
      };
    }

    if (diversification.count >= 3) {
      return {
        icon: TrendingUp,
        color: "text-success",
        bgColor: "bg-success/10",
        title: "Patrimoine équilibré",
        text: "Votre diversification est bonne. Continuez à épargner régulièrement et rééquilibrez annuellement.",
      };
    }

    return {
      icon: Lightbulb,
      color: "text-primary",
      bgColor: "bg-primary/10",
      title: "Optimisez votre patrimoine",
      text: "Explorez nos simulateurs pour découvrir les meilleures stratégies d'investissement adaptées à votre profil.",
    };
  }, [assets, concentration, runway, diversification]);

  const getRunwayColor = () => {
    if (runway === null) return "text-muted-foreground";
    if (runway >= 12) return "text-success";
    if (runway >= 6) return "text-warning";
    return "text-destructive";
  };

  const getRunwayBg = () => {
    if (runway === null) return "bg-muted";
    if (runway >= 12) return "bg-success/10";
    if (runway >= 6) return "bg-warning/10";
    return "bg-destructive/10";
  };

  const getFireColor = () => {
    if (fireProgress >= 50) return "text-success";
    if (fireProgress >= 25) return "text-warning";
    return "text-primary";
  };

  const getFireBg = () => {
    if (fireProgress >= 50) return "bg-success/10";
    if (fireProgress >= 25) return "bg-warning/10";
    return "bg-primary/10";
  };

  const AdviceIcon = advice.icon;

  const formatCurrency = (value: number) => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1).replace('.0', '')}k€`;
    }
    return `${value}€`;
  };

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

      {/* KPI Grid - 2x2 */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Sérénité */}
        <motion.div 
          className={`rounded-2xl p-4 ${getRunwayBg()}`}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Shield className={`w-4 h-4 ${getRunwayColor()}`} />
            <span className="text-xs text-muted-foreground uppercase tracking-wide">Sérénité</span>
          </div>
          <p className={`text-2xl font-bold ${getRunwayColor()}`}>
            {runway !== null ? `${runway} mois` : "—"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">de runway</p>
        </motion.div>

        {/* Diversification */}
        <motion.div 
          className="rounded-2xl p-4 bg-primary/5"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <PieChart className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground uppercase tracking-wide">Diversif.</span>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {diversification.count}/{diversification.total}
          </p>
          <p className="text-xs text-muted-foreground mt-1">classes d'actifs</p>
        </motion.div>

        {/* Rendement potentiel */}
        <motion.div 
          className="rounded-2xl p-4 bg-success/10"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Coins className="w-4 h-4 text-success" />
            <span className="text-xs text-muted-foreground uppercase tracking-wide">Potentiel</span>
          </div>
          <p className="text-2xl font-bold text-success">
            +{formatCurrency(potentialReturn)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">/mois à 5%</p>
        </motion.div>

        {/* Objectif FIRE */}
        <motion.div 
          className={`rounded-2xl p-4 ${getFireBg()}`}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Target className={`w-4 h-4 ${getFireColor()}`} />
            <span className="text-xs text-muted-foreground uppercase tracking-wide">Liberté</span>
          </div>
          <p className={`text-2xl font-bold ${getFireColor()}`}>
            {fireProgress}%
          </p>
          <p className="text-xs text-muted-foreground mt-1">indép. financière</p>
        </motion.div>
      </div>

      {/* Advice Card */}
      <motion.div 
        className={`rounded-2xl p-4 ${advice.bgColor} mb-4`}
        initial={false}
        whileHover={{ scale: 1.01 }}
      >
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${advice.bgColor}`}>
            <AdviceIcon className={`w-5 h-5 ${advice.color}`} />
          </div>
          <div className="flex-1">
            <p className={`font-medium ${advice.color} mb-1`}>{advice.title}</p>
            <p className="text-sm text-muted-foreground leading-relaxed">{advice.text}</p>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <div className="border-t border-border pt-4">
        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-3 text-center">Actions rapides</p>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate("/tools/bilan-patrimonial")}
            className="flex-1 gap-2 text-xs"
          >
            <Brain className="w-3.5 h-3.5" />
            Bilan IA
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate("/simulations")}
            className="flex-1 gap-2 text-xs"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Simulateurs
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
