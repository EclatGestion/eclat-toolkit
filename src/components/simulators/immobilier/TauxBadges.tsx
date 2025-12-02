import { cn } from "@/lib/utils";

interface TauxBadgesProps {
  selectedRate: number;
  onSelect: (rate: number) => void;
}

const tauxOptions = [
  { id: "excellent", label: "Excellent", rate: 3.60 },
  { id: "moyen", label: "Moyen", rate: 3.90 },
  { id: "assurance", label: "Avec Assurance", rate: 4.20 },
];

export function TauxBadges({ selectedRate, onSelect }: TauxBadgesProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {tauxOptions.map((option) => (
        <button
          key={option.id}
          onClick={() => onSelect(option.rate)}
          className={cn(
            "px-3 py-1.5 rounded-xl text-xs font-medium transition-all",
            Math.abs(selectedRate - option.rate) < 0.01
              ? "bg-primary text-primary-foreground shadow-md"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          )}
        >
          {option.label} ({option.rate.toFixed(2)}%)
        </button>
      ))}
    </div>
  );
}
