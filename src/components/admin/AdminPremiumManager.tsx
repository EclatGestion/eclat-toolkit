import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Shield, Crown, Loader2, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

export function AdminPremiumManager() {
  const [targetEmail, setTargetEmail] = useState("");
  const [isPremium, setIsPremium] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!targetEmail.trim()) {
      toast.error("Veuillez entrer un email");
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke("admin-toggle-premium", {
        body: { targetEmail: targetEmail.trim(), isPremium },
      });

      if (error) throw error;

      setResult({ success: true, message: data.message });
      toast.success(data.message);
      setTargetEmail("");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erreur inconnue";
      setResult({ success: false, message });
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-card rounded-2xl p-6 shadow-card border border-amber-500/20">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
          <Shield className="w-5 h-5 text-amber-500" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Administration Premium</h3>
          <p className="text-sm text-muted-foreground">Override manuel du statut Premium</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="targetEmail">Email de l'utilisateur</Label>
          <Input
            id="targetEmail"
            type="email"
            placeholder="client@example.com"
            value={targetEmail}
            onChange={(e) => setTargetEmail(e.target.value)}
            className="bg-background"
          />
        </div>

        <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
          <div className="flex items-center gap-2">
            <Crown className={`w-4 h-4 ${isPremium ? "text-amber-500" : "text-muted-foreground"}`} />
            <span className="text-sm font-medium">Statut Premium</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-sm ${!isPremium ? "text-foreground" : "text-muted-foreground"}`}>
              Standard
            </span>
            <Switch
              checked={isPremium}
              onCheckedChange={setIsPremium}
            />
            <span className={`text-sm ${isPremium ? "text-amber-500 font-medium" : "text-muted-foreground"}`}>
              Premium
            </span>
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full"
          disabled={isLoading || !targetEmail.trim()}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Application en cours...
            </>
          ) : (
            "Appliquer les modifications"
          )}
        </Button>
      </form>

      {result && (
        <div className={`mt-4 p-3 rounded-lg flex items-center gap-2 ${
          result.success 
            ? "bg-emerald-500/10 text-emerald-600" 
            : "bg-destructive/10 text-destructive"
        }`}>
          {result.success ? (
            <CheckCircle className="w-4 h-4" />
          ) : (
            <XCircle className="w-4 h-4" />
          )}
          <span className="text-sm">{result.message}</span>
        </div>
      )}
    </div>
  );
}
