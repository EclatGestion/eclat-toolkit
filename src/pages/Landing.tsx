import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
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
  Wallet
} from "lucide-react";
import { financialProducts } from "@/data/financialProducts";
import { ProductCard } from "@/components/academy/ProductCard";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import eclatLogo from "@/assets/eclat-logo.png";

// FAQ Data for both UI and Schema
const faqData = [
  {
    question: "Comment réduire mon impôt sur le revenu en 2025 ?",
    answer: "Notre simulateur d'impôt analyse votre Tranche Marginale d'Imposition (TMI) et vous propose automatiquement les meilleures niches fiscales (PER, Girardin Industriel, Pinel) adaptées à vos revenus pour réduire votre note fiscale."
  },
  {
    question: "L'application est-elle vraiment gratuite ?",
    answer: "Oui. L'accès aux outils essentiels (Capacité d'épargne, Calculateur inflation, Simulateur IR basique, Académie) est 100% gratuit. Nous proposons des formules Premium et Expert pour accéder à des simulateurs avancés et des fonctionnalités IA."
  },
  {
    question: "Mes données sont-elles en sécurité ?",
    answer: "Absolument. Nous utilisons des protocoles de chiffrement bancaire et nous ne vendons jamais vos données. Toutes les données sont stockées de manière sécurisée sur des serveurs européens conformes au RGPD."
  },
  {
    question: "Qu'est-ce que la méthode FIRE ?",
    answer: "FIRE (Financial Independence, Retire Early) est une méthode visant la liberté financière. Notre calculateur vous aide à définir le montant d'épargne nécessaire pour arrêter de travailler plus tôt."
  },
  {
    question: "Quels outils sont gratuits ?",
    answer: "Les outils gratuits incluent : le Calculateur d'épargne mensuelle, le Calculateur d'inflation, le Simulateur IR basique (sans optimisation), et l'accès complet à l'Académie Financière avec 13 fiches produits éducatives."
  },
  {
    question: "Comment fonctionne le conseiller IA ?",
    answer: "Notre conseiller IA Expert vous permet de décrire vos objectifs financiers en langage naturel (achat immobilier, retraite, éducation enfants). L'IA analyse votre situation et génère une allocation d'actifs personnalisée avec un plan d'action concret."
  }
];

