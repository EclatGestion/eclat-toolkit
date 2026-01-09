import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/seo/SEO";
import { AnimatedUnderline } from "@/components/ui/animated-underline";
import { useState } from "react";
import eclat from "@/assets/eclat-logo.png";
import {
  ChevronDown,
  Sparkles,
  ArrowRight,
  Calculator,
  PieChart,
  TrendingUp,
  Target,
  Check,
  Star,
  Quote,
  Shield,
  BadgeCheck,
  Lock,
  Zap,
  Award,
} from "lucide-react";

// Animation variants
const fadeUpVariant = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

// FAQ Data
const faqData = [
  {
    question: "Quels outils sont gratuits ?",
    answer:
      "Le Simulateur IR 2025, le Simulateur Immobilier, et le calculateur d'intérêts composés sont entièrement gratuits. Les outils Premium et Expert nécessitent un abonnement.",
  },
  {
    question: "Comment fonctionne le conseiller IA ?",
    answer:
      "Notre IA analyse votre situation patrimoniale, vos objectifs et votre horizon temporel pour générer des recommandations personnalisées et optimiser votre stratégie.",
  },
  {
    question: "Mes données sont-elles sécurisées ?",
    answer:
      "Vos données sont chiffrées de bout en bout, stockées en France, et conformes au RGPD. Nous ne partageons jamais vos informations.",
  },
  {
    question: "Puis-je annuler mon abonnement ?",
    answer:
      "Oui, vous pouvez annuler à tout moment depuis vos paramètres. Votre accès reste actif jusqu'à la fin de la période payée.",
  },
];

// Services data
const services = [
  { badge: "Visualisation", title: "Bilan Patrimonial IA", description: "Analyse complète avec recommandations IA personnalisées.", href: "/app/tools/bilan-patrimonial", icon: PieChart, accentColor: "primary" as const },
  { badge: "Fiscalité", title: "Simulateur IR 2025", description: "Calculez votre impôt avec le barème officiel 2025.", href: "/simulateur-ir", icon: Calculator, accentColor: "accent" as const },
  { badge: "Optimisation", title: "Plan Épargne Retraite", description: "Maximisez vos économies d'impôts avec le PER.", href: "/app/tools/per", icon: TrendingUp, accentColor: "primary" as const },
  { badge: "Objectifs", title: "Conseiller IA Goal-Based", description: "L'IA construit votre plan d'investissement.", href: "/app/tools/goal-based", icon: Target, accentColor: "accent" as const },
];

// Testimonials
const testimonials = [
  { quote: "Grâce au bilan patrimonial IA, j'ai découvert 3 240€ d'économies fiscales.", author: "Thomas D.", role: "Entrepreneur, 42 ans" },
  { quote: "L'interface est magnifique et les simulateurs sont d'une précision remarquable.", author: "Marie L.", role: "Cadre supérieure, 38 ans" },
  { quote: "Le conseiller IA m'a aidé à structurer mon plan FIRE.", author: "Alexandre P.", role: "Développeur, 35 ans" },
];

// Pricing tiers
const pricingTiers = [
  { name: "Gratuit", price: "0€", description: "Pour découvrir", features: ["Simulateur IR 2025", "Simulateur Immobilier", "Intérêts composés", "Capacité d'épargne"], cta: "Commencer", href: "/auth", variant: "outline" as const },
  { name: "Premium", price: "9€", period: "/mois", description: "Le plus populaire", features: ["Tous les outils gratuits", "Bilan Patrimonial IA", "Optimisation PER", "Assurance-vie", "Simulateur Succession", "Tableau de bord"], cta: "Essayer Premium", href: "/auth", variant: "glow" as const, popular: true },
  { name: "Expert", price: "19€", period: "/mois", description: "Pour les passionnés", features: ["Tous les outils Premium", "Conseiller IA Goal-Based", "Analyse d'actions", "Comparateur LMNP", "Support prioritaire"], cta: "Devenir Expert", href: "/auth", variant: "premium" as const },
];

// Badges for marquee
const badges = [
  { icon: Shield, label: "RGPD Compliant" },
  { icon: BadgeCheck, label: "Made in France" },
  { icon: Sparkles, label: "Propulsé par IA" },
  { icon: Lock, label: "Données sécurisées" },
  { icon: Zap, label: "Temps réel" },
  { icon: Award, label: "Conseils experts" },
];

// Floating cards data
const floatingCards = [
  { id: 1, title: "Patrimoine", value: "247 500 €", change: "+12.4%", position: "top-8 right-0 lg:right-12", delay: 0.4 },
  { id: 2, title: "Objectif FIRE", value: "68%", subtitle: "En bonne voie", position: "top-48 -left-8 lg:left-0", delay: 0.6 },
  { id: 3, title: "Économie fiscale", value: "-3 240 €", subtitle: "Cette année", position: "bottom-8 right-8 lg:right-24", delay: 0.8 },
];

