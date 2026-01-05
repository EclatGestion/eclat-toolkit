// Re-export from context for backward compatibility
export { usePremiumContext as usePremium } from "@/contexts/PremiumContext";
export type { SubscriptionTier } from "@/contexts/PremiumContext";

// Stripe product IDs for reference
export const STRIPE_PRODUCTS = {
  premium: {
    monthly: {
      product_id: "prod_TY2MOQ5r4jvvuO",
      price_id: "price_1SYUhnCqNxHTprKBLJ7j1pBW",
    },
    annual: {
      product_id: "prod_TY2NnrRNxrpsyC",
      price_id: "price_1SYUiSCqNxHTprKBtHYqNYrH",
    },
  },
  expert: {
    monthly: {
      product_id: "prod_TZZ1CE1G03xadZ",
      price_id: "price_1ScPt8CqNxHTprKBcSzg2cLY",
    },
    annual: {
      product_id: "prod_TZZqIkF9Q92w4v",
      price_id: "price_1ScQgmCqNxHTprKBMfxUKi0m",
    },
  },
};
