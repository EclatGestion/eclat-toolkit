import { 
  Shield, PiggyBank, Palmtree, Rocket, LineChart, Building2, TrendingUp, Film, 
  Key, Users, Clock, Layers, TreePine, Check, LucideIcon, MessageCircle, Lightbulb,
  Heart, Landmark, Briefcase, UserCheck, BarChart3, Factory, Home, Building, Coins, Bitcoin,
  Wallet, BadgePercent, Lock, ShieldCheck, Hammer, Receipt, Wine, Palette, Gift
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FinancialProduct, getRiskLabel } from "@/data/financialProducts";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

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

interface ProductModalProps {
  product: FinancialProduct | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProductModal({ product, open, onOpenChange }: ProductModalProps) {
  if (!product) return null;
  
  const Icon = iconMap[product.iconName] || Shield;
  const risk = getRiskLabel(product.riskLevel);

  const handleContact = () => {
    toast.success("Demande envoyée", {
      description: "Un conseiller vous contactera sous 24h pour discuter de cette solution.",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-4 mb-2">
            <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center", product.iconBg)}>
              <Icon className={cn("w-7 h-7", product.iconColor)} />
            </div>
            <div>
              <DialogTitle className="text-xl">{product.title}</DialogTitle>
              <span className={cn("text-xs px-2 py-1 rounded-full font-medium", risk.color)}>
                Risque {risk.label} ({product.riskLevel}/7)
              </span>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 pt-2">
          {/* Description */}
          <div>
            <h4 className="font-semibold text-foreground mb-2">C'est quoi ?</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {product.fullDescription}
            </p>
          </div>

          {/* Benefits */}
          <div>
            <h4 className="font-semibold text-foreground mb-3">Pourquoi investir ?</h4>
            <ul className="space-y-2">
              {product.keyBenefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Case Study */}
          {product.caseStudy && (
            <div className="p-4 bg-primary/5 border border-primary/10 rounded-2xl">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="w-4 h-4 text-primary" />
                <h4 className="font-semibold text-foreground text-sm">{product.caseStudy.title}</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{product.caseStudy.scenario}</p>
              <p className="text-sm font-semibold text-primary">{product.caseStudy.figures}</p>
            </div>
          )}

          {/* Ideal For */}
          <div className="p-4 bg-muted/50 rounded-2xl">
            <h4 className="font-semibold text-foreground mb-1 text-sm">Pour qui ?</h4>
            <p className="text-sm text-muted-foreground">{product.idealFor}</p>
          </div>

          {/* CTA */}
          <Button
            onClick={handleContact}
            className="w-full rounded-2xl h-12"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Je suis intéressé(e)
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
