import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Shield, PiggyBank, Palmtree, Rocket, LineChart, Building2, TrendingUp, Film, 
  Key, Users, Clock, Layers, TreePine, LucideIcon, Lightbulb, Heart, Landmark,
  Briefcase, UserCheck, BarChart3, Factory, Home, Building, Coins, Bitcoin,
  Wallet, BadgePercent, Lock, ShieldCheck, Hammer, Receipt, Wine, Palette, Gift
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
  Wallet,
  BadgePercent,
  Lock,
  ShieldCheck,
  Hammer,
  Receipt,
  Wine,
  Palette,
  Gift,
};

interface ProductCardProps {
  product: FinancialProduct;
  compact?: boolean;
}

export function ProductCard({ product, compact = false }: ProductCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const Icon = iconMap[product.iconName] || Shield;
  const risk = getRiskLabel(product.riskLevel);

  return (
    <>
      <motion.button
        onClick={() => setIsModalOpen(true)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ 
          y: -6, 
          scale: 1.02,
        }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className={cn(
          "bg-card rounded-3xl p-5 shadow-card text-left transition-shadow duration-300 w-full",
          "hover:shadow-xl",
          compact && "p-4"
        )}
        style={{
          boxShadow: isHovered 
            ? "0 20px 40px -12px rgba(0,0,0,0.15), 0 0 20px -5px var(--card-glow, rgba(45, 96, 255, 0.1))"
            : undefined
        }}
      >
        <div className="flex items-start gap-4">
          <motion.div 
            className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0", product.iconBg)}
            animate={isHovered ? { 
              rotate: [0, -8, 8, -4, 0],
              scale: 1.1
            } : { rotate: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <Icon className={cn("w-6 h-6", product.iconColor)} />
          </motion.div>
          <div className="flex-1 min-w-0">
            <h3 className={cn("font-semibold text-foreground mb-1", compact ? "text-sm" : "text-base")}>
              {product.title}
            </h3>
            <p className={cn("text-muted-foreground line-clamp-2", compact ? "text-xs" : "text-sm")}>
              {product.shortDescription}
            </p>
            {!compact && (
              <motion.div 
                className="mt-3 flex items-center gap-2"
                initial={false}
                animate={{ x: isHovered ? 4 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <span className={cn("text-xs px-2 py-1 rounded-full font-medium", risk.color)}>
                  Risque {risk.label}
                </span>
              </motion.div>
            )}
          </div>
        </div>
      </motion.button>

      <ProductModal
        product={product}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </>
  );
}
