import { Trophy, ArrowRight, TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

interface ComparisonSummaryProps {
  impotLocationNue: number;
  impotLMNP: number;
  cashflowLocationNue: number;
  cashflowLMNP: number;
  formatCurrency: (value: number) => string;
}

export function ComparisonSummary({
  impotLocationNue,
  impotLMNP,
  cashflowLocationNue,
  cashflowLMNP,
  formatCurrency,
}: ComparisonSummaryProps) {
  const lmnpGagnant = impotLMNP < impotLocationNue;
  const economie = Math.abs(impotLocationNue - impotLMNP);
  const gagnant = lmnpGagnant ? "LMNP" : "Location Nue";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="rounded-2xl overflow-hidden border-0 shadow-lg">
        {/* Header avec le verdict */}
        <div
          className={`py-4 px-6 ${
            lmnpGagnant
              ? "bg-gradient-to-r from-emerald-500 to-emerald-600"
              : "bg-gradient-to-r from-primary to-primary/80"
          }`}
        >
          <div className="flex items-center gap-3 text-white">
            <Trophy className="w-6 h-6" />
            <span className="text-lg font-bold">
              {gagnant} est plus avantageux
            </span>
          </div>
        </div>

        <CardContent className="p-6">
          {/* Comparaison visuelle */}
          <div className="grid grid-cols-[1fr,auto,1fr] gap-4 items-center">
            {/* Location Nue */}
            <div
              className={`text-center p-4 rounded-xl transition-all ${
                !lmnpGagnant
                  ? "bg-primary/10 ring-2 ring-primary"
                  : "bg-muted/50"
              }`}
            >
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Location Nue
              </p>
              <p
                className={`text-2xl font-bold ${
                  !lmnpGagnant ? "text-primary" : "text-foreground"
                }`}
              >
                {formatCurrency(impotLocationNue)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Impôt / an</p>
            </div>

            {/* VS */}
            <div className="flex flex-col items-center gap-1">
              <span className="text-sm font-semibold text-muted-foreground">
                VS
              </span>
              <ArrowRight className="w-5 h-5 text-muted-foreground/50" />
            </div>

            {/* LMNP */}
            <div
              className={`text-center p-4 rounded-xl transition-all ${
                lmnpGagnant
                  ? "bg-emerald-50 dark:bg-emerald-950/30 ring-2 ring-emerald-500"
                  : "bg-muted/50"
              }`}
            >
              <p className="text-sm font-medium text-muted-foreground mb-1">
                LMNP
              </p>
              <p
                className={`text-2xl font-bold ${
                  lmnpGagnant ? "text-emerald-600" : "text-foreground"
                }`}
              >
                {formatCurrency(impotLMNP)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Impôt / an</p>
            </div>
          </div>

          {/* Économie réalisée */}
          {economie > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className={`mt-6 p-4 rounded-xl text-center ${
                lmnpGagnant
                  ? "bg-emerald-50 dark:bg-emerald-950/30"
                  : "bg-primary/5"
              }`}
            >
              <div className="flex items-center justify-center gap-2 mb-1">
                <TrendingDown
                  className={`w-5 h-5 ${
                    lmnpGagnant ? "text-emerald-600" : "text-primary"
                  }`}
                />
                <span className="text-sm font-medium text-muted-foreground">
                  Économie annuelle avec {gagnant}
                </span>
              </div>
              <p
                className={`text-3xl font-bold ${
                  lmnpGagnant ? "text-emerald-600" : "text-primary"
                }`}
              >
                {formatCurrency(economie)}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Soit{" "}
                <span className="font-semibold">
                  {formatCurrency(economie * 10)}
                </span>{" "}
                sur 10 ans
              </p>
            </motion.div>
          )}

          {/* Cashflow comparé */}
          <div className="mt-4 pt-4 border-t grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-xs text-muted-foreground">
                Cashflow net Location Nue
              </p>
              <p
                className={`text-lg font-semibold ${
                  cashflowLocationNue >= 0 ? "text-emerald-600" : "text-red-500"
                }`}
              >
                {formatCurrency(cashflowLocationNue)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Cashflow net LMNP</p>
              <p
                className={`text-lg font-semibold ${
                  cashflowLMNP >= 0 ? "text-emerald-600" : "text-red-500"
                }`}
              >
                {formatCurrency(cashflowLMNP)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
