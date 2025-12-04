import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, TrendingUp, Calculator, Sparkles, ChevronRight, Plus, Minus } from "lucide-react";
import { financialProducts } from "@/data/financialProducts";
import { ProductCard } from "@/components/academy/ProductCard";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

// FAQ Data for both UI and Schema
const faqData = [
  {
    question: "Comment réduire mon impôt sur le revenu en 2025 ?",
    answer: "Notre simulateur d'impôt analyse votre Tranche Marginale d'Imposition (TMI) et vous propose automatiquement les meilleures niches fiscales (PER, Girardin Industriel, Pinel) adaptées à vos revenus pour réduire votre note fiscale."
  },
  {
    question: "L'application est-elle vraiment gratuite ?",
    answer: "Oui. L'accès aux simulateurs (Impôt, Succession, Intérêts composés) et au tableau de bord manuel est 100% gratuit. Nous proposons des services premium pour l'accompagnement personnalisé."
  },
  {
    question: "Mes données bancaires sont-elles en sécurité ?",
    answer: "Absolument. Nous utilisons des protocoles de chiffrement bancaire et nous ne vendons jamais vos données. L'agrégation est gérée par des partenaires agréés par l'ACPR (Banque de France)."
  },
  {
    question: "Qu'est-ce que la méthode FIRE ?",
    answer: "FIRE (Financial Independence, Retire Early) est une méthode visant la liberté financière. Notre calculateur vous aide à définir le montant d'épargne nécessaire pour arrêter de travailler plus tôt."
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

// FAQ Accordion Component (SEO Goldmine)
const FaqItem = ({ question, answer }: { question: string; answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full py-4 text-left group"
      >
        <span className="text-lg font-medium text-gray-900 group-hover:text-[#2D60FF] transition-colors">
          {question}
        </span>
        {isOpen ? <Minus className="w-5 h-5 text-[#2D60FF]" /> : <Plus className="w-5 h-5 text-gray-400" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="pb-4 text-gray-600 leading-relaxed">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function Landing() {
  const navigate = useNavigate();
  
  // Inject FAQPage schema for SEO
  useFaqSchema();

  const featuredProducts = financialProducts.filter(p => 
    ["per", "assurance-vie", "girardin"].includes(p.id)
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100"
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#2D60FF] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">É</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Éclat Toolkit</span>
          </div>
          <div className="flex items-center gap-3">
            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
              <Button 
                variant="ghost" 
                onClick={() => navigate("/blog")}
                className="text-gray-600 hover:text-gray-900 font-medium hidden sm:inline-flex"
              >
                Blog
              </Button>
            </motion.div>
            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
              <Button 
                variant="ghost" 
                onClick={() => navigate("/auth")}
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Se connecter
              </Button>
            </motion.div>
            <motion.div whileHover={{ y: -2, boxShadow: "0 8px 30px rgba(0,0,0,0.12)" }} whileTap={{ scale: 0.98 }}>
              <Button 
                onClick={() => navigate("/auth")}
                className="bg-gray-900 hover:bg-gray-800 text-white rounded-full px-6"
              >
                S'inscrire
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Hero Section (SEO Optimized H1/H2) */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <div className="space-y-8">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="text-5xl lg:text-7xl font-bold text-gray-900 leading-[1.1] tracking-tight"
              >
                L'application de{" "}
                <span className="text-[#2D60FF]">Gestion de Patrimoine</span>{" "}
                Intelligente.
              </motion.h1>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                className="text-xl text-gray-600 leading-relaxed max-w-lg font-normal"
              >
                Réalisez votre <strong>bilan patrimonial</strong>, simulez votre{" "}
                <strong>impôt sur le revenu</strong> et préparez votre{" "}
                <strong>retraite</strong>.{" "}
                <strong className="text-gray-900">Gratuitement et sans jargon.</strong>
              </motion.h2>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <motion.div 
                  whileHover={{ y: -2, boxShadow: "0 12px 40px rgba(45,96,255,0.35)" }} 
                  whileTap={{ scale: 0.98 }}
                >
                  <Button 
                    size="lg"
                    onClick={() => navigate("/auth")}
                    className="bg-[#2D60FF] hover:bg-[#2550DD] text-white rounded-full px-8 py-6 text-lg font-semibold shadow-lg shadow-[#2D60FF]/25"
                  >
                    Simuler mes impôts
                    <ChevronRight className="ml-2 w-5 h-5" />
                  </Button>
                </motion.div>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
                className="flex items-center gap-6 pt-4 text-sm text-gray-500"
              >
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-500" />
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
                  className="bg-gray-900 rounded-2xl p-2 shadow-2xl shadow-gray-900/20"
                >
                  {/* Browser Header */}
                  <div className="flex items-center gap-2 px-4 py-2">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                    <div className="flex-1 mx-4">
                      <div className="bg-gray-700 rounded-lg px-4 py-1.5 text-xs text-gray-400 text-center">
                        app.eclat-toolkit.fr
                      </div>
                    </div>
                  </div>
                  {/* Screen Content */}
                  <div className="bg-[#F5F7FA] rounded-xl overflow-hidden aspect-[16/10]">
                    <div className="p-6 space-y-4">
                      {/* Mock KPIs */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white rounded-xl p-4 shadow-sm">
                          <p className="text-[10px] text-gray-500 uppercase tracking-wide">Patrimoine Total</p>
                          <p className="text-lg font-bold text-gray-900">247 500 €</p>
                          <p className="text-[10px] text-emerald-600">+12.4%</p>
                        </div>
                        <div className="bg-white rounded-xl p-4 shadow-sm">
                          <p className="text-[10px] text-gray-500 uppercase tracking-wide">Économies fiscales</p>
                          <p className="text-lg font-bold text-[#2D60FF]">4 820 €</p>
                          <p className="text-[10px] text-gray-500">Cette année</p>
                        </div>
                      </div>
                      {/* Mock Chart */}
                      <div className="bg-white rounded-xl p-4 shadow-sm">
                        <p className="text-[10px] text-gray-500 mb-3">Évolution du patrimoine</p>
                        <div className="h-20 flex items-end gap-1">
                          {[40, 55, 45, 60, 52, 70, 65, 80, 75, 90, 85, 100].map((h, i) => (
                            <motion.div 
                              key={i} 
                              initial={{ height: 0 }}
                              animate={{ height: `${h}%` }}
                              transition={{ duration: 0.5, delay: 0.8 + i * 0.05, ease: "easeOut" }}
                              className="flex-1 bg-gradient-to-t from-[#2D60FF] to-[#16DBCC] rounded-t-sm"
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
                  className="absolute -bottom-4 -left-4 bg-white rounded-2xl p-4 shadow-xl border border-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Objectif FIRE</p>
                      <p className="text-sm font-bold text-gray-900">68% atteint</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Bento Grid Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUpVariant}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              La boîte à outils de l'investisseur
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Tout ce dont vous avez besoin pour optimiser votre fiscalité et vos placements.
            </p>
          </motion.div>

          {/* Bento Grid */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6"
          >
            {/* Card 1 - Large */}
            <motion.div 
              variants={fadeUpVariant}
              transition={{ duration: 0.5, ease: "easeOut" }}
              whileHover={{ scale: 1.02, y: -4 }}
              className="lg:col-span-2 lg:row-span-2 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-3xl p-8 text-white relative overflow-hidden cursor-pointer"
              onClick={() => navigate("/simulateur-impot")}
            >
              <div className="relative z-10">
                <h3 className="text-2xl lg:text-3xl font-bold mb-3">Simulateur Impôt 2025</h3>
                <p className="text-emerald-100 text-lg mb-8">
                  Calculez votre TMI et découvrez comment réduire vos impôts (PER, Girardin).
                </p>
                <Button 
                  variant="secondary" 
                  className="bg-white/20 hover:bg-white/30 text-white border-0 rounded-full"
                >
                  Lancer le simulateur
                </Button>
              </div>
              {/* Abstract Gauge Visualization */}
              <div className="absolute bottom-0 right-0 w-48 h-48 opacity-30">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="white" strokeWidth="8" strokeDasharray="188 63" transform="rotate(-90 50 50)" />
                  <circle cx="50" cy="50" r="28" fill="none" stroke="white" strokeWidth="6" strokeDasharray="120 56" transform="rotate(-90 50 50)" />
                </svg>
              </div>
            </motion.div>

            {/* Card 2 - Medium */}
            <motion.div 
              variants={fadeUpVariant}
              transition={{ duration: 0.5, ease: "easeOut" }}
              whileHover={{ scale: 1.02, y: -4, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
              className="lg:col-span-2 bg-white rounded-3xl p-8 border border-gray-200 cursor-pointer"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center mb-6">
                <Calculator className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Calculateur Droits de Succession</h3>
              <p className="text-gray-600">
                Estimez les droits à payer par vos héritiers et l'impact de l'Assurance-Vie.
              </p>
            </motion.div>

            {/* Card 3 - Medium */}
            <motion.div 
              variants={fadeUpVariant}
              transition={{ duration: 0.5, ease: "easeOut" }}
              whileHover={{ scale: 1.02, y: -4 }}
              className="bg-[#2D60FF] rounded-3xl p-8 text-white relative overflow-hidden cursor-pointer"
            >
              <h3 className="text-xl font-bold mb-2">Projection Retraite & FIRE</h3>
              <p className="text-blue-200 text-sm mb-4">
                Quand serez-vous libre financièrement ?
              </p>
              {/* Mini Chart */}
              <div className="flex items-end gap-1 h-16">
                {[20, 35, 30, 50, 45, 60, 55, 75, 70, 90].map((h, i) => (
                  <div 
                    key={i} 
                    className="flex-1 bg-white/30 rounded-t-sm"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </motion.div>

            {/* Card 4 - Small */}
            <motion.div 
              variants={fadeUpVariant}
              transition={{ duration: 0.5, ease: "easeOut" }}
              whileHover={{ scale: 1.02, y: -4 }}
              className="bg-gray-900 rounded-3xl p-8 text-white flex flex-col items-center justify-center text-center cursor-pointer"
            >
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold">Données Sécurisées</h3>
              <p className="text-gray-400 text-sm mt-1">Vos données vous appartiennent.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Academy Teaser Section */}
      <section className="py-20 px-6 bg-[#F9FAFB]">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUpVariant}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Investissez mieux, parce que vous comprenez mieux.
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
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
                className="rounded-full px-8 border-gray-300 text-gray-700"
              >
                Découvrir l'Académie complète
                <ChevronRight className="ml-2 w-4 h-4" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section (SEO Goldmine) */}
      <section className="py-20 px-6 bg-white border-t border-gray-100">
        <div className="max-w-3xl mx-auto">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUpVariant}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Questions Fréquentes</h2>
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
      <section className="py-20 px-6 bg-gray-900">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUpVariant}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Prêt à éclairer votre patrimoine ?
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Créez votre compte gratuitement et accédez à tous nos simulateurs.
          </p>
          <motion.div 
            whileHover={{ y: -2, boxShadow: "0 12px 40px rgba(45,96,255,0.4)" }} 
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              size="lg"
              onClick={() => navigate("/auth")}
              className="bg-[#2D60FF] hover:bg-[#2550DD] text-white rounded-full px-10 py-6 text-lg font-semibold"
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
        className="py-12 px-6 bg-white border-t border-gray-100"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#2D60FF] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">É</span>
              </div>
              <span className="text-lg font-bold text-gray-900">Éclat Toolkit</span>
            </div>
            <div className="flex items-center gap-8 text-sm text-gray-500">
              <a href="#" className="hover:text-gray-900 transition-colors">Mentions Légales</a>
              <a href="#" className="hover:text-gray-900 transition-colors">Confidentialité</a>
              <a href="#" className="hover:text-gray-900 transition-colors">Contact</a>
            </div>
            <p className="text-sm text-gray-400">
              © 2025 Éclat Gestion Privée. Tous droits réservés.
            </p>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
