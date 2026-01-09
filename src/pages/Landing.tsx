import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AnimatedUnderline } from "@/components/ui/animated-underline";
import { 
  Shield, 
  TrendingUp, 
  Calculator, 
  Sparkles, 
  ChevronRight, 
  Plus, 
  Minus, 
  Brain, 
  Target, 
  BookOpen,
  Crown,
  Zap,
  Check,
  Home,
  PiggyBank,
  BarChart3,
  Scale,
  Building2,
  Wallet,
  ArrowRight
} from "lucide-react";
import { financialProducts } from "@/data/financialProducts";
import { ProductCard } from "@/components/academy/ProductCard";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import eclatLogo from "@/assets/eclat-logo.png";
import { SEO } from "@/components/seo/SEO";

// FAQ Data optimized for Google Featured Snippets
const faqData = [
  {
    question: "Comment réduire mon impôt sur le revenu en 2025 ?",
    answer: "Utilisez notre simulateur d'impôt 2025 pour calculer votre Tranche Marginale d'Imposition (TMI) et découvrir les meilleures niches fiscales : PER (Plan d'Épargne Retraite) permettant de déduire jusqu'à 10% de vos revenus, Girardin Industriel avec 15% de rendement fiscal, et Pinel pour l'immobilier locatif. Ces dispositifs peuvent réduire votre impôt de plusieurs milliers d'euros."
  },
  {
    question: "Éclat Toolkit est-il gratuit ? Quels outils sans abonnement ?",
    answer: "Oui, Éclat Toolkit propose 4 outils 100% gratuits : le Calculateur de capacité d'épargne mensuelle, le Calculateur d'impact de l'inflation sur votre pouvoir d'achat, le Simulateur IR basique (sans optimisation fiscale), et l'accès complet à l'Académie Financière avec 13 fiches produits éducatives. Les formules Premium (5,99€/mois) et Expert (14,99€/mois) débloquent les simulateurs avancés et l'IA."
  },
  {
    question: "Vos données personnelles sont-elles protégées (RGPD) ?",
    answer: "Absolument. Éclat Toolkit utilise des protocoles de chiffrement bancaire (AES-256) et respecte le RGPD. Vos données financières sont stockées sur des serveurs européens sécurisés. Nous ne vendons jamais vos informations et vous pouvez demander leur suppression à tout moment depuis votre espace personnel."
  },
  {
    question: "Qu'est-ce que le mouvement FIRE (Financial Independence Retire Early) ?",
    answer: "FIRE signifie Financial Independence, Retire Early (Indépendance Financière, Retraite Anticipée). C'est une stratégie visant à épargner et investir agressivement (50-70% de ses revenus) pour atteindre la liberté financière avant l'âge légal de la retraite. Notre calculateur FIRE estime le montant d'épargne nécessaire selon la règle des 4% et votre niveau de vie souhaité."
  },
  {
    question: "Comment calculer ses droits de succession en France ?",
    answer: "Les droits de succession en France dépendent du lien de parenté et du montant hérité. Chaque enfant bénéficie d'un abattement de 100 000€, puis un barème progressif s'applique (5% à 45%). Notre Simulateur de Succession Expert calcule précisément les droits à payer et optimise la transmission via l'assurance-vie (abattement de 152 500€ par bénéficiaire)."
  },
  {
    question: "Quel est le plafond du PER (Plan d'Épargne Retraite) en 2025 ?",
    answer: "Le plafond de déduction du PER en 2025 est de 10% de vos revenus professionnels, avec un minimum de 4 399€ et un maximum de 35 194€. Vous pouvez également utiliser les plafonds non consommés des 3 années précédentes. Notre Simulateur PER calcule automatiquement votre plafond disponible et l'économie d'impôt associée."
  },
  {
    question: "LMNP ou Location Nue : quel régime fiscal choisir ?",
    answer: "Le choix entre LMNP (Loueur Meublé Non Professionnel) et Location Nue dépend de votre situation. Le LMNP offre l'amortissement du bien (réduisant le revenu imposable à zéro) mais subit la réforme 2025 réintégrant les amortissements à la revente. La Location Nue permet un déficit foncier imputable sur le revenu global. Notre Comparateur LMNP Expert modélise les deux régimes sur 5 à 20 ans."
  },
  {
    question: "Comment fonctionne le conseiller IA patrimonial ?",
    answer: "Notre Conseiller IA Expert analyse vos objectifs financiers en langage naturel : 'acheter un appartement dans 5 ans', 'préparer la retraite', 'financer les études des enfants'. L'IA extrait les paramètres, génère une allocation d'actifs personnalisée (actions, obligations, SCPI, fonds euros) et propose un plan d'action mensuel avec probabilité de succès."
  }
];

