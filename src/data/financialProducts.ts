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
  category: "fiscalite" | "retraite" | "performance" | "immobilier" | "bourse" | "alternatif" | "epargne" | "transmission";
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
  },
  {
    id: "or-physique",
    title: "Or Physique",
    shortDescription: "Valeur refuge millénaire pour protéger votre patrimoine des crises.",
    fullDescription: "L'or est l'actif de protection par excellence. Il ne génère pas de rendement mais conserve sa valeur sur le très long terme. Idéal pour se prémunir contre l'inflation et les crises systémiques.",
    keyBenefits: [
      "Protection contre l'inflation et les crises",
      "Actif tangible et universel",
      "Fiscalité avantageuse après 22 ans (exonération)",
      "Décorrélation totale des marchés financiers"
    ],
    riskLevel: 3,
    idealFor: "Protection patrimoniale et diversification défensive",
    category: "alternatif",
    iconName: "Coins",
    iconColor: "text-yellow-500",
    iconBg: "bg-yellow-500/10",
    caseStudy: {
      title: "Valeur refuge",
      scenario: "Achat de 10 000€ d'or en période de crise.",
      figures: "Historiquement : +15% à +30% de valorisation pendant les récessions"
    }
  },
  {
    id: "crypto",
    title: "Cryptomonnaies",
    shortDescription: "Actifs numériques à très haut risque pour une diversification spéculative.",
    fullDescription: "Bitcoin, Ethereum et autres cryptos offrent un potentiel de gain exceptionnel mais avec une volatilité extrême. À réserver à une petite part du patrimoine pour les profils avertis.",
    keyBenefits: [
      "Potentiel de performance très élevé",
      "Décorrélation des actifs traditionnels",
      "Accessibilité 24h/24, 7j/7",
      "Flat tax de 30% sur les plus-values"
    ],
    riskLevel: 7,
    idealFor: "Spéculation avec de l'argent que vous pouvez perdre",
    category: "alternatif",
    iconName: "Bitcoin",
    iconColor: "text-orange-500",
    iconBg: "bg-orange-500/10",
    caseStudy: {
      title: "Haut risque, haut rendement",
      scenario: "Investissement de 1 000€ en Bitcoin en 2020.",
      figures: "Valeur potentielle 2024 : entre 500€ et 5 000€ selon le timing"
    }
  },

  // --- FISCALITÉ (COMPLÉMENTS) ---
  {
    id: "fcpi-fip",
    title: "FCPI / FIP",
    shortDescription: "Réduction d'impôt de 18-25% en investissant dans les PME innovantes.",
    fullDescription: "Les FCPI (Fonds Communs de Placement dans l'Innovation) et FIP (Fonds d'Investissement de Proximité) financent des PME françaises. En échange, vous bénéficiez d'une réduction d'impôt immédiate.",
    keyBenefits: [
      "Réduction IR de 18% à 25% du montant investi",
      "Soutien à l'économie locale et l'innovation",
      "Diversification sur plusieurs PME",
      "Potentiel de plus-value à terme"
    ],
    riskLevel: 5,
    idealFor: "Contribuables souhaitant défiscaliser tout en soutenant l'économie",
    category: "fiscalite",
    iconName: "Lightbulb",
    iconColor: "text-yellow-500",
    iconBg: "bg-yellow-500/10",
    caseStudy: {
      title: "Défiscalisation PME",
      scenario: "Investissement de 4 000€ dans un FCPI.",
      figures: "Réduction d'impôt immédiate : 1 000€ (25%)"
    }
  },
  {
    id: "dons-ifi",
    title: "Dons et IFI",
    shortDescription: "Réduisez votre IFI de 75% en soutenant des associations d'intérêt général.",
    fullDescription: "Les dons aux associations reconnues d'utilité publique permettent de réduire directement votre IFI. C'est la seule réduction possible sur cet impôt, avec un taux record de 75%.",
    keyBenefits: [
      "Réduction IFI de 75% du don (plafond 50 000€)",
      "Impact social et solidaire",
      "Choix de la cause soutenue",
      "Reçu fiscal immédiat"
    ],
    riskLevel: 1,
    idealFor: "Assujettis IFI souhaitant donner du sens à leur impôt",
    category: "fiscalite",
    iconName: "Heart",
    iconColor: "text-rose-500",
    iconBg: "bg-rose-500/10",
    caseStudy: {
      title: "IFI solidaire",
      scenario: "Don de 10 000€ à une fondation.",
      figures: "Réduction IFI : 7 500€ | Coût réel du don : 2 500€"
    }
  },
  {
    id: "malraux",
    title: "Loi Malraux",
    shortDescription: "Défiscalisation jusqu'à 30% pour la restauration de biens historiques.",
    fullDescription: "Le dispositif Malraux offre une réduction d'impôt pour les travaux de restauration dans les secteurs sauvegardés. C'est l'un des rares dispositifs non plafonné par le plafonnement global des niches fiscales.",
    keyBenefits: [
      "Réduction d'impôt de 22% à 30% des travaux",
      "Hors plafonnement des niches fiscales (10 000€)",
      "Valorisation patrimoniale du bien",
      "Loyers décents après rénovation"
    ],
    riskLevel: 4,
    idealFor: "Forte fiscalité + goût pour le patrimoine architectural",
    category: "fiscalite",
    iconName: "Landmark",
    iconColor: "text-stone-500",
    iconBg: "bg-stone-500/10",
    caseStudy: {
      title: "Restauration Malraux",
      scenario: "Travaux de 100 000€ en secteur sauvegardé.",
      figures: "Réduction d'impôt : 30 000€ (étalée sur 4 ans max)"
    }
  },

  // --- RETRAITE (COMPLÉMENTS) ---
  {
    id: "pereco",
    title: "PERECO (Entreprise)",
    shortDescription: "Profitez de l'abondement employeur pour booster votre épargne retraite.",
    fullDescription: "Le PER d'Entreprise Collectif permet de bénéficier de versements de votre employeur (abondement) en plus de vos propres versements. L'abondement est exonéré d'impôt et de charges.",
    keyBenefits: [
      "Abondement employeur (jusqu'à 300% de vos versements)",
      "Versements volontaires déductibles du revenu",
      "Participation et intéressement transférables",
      "Sortie en capital ou rente à la retraite"
    ],
    riskLevel: 3,
    idealFor: "Salariés avec un employeur proposant un PERECO généreux",
    category: "retraite",
    iconName: "Briefcase",
    iconColor: "text-blue-500",
    iconBg: "bg-blue-500/10",
    caseStudy: {
      title: "Abondement x3",
      scenario: "Versement de 1 000€ avec abondement à 300%.",
      figures: "Épargne totale : 4 000€ | Effort réel : 1 000€"
    }
  },
  {
    id: "madelin",
    title: "Contrat Madelin",
    shortDescription: "Le PER des indépendants : cotisations 100% déductibles du BNC/BIC.",
    fullDescription: "Remplacé par le PER individuel, le Madelin reste actif pour les anciens contrats. Il permet aux TNS de déduire leurs cotisations retraite de leur bénéfice imposable.",
    keyBenefits: [
      "Déductibilité totale des cotisations",
      "Plafonds élevés pour les TNS",
      "Constitution d'une retraite complémentaire",
      "Transfert possible vers un PER"
    ],
    riskLevel: 3,
    idealFor: "Indépendants et professions libérales",
    category: "retraite",
    iconName: "UserCheck",
    iconColor: "text-teal-500",
    iconBg: "bg-teal-500/10",
    caseStudy: {
      title: "Optimisation TNS",
      scenario: "Médecin versant 15 000€/an.",
      figures: "Économie d'impôt annuelle : 6 750€ (TMI 45%)"
    }
  },

  // --- BOURSE (COMPLÉMENTS) ---
  {
    id: "compte-titres",
    title: "Compte-Titres Ordinaire",
    shortDescription: "Accès illimité aux marchés mondiaux sans plafond ni contrainte.",
    fullDescription: "Le CTO est l'enveloppe la plus flexible pour investir en bourse. Aucun plafond, aucune restriction géographique. Fiscalité moins avantageuse (flat tax 30%) mais liberté totale.",
    keyBenefits: [
      "Aucun plafond de versement",
      "Accès à tous les marchés mondiaux",
      "Tous types d'actifs (actions, obligations, ETF, dérivés)",
      "Retraits à tout moment sans clôture"
    ],
    riskLevel: 4,
    idealFor: "Investisseurs actifs ou PEA déjà au plafond",
    category: "bourse",
    iconName: "LineChart",
    iconColor: "text-blue-500",
    iconBg: "bg-blue-500/10",
    caseStudy: {
      title: "Diversification mondiale",
      scenario: "Portefeuille de 100 000€ sur actions US.",
      figures: "Accès aux GAFAM, Tesla, Nvidia... impossibles en PEA"
    }
  },
  {
    id: "etf",
    title: "ETF (Trackers)",
    shortDescription: "Investissez en bourse à moindre coût avec un panier diversifié.",
    fullDescription: "Les ETF répliquent la performance d'un indice (CAC 40, S&P 500, MSCI World) avec des frais très faibles. C'est la solution idéale pour l'investisseur passif long terme.",
    keyBenefits: [
      "Frais de gestion très bas (0.1% à 0.5%)",
      "Diversification immédiate sur des centaines de titres",
      "Liquidité quotidienne",
      "Éligibles PEA et Assurance-Vie"
    ],
    riskLevel: 4,
    idealFor: "Investissement passif long terme (DCA)",
    category: "bourse",
    iconName: "BarChart3",
    iconColor: "text-indigo-500",
    iconBg: "bg-indigo-500/10",
    caseStudy: {
      title: "MSCI World",
      scenario: "Investissement mensuel de 200€ sur ETF World.",
      figures: "Performance historique moyenne : ~8%/an sur 30 ans"
    }
  },
  {
    id: "pea-pme",
    title: "PEA-PME",
    shortDescription: "Investissez dans les PME européennes avec 75 000€ de plafond supplémentaire.",
    fullDescription: "Le PEA-PME complète le PEA classique avec un plafond additionnel de 75 000€ dédié aux petites et moyennes entreprises européennes. Même fiscalité avantageuse après 5 ans.",
    keyBenefits: [
      "Plafond supplémentaire de 75 000€",
      "Exonération d'impôt après 5 ans",
      "Soutien à l'économie locale",
      "Cumulable avec le PEA classique"
    ],
    riskLevel: 5,
    idealFor: "PEA au plafond cherchant à investir davantage en exonération",
    category: "bourse",
    iconName: "Factory",
    iconColor: "text-violet-500",
    iconBg: "bg-violet-500/10",
    caseStudy: {
      title: "Small caps européennes",
      scenario: "Investissement de 30 000€ sur PME cotées.",
      figures: "Potentiel de croissance supérieur aux grandes capitalisations"
    }
  },

  // --- IMMOBILIER (COMPLÉMENTS) ---
  {
    id: "lmnp",
    title: "LMNP (Location Meublée)",
    shortDescription: "Location meublée avec amortissement comptable pour une fiscalité proche de zéro.",
    fullDescription: "Le statut LMNP permet d'amortir le bien immobilier et les meubles, créant un déficit comptable qui efface la fiscalité sur les loyers. C'est le régime préféré des investisseurs immobiliers.",
    keyBenefits: [
      "Amortissement du bien et des meubles",
      "Loyers souvent non imposés pendant 15-20 ans",
      "Régime réel ou micro-BIC au choix",
      "Récupération de TVA possible (résidences services)"
    ],
    riskLevel: 3,
    idealFor: "Revenus locatifs sans fiscalité",
    category: "immobilier",
    iconName: "Home",
    iconColor: "text-emerald-500",
    iconBg: "bg-emerald-500/10",
    caseStudy: {
      title: "Fiscalité zéro",
      scenario: "Studio meublé générant 6 000€/an de loyers.",
      figures: "Impôt sur les loyers : 0€ grâce à l'amortissement"
    }
  },
  {
    id: "pinel",
    title: "Loi Pinel / Pinel+",
    shortDescription: "Réduction d'impôt de 9% à 14% en louant un bien neuf pendant 6 à 12 ans.",
    fullDescription: "Le dispositif Pinel offre une réduction d'impôt en contrepartie d'un engagement de location à loyer plafonné. Les taux ont baissé en 2024 mais Pinel+ maintient les anciens taux sous conditions.",
    keyBenefits: [
      "Réduction d'impôt jusqu'à 14% du prix (Pinel+)",
      "Constitution d'un patrimoine immobilier",
      "Loyers perçus pendant l'engagement",
      "Possibilité de louer à un ascendant/descendant"
    ],
    riskLevel: 3,
    idealFor: "Défiscalisation + constitution de patrimoine immobilier",
    category: "immobilier",
    iconName: "Building",
    iconColor: "text-sky-500",
    iconBg: "bg-sky-500/10",
    caseStudy: {
      title: "Investissement Pinel+",
      scenario: "Achat d'un T2 neuf à 200 000€, engagement 12 ans.",
      figures: "Réduction d'impôt totale : 28 000€ (14%)"
    }
  },

  // --- ÉPARGNE (LIVRETS & COMPTES) ---
  {
    id: "livret-a",
    title: "Livret A / LDDS",
    shortDescription: "Épargne garantie et disponible immédiatement, sans risque ni fiscalité.",
    fullDescription: "Le Livret A et le LDDS sont les placements les plus sûrs en France. Capital garanti par l'État, intérêts exonérés d'impôt, disponibilité immédiate. Le taux est fixé par le gouvernement.",
    keyBenefits: [
      "Capital 100% garanti par l'État",
      "Intérêts totalement exonérés d'impôt",
      "Disponibilité immédiate des fonds",
      "Plafonds : 22 950€ (Livret A) + 12 000€ (LDDS)"
    ],
    riskLevel: 1,
    idealFor: "Épargne de précaution et liquidités court terme",
    category: "epargne",
    iconName: "Wallet",
    iconColor: "text-blue-500",
    iconBg: "bg-blue-500/10",
    caseStudy: {
      title: "Épargne de précaution",
      scenario: "Placement de 22 950€ au taux de 3%.",
      figures: "Intérêts annuels : 688€ nets d'impôt"
    }
  },
  {
    id: "lep",
    title: "LEP (Livret Épargne Populaire)",
    shortDescription: "Le meilleur livret réglementé à 4%, réservé aux revenus modestes.",
    fullDescription: "Le LEP offre un taux supérieur au Livret A (4% vs 3% en 2024) mais est réservé aux foyers dont le revenu fiscal de référence ne dépasse pas un certain plafond. C'est le placement le plus rentable sans risque.",
    keyBenefits: [
      "Taux supérieur au Livret A (4% en 2024)",
      "Capital garanti et disponible",
      "Intérêts 100% exonérés d'impôt",
      "Plafond de 10 000€"
    ],
    riskLevel: 1,
    idealFor: "Revenus modestes cherchant le meilleur rendement sans risque",
    category: "epargne",
    iconName: "BadgePercent",
    iconColor: "text-green-500",
    iconBg: "bg-green-500/10",
    caseStudy: {
      title: "Rendement optimisé",
      scenario: "Placement de 10 000€ au taux de 4%.",
      figures: "Intérêts annuels : 400€ nets (vs 300€ sur Livret A)"
    }
  },
  {
    id: "compte-terme",
    title: "Compte à Terme",
    shortDescription: "Bloquez votre épargne pour un taux garanti supérieur aux livrets.",
    fullDescription: "Le compte à terme est un placement bancaire où vous bloquez une somme pour une durée définie (3 mois à 5 ans) en échange d'un taux garanti. Plus la durée est longue, plus le taux est élevé.",
    keyBenefits: [
      "Taux garanti et connu à l'avance",
      "Capital 100% sécurisé (garantie bancaire)",
      "Aucun frais de gestion",
      "Alternative aux livrets saturés"
    ],
    riskLevel: 1,
    idealFor: "Trésorerie excédentaire à horizon 6 mois à 3 ans",
    category: "epargne",
    iconName: "Lock",
    iconColor: "text-slate-500",
    iconBg: "bg-slate-500/10",
    caseStudy: {
      title: "Blocage 12 mois",
      scenario: "Placement de 50 000€ sur CAT à 3.5%.",
      figures: "Intérêts garantis : 1 750€ net de frais"
    }
  },
  {
    id: "pel-cel",
    title: "PEL / CEL",
    shortDescription: "Épargne logement avec droits à prêt immobilier à taux préférentiel.",
    fullDescription: "Le Plan Épargne Logement (PEL) et le Compte Épargne Logement (CEL) permettent d'épargner en vue d'un projet immobilier tout en acquérant des droits à prêt à taux avantageux.",
    keyBenefits: [
      "Droits à prêt immobilier à taux fixe",
      "Taux de rémunération garanti",
      "Prime d'État sous conditions (anciens PEL)",
      "Cumulable avec d'autres livrets"
    ],
    riskLevel: 1,
    idealFor: "Préparation d'un projet immobilier",
    category: "epargne",
    iconName: "Home",
    iconColor: "text-amber-500",
    iconBg: "bg-amber-500/10",
    caseStudy: {
      title: "Achat immobilier",
      scenario: "PEL de 40 000€ sur 4 ans.",
      figures: "Droits à prêt de 92 000€ à taux préférentiel"
    }
  },

  // --- ASSURANCE-VIE (VARIANTES PREMIUM) ---
  {
    id: "av-luxembourg",
    title: "Assurance-Vie Luxembourgeoise",
    shortDescription: "Protection maximale du capital et accès aux fonds institutionnels.",
    fullDescription: "L'assurance-vie luxembourgeoise offre une protection supérieure (super-privilège du souscripteur) et donne accès à des supports exclusifs : Private Equity, fonds dédiés, titres vifs. Réservée aux patrimoines > 250k€.",
    keyBenefits: [
      "Super-privilège : créancier de 1er rang",
      "Triangle de sécurité (séparation des actifs)",
      "Accès aux fonds institutionnels",
      "Neutralité fiscale (fiscalité du pays de résidence)"
    ],
    riskLevel: 3,
    idealFor: "Patrimoines > 250k€ cherchant sécurité et diversification",
    category: "performance",
    iconName: "ShieldCheck",
    iconColor: "text-blue-600",
    iconBg: "bg-blue-600/10",
    caseStudy: {
      title: "Protection patrimoniale",
      scenario: "Placement de 500 000€ en AV Luxembourgeoise.",
      figures: "En cas de faillite de l'assureur : récupération de 100% du capital"
    }
  },
  {
    id: "contrat-capi",
    title: "Contrat de Capitalisation",
    shortDescription: "L'assurance-vie des sociétés, transmissible de son vivant.",
    fullDescription: "Le contrat de capitalisation fonctionne comme une assurance-vie mais peut être souscrit par une personne morale et se transmet par donation. Il ne bénéficie pas de l'avantage successoral mais offre une flexibilité unique.",
    keyBenefits: [
      "Accessible aux personnes morales (SCI, holdings)",
      "Transmissible par donation (purge des plus-values)",
      "Mêmes supports que l'assurance-vie",
      "Antériorité fiscale conservée après transmission"
    ],
    riskLevel: 2,
    idealFor: "Trésorerie d'entreprise ou transmission anticipée",
    category: "performance",
    iconName: "Building2",
    iconColor: "text-purple-500",
    iconBg: "bg-purple-500/10",
    caseStudy: {
      title: "Transmission de son vivant",
      scenario: "Donation d'un contrat de 200 000€ avec 50 000€ de plus-values.",
      figures: "Plus-values purgées à la donation, zéro impôt pour le donataire"
    }
  },

  // --- IMMOBILIER (COMPLÉMENTS) ---
  {
    id: "sci",
    title: "SCI (Société Civile Immobilière)",
    shortDescription: "Gérez et transmettez votre patrimoine immobilier en famille avec souplesse.",
    fullDescription: "La SCI est une structure juridique pour détenir de l'immobilier à plusieurs. Elle facilite la gestion familiale, la transmission progressive des parts et offre une flexibilité fiscale (IR ou IS).",
    keyBenefits: [
      "Transmission progressive des parts (donations)",
      "Gestion collégiale simplifiée",
      "Choix du régime fiscal (IR ou IS)",
      "Protection du patrimoine familial"
    ],
    riskLevel: 2,
    idealFor: "Familles souhaitant organiser leur patrimoine immobilier",
    category: "immobilier",
    iconName: "Users",
    iconColor: "text-indigo-500",
    iconBg: "bg-indigo-500/10",
    caseStudy: {
      title: "Transmission familiale",
      scenario: "Parents détenant un immeuble de 500 000€ en SCI.",
      figures: "Donation de 100% des parts en 20 ans sans droits de succession"
    }
  },
  {
    id: "denormandie",
    title: "Loi Denormandie",
    shortDescription: "Le Pinel de l'ancien : rénovez un bien en centre-ville et défiscalisez.",
    fullDescription: "Le dispositif Denormandie offre les mêmes avantages que Pinel mais pour l'ancien avec travaux. Il cible les centres-villes dégradés et impose 25% minimum de travaux dans le budget.",
    keyBenefits: [
      "Réduction d'impôt jusqu'à 21% sur 12 ans",
      "Investissement dans l'ancien rénové",
      "Prix d'achat souvent inférieur au neuf",
      "Contribution à la rénovation urbaine"
    ],
    riskLevel: 4,
    idealFor: "Défiscalisation + rénovation de l'ancien",
    category: "immobilier",
    iconName: "Hammer",
    iconColor: "text-orange-500",
    iconBg: "bg-orange-500/10",
    caseStudy: {
      title: "Rénovation centre-ville",
      scenario: "Achat 150 000€ + 50 000€ de travaux, engagement 12 ans.",
      figures: "Réduction d'impôt totale : 42 000€"
    }
  },
  {
    id: "deficit-foncier",
    title: "Déficit Foncier",
    shortDescription: "Déduisez les travaux de vos revenus fonciers ET de votre revenu global.",
    fullDescription: "Le déficit foncier permet de déduire les travaux d'entretien et de réparation des revenus fonciers. L'excédent (jusqu'à 10 700€/an) est imputable sur le revenu global.",
    keyBenefits: [
      "Déduction des travaux sans plafonnement sur revenus fonciers",
      "Imputation sur revenu global (10 700€/an)",
      "Report du déficit sur 10 ans",
      "Hors plafonnement des niches fiscales"
    ],
    riskLevel: 3,
    idealFor: "Propriétaires avec revenus fonciers et travaux à réaliser",
    category: "immobilier",
    iconName: "Receipt",
    iconColor: "text-teal-500",
    iconBg: "bg-teal-500/10",
    caseStudy: {
      title: "Rénovation locative",
      scenario: "30 000€ de travaux avec 15 000€ de revenus fonciers.",
      figures: "Économie d'impôt : jusqu'à 8 000€ (selon TMI)"
    }
  },

  // --- ALTERNATIF (COMPLÉMENTS) ---
  {
    id: "gfv",
    title: "GFV (Groupement Foncier Viticole)",
    shortDescription: "Investissez dans les vignes françaises avec avantages fiscaux et bouteilles de vin.",
    fullDescription: "Le GFV permet d'acquérir des parts de vignobles. Vous bénéficiez des mêmes avantages fiscaux que les GFI (forêts) : réduction IR à l'entrée et abattement successoral de 75%.",
    keyBenefits: [
      "Abattement successoral de 75%",
      "Réduction IR de 18-25% à l'entrée",
      "Revenus en nature (bouteilles de vin)",
      "Actif tangible et plaisir"
    ],
    riskLevel: 3,
    idealFor: "Amateurs de vin et transmission patrimoniale",
    category: "alternatif",
    iconName: "Wine",
    iconColor: "text-rose-500",
    iconBg: "bg-rose-500/10",
    caseStudy: {
      title: "Investissement viticole",
      scenario: "Parts de GFV en Bourgogne pour 50 000€.",
      figures: "Réduction IR : 12 500€ + droits de succession sur 12 500€"
    }
  },
  {
    id: "art-collection",
    title: "Art et Objets de Collection",
    shortDescription: "Actifs tangibles hors IFI avec potentiel de plus-value exonérée.",
    fullDescription: "L'investissement dans l'art (tableaux, sculptures, antiquités, voitures de collection) offre une exonération d'IFI et une fiscalité avantageuse sur les plus-values après détention longue.",
    keyBenefits: [
      "Exonération totale d'IFI",
      "Plus-value exonérée après 22 ans",
      "Diversification plaisir",
      "Actif tangible transmissible"
    ],
    riskLevel: 5,
    idealFor: "Passionnés d'art avec patrimoine important",
    category: "alternatif",
    iconName: "Palette",
    iconColor: "text-pink-500",
    iconBg: "bg-pink-500/10",
    caseStudy: {
      title: "Collection d'art",
      scenario: "Achat d'un tableau contemporain à 30 000€.",
      figures: "Après 22 ans : plus-value 100% exonérée d'impôt"
    }
  },

  // --- TRANSMISSION ---
  {
    id: "donation",
    title: "Donation de son Vivant",
    shortDescription: "Transmettez jusqu'à 100 000€ par enfant sans impôt tous les 15 ans.",
    fullDescription: "La donation permet de transmettre son patrimoine de son vivant en profitant d'abattements renouvelables. C'est l'outil central de l'ingénierie patrimoniale pour réduire les droits de succession.",
    keyBenefits: [
      "Abattement de 100 000€ par enfant (renouvelable)",
      "Abattement de 31 865€ par petit-enfant",
      "Don manuel ou notarié au choix",
      "Réduction des droits avec l'âge du donateur"
    ],
    riskLevel: 1,
    idealFor: "Toute personne souhaitant anticiper sa succession",
    category: "transmission",
    iconName: "Gift",
    iconColor: "text-pink-500",
    iconBg: "bg-pink-500/10",
    caseStudy: {
      title: "Transmission anticipée",
      scenario: "Couple avec 2 enfants, patrimoine de 600 000€.",
      figures: "Transmission de 400 000€ sans aucun droit (100k x 2 parents x 2 enfants)"
    }
  },
  {
    id: "holding-apport-cession",
    title: "Holding & Apport-Cession (150-0 B ter)",
    shortDescription: "Vendez votre entreprise et réinvestissez en report d'imposition.",
    fullDescription: "Le dispositif 150-0 B ter permet d'apporter les titres de votre entreprise à une holding avant cession, puis de réinvestir le produit de la vente sans payer immédiatement la plus-value.",
    keyBenefits: [
      "Report d'imposition de la plus-value (jusqu'à 30%)",
      "Réinvestissement dans l'économie réelle",
      "Diversification du patrimoine post-cession",
      "Transmission facilitée via la holding"
    ],
    riskLevel: 4,
    idealFor: "Entrepreneurs cédant leur société",
    category: "transmission",
    iconName: "Briefcase",
    iconColor: "text-slate-600",
    iconBg: "bg-slate-600/10",
    caseStudy: {
      title: "Cession d'entreprise",
      scenario: "Vente d'une société pour 2 000 000€ (plus-value : 1 800 000€).",
      figures: "Économie d'impôt immédiate : 540 000€ (flat tax reportée)"
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
