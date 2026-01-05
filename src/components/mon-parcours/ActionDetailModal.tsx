import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  AlertTriangle, 
  Lightbulb, 
  Target,
  Clock,
  CheckCircle2,
  Circle,
  ArrowRight,
  BookOpen,
  Coins,
  TrendingUp,
  Shield,
  PiggyBank,
  Building2,
  Rocket,
  TreePine,
  Key,
  Users,
  Palmtree,
  Film,
  Heart,
  Landmark,
  Bitcoin,
  Layers,
  type LucideIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { RecoStatus } from "@/hooks/useRecommendationStatus";
import { FinancialProduct } from "@/data/financialProducts";
import { generateActionSteps } from "@/utils/recommendationMapping";
import { useNavigate } from "react-router-dom";

// Icon mapping for products
const iconMap: Record<string, LucideIcon> = {
  Shield, PiggyBank, TrendingUp, Building2, Key, Users, Rocket, Clock,
  Layers, TreePine, Coins, Lightbulb, Heart, Landmark, Palmtree, Film, Bitcoin
};

interface ActionDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  action: {
    titre: string;
    description: string;
    impact?: string;
    priority: string;
    key: string;
  } | null;
  currentStatus: RecoStatus;
  onStatusChange: (status: RecoStatus) => void;
  matchingProduct: FinancialProduct | null;
  diagnosticData?: {
    tmi?: number;
    patrimoine_total?: number;
    revenus?: number;
  };
}

export function ActionDetailModal({
  open,
  onOpenChange,
  action,
  currentStatus,
  onStatusChange,
  matchingProduct,
  diagnosticData
}: ActionDetailModalProps) {
  const navigate = useNavigate();
  
  if (!action) return null;

  const priorityConfig = {
    haute: { 
      icon: AlertTriangle, 
      color: "text-red-500", 
      bg: "bg-red-500/10", 
      border: "border-red-500/30",
      label: "Priorité haute",
      labelBg: "bg-red-500/10 text-red-600"
    },
    moyenne: { 
      icon: Lightbulb, 
      color: "text-amber-500", 
      bg: "bg-amber-500/10", 
      border: "border-amber-500/30",
      label: "Priorité moyenne",
      labelBg: "bg-amber-500/10 text-amber-600"
    },
    longTerme: { 
      icon: Target, 
      color: "text-blue-500", 
      bg: "bg-blue-500/10", 
      border: "border-blue-500/30",
      label: "Long terme",
      labelBg: "bg-blue-500/10 text-blue-600"
    },
  }[action.priority] || { 
    icon: Target, 
    color: "text-primary", 
    bg: "bg-primary/10", 
    border: "border-primary/30",
    label: "À faire",
    labelBg: "bg-primary/10 text-primary"
  };

  const PriorityIcon = priorityConfig.icon;
  const ProductIcon = matchingProduct ? (iconMap[matchingProduct.iconName] || BookOpen) : BookOpen;
  
  // Generate action steps
  const steps = generateActionSteps(action.titre, action.description, matchingProduct);
  
  // Calculate estimated impact if we have data
  const getEstimatedImpact = () => {
    if (!diagnosticData) return action.impact;
    
    const tmi = diagnosticData.tmi || 30;
    const searchText = `${action.titre} ${action.description}`.toLowerCase();
    
    if (searchText.includes("per")) {
      const suggestedAmount = Math.min(10000, (diagnosticData.revenus || 50000) * 0.1);
      const taxSaving = suggestedAmount * (tmi / 100);
      return `Économie d'impôt estimée : ${taxSaving.toLocaleString("fr-FR")} €/an (versement conseillé : ${suggestedAmount.toLocaleString("fr-FR")} €)`;
    }
    
    return action.impact;
  };

  const statusOptions: { status: RecoStatus; label: string; icon: LucideIcon; activeClass: string }[] = [
    { status: "pending", label: "À faire", icon: Circle, activeClass: "bg-muted text-foreground" },
    { status: "in_progress", label: "En cours", icon: Clock, activeClass: "bg-amber-500/20 text-amber-600" },
    { status: "completed", label: "Réalisée", icon: CheckCircle2, activeClass: "bg-emerald-500/20 text-emerald-600" },
  ];

  const handleViewProduct = () => {
    onOpenChange(false);
    navigate("/academie");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", priorityConfig.bg)}>
              <PriorityIcon className={cn("w-5 h-5", priorityConfig.color)} />
            </div>
            <Badge className={priorityConfig.labelBg}>
              {priorityConfig.label}
            </Badge>
          </div>
          <DialogTitle className="text-xl">{action.titre}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Impact estimé */}
          <div className={cn("rounded-xl p-4 border", priorityConfig.border, priorityConfig.bg)}>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span className="font-medium text-sm">Impact estimé</span>
            </div>
            <p className="text-foreground font-medium">
              {getEstimatedImpact() || action.description}
            </p>
          </div>

          {/* Pourquoi cette recommandation */}
          <div>
            <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              Pourquoi cette recommandation ?
            </h4>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {action.description}
            </p>
          </div>

          {/* Comment faire */}
          <div>
            <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Comment faire ?
            </h4>
            <ol className="space-y-3">
              {steps.map((step, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="text-sm text-muted-foreground">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Produit associé */}
          {matchingProduct && (
            <div className="border rounded-xl p-4 bg-muted/30">
              <div className="flex items-center gap-2 mb-3 text-xs text-muted-foreground uppercase tracking-wide">
                <BookOpen className="w-3 h-3" />
                Produit associé
              </div>
              <button
                onClick={handleViewProduct}
                className="w-full flex items-center gap-3 text-left group"
              >
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", matchingProduct.iconBg)}>
                  <ProductIcon className={cn("w-5 h-5", matchingProduct.iconColor)} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                    {matchingProduct.title}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {matchingProduct.shortDescription}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </button>
            </div>
          )}

          {/* Statut */}
          <div>
            <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              Statut actuel
            </h4>
            <div className="flex gap-2">
              {statusOptions.map(({ status, label, icon: Icon, activeClass }) => (
                <button
                  key={status}
                  onClick={() => onStatusChange(status)}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all border",
                    currentStatus === status
                      ? activeClass + " border-transparent"
                      : "bg-background border-border text-muted-foreground hover:bg-muted"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t">
          <Button onClick={() => onOpenChange(false)} className="w-full">
            Fermer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
