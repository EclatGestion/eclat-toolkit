import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

interface InputSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  formatValue?: (value: number) => string;
}

export function InputSlider({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit = "€",
  formatValue,
}: InputSliderProps) {
  const displayValue = formatValue ? formatValue(value) : `${value.toLocaleString("fr-FR")} ${unit}`;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^\d.,]/g, "").replace(",", ".");
    const numValue = parseFloat(rawValue) || 0;
    const clampedValue = Math.min(Math.max(numValue, min), max);
    onChange(clampedValue);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium text-foreground">{label}</Label>
        <Input
          type="text"
          value={displayValue}
          onChange={handleInputChange}
          className="w-32 text-right font-semibold text-foreground bg-muted/50 border-0 rounded-xl"
        />
      </div>
      <Slider
        value={[value]}
        onValueChange={(values) => onChange(values[0])}
        min={min}
        max={max}
        step={step}
        className="cursor-pointer"
      />
    </div>
  );
}
