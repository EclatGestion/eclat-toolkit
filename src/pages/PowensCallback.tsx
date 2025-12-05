import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";

export default function PowensCallback() {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Extract connection_id from URL params
    const connectionId = searchParams.get("connection_id");
    const error = searchParams.get("error");

    if (window.opener) {
      // Send message to parent window
      if (error) {
        window.opener.postMessage({
          type: "powens-error",
          error,
        }, "*");
      } else if (connectionId) {
        window.opener.postMessage({
          type: "powens-callback",
          connectionId,
        }, "*");
      }

      // Close this popup
      setTimeout(() => {
        window.close();
      }, 1000);
    } else {
      // If not a popup, redirect to dashboard
      window.location.href = "/dashboard";
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
        <p className="text-muted-foreground">Connexion en cours...</p>
      </div>
    </div>
  );
}
