import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Download, FileJson, CheckCircle } from "lucide-react";

interface DataExportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DataExportModal({ open, onOpenChange }: DataExportModalProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const { data, error } = await supabase.functions.invoke('export-user-data');
      
      if (error) throw error;

      // Create and download JSON file
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `eclat-donnees-personnelles-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setExportComplete(true);
      toast.success("Export réussi");
    } catch (error) {
      console.error("Error exporting data:", error);
      toast.error("Erreur lors de l'export");
    } finally {
      setIsExporting(false);
    }
  };

  const handleClose = (isOpen: boolean) => {
    if (!isOpen) {
      setExportComplete(false);
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="w-5 h-5 text-primary" />
            Export de vos données (RGPD)
          </DialogTitle>
          <DialogDescription>
            Téléchargez une copie de toutes vos données personnelles
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {exportComplete ? (
            <div className="text-center py-6">
              <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Export terminé</h3>
              <p className="text-sm text-muted-foreground">
                Vos données ont été téléchargées au format JSON.
              </p>
            </div>
          ) : (
            <>
              <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <FileJson className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium text-sm">Données incluses :</p>
                  </div>
                </div>
                <ul className="text-sm text-muted-foreground space-y-1 ml-8">
                  <li>• Informations de profil</li>
                  <li>• Patrimoine (actifs, revenus, dépenses)</li>
                  <li>• Diagnostics et simulations sauvegardées</li>
                  <li>• Analyses de dépenses</li>
                  <li>• Statut des recommandations</li>
                </ul>
              </div>

              <p className="text-xs text-muted-foreground">
                Conformément au RGPD, vous avez le droit d'obtenir une copie de vos données personnelles. 
                Le fichier sera au format JSON, lisible par tout éditeur de texte.
              </p>
            </>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => handleClose(false)}
              className="flex-1"
            >
              {exportComplete ? "Fermer" : "Annuler"}
            </Button>
            {!exportComplete && (
              <Button
                onClick={handleExport}
                disabled={isExporting}
                className="flex-1"
              >
                {isExporting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Télécharger mes données
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
