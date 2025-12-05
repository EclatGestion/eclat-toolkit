import { Crown } from "lucide-react";
import { usePremium } from "@/hooks/usePremium";

export function PremiumBadge() {
  const { isPremium, isLoading } = usePremium();

  if (isLoading || !isPremium) return null;

  return (
    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/30">
      <Crown className="w-3 h-3 text-amber-500" />
      <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">PRO</span>
    </div>
  );
}
