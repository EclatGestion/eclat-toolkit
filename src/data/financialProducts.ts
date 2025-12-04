export interface CaseStudy {
  title: string;
  scenario: string;
  figures: string;
}

export interface FinancialProduct {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  keyBenefits: string[];
  riskLevel: number; // 1 à 7
  idealFor: string;
  category: "fiscalite" | "retraite" | "performance" | "immobilier" | "bourse" | "alternatif";
  iconName: string;
  iconColor: string;
  iconBg: string;
  caseStudy?: CaseStudy;
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
    iconBg: "bg-violet-500/10",
    caseStudy: {
      title: "Transmission optimisée",
      scenario: "Un parent verse 150 000€ sur son assurance-vie avant 70 ans, désignant son enfant unique comme bénéficiaire.",
      figures: "Capital transmis hors succession : 150 000€ | Droits de succession économisés : ~29 000€"
    }
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
    iconBg: "bg-emerald-500/10",
    caseStudy: {
      title: "Économie d'impôt maximale",
      scenario: "Marie, TMI 41%, verse 10 000€ sur son PER en décembre.",
      figures: "Versement : 10 000€ | Économie d'impôt immédiate : 4 100€ | Coût réel : 5 900€"
    }
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
    iconBg: "bg-blue-500/10",
    caseStudy: {
      title: "Effacement total de l'impôt",
      scenario: "Marc doit 12 000€ d'impôts. Il investit 10 000€ en Girardin avec rendement de 15%.",
      figures: "Investissement : 10 000€ | Réduction d'impôt : 11 500€ | Gain net : 1 500€"
    }
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
    iconBg: "bg-orange-500/10",
    caseStudy: {
      title: "Croissance sur 7 ans",
      scenario: "Investissement de 50 000€ dans un fonds de Private Equity diversifié.",
      figures: "Capital investi : 50 000€ | Valorisation après 7 ans (×2.5) : 125 000€ | TRI annuel : ~14%"
    }
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
    iconBg: "bg-indigo-500/10",
    caseStudy: {
      title: "Diversification mondiale",
      scenario: "Investissement régulier de 500€/mois sur ETF S&P 500 pendant 10 ans.",
      figures: "Capital versé : 60 000€ | Valorisation (hyp. 10%/an) : 102 000€ | Plus-value : 42 000€"
    }
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
    iconBg: "bg-amber-500/10",
    caseStudy: {
      title: "Revenus passifs",
      scenario: "Investissement de 50 000€ en SCPI diversifiées à 5% de rendement.",
      figures: "Capital investi : 50 000€ | Revenus annuels bruts : 2 500€ | Revenus mensuels : ~208€"
    }
  },
  // Nouveaux produits
  {
    id: "etf-world",
    title: "ETF (Trackers)",
    shortDescription: "Investissez dans les 1600 plus grandes entreprises mondiales en un seul clic.",
    fullDescription: "Un ETF (Exchange Traded Fund) est un fonds qui réplique la performance d'un indice (comme le CAC 40 ou le S&P 500). C'est la solution la plus efficace et la moins chère pour diversifier votre portefeuille boursier sans avoir à choisir les actions une par une. Les frais de gestion sont ultra-faibles (souvent inférieurs à 0.3% par an) et la performance historique surpasse la majorité des gérants actifs.",
    keyBenefits: [
      "Frais de gestion ultra-faibles (souvent < 0.3%/an)",
      "Diversification instantanée sur le monde entier",
      "Performance historique supérieure à 90% des gérants actifs",
      "Éligible au PEA pour les ETF européens",
      "Liquidité immédiate : achat/vente en temps réel"
    ],
    riskLevel: 3,
    idealFor: "Investisseurs long terme, PEA, Assurance-Vie",
    category: "bourse",
    iconName: "TrendingUp",
    iconColor: "text-blue-500",
    iconBg: "bg-blue-500/10",
    caseStudy: {
      title: "La puissance du marché",
      scenario: "Investissement de 200€/mois pendant 15 ans sur un ETF MSCI World.",
      figures: "Capital versé : 36 000€ | Capital final (hyp. 7%/an) : 62 000€ | Plus-value : 26 000€"
    }
  },
  {
    id: "crowdfunding-immo",
    title: "Crowdfunding Immobilier",
    shortDescription: "Financez des promoteurs immobiliers sur des durées courtes (12-24 mois) avec des rendements élevés.",
    fullDescription: "Devenez la banque du promoteur. Vous prêtez de l'argent pour financer la construction ou la rénovation d'un immeuble. En échange, vous récupérez votre capital + intérêts à la fin du projet. C'est de l'immobilier sans les contraintes de gestion. Les rendements sont attractifs (8% à 12% brut) mais le risque existe en cas de défaillance du promoteur.",
    keyBenefits: [
      "Rendements élevés (8% à 12% brut annuel)",
      "Horizon court terme (12 à 24 mois)",
      "Ticket d'entrée faible (souvent dès 1 000€)",
      "Pas de gestion locative",
      "Diversification possible sur plusieurs projets"
    ],
    riskLevel: 4,
    idealFor: "Dynamiser de la trésorerie sur du court terme",
    category: "immobilier",
    iconName: "HardHat",
    iconColor: "text-yellow-600",
    iconBg: "bg-yellow-500/10",
    caseStudy: {
      title: "Opération Marchand de Biens",
      scenario: "Investissement de 5 000€ à 10% sur 18 mois dans un projet de rénovation.",
      figures: "Capital investi : 5 000€ | Intérêts : 750€ | Capital récupéré : 5 750€"
    }
  },
  {
    id: "fip-fcpi",
    title: "FIP / FCPI",
    shortDescription: "Soutenez l'innovation et les PME françaises en échange d'une réduction d'impôt immédiate.",
    fullDescription: "Les Fonds d'Investissement de Proximité (FIP) et Fonds Communs de Placement dans l'Innovation (FCPI) permettent d'investir dans des sociétés non cotées. En contrepartie du risque et du blocage des fonds (5 à 10 ans), l'État offre une réduction d'impôt de 25% du montant investi (voire 30% en Corse/Outre-mer). Les plus-values sont exonérées d'impôt à la sortie.",
    keyBenefits: [
      "Réduction d'impôt de 25% (voire 30% en Corse/Outre-mer)",
      "Exonération des plus-values à la sortie (hors prélèvements sociaux)",
      "Investissement dans l'économie réelle et l'innovation",
      "Plafond annuel de 12 000€ (24 000€ pour un couple)",
      "Soutien aux PME et startups françaises"
    ],
    riskLevel: 5,
    idealFor: "Impôt sur le revenu > 3 000€, horizon long terme",
    category: "fiscalite",
    iconName: "Lightbulb",
    iconColor: "text-purple-500",
    iconBg: "bg-purple-500/10",
    caseStudy: {
      title: "Réduction One-Shot",
      scenario: "Investissement de 4 000€ dans un FCPI en décembre.",
      figures: "Investissement : 4 000€ | Réduction d'impôt immédiate : 1 000€ (25%) | Coût réel : 3 000€"
    }
  },
  {
    id: "loi-malraux",
    title: "Loi Malraux",
    shortDescription: "Rénovez le patrimoine historique français et déduisez jusqu'à 30% des travaux de vos impôts.",
    fullDescription: "Dispositif dédié à la rénovation d'immeubles situés dans des secteurs sauvegardés ou des Quartiers Anciens Dégradés. La réduction d'impôt est très puissante car elle n'entre pas dans le plafonnement des niches fiscales de 10 000€. Vous pouvez déduire jusqu'à 30% du montant des travaux de restauration de votre impôt sur le revenu.",
    keyBenefits: [
      "Réduction d'impôt jusqu'à 30% du montant des travaux",
      "Hors plafonnement des niches fiscales (10 000€)",
      "Constitution d'un patrimoine immobilier de prestige",
      "Valorisation patrimoniale sur le long terme",
      "Contribution à la préservation du patrimoine français"
    ],
    riskLevel: 3,
    idealFor: "Très forte fiscalité (> 10 000€/an d'impôt)",
    category: "immobilier",
    iconName: "Landmark",
    iconColor: "text-stone-600",
    iconBg: "bg-stone-500/10",
    caseStudy: {
      title: "Rénovation Centre-Ville",
      scenario: "Opération Malraux à 300 000€ dont 100 000€ de travaux éligibles.",
      figures: "Travaux éligibles : 100 000€ | Réduction d'impôt : 30 000€ | Étalée sur 1 à 4 ans"
    }
  },
  {
    id: "gfi-forets",
    title: "GFI (Groupement Forestier)",
    shortDescription: "L'investissement vert par excellence. Achetez des parts de forêts pour transmettre sans frais.",
    fullDescription: "Le GFI permet d'investir dans le bois et les forêts. C'est un actif décorrélé des marchés financiers qui offre un rendement modeste (1% à 3%) mais une fiscalité successorale imbattable : abattement de 75% sur l'assiette taxable des droits de succession. Idéal pour la transmission patrimoniale et la diversification écologique.",
    keyBenefits: [
      "Outil de transmission ultime (abattement 75% droits de succession)",
      "Réduction d'impôt IR de 18% à 25% à l'entrée",
      "Actif tangible et écologique",
      "Décorrélation totale des marchés financiers",
      "Rendement stable sur le très long terme"
    ],
    riskLevel: 2,
    idealFor: "Transmission de patrimoine et diversification écologique",
    category: "alternatif",
    iconName: "TreePine",
    iconColor: "text-green-600",
    iconBg: "bg-green-500/10",
    caseStudy: {
      title: "Transmission optimisée",
      scenario: "Transmission d'un patrimoine forestier de 100 000€ à ses enfants.",
      figures: "Valeur transmise : 100 000€ | Base taxable : 25 000€ (après abattement 75%) | Économie : ~15 000€"
    }
  },
  {
    id: "or-metaux",
    title: "Or & Métaux Précieux",
    shortDescription: "La valeur refuge ultime pour protéger votre portefeuille contre l'inflation et les crises.",
    fullDescription: "Investir dans l'or (via ETC, ETF ou physique) permet d'avoir une assurance contre les chocs de marché. L'or a tendance à s'apprécier quand les monnaies fiduciaires perdent de la valeur ou en période de crise géopolitique. C'est l'actif de protection par excellence, recommandé à hauteur de 5% à 10% d'un portefeuille diversifié.",
    keyBenefits: [
      "Valeur refuge historique depuis 5000 ans",
      "Décorrélation des marchés actions",
      "Protection contre l'inflation monétaire",
      "Actif tangible et universel",
      "Liquidité mondiale instantanée"
    ],
    riskLevel: 3,
    idealFor: "Sécurisation (5 à 10% du patrimoine)",
    category: "alternatif",
    iconName: "Gem",
    iconColor: "text-yellow-500",
    iconBg: "bg-yellow-500/10",
    caseStudy: {
      title: "Protection de crise",
      scenario: "En 2008 et 2022, quand les actions chutaient de 30-40%...",
      figures: "L'or a joué son rôle d'amortisseur : +5% en 2008, +0% en 2022 vs -20% pour les actions"
    }
  },
  {
    id: "cryptomonnaies",
    title: "Cryptomonnaies (Bitcoin/ETH)",
    shortDescription: "Une nouvelle classe d'actifs numériques pour viser une performance explosive.",
    fullDescription: "Actifs numériques décentralisés basés sur la Blockchain. Bitcoin est souvent vu comme 'l'or numérique', tandis qu'Ethereum est la plateforme de référence pour les applications décentralisées. Classe d'actif très volatile mais avec le plus fort potentiel de performance de la décennie. À réserver à une petite partie du patrimoine (1% à 5%).",
    keyBenefits: [
      "Potentiel de gain très élevé",
      "Actif décentralisé hors système bancaire",
      "Liquidité immédiate (24h/24, 7j/7)",
      "Transparence totale via la Blockchain",
      "Adoption croissante par les institutionnels"
    ],
    riskLevel: 7,
    idealFor: "Diversification agressive (1 à 5% max du patrimoine)",
    category: "alternatif",
    iconName: "Bitcoin",
    iconColor: "text-orange-500",
    iconBg: "bg-orange-500/10",
    caseStudy: {
      title: "L'asymétrie du risque",
      scenario: "Allocation de 2% de son patrimoine (2 000€ sur 100 000€) en Bitcoin.",
      figures: "Risque maximum : -2% du patrimoine | Potentiel si ×5 : +8% du patrimoine total"
    }
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
