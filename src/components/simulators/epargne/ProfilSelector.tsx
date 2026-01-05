import { cn } from "@/lib/utils";
import { Leaf, Scale, Sparkles } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type ProfilType = "econome" | "standard" | "confort";

interface ProfilSelectorProps {
  profilActif: ProfilType | null;
  onSelect: (profil: ProfilType) => void;
}

const profils = [
  {
    id: "econome" as ProfilType,
    label: "Économe",
    tooltip: "Sorties rares, achats essentiels uniquement",
    montant: 400,
    icon: Leaf,
    color: "emerald",
  },
  {
    id: "standard" as ProfilType,
    label: "Standard",
    tooltip: "Équilibre entre vie sociale et budget maîtrisé",
    montant: 700,
    icon: Scale,
    color: "blue",
  },
  {
    id: "confort" as ProfilType,
    label: "Confort",
    tooltip: "Restaurants, loisirs et sorties fréquentes",
    montant: 1100,
    icon: Sparkles,
    color: "amber",
  },
];

const colorClasses = {
  emerald: {
    active: "border-emerald-500 bg-emerald-500/10 text-emerald-700",
    icon: "text-emerald-500",
  },
  blue: {
    active: "border-blue-500 bg-blue-500/10 text-blue-700",
    icon: "text-blue-500",
  },
  amber: {
    active: "border-amber-500 bg-amber-500/10 text-amber-700",
    icon: "text-amber-500",
  },
};

export function ProfilSelector({ profilActif, onSelect }: ProfilSelectorProps) {
  return (
    <TooltipProvider>
      <div className="flex flex-wrap gap-2">
        {profils.map((profil) => {
          const Icon = profil.icon;
          const isActive = profilActif === profil.id;
          const colors = colorClasses[profil.color as keyof typeof colorClasses];

          return (
            <Tooltip key={profil.id}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => onSelect(profil.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2.5 rounded-full border-2 transition-all duration-200",
                    "hover:scale-[1.02] hover:shadow-sm",
                    isActive
                      ? colors.active
                      : "border-border bg-card hover:border-muted-foreground/30"
                  )}
                >
                  <Icon className={cn("h-4 w-4", isActive ? colors.icon : "text-muted-foreground")} />
                  <span className={cn("font-medium text-sm", !isActive && "text-foreground")}>
                    {profil.label}
                  </span>
                  <span className={cn("text-sm", isActive ? "opacity-80" : "text-muted-foreground")}>
                    ~{profil.montant}€
                  </span>
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-[200px]">
                <p>{profil.tooltip}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
}