// FAQ Item component
const FaqItem = ({ question, answer, index }: { question: string; answer: string; index: number }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="border-b border-border/50 last:border-0">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between py-6 text-left group">
        <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">{question}</h3>
        <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
            <p className="pb-6 text-muted-foreground leading-relaxed">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const Landing = () => {
  const navigate = useNavigate();
  const [isAnnual, setIsAnnual] = useState(true);

  const landingJsonLd = [{ "@context": "https://schema.org", "@type": "SoftwareApplication", name: "Éclat Toolkit", applicationCategory: "FinanceApplication", operatingSystem: "Web", offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" }, description: "Boîte à outils patrimoniale propulsée par l'IA." }];

  return (
    <>
      <SEO title="Éclat Toolkit | Votre boîte à outils patrimoniale intelligente" description="Simulateurs financiers, bilan patrimonial IA et conseils personnalisés pour optimiser votre patrimoine." canonical="https://eclat-toolkit.lovable.app/" jsonLd={landingJsonLd} />

      <div className="min-h-screen bg-background overflow-hidden">
        {/* Animated Background Blobs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute w-[600px] h-[600px] top-[-200px] right-[-100px] bg-primary/5 rounded-full blur-3xl animate-blob" />
          <div className="absolute w-[400px] h-[400px] bottom-[-100px] left-[-50px] bg-accent/5 rounded-full blur-3xl animate-blob" style={{ animationDelay: "2s" }} />
          <div className="absolute w-[300px] h-[300px] top-[40%] left-[30%] bg-primary/3 rounded-full blur-3xl animate-blob" style={{ animationDelay: "4s" }} />
        </div>

        {/* Header */}
        <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link to="/" className="flex items-center gap-2">
                <img src={eclat} alt="Éclat" className="w-8 h-8" />
                <span className="font-bold text-lg text-foreground">Éclat</span>
              </Link>
              <nav className="hidden md:flex items-center gap-8">
                <Link to="/simulateur-ir" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Simulateur IR</Link>
                <Link to="/diagnostic" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Diagnostic</Link>
                <Link to="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Tarifs</Link>
                <Link to="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Blog</Link>
              </nav>
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" asChild><Link to="/auth">Connexion</Link></Button>
                <Button variant="premium" size="sm" asChild><Link to="/auth">Essai gratuit <ArrowRight className="w-4 h-4 ml-1" /></Link></Button>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center pt-16">
          <div className="container mx-auto px-4 lg:px-8 py-20 lg:py-32">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
              <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="max-w-2xl">
                <motion.div variants={fadeUpVariant}>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border border-primary/20 text-primary text-sm font-medium relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" style={{ backgroundSize: "200% 100%" }} />
                    <Sparkles className="w-4 h-4 relative z-10" />
                    <span className="relative z-10">Gestion de patrimoine intelligente</span>
                  </div>
                </motion.div>
                <motion.h1 variants={fadeUpVariant} className="mt-8 text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground leading-[1.1] tracking-tight">
                  Prenez le contrôle de votre <AnimatedUnderline>liberté financière</AnimatedUnderline>
                </motion.h1>
                <motion.p variants={fadeUpVariant} className="mt-6 text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-xl">
                  Simulateurs précis, bilan patrimonial IA et recommandations personnalisées pour optimiser votre patrimoine.
                </motion.p>
                <motion.div variants={fadeUpVariant} className="mt-10 flex flex-col sm:flex-row gap-4">
                  <Button variant="glow" size="xl" onClick={() => navigate("/auth")} className="group">
                    Commencer gratuitement <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <Button variant="outline" size="xl" onClick={() => navigate("/simulateur-ir")}>Essayer le simulateur IR</Button>
                </motion.div>
                <motion.div variants={fadeUpVariant} className="mt-10 flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2"><Check className="w-4 h-4 text-success" /><span>Gratuit</span></div>
                  <div className="flex items-center gap-2"><Check className="w-4 h-4 text-success" /><span>Sécurisé</span></div>
                  <div className="flex items-center gap-2"><Check className="w-4 h-4 text-success" /><span>Sans engagement</span></div>
                </motion.div>
              </motion.div>

              {/* Floating Cards */}
              <div className="hidden lg:block relative w-full h-[500px]">
                {floatingCards.map((card) => (
                  <motion.div key={card.id} initial={{ opacity: 0, y: 40, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.8, delay: card.delay, ease: [0.16, 1, 0.3, 1] }} className={`absolute ${card.position}`}>
                    <div className="animate-float p-5 min-w-[180px] rounded-2xl bg-card/90 backdrop-blur-sm border border-border/50 shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300">
                      <span className="text-xs text-muted-foreground font-medium">{card.title}</span>
                      <p className="text-xl font-bold text-foreground mt-1">{card.value}</p>
                      {card.change && <span className="text-xs text-success font-medium flex items-center gap-0.5"><TrendingUp className="w-3 h-3" />{card.change}</span>}
                      {card.subtitle && <span className="text-xs text-muted-foreground">{card.subtitle}</span>}
                    </div>
                  </motion.div>
                ))}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border border-primary/10 animate-pulse-soft" />
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full border border-primary/5 animate-pulse-soft" style={{ animationDelay: "1s" }} />
              </div>
            </div>
          </div>
        </section>

        {/* Logo Marquee */}
        <div className="relative w-full overflow-hidden py-8 bg-gradient-to-r from-muted/50 via-muted/30 to-muted/50">
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />
          <div className="flex animate-marquee">
            {[...badges, ...badges, ...badges, ...badges].map((badge, index) => (
              <div key={index} className="flex items-center gap-2 mx-8 text-muted-foreground/70 hover:text-primary transition-colors whitespace-nowrap">
                <badge.icon className="w-5 h-5" />
                <span className="text-sm font-medium">{badge.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Services Section */}
        <section className="py-24 lg:py-32 bg-background">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
              <span className="text-sm font-semibold text-primary uppercase tracking-wider">Nos outils</span>
              <h2 className="mt-4 text-3xl lg:text-5xl font-bold text-foreground">Expertise patrimoniale, <span className="text-primary">accessible</span></h2>
            </motion.div>
            <div className="max-w-5xl mx-auto">
              {services.map((service, index) => (
                <motion.div key={service.title} initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: index * 0.1 }}>
                  <Link to={service.href} className="group flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-8 py-8 border-b border-border/50 hover:border-primary/30 transition-colors duration-500">
                    <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider ${service.accentColor === "primary" ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"}`}>
                      <service.icon className="w-3.5 h-3.5" />{service.badge}
                    </span>
                    <h3 className="flex-1 text-2xl lg:text-3xl font-bold text-foreground group-hover:text-primary transition-colors">{service.title}</h3>
                    <p className="flex-1 text-muted-foreground text-sm lg:text-base max-w-md">{service.description}</p>
                    <div className="flex-shrink-0 flex items-center gap-2 text-primary opacity-0 group-hover:opacity-100 translate-x-0 group-hover:translate-x-2 transition-all">
                      <span className="text-sm font-medium">Découvrir</span><ArrowRight className="w-4 h-4" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-24 lg:py-32 bg-muted/30">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
              <span className="text-sm font-semibold text-primary uppercase tracking-wider">Témoignages</span>
              <h2 className="mt-4 text-3xl lg:text-5xl font-bold text-foreground">Ils nous font <span className="text-primary">confiance</span></h2>
            </motion.div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {testimonials.map((t, index) => (
                <motion.div key={t.author} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.15 }} className="group relative p-8 rounded-3xl bg-card border border-border/50 hover:border-primary/20 hover:shadow-xl transition-all duration-500">
                  <div className="absolute -top-4 left-8"><div className="p-3 rounded-2xl bg-primary/10 group-hover:bg-primary/20 transition-colors"><Quote className="w-5 h-5 text-primary" /></div></div>
                  <p className="mt-4 text-foreground/80 text-lg leading-relaxed italic">"{t.quote}"</p>
                  <div className="mt-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center"><span className="text-lg font-bold text-primary">{t.author.charAt(0)}</span></div>
                    <div><p className="font-semibold text-foreground">{t.author}</p><p className="text-sm text-muted-foreground">{t.role}</p></div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-24 lg:py-32 bg-background">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
              <span className="text-sm font-semibold text-primary uppercase tracking-wider">Tarifs</span>
              <h2 className="mt-4 text-3xl lg:text-5xl font-bold text-foreground">Choisissez votre <span className="text-primary">formule</span></h2>
              <div className="mt-8 inline-flex items-center gap-3 p-1.5 rounded-full bg-muted">
                <button onClick={() => setIsAnnual(false)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${!isAnnual ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}>Mensuel</button>
                <button onClick={() => setIsAnnual(true)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${isAnnual ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}>Annuel <span className="text-xs bg-success/20 text-success px-2 py-0.5 rounded-full">-20%</span></button>
              </div>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {pricingTiers.map((tier, index) => (
                <motion.div key={tier.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className={`relative p-8 rounded-3xl border transition-all duration-300 hover:shadow-xl ${tier.popular ? "bg-card border-primary/30 shadow-lg" : "bg-card border-border/50 hover:border-primary/20"}`}>
                  {tier.popular && <div className="absolute -top-4 left-1/2 -translate-x-1/2"><span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-semibold"><Star className="w-3.5 h-3.5" />Populaire</span></div>}
                  <div className="text-center mb-8">
                    <h3 className="text-xl font-bold text-foreground">{tier.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{tier.description}</p>
                    <div className="mt-4"><span className="text-4xl font-bold text-foreground">{tier.price === "0€" ? "0€" : isAnnual ? `${Math.round(parseInt(tier.price) * 0.8)}€` : tier.price}</span>{tier.period && <span className="text-muted-foreground">{tier.period}</span>}</div>
                  </div>
                  <ul className="space-y-3 mb-8">{tier.features.map((f) => <li key={f} className="flex items-center gap-3 text-sm text-muted-foreground"><Check className="w-4 h-4 text-success flex-shrink-0" />{f}</li>)}</ul>
                  <Button variant={tier.variant} className="w-full" asChild><Link to={tier.href}>{tier.cta}</Link></Button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-24 lg:py-32 bg-muted/30">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
              <span className="text-sm font-semibold text-primary uppercase tracking-wider">FAQ</span>
              <h2 className="mt-4 text-3xl lg:text-5xl font-bold text-foreground">Questions <span className="text-primary">fréquentes</span></h2>
            </motion.div>
            <div className="max-w-3xl mx-auto">{faqData.map((faq, index) => <FaqItem key={faq.question} question={faq.question} answer={faq.answer} index={index} />)}</div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="relative py-24 lg:py-32 bg-foreground overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute w-[500px] h-[500px] top-[-150px] right-[-100px] bg-primary/10 rounded-full blur-3xl animate-blob" />
            <div className="absolute w-[350px] h-[350px] bottom-[-80px] left-[-50px] bg-accent/10 rounded-full blur-3xl animate-blob" style={{ animationDelay: "2s" }} />
          </div>
          <div className="container mx-auto px-4 lg:px-8 relative z-10">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl lg:text-5xl font-bold text-background leading-tight">Prêt à optimiser votre <span className="text-primary">patrimoine</span> ?</h2>
              <p className="mt-6 text-lg text-background/70">Rejoignez des centaines d'utilisateurs qui ont déjà pris le contrôle de leur liberté financière.</p>
              <div className="mt-10"><Button variant="glow" size="xl" onClick={() => navigate("/auth")} className="group">Créer mon compte gratuit <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" /></Button></div>
              <p className="mt-6 text-sm text-background/50">Gratuit • Sans engagement • <Link to="/pricing" className="underline hover:text-primary">Voir les tarifs</Link></p>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-16 bg-background border-t border-border/50">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid md:grid-cols-4 gap-12">
              <div><Link to="/" className="flex items-center gap-2 mb-4"><img src={eclat} alt="Éclat" className="w-8 h-8" /><span className="font-bold text-lg text-foreground">Éclat Toolkit</span></Link><p className="text-sm text-muted-foreground">Votre boîte à outils patrimoniale intelligente.</p></div>
              <div><h4 className="font-semibold text-foreground mb-4">Outils</h4><ul className="space-y-2"><li><Link to="/simulateur-ir" className="text-sm text-muted-foreground hover:text-primary transition-colors">Simulateur IR 2025</Link></li><li><Link to="/diagnostic" className="text-sm text-muted-foreground hover:text-primary transition-colors">Diagnostic Patrimonial</Link></li><li><Link to="/pricing" className="text-sm text-muted-foreground hover:text-primary transition-colors">Tous les outils</Link></li></ul></div>
              <div><h4 className="font-semibold text-foreground mb-4">Ressources</h4><ul className="space-y-2"><li><Link to="/blog" className="text-sm text-muted-foreground hover:text-primary transition-colors">Blog</Link></li><li><Link to="/academie" className="text-sm text-muted-foreground hover:text-primary transition-colors">Académie Pro</Link></li><li><Link to="/pricing" className="text-sm text-muted-foreground hover:text-primary transition-colors">Tarifs</Link></li></ul></div>
              <div><h4 className="font-semibold text-foreground mb-4">Légal</h4><ul className="space-y-2"><li><Link to="/mentions-legales" className="text-sm text-muted-foreground hover:text-primary transition-colors">Mentions légales</Link></li><li><Link to="/confidentialite" className="text-sm text-muted-foreground hover:text-primary transition-colors">Confidentialité</Link></li><li><Link to="/cgu" className="text-sm text-muted-foreground hover:text-primary transition-colors">CGU</Link></li></ul></div>
            </div>
            <div className="mt-12 pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Éclat Toolkit. Tous droits réservés.</p>
              <span className="text-sm text-muted-foreground">Made with ❤️ in France</span>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Landing;
