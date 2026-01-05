import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { ProductCard } from "@/components/academy/ProductCard";
import { ProductModal } from "@/components/academy/ProductModal";
import { getProductsByCategory, financialProducts, FinancialProduct } from "@/data/financialProducts";
import { cn } from "@/lib/utils";

type CategoryFilter = "all" | FinancialProduct["category"];

const filters: { id: CategoryFilter; label: string }[] = [
  { id: "all", label: "Tous" },
  { id: "epargne", label: "Épargne" },
  { id: "fiscalite", label: "Fiscalité" },
  { id: "retraite", label: "Retraite" },
  { id: "performance", label: "Performance" },
  { id: "immobilier", label: "Immobilier" },
  { id: "bourse", label: "Bourse" },
  { id: "alternatif", label: "Alternatif" },
  { id: "transmission", label: "Transmission" },
];

export default function Academie() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>("all");
  const [selectedProduct, setSelectedProduct] = useState<FinancialProduct | null>(null);
  const products = getProductsByCategory(activeFilter);

  // Handle product param from URL (from ActionDetailModal navigation)
  useEffect(() => {
    const productId = searchParams.get("product");
    if (productId) {
      const product = financialProducts.find(p => p.id === productId);
      if (product) {
        setSelectedProduct(product);
        // Clean up URL after opening modal
        setSearchParams({}, { replace: true });
      }
    }
  }, [searchParams, setSearchParams]);

  return (
    <MainLayout title="Académie Financière">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <p className="text-muted-foreground">
            Découvrez nos solutions d'investissement et de défiscalisation. Cliquez sur une carte pour en savoir plus.
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
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            Aucun produit dans cette catégorie.
          </div>
        )}
      </div>

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        open={!!selectedProduct}
        onOpenChange={(open) => !open && setSelectedProduct(null)}
      />
    </MainLayout>
  );
}
