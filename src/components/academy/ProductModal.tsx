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
import { motion, AnimatePresence } from "framer-motion";

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <AnimatePresence mode="wait">
          {open && (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={containerVariants}
            >
              <DialogHeader>
                <motion.div variants={itemVariants} className="flex items-center gap-4 mb-2">
                  <motion.div 
                    className={cn("w-14 h-14 rounded-2xl flex items-center justify-center", product.iconBg)}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
                  >
                    <Icon className={cn("w-7 h-7", product.iconColor)} />
                  </motion.div>
                  <div>
                    <DialogTitle className="text-xl">{product.title}</DialogTitle>
                    <span className={cn("text-xs px-2 py-1 rounded-full font-medium", risk.color)}>
                      Risque {risk.label} ({product.riskLevel}/7)
                    </span>
                  </div>
                </motion.div>
              </DialogHeader>

              <div className="space-y-6 pt-2">
                {/* Description */}
                <motion.div variants={itemVariants}>
                  <h4 className="font-semibold text-foreground mb-2">C'est quoi ?</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {product.fullDescription}
                  </p>
                </motion.div>

                {/* Benefits */}
                <motion.div variants={itemVariants}>
                  <h4 className="font-semibold text-foreground mb-3">Pourquoi investir ?</h4>
                  <ul className="space-y-2">
                    {product.keyBenefits.map((benefit, index) => (
                      <motion.li 
                        key={index} 
                        className="flex items-start gap-2 text-sm"
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + index * 0.05 }}
                      >
                        <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{benefit}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>

                {/* Case Study */}
                {product.caseStudy && (
                  <motion.div 
                    variants={itemVariants}
                    className="p-4 bg-primary/5 border border-primary/10 rounded-2xl"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb className="w-4 h-4 text-primary" />
                      <h4 className="font-semibold text-foreground text-sm">{product.caseStudy.title}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{product.caseStudy.scenario}</p>
                    <p className="text-sm font-semibold text-primary">{product.caseStudy.figures}</p>
                  </motion.div>
                )}

                {/* Ideal For */}
                <motion.div variants={itemVariants} className="p-4 bg-muted/50 rounded-2xl">
                  <h4 className="font-semibold text-foreground mb-1 text-sm">Pour qui ?</h4>
                  <p className="text-sm text-muted-foreground">{product.idealFor}</p>
                </motion.div>

                {/* CTA */}
                <motion.div variants={itemVariants}>
                  <Button
                    onClick={handleContact}
                    className="w-full rounded-2xl h-12"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Je suis intéressé(e)
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
