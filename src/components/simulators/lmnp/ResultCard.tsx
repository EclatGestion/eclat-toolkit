import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ResultCardProps {
  title: string;
  icon: LucideIcon;
  regime: string;
  isWinner: boolean;
  loyersAnnuels: number;
  baseImposable: number;
  impotTotal: number;
  cashflowNet: number;
  formatCurrency: (value: number) => string;
  variant: "primary" | "emerald";
}

export function ResultCard({
  title,
  icon: Icon,
  regime,
  isWinner,
  loyersAnnuels,
  baseImposable,
  impotTotal,
  cashflowNet,
  formatCurrency,
  variant,
}: ResultCardProps) {
  const isPrimary = variant === "primary";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        className={cn(
          "rounded-2xl overflow-hidden transition-all",
          isWinner &&
            (isPrimary
              ? "ring-2 ring-primary shadow-lg"
              : "ring-2 ring-emerald-500 shadow-lg")
        )}
      >
        {/* Bandeau gagnant */}
        {isWinner && (
          <div
            className={cn(
              "py-2 px-4 text-center text-sm font-semibold text-white",
              isPrimary ? "bg-primary" : "bg-emerald-500"
            )}
          >
            ✓ Option la plus avantageuse
          </div>
        )}

        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Icon
              className={cn(
                "w-5 h-5",
                isPrimary ? "text-primary" : "text-emerald-500"
              )}
            />
            {title}
          </CardTitle>
          <Badge
            variant="outline"
            className={cn(
              "w-fit text-xs",
              isPrimary
                ? "border-primary/30 text-primary"
                : "border-emerald-500/30 text-emerald-600"
            )}
          >
            {regime}
          </Badge>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* KPI Principal - Impôt */}
          <div
            className={cn(
              "text-center py-4 px-3 rounded-xl",
              isPrimary ? "bg-primary/5" : "bg-emerald-50 dark:bg-emerald-950/30"
            )}
          >
            <p className="text-xs text-muted-foreground mb-1">Impôt annuel</p>
            <p
              className={cn(
                "text-3xl font-bold",
                impotTotal === 0
                  ? "text-emerald-600"
                  : isPrimary
                  ? "text-primary"
                  : "text-amber-600"
              )}
            >
              {formatCurrency(impotTotal)}
            </p>
          </div>

          {/* Détails */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Loyers annuels</span>
              <span className="font-medium">{formatCurrency(loyersAnnuels)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Base imposable</span>
              <span className="font-medium">{formatCurrency(baseImposable)}</span>
            </div>
          </div>

          {/* Cashflow */}
          <div className="pt-3 border-t">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Cashflow net</span>
              <span
                className={cn(
                  "text-lg font-bold",
                  cashflowNet >= 0 ? "text-emerald-600" : "text-red-500"
                )}
              >
                {formatCurrency(cashflowNet)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
