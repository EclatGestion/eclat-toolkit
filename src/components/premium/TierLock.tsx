import { ReactNode, useState } from "react";
import { Lock, Crown, Gem } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePremium, SubscriptionTier } from "@/hooks/usePremium";
import { UpgradePremiumModal } from "./UpgradePremiumModal";
import { cn } from "@/lib/utils";

interface TierLockProps {
  children: ReactNode;
  requiredTier: "premium" | "expert";
  featureName?: string;
  variant?: "section" | "tab" | "inline" | "card";
}

export function TierLock({ 
  children, 
  requiredTier, 
  featureName = "cette fonctionnalité",
  variant = "section" 
}: TierLockProps) {
  const { hasAccess, isLoading } = usePremium();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Show children while loading or if user has access
  if (isLoading || hasAccess(requiredTier)) {
    return <>{children}</>;
  }

  const isExpertRequired = requiredTier === "expert";
  const tierLabel = isExpertRequired ? "Expert" : "Premium";
  const TierIcon = isExpertRequired ? Gem : Crown;
  const tierColor = isExpertRequired ? "violet" : "amber";

  const colorClasses = {
    amber: {
      bg: "from-amber-500/20 to-yellow-500/20",
      border: "border-amber-500/30",
      text: "text-amber-600 dark:text-amber-400",
      button: "bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600",
      icon: "text-amber-500",
    },
    violet: {
      bg: "from-violet-500/20 to-purple-500/20",
      border: "border-violet-500/30",
      text: "text-violet-600 dark:text-violet-400",
      button: "bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600",
      icon: "text-violet-500",
    },
  };

  const colors = colorClasses[tierColor];

  // Inline variant - small lock button overlay
  if (variant === "inline") {
    return (
      <div className="relative">
        <div className="opacity-50 blur-[2px] pointer-events-none select-none">
          {children}
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Button
            onClick={() => setIsModalOpen(true)}
            size="sm"
            className={cn("gap-2 text-white", colors.button)}
          >
            <Lock className="w-3 h-3" />
            {tierLabel}
          </Button>
        </div>
        <UpgradePremiumModal 
          open={isModalOpen} 
          onOpenChange={setIsModalOpen}
          targetTier={requiredTier}
        />
      </div>
    );
  }

  // Tab variant - full overlay with more info
  if (variant === "tab") {
    return (
      <div className="relative min-h-[300px]">
        <div className="opacity-30 blur-sm pointer-events-none select-none">
          {children}
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
          <div className={cn(
            "w-16 h-16 rounded-2xl flex items-center justify-center mb-4 bg-gradient-to-br",
            colors.bg,
            "border",
            colors.border
          )}>
            <TierIcon className={cn("w-8 h-8", colors.icon)} />
          </div>
          <h3 className="text-xl font-bold mb-2">Fonctionnalité {tierLabel}</h3>
          <p className="text-muted-foreground mb-4 max-w-md">
            Accédez à {featureName} en passant à la formule {tierLabel}.
          </p>
          <Button
            onClick={() => setIsModalOpen(true)}
            className={cn("gap-2 text-white", colors.button)}
          >
            <TierIcon className="w-4 h-4" />
            Passer à {tierLabel}
          </Button>
        </div>
        <UpgradePremiumModal 
          open={isModalOpen} 
          onOpenChange={setIsModalOpen}
          targetTier={requiredTier}
        />
      </div>
    );
  }

  // Card variant - for catalogue cards
  if (variant === "card") {
    return (
      <div className="relative">
        <div className="opacity-60 pointer-events-none select-none">
          {children}
        </div>
        <div className={cn(
          "absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold",
          "bg-gradient-to-r",
          colors.bg,
          "border",
          colors.border,
          colors.text
        )}>
          <TierIcon className="w-3 h-3" />
          {tierLabel}
        </div>
        <UpgradePremiumModal 
          open={isModalOpen} 
          onOpenChange={setIsModalOpen}
          targetTier={requiredTier}
        />
      </div>
    );
  }

  // Section variant (default) - blurred with centered overlay
  return (
    <div className="relative">
      <div className="opacity-40 blur-sm pointer-events-none select-none">
        {children}
      </div>
      <div className={cn(
        "absolute inset-0 flex flex-col items-center justify-center rounded-2xl p-6",
        "bg-gradient-to-br",
        colors.bg,
        "backdrop-blur-sm border",
        colors.border
      )}>
        <div className={cn(
          "w-14 h-14 rounded-xl flex items-center justify-center mb-3 bg-background/80"
        )}>
          <Lock className={cn("w-7 h-7", colors.icon)} />
        </div>
        <h3 className={cn("text-lg font-bold mb-1", colors.text)}>
          Réservé aux membres {tierLabel}
        </h3>
        <p className="text-sm text-muted-foreground text-center mb-4 max-w-sm">
          Débloquez {featureName} et bien plus encore
        </p>
        <Button
          onClick={() => setIsModalOpen(true)}
          className={cn("gap-2 text-white shadow-lg", colors.button)}
        >
          <TierIcon className="w-4 h-4" />
          Passer à {tierLabel}
        </Button>
      </div>
      <UpgradePremiumModal 
        open={isModalOpen} 
        onOpenChange={setIsModalOpen}
        targetTier={requiredTier}
      />
    </div>
  );
}
