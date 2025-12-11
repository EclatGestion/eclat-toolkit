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
  "description": "Découvrez nos solutions d'investissement : Assurance-Vie, PER, PEA, Girardin, Private Equity, SCPI, GFI et plus encore",
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
      title="Académie Financière : Guides & Fiches Pratiques"
      description="Apprenez à investir : PER, Assurance-Vie, SCPI, Girardin, Private Equity. 13 fiches produits pour maîtriser votre patrimoine."
      jsonLd={jsonLdSchema}
      canonical="/academie"
    >
      {/* Intro Section */}
      <div className="mb-8">
        <p className="text-lg text-gray-600 max-w-3xl">
          Découvrez nos solutions d'investissement et de défiscalisation. 
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
          par le <strong>PEA</strong>, le <strong>Private Equity</strong> et les <strong>SCPI</strong>.
        </p>

        <h3 className="text-xl font-semibold text-gray-900 mt-8">Les enveloppes fiscales avantageuses</h3>
        <p className="text-gray-600 leading-relaxed">
          L'<strong>assurance-vie</strong> reste le placement préféré des Français grâce à sa fiscalité 
          avantageuse après 8 ans et ses atouts en matière de transmission. Le <strong>Plan d'Épargne 
          Actions (PEA)</strong> offre une exonération d'impôt sur les plus-values après 5 ans. Le <strong>Plan d'Épargne 
          Retraite (PER)</strong> permet de réduire immédiatement son impôt sur le revenu tout en 
          préparant sa retraite. Le <strong>Girardin Industriel</strong> et les <strong>SOFICA</strong> offrent des réductions d'impôt exceptionnelles.
        </p>

        <h3 className="text-xl font-semibold text-gray-900 mt-8">Diversifier avec l'immobilier et le non-coté</h3>
        <p className="text-gray-600 leading-relaxed">
          Les <strong>SCPI (Sociétés Civiles de Placement Immobilier)</strong> permettent d'investir 
          dans l'immobilier professionnel sans les contraintes de gestion, avec des rendements de 4% à 6%. 
          La <strong>nue-propriété</strong> offre une décote de 40% sur l'achat immobilier. Le <strong>Private Equity</strong> donne accès à des entreprises non cotées à fort potentiel 
          de croissance. Les <strong>Groupements Forestiers (GFI)</strong> combinent écologie et avantages fiscaux exceptionnels.
        </p>
      </section>
    </PublicPageLayout>
  );
}
