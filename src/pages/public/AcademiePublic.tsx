import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PublicPageLayout } from "@/components/layout/PublicPageLayout";
import { ProductCard } from "@/components/academy/ProductCard";
import { getProductsByCategory, financialProducts, FinancialProduct } from "@/data/financialProducts";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

type CategoryFilter = "all" | FinancialProduct["category"];

const filters: { id: CategoryFilter; label: string }[] = [
  { id: "all", label: "Tous" },
  { id: "fiscalite", label: "Fiscalité" },
  { id: "retraite", label: "Retraite" },
  { id: "performance", label: "Performance" },
  { id: "immobilier", label: "Immobilier" },
  { id: "bourse", label: "Bourse" },
  { id: "alternatif", label: "Alternatif" },
];

// JSON-LD Schema for SEO
const jsonLdSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Guides d'investissement et de défiscalisation",
  "description": "Découvrez nos solutions d'investissement : Assurance-Vie, PER, Girardin, ETF, SCPI, Cryptomonnaies, GFI et plus encore.",
  "numberOfItems": financialProducts.length,
  "itemListElement": financialProducts.map((product, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "item": {
      "@type": "FinancialProduct",
      "name": product.title,
      "description": product.shortDescription,
      "category": product.category
    }
  }))
};

export default function AcademiePublic() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>("all");
  const products = getProductsByCategory(activeFilter);

  return (
    <PublicPageLayout 
      title="Académie Financière | Guides Investissement & Défiscalisation"
      description="Découvrez nos 13 solutions d'investissement et de défiscalisation : Assurance-Vie, PER, Girardin, ETF, SCPI, Cryptomonnaies, GFI et plus encore."
      jsonLd={jsonLdSchema}
    >
      {/* Intro Section */}
      <div className="mb-8">
        <p className="text-lg text-gray-600 max-w-3xl">
          Découvrez nos {financialProducts.length} solutions d'investissement et de défiscalisation. 
          Cliquez sur une carte pour en savoir plus sur chaque produit financier.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
              activeFilter === filter.id
                ? "bg-[#2D60FF] text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            )}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          Aucun produit dans cette catégorie.
        </div>
      )}

      {/* CTA Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-br from-[#2D60FF] to-[#1E4ADB] rounded-3xl p-8 text-white shadow-xl"
      >
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">
                Optimisez votre patrimoine avec nos simulateurs
              </h2>
              <p className="text-blue-100 max-w-xl">
                Créez un compte gratuit pour accéder à nos outils avancés : 
                simulateur d'impôt avec optimisation PER/Girardin, calculateur de succession, 
                et tableau de bord personnalisé.
              </p>
            </div>
          </div>
          <Button 
            onClick={() => navigate("/auth")}
            size="lg"
            className="bg-white text-[#2D60FF] hover:bg-blue-50 font-semibold rounded-full px-8 whitespace-nowrap"
          >
            Créer un compte gratuit
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </motion.div>

      {/* SEO Content Section */}
      <section className="mt-16 prose prose-gray max-w-none">
        <h2 className="text-2xl font-bold text-gray-900">Guide des placements financiers en France</h2>
        <p className="text-gray-600 leading-relaxed">
          Investir son argent intelligemment nécessite de comprendre les différentes enveloppes fiscales 
          et produits financiers disponibles. Notre académie vous guide à travers les principales solutions 
          d'investissement en France, de l'<strong>assurance-vie</strong> au <strong>PER</strong> en passant 
          par les <strong>ETF</strong>, le <strong>Private Equity</strong>, les <strong>SCPI</strong> et les <strong>cryptomonnaies</strong>.
        </p>

        <h3 className="text-xl font-semibold text-gray-900 mt-8">Les enveloppes fiscales avantageuses</h3>
        <p className="text-gray-600 leading-relaxed">
          L'<strong>assurance-vie</strong> reste le placement préféré des Français grâce à sa fiscalité 
          avantageuse après 8 ans et ses atouts en matière de transmission. Le <strong>Plan d'Épargne 
          Retraite (PER)</strong> permet de réduire immédiatement son impôt sur le revenu tout en 
          préparant sa retraite. Le <strong>Girardin Industriel</strong> offre une réduction d'impôt 
          supérieure au montant investi.
        </p>

        <h3 className="text-xl font-semibold text-gray-900 mt-8">La gestion passive avec les ETF</h3>
        <p className="text-gray-600 leading-relaxed">
          Les <strong>ETF (Exchange Traded Funds)</strong> révolutionnent l'investissement boursier en permettant 
          de répliquer la performance des indices mondiaux avec des frais ultra-faibles. Un ETF MSCI World 
          vous expose aux 1600 plus grandes entreprises mondiales en un seul achat. C'est la stratégie plébiscitée 
          par les investisseurs long terme.
        </p>

        <h3 className="text-xl font-semibold text-gray-900 mt-8">Diversifier avec l'immobilier et le non-coté</h3>
        <p className="text-gray-600 leading-relaxed">
          Les <strong>SCPI (Sociétés Civiles de Placement Immobilier)</strong> permettent d'investir 
          dans l'immobilier professionnel sans les contraintes de gestion, avec des rendements de 4% à 7%. 
          Le <strong>crowdfunding immobilier</strong> offre des rendements élevés sur des durées courtes (12-24 mois).
          Le <strong>Private Equity</strong> donne accès à des entreprises non cotées à fort potentiel.
        </p>

        <h3 className="text-xl font-semibold text-gray-900 mt-8">Les actifs alternatifs</h3>
        <p className="text-gray-600 leading-relaxed">
          Pour une diversification complète, les <strong>Groupements Forestiers (GFI)</strong> offrent une 
          fiscalité successorale imbattable avec 75% d'abattement. L'<strong>or</strong> reste la valeur refuge 
          par excellence en période de crise. Les <strong>cryptomonnaies</strong> comme Bitcoin représentent 
          une classe d'actifs à fort potentiel pour une petite partie du patrimoine.
        </p>
      </section>
    </PublicPageLayout>
  );
}
