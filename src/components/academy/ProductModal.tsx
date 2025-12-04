import { Shield, PiggyBank, Palmtree, Rocket, LineChart, Building2, Check, LucideIcon, MessageCircle, Calculator, TrendingUp, HardHat, Lightbulb, Landmark, TreePine, Gem, Bitcoin } from "lucide-react";
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
  HardHat,
  Lightbulb,
  Landmark,
  TreePine,
  Gem,
  Bitcoin,
};

interface ProductModalProps {
  product: FinancialProduct;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProductModal({ product, open, onOpenChange }: ProductModalProps) {
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
            <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-2xl border border-blue-100 dark:border-blue-900">
              <div className="flex items-center gap-2 mb-3">
                <Calculator className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 text-sm">
                  {product.caseStudy.title}
                </h4>
              </div>
              <p className="text-sm text-blue-800 dark:text-blue-200 italic mb-2">
                {product.caseStudy.scenario}
              </p>
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                {product.caseStudy.figures}
              </p>
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
