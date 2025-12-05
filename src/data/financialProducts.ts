export interface FinancialProduct {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  keyBenefits: string[];
  riskLevel: number; // 1 à 7
  idealFor: string;
  category: "fiscalite" | "retraite" | "performance" | "immobilier";
  iconName: string;
  iconColor: string;
  iconBg: string;
}

export const financialProducts: FinancialProduct[] = [
  {
    id: "assurance-vie",
    title: "Assurance-Vie",
    shortDescription: "Le couteau suisse de l'épargne. Cadre fiscal privilégié et outil de transmission hors pair.",
    fullDescription: "L'assurance-vie est le placement préféré des Français pour une bonne raison : elle combine flexibilité, avantages fiscaux et optimisation successorale. Après 8 ans de détention, les gains bénéficient d'un abattement annuel de 4 600€ (ou 9 200€ pour un couple). En cas de succession, chaque bénéficiaire peut recevoir jusqu'à 152 500€ en franchise d'impôt pour les versements effectués avant 70 ans.",
    keyBenefits: [
      "Fiscalité avantageuse après 8 ans (abattement sur les gains)",
      "Transmission optimisée : jusqu'à 152 500€ par bénéficiaire hors succession",
      "Capital disponible à tout moment (rachat partiel ou total)",
      "Large choix de supports : fonds euros sécurisés et unités de compte",
      "Possibilité de désigner librement les bénéficiaires"
    ],
    riskLevel: 3,
    idealFor: "Épargne long terme, transmission, diversification",
    category: "performance",
    iconName: "Shield",
    iconColor: "text-violet-500",
    iconBg: "bg-violet-500/10"
  },
  {
    id: "per",
    title: "PER - Plan Épargne Retraite",
    shortDescription: "Préparez votre retraite tout en déduisant vos versements de vos impôts actuels.",
    fullDescription: "Le Plan d'Épargne Retraite (PER) est l'outil idéal pour préparer sa retraite tout en réduisant immédiatement son impôt. Les versements sont déductibles de votre revenu imposable dans la limite de 10% de vos revenus (avec un minimum de 4 399€ et un maximum de 35 194€). À la retraite, vous pouvez sortir en capital ou en rente viagère.",
    keyBenefits: [
      "Déduction immédiate des versements de votre revenu imposable",
      "Effet levier fiscal : économie d'impôt égale à votre TMI × versements",
      "Report possible des plafonds non utilisés sur 3 ans",
      "Sortie flexible : capital, rente, ou mixte",
      "Déblocage anticipé possible (achat résidence principale, accidents de la vie)"
    ],
    riskLevel: 2,
    idealFor: "Réduire l'impôt sur le revenu, préparer la retraite",
    category: "retraite",
    iconName: "PiggyBank",
    iconColor: "text-emerald-500",
    iconBg: "bg-emerald-500/10"
  },
  {
    id: "girardin",
    title: "Girardin Industriel",
    shortDescription: "Dispositif 'One-Shot' pour effacer votre impôt sur le revenu dès cette année.",
    fullDescription: "Le Girardin Industriel est un dispositif de défiscalisation outre-mer qui permet d'obtenir une réduction d'impôt supérieure à votre investissement. En finançant du matériel industriel pour des entreprises ultramarines, vous bénéficiez d'un crédit d'impôt avec un rendement de 10% à 15%. C'est un investissement 'one-shot' : l'avantage fiscal est immédiat et total.",
    keyBenefits: [
      "Rendement garanti de 10% à 15% sur le montant investi",
      "Réduction d'impôt immédiate (année en cours)",
      "Possibilité d'effacer totalement votre impôt",
      "Investissement unique, sans engagement dans le temps",
      "Soutien à l'économie des territoires ultramarins"
    ],
    riskLevel: 5,
    idealFor: "Effacer l'impôt sur le revenu, contribuables fortement imposés",
    category: "fiscalite",
    iconName: "Palmtree",
    iconColor: "text-blue-500",
    iconBg: "bg-blue-500/10"
  },
  {
    id: "private-equity",
    title: "Private Equity",
    shortDescription: "Investissez dans l'économie réelle et visez des rendements élevés hors marchés boursiers.",
    fullDescription: "Le Private Equity (capital-investissement) consiste à investir dans des entreprises non cotées en bourse. Cette classe d'actifs offre historiquement des rendements supérieurs aux marchés actions traditionnels, en contrepartie d'une liquidité réduite et d'un horizon d'investissement long (5-10 ans). Accessible via des FCPR, FPCI ou fonds evergreen.",
    keyBenefits: [
      "Rendements historiques supérieurs aux marchés cotés (8-15% par an)",
      "Diversification hors des marchés boursiers",
      "Accès à des entreprises innovantes en forte croissance",
      "Avantages fiscaux possibles (FCPR, 150-0 B ter)",
      "Décorrélation des fluctuations boursières court terme"
    ],
    riskLevel: 6,
    idealFor: "Diversifier, rechercher de la performance, horizon long terme",
    category: "performance",
    iconName: "Rocket",
    iconColor: "text-orange-500",
    iconBg: "bg-orange-500/10"
  },
  {
    id: "compte-titres",
    title: "Compte-Titres (CTO)",
    shortDescription: "Accès illimité aux marchés mondiaux sans plafond de versement.",
    fullDescription: "Le Compte-Titres Ordinaire (CTO) est l'enveloppe la plus flexible pour investir sur les marchés financiers. Sans plafond de versement ni restriction géographique, il donne accès à l'ensemble des instruments financiers : actions, obligations, ETF, produits dérivés, cryptos... La fiscalité est celle du Prélèvement Forfaitaire Unique (30%).",
    keyBenefits: [
      "Aucun plafond de versement",
      "Accès à tous les marchés mondiaux et tous les instruments",
      "Possibilité d'investir en actions étrangères, ETF exotiques, dérivés",
      "Flat tax de 30% sur les plus-values (ou barème progressif)",
      "Report des moins-values sur 10 ans"
    ],
    riskLevel: 4,
    idealFor: "Investisseurs actifs, diversification internationale",
    category: "performance",
    iconName: "LineChart",
    iconColor: "text-indigo-500",
    iconBg: "bg-indigo-500/10"
  },
  {
    id: "scpi",
    title: "SCPI - Pierre Papier",
    shortDescription: "L'immobilier locatif sans les soucis de gestion, avec des rendements attractifs.",
    fullDescription: "Les SCPI (Sociétés Civiles de Placement Immobilier) permettent d'investir dans l'immobilier professionnel (bureaux, commerces, santé) sans les contraintes de gestion. Vous percevez des revenus réguliers (loyers) proportionnels à votre investissement. Le ticket d'entrée est accessible (quelques centaines d'euros) et la gestion est entièrement déléguée.",
    keyBenefits: [
      "Revenus réguliers : distribution trimestrielle des loyers",
      "Rendement attractif : 4% à 7% par an en moyenne",
      "Mutualisation des risques sur de nombreux actifs et locataires",
      "Gestion 100% déléguée : aucune contrainte locative",
      "Accessible dès quelques centaines d'euros"
    ],
    riskLevel: 3,
    idealFor: "Revenus complémentaires, diversification immobilière",
    category: "immobilier",
    iconName: "Building2",
    iconColor: "text-amber-500",
    iconBg: "bg-amber-500/10"
  }
];

export const getProductById = (id: string): FinancialProduct | undefined => {
  return financialProducts.find(p => p.id === id);
};

export const getProductsByIds = (ids: string[]): FinancialProduct[] => {
  return ids.map(id => getProductById(id)).filter((p): p is FinancialProduct => p !== undefined);
};

export const getProductsByCategory = (category: FinancialProduct["category"] | "all"): FinancialProduct[] => {
  if (category === "all") return financialProducts;
  return financialProducts.filter(p => p.category === category);
};

export const getRiskLabel = (level: number): { label: string; color: string } => {
  if (level <= 2) return { label: "Faible", color: "bg-emerald-500/10 text-emerald-600" };
  if (level <= 4) return { label: "Modéré", color: "bg-amber-500/10 text-amber-600" };
  if (level <= 6) return { label: "Élevé", color: "bg-orange-500/10 text-orange-600" };
  return { label: "Très élevé", color: "bg-red-500/10 text-red-600" };
};
