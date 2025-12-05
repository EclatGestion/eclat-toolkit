import { ReactNode, useState } from "react";
import { Lock, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePremium } from "@/hooks/usePremium";
import { UpgradePremiumModal } from "./UpgradePremiumModal";

interface PremiumToolLockProps {
  children: ReactNode;
  featureName?: string;
  variant?: "section" | "tab" | "inline";
  teaser?: string;
}

export function PremiumToolLock({ 
  children, 
  featureName = "cette fonctionnalité",
  variant = "section",
  teaser
}: PremiumToolLockProps) {
  const { isPremium, isLoading } = usePremium();
  const [showModal, setShowModal] = useState(false);

  if (isLoading || isPremium) {
    return <>{children}</>;
  }

  if (variant === "inline") {
    return (
      <>
        <div className="relative">
          <div className="opacity-40 blur-[2px] pointer-events-none select-none">
            {children}
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Button
              onClick={() => setShowModal(true)}
              variant="outline"
              size="sm"
              className="rounded-full gap-2 bg-background/80 backdrop-blur-sm border-amber-500/30 hover:border-amber-500"
            >
              <Lock className="w-3 h-3 text-amber-500" />
              <span className="text-xs">Premium</span>
            </Button>
          </div>
        </div>
        <UpgradePremiumModal open={showModal} onOpenChange={setShowModal} />
      </>
    );
  }

  if (variant === "tab") {
    return (
      <>
        <div className="relative rounded-3xl overflow-hidden">
          <div className="opacity-30 blur-sm pointer-events-none select-none">
            {children}
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-background/60 to-background/90 backdrop-blur-[2px] p-6">
            <div className="p-4 rounded-full bg-amber-500/10 mb-4">
              <Crown className="w-8 h-8 text-amber-500" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Fonctionnalité Premium
            </h3>
            <p className="text-sm text-muted-foreground text-center mb-4 max-w-xs">
              {teaser || `Accédez à ${featureName} avec l'abonnement Premium.`}
            </p>
            <Button
              onClick={() => setShowModal(true)}
              className="rounded-2xl gap-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white"
            >
              <Crown className="w-4 h-4" />
              Débloquer avec Premium
            </Button>
          </div>
        </div>
        <UpgradePremiumModal open={showModal} onOpenChange={setShowModal} />
      </>
    );
  }

  // Default: section variant
  return (
    <>
      <div className="relative rounded-3xl overflow-hidden">
        <div className="opacity-40 blur-[3px] pointer-events-none select-none">
          {children}
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-transparent via-background/50 to-background/80 backdrop-blur-[1px] p-6">
          <div className="p-3 rounded-full bg-amber-500/10 mb-3">
            <Lock className="w-6 h-6 text-amber-500" />
          </div>
          <h4 className="text-base font-semibold text-foreground mb-1">
            {featureName}
          </h4>
          {teaser && (
            <p className="text-sm text-muted-foreground text-center mb-3 max-w-xs">
              {teaser}
            </p>
          )}
          <Button
            onClick={() => setShowModal(true)}
            size="sm"
            className="rounded-xl gap-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white"
          >
            <Crown className="w-3 h-3" />
            Débloquer
          </Button>
        </div>
      </div>
      <UpgradePremiumModal open={showModal} onOpenChange={setShowModal} />
    </>
  );
}
