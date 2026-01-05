import { financialProducts, FinancialProduct } from "@/data/financialProducts";

// Mapping of keywords to product IDs
const keywordToProductMap: Record<string, string[]> = {
  // PER
  "per": ["per"],
  "plan épargne retraite": ["per"],
  "épargne retraite": ["per", "pereco", "madelin"],
  "retraite": ["per", "pereco", "assurance-vie"],
  "déduction fiscale": ["per", "girardin"],
  
  // Assurance-vie
  "assurance-vie": ["assurance-vie", "av-luxembourgeoise"],
  "assurance vie": ["assurance-vie", "av-luxembourgeoise"],
  "capitalisation": ["assurance-vie", "contrat-capitalisation"],
  "transmission": ["assurance-vie", "donation", "gfi-forets"],
  "succession": ["assurance-vie", "donation", "gfi-forets"],
  "bénéficiaire": ["assurance-vie"],
  
  // PEA
  "pea": ["pea"],
  "actions": ["pea", "compte-titres"],
  "bourse": ["pea", "compte-titres"],
  "etf": ["pea", "compte-titres"],
  "marchés financiers": ["pea", "compte-titres"],
  
  // SCPI
  "scpi": ["scpi"],
  "pierre-papier": ["scpi"],
  "pierre papier": ["scpi"],
  "immobilier papier": ["scpi"],
  
  // Immobilier
  "immobilier locatif": ["lmnp", "nue-propriete", "scpi"],
  "lmnp": ["lmnp"],
  "meublé": ["lmnp"],
  "nue-propriété": ["nue-propriete"],
  "démembrement": ["nue-propriete"],
  "crowdfunding immobilier": ["crowdfunding"],
  
  // Fiscalité
  "girardin": ["girardin"],
  "outre-mer": ["girardin"],
  "impôt": ["per", "girardin", "fcpi-fip"],
  "réduction d'impôt": ["girardin", "fcpi-fip", "sofica", "malraux"],
  "défiscalisation": ["girardin", "fcpi-fip", "sofica", "per"],
  "tmi": ["per"],
  "fiscalité": ["per", "girardin", "fcpi-fip"],
  
  // Private Equity
  "private equity": ["private-equity"],
  "non coté": ["private-equity"],
  "pme": ["fcpi-fip", "private-equity"],
  
  // Épargne
  "livret a": ["livret-a"],
  "ldds": ["ldds"],
  "épargne de précaution": ["livret-a", "ldds", "compte-terme"],
  "fonds euro": ["assurance-vie"],
  "pel": ["pel-cel"],
  
  // Autres
  "donation": ["donation"],
  "ifi": ["dons-ifi", "nue-propriete"],
  "forêt": ["gfi-forets"],
  "gfi": ["gfi-forets"],
  "or": ["or-physique"],
  "crypto": ["crypto"],
  "obligations": ["fonds-dates"],
  "structuré": ["produits-structures"],
};

/**
 * Find matching financial products for a given recommendation
 */
export function findMatchingProducts(
  titre: string,
  description?: string
): FinancialProduct[] {
  const searchText = `${titre} ${description || ""}`.toLowerCase();
  const matchedProductIds = new Set<string>();
  
  // Search for keywords in the text
  for (const [keyword, productIds] of Object.entries(keywordToProductMap)) {
    if (searchText.includes(keyword.toLowerCase())) {
      productIds.forEach(id => matchedProductIds.add(id));
    }
  }
  
  // Get the actual products
  const matchedProducts = financialProducts.filter(p => 
    matchedProductIds.has(p.id)
  );
  
  // Return max 3 most relevant products
  return matchedProducts.slice(0, 3);
}

/**
 * Get the primary product for a recommendation (first match)
 */
export function getPrimaryProduct(
  titre: string,
  description?: string
): FinancialProduct | null {
  const matches = findMatchingProducts(titre, description);
  return matches.length > 0 ? matches[0] : null;
}

/**
 * Generate action steps based on the recommendation type
 */
export function generateActionSteps(
  titre: string,
  description?: string,
  product?: FinancialProduct | null
): string[] {
  const searchText = `${titre} ${description || ""}`.toLowerCase();
  
  // Generic steps based on product category or keywords
  if (searchText.includes("per") || product?.id === "per") {
    return [
      "Comparer les PER (banque en ligne, assureur, courtier)",
      "Définir le montant mensuel à verser (conseil : 5-10% de vos revenus)",
      "Choisir une allocation adaptée à votre horizon de retraite",
      "Effectuer votre premier versement avant le 31 décembre pour déduire cette année"
    ];
  }
  
  if (searchText.includes("assurance-vie") || searchText.includes("assurance vie") || product?.id === "assurance-vie") {
    return [
      "Ouvrir un contrat en ligne (Linxea, Boursorama, etc.) pour prendre date fiscalement",
      "Définir vos bénéficiaires dès l'ouverture",
      "Choisir une répartition fonds euro / unités de compte selon votre profil",
      "Programmer des versements réguliers pour lisser les points d'entrée"
    ];
  }
  
  if (searchText.includes("pea") || product?.id === "pea") {
    return [
      "Ouvrir un PEA chez un courtier en ligne (Boursorama, Fortuneo, Bourse Direct)",
      "Commencer par un ETF World pour une diversification optimale",
      "Mettre en place un versement programmé mensuel",
      "Ne pas retirer avant 5 ans pour conserver l'avantage fiscal"
    ];
  }
  
  if (searchText.includes("scpi") || product?.id === "scpi") {
    return [
      "Comparer les SCPI selon leur rendement et leur secteur (bureaux, santé, commerce)",
      "Privilégier une souscription en assurance-vie pour optimiser la fiscalité",
      "Diversifier sur 2-3 SCPI minimum",
      "Prévoir un horizon d'investissement de 8-10 ans minimum"
    ];
  }
  
  if (searchText.includes("girardin") || product?.id === "girardin") {
    return [
      "Vérifier votre montant d'impôt à réduire pour cette année",
      "Choisir un opérateur sérieux avec garantie de bonne fin",
      "Effectuer votre investissement avant le 31 décembre",
      "Conserver les justificatifs pour votre déclaration de revenus"
    ];
  }
  
  if (searchText.includes("donation") || product?.id === "donation") {
    return [
      "Consulter un notaire pour définir la stratégie optimale",
      "Évaluer les abattements disponibles (100 000€ par parent et par enfant)",
      "Envisager le démembrement pour optimiser la transmission",
      "Respecter le délai de 15 ans entre chaque donation pour profiter des abattements"
    ];
  }
  
  if (searchText.includes("épargne de précaution") || searchText.includes("liquidité")) {
    return [
      "Constituer 3 à 6 mois de dépenses sur un Livret A",
      "Compléter avec un LDDS si le Livret A est plein",
      "Définir un montant cible d'épargne de sécurité",
      "Une fois l'objectif atteint, investir le surplus"
    ];
  }
  
  // Default generic steps
  return [
    "Analyser votre situation actuelle et vos objectifs",
    "Comparer les différentes options disponibles",
    "Consulter un conseiller pour une approche personnalisée",
    "Passer à l'action dès que possible pour profiter des avantages"
  ];
}
