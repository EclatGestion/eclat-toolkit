import { useWealth, Asset } from "@/contexts/WealthContext";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Plus, Building2, TrendingUp, Coins, Wallet, MoreHorizontal } from "lucide-react";

const assetIcons: Record<string, typeof Wallet> = {
  Immobilier: Building2,
  Bourse: TrendingUp,
  Crypto: Coins,
  Cash: Wallet,
  Épargne: Wallet,
  Autre: MoreHorizontal,
};

interface AssetsListProps {
  onAddClick: () => void;
  onEditClick: (asset: Asset) => void;
}

export function AssetsList({ onAddClick, onEditClick }: AssetsListProps) {
  const { assets, removeAsset } = useWealth();

  const formatCurrency = (value: number) => {
    return value.toLocaleString("fr-FR") + " €";
  };

  return (
    <div className="bg-card rounded-3xl p-6 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Mes Actifs</h3>
        <Button onClick={onAddClick} size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          Ajouter
        </Button>
      </div>

      {assets.length > 0 ? (
        <div className="space-y-3">
          {assets.map((asset) => {
            const Icon = assetIcons[asset.type] || MoreHorizontal;
            return (
              <div
                key={asset.id}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{asset.name}</p>
                    <p className="text-xs text-muted-foreground">{asset.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground mr-2">
                    {formatCurrency(asset.value)}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEditClick(asset)}
                    className="h-8 w-8"
                  >
                    <Pencil className="w-4 h-4 text-muted-foreground" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeAsset(asset.id)}
                    className="h-8 w-8 hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4 text-muted-foreground" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">Aucun actif enregistré</p>
          <Button variant="outline" onClick={onAddClick} className="gap-2">
            <Plus className="w-4 h-4" />
            Ajouter mon premier actif
          </Button>
        </div>
      )}
    </div>
  );
}
