import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { PublicPageLayout } from "@/components/layout/PublicPageLayout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { User, Users, Minus, Plus, Sparkles, ArrowRight, Lock } from "lucide-react";
import { InputSlider } from "@/components/simulators/interets-composes/InputSlider";
import { useAnimatedCounter } from "@/hooks/useAnimatedCounter";
import { TMIGauge } from "@/components/simulators/ir/TMIGauge";
import { motion } from "framer-motion";

// Constantes fiscales 2025
const TAX_BRACKETS = [
  { min: 0, max: 11497, rate: 0 },
  { min: 11498, max: 29315, rate: 0.11 },
  { min: 29316, max: 83823, rate: 0.30 },
  { min: 83824, max: 180294, rate: 0.41 },
  { min: 180295, max: Infinity, rate: 0.45 },
];

const PLAFOND_QF_PAR_DEMI_PART = 1759;

function calculateChildParts(children: number): number {
  let childParts = 0;
  if (children >= 1) childParts += 0.5;
  if (children >= 2) childParts += 0.5;
  if (children >= 3) childParts += children - 2;
  return childParts;
}

function calculateParts(isCouple: boolean, children: number): number {
  const baseParts = isCouple ? 2 : 1;
  return baseParts + calculateChildParts(children);
}

function calculateRawTax(revenuImposable: number, parts: number): { tax: number; tmi: number } {
  const quotient = revenuImposable / parts;
  let taxPerPart = 0;
  let tmi = 0;

  for (const bracket of TAX_BRACKETS) {
    if (quotient > bracket.min) {
      const taxableInBracket = Math.min(quotient, bracket.max) - bracket.min;
      taxPerPart += taxableInBracket * bracket.rate;
      if (quotient > bracket.min) {
        tmi = bracket.rate * 100;
      }
    }
  }

  return { tax: Math.round(taxPerPart * parts), tmi };
}

function calculateTaxWithCap(revenuImposable: number, isCouple: boolean, children: number) {
  const baseParts = isCouple ? 2 : 1;
  const childParts = calculateChildParts(children);
  const totalParts = baseParts + childParts;

  if (childParts === 0) {
    const result = calculateRawTax(revenuImposable, totalParts);
    return { ...result, plafonnementApplique: false };
  }

  const taxWithoutChildren = calculateRawTax(revenuImposable, baseParts);
  const taxWithChildren = calculateRawTax(revenuImposable, totalParts);
  const gainFiscalEnfants = taxWithoutChildren.tax - taxWithChildren.tax;
  const nombreDemiParts = childParts * 2;
  const plafondGain = PLAFOND_QF_PAR_DEMI_PART * nombreDemiParts;

  if (gainFiscalEnfants > plafondGain) {
    const impotFinal = taxWithoutChildren.tax - plafondGain;
    return { tax: Math.round(impotFinal), tmi: taxWithChildren.tmi, plafonnementApplique: true };
  }

  return { ...taxWithChildren, plafonnementApplique: false };
}

// JSON-LD Schema for SEO
const jsonLdSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "Calculer son impôt sur le revenu 2025",
  "description": "Guide pour calculer votre impôt sur le revenu en France avec le barème 2025",
  "step": [
    {
      "@type": "HowToStep",
      "name": "Entrer son revenu net imposable",
      "text": "Renseignez votre revenu net imposable annuel (après déduction des 10% pour frais professionnels)"
    },
    {
      "@type": "HowToStep", 
      "name": "Indiquer sa situation familiale",
      "text": "Sélectionnez si vous êtes célibataire ou en couple, et le nombre d'enfants à charge"
    },
    {
      "@type": "HowToStep",
      "name": "Consulter le résultat",
      "text": "Découvrez votre Tranche Marginale d'Imposition (TMI) et le montant d'impôt estimé"
    }
  ]
};

