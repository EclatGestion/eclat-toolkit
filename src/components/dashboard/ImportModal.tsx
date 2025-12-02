import { useState, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { FileText, Link2, Upload, Loader2, AlertCircle } from "lucide-react";

interface ImportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAnalysisComplete: (data: any) => void;
  setIsLoading: (loading: boolean) => void;
}

export function ImportModal({ 
  open, 
  onOpenChange, 
  onAnalysisComplete,
  setIsLoading 
}: ImportModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setError(null);
    
    if (file) {
      if (file.type !== "application/pdf") {
        setError("Veuillez sélectionner un fichier PDF");
        return;
      }
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setError("Le fichier ne doit pas dépasser 10 Mo");
        return;
      }
      setSelectedFile(file);
    }
  };

  const extractTextFromPDF = async (file: File): Promise<string> => {
    // Simple text extraction - in production, use a proper PDF parser
    // For now, we'll send the file content as base64 and let AI handle it
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        // Remove data URL prefix
        const base64Content = base64.split(",")[1] || base64;
        resolve(base64Content);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleAnalyze = async () => {
    if (!selectedFile || !user) return;

    setIsUploading(true);
    setError(null);
    setIsLoading(true);
    onOpenChange(false);

    try {
      // Extract PDF content
      const pdfContent = await extractTextFromPDF(selectedFile);

      // Upload to storage (optional, for record keeping)
      const filePath = `${user.id}/${Date.now()}_${selectedFile.name}`;
      await supabase.storage
        .from("bank-statements")
        .upload(filePath, selectedFile);

      // Call the analysis edge function
      const { data: functionData, error: functionError } = await supabase.functions.invoke(
        "analyze-expenses",
        {
          body: {
            pdfContent,
            userId: user.id,
            fileName: selectedFile.name,
          },
        }
      );

      if (functionError) {
        throw new Error(functionError.message || "Erreur lors de l'analyse");
      }

      if (functionData?.error) {
        throw new Error(functionData.error);
      }

      if (functionData?.success && functionData?.data) {
        onAnalysisComplete(functionData.data);
        toast({
          title: "Analyse terminée",
          description: "Vos dépenses ont été analysées avec succès.",
        });
      } else {
        throw new Error("Format de réponse invalide");
      }
    } catch (err) {
      console.error("Analysis error:", err);
      const message = err instanceof Error ? err.message : "Erreur lors de l'analyse";
      toast({
        title: "Erreur d'analyse",
        description: message,
        variant: "destructive",
      });
      setError(message);
    } finally {
      setIsUploading(false);
      setIsLoading(false);
      setSelectedFile(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Importer vos dépenses</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* PDF Import Option */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="relative border-2 border-dashed border-border rounded-2xl p-6 hover:border-primary/50 hover:bg-muted/50 transition-colors cursor-pointer"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileSelect}
              className="hidden"
            />
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-medium text-foreground mb-1">
                Relevé bancaire PDF
              </h4>
              <p className="text-sm text-muted-foreground">
                Importez votre relevé pour une analyse automatique
              </p>
              {selectedFile && (
                <div className="mt-3 px-3 py-1.5 bg-primary/10 rounded-lg">
                  <p className="text-sm text-primary font-medium truncate max-w-[200px]">
                    {selectedFile.name}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Powens Option - Disabled */}
          <div className="relative border-2 border-border rounded-2xl p-6 opacity-60 cursor-not-allowed">
            <div className="absolute top-3 right-3 px-2 py-0.5 bg-muted rounded-full">
              <span className="text-xs text-muted-foreground">Bientôt</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                <Link2 className="w-6 h-6 text-muted-foreground" />
              </div>
              <h4 className="font-medium text-foreground mb-1">
                Synchronisation Powens
              </h4>
              <p className="text-sm text-muted-foreground">
                Connectez votre banque pour un import automatique
              </p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-destructive/10 rounded-xl text-destructive">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button 
            onClick={handleAnalyze} 
            disabled={!selectedFile || isUploading}
            className="gap-2"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyse...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Analyser
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
