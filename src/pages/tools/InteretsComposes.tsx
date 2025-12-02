import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { InputSlider } from "@/components/simulators/interets-composes/InputSlider";
import { ScenarioBadges } from "@/components/simulators/interets-composes/ScenarioBadges";
import { ComparisonChart } from "@/components/simulators/interets-composes/ComparisonChart";
import { KPIResults } from "@/components/simulators/interets-composes/KPIResults";

interface ChartDataPoint {
  year: number;
  totalVerse: number;
  votreScenario: number;
  scenarioSecurise: number;
}

function calculateCompoundInterest(
  principal: number,
  monthlyContrib: number,
  years: number,
  annualRate: number
): { year: number; totalVerse: number; capital: number }[] {
  const monthlyRate = annualRate / 100 / 12;
  const results: { year: number; totalVerse: number; capital: number }[] = [];

  let capital = principal;
  let totalVerse = principal;

  results.push({ year: 0, totalVerse, capital: Math.round(capital) });

  for (let year = 1; year <= years; year++) {
    for (let month = 0; month < 12; month++) {
      capital = capital * (1 + monthlyRate) + monthlyContrib;
      totalVerse += monthlyContrib;
    }
    results.push({ year, totalVerse: Math.round(totalVerse), capital: Math.round(capital) });
  }

  return results;
}

export default function InteretsComposes() {
  const navigate = useNavigate();

  // Input states
  const [capitalInitial, setCapitalInitial] = useState(10000);
  const [epargneMensuelle, setEpargneMensuelle] = useState(300);
  const [duree, setDuree] = useState(20);
  const [rendement, setRendement] = useState(8.5);
  const [selectedScenario, setSelectedScenario] = useState<string | null>("equilibre");
  const [showComparison, setShowComparison] = useState(false);

  // Handle scenario selection
  const handleScenarioSelect = (scenarioId: string, rate: number) => {
    setSelectedScenario(scenarioId);
    setRendement(rate);
  };

  // Handle manual rendement change (deselects scenario)
  const handleRendementChange = (value: number) => {
    setRendement(value);
    setSelectedScenario(null);
  };

  // Calculate chart data
  const chartData: ChartDataPoint[] = useMemo(() => {
    const mainScenario = calculateCompoundInterest(
      capitalInitial,
      epargneMensuelle,
      duree,
      rendement
    );

    const secureScenario = calculateCompoundInterest(
      capitalInitial,
      epargneMensuelle,
      duree,
      3
    );

    return mainScenario.map((item, i) => ({
      year: item.year,
      totalVerse: item.totalVerse,
      votreScenario: item.capital,
      scenarioSecurise: secureScenario[i].capital,
    }));
  }, [capitalInitial, epargneMensuelle, duree, rendement]);

  // Calculate KPIs from final year
  const finalData = chartData[chartData.length - 1];
  const capitalFinal = finalData?.votreScenario || 0;
  const totalVerse = finalData?.totalVerse || 0;
  const interetsGagnes = capitalFinal - totalVerse;

  return (
    <MainLayout title="Intérêts Composés">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6 rounded-2xl hover:bg-muted"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour au catalogue
        </Button>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Inputs */}
          <div className="bg-card rounded-3xl p-6 md:p-8 shadow-card">
            <h2 className="text-xl font-semibold text-foreground mb-6">
              Paramètres de simulation
            </h2>

            <div className="space-y-8">
              <InputSlider
                label="Capital Initial"
                value={capitalInitial}
                onChange={setCapitalInitial}
                min={0}
                max={500000}
                step={1000}
                unit="€"
              />

              <InputSlider
                label="Épargne Mensuelle"
                value={epargneMensuelle}
                onChange={setEpargneMensuelle}
                min={0}
                max={5000}
                step={50}
                unit="€"
              />

              <InputSlider
                label="Durée du Projet"
                value={duree}
                onChange={setDuree}
                min={1}
                max={40}
                step={1}
                unit="ans"
                formatValue={(v) => `${v} an${v > 1 ? "s" : ""}`}
              />

              <div className="pt-4 border-t border-border">
                <ScenarioBadges
                  selectedScenario={selectedScenario}
                  onSelect={handleScenarioSelect}
                />
              </div>

              <InputSlider
                label="Rendement Annuel Cible"
                value={rendement}
                onChange={handleRendementChange}
                min={0}
                max={15}
                step={0.5}
                unit="%"
                formatValue={(v) => `${v.toFixed(1)} %`}
              />
            </div>
          </div>

          {/* Right Column - Results */}
          <div className="bg-card rounded-3xl p-6 md:p-8 shadow-card">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <h2 className="text-xl font-semibold text-foreground">
                Projection de votre capital
              </h2>

              {/* Comparison Toggle */}
              <div className="flex items-center gap-3">
                <Switch
                  id="comparison"
                  checked={showComparison}
                  onCheckedChange={setShowComparison}
                />
                <Label htmlFor="comparison" className="text-sm text-muted-foreground cursor-pointer">
                  Comparer avec 3%
                </Label>
              </div>
            </div>

            {/* Chart */}
            <ComparisonChart data={chartData} showComparison={showComparison} />

            {/* KPIs */}
            <KPIResults
              capitalFinal={capitalFinal}
              totalVerse={totalVerse}
              interetsGagnes={interetsGagnes}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
