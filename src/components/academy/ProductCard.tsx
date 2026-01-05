import { useState } from "react";
import { 
  Shield, PiggyBank, Palmtree, Rocket, LineChart, Building2, TrendingUp, Film, 
  Key, Users, Clock, Layers, TreePine, LucideIcon, Lightbulb, Heart, Landmark,
  Briefcase, UserCheck, BarChart3, Factory, Home, Building, Coins, Bitcoin
} from "lucide-react";
import { FinancialProduct, getRiskLabel } from "@/data/financialProducts";
import { cn } from "@/lib/utils";
import { ProductModal } from "./ProductModal";

const iconMap: Record<string, LucideIcon> = {
  Shield,
  PiggyBank,
  Palmtree,
  Rocket,
  LineChart,
  Building2,
  TrendingUp,
  Film,
  Key,
  Users,
  Clock,
  Layers,
  TreePine,
  Lightbulb,
  Heart,
  Landmark,
  Briefcase,
  UserCheck,
  BarChart3,
  Factory,
  Home,
  Building,
  Coins,
  Bitcoin,
};

interface ProductCardProps {
  product: FinancialProduct;
  compact?: boolean;
}

export function ProductCard({ product, compact = false }: ProductCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const Icon = iconMap[product.iconName] || Shield;
  const risk = getRiskLabel(product.riskLevel);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={cn(
          "bg-card rounded-3xl p-5 shadow-card text-left transition-all duration-200 hover:shadow-lg hover:-translate-y-1 w-full",
          compact && "p-4"
        )}
      >
        <div className="flex items-start gap-4">
          <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0", product.iconBg)}>
            <Icon className={cn("w-6 h-6", product.iconColor)} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className={cn("font-semibold text-foreground mb-1", compact ? "text-sm" : "text-base")}>
              {product.title}
            </h3>
            <p className={cn("text-muted-foreground line-clamp-2", compact ? "text-xs" : "text-sm")}>
              {product.shortDescription}
            </p>
            {!compact && (
              <div className="mt-3 flex items-center gap-2">
                <span className={cn("text-xs px-2 py-1 rounded-full font-medium", risk.color)}>
                  Risque {risk.label}
                </span>
              </div>
            )}
          </div>
        </div>
      </button>

      <ProductModal
        product={product}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </>
  );
}
