import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Shield, 
  ArrowLeft, 
  ExternalLink, 
  CheckCircle,
  TrendingUp,
  Wallet,
  Lock,
  Star
} from "lucide-react";
import { motion } from "framer-motion";
import { SEO } from "@/components/seo/SEO";
import eclatLogo from "@/assets/eclat-logo.png";

const partners = [
  {
    id: "linxea",
    name: "Linxea Spirit 2",
    logo: "🏦",
    description: "L'assurance-vie la moins chère du marché avec plus de 700 supports d'investissement.",
    features: [
      "0% de frais d'entrée",
      "0,5% de frais de gestion annuels",
      "700+ supports (ETF, SCPI, fonds euros)",
      "Gestion libre ou pilotée"
    ],
    minInvestment: "500 €",
    url: "https://www.linxea.com/assurance-vie/linxea-spirit-2/?utm_source=eclat&utm_medium=partner&utm_campaign=toolkit",
    recommended: true
  },
  {
    id: "yomoni",
    name: "Yomoni",
    logo: "🤖",
    description: "Gestion pilotée 100% automatisée avec des ETF à frais réduits.",
    features: [
      "Gestion pilotée par algorithme",
      "1,6% de frais tout compris",
      "Allocation personnalisée selon profil",
      "Application mobile intuitive"
    ],
    minInvestment: "1 000 €",
    url: "https://www.yomoni.fr/?utm_source=eclat&utm_medium=partner&utm_campaign=toolkit",
    recommended: false
  },
  {
    id: "nalo",
    name: "Nalo",
    logo: "🎯",
    description: "Assurance-vie sur-mesure avec une approche par objectifs de vie.",
    features: [
      "Approche par projets de vie",
      "1,65% de frais tout compris",
      "Sécurisation progressive automatique",
      "ISR et investissement responsable"
    ],
    minInvestment: "1 000 €",
    url: "https://www.nalo.fr/?utm_source=eclat&utm_medium=partner&utm_campaign=toolkit",
    recommended: false
  }
];

export default function PartenaireAssuranceVie() {
  const navigate = useNavigate();

  const handleOpenPartner = (url: string, partnerName: string) => {
    // Track click (could be enhanced with analytics)
    console.log(`Partner click: ${partnerName}`);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Ouvrir une Assurance-Vie | Partenaires Sélectionnés"
        description="Ouvrez votre première assurance-vie avec nos partenaires sélectionnés. Frais réduits, supports diversifiés, gestion simple."
        canonical="/partenaire/assurance-vie"
      />

      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <button 
            onClick={() => navigate("/mon-parcours")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à mon parcours
          </button>
          <img src={eclatLogo} alt="Éclat" className="w-8 h-8" />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Hero */}
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">
              Investissez simplement avec un partenaire de confiance
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Votre situation ne nécessite pas d'accompagnement personnalisé. 
              Vous pouvez mettre en place votre stratégie simplement avec l'un de nos partenaires sélectionnés.
            </p>
          </div>

          {/* Why we recommend */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="py-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                  <CheckCircle className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Pourquoi ces partenaires ?</h3>
                  <p className="text-sm text-muted-foreground">
                    Nous avons sélectionné ces acteurs pour leurs frais réduits, leur fiabilité et la qualité 
                    de leur offre. Aucun frais d'entrée, des supports diversifiés et une gestion accessible.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Partners Grid */}
          <div className="space-y-4">
            {partners.map((partner, index) => (
              <motion.div
                key={partner.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={partner.recommended ? "border-2 border-primary" : ""}>
                  {partner.recommended && (
                    <div className="bg-primary text-primary-foreground text-center py-1.5 text-sm font-medium flex items-center justify-center gap-2">
                      <Star className="w-4 h-4" />
                      Notre recommandation
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <span className="text-4xl">{partner.logo}</span>
                        <div>
                          <CardTitle>{partner.name}</CardTitle>
                          <CardDescription className="mt-1">{partner.description}</CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {partner.features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Wallet className="w-4 h-4" />
                        Investissement minimum : {partner.minInvestment}
                      </div>
                      <Button
                        onClick={() => handleOpenPartner(partner.url, partner.name)}
                        className={partner.recommended ? "" : "variant-outline"}
                        variant={partner.recommended ? "default" : "outline"}
                      >
                        Ouvrir un contrat
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Trust indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 bg-card rounded-xl border border-border">
              <Lock className="w-5 h-5 text-emerald-500" />
              <div>
                <p className="font-medium text-sm">Fonds garantis</p>
                <p className="text-xs text-muted-foreground">Jusqu'à 70 000€ par contrat</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-card rounded-xl border border-border">
              <TrendingUp className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium text-sm">Fiscalité avantageuse</p>
                <p className="text-xs text-muted-foreground">Après 8 ans de détention</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-card rounded-xl border border-border">
              <Shield className="w-5 h-5 text-violet-500" />
              <div>
                <p className="font-medium text-sm">100% en ligne</p>
                <p className="text-xs text-muted-foreground">Ouverture en 10 minutes</p>
              </div>
            </div>
          </div>

          {/* Back link */}
          <div className="text-center">
            <Button
              variant="ghost"
              onClick={() => navigate("/mon-parcours")}
              className="text-muted-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour à mon parcours
            </Button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
