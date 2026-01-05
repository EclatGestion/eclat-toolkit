import { MainLayout } from "@/components/layout/MainLayout";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { usePremium } from "@/hooks/usePremium";
import { useDiagnostics, AIRecommendations, Recommandation } from "@/hooks/useDiagnostics";
import { useRecommendationStatus, RecoStatus } from "@/hooks/useRecommendationStatus";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
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
  Crown,
  Gem,
  Users,
  Clock,
  TrendingDown,
  FileText,
  Plus,
  CalendarDays,
  AlertTriangle,
  Lightbulb,
  Check,
  Circle,
  CheckCircle2,
  Trash2,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { UpgradeSuccessModal } from "@/components/premium/UpgradeSuccessModal";
import { ActionDetailModal } from "@/components/mon-parcours/ActionDetailModal";
import { getPrimaryProduct } from "@/utils/recommendationMapping";

interface UserProfile {
  first_name: string | null;
  investment_goal: string | null;
  investment_capacity: string | null;
  segment: string | null;
  onboarding_completed: boolean | null;
}

// Configuration flag - masquer les partenaires jusqu'aux accords signés
const SHOW_PARTNER_CTA = false;

const goalConfig: Record<string, { label: string; icon: React.ComponentType<{ className?: string }>; color: string; bgGradient: string }> = {
  reduire_impots: { 
    label: "Réduire vos impôts", 
    icon: TrendingDown,
    color: "text-red-500",
    bgGradient: "from-red-500/10 to-orange-500/10"
  },
  preparer_retraite: { 
    label: "Préparer votre retraite", 
    icon: Clock,
    color: "text-teal-500",
    bgGradient: "from-teal-500/10 to-cyan-500/10"
  },
  acheter_immo: { 
    label: "Acheter un bien immobilier", 
    icon: Home,
    color: "text-blue-500",
    bgGradient: "from-blue-500/10 to-sky-500/10"
  },
  faire_fructifier: { 
    label: "Faire fructifier votre épargne", 
    icon: PiggyBank,
    color: "text-emerald-500",
    bgGradient: "from-emerald-500/10 to-green-500/10"
  },
  transmettre: { 
    label: "Transmettre votre patrimoine", 
    icon: Users,
    color: "text-violet-500",
    bgGradient: "from-violet-500/10 to-purple-500/10"
  },
  ne_sais_pas: { 
    label: "Définir vos objectifs", 
    icon: Target,
    color: "text-slate-500",
    bgGradient: "from-slate-500/10 to-gray-500/10"
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

type ActionWithMeta = Recommandation & { priority: string; index: number; key: string };

export default function MonParcours() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { tier, refreshSubscription } = usePremium();
  const { diagnostics, isLoading: diagnosticsLoading, refreshDiagnostics } = useDiagnostics();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showAllActions, setShowAllActions] = useState(false);
  const [selectedAction, setSelectedAction] = useState<ActionWithMeta | null>(null);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);

  const handleDeleteDiagnostic = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeletingId(id);
    
    const { error } = await supabase
      .from("diagnostic_results")
      .delete()
      .eq("id", id);
    
    if (error) {
      toast.error("Erreur lors de la suppression");
    } else {
      toast.success("Diagnostic supprimé");
      refreshDiagnostics();
    }
    setDeletingId(null);
  };
  const [searchParams, setSearchParams] = useSearchParams();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [selectedInvestmentAmount, setSelectedInvestmentAmount] = useState<string | null>(null);

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
        .select("first_name, investment_goal, investment_capacity, segment, onboarding_completed")
        .eq("id", user.id)
        .maybeSingle();

      setProfile(data);
      setLoading(false);
    };

    fetchProfile();
  }, [user]);

  const goalInfo = profile?.investment_goal ? goalConfig[profile.investment_goal] : null;
  const GoalIcon = goalInfo?.icon || Target;
  const hasDiagnostic = diagnostics.length > 0;
  const hasCompletedOnboarding = profile?.onboarding_completed;

  // Get the latest diagnostic with AI recommendations
  const latestDiagnosticWithRecos = useMemo(() => {
    return diagnostics.find(d => d.ai_recommendations !== null && d.ai_recommendations !== undefined);
  }, [diagnostics]);

  // Get recommendations statuses for the latest diagnostic
  const { statuses, updateStatus } = useRecommendationStatus(latestDiagnosticWithRecos?.id);

  // Get ALL actions from the latest diagnostic
  const allActions = useMemo(() => {
    if (!latestDiagnosticWithRecos?.ai_recommendations) return [];
    
    const recos = latestDiagnosticWithRecos.ai_recommendations;
    const allRecos: ActionWithMeta[] = [];
    
    recos.haute?.forEach((r, i) => {
      const key = `haute_${i}_${r.titre.slice(0, 20).replace(/\s/g, "_")}`;
      allRecos.push({ ...r, priority: "haute", index: i, key });
    });
    recos.moyenne?.forEach((r, i) => {
      const key = `moyenne_${i}_${r.titre.slice(0, 20).replace(/\s/g, "_")}`;
      allRecos.push({ ...r, priority: "moyenne", index: i, key });
    });
    recos.longTerme?.forEach((r, i) => {
      const key = `longTerme_${i}_${r.titre.slice(0, 20).replace(/\s/g, "_")}`;
      allRecos.push({ ...r, priority: "longTerme", index: i, key });
    });
    
    return allRecos;
  }, [latestDiagnosticWithRecos]);

  // Split into pending and completed
  const pendingActions = useMemo(() => 
    allActions.filter(r => statuses[r.key] !== "completed"),
    [allActions, statuses]
  );
  
  const completedActions = useMemo(() => 
    allActions.filter(r => statuses[r.key] === "completed"),
    [allActions, statuses]
  );

  // Calculate progress
  const progressPercentage = useMemo(() => {
    if (allActions.length === 0) return 0;
    return Math.round((completedActions.length / allActions.length) * 100);
  }, [allActions, completedActions]);

  // Actions to display
  const displayedActions = useMemo(() => {
    if (showAllActions) {
      return [...pendingActions, ...completedActions];
    }
    return pendingActions.slice(0, 3);
  }, [showAllActions, pendingActions, completedActions]);

  const getNextStep = () => {
    if (!hasDiagnostic) {
      return { title: "Réalisez votre bilan patrimonial", path: "/tools/bilan-patrimonial", icon: Brain };
    }
    // If there are AI recommendations, show dynamic next step
    if (pendingActions.length > 0) {
      return { 
        title: pendingActions[0].titre, 
        path: `/tools/bilan-patrimonial?load=${latestDiagnosticWithRecos?.id}`, 
        icon: AlertTriangle 
      };
    }
    if (profile?.investment_goal === "reduire_impots") {
      return { title: "Optimisez votre fiscalité", path: "/tools/simulateur-ir", icon: Calculator };
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
    return { title: "Affinez votre stratégie", path: "/tools/goal-based-investment", icon: Sparkles };
  };

  const nextStep = getNextStep();

  const handleActionClick = (action: ActionWithMeta) => {
    setSelectedAction(action);
    setIsActionModalOpen(true);
  };

  const handleStatusUpdate = async (status: RecoStatus) => {
    if (selectedAction) {
      await updateStatus(selectedAction.key, status);
    }
  };

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
          className={cn(
            "rounded-3xl p-6 md:p-8 border",
            goalInfo 
              ? `bg-gradient-to-br ${goalInfo.bgGradient} border-${goalInfo.color.replace('text-', '')}/20`
              : "bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/10"
          )}
        >
          <div className="flex items-start gap-4">
            <div className={cn(
              "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0",
              goalInfo ? `bg-${goalInfo.color.replace('text-', '')}/20` : "bg-primary/20"
            )}>
              <GoalIcon className={cn("w-7 h-7", goalInfo?.color || "text-primary")} />
            </div>
            <div className="flex-1">
              <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">
                Bonjour {profile?.first_name || ""},
              </h2>
              {goalInfo ? (
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Votre objectif :</span>
                  <span className={cn("font-medium", goalInfo.color)}>{goalInfo.label}</span>
                  {hasCompletedOnboarding && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-medium">
                      ✓ Diagnostic complété
                    </span>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground">
                  Complétez votre diagnostic pour définir vos objectifs patrimoniaux
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Mes actions prioritaires - Dynamique basé sur le dernier bilan */}
        {allActions.length > 0 && latestDiagnosticWithRecos && (
          <motion.section variants={itemVariants}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                ⚡ Mes actions prioritaires
              </h3>
              <span className="text-xs text-muted-foreground">
                Basé sur votre bilan du {new Date(latestDiagnosticWithRecos.updated_at).toLocaleDateString("fr-FR")}
              </span>
            </div>
            
            {/* Barre de progression */}
            <div className="mb-6 bg-card rounded-2xl p-4 shadow-card border border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">Progression</span>
                <span className={cn(
                  "text-sm font-semibold",
                  progressPercentage >= 70 ? "text-emerald-500" :
                  progressPercentage >= 40 ? "text-amber-500" : "text-red-500"
                )}>
                  {progressPercentage}%
                </span>
              </div>
              <Progress 
                value={progressPercentage} 
                className="h-3"
              />
              <p className="text-xs text-muted-foreground mt-2">
                {completedActions.length} action{completedActions.length > 1 ? "s" : ""} réalisée{completedActions.length > 1 ? "s" : ""} sur {allActions.length}
              </p>
            </div>
            
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {displayedActions.map((action) => {
                  const currentStatus = statuses[action.key] || "pending";
                  const isCompleted = currentStatus === "completed";
                  const isInProgress = currentStatus === "in_progress";
                  
                  const priorityConfig = {
                    haute: { icon: AlertTriangle, color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/20" },
                    moyenne: { icon: Lightbulb, color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20" },
                    longTerme: { icon: Target, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" },
                  }[action.priority] || { icon: Target, color: "text-primary", bg: "bg-primary/10", border: "border-primary/20" };
                  
                  const PriorityIcon = priorityConfig.icon;
                  
                  return (
                    <motion.div
                      key={action.key}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={cn(
                        "flex items-center gap-4 p-4 bg-card rounded-2xl shadow-card border transition-all cursor-pointer hover:shadow-lg",
                        priorityConfig.border,
                        isCompleted && "opacity-60"
                      )}
                      onClick={() => handleActionClick(action)}
                    >
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                        priorityConfig.bg
                      )}>
                        <PriorityIcon className={cn("w-5 h-5", priorityConfig.color)} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className={cn(
                          "font-medium text-foreground",
                          isCompleted && "line-through"
                        )}>
                          {action.titre}
                        </p>
                        <p className="text-sm text-muted-foreground truncate">
                          {action.description}
                        </p>
                      </div>
                      
                      {/* Status indicator */}
                      <div className="flex items-center gap-2 shrink-0">
                        {isCompleted && (
                          <span className="px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 text-xs font-medium flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Fait
                          </span>
                        )}
                        {isInProgress && (
                          <span className="px-2 py-1 rounded-lg bg-amber-500/10 text-amber-600 text-xs font-medium flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            En cours
                          </span>
                        )}
                        <ArrowRight className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
              
              {allActions.length > 3 && (
                <Button
                  variant="ghost"
                  onClick={() => setShowAllActions(!showAllActions)}
                  className="w-full gap-2 text-muted-foreground hover:text-foreground"
                >
                  {showAllActions ? (
                    <>
                      Voir moins
                      <ChevronUp className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      Voir toutes mes actions ({allActions.length - 3} de plus)
                      <ChevronDown className="w-4 h-4" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </motion.section>
        )}

        {/* Prochaine étape - Affiché si pas de recommandations IA */}
        {allActions.length === 0 && (
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
        )}

        {/* Mes diagnostics sauvegardés */}
        <motion.section variants={itemVariants}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              📁 Mes diagnostics
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/tools/bilan-patrimonial")}
              className="gap-1"
            >
              <Plus className="w-4 h-4" />
              Nouveau
            </Button>
          </div>
          
          {diagnosticsLoading ? (
            <div className="h-24 flex items-center justify-center text-muted-foreground">
              Chargement...
            </div>
          ) : diagnostics.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {diagnostics.slice(0, 3).map((diag) => (
                <div
                  key={diag.id}
                  className="relative flex items-start gap-3 p-4 bg-card rounded-2xl shadow-card hover:shadow-lg transition-all text-left border border-transparent hover:border-primary/20 group"
                >
                  <button
                    onClick={() => navigate(`/tools/bilan-patrimonial?load=${diag.id}`)}
                    className="flex items-start gap-3 flex-1 text-left"
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{diag.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <CalendarDays className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {new Date(diag.updated_at).toLocaleDateString("fr-FR")}
                        </span>
                      </div>
                      <div className={cn(
                        "mt-2 px-2 py-0.5 rounded-full text-xs font-medium w-fit",
                        diag.score_global >= 70 
                          ? "bg-emerald-500/10 text-emerald-600"
                          : diag.score_global >= 50
                            ? "bg-amber-500/10 text-amber-600"
                            : "bg-red-500/10 text-red-600"
                      )}>
                        Score : {diag.score_global}/100
                      </div>
                    </div>
                  </button>
                  
                  {/* Delete button */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="absolute top-3 right-3 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Supprimer ce diagnostic ?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Cette action est irréversible. Le diagnostic "{diag.name}" et toutes ses données seront définitivement supprimés.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={(e) => handleDeleteDiagnostic(diag.id, e)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          disabled={deletingId === diag.id}
                        >
                          {deletingId === diag.id ? "Suppression..." : "Supprimer"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-muted/50 rounded-2xl p-6 text-center">
              <Brain className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">Aucun diagnostic sauvegardé</p>
              <Button
                variant="link"
                onClick={() => navigate("/tools/bilan-patrimonial")}
                className="mt-2"
              >
                Créer mon premier diagnostic →
              </Button>
            </div>
          )}
        </motion.section>

        {/* CTA Passer à l'action */}
        <motion.section variants={itemVariants}>
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            💼 Passez à l'action
          </h3>
          
          <div className="bg-card rounded-3xl p-6 shadow-card border border-border">
            <p className="text-muted-foreground mb-4">Combien souhaitez-vous investir ?</p>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {[
                { id: "small", label: "< 5 000€", threshold: false },
                { id: "medium", label: "5k - 30k€", threshold: false },
                { id: "large", label: "30k - 100k€", threshold: true },
                { id: "xlarge", label: "> 100k€", threshold: true },
              ].map((option) => (
                <button
                  key={option.id}
                  onClick={() => setSelectedInvestmentAmount(option.id)}
                  className={cn(
                    "px-4 py-3 rounded-xl text-sm font-medium transition-all border-2",
                    selectedInvestmentAmount === option.id
                      ? option.threshold
                        ? "bg-violet-500/10 border-violet-500 text-violet-600"
                        : "bg-primary/10 border-primary text-primary"
                      : "bg-muted border-transparent text-muted-foreground hover:bg-muted/80"
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>

            {selectedInvestmentAmount && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {selectedInvestmentAmount === "large" || selectedInvestmentAmount === "xlarge" ? (
                  <div className="bg-gradient-to-br from-violet-500/10 to-purple-500/10 rounded-2xl p-5 border border-violet-500/20">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center shrink-0">
                        <Phone className="w-6 h-6 text-violet-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground mb-1">
                          Votre patrimoine mérite un accompagnement sur mesure
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Prenez rendez-vous avec un expert ECLAT Gestion Privée pour une stratégie personnalisée.
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
                ) : SHOW_PARTNER_CTA ? (
                  <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-5 border border-primary/20">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                        <Sparkles className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground mb-1">
                          Ouvrez votre première assurance-vie
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Avec notre partenaire sélectionné pour optimiser votre épargne.
                        </p>
                      </div>
                      <Button 
                        onClick={() => navigate("/partenaire/assurance-vie")}
                        className="gap-2 shrink-0"
                      >
                        Découvrir
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-muted/50 rounded-2xl p-5 text-center">
                    <p className="text-muted-foreground">
                      Nos partenaires seront bientôt disponibles. En attendant, explorez nos outils pour affiner votre stratégie.
                    </p>
                    <Button 
                      variant="outline"
                      onClick={() => navigate("/toolbox")}
                      className="mt-3 gap-2"
                    >
                      Découvrir les outils
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </motion.section>

        {/* Upgrade CTA - Dynamique selon le tier */}
        {tier !== "expert" && (
          <motion.section variants={itemVariants}>
            <div className={cn(
              "rounded-3xl p-6 shadow-card border",
              tier === "free" 
                ? "bg-gradient-to-br from-amber-500/5 to-amber-500/10 border-amber-500/20"
                : "bg-gradient-to-br from-violet-500/5 to-violet-500/10 border-violet-500/20"
            )}>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center",
                    tier === "free" ? "bg-amber-500/10" : "bg-violet-500/10"
                  )}>
                    {tier === "free" ? (
                      <Crown className="w-6 h-6 text-amber-500" />
                    ) : (
                      <Gem className="w-6 h-6 text-violet-500" />
                    )}
                  </div>
                  <div>
                    {tier === "free" ? (
                      <>
                        <h4 className="font-semibold text-foreground">Débloquez les outils avancés</h4>
                        <p className="text-sm text-muted-foreground">Passez Premium ou Expert pour des analyses personnalisées</p>
                      </>
                    ) : (
                      <>
                        <h4 className="font-semibold text-foreground">Passez Expert</h4>
                        <p className="text-sm text-muted-foreground">Accédez aux outils spécialisés : Succession, LMNP, IA avancée</p>
                      </>
                    )}
                  </div>
                </div>
                <Button 
                  onClick={() => navigate("/pricing")}
                  variant={tier === "free" ? "default" : "outline"}
                  className={cn(
                    "gap-2 shrink-0",
                    tier === "premium" && "border-violet-500/50 text-violet-600 hover:bg-violet-500/10"
                  )}
                >
                  Voir les offres
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.section>
        )}
      </motion.div>

      <UpgradeSuccessModal open={isSuccessModalOpen} onOpenChange={setIsSuccessModalOpen} />
      
      <ActionDetailModal
        open={isActionModalOpen}
        onOpenChange={setIsActionModalOpen}
        action={selectedAction}
        currentStatus={selectedAction ? (statuses[selectedAction.key] || "pending") : "pending"}
        onStatusChange={handleStatusUpdate}
        matchingProduct={selectedAction ? getPrimaryProduct(selectedAction.titre, selectedAction.description) : null}
        diagnosticData={latestDiagnosticWithRecos ? {
          tmi: latestDiagnosticWithRecos.tmi,
          patrimoine_total: latestDiagnosticWithRecos.patrimoine_total,
          revenus: latestDiagnosticWithRecos.revenus
        } : undefined}
      />
    </MainLayout>
  );
}