// Hook to inject FAQPage JSON-LD schema
const useFaqSchema = () => {
  useEffect(() => {
    const schema = {
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
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'faq-schema';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => {
      const existingScript = document.getElementById('faq-schema');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);
};

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

// FAQ Accordion Component
const FaqItem = ({ question, answer }: { question: string; answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-border last:border-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full py-4 text-left group"
      >
        <span className="text-lg font-medium text-foreground group-hover:text-primary transition-colors">
          {question}
        </span>
        {isOpen ? <Minus className="w-5 h-5 text-primary" /> : <Plus className="w-5 h-5 text-muted-foreground" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="pb-4 text-muted-foreground leading-relaxed">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
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
    color: "border-amber-400/50 bg-amber-50",
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
    color: "border-violet-400/50 bg-violet-50",
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
    description: "Explications simples, graphiques clairs, scénarios concrets.",
    tagline: "Comprendre avant d'agir."
  },
  {
    icon: Brain,
    title: "Propulsé par l'IA",
    description: "Analyse personnalisée, recommandations intelligentes.",
    tagline: "Vous êtes guidé pas à pas."
  },
  {
    icon: Target,
    title: "Axé sur vos objectifs",
    description: "Projets concrets : achat immobilier, retraite, éducation.",
    tagline: "Une approche goal-based réellement utile."
  }
];

// Popular tools data
const popularTools = [
  {
    id: "bilan-ia",
    name: "Bilan Patrimonial IA",
    description: "Analyse complète de votre situation financière avec recommandations personnalisées et plan d'action sur 12 mois.",
    features: ["Analyse 5 piliers", "Recommandations IA", "Export PDF"],
    tier: "expert",
    route: "/tools/bilan-patrimonial"
  },
  {
    id: "simulateur-ir",
    name: "Simulateur IR 2025",
    description: "Calculez votre TMI, optimisez avec PER et Girardin, et visualisez vos économies fiscales immédiates.",
    features: ["Calcul TMI exact", "Optimisation fiscale", "Barème 2025"],
    tier: "premium",
    route: "/simulateur-impot"
  },
  {
    id: "simulateur-immo",
    name: "Simulateur Immobilier",
    description: "Mensualités, capacité d'emprunt, et coût total du crédit avec les taux du marché actualisés.",
    features: ["Mensualités", "Capacité d'emprunt", "Coût total"],
    tier: "premium",
    route: "/tools/simulateur-immobilier"
  }
];

export default function Landing() {
  const navigate = useNavigate();
  const [isAnnual, setIsAnnual] = useState(false);
  
  // Inject FAQPage schema for SEO
  useFaqSchema();

  const featuredProducts = financialProducts.filter(p => 
    ["per", "assurance-vie", "girardin"].includes(p.id)
  );

  const scrollToTools = () => {
    document.getElementById('tools-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-card">
      {/* Navigation Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border"
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={eclatLogo} alt="Éclat logo" className="w-8 h-8" />
            <span className="text-xl font-bold text-foreground">Éclat Toolkit</span>
          </div>
          <div className="flex items-center gap-3">
            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
              <Button 
                variant="ghost" 
                onClick={() => navigate("/pricing")}
                className="text-muted-foreground hover:text-foreground font-medium hidden sm:inline-flex"
              >
                Tarifs
              </Button>
            </motion.div>
            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
              <Button 
                variant="ghost" 
                onClick={() => navigate("/blog")}
                className="text-muted-foreground hover:text-foreground font-medium hidden sm:inline-flex"
              >
                Blog
              </Button>
            </motion.div>
            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
              <Button 
                variant="ghost" 
                onClick={() => navigate("/auth")}
                className="text-muted-foreground hover:text-foreground font-medium"
              >
                Se connecter
              </Button>
            </motion.div>
            <motion.div whileHover={{ y: -2, boxShadow: "0 8px 30px rgba(0,0,0,0.12)" }} whileTap={{ scale: 0.98 }}>
              <Button 
                onClick={() => navigate("/auth")}
                className="bg-foreground hover:bg-foreground/90 text-card rounded-full px-6"
              >
                S'inscrire
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <div className="space-y-8">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="text-5xl lg:text-6xl font-bold text-foreground leading-[1.1] tracking-tight"
              >
                Votre boîte à outils patrimoniale.{" "}
                <span className="text-primary">Simple. Intelligente.</span>
              </motion.h1>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                className="text-xl text-muted-foreground leading-relaxed max-w-lg font-normal"
              >
                Éclat Toolkit vous aide à <strong className="text-foreground">comprendre votre situation financière</strong>, 
                calculer vos impôts, optimiser vos investissements et prendre de meilleures décisions — <strong className="text-foreground">sans jargon</strong>.
              </motion.h2>
              
              {/* Benefit Badges */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
                className="flex flex-wrap gap-3"
              >
                <div className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
                  <Brain className="w-4 h-4" />
                  <span>Analyse IA personnalisée</span>
                </div>
                <div className="flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium">
                  <Calculator className="w-4 h-4" />
                  <span>Simulateurs puissants</span>
                </div>
                <div className="flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-2 rounded-full text-sm font-medium">
                  <Target className="w-4 h-4" />
                  <span>Objectifs concrets</span>
                </div>
              </motion.div>

              {/* CTAs */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <motion.div 
                  whileHover={{ y: -2, boxShadow: "0 12px 40px hsl(var(--primary) / 0.35)" }} 
                  whileTap={{ scale: 0.98 }}
                >
                  <Button 
                    size="lg"
                    onClick={() => navigate("/auth")}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 py-6 text-lg font-semibold shadow-lg"
                  >
                    Essayer gratuitement
                    <ChevronRight className="ml-2 w-5 h-5" />
                  </Button>
                </motion.div>
                <motion.div 
                  whileHover={{ y: -2 }} 
                  whileTap={{ scale: 0.98 }}
                >
                  <Button 
                    size="lg"
                    variant="outline"
                    onClick={scrollToTools}
                    className="rounded-full px-8 py-6 text-lg font-medium border-border"
                  >
                    Voir les outils
                  </Button>
                </motion.div>
              </motion.div>

              {/* Trust Badges */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
                className="flex items-center gap-6 pt-4 text-sm text-muted-foreground"
              >
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-500" />
                  <span>Données chiffrées</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Outils gratuits</span>
                </div>
              </motion.div>
            </div>

            {/* Right: Dashboard Preview */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
              className="relative"
            >
              <div className="relative transform lg:rotate-2 lg:translate-x-8">
                {/* Browser Frame */}
                <motion.div 
                  whileHover={{ rotate: 0, scale: 1.02 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="bg-foreground rounded-2xl p-2 shadow-2xl"
                >
                  {/* Browser Header */}
                  <div className="flex items-center gap-2 px-4 py-2">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                    <div className="flex-1 mx-4">
                      <div className="bg-muted-foreground/30 rounded-lg px-4 py-1.5 text-xs text-muted-foreground text-center">
                        app.eclat-toolkit.fr
                      </div>
                    </div>
                  </div>
                  {/* Screen Content */}
                  <div className="bg-background rounded-xl overflow-hidden aspect-[16/10]">
                    <div className="p-6 space-y-4">
                      {/* Mock KPIs */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-card rounded-xl p-4 shadow-sm">
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Patrimoine Total</p>
                          <p className="text-lg font-bold text-foreground">247 500 €</p>
                          <p className="text-[10px] text-emerald-600">+12.4%</p>
                        </div>
                        <div className="bg-card rounded-xl p-4 shadow-sm">
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Économies fiscales</p>
                          <p className="text-lg font-bold text-primary">4 820 €</p>
                          <p className="text-[10px] text-muted-foreground">Cette année</p>
                        </div>
                      </div>
                      {/* Mock Chart */}
                      <div className="bg-card rounded-xl p-4 shadow-sm">
                        <p className="text-[10px] text-muted-foreground mb-3">Évolution du patrimoine</p>
                        <div className="h-20 flex items-end gap-1">
                          {[40, 55, 45, 60, 52, 70, 65, 80, 75, 90, 85, 100].map((h, i) => (
                            <motion.div 
                              key={i} 
                              initial={{ height: 0 }}
                              animate={{ height: `${h}%` }}
                              transition={{ duration: 0.5, delay: 0.8 + i * 0.05, ease: "easeOut" }}
                              className="flex-1 bg-gradient-to-t from-primary to-emerald-400 rounded-t-sm"
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
                {/* Floating Badge */}
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 1, ease: "easeOut" }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="absolute -bottom-4 -left-4 bg-card rounded-2xl p-4 shadow-xl border border-border"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Objectif FIRE</p>
                      <p className="text-sm font-bold text-foreground">68% atteint</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Tools by Tier Section */}
      <section id="tools-section" className="py-20 px-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUpVariant}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Une suite d'outils conçue pour vous donner de la clarté
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choisissez la formule qui correspond à vos besoins patrimoniaux.
            </p>
          </motion.div>

          {/* Tier Cards */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-6 mb-12"
          >
            {/* Free Tier */}
            <motion.div 
              variants={fadeUpVariant}
              transition={{ duration: 0.5, ease: "easeOut" }}
              whileHover={{ scale: 1.02, y: -4 }}
              className={`bg-card rounded-3xl p-8 border-2 ${tierData.free.color}`}
            >
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-6 ${tierData.free.badgeColor}`}>
                <Sparkles className="w-4 h-4" />
                {tierData.free.name}
              </div>
              <div className="mb-6">
                <span className="text-4xl font-bold text-foreground">0€</span>
                <span className="text-muted-foreground ml-2">pour toujours</span>
              </div>
              <ul className="space-y-3">
                {tierData.free.tools.map((tool, i) => (
                  <li key={i} className="flex items-center gap-3 text-foreground">
                    <tool.icon className="w-5 h-5 text-primary" />
                    <span>{tool.name}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Premium Tier */}
            <motion.div 
              variants={fadeUpVariant}
              transition={{ duration: 0.5, ease: "easeOut" }}
              whileHover={{ scale: 1.02, y: -4 }}
              className={`bg-card rounded-3xl p-8 border-2 ${tierData.premium.color} relative`}
            >
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-6 ${tierData.premium.badgeColor}`}>
                <Crown className="w-4 h-4" />
                {tierData.premium.name}
              </div>
              <div className="mb-6">
                <span className="text-4xl font-bold text-foreground">{tierData.premium.price?.split('/')[0]}</span>
                <span className="text-muted-foreground ml-2">/mois</span>
              </div>
              <ul className="space-y-3">
                {tierData.premium.tools.map((tool, i) => (
                  <li key={i} className="flex items-center gap-3 text-foreground">
                    <tool.icon className="w-5 h-5 text-amber-600" />
                    <span>{tool.name}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Expert Tier */}
            <motion.div 
              variants={fadeUpVariant}
              transition={{ duration: 0.5, ease: "easeOut" }}
              whileHover={{ scale: 1.02, y: -4 }}
              className={`bg-card rounded-3xl p-8 border-2 ${tierData.expert.color} relative`}
            >
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-6 ${tierData.expert.badgeColor}`}>
                <Zap className="w-4 h-4" />
                {tierData.expert.name}
              </div>
              <div className="mb-6">
                <span className="text-4xl font-bold text-foreground">{tierData.expert.price?.split('/')[0]}</span>
                <span className="text-muted-foreground ml-2">/mois</span>
              </div>
              <ul className="space-y-3">
                {tierData.expert.tools.map((tool, i) => (
                  <li key={i} className="flex items-center gap-3 text-foreground">
                    <tool.icon className="w-5 h-5 text-violet-600" />
                    <span>{tool.name}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUpVariant}
            transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
            className="text-center"
          >
            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
              <Button 
                variant="outline"
                size="lg"
                onClick={() => navigate("/pricing")}
                className="rounded-full px-8 border-border"
              >
                Voir tous les tarifs
                <ChevronRight className="ml-2 w-4 h-4" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-6 bg-muted/50">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUpVariant}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Votre patrimoine expliqué avec pédagogie
            </h2>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8"
          >
            {valuesData.map((value, i) => (
              <motion.div 
                key={i}
                variants={fadeUpVariant}
                transition={{ duration: 0.5, ease: "easeOut" }}
                whileHover={{ y: -4 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <value.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{value.title}</h3>
                <p className="text-muted-foreground mb-4">{value.description}</p>
                <p className="text-sm font-medium text-primary italic">{value.tagline}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Popular Tools Section */}
      <section className="py-20 px-6 bg-card">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUpVariant}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Les outils les plus appréciés
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Découvrez nos simulateurs phares utilisés par des milliers d'investisseurs.
            </p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="space-y-6"
          >
            {popularTools.map((tool, i) => (
              <motion.div 
                key={tool.id}
                variants={fadeUpVariant}
                transition={{ duration: 0.5, ease: "easeOut" }}
                whileHover={{ scale: 1.01, y: -2 }}
                onClick={() => navigate(tool.route)}
                className="bg-background rounded-3xl p-8 border border-border cursor-pointer hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-2xl font-bold text-foreground">{tool.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        tool.tier === 'expert' 
                          ? 'bg-violet-100 text-violet-700' 
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {tool.tier === 'expert' ? 'Expert' : 'Premium'}
                      </span>
                    </div>
                    <p className="text-muted-foreground mb-4">{tool.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {tool.features.map((feature, j) => (
                        <span key={j} className="flex items-center gap-1 text-sm text-foreground bg-muted px-3 py-1 rounded-full">
                          <Check className="w-3 h-3 text-emerald-500" />
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Button 
                      className="rounded-full px-6"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(tool.route);
                      }}
                    >
                      Essayer
                      <ChevronRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Academy Teaser Section */}
      <section className="py-20 px-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUpVariant}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Investissez mieux, parce que vous comprenez mieux.
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Notre Académie vous guide à travers les solutions patrimoniales, sans jargon financier.
            </p>
          </motion.div>

          {/* Product Cards */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-6 mb-12"
          >
            {featuredProducts.map((product) => (
              <motion.div
                key={product.id}
                variants={scaleUpVariant}
                transition={{ duration: 0.5, ease: "easeOut" }}
                whileHover={{ scale: 1.02, y: -4 }}
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
            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
              <Button 
                variant="outline"
                size="lg"
                onClick={() => navigate("/academie")}
                className="rounded-full px-8 border-border"
              >
                Découvrir l'Académie complète
                <ChevronRight className="ml-2 w-4 h-4" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Section (Simplified) */}
      <section className="py-20 px-6 bg-muted/50">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUpVariant}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Choisissez votre formule
            </h2>
            
            {/* Toggle */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <span className={`text-sm font-medium ${!isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>Mensuel</span>
              <button 
                onClick={() => setIsAnnual(!isAnnual)}
                className={`relative w-14 h-7 rounded-full transition-colors ${isAnnual ? 'bg-primary' : 'bg-border'}`}
              >
                <div className={`absolute top-1 w-5 h-5 bg-card rounded-full shadow transition-transform ${isAnnual ? 'translate-x-8' : 'translate-x-1'}`} />
              </button>
              <span className={`text-sm font-medium ${isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>
                Annuel
                <span className="ml-2 text-emerald-600 font-semibold">-30%</span>
              </span>
            </div>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-6"
          >
            {/* Free */}
            <motion.div 
              variants={fadeUpVariant}
              transition={{ duration: 0.5, ease: "easeOut" }}
              whileHover={{ y: -4 }}
              className="bg-card rounded-2xl p-6 border border-border text-center"
            >
              <h3 className="text-lg font-bold text-foreground mb-2">Gratuit</h3>
              <div className="text-3xl font-bold text-foreground mb-4">0€</div>
              <p className="text-sm text-muted-foreground mb-6">4 outils essentiels</p>
              <Button 
                variant="outline" 
                className="w-full rounded-full"
                onClick={() => navigate("/auth")}
              >
                Commencer
              </Button>
            </motion.div>

            {/* Premium */}
            <motion.div 
              variants={fadeUpVariant}
              transition={{ duration: 0.5, ease: "easeOut" }}
              whileHover={{ y: -4 }}
              className="bg-card rounded-2xl p-6 border-2 border-amber-400 text-center relative"
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-900 text-xs font-bold px-3 py-1 rounded-full">
                POPULAIRE
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">Premium</h3>
              <div className="text-3xl font-bold text-foreground mb-4">
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
            </motion.div>

            {/* Expert */}
            <motion.div 
              variants={fadeUpVariant}
              transition={{ duration: 0.5, ease: "easeOut" }}
              whileHover={{ y: -4 }}
              className="bg-card rounded-2xl p-6 border-2 border-violet-400 text-center"
            >
              <h3 className="text-lg font-bold text-foreground mb-2">Expert</h3>
              <div className="text-3xl font-bold text-foreground mb-4">
                {isAnnual ? '149,99€' : '14,99€'}
                <span className="text-base font-normal text-muted-foreground">/{isAnnual ? 'an' : 'mois'}</span>
              </div>
              <p className="text-sm text-muted-foreground mb-6">IA + Patrimoine</p>
              <Button 
                className="w-full rounded-full bg-violet-500 hover:bg-violet-600 text-white"
                onClick={() => navigate("/auth")}
              >
                S'abonner
              </Button>
            </motion.div>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUpVariant}
            transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
            className="text-center mt-8"
          >
            <button 
              onClick={() => navigate("/pricing")}
              className="text-primary hover:underline font-medium"
            >
              Comparer en détail →
            </button>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6 bg-card border-t border-border">
        <div className="max-w-3xl mx-auto">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUpVariant}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">Questions Fréquentes</h2>
          </motion.div>
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUpVariant}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="space-y-2"
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

      {/* CTA Section */}
      <section className="py-20 px-6 bg-foreground">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUpVariant}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-card mb-6">
            Prêt à éclairer votre patrimoine ?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Créez votre compte gratuitement et accédez à tous nos simulateurs.
          </p>
          <motion.div 
            whileHover={{ y: -2, boxShadow: "0 12px 40px hsl(var(--primary) / 0.4)" }} 
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              size="lg"
              onClick={() => navigate("/auth")}
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-10 py-6 text-lg font-semibold"
            >
              Commencer maintenant
              <ChevronRight className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="py-12 px-6 bg-card border-t border-border"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">É</span>
              </div>
              <span className="text-lg font-bold text-foreground">Éclat Toolkit</span>
            </div>
            <div className="flex items-center gap-8 text-sm text-muted-foreground">
              <button onClick={() => navigate("/mentions-legales")} className="hover:text-foreground transition-colors">Mentions Légales</button>
              <button onClick={() => navigate("/confidentialite")} className="hover:text-foreground transition-colors">Confidentialité</button>
              <button onClick={() => navigate("/cgu")} className="hover:text-foreground transition-colors">CGU</button>
              <a href="mailto:contact@eclat-gp.com" className="hover:text-foreground transition-colors">Contact</a>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 Éclat Gestion Privée. Tous droits réservés.
            </p>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
