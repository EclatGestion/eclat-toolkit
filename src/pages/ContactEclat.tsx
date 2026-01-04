import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  Phone, 
  Mail, 
  MapPin,
  CheckCircle,
  Calendar,
  Send,
  Loader2,
  Building2,
  Shield,
  Users
} from "lucide-react";
import { motion } from "framer-motion";
import { SEO } from "@/components/seo/SEO";
import eclatLogo from "@/assets/eclat-logo.png";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
  investmentAmount: string;
}

export default function ContactEclat() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
    investmentAmount: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      const { data } = await supabase
        .from("profiles")
        .select("first_name, last_name, email, phone")
        .eq("id", user.id)
        .maybeSingle();

      if (data) {
        setFormData(prev => ({
          ...prev,
          firstName: data.first_name || "",
          lastName: data.last_name || "",
          email: data.email || user.email || "",
          phone: data.phone || "",
        }));
      }
    };

    fetchProfile();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission (would be replaced with actual API call)
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast({
      title: "Demande envoyée !",
      description: "Un conseiller ECLAT vous contactera dans les 24h.",
    });

    setIsSubmitted(true);
    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center"
        >
          <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-emerald-500" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Demande envoyée !</h1>
          <p className="text-muted-foreground mb-6">
            Un conseiller ECLAT Gestion Privée vous contactera dans les 24 heures ouvrées.
          </p>
          <Button onClick={() => navigate("/mon-parcours")}>
            Retour à mon parcours
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Contact ECLAT Gestion Privée | Conseil Patrimonial"
        description="Prenez rendez-vous avec un conseiller ECLAT Gestion Privée pour un accompagnement patrimonial personnalisé."
        canonical="/contact-eclat"
      />

      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
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

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left: Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-4">
                Faites le point avec un expert patrimonial
              </h1>
              <p className="text-lg text-muted-foreground">
                Votre situation présente des enjeux significatifs. Un accompagnement personnalisé 
                peut vous faire gagner du temps et éviter des erreurs coûteuses.
              </p>
            </div>

            {/* Benefits */}
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-card rounded-xl border border-border">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Entretien offert</h3>
                  <p className="text-sm text-muted-foreground">
                    Premier échange de 30 minutes sans engagement pour comprendre votre situation.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-card rounded-xl border border-border">
                <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5 text-violet-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Conseil indépendant</h3>
                  <p className="text-sm text-muted-foreground">
                    Recommandations objectives, sans pression commerciale ni produit maison.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-card rounded-xl border border-border">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <Shield className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Confidentialité totale</h3>
                  <p className="text-sm text-muted-foreground">
                    Vos données restent privées et ne sont jamais partagées à des tiers.
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-muted/50 rounded-xl p-6 space-y-4">
              <h3 className="font-semibold text-foreground">Contactez-nous directement</h3>
              <div className="space-y-3">
                <a 
                  href="tel:+33123456789"
                  className="flex items-center gap-3 text-foreground hover:text-primary transition-colors"
                >
                  <Phone className="w-5 h-5 text-muted-foreground" />
                  +33 1 23 45 67 89
                </a>
                <a 
                  href="mailto:contact@eclat-gp.fr"
                  className="flex items-center gap-3 text-foreground hover:text-primary transition-colors"
                >
                  <Mail className="w-5 h-5 text-muted-foreground" />
                  contact@eclat-gp.fr
                </a>
                <div className="flex items-start gap-3 text-muted-foreground">
                  <MapPin className="w-5 h-5 shrink-0 mt-0.5" />
                  <span>Paris, France</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Demander un rendez-vous
                </CardTitle>
                <CardDescription>
                  Remplissez ce formulaire, un conseiller vous recontactera sous 24h.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Prénom</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Nom</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="investmentAmount">Montant envisagé (optionnel)</Label>
                    <select
                      id="investmentAmount"
                      name="investmentAmount"
                      value={formData.investmentAmount}
                      onChange={handleChange}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="">Sélectionner</option>
                      <option value="30k-100k">30 000 € - 100 000 €</option>
                      <option value="100k-500k">100 000 € - 500 000 €</option>
                      <option value="500k+">Plus de 500 000 €</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Votre message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Décrivez brièvement votre situation et vos objectifs..."
                      value={formData.message}
                      onChange={handleChange}
                      rows={4}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Envoyer ma demande
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">
                    Sans engagement • Réponse sous 24h ouvrées
                  </p>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
