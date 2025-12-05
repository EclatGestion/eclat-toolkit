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
  // --- PILIERS (LES BASES) ---
  {
    id: "assurance-vie",
    title: "Assurance-Vie",
    shortDescription: "Le couteau suisse de l'épargne : cadre fiscal privilégié et outil de transmission hors pair.",
    fullDescription: "L'assurance-vie est l'enveloppe fiscale préférée des Français. Elle permet de capitaliser sans fiscalité (tant qu'on ne retire pas), d'accéder à des fonds garantis (Fonds Euro) et aux marchés financiers (UC), tout en offrant un abattement successoral unique.",
    keyBenefits: [
      "Abattement de 4 600€/9 200€ sur les gains après 8 ans",
      "Transmission hors succession (152 500€ par bénéficiaire)",
      "Capital disponible à tout moment",
      "Large choix de supports : fonds euros et unités de compte"
    ],
    riskLevel: 2,
    idealFor: "Tous les profils (Construction de capital & Transmission)",
    category: "performance",
    iconName: "Shield",
    iconColor: "text-violet-500",
    iconBg: "bg-violet-500/10",
    caseStudy: {
      title: "Transmission optimisée",
      scenario: "Sophie place 100 000€. Au décès, ses enfants touchent le capital + gains NETS de droits.",
      figures: "Droits de succession : 0 € (vs 20% à 45% sans assurance-vie)"
    }
  },
  {
    id: "pea",
    title: "PEA (Plan Épargne Actions)",
    shortDescription: "Investissez en Bourse avec 0% d'impôt sur les plus-values après 5 ans.",
    fullDescription: "Le PEA est le paradis fiscal de l'investisseur en actions européennes. C'est l'enveloppe idéale pour loger des ETF World (via swap) ou des titres vifs et faire fructifier son capital sans frottement fiscal.",
    keyBenefits: [
      "Exonération d'impôt sur le revenu après 5 ans",
      "Frais de courtage plafonnés par la loi",
      "Sortie en rente viagère défiscalisée possible",
      "Plafond de versement : 150 000€"
    ],
    riskLevel: 4,
    idealFor: "Dynamiser son épargne sur le long terme",
    category: "bourse",
    iconName: "TrendingUp",
    iconColor: "text-emerald-500",
    iconBg: "bg-emerald-500/10",
    caseStudy: {
      title: "L'effet boule de neige",
      scenario: "Investissement de 300€/mois pendant 20 ans à 7%.",
      figures: "Gain net d'impôt : +85 000 € d'intérêts composés"
    }
  },

  // --- FISCALITÉ & RETRAITE ---
  {
    id: "per",
    title: "PER (Plan Épargne Retraite)",
    shortDescription: "Déduisez vos versements de vos impôts aujourd'hui pour préparer demain.",
    fullDescription: "Le PER est le nouveau produit tunnel pour la retraite. La force du dispositif ? Tout ce que vous versez est déduit de votre revenu imposable. L'État finance une partie de votre épargne.",
    keyBenefits: [
      "Déductibilité des versements (jusqu'à 45% de gain immédiat)",
      "Sortie en capital à 100% possible",
      "Déblocage anticipé pour achat résidence principale",
      "Report des plafonds non utilisés sur 3 ans"
    ],
    riskLevel: 3,
    idealFor: "Les foyers fortement imposés (TMI 30%, 41%, 45%)",
    category: "retraite",
    iconName: "PiggyBank",
    iconColor: "text-emerald-500",
    iconBg: "bg-emerald-500/10",
    caseStudy: {
      title: "Gommer une tranche d'impôt",
      scenario: "Marc (TMI 41%) verse 10 000 €.",
      figures: "Économie d'impôt : 4 100 € | Effort réel : 5 900 €"
    }
  },
  {
    id: "girardin",
    title: "Girardin Industriel",
    shortDescription: "Le dispositif 'One-Shot' pour effacer votre impôt sur le revenu dès cette année.",
    fullDescription: "Vous investissez dans du matériel industriel en Outre-mer à fond perdu. En échange, l'État vous offre une réduction d'impôt supérieure à votre investissement initial l'année suivante.",
    keyBenefits: [
      "Rentabilité de 10% à 15% net d'impôt en 1 an",
      "Efface l'impôt en totalité (selon plafonds)",
      "Action purement fiscale (pas de gestion)",
      "Soutien à l'économie des territoires ultramarins"
    ],
    riskLevel: 5,
    idealFor: "Impôt sur le revenu > 5 000 €",
    category: "fiscalite",
    iconName: "Palmtree",
    iconColor: "text-blue-500",
    iconBg: "bg-blue-500/10",
    caseStudy: {
      title: "Opération Cash-Positive",
      scenario: "Vous versez 9 000 € en 2024.",
      figures: "Réduction d'impôt en 2025 : 10 000 € (Gain net : 1 000 €)"
    }
  },
  {
    id: "sofica",
    title: "SOFICA (Cinéma)",
    shortDescription: "Financez le cinéma français et réduisez vos impôts de 48%.",
    fullDescription: "Les SOFICA permettent de financer la production de films. C'est le taux de réduction d'impôt le plus élevé disponible (hors Girardin). C'est aussi un investissement plaisir.",
    keyBenefits: [
      "Taux de réduction record : 48%",
      "Diversification plaisir et culturelle",
      "Soutien à la création cinématographique française",
      "Investissement à partir de 5 000€"
    ],
    riskLevel: 5,
    idealFor: "Amateurs de cinéma avec forte fiscalité",
    category: "fiscalite",
    iconName: "Film",
    iconColor: "text-pink-500",
    iconBg: "bg-pink-500/10",
    caseStudy: {
      title: "Défiscalisation Culturelle",
      scenario: "Investissement de 5 000 €.",
      figures: "Réduction d'impôt immédiate : 2 400 €"
    }
  },

  // --- IMMOBILIER ---
  {
    id: "scpi",
    title: "SCPI (Pierre-Papier)",
    shortDescription: "L'immobilier locatif sans les soucis de gestion, accessible dès quelques milliers d'euros.",
    fullDescription: "Vous achetez des parts d'un parc immobilier (bureaux, commerces, santé) géré par des professionnels. Vous touchez les loyers nets de charges trimestriellement.",
    keyBenefits: [
      "Rendement moyen ~4.5% - 5.5%",
      "Aucune gestion locative",
      "Mutualisation du risque sur des centaines de locataires",
      "Accessible dès quelques centaines d'euros"
    ],
    riskLevel: 3,
    idealFor: "Revenus complémentaires immédiats",
    category: "immobilier",
    iconName: "Building2",
    iconColor: "text-amber-500",
    iconBg: "bg-amber-500/10",
    caseStudy: {
      title: "Rente immobilière",
      scenario: "Investissement de 50 000 €.",
      figures: "Revenus versés : ~2 250 € / an (brut)"
    }
  },
  {
    id: "nue-propriete",
    title: "Nue-Propriété (Démembrement)",
    shortDescription: "Achetez de l'immobilier avec une décote de 40% en renonçant temporairement aux loyers.",
    fullDescription: "Vous achetez les murs (la nue-propriété) pour 60% de la valeur. Un bailleur institutionnel utilise le bien pendant 15 ans (l'usufruit). Au terme, vous récupérez la pleine propriété automatiquement et sans frais.",
    keyBenefits: [
      "Prix d'achat très décoté (-40%)",
      "Aucune fiscalité (pas de revenus fonciers, pas d'IFI)",
      "Aucune charge ni travaux pendant 15 ans",
      "Récupération automatique de la pleine propriété"
    ],
    riskLevel: 2,
    idealFor: "Investisseurs IFI ou préparation retraite lointaine",
    category: "immobilier",
    iconName: "Key",
    iconColor: "text-slate-500",
    iconBg: "bg-slate-500/10",
    caseStudy: {
      title: "L'achat malin",
      scenario: "Bien valant 300 000€. Achat en nue-propriété : 180 000€.",
      figures: "Gain mécanique à terme : +120 000 € (net d'impôt)"
    }
  },
  {
    id: "crowdfunding",
    title: "Crowdfunding Immobilier",
    shortDescription: "Financez les promoteurs et visez 10% de rendement sur 12-24 mois.",
    fullDescription: "Prêtez de l'argent à court terme à des marchands de biens pour financer leurs opérations (achat-revente, construction). C'est de l'immobilier dynamique sans être propriétaire.",
    keyBenefits: [
      "Rendements élevés (9-11%)",
      "Durée courte (12-24 mois)",
      "Accessible dès 1 000€",
      "Diversification sur plusieurs opérations"
    ],
    riskLevel: 4,
    idealFor: "Dynamiser de l'épargne disponible court terme",
    category: "immobilier",
    iconName: "Users",
    iconColor: "text-cyan-500",
    iconBg: "bg-cyan-500/10",
    caseStudy: {
      title: "Opération Marchand de Biens",
      scenario: "Prêt de 2 000€ sur 18 mois à 10%.",
      figures: "Gain : 300€ d'intérêts bruts"
    }
  },

  // --- PERFORMANCE & DIVERSIFICATION ---
  {
    id: "private-equity",
    title: "Private Equity",
    shortDescription: "Investissez dans l'économie réelle (PME non cotées) comme les investisseurs institutionnels.",
    fullDescription: "Historiquement réservé aux ultra-riches, le Private Equity permet d'entrer au capital de sociétés en forte croissance avant qu'elles ne soient connues. C'est la classe d'actifs la plus performante sur 20 ans.",
    keyBenefits: [
      "Potentiel de performance élevé (cible 10-15%)",
      "Décorrélation des marchés boursiers",
      "Aventure entrepreneuriale",
      "Avantages fiscaux possibles (FCPR, 150-0 B ter)"
    ],
    riskLevel: 5,
    idealFor: "Diversification de patrimoine (>10k€ à investir)",
    category: "performance",
    iconName: "Rocket",
    iconColor: "text-orange-500",
    iconBg: "bg-orange-500/10",
    caseStudy: {
      title: "La performance long terme",
      scenario: "Investissement bloqué 10 ans.",
      figures: "Objectif de multiple : x2 ou x2.5 sur le capital"
    }
  },
  {
    id: "fonds-dates",
    title: "Fonds Datés (Obligations)",
    shortDescription: "Verrouillez un rendement élevé connu à l'avance sur une durée fixe.",
    fullDescription: "Un fonds obligataire daté achète de la dette d'entreprises et la porte jusqu'à remboursement. Vous connaissez le rendement cible et la date de fin dès le départ. Idéal quand les taux sont hauts.",
    keyBenefits: [
      "Visibilité sur le rendement (ex: 5-6%)",
      "Risque maîtrisé (portage jusqu'à échéance)",
      "Alternative au fonds euro",
      "Horizon court/moyen terme (3-5 ans)"
    ],
    riskLevel: 2,
    idealFor: "Placement de trésorerie moyen terme (3-5 ans)",
    category: "performance",
    iconName: "Clock",
    iconColor: "text-blue-500",
    iconBg: "bg-blue-500/10",
    caseStudy: {
      title: "Le portage obligataire",
      scenario: "Investissement sur fonds daté 2028.",
      figures: "Rendement cible : 5% net / an"
    }
  },
  {
    id: "produits-structures",
    title: "Produits Structurés",
    shortDescription: "Un rendement défini à l'avance avec une protection conditionnelle du capital.",
    fullDescription: "Une solution hybride qui vise une performance (ex: 8%/an) tant qu'un indice de référence ne baisse pas au-delà d'une certaine limite (ex: -40%).",
    keyBenefits: [
      "Rendements attractifs en marché stable",
      "Barrière de protection du capital",
      "Gains automatiques (effet rappel)",
      "Personnalisation du couple rendement/risque"
    ],
    riskLevel: 4,
    idealFor: "Optimiser le couple rendement/risque",
    category: "performance",
    iconName: "Layers",
    iconColor: "text-indigo-500",
    iconBg: "bg-indigo-500/10",
    caseStudy: {
      title: "Objectif 10%",
      scenario: "Si l'indice est stable ou positif à une date anniversaire...",
      figures: "Vous récupérez 100% du capital + 10% de gain par année écoulée."
    }
  },

  // --- ALTERNATIF ---
  {
    id: "gfi-forets",
    title: "GFI (Groupement Forestier)",
    shortDescription: "Investissez dans le poumon vert de la planète et transmettez sans frais.",
    fullDescription: "Achetez des parts de forêts gérées durablement. C'est un actif tangible, décorrélé des marchés, qui offre un avantage successoral massif (abattement de 75% sur la valeur).",
    keyBenefits: [
      "Abattement successoral de 75%",
      "Réduction d'impôt IR à l'entrée (18-25%)",
      "Actif tangible et écologique",
      "Décorrélation totale des marchés financiers"
    ],
    riskLevel: 2,
    idealFor: "Transmission de gros patrimoines",
    category: "alternatif",
    iconName: "TreePine",
    iconColor: "text-green-600",
    iconBg: "bg-green-600/10",
    caseStudy: {
      title: "Héritage vert",
      scenario: "Transmission d'une forêt de 100 000€.",
      figures: "Droits de succession calculés sur seulement : 25 000 €"
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
