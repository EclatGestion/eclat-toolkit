import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, TrendingUp, Calculator, Sparkles, ChevronRight } from "lucide-react";
import { financialProducts } from "@/data/financialProducts";
import { ProductCard } from "@/components/academy/ProductCard";

export default function Landing() {
  const navigate = useNavigate();

  const featuredProducts = financialProducts.filter(p => 
    ["per", "assurance-vie", "girardin"].includes(p.id)
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#2D60FF] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">É</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Éclat Toolkit</span>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/auth")}
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              Se connecter
            </Button>
            <Button 
              onClick={() => navigate("/auth")}
              className="bg-gray-900 hover:bg-gray-800 text-white rounded-full px-6"
            >
              S'inscrire
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <div className="space-y-8">
              <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 leading-[1.1] tracking-tight">
                Votre patrimoine.{" "}
                <span className="text-[#2D60FF]">Éclairé.</span>{" "}
                <span className="text-gray-400">Optimisé.</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                L'application tout-en-un pour simuler vos impôts, préparer votre retraite 
                et piloter vos investissements. <strong className="text-gray-900">Sans jargon.</strong>
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg"
                  onClick={() => navigate("/auth")}
                  className="bg-[#2D60FF] hover:bg-[#2550DD] text-white rounded-full px-8 py-6 text-lg font-semibold shadow-lg shadow-[#2D60FF]/25"
                >
                  Commencer gratuitement
                  <ChevronRight className="ml-2 w-5 h-5" />
                </Button>
                <Button 
                  variant="outline"
                  size="lg"
                  onClick={() => navigate("/auth")}
                  className="rounded-full px-8 py-6 text-lg font-medium border-gray-300 text-gray-700"
                >
                  Voir la démo
                </Button>
              </div>
              <div className="flex items-center gap-6 pt-4 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>100% sécurisé</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Sans engagement</span>
                </div>
              </div>
            </div>

            {/* Right: Dashboard Preview */}
            <div className="relative">
              <div className="relative transform lg:rotate-2 lg:translate-x-8">
                {/* Browser Frame */}
                <div className="bg-gray-900 rounded-2xl p-2 shadow-2xl shadow-gray-900/20">
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
                            <div 
                              key={i} 
                              className="flex-1 bg-gradient-to-t from-[#2D60FF] to-[#16DBCC] rounded-t-sm"
                              style={{ height: `${h}%` }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Floating Badge */}
                <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl p-4 shadow-xl border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Objectif FIRE</p>
                      <p className="text-sm font-bold text-gray-900">68% atteint</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Pourquoi Éclat Toolkit ?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Des outils puissants, une interface simple. Reprenez le contrôle.
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {/* Card 1 - Large */}
            <div className="lg:col-span-2 lg:row-span-2 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-3xl p-8 text-white relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
              <div className="relative z-10">
                <h3 className="text-2xl lg:text-3xl font-bold mb-3">Adieu l'impôt subi.</h3>
                <p className="text-emerald-100 text-lg mb-8">
                  Simulez votre IR 2025 en 30 secondes. Découvrez vos leviers d'optimisation.
                </p>
                <Button 
                  variant="secondary" 
                  className="bg-white/20 hover:bg-white/30 text-white border-0 rounded-full"
                  onClick={() => navigate("/auth")}
                >
                  Simuler mes impôts
                </Button>
              </div>
              {/* Abstract Gauge Visualization */}
              <div className="absolute bottom-0 right-0 w-48 h-48 opacity-30">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="white" strokeWidth="8" strokeDasharray="188 63" transform="rotate(-90 50 50)" />
                  <circle cx="50" cy="50" r="28" fill="none" stroke="white" strokeWidth="6" strokeDasharray="120 56" transform="rotate(-90 50 50)" />
                </svg>
              </div>
            </div>

            {/* Card 2 - Medium */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center mb-6">
                <Calculator className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Anticipez la succession.</h3>
              <p className="text-gray-600">
                Protégez ce que vous transmettez. Optimisez les droits et sécurisez vos proches.
              </p>
            </div>

            {/* Card 3 - Medium */}
            <div className="bg-[#2D60FF] rounded-3xl p-8 text-white relative overflow-hidden hover:scale-[1.02] transition-transform duration-300">
              <h3 className="text-xl font-bold mb-2">Objectif FIRE</h3>
              <p className="text-blue-200 text-sm mb-4">
                Visualisez votre chemin vers l'indépendance financière.
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
            </div>

            {/* Card 4 - Small */}
            <div className="bg-gray-900 rounded-3xl p-8 text-white flex flex-col items-center justify-center text-center hover:scale-[1.02] transition-transform duration-300">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold">Sécurisé & Privé</h3>
              <p className="text-gray-400 text-sm mt-1">Vos données vous appartiennent.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Academy Teaser Section */}
      <section className="py-20 px-6 bg-[#F9FAFB]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Investissez mieux, parce que vous comprenez mieux.
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Notre Académie vous guide à travers les solutions patrimoniales, sans jargon financier.
            </p>
          </div>

          {/* Product Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center">
            <Button 
              variant="outline"
              size="lg"
              onClick={() => navigate("/auth")}
              className="rounded-full px-8 border-gray-300 text-gray-700"
            >
              Découvrir l'Académie complète
              <ChevronRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Prêt à éclairer votre patrimoine ?
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Créez votre compte gratuitement et accédez à tous nos simulateurs.
          </p>
          <Button 
            size="lg"
            onClick={() => navigate("/auth")}
            className="bg-[#2D60FF] hover:bg-[#2550DD] text-white rounded-full px-10 py-6 text-lg font-semibold"
          >
            Commencer maintenant
            <ChevronRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-white border-t border-gray-100">
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
      </footer>
    </div>
  );
}
