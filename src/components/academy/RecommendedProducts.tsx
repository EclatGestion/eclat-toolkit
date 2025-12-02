import { getProductsByIds } from "@/data/financialProducts";
import { ProductCard } from "./ProductCard";

interface RecommendedProductsProps {
  productIds: string[];
  title: string;
}

export function RecommendedProducts({ productIds, title }: RecommendedProductsProps) {
  const products = getProductsByIds(productIds);

  if (products.length === 0) return null;

  return (
    <div className="bg-card rounded-3xl p-6 shadow-card">
      <h3 className="text-lg font-semibold text-foreground mb-4">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} compact />
        ))}
      </div>
    </div>
  );
}
