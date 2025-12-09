import { Crown, Gem, User } from "lucide-react";
import { usePremium } from "@/hooks/usePremium";

export function PremiumBadge() {
  const { tier, isLoading } = usePremium();

  if (isLoading) return null;

  if (tier === "expert") {
    return (
      <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-violet-500/20 to-purple-500/20 border border-violet-500/30">
        <Gem className="w-3 h-3 text-violet-500" />
        <span className="text-xs font-semibold text-violet-600 dark:text-violet-400">EXPERT</span>
      </div>
    );
  }

  if (tier === "premium") {
    return (
      <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/30">
        <Crown className="w-3 h-3 text-amber-500" />
        <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">PRO</span>
      </div>
    );
  }

  // Free tier - subtle badge
  return (
    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted border border-border">
      <User className="w-3 h-3 text-muted-foreground" />
      <span className="text-xs font-medium text-muted-foreground">FREE</span>
    </div>
  );
}