export default function SimulateurIRPublic() {
  const navigate = useNavigate();
  const [revenuNet, setRevenuNet] = useState(45000);
  const [isCouple, setIsCouple] = useState(false);
  const [children, setChildren] = useState(0);

  const parts = useMemo(() => calculateParts(isCouple, children), [isCouple, children]);
  const resultat = useMemo(() => calculateTaxWithCap(revenuNet, isCouple, children), [revenuNet, isCouple, children]);
  
  // Estimation de l'économie possible avec PER (30% TMI × 10% revenu)
  const economieEstimee = useMemo(() => {
    const versementPER = Math.min(revenuNet * 0.1, 35194);
    return Math.round(versementPER * (resultat.tmi / 100));
  }, [revenuNet, resultat.tmi]);

  const animatedTax = useAnimatedCounter(resultat.tax);
  const animatedEconomie = useAnimatedCounter(economieEstimee);

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(value);

  return (
    <PublicPageLayout 
      title="Simulateur Impôt sur le Revenu 2025 Gratuit | Calcul TMI"
      description="Calculez gratuitement votre impôt sur le revenu 2025 et découvrez votre Tranche Marginale d'Imposition (TMI)."
      jsonLd={jsonLdSchema}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Colonne Gauche - Inputs */}
        <div className="space-y-6">
          {/* Revenus */}
          <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Vos revenus</h2>
            <InputSlider
              label="Revenu Net Imposable (Foyer)"
              value={revenuNet}
              onChange={setRevenuNet}
              min={0}
              max={250000}
              step={1000}
              unit="€"
            />
          </div>

          {/* Situation Familiale */}
          <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Situation familiale</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button
                onClick={() => setIsCouple(false)}
                className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                  !isCouple 
                    ? "border-[#2D60FF] bg-[#2D60FF]/10 text-[#2D60FF]" 
                    : "border-gray-200 bg-gray-50 text-gray-500 hover:border-[#2D60FF]/50"
                }`}
              >
                <User className="w-8 h-8" />
                <span className="font-medium">Célibataire</span>
                <span className="text-xs opacity-70">1 part</span>
              </button>
              <button
                onClick={() => setIsCouple(true)}
                className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                  isCouple 
                    ? "border-[#2D60FF] bg-[#2D60FF]/10 text-[#2D60FF]" 
                    : "border-gray-200 bg-gray-50 text-gray-500 hover:border-[#2D60FF]/50"
                }`}
              >
                <Users className="w-8 h-8" />
                <span className="font-medium">Couple</span>
                <span className="text-xs opacity-70">2 parts</span>
              </button>
            </div>

            {/* Compteur enfants */}
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium text-gray-900">Nombre d'enfants</Label>
                <p className="text-xs text-gray-500">+0.5 part (1er/2ème) puis +1 part</p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full h-10 w-10"
                  onClick={() => setChildren(Math.max(0, children - 1))}
                  disabled={children === 0}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="text-2xl font-bold w-8 text-center text-gray-900">{children}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full h-10 w-10"
                  onClick={() => setChildren(children + 1)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="mt-4 p-3 bg-gray-50 rounded-xl text-sm text-gray-600 text-center">
              Quotient familial : <span className="font-semibold text-gray-900">{parts} part{parts > 1 ? "s" : ""}</span>
              {resultat.plafonnementApplique && (
                <span className="block text-amber-600 text-xs mt-1">⚠️ Plafonnement QF appliqué</span>
              )}
            </div>
          </div>
        </div>

        {/* Colonne Droite - Résultats */}
        <div className="space-y-6">
          {/* Résultat Principal */}
          <div className="bg-gradient-to-br from-[#2D60FF] to-[#1E4ADB] rounded-3xl p-6 text-white shadow-xl">
            <h2 className="text-lg font-medium text-white/80 mb-4">Votre impôt estimé</h2>
            <p className="text-5xl font-bold mb-6">{formatCurrency(animatedTax)}</p>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 rounded-2xl p-4">
                <p className="text-sm text-white/70 mb-1">TMI</p>
                <p className="text-2xl font-bold">{resultat.tmi}%</p>
              </div>
              <div className="bg-white/10 rounded-2xl p-4">
                <p className="text-sm text-white/70 mb-1">Parts fiscales</p>
                <p className="text-2xl font-bold">{parts}</p>
              </div>
            </div>
          </div>

          {/* Jauge TMI */}
          <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Votre Tranche Marginale</h3>
            <TMIGauge tmi={resultat.tmi} />
          </div>

          {/* CTA - Économies possibles */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-3xl p-6 text-white shadow-xl"
          >
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2 bg-white/20 rounded-xl">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Économisez jusqu'à {formatCurrency(animatedEconomie)}</h3>
                <p className="text-sm text-emerald-100">grâce aux stratégies PER et Girardin</p>
              </div>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-sm text-emerald-100">
                <Lock className="w-4 h-4" />
                <span>Simulation PER avec report des années antérieures</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-emerald-100">
                <Lock className="w-4 h-4" />
                <span>Girardin Industriel avec rendement 15%</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-emerald-100">
                <Lock className="w-4 h-4" />
                <span>Optimisation automatique combinée</span>
              </div>
            </div>

            <Button 
              onClick={() => navigate("/auth")}
              className="w-full bg-white text-emerald-600 hover:bg-emerald-50 font-semibold rounded-full py-6"
            >
              Créer un compte gratuit
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        </div>
      </div>

      {/* SEO Content Section */}
      <section className="mt-16 prose prose-gray max-w-none">
        <h2 className="text-2xl font-bold text-gray-900">Comment calculer son impôt sur le revenu en 2025 ?</h2>
        <p className="text-gray-600 leading-relaxed">
          L'impôt sur le revenu en France est calculé selon un barème progressif composé de 5 tranches. 
          Votre <strong>Tranche Marginale d'Imposition (TMI)</strong> correspond au taux appliqué à la dernière 
          tranche de vos revenus. Le <strong>quotient familial</strong> divise votre revenu par le nombre 
          de parts du foyer (1 part par adulte, 0.5 par enfant pour les deux premiers, puis 1 part supplémentaire).
        </p>
        
        <h3 className="text-xl font-semibold text-gray-900 mt-8">Barème de l'impôt 2025 sur les revenus 2024</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Tranche de revenus</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Taux d'imposition</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr><td className="px-4 py-3 text-sm text-gray-600">Jusqu'à 11 497 €</td><td className="px-4 py-3 text-sm font-medium text-emerald-600">0%</td></tr>
              <tr><td className="px-4 py-3 text-sm text-gray-600">De 11 498 € à 29 315 €</td><td className="px-4 py-3 text-sm font-medium text-amber-600">11%</td></tr>
              <tr><td className="px-4 py-3 text-sm text-gray-600">De 29 316 € à 83 823 €</td><td className="px-4 py-3 text-sm font-medium text-orange-600">30%</td></tr>
              <tr><td className="px-4 py-3 text-sm text-gray-600">De 83 824 € à 180 294 €</td><td className="px-4 py-3 text-sm font-medium text-red-500">41%</td></tr>
              <tr><td className="px-4 py-3 text-sm text-gray-600">Au-delà de 180 294 €</td><td className="px-4 py-3 text-sm font-medium text-red-700">45%</td></tr>
            </tbody>
          </table>
        </div>
      </section>
    </PublicPageLayout>
  );
}
