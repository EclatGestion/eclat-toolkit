import { useState } from "react";
import { LucideIcon, Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePremium } from "@/hooks/usePremium";
import { UpgradePremiumModal } from "@/components/premium/UpgradePremiumModal";

interface ToolCardProps {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  isPremium?: boolean;
}

export function ToolCard({ id, title, description, icon: Icon, iconColor, iconBg, isPremium = false }: ToolCardProps) {
  const navigate = useNavigate();
  const { isPremium: userIsPremium } = usePremium();
  const [showModal, setShowModal] = useState(false);

  const handleClick = () => {
    if (isPremium && !userIsPremium) {
      setShowModal(true);
    } else {
      navigate(`/tools/${id}`);
    }
  };

  return (
    <>
      <div className={cn(
        "bg-card rounded-3xl p-6 shadow-card hover:shadow-lg transition-all duration-300 flex flex-col relative",
        isPremium && !userIsPremium && "ring-1 ring-amber-500/20"
      )}>
        {/* Premium Badge */}
        {isPremium && (
          <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/30">
            <Crown className="w-3 h-3 text-amber-500" />
            <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">PRO</span>
          </div>
        )}
        
        <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-4", iconBg)}>
          <Icon className={cn("w-7 h-7", iconColor)} />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2 pr-16">{title}</h3>
        <p className="text-sm text-muted-foreground flex-1 mb-4">{description}</p>
        <Button
          onClick={handleClick}
          className={cn(
            "w-full rounded-2xl font-medium",
            isPremium && !userIsPremium 
              ? "bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white"
              : "bg-primary hover:bg-primary/90 text-primary-foreground"
          )}
        >
          {isPremium && !userIsPremium ? (
            <>
              <Crown className="w-4 h-4 mr-2" />
              Débloquer
            </>
          ) : (
            "Lancer"
          )}
        </Button>
      </div>
      <UpgradePremiumModal open={showModal} onOpenChange={setShowModal} />
    </>
  );
}
