import { cn } from "@/lib/utils";

interface DurationPillsProps {
  durations: number[];
  selectedDuration: number;
  onSelect: (duration: number) => void;
}

export function DurationPills({ durations, selectedDuration, onSelect }: DurationPillsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {durations.map((d) => (
        <button
          key={d}
          onClick={() => onSelect(d)}
          className={cn(
            "px-4 py-2 rounded-2xl font-medium text-sm transition-all",
            selectedDuration === d
              ? "bg-primary text-primary-foreground shadow-md"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          )}
        >
          {d} ans
        </button>
      ))}
    </div>
  );
}
