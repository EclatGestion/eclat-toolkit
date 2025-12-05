import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

export default function PowensCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    const success = searchParams.get("success");
    const error = searchParams.get("error");
    const bankName = searchParams.get("bank");

    if (success === "true") {
      toast({
        title: "Banque connectée !",
        description: bankName 
          ? `${decodeURIComponent(bankName)} a été connectée avec succès.`
          : "Votre banque a été connectée avec succès.",
      });
    } else if (error) {
      toast({
        title: "Erreur de connexion",
        description: decodeURIComponent(error),
        variant: "destructive",
      });
    }

    // Redirect to dashboard after a short delay
    const timer = setTimeout(() => {
      navigate("/dashboard", { replace: true });
    }, 2000);

    return () => clearTimeout(timer);
  }, [searchParams, navigate, toast]);

  const success = searchParams.get("success") === "true";
  const error = searchParams.get("error");

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        {success ? (
          <>
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-emerald-500" />
            </div>
            <h1 className="text-xl font-semibold text-foreground">
              Connexion réussie !
            </h1>
            <p className="text-muted-foreground">
              Redirection vers votre tableau de bord...
            </p>
          </>
        ) : error ? (
          <>
            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
              <XCircle className="w-8 h-8 text-destructive" />
            </div>
            <h1 className="text-xl font-semibold text-foreground">
              Erreur de connexion
            </h1>
            <p className="text-muted-foreground max-w-sm">
              {decodeURIComponent(error)}
            </p>
            <p className="text-sm text-muted-foreground">
              Redirection vers votre tableau de bord...
            </p>
          </>
        ) : (
          <>
            <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto" />
            <p className="text-muted-foreground">
              Traitement en cours...
            </p>
          </>
        )}
      </div>
    </div>
  );
}
