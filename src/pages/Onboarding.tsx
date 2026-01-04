import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { useWealth } from "@/contexts/WealthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { 
  User, 
  Phone, 
  CheckCircle, 
  Loader2, 
  Target, 
  Briefcase,
  Wallet,
  ArrowRight,
  TrendingDown,
  Home,
  PiggyBank,
  Users,
  HelpCircle,
  Clock,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// Form schema
const profileSchema = z.object({
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  phone: z.string().regex(/^(\+33|0)[1-9](\d{8})$/, "Numéro de téléphone invalide"),
  revenus: z.number().min(0, "Les revenus doivent être positifs"),
  patrimoine: z.number().min(0, "Le patrimoine doit être positif"),
  investmentGoal: z.string().min(1, "Veuillez sélectionner un objectif"),
  investmentHorizon: z.string().min(1, "Veuillez sélectionner un horizon"),
  professionalStatus: z.string().min(1, "Veuillez sélectionner votre situation"),
  ageRange: z.string().min(1, "Veuillez sélectionner votre tranche d'âge"),
  investmentCapacity: z.string().min(1, "Veuillez sélectionner un montant"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const steps = [
  { id: 1, title: "Accueil", icon: Sparkles },
  { id: 2, title: "Objectif", icon: Target },
  { id: 3, title: "Profil", icon: Briefcase },
  { id: 4, title: "Capacité", icon: Wallet },
  { id: 5, title: "Coordonnées", icon: User },
  { id: 6, title: "Résultats", icon: CheckCircle },
];

// Goal options
const goalOptions = [
  { value: "reduire_impots", label: "Réduire mes impôts", icon: TrendingDown, color: "text-red-500", bg: "bg-red-500/10" },
  { value: "preparer_retraite", label: "Préparer ma retraite", icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
  { value: "acheter_immo", label: "Acheter un bien immobilier", icon: Home, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { value: "faire_fructifier", label: "Faire fructifier mon épargne", icon: PiggyBank, color: "text-primary", bg: "bg-primary/10" },
  { value: "transmettre", label: "Transmettre mon patrimoine", icon: Users, color: "text-violet-500", bg: "bg-violet-500/10" },
  { value: "ne_sais_pas", label: "Je ne sais pas encore", icon: HelpCircle, color: "text-muted-foreground", bg: "bg-muted" },
];

const horizonOptions = [
  { value: "court_terme", label: "Court terme", description: "Moins de 3 ans" },
  { value: "moyen_terme", label: "Moyen terme", description: "3 à 10 ans" },
  { value: "long_terme", label: "Long terme", description: "Plus de 10 ans" },
];

const professionalOptions = [
  { value: "salarie", label: "Salarié(e)" },
  { value: "tns", label: "Indépendant / TNS" },
  { value: "retraite", label: "Retraité(e)" },
  { value: "autre", label: "Autre" },
];

const ageOptions = [
  { value: "18-30", label: "18 - 30 ans" },
  { value: "30-45", label: "30 - 45 ans" },
  { value: "45-55", label: "45 - 55 ans" },
  { value: "55+", label: "55 ans et plus" },
];

const capacityOptions = [
  { value: "moins_10k", label: "Moins de 10 000 €", segment: "starter" },
  { value: "10k_30k", label: "10 000 € - 30 000 €", segment: "starter" },
  { value: "30k_100k", label: "30 000 € - 100 000 €", segment: "accompagne" },
  { value: "100k_500k", label: "100 000 € - 500 000 €", segment: "accompagne" },
  { value: "plus_500k", label: "Plus de 500 000 €", segment: "accompagne" },
];

function calculateComplexityScore(values: Partial<ProfileFormValues>): { score: number; level: string; color: string } {
  let score = 0;
  
  // Goals complexity
  if (values.investmentGoal === "transmettre") score += 30;
  else if (values.investmentGoal === "reduire_impots") score += 25;
  else if (values.investmentGoal === "acheter_immo") score += 20;
  else score += 10;
  
  // Capacity complexity
  if (values.investmentCapacity === "plus_500k") score += 35;
  else if (values.investmentCapacity === "100k_500k") score += 30;
  else if (values.investmentCapacity === "30k_100k") score += 20;
  else score += 10;
  
  // Professional complexity
  if (values.professionalStatus === "tns") score += 20;
  else score += 10;
  
  // Age complexity
  if (values.ageRange === "55+") score += 15;
  else if (values.ageRange === "45-55") score += 10;
  else score += 5;
  
  const normalizedScore = Math.min(100, score);
  
  if (normalizedScore >= 70) return { score: normalizedScore, level: "Élevée", color: "text-red-500" };
  if (normalizedScore >= 40) return { score: normalizedScore, level: "Moyenne", color: "text-amber-500" };
  return { score: normalizedScore, level: "Simple", color: "text-emerald-500" };
}

function calculateSegment(values: Partial<ProfileFormValues>): "starter" | "accompagne" {
  const capacity = capacityOptions.find(c => c.value === values.investmentCapacity);
  if (capacity?.segment === "accompagne") return "accompagne";
  if (values.patrimoine && values.patrimoine >= 30000) return "accompagne";
  return "starter";
}

function Onboarding() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { setUserProfile, addAsset } = useWealth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      revenus: 0,
      patrimoine: 0,
      investmentGoal: "",
      investmentHorizon: "",
      professionalStatus: "",
      ageRange: "",
      investmentCapacity: "",
    },
  });

  const watchedValues = form.watch();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      const { data } = await supabase
        .from("profiles")
        .select("first_name, last_name, phone, onboarding_completed")
        .eq("id", user.id)
        .maybeSingle();

      if (data?.onboarding_completed) {
        navigate("/mon-parcours");
        return;
      }

      if (data) {
        form.reset({
          ...form.getValues(),
          firstName: data.first_name || "",
          lastName: data.last_name || "",
          phone: data.phone || "",
        });
      }
    };

    fetchProfile();
  }, [user, navigate, form]);

  const nextStep = async () => {
    if (currentStep === 1) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      const isValid = await form.trigger(["investmentGoal"]);
      if (isValid) setCurrentStep(3);
    } else if (currentStep === 3) {
      const isValid = await form.trigger(["investmentHorizon", "professionalStatus", "ageRange"]);
      if (isValid) setCurrentStep(4);
    } else if (currentStep === 4) {
      const isValid = await form.trigger(["investmentCapacity"]);
      if (isValid) setCurrentStep(5);
    } else if (currentStep === 5) {
      const isValid = await form.trigger(["firstName", "lastName", "phone", "revenus", "patrimoine"]);
      if (isValid) setCurrentStep(6);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const onSubmit = async (values: ProfileFormValues) => {
    if (!user) return;

    setIsSubmitting(true);
    const segment = calculateSegment(values);
    
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          first_name: values.firstName,
          last_name: values.lastName,
          phone: values.phone,
          investment_goal: values.investmentGoal,
          investment_horizon: values.investmentHorizon,
          professional_status: values.professionalStatus,
          age_range: values.ageRange,
          investment_capacity: values.investmentCapacity,
          patrimoine_estime: values.patrimoine,
          revenus_annuels: values.revenus,
          segment: segment,
          onboarding_completed: true,
        })
        .eq("id", user.id);

      if (error) throw error;

      setUserProfile({
        name: `${values.firstName} ${values.lastName}`,
        email: user.email || "",
        situation: values.professionalStatus,
        goals: [values.investmentGoal],
      });

      if (values.patrimoine > 0) {
        await addAsset({
          name: "Patrimoine Initial",
          type: "Autre",
          value: values.patrimoine,
        });
      }

      toast({
        title: "Diagnostic complété !",
        description: "Votre parcours personnalisé vous attend.",
      });

      navigate("/mon-parcours");
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = (currentStep / steps.length) * 100;
  const complexity = calculateComplexityScore(watchedValues);
  const segment = calculateSegment(watchedValues);

  const containerVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-xl">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">É</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-center text-foreground mb-2">
            {currentStep === 1 ? "Bienvenue" : `Étape ${currentStep} sur ${steps.length}`}
          </h1>
          <Progress value={progress} className="h-2 mt-4" />
          
          {/* Step Indicators */}
          <div className="flex justify-between mt-4">
            {steps.map((step) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              
              return (
                <div
                  key={step.id}
                  className={cn(
                    "flex flex-col items-center gap-1",
                    isActive || isCompleted ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  <div
                    className={cn(
                      "w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : isCompleted
                        ? "bg-primary/20 text-primary"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    <Icon className="w-4 h-4 md:w-5 md:h-5" />
                  </div>
                  <span className="text-[10px] md:text-xs font-medium hidden sm:block">{step.title}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Card */}
        <Card className="border-0 shadow-xl">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <AnimatePresence mode="wait">
                {/* Step 1: Welcome */}
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <CardHeader className="text-center pb-2">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Sparkles className="w-8 h-8 text-primary" />
                      </div>
                      <CardTitle className="text-2xl">
                        Faisons le point sur votre situation
                      </CardTitle>
                      <CardDescription className="text-base mt-2">
                        En 5 minutes, obtenez un diagnostic personnalisé.<br />
                        <span className="text-muted-foreground">Sans jargon. Sans produit à vendre. Juste pour y voir clair.</span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-4">
                      <div className="bg-muted/50 rounded-xl p-4 space-y-3">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-emerald-500" />
                          <span className="text-sm">Comprenez où vous en êtes vraiment</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-emerald-500" />
                          <span className="text-sm">Découvrez ce que vous pouvez faire maintenant</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-emerald-500" />
                          <span className="text-sm">Identifiez si un accompagnement vous serait utile</span>
                        </div>
                      </div>
                      <Button type="button" onClick={nextStep} className="w-full gap-2" size="lg">
                        Commencer le diagnostic
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                      <p className="text-xs text-center text-muted-foreground">
                        Aucun engagement • Données confidentielles • Gratuit
                      </p>
                    </CardContent>
                  </motion.div>
                )}

                {/* Step 2: Goal */}
                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <CardHeader>
                      <CardTitle>Quel est votre objectif prioritaire ?</CardTitle>
                      <CardDescription>
                        Sélectionnez l'objectif qui vous tient le plus à cœur aujourd'hui.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <FormField
                        control={form.control}
                        name="investmentGoal"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <div className="grid gap-3">
                                {goalOptions.map((goal) => {
                                  const Icon = goal.icon;
                                  const isSelected = field.value === goal.value;
                                  return (
                                    <button
                                      key={goal.value}
                                      type="button"
                                      onClick={() => field.onChange(goal.value)}
                                      className={cn(
                                        "flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left",
                                        isSelected
                                          ? "border-primary bg-primary/5"
                                          : "border-border hover:border-primary/50"
                                      )}
                                    >
                                      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", goal.bg)}>
                                        <Icon className={cn("w-6 h-6", goal.color)} />
                                      </div>
                                      <span className="font-medium">{goal.label}</span>
                                    </button>
                                  );
                                })}
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </motion.div>
                )}

                {/* Step 3: Profile */}
                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <CardHeader>
                      <CardTitle>Votre profil</CardTitle>
                      <CardDescription>
                        Ces informations nous aident à personnaliser vos recommandations.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Horizon */}
                      <FormField
                        control={form.control}
                        name="investmentHorizon"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Horizon d'investissement</FormLabel>
                            <FormControl>
                              <div className="grid grid-cols-3 gap-3">
                                {horizonOptions.map((option) => (
                                  <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => field.onChange(option.value)}
                                    className={cn(
                                      "p-3 rounded-xl border-2 transition-all text-center",
                                      field.value === option.value
                                        ? "border-primary bg-primary/5"
                                        : "border-border hover:border-primary/50"
                                    )}
                                  >
                                    <p className="font-medium text-sm">{option.label}</p>
                                    <p className="text-xs text-muted-foreground">{option.description}</p>
                                  </button>
                                ))}
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Professional Status */}
                      <FormField
                        control={form.control}
                        name="professionalStatus"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Situation professionnelle</FormLabel>
                            <FormControl>
                              <div className="grid grid-cols-2 gap-3">
                                {professionalOptions.map((option) => (
                                  <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => field.onChange(option.value)}
                                    className={cn(
                                      "p-3 rounded-xl border-2 transition-all",
                                      field.value === option.value
                                        ? "border-primary bg-primary/5"
                                        : "border-border hover:border-primary/50"
                                    )}
                                  >
                                    <p className="font-medium text-sm">{option.label}</p>
                                  </button>
                                ))}
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Age Range */}
                      <FormField
                        control={form.control}
                        name="ageRange"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tranche d'âge</FormLabel>
                            <FormControl>
                              <div className="grid grid-cols-2 gap-3">
                                {ageOptions.map((option) => (
                                  <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => field.onChange(option.value)}
                                    className={cn(
                                      "p-3 rounded-xl border-2 transition-all",
                                      field.value === option.value
                                        ? "border-primary bg-primary/5"
                                        : "border-border hover:border-primary/50"
                                    )}
                                  >
                                    <p className="font-medium text-sm">{option.label}</p>
                                  </button>
                                ))}
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </motion.div>
                )}

                {/* Step 4: Capacity */}
                {currentStep === 4 && (
                  <motion.div
                    key="step4"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <CardHeader>
                      <CardTitle>Capacité d'investissement</CardTitle>
                      <CardDescription>
                        Quel montant souhaitez-vous investir ou optimiser dans les 12 prochains mois ?
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <FormField
                        control={form.control}
                        name="investmentCapacity"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <div className="grid gap-3">
                                {capacityOptions.map((option) => {
                                  const isSelected = field.value === option.value;
                                  return (
                                    <button
                                      key={option.value}
                                      type="button"
                                      onClick={() => field.onChange(option.value)}
                                      className={cn(
                                        "flex items-center justify-between p-4 rounded-xl border-2 transition-all text-left",
                                        isSelected
                                          ? "border-primary bg-primary/5"
                                          : "border-border hover:border-primary/50"
                                      )}
                                    >
                                      <span className="font-medium">{option.label}</span>
                                      {isSelected && (
                                        <CheckCircle className="w-5 h-5 text-primary" />
                                      )}
                                    </button>
                                  );
                                })}
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </motion.div>
                )}

                {/* Step 5: Contact Info */}
                {currentStep === 5 && (
                  <motion.div
                    key="step5"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <CardHeader>
                      <CardTitle>Vos coordonnées</CardTitle>
                      <CardDescription>
                        Pour finaliser votre diagnostic et sauvegarder vos résultats.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Prénom</FormLabel>
                              <FormControl>
                                <Input placeholder="Jean" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nom</FormLabel>
                              <FormControl>
                                <Input placeholder="Dupont" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Téléphone</FormLabel>
                            <FormControl>
                              <Input placeholder="0612345678" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="revenus"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Revenus annuels nets (€)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="45000"
                                {...field}
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="patrimoine"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Patrimoine estimé (€)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="100000"
                                {...field}
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </motion.div>
                )}

                {/* Step 6: Results */}
                {currentStep === 6 && (
                  <motion.div
                    key="step6"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <CardHeader className="text-center">
                      <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-emerald-500" />
                      </div>
                      <CardTitle>Votre diagnostic est prêt !</CardTitle>
                      <CardDescription>
                        Voici un aperçu de votre situation patrimoniale.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Complexity Score */}
                      <div className="bg-muted/50 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Complexité de votre situation</span>
                          <span className={cn("font-bold", complexity.color)}>{complexity.level}</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className={cn(
                              "h-full rounded-full transition-all",
                              complexity.score >= 70 ? "bg-red-500" : complexity.score >= 40 ? "bg-amber-500" : "bg-emerald-500"
                            )}
                            style={{ width: `${complexity.score}%` }}
                          />
                        </div>
                      </div>

                      {/* Summary */}
                      <div className="bg-muted/50 rounded-xl p-4 space-y-3">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Objectif</span>
                          <span className="font-medium">{goalOptions.find(g => g.value === watchedValues.investmentGoal)?.label}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Horizon</span>
                          <span className="font-medium">{horizonOptions.find(h => h.value === watchedValues.investmentHorizon)?.label}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Capacité d'investissement</span>
                          <span className="font-medium">{capacityOptions.find(c => c.value === watchedValues.investmentCapacity)?.label}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Patrimoine déclaré</span>
                          <span className="font-medium">{watchedValues.patrimoine?.toLocaleString("fr-FR")} €</span>
                        </div>
                      </div>

                      {/* Segment message */}
                      <div className={cn(
                        "rounded-xl p-4 border",
                        segment === "accompagne" 
                          ? "bg-violet-500/5 border-violet-500/20" 
                          : "bg-primary/5 border-primary/20"
                      )}>
                        {segment === "accompagne" ? (
                          <>
                            <p className="font-medium text-violet-700 dark:text-violet-300 mb-1">
                              Votre situation présente des enjeux significatifs
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Un accompagnement personnalisé pourrait vous faire gagner du temps et éviter des erreurs coûteuses.
                            </p>
                          </>
                        ) : (
                          <>
                            <p className="font-medium text-primary mb-1">
                              Vous pouvez avancer efficacement avec nos outils
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Nos simulateurs gratuits et premium vous guideront dans vos premières décisions.
                            </p>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation Buttons */}
              {currentStep > 1 && (
                <CardContent className="pt-0">
                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      className="flex-1"
                    >
                      Retour
                    </Button>
                    {currentStep < 6 ? (
                      <Button
                        type="button"
                        onClick={nextStep}
                        className="flex-1"
                      >
                        Continuer
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Finalisation...
                          </>
                        ) : (
                          "Découvrir mon parcours"
                        )}
                      </Button>
                    )}
                  </div>
                </CardContent>
              )}
            </form>
          </Form>
        </Card>
      </div>
    </div>
  );
}

export default Onboarding;
