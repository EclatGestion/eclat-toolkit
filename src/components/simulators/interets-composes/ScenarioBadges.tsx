import { cn } from "@/lib/utils";

interface Scenario {
  id: string;
  label: string;
  rate: number;
}

const scenarios: Scenario[] = [
  { id: "securise", label: "Sécurisé (Livret A)", rate: 3 },
  { id: "prudent", label: "Prudent (Fonds Euro)", rate: 4 },
  { id: "equilibre", label: "Équilibré (Actions Monde)", rate: 8.5 },
  { id: "dynamique", label: "Dynamique (S&P 500)", rate: 10.5 },
];

interface ScenarioBadgesProps {
  selectedScenario: string | null;
  onSelect: (scenarioId: string, rate: number) => void;
}

export function ScenarioBadges({ selectedScenario, onSelect }: ScenarioBadgesProps) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-muted-foreground">Scénarios historiques :</p>
      <div className="flex flex-wrap gap-2">
        {scenarios.map((scenario) => (
          <button
            key={scenario.id}
            onClick={() => onSelect(scenario.id, scenario.rate)}
            className={cn(
              "px-4 py-2 rounded-2xl font-medium text-sm transition-all duration-200",
              selectedScenario === scenario.id
                ? "bg-primary text-primary-foreground shadow-md"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            {scenario.label}
          </button>
        ))}
      </div>
    </div>
  );
}
