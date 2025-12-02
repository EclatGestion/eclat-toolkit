import { MainLayout } from "@/components/layout/MainLayout";
import { ToolCard } from "@/components/catalogue/ToolCard";
import { Calculator, Scale, Home, Key, TrendingUp } from "lucide-react";

const categories = [
  {
    name: "Fiscalité",
    emoji: "🧾",
    tools: [
      {
        id: "simulateur-ir",
        title: "Simulateur Impôt sur le Revenu",
        description: "Calculez votre TMI et votre impôt net instantanément",
        icon: Calculator,
        iconColor: "text-primary",
        iconBg: "bg-primary/10",
      },
      {
        id: "droits-succession",
        title: "Droits de Succession",
        description: "Estimez les droits à payer lors d'une succession",
        icon: Scale,
        iconColor: "text-purple-500",
        iconBg: "bg-purple-500/10",
      },
    ],
  },
  {
    name: "Immobilier",
    emoji: "🏠",
    tools: [
      {
        id: "simulateur-immobilier",
        title: "Simulateur Immobilier 2-en-1",
        description: "Calculez votre mensualité ou votre capacité d'emprunt",
        icon: Home,
        iconColor: "text-emerald-500",
        iconBg: "bg-emerald-500/10",
      },
      {
        id: "rentabilite-locative",
        title: "Rentabilité Pinel/LMNP",
        description: "Analysez la rentabilité de vos investissements locatifs",
        icon: Key,
        iconColor: "text-amber-500",
        iconBg: "bg-amber-500/10",
      },
    ],
  },
  {
    name: "Marchés Financiers",
    emoji: "📈",
    tools: [
      {
        id: "interets-composes",
        title: "Intérêts Composés",
        description: "Projetez la croissance de vos placements sur le long terme",
        icon: TrendingUp,
        iconColor: "text-rose-500",
        iconBg: "bg-rose-500/10",
      },
    ],
  },
];

export default function Catalogue() {
  return (
    <MainLayout title="Catalogue d'Outils">
      <div className="space-y-8">
        {categories.map((category) => (
          <section key={category.name}>
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <span>{category.emoji}</span>
              <span>{category.name}</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {category.tools.map((tool) => (
                <ToolCard key={tool.id} {...tool} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </MainLayout>
  );
}
