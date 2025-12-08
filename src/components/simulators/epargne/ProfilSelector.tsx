import { cn } from "@/lib/utils";
import { Leaf, Scale, Sparkles } from "lucide-react";

export type ProfilType = "econome" | "standard" | "confort";

interface ProfilSelectorProps {
  profilActif: ProfilType | null;
  onSelect: (profil: ProfilType) => void;
}

const profils = [
  {
    id: "econome" as ProfilType,
    label: "Économe",
    description: "Sorties rares, achats essentiels",
    montant: 400,
    icon: Leaf,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500",
  },
  {
    id: "standard" as ProfilType,
    label: "Standard",
    description: "Équilibre vie sociale et budget",
    montant: 700,
    icon: Scale,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500",
  },
  {
    id: "confort" as ProfilType,
    label: "Confort",
    description: "Restaurants, loisirs fréquents",
    montant: 1100,
    icon: Sparkles,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500",
  },
];

export function ProfilSelector({ profilActif, onSelect }: ProfilSelectorProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {profils.map((profil) => {
        const Icon = profil.icon;
        const isActive = profilActif === profil.id;
        
        return (
          <button
            key={profil.id}
            onClick={() => onSelect(profil.id)}
            className={cn(
              "p-3 sm:p-4 rounded-2xl border-2 transition-all duration-200 text-left",
              "hover:scale-[1.02] hover:shadow-md",
              isActive
                ? `${profil.borderColor} ${profil.bgColor}`
                : "border-border bg-card hover:border-muted-foreground/30"
            )}
          >
            <div className="flex sm:flex-col items-center sm:items-start gap-3 sm:gap-0">
              <div className={cn("p-2 rounded-xl w-fit sm:mb-2", profil.bgColor)}>
                <Icon className={cn("h-4 w-4", profil.color)} />
              </div>
              <div className="space-y-0.5 sm:space-y-1 flex-1 min-w-0">
                <p className={cn("font-medium text-xs sm:text-sm", isActive && profil.color)}>
                  {profil.label}
                </p>
                <p className="text-[10px] sm:text-xs text-muted-foreground line-clamp-1 sm:line-clamp-2">
                  {profil.description}
                </p>
                <p className={cn("text-xs sm:text-sm font-semibold", profil.color)}>
                  {profil.montant} €/mois
                </p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
