import { Asset, useWealth } from "@/contexts/WealthContext";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Plus, Building2, TrendingUp, Coins, Wallet, MoreHorizontal, Landmark, PiggyBank } from "lucide-react";
import { motion } from "framer-motion";
import { useMemo } from "react";

const ASSET_CONFIG: Record<string, { 
  icon: typeof Wallet; 
  color: string; 
  bgColor: string;
  borderColor: string;
}> = {
  Immobilier: { 
    icon: Building2, 
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    borderColor: "border-l-blue-500"
  },
  Bourse: { 
    icon: TrendingUp, 
    color: "text-teal-600 dark:text-teal-400",
    bgColor: "bg-teal-50 dark:bg-teal-900/20",
    borderColor: "border-l-teal-500"
  },
  Épargne: { 
    icon: PiggyBank, 
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-50 dark:bg-amber-900/20",
    borderColor: "border-l-amber-500"
  },
  Crypto: { 
    icon: Coins, 
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
    borderColor: "border-l-purple-500"
  },
  Cash: { 
    icon: Wallet, 
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-50 dark:bg-green-900/20",
    borderColor: "border-l-green-500"
  },
  Autre: { 
    icon: MoreHorizontal, 
    color: "text-slate-600 dark:text-slate-400",
    bgColor: "bg-slate-50 dark:bg-slate-900/20",
    borderColor: "border-l-slate-500"
  },
};

interface AssetsGroupedProps {
  onAddClick: () => void;
  onEditClick: (asset: Asset) => void;
}

export function AssetsGrouped({ onAddClick, onEditClick }: AssetsGroupedProps) {
  const { assets, removeAsset, totalPatrimoine } = useWealth();

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return (value / 1000000).toFixed(2).replace(".", ",") + " M€";
    }
    if (value >= 1000) {
      return (value / 1000).toFixed(0) + " k€";
    }
    return value.toLocaleString("fr-FR") + " €";
  };

  const groupedAssets = useMemo(() => {
    const groups: Record<string, Asset[]> = {};
    assets.forEach((asset) => {
      if (!groups[asset.type]) {
        groups[asset.type] = [];
      }
      groups[asset.type].push(asset);
    });
    return groups;
  }, [assets]);

  const getPercentage = (value: number) => {
    if (totalPatrimoine === 0) return 0;
    return Math.round((value / totalPatrimoine) * 100);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-card rounded-3xl p-6 shadow-card"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Mes Actifs</h3>
        <Button onClick={onAddClick} size="sm" className="gap-2 rounded-xl">
          <Plus className="w-4 h-4" />
          Ajouter
        </Button>
      </div>

      {assets.length > 0 ? (
        <div className="space-y-4">
          {Object.entries(groupedAssets).map(([type, typeAssets], groupIndex) => {
            const config = ASSET_CONFIG[type] || ASSET_CONFIG.Autre;
            const Icon = config.icon;
            const groupTotal = typeAssets.reduce((sum, a) => sum + a.value, 0);

            return (
              <motion.div
                key={type}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * groupIndex }}
                className={`border-l-4 ${config.borderColor} ${config.bgColor} rounded-2xl p-4`}
              >
                {/* Group Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-5 h-5 ${config.color}`} />
                    <span className="font-medium text-foreground">{type}</span>
                    <span className="text-xs text-muted-foreground bg-background/50 px-2 py-0.5 rounded-full">
                      {getPercentage(groupTotal)}%
                    </span>
                  </div>
                  <span className="font-semibold text-foreground">
                    {formatCurrency(groupTotal)}
                  </span>
                </div>

                {/* Assets in group */}
                <div className="space-y-2">
                  {typeAssets.map((asset) => (
                    <div
                      key={asset.id}
                      className="flex items-center justify-between bg-card/80 backdrop-blur-sm rounded-xl px-4 py-3 group hover:bg-card transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">{asset.name}</p>
                        {asset.bankName && (
                          <p className="text-xs text-muted-foreground">{asset.bankName}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-foreground whitespace-nowrap">
                          {formatCurrency(asset.value)}
                        </span>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onEditClick(asset)}
                            className="h-8 w-8 rounded-lg"
                          >
                            <Pencil className="w-4 h-4 text-muted-foreground" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={async () => await removeAsset(asset.id)}
                            className="h-8 w-8 rounded-lg hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4 text-muted-foreground" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 px-4">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <Wallet className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground mb-4">Commencez par ajouter vos actifs</p>
          <Button onClick={onAddClick} className="gap-2 rounded-xl">
            <Plus className="w-4 h-4" />
            Ajouter mon premier actif
          </Button>
        </div>
      )}
    </motion.div>
  );
}