// Animation variants
const fadeUpVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const scaleUpVariant = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

// FAQ Accordion Component with semantic HTML
const FaqItem = ({ question, answer }: { question: string; answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <article className="border-b border-border last:border-0" itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full py-5 text-left group"
        aria-expanded={isOpen}
      >
        <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors pr-4" itemProp="name">
          {question}
        </h3>
        {isOpen ? <Minus className="w-5 h-5 text-primary flex-shrink-0" aria-hidden="true" /> : <Plus className="w-5 h-5 text-muted-foreground flex-shrink-0" aria-hidden="true" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
            itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer"
          >
            <p className="pb-5 text-muted-foreground leading-relaxed" itemProp="text">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
};

// Tier data for tools section
const tierData = {
  free: {
    name: "Gratuit",
    color: "border-primary/30 bg-primary/5",
    badgeColor: "bg-primary/10 text-primary",
    tools: [
      { icon: PiggyBank, name: "Capacité d'épargne" },
      { icon: TrendingUp, name: "Calculateur inflation" },
      { icon: Calculator, name: "Simulateur IR basique" },
      { icon: BookOpen, name: "Académie financière" },
    ]
  },
  premium: {
    name: "Premium",
    price: "5,99€/mois",
    color: "border-amber-400/50 bg-amber-50/50",
    badgeColor: "bg-amber-100 text-amber-700",
    tools: [
      { icon: Calculator, name: "Simulateur IR complet" },
      { icon: Home, name: "Simulateur immobilier" },
      { icon: BarChart3, name: "Intérêts composés" },
      { icon: Wallet, name: "Assurance-Vie" },
      { icon: Target, name: "Optimisation PER" },
    ]
  },
  expert: {
    name: "Expert",
    price: "14,99€/mois",
    color: "border-violet-400/50 bg-violet-50/50",
    badgeColor: "bg-violet-100 text-violet-700",
    tools: [
      { icon: Brain, name: "Bilan Patrimonial IA" },
      { icon: Scale, name: "Droits de succession" },
      { icon: Building2, name: "Comparateur LMNP" },
      { icon: Sparkles, name: "Conseiller IA" },
      { icon: Zap, name: "Export PDF premium" },
    ]
  }
};

// Values section data
const valuesData = [
  {
    icon: BookOpen,
    title: "Pédagogique",
    description: "Explications simples, graphiques clairs, scénarios concrets pour comprendre vos finances.",
    tagline: "Comprendre avant d'agir."
  },
  {
    icon: Brain,
    title: "Propulsé par l'IA",
    description: "Analyse personnalisée et recommandations intelligentes basées sur vos objectifs réels.",
    tagline: "Vous êtes guidé pas à pas."
  },
  {
    icon: Target,
    title: "Axé sur vos objectifs",
    description: "Projets concrets : achat immobilier, retraite anticipée FIRE, éducation des enfants.",
    tagline: "Une approche goal-based réellement utile."
  }
];

// Popular tools data
const popularTools = [
  {
    id: "bilan-ia",
    name: "Bilan Patrimonial IA",
    description: "Analyse complète de votre situation financière avec recommandations personnalisées générées par intelligence artificielle et plan d'action sur 12 mois exportable en PDF.",
    features: ["Analyse 5 piliers", "Recommandations IA", "Export PDF"],
    tier: "expert",
    route: "/tools/bilan-patrimonial"
  },
  {
    id: "simulateur-ir",
    name: "Simulateur Impôt sur le Revenu 2025",
    description: "Calculez votre TMI (Tranche Marginale d'Imposition), optimisez avec le PER et le Girardin Industriel, et visualisez vos économies fiscales potentielles avec le barème officiel 2025.",
    features: ["Calcul TMI exact", "Optimisation fiscale", "Barème 2025"],
    tier: "premium",
    route: "/simulateur-impot"
  },
  {
    id: "simulateur-immo",
    name: "Simulateur Capacité d'Emprunt Immobilier",
    description: "Calculez vos mensualités de crédit, votre capacité d'emprunt maximale selon les règles HCSF, et le coût total de votre projet immobilier avec les taux du marché actualisés.",
    features: ["Mensualités", "Capacité d'emprunt", "Coût total crédit"],
    tier: "premium",
    route: "/tools/simulateur-immobilier"
  }
];

export default function Landing() {
  const navigate = useNavigate();
  const [isAnnual, setIsAnnual] = useState(false);

  const featuredProducts = financialProducts.filter(p => 
    ["per", "assurance-vie", "girardin"].includes(p.id)
  );

  const scrollToTools = () => {
    document.getElementById('tools-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Enhanced SEO JSON-LD schemas
  const landingJsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Éclat Toolkit",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Web",
      "description": "Application de gestion de patrimoine intelligente avec simulateurs fiscaux (IR 2025, succession), immobiliers (capacité d'emprunt, LMNP) et conseiller IA personnalisé.",
      "url": "https://app.eclat-toolkit.fr",
      "offers": {
        "@type": "AggregateOffer",
        "lowPrice": "0",
        "highPrice": "149.99",
        "priceCurrency": "EUR",
        "offers": [
          { "@type": "Offer", "name": "Gratuit", "price": "0" },
          { "@type": "Offer", "name": "Premium", "price": "5.99" },
          { "@type": "Offer", "name": "Expert", "price": "14.99" }
        ]
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "ratingCount": "127",
        "bestRating": "5"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqData.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Accueil",
          "item": "https://app.eclat-toolkit.fr/"
        }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "Simulateurs Financiers Éclat Toolkit",
      "description": "Outils de simulation fiscale et patrimoniale gratuits et premium",
      "itemListElement": [
        {
          "@type": "SoftwareApplication",
          "position": 1,
          "name": "Simulateur Impôt sur le Revenu 2025",
          "applicationCategory": "FinanceApplication",
          "url": "https://app.eclat-toolkit.fr/simulateur-impot"
        },
        {
          "@type": "SoftwareApplication",
          "position": 2,
          "name": "Simulateur Droits de Succession",
          "applicationCategory": "FinanceApplication",
          "url": "https://app.eclat-toolkit.fr/tools/simulateur-succession"
        },
        {
          "@type": "SoftwareApplication",
          "position": 3,
          "name": "Simulateur Capacité d'Emprunt Immobilier",
          "applicationCategory": "FinanceApplication",
          "url": "https://app.eclat-toolkit.fr/tools/simulateur-immobilier"
        },
        {
          "@type": "SoftwareApplication",
          "position": 4,
          "name": "Calculateur Intérêts Composés",
          "applicationCategory": "FinanceApplication",
          "url": "https://app.eclat-toolkit.fr/tools/interets-composes"
        },
        {
          "@type": "SoftwareApplication",
          "position": 5,
          "name": "Comparateur LMNP vs Location Nue",
          "applicationCategory": "FinanceApplication",
          "url": "https://app.eclat-toolkit.fr/tools/comparateur-lmnp"
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Simulateur Impôt 2025 & Gestion de Patrimoine | Outils Gratuits"
        description="Calculez votre impôt sur le revenu 2025, simulez vos droits de succession, planifiez votre retraite FIRE. Simulateurs fiscaux gratuits et conseiller IA patrimonial."
        canonical="/"
        jsonLd={landingJsonLd}
        keywords="simulateur impôt 2025, calculateur droits succession, gestion patrimoine, FIRE indépendance financière, simulateur PER, capacité emprunt immobilier, LMNP location meublée"
        author="Éclat Gestion Privée"
      />
      
      {/* Navigation Header - Minimal Premium Style */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50"
        role="banner"
      >
        <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between" aria-label="Navigation principale">
          <Link to="/" className="flex items-center gap-3" aria-label="Éclat Toolkit - Accueil">
            <img src={eclatLogo} alt="Éclat Toolkit" className="w-10 h-10" width="40" height="40" />
            <span className="text-2xl font-bold text-foreground tracking-tight">Éclat</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Button variant="ghost" onClick={() => navigate("/pricing")} className="text-muted-foreground hover:text-foreground font-medium">
              Tarifs
            </Button>
            <Button variant="ghost" onClick={() => navigate("/blog")} className="text-muted-foreground hover:text-foreground font-medium">
              Blog
            </Button>
            <Button variant="ghost" onClick={() => navigate("/academie")} className="text-muted-foreground hover:text-foreground font-medium">
              Académie
            </Button>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/auth")} className="text-muted-foreground hover:text-foreground font-medium hidden sm:inline-flex">
              Se connecter
            </Button>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button variant="premium" onClick={() => navigate("/auth")} className="rounded-full px-6">
                Commencer
              </Button>
            </motion.div>
          </div>
        </nav>
      </motion.header>

      <main>
        {/* Hero Section - Premium Asymmetric Design */}
        <section className="min-h-screen pt-32 pb-20 px-6 relative overflow-hidden" aria-labelledby="hero-title">
          {/* Background subtle gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5 pointer-events-none" />
          
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left: Text Content */}
              <article className="space-y-8">
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                  <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-6">
                    Gestion de patrimoine intelligente
                  </span>
                </motion.div>
                
                <motion.h1 
                  id="hero-title"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="text-5xl lg:text-7xl font-bold text-foreground leading-[1.05] tracking-tight"
                >
                  Faites le point sur votre situation{" "}
                  <AnimatedUnderline underlineClassName="h-[4px]">
                    financière
                  </AnimatedUnderline>
                </motion.h1>
                
                <motion.p 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="text-xl text-muted-foreground leading-relaxed max-w-xl"
                >
                  Sans jargon. Sans produit à vendre. Juste des outils puissants 
                  pour comprendre et optimiser votre patrimoine.
                </motion.p>
                
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col sm:flex-row gap-4 pt-4"
                >
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button 
                      variant="premium" 
                      size="xl"
                      onClick={() => navigate("/diagnostic")}
                      className="rounded-full animate-glow-pulse"
                    >
                      Diagnostic gratuit
                      <ChevronRight className="ml-2 w-5 h-5" />
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button 
                      variant="outlineDark" 
                      size="xl"
                      onClick={scrollToTools}
                      className="rounded-full"
                    >
                      Découvrir les outils
                    </Button>
                  </motion.div>
                </motion.div>
                
                {/* Trust indicators */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="flex items-center gap-8 pt-8 text-sm text-muted-foreground"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-success" />
                    <span>Gratuit</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-success" />
                    <span>Sans engagement</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-success" />
                    <span>RGPD</span>
                  </div>
                </motion.div>
              </article>
              
              {/* Right: Floating Cards */}
              <div className="relative h-[600px] hidden lg:block">
                {/* Card 1 - Dashboard preview */}
                <motion.div
                  initial={{ opacity: 0, y: 40, rotateY: -5 }}
                  animate={{ opacity: 1, y: 0, rotateY: 0 }}
                  transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute top-0 right-0 w-80 bg-card rounded-3xl shadow-2xl shadow-black/10 p-6 animate-float border border-border/50"
                  style={{ animationDelay: "0s" }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Wallet className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Patrimoine total</p>
                      <p className="text-2xl font-bold text-foreground">247 500 €</p>
                    </div>
                  </div>
                  <div className="h-24 bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl flex items-end p-4">
                    <div className="flex gap-1 items-end w-full">
                      {[40, 65, 45, 80, 60, 90, 75].map((h, i) => (
                        <div key={i} className="flex-1 bg-primary/40 rounded-t" style={{ height: `${h}%` }} />
                      ))}
                    </div>
                  </div>
                </motion.div>
                
                {/* Card 2 - FIRE progress */}
                <motion.div
                  initial={{ opacity: 0, y: 40, rotateY: 5 }}
                  animate={{ opacity: 1, y: 0, rotateY: 0 }}
                  transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute top-44 left-0 w-64 bg-card rounded-3xl shadow-2xl shadow-black/10 p-6 animate-float border border-border/50"
                  style={{ animationDelay: "1s" }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 bg-success/10 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-7 h-7 text-success" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Objectif FIRE</p>
                      <p className="text-3xl font-bold text-foreground">68%</p>
                    </div>
                  </div>
                  <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full w-[68%] bg-success rounded-full" />
                  </div>
                </motion.div>
                
                {/* Card 3 - Tax optimization */}
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute bottom-20 right-20 w-72 bg-card rounded-3xl shadow-2xl shadow-black/10 p-6 animate-float border border-border/50"
                  style={{ animationDelay: "2s" }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm font-semibold text-foreground">Économie fiscale</p>
                    <span className="px-3 py-1 bg-accent/10 text-accent text-xs font-semibold rounded-full">PER</span>
                  </div>
                  <p className="text-4xl font-bold text-accent">-3 240 €</p>
                  <p className="text-xs text-muted-foreground mt-1">sur votre IR 2025</p>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Tools by Tier Section */}
        <section id="tools-section" className="py-24 px-6 bg-card" aria-labelledby="tools-title">
          <div className="max-w-7xl mx-auto">
            <motion.header 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeUpVariant}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-center mb-16"
            >
              <h2 id="tools-title" className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
                Simulateurs Fiscaux et Patrimoniaux
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Choisissez la formule adaptée à vos besoins : calcul d'impôt, simulation immobilière, planification retraite.
              </p>
            </motion.header>

            {/* Tier Cards */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={staggerContainer}
              className="grid md:grid-cols-3 gap-8 mb-12"
            >
              {/* Free Tier */}
              <motion.article 
                variants={fadeUpVariant}
                transition={{ duration: 0.5, ease: "easeOut" }}
                whileHover={{ scale: 1.02, y: -8 }}
                className={`bg-background rounded-3xl p-8 border-2 ${tierData.free.color} transition-all duration-300`}
              >
                <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-6 ${tierData.free.badgeColor}`}>
                  <Sparkles className="w-4 h-4" aria-hidden="true" />
                  {tierData.free.name}
                </div>
                <div className="mb-6">
                  <span className="text-5xl font-bold text-foreground">0€</span>
                  <span className="text-muted-foreground ml-2">pour toujours</span>
                </div>
                <ul className="space-y-4" aria-label="Outils gratuits inclus">
                  {tierData.free.tools.map((tool, i) => (
                    <li key={i} className="flex items-center gap-3 text-foreground">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <tool.icon className="w-4 h-4 text-primary" aria-hidden="true" />
                      </div>
                      <span className="font-medium">{tool.name}</span>
                    </li>
                  ))}
                </ul>
              </motion.article>

              {/* Premium Tier */}
              <motion.article 
                variants={fadeUpVariant}
                transition={{ duration: 0.5, ease: "easeOut" }}
                whileHover={{ scale: 1.02, y: -8 }}
                className={`bg-background rounded-3xl p-8 border-2 ${tierData.premium.color} relative transition-all duration-300`}
              >
                <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-6 ${tierData.premium.badgeColor}`}>
                  <Crown className="w-4 h-4" aria-hidden="true" />
                  {tierData.premium.name}
                </div>
                <div className="mb-6">
                  <span className="text-5xl font-bold text-foreground">{tierData.premium.price?.split('/')[0]}</span>
                  <span className="text-muted-foreground ml-2">/mois</span>
                </div>
                <ul className="space-y-4" aria-label="Outils Premium inclus">
                  {tierData.premium.tools.map((tool, i) => (
                    <li key={i} className="flex items-center gap-3 text-foreground">
                      <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                        <tool.icon className="w-4 h-4 text-amber-600" aria-hidden="true" />
                      </div>
                      <span className="font-medium">{tool.name}</span>
                    </li>
                  ))}
                </ul>
              </motion.article>

              {/* Expert Tier */}
              <motion.article 
                variants={fadeUpVariant}
                transition={{ duration: 0.5, ease: "easeOut" }}
                whileHover={{ scale: 1.02, y: -8 }}
                className={`bg-background rounded-3xl p-8 border-2 ${tierData.expert.color} relative transition-all duration-300`}
              >
                <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-6 ${tierData.expert.badgeColor}`}>
                  <Zap className="w-4 h-4" aria-hidden="true" />
                  {tierData.expert.name}
                </div>
                <div className="mb-6">
                  <span className="text-5xl font-bold text-foreground">{tierData.expert.price?.split('/')[0]}</span>
                  <span className="text-muted-foreground ml-2">/mois</span>
                </div>
                <ul className="space-y-4" aria-label="Outils Expert inclus">
                  {tierData.expert.tools.map((tool, i) => (
                    <li key={i} className="flex items-center gap-3 text-foreground">
                      <div className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center">
                        <tool.icon className="w-4 h-4 text-violet-600" aria-hidden="true" />
                      </div>
                      <span className="font-medium">{tool.name}</span>
                    </li>
                  ))}
                </ul>
              </motion.article>
            </motion.div>

            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUpVariant}
              transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
              className="text-center"
            >
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  variant="outlineDark"
                  size="lg"
                  onClick={() => navigate("/pricing")}
                  className="rounded-full px-8"
                >
                  Comparer tous les tarifs
                  <ArrowRight className="ml-2 w-4 h-4" aria-hidden="true" />
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-24 px-6 bg-background" aria-labelledby="values-title">
          <div className="max-w-7xl mx-auto">
            <motion.header 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeUpVariant}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-center mb-16"
            >
              <h2 id="values-title" className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
                Conseils Patrimoniaux Pédagogiques
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Comprenez votre situation financière grâce à des explications claires et des recommandations personnalisées.
              </p>
            </motion.header>

            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={staggerContainer}
              className="grid md:grid-cols-3 gap-12"
            >
              {valuesData.map((value, i) => (
                <motion.article 
                  key={i}
                  variants={fadeUpVariant}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  whileHover={{ y: -8 }}
                  className="text-center"
                >
                  <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-8">
                    <value.icon className="w-10 h-10 text-primary" aria-hidden="true" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">{value.title}</h3>
                  <p className="text-muted-foreground mb-4 leading-relaxed">{value.description}</p>
                  <p className="text-sm font-semibold text-primary italic">{value.tagline}</p>
                </motion.article>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Popular Tools Section */}
        <section className="py-24 px-6 bg-card" aria-labelledby="popular-tools-title">
          <div className="max-w-7xl mx-auto">
            <motion.header 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeUpVariant}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-center mb-16"
            >
              <h2 id="popular-tools-title" className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
                Nos Simulateurs les Plus Utilisés
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Découvrez nos simulateurs phares utilisés par des milliers d'investisseurs.
              </p>
            </motion.header>

            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={staggerContainer}
              className="space-y-6"
            >
              {popularTools.map((tool) => (
                <motion.article 
                  key={tool.id}
                  variants={fadeUpVariant}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  whileHover={{ scale: 1.01, y: -4 }}
                  onClick={() => navigate(tool.route)}
                  className="bg-background rounded-3xl p-8 border border-border/50 cursor-pointer hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">{tool.name}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          tool.tier === 'expert' 
                            ? 'bg-violet-100 text-violet-700' 
                            : 'bg-amber-100 text-amber-700'
                        }`}>
                          {tool.tier === 'expert' ? 'Expert' : 'Premium'}
                        </span>
                      </div>
                      <p className="text-muted-foreground mb-4 leading-relaxed">{tool.description}</p>
                      <ul className="flex flex-wrap gap-2" aria-label="Fonctionnalités">
                        {tool.features.map((feature, j) => (
                          <li key={j} className="flex items-center gap-2 bg-muted px-3 py-1.5 rounded-full text-sm text-muted-foreground">
                            <Check className="w-3 h-3 text-success" aria-hidden="true" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                        <ArrowRight className="w-5 h-5 text-primary group-hover:text-white transition-colors" />
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Academy Section */}
        <section className="py-24 px-6 bg-background" aria-labelledby="academy-title">
          <div className="max-w-7xl mx-auto">
            <motion.header 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeUpVariant}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-center mb-16"
            >
              <h2 id="academy-title" className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
                Académie Financière Éclat
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Apprenez les fondamentaux de l'investissement avec nos fiches pédagogiques gratuites.
              </p>
            </motion.header>

            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={staggerContainer}
              className="grid md:grid-cols-3 gap-8 mb-12"
            >
              {featuredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  variants={scaleUpVariant}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  whileHover={{ scale: 1.02, y: -8 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>

            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUpVariant}
              transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
              className="text-center"
            >
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  variant="outlineDark"
                  size="lg"
                  onClick={() => navigate("/academie")}
                  className="rounded-full px-8"
                >
                  Découvrir l'Académie complète
                  <ArrowRight className="ml-2 w-4 h-4" aria-hidden="true" />
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Pricing Section (Simplified) */}
        <section className="py-24 px-6 bg-card" aria-labelledby="pricing-title">
          <div className="max-w-5xl mx-auto">
            <motion.header 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeUpVariant}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-center mb-12"
            >
              <h2 id="pricing-title" className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
                Tarifs Simulateurs Patrimoniaux
              </h2>
              
              {/* Toggle */}
              <div className="flex items-center justify-center gap-4 mt-8">
                <span className={`text-sm font-semibold ${!isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>Mensuel</span>
                <button 
                  onClick={() => setIsAnnual(!isAnnual)}
                  className={`relative w-14 h-7 rounded-full transition-colors ${isAnnual ? 'bg-primary' : 'bg-border'}`}
                  aria-label={isAnnual ? "Passer au tarif mensuel" : "Passer au tarif annuel"}
                >
                  <div className={`absolute top-1 w-5 h-5 bg-card rounded-full shadow transition-transform ${isAnnual ? 'translate-x-8' : 'translate-x-1'}`} />
                </button>
                <span className={`text-sm font-semibold ${isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>
                  Annuel
                  <span className="ml-2 text-success font-bold">-30%</span>
                </span>
              </div>
            </motion.header>

            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={staggerContainer}
              className="grid md:grid-cols-3 gap-8"
            >
              {/* Free */}
              <motion.article 
                variants={fadeUpVariant}
                transition={{ duration: 0.5, ease: "easeOut" }}
                whileHover={{ y: -8 }}
                className="bg-background rounded-3xl p-8 border border-border/50 text-center"
              >
                <h3 className="text-xl font-bold text-foreground mb-2">Gratuit</h3>
                <div className="text-4xl font-bold text-foreground mb-4">0€</div>
                <p className="text-sm text-muted-foreground mb-6">4 outils essentiels</p>
                <Button 
                  variant="outlineDark" 
                  className="w-full rounded-full"
                  onClick={() => navigate("/auth")}
                >
                  Commencer
                </Button>
              </motion.article>

              {/* Premium */}
              <motion.article 
                variants={fadeUpVariant}
                transition={{ duration: 0.5, ease: "easeOut" }}
                whileHover={{ y: -8 }}
                className="bg-background rounded-3xl p-8 border-2 border-amber-400 text-center relative"
              >
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-900 text-xs font-bold px-4 py-1 rounded-full">
                  POPULAIRE
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Premium</h3>
                <div className="text-4xl font-bold text-foreground mb-4">
                  {isAnnual ? '49,99€' : '5,99€'}
                  <span className="text-base font-normal text-muted-foreground">/{isAnnual ? 'an' : 'mois'}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-6">Tous les simulateurs</p>
                <Button 
                  className="w-full rounded-full bg-amber-500 hover:bg-amber-600 text-white"
                  onClick={() => navigate("/auth")}
                >
                  S'abonner
                </Button>
              </motion.article>

              {/* Expert */}
              <motion.article 
                variants={fadeUpVariant}
                transition={{ duration: 0.5, ease: "easeOut" }}
                whileHover={{ y: -8 }}
                className="bg-background rounded-3xl p-8 border-2 border-violet-400 text-center"
              >
                <h3 className="text-xl font-bold text-foreground mb-2">Expert</h3>
                <div className="text-4xl font-bold text-foreground mb-4">
                  {isAnnual ? '149,99€' : '14,99€'}
                  <span className="text-base font-normal text-muted-foreground">/{isAnnual ? 'an' : 'mois'}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-6">IA + Patrimoine avancé</p>
                <Button 
                  className="w-full rounded-full bg-violet-500 hover:bg-violet-600 text-white"
                  onClick={() => navigate("/auth")}
                >
                  S'abonner
                </Button>
              </motion.article>
            </motion.div>

            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUpVariant}
              transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
              className="text-center mt-8"
            >
              <Link 
                to="/pricing"
                className="text-primary hover:underline font-semibold inline-flex items-center gap-2"
              >
                Comparer en détail
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* SEO Content Section */}
        <section className="py-24 px-6 bg-background border-t border-border/50" aria-labelledby="seo-content-title">
          <div className="max-w-4xl mx-auto">
            <motion.article 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeUpVariant}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="prose prose-lg max-w-none"
            >
              <h2 id="seo-content-title" className="text-3xl font-bold text-foreground mb-6">
                Pourquoi utiliser un simulateur de patrimoine en ligne ?
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                La <strong className="text-foreground">gestion de patrimoine</strong> n'est plus réservée aux clients fortunés des banques privées. 
                Avec Éclat Toolkit, chaque Français peut <strong className="text-foreground">calculer son impôt sur le revenu 2025</strong>, 
                estimer ses <strong className="text-foreground">droits de succession</strong>, ou simuler sa{" "}
                <strong className="text-foreground">capacité d'emprunt immobilier</strong> en quelques clics, gratuitement.
              </p>

              <h3 className="text-2xl font-bold text-foreground mb-4 mt-8">
                Simulateur Impôt sur le Revenu 2025 : Comment ça marche ?
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Notre <Link to="/simulateur-impot" className="text-primary hover:underline font-medium">calculateur d'impôt</Link> utilise le barème officiel 2025 
                de l'administration fiscale française. Il calcule votre <strong className="text-foreground">Tranche Marginale d'Imposition (TMI)</strong>,
                applique le quotient familial selon votre situation (célibataire, couple, enfants à charge), 
                et intègre les plafonnements légaux.
              </p>

              <h3 className="text-2xl font-bold text-foreground mb-4 mt-8">
                Optimisez votre fiscalité avec le PER et le Girardin
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Le <strong className="text-foreground">Plan d'Épargne Retraite (PER)</strong> permet de déduire jusqu'à 10% de vos revenus professionnels 
                de votre revenu imposable, dans la limite de 35 194€ en 2025. C'est l'un des leviers les plus efficaces pour{" "}
                <strong className="text-foreground">réduire son impôt</strong> tout en préparant sa retraite.
              </p>

              <h3 className="text-2xl font-bold text-foreground mb-4 mt-8">
                Planifiez votre indépendance financière avec la méthode FIRE
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Le mouvement <strong className="text-foreground">FIRE (Financial Independence, Retire Early)</strong> gagne en popularité en France. 
                Notre <Link to="/tools/interets-composes" className="text-primary hover:underline font-medium">calculateur d'intérêts composés</Link> vous aide à projeter 
                la croissance de votre épargne sur 10, 20 ou 30 ans, avec différents scénarios de rendement.
              </p>
            </motion.article>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 px-6 bg-card border-t border-border/50" aria-labelledby="faq-title" itemScope itemType="https://schema.org/FAQPage">
          <div className="max-w-3xl mx-auto">
            <motion.header 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeUpVariant}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-center mb-12"
            >
              <h2 id="faq-title" className="text-3xl lg:text-4xl font-bold text-foreground">
                Questions Fréquentes
              </h2>
              <p className="text-muted-foreground mt-4">
                Trouvez les réponses à vos questions sur la fiscalité, l'épargne et l'investissement.
              </p>
            </motion.header>
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUpVariant}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="bg-background rounded-3xl p-8 border border-border/50"
            >
              {faqData.map((faq, index) => (
                <FaqItem 
                  key={index}
                  question={faq.question} 
                  answer={faq.answer} 
                />
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA Section - Dark Background */}
        <section className="py-24 px-6 bg-foreground" aria-labelledby="cta-title">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUpVariant}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 id="cta-title" className="text-4xl lg:text-5xl font-bold text-background mb-6">
              Prêt à optimiser votre patrimoine ?
            </h2>
            <p className="text-xl text-background/70 mb-10">
              Créez votre compte gratuitement et accédez à nos simulateurs.
            </p>
            <motion.div 
              whileHover={{ scale: 1.02 }} 
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                variant="premium"
                size="xl"
                onClick={() => navigate("/auth")}
                className="rounded-full animate-glow-pulse"
              >
                Commencer gratuitement
                <ChevronRight className="ml-2 w-5 h-5" aria-hidden="true" />
              </Button>
            </motion.div>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="py-12 px-6 bg-background border-t border-border/50"
        role="contentinfo"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <Link to="/" className="flex items-center gap-3" aria-label="Éclat Toolkit - Accueil">
              <img src={eclatLogo} alt="Éclat logo" className="w-10 h-10" />
              <span className="text-xl font-bold text-foreground">Éclat</span>
            </Link>
            <nav className="flex items-center gap-8 text-sm text-muted-foreground" aria-label="Liens légaux">
              <Link to="/mentions-legales" className="hover:text-foreground transition-colors">Mentions Légales</Link>
              <Link to="/confidentialite" className="hover:text-foreground transition-colors">Confidentialité</Link>
              <Link to="/cgu" className="hover:text-foreground transition-colors">CGU</Link>
              <a href="mailto:contact@eclat-gp.com" className="hover:text-foreground transition-colors">Contact</a>
            </nav>
            <p className="text-sm text-muted-foreground">
              © 2025 Éclat Gestion Privée
            </p>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
