import { MainLayout } from "@/components/layout/MainLayout";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { usePremium } from "@/hooks/usePremium";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  Target, 
  Calculator, 
  Home, 
  PiggyBank, 
  TrendingUp,
  Brain,
  Sparkles,
  Phone,
  Building2,
  Crown,
  ChevronDown,
  ChevronUp,
  Users,
  Shield,
  Clock,
  TrendingDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import { UpgradeSuccessModal } from "@/components/premium/UpgradeSuccessModal";

interface UserProfile {
  first_name: string | null;
  investment_goal: string | null;
  investment_capacity: string | null;
  segment: string | null;
  patrimoine_estime: number | null;
}

const goalLabels: Record<string, { label: string; icon: React.ComponentType<{ className?: string }>; tools: string[] }> = {
  reduire_impots: { 
    label: "Réduire vos impôts", 
    icon: TrendingDown,
    tools: ["simulateur-ir", "optimisation-per", "girardin"]
  },
  preparer_retraite: { 
    label: "Préparer votre retraite", 
    icon: Clock,
    tools: ["interets-composes", "optimisation-per", "assurance-vie"]
  },
  acheter_immo: { 
    label: "Acheter un bien immobilier", 
    icon: Home,
    tools: ["simulateur-immobilier", "capacite-epargne", "interets-composes"]
  },
  faire_fructifier: { 
    label: "Faire fructifier votre épargne", 
    icon: PiggyBank,
    tools: ["interets-composes", "assurance-vie", "goal-based-investment"]
  },
  transmettre: { 
    label: "Transmettre votre patrimoine", 
    icon: Users,
    tools: ["droits-succession", "assurance-vie", "bilan-patrimonial"]
  },
  ne_sais_pas: { 
    label: "Définir vos objectifs", 
    icon: Target,
    tools: ["bilan-patrimonial", "capacite-epargne", "goal-based-investment"]
  },
};

