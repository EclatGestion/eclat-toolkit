import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type CallbackState = "loading" | "success" | "error";

export default function PowensCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [state, setState] = useState<CallbackState>("loading");
  const [message, setMessage] = useState("Finalisation de la connexion sécurisée...");

  useEffect(() => {
    const processCallback = async () => {
      // Extract parameters from URL - Powens can return different params
      const connectionId = searchParams.get("connection_id");
      const code = searchParams.get("code");
      const error = searchParams.get("error");
      const errorDescription = searchParams.get("error_description");

      console.log("[POWENS-CALLBACK] Params:", { connectionId, code, error });

      // Handle error case
      if (error) {
        setState("error");
        setMessage(errorDescription || error || "Erreur lors de la connexion bancaire");
        toast({
          title: "Erreur de connexion",
          description: errorDescription || error,
          variant: "destructive",
        });
        
        // Redirect after delay
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
        return;
      }

      // Get the connection identifier (could be connection_id or code)
      const identifier = connectionId || code;
      
      if (!identifier) {
        setState("error");
        setMessage("Paramètres de callback manquants");
        toast({
          title: "Erreur",
          description: "Paramètres de connexion manquants",
          variant: "destructive",
        });
        setTimeout(() => navigate("/dashboard"), 2000);
        return;
      }

      try {
        // If opened as popup, send message to parent
        if (window.opener) {
          window.opener.postMessage({
            type: "powens-callback",
            connectionId: identifier,
          }, "*");
          
          setState("success");
          setMessage("Connexion réussie ! Fermeture...");
          
          // Close popup after short delay
          setTimeout(() => {
            window.close();
          }, 1000);
        } else {
          // Not a popup - call the callback Edge Function directly
          setMessage("Finalisation de la connexion...");
          
          const { data, error: callbackError } = await supabase.functions.invoke(
            "powens-callback",
            {
              body: { connectionId: identifier },
            }
          );

          if (callbackError || !data?.success) {
            throw new Error(callbackError?.message || data?.error || "Erreur lors de la finalisation");
          }

          setState("success");
          setMessage("Compte bancaire connecté avec succès !");
          
          toast({
            title: "Banque connectée",
            description: "Votre compte bancaire a été connecté avec succès.",
          });

          // Redirect to dashboard
          setTimeout(() => {
            navigate("/dashboard");
          }, 1500);
        }
      } catch (err) {
        console.error("[POWENS-CALLBACK] Error:", err);
        setState("error");
        setMessage(err instanceof Error ? err.message : "Erreur inconnue");
        
        toast({
          title: "Erreur",
          description: err instanceof Error ? err.message : "Erreur lors de la connexion",
          variant: "destructive",
        });

        setTimeout(() => navigate("/dashboard"), 2000);
      }
    };

    processCallback();
  }, [searchParams, navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center max-w-md px-6">
        {state === "loading" && (
          <>
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-lg font-medium text-foreground mb-2">Connexion en cours</p>
            <p className="text-muted-foreground">{message}</p>
          </>
        )}
        
        {state === "success" && (
          <>
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-emerald-500" />
            </div>
            <p className="text-lg font-medium text-foreground mb-2">Connexion réussie</p>
            <p className="text-muted-foreground">{message}</p>
          </>
        )}
        
        {state === "error" && (
          <>
            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-10 h-10 text-destructive" />
            </div>
            <p className="text-lg font-medium text-foreground mb-2">Erreur</p>
            <p className="text-muted-foreground">{message}</p>
            <p className="text-sm text-muted-foreground mt-4">Redirection vers le tableau de bord...</p>
          </>
        )}
      </div>
    </div>
  );
}
