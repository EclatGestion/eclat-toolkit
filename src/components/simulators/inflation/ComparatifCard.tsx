import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InputSlider } from "@/components/simulators/interets-composes/InputSlider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { TrendingUp, Percent } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ComparatifCardProps {
  comparatifActif: boolean;
  setComparatifActif: (value: boolean) => void;
  rendement: number;
  setRendement: (value: number) => void;
}

export function ComparatifCard({
  comparatifActif,
  setComparatifActif,
  rendement,
  setRendement,
}: ComparatifCardProps) {
  return (
    <Card className="rounded-3xl shadow-card">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="p-2 rounded-xl bg-green-500/10">
            <TrendingUp className="h-5 w-5 text-green-600" />
          </div>
          Comparatif (optionnel)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-3">
          <Checkbox
            id="comparatif"
            checked={comparatifActif}
            onCheckedChange={(checked) => setComparatifActif(checked as boolean)}
          />
          <Label
            htmlFor="comparatif"
            className="text-sm font-medium cursor-pointer leading-relaxed"
          >
            Comparer avec une épargne rémunérée
            <span className="block text-xs text-muted-foreground mt-0.5">
              (fonds euros, livret, etc.)
            </span>
          </Label>
        </div>

        <AnimatePresence>
          {comparatifActif && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="pt-4 space-y-4">
                <InputSlider
                  label="Taux de rendement annuel"
                  value={rendement}
                  onChange={setRendement}
                  min={0.5}
                  max={10}
                  step={0.1}
                  unit="%"
                  formatValue={(v) => `${v.toFixed(1)} %`}
                />

                <div className="flex gap-2 flex-wrap">
                  {[
                    { label: "Livret A", value: 3.0, icon: "🏦" },
                    { label: "Fonds €", value: 2.5, icon: "📊" },
                    { label: "SCPI", value: 4.5, icon: "🏢" },
                    { label: "ETF", value: 7.0, icon: "📈" },
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      onClick={() => setRendement(preset.value)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1 ${
                        Math.abs(rendement - preset.value) < 0.1
                          ? "bg-green-500/10 text-green-600 ring-2 ring-offset-2 ring-green-500"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      <span>{preset.icon}</span>
                      {preset.label} ({preset.value}%)
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!comparatifActif && (
          <p className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-xl">
            💡 Activez le comparatif pour voir l'impact d'une épargne rémunérée face à l'inflation.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
