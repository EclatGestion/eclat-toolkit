import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { User, Phone, CheckCircle, Loader2 } from "lucide-react";

const profileSchema = z.object({
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  phone: z.string().regex(/^(\+33|0)[1-9](\d{8})$/, "Numéro de téléphone invalide (format: 0612345678 ou +33612345678)"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const steps = [
  { id: 1, title: "Identité", icon: User },
  { id: 2, title: "Contact", icon: Phone },
  { id: 3, title: "Confirmation", icon: CheckCircle },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
    },
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      const { data } = await supabase
        .from("profiles")
        .select("first_name, last_name, phone, onboarding_completed")
        .eq("id", user.id)
        .maybeSingle();

      if (data?.onboarding_completed) {
        navigate("/");
        return;
      }

      if (data) {
        form.reset({
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
      const isValid = await form.trigger(["firstName", "lastName"]);
      if (isValid) setCurrentStep(2);
    } else if (currentStep === 2) {
      const isValid = await form.trigger(["phone"]);
      if (isValid) setCurrentStep(3);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const onSubmit = async (values: ProfileFormValues) => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          first_name: values.firstName,
          last_name: values.lastName,
          phone: values.phone,
          onboarding_completed: true,
        })
        .eq("id", user.id);

      if (error) throw error;

      toast({
        title: "Profil complété",
        description: "Bienvenue sur Éclat Patrimoine !",
      });

      navigate("/");
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

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">É</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-center text-foreground mb-2">
            Complétez votre profil
          </h1>
          <p className="text-muted-foreground text-center mb-6">
            Étape {currentStep} sur {steps.length}
          </p>
          <Progress value={progress} className="h-2" />
          
          {/* Step Indicators */}
          <div className="flex justify-between mt-4">
            {steps.map((step) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              
              return (
                <div
                  key={step.id}
                  className={`flex flex-col items-center gap-1 ${
                    isActive || isCompleted ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : isCompleted
                        ? "bg-primary/20 text-primary"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-medium">{step.title}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Card */}
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle>
              {currentStep === 1 && "Vos informations personnelles"}
              {currentStep === 2 && "Vos coordonnées"}
              {currentStep === 3 && "Vérification"}
            </CardTitle>
            <CardDescription>
              {currentStep === 1 && "Ces informations nous permettent de personnaliser votre expérience."}
              {currentStep === 2 && "Pour vous contacter si nécessaire."}
              {currentStep === 3 && "Vérifiez vos informations avant de valider."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Step 1: Identity */}
                {currentStep === 1 && (
                  <div className="space-y-4">
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
                )}

                {/* Step 2: Contact */}
                {currentStep === 2 && (
                  <div className="space-y-4">
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
                  </div>
                )}

                {/* Step 3: Confirmation */}
                {currentStep === 3 && (
                  <div className="space-y-4">
                    <div className="bg-muted/50 rounded-xl p-4 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Prénom</span>
                        <span className="font-medium">{form.getValues("firstName")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Nom</span>
                        <span className="font-medium">{form.getValues("lastName")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Téléphone</span>
                        <span className="font-medium">{form.getValues("phone")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Email</span>
                        <span className="font-medium">{user?.email}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex gap-3">
                  {currentStep > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      className="flex-1"
                    >
                      Retour
                    </Button>
                  )}
                  {currentStep < 3 ? (
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
                          Validation...
                        </>
                      ) : (
                        "Valider mon profil"
                      )}
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
