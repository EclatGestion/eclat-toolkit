import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Loader2, Trash2, AlertTriangle } from "lucide-react";

interface DeleteAccountModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteAccountModal({ open, onOpenChange }: DeleteAccountModalProps) {
  const { user, signOut } = useAuth();
  const [confirmation, setConfirmation] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const CONFIRMATION_TEXT = "SUPPRIMER";

  const handleDelete = async () => {
    if (confirmation !== CONFIRMATION_TEXT) {
      toast.error(`Veuillez taper "${CONFIRMATION_TEXT}" pour confirmer`);
      return;
    }

    setIsDeleting(true);
    try {
      // Call edge function to delete the user account
      const { error } = await supabase.functions.invoke('delete-account');
      
      if (error) throw error;

      toast.success("Compte supprimé avec succès");
      await signOut();
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error("Erreur lors de la suppression du compte");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = (isOpen: boolean) => {
    if (!isOpen) {
      setConfirmation("");
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="w-5 h-5" />
            Supprimer mon compte
          </DialogTitle>
          <DialogDescription>
            Cette action est irréversible
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
            <div className="flex gap-3">
              <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <div className="space-y-2 text-sm">
                <p className="font-medium text-destructive">Attention !</p>
                <p className="text-muted-foreground">
                  La suppression de votre compte entraînera la perte définitive de :
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Toutes vos données patrimoniales</li>
                  <li>Vos diagnostics et simulations</li>
                  <li>Votre historique et recommandations</li>
                  <li>Votre abonnement Premium/Expert</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmation">
              Tapez <span className="font-mono font-bold text-destructive">{CONFIRMATION_TEXT}</span> pour confirmer
            </Label>
            <Input
              id="confirmation"
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
              placeholder={CONFIRMATION_TEXT}
              className="font-mono"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => handleClose(false)}
              className="flex-1"
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting || confirmation !== CONFIRMATION_TEXT}
              className="flex-1"
            >
              {isDeleting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Supprimer définitivement
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