const allTools = [
  { id: "simulateur-ir", title: "Simulateur IR", icon: Calculator, tier: "premium", path: "/tools/simulateur-ir" },
  { id: "simulateur-immobilier", title: "Simulateur Immobilier", icon: Home, tier: "premium", path: "/tools/simulateur-immobilier" },
  { id: "interets-composes", title: "Intérêts Composés", icon: TrendingUp, tier: "premium", path: "/tools/interets-composes" },
  { id: "capacite-epargne", title: "Capacité d'Épargne", icon: PiggyBank, tier: "free", path: "/tools/capacite-epargne" },
  { id: "assurance-vie", title: "Assurance-Vie", icon: Shield, tier: "premium", path: "/tools/assurance-vie" },
  { id: "optimisation-per", title: "Optimisation PER", icon: Target, tier: "premium", path: "/tools/optimisation-per" },
  { id: "bilan-patrimonial", title: "Bilan Patrimonial", icon: Brain, tier: "free", path: "/tools/bilan-patrimonial" },
  { id: "droits-succession", title: "Droits de Succession", icon: Users, tier: "expert", path: "/tools/droits-succession" },
  { id: "goal-based-investment", title: "Conseiller IA", icon: Sparkles, tier: "expert", path: "/tools/goal-based-investment" },
  { id: "comparateur-lmnp", title: "Comparateur LMNP", icon: Building2, tier: "expert", path: "/tools/comparateur-lmnp" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function MonParcours() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { refreshSubscription } = usePremium();
  const [searchParams, setSearchParams] = useSearchParams();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAllTools, setShowAllTools] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  useEffect(() => {
    if (searchParams.get("upgrade") === "success") {
      setIsSuccessModalOpen(true);
      refreshSubscription();
      setSearchParams({});
    }
  }, [searchParams, setSearchParams, refreshSubscription]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      const { data } = await supabase
        .from("profiles")
        .select("first_name, investment_goal, investment_capacity, segment, patrimoine_estime")
        .eq("id", user.id)
        .maybeSingle();

      setProfile(data);
      setLoading(false);
    };

    fetchProfile();
  }, [user]);

  const goalInfo = profile?.investment_goal ? goalLabels[profile.investment_goal] : null;
  const GoalIcon = goalInfo?.icon || Target;
  const recommendedTools = goalInfo?.tools || ["capacite-epargne", "interets-composes", "bilan-patrimonial"];
  const segment = profile?.segment || "starter";

  const getNextStep = () => {
    if (profile?.investment_goal === "reduire_impots") {
      return { title: "Simulez votre optimisation fiscale", path: "/tools/simulateur-ir", icon: Calculator };
    }
    if (profile?.investment_goal === "acheter_immo") {
      return { title: "Calculez votre capacité d'emprunt", path: "/tools/simulateur-immobilier", icon: Home };
    }
    if (profile?.investment_goal === "preparer_retraite") {
      return { title: "Projetez vos intérêts composés", path: "/tools/interets-composes", icon: TrendingUp };
    }
    if (profile?.investment_goal === "transmettre") {
      return { title: "Estimez vos droits de succession", path: "/tools/droits-succession", icon: Users };
    }
    return { title: "Réalisez votre bilan patrimonial", path: "/tools/bilan-patrimonial", icon: Brain };
  };

  const nextStep = getNextStep();

  if (loading) {
    return (
      <MainLayout title="Mon Parcours">
        <div className="flex items-center justify-center h-64">
          <div className="animate-pulse text-muted-foreground">Chargement...</div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Mon Parcours">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* Hero personnalisé */}
        <motion.div 
          variants={itemVariants}
          className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-3xl p-6 md:p-8 border border-primary/10"
        >
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center shrink-0">
              <GoalIcon className="w-7 h-7 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">
                Bonjour {profile?.first_name || ""},
              </h2>
              <p className="text-muted-foreground">
                Votre objectif : <span className="text-foreground font-medium">{goalInfo?.label || "Optimiser votre patrimoine"}</span>
              </p>
              {profile?.patrimoine_estime && profile.patrimoine_estime > 0 && (
                <p className="text-sm text-muted-foreground mt-1">
                  Patrimoine déclaré : {profile.patrimoine_estime.toLocaleString("fr-FR")} €
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Prochaine étape */}
        <motion.section variants={itemVariants}>
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            🎯 Votre prochaine étape
          </h3>
          <button
            onClick={() => navigate(nextStep.path)}
            className="w-full flex items-center gap-4 p-6 bg-card rounded-2xl shadow-card hover:shadow-lg transition-all duration-200 group text-left border-2 border-primary/20 hover:border-primary/40"
          >
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <nextStep.icon className="w-7 h-7 text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-foreground text-lg">{nextStep.title}</p>
              <p className="text-sm text-muted-foreground">Cliquez pour commencer</p>
            </div>
            <ArrowRight className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.section>

        {/* Recommandations */}
        <motion.section variants={itemVariants}>
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            ✨ Recommandations pour vous
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {allTools
              .filter(t => recommendedTools.includes(t.id))
              .slice(0, 3)
              .map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => navigate(tool.path)}
                  className="flex items-center gap-4 p-4 bg-card rounded-2xl shadow-card hover:shadow-lg transition-all duration-200 group text-left border border-transparent hover:border-primary/20"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                    <tool.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-foreground truncate">{tool.title}</p>
                      {tool.tier !== "free" && (
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-xs font-medium shrink-0",
                          tool.tier === "premium" ? "bg-amber-500/10 text-amber-600" : "bg-indigo-500/10 text-indigo-600"
                        )}>
                          {tool.tier === "premium" ? "Premium" : "Expert"}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
          </div>
        </motion.section>

        {/* CTA Segmenté */}
        <motion.section variants={itemVariants}>
          {segment === "accompagne" ? (
            <div className="bg-gradient-to-br from-violet-500/10 via-violet-500/5 to-transparent rounded-3xl p-6 border border-violet-500/20">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-violet-500/20 flex items-center justify-center shrink-0">
                  <Phone className="w-7 h-7 text-violet-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground mb-1">
                    Votre situation présente des enjeux significatifs
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Vous pouvez avancer seul, ou choisir de le faire avec un expert ECLAT Gestion Privée.
                  </p>
                </div>
                <Button 
                  onClick={() => navigate("/contact-eclat")}
                  className="bg-violet-600 hover:bg-violet-700 text-white gap-2 shrink-0"
                >
                  Prendre rendez-vous
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-3xl p-6 border border-primary/20">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center shrink-0">
                  <Shield className="w-7 h-7 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground mb-1">
                    Commencez à investir simplement
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Ouvrez votre première assurance-vie avec notre partenaire sélectionné.
                  </p>
                </div>
                <Button 
                  onClick={() => navigate("/partenaire/assurance-vie")}
                  className="gap-2 shrink-0"
                >
                  Découvrir notre partenaire
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </motion.section>

        {/* Upgrade CTA */}
        <motion.section variants={itemVariants}>
          <div className="bg-card rounded-3xl p-6 shadow-card border border-border">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                  <Crown className="w-6 h-6 text-amber-500" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Débloquez tous les outils</h4>
                  <p className="text-sm text-muted-foreground">Passez Premium ou Expert pour des analyses avancées</p>
                </div>
              </div>
              <Button 
                onClick={() => navigate("/pricing")}
                variant="outline"
                className="gap-2 shrink-0"
              >
                Voir les offres
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.section>

        {/* Tous les outils (collapsible) */}
        <motion.section variants={itemVariants}>
          <button
            onClick={() => setShowAllTools(!showAllTools)}
            className="flex items-center justify-between w-full py-4 text-left"
          >
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              🧰 Tous les outils
            </h3>
            {showAllTools ? (
              <ChevronUp className="w-5 h-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            )}
          </button>
          
          {showAllTools && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4"
            >
              {allTools.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => navigate(tool.path)}
                  className="flex items-center gap-4 p-4 bg-card rounded-2xl shadow-card hover:shadow-lg transition-all duration-200 group text-left border border-transparent hover:border-primary/20"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                    <tool.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground text-sm truncate">{tool.title}</p>
                      {tool.tier !== "free" && (
                        <span className={cn(
                          "px-1.5 py-0.5 rounded text-[10px] font-medium shrink-0",
                          tool.tier === "premium" ? "bg-amber-500/10 text-amber-600" : "bg-indigo-500/10 text-indigo-600"
                        )}>
                          {tool.tier === "premium" ? "PRO" : "EXPERT"}
                        </span>
                      )}
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                </button>
              ))}
            </motion.div>
          )}
        </motion.section>
      </motion.div>

      <UpgradeSuccessModal open={isSuccessModalOpen} onOpenChange={setIsSuccessModalOpen} />
    </MainLayout>
  );
}
