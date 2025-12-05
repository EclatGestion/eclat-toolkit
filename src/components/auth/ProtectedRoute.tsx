import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const [showRetry, setShowRetry] = useState(false);

  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => setShowRetry(true), 5000);
      return () => clearTimeout(timer);
    }
    setShowRetry(false);
  }, [loading]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        {showRetry && (
          <Button 
            variant="outline" 
            onClick={() => window.location.reload()}
          >
            Réessayer
          </Button>
        )}
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
