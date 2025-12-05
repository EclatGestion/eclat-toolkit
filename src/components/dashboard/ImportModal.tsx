import { useState, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { usePowens } from "@/hooks/usePowens";
import * as pdfjs from "pdfjs-dist/legacy/build/pdf";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { FileText, Link2, Upload, Loader2, AlertCircle, RefreshCw, Building2, X } from "lucide-react";

// Configuration du worker PDF.js (version legacy compatible)
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

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

  const { 
    isConnected, 
    bankConnection, 
    isLoading: isPowensLoading, 
    initConnection, 
    syncTransactions,
    disconnect 
  } = usePowens();

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
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
    
    let fullText = '';
    
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      const pageText = textContent.items
        .filter((item) => 'str' in item && typeof (item as any).str === 'string')
        .map((item) => (item as any).str as string)
        .join(' ');
      
      fullText += pageText + '\n';
    }
    
    const cleanedText = fullText
      .replace(/\n{3,}/g, '\n\n')
      .replace(/Page \d+\/\d+/gi, '')
      .replace(/Capital social.*$/gim, '')
      .replace(/RCS.*$/gim, '')
      .replace(/SIRET.*$/gim, '')
      .replace(/^\s+|\s+$/g, '')
      .replace(/\s{2,}/g, ' ');
    
    console.log("📄 Texte envoyé à l'IA :", cleanedText);
    console.log("📊 Nombre de caractères :", cleanedText.length);
    
    return cleanedText;
  };

  const handleAnalyze = async () => {
    if (!selectedFile || !user) return;

    setIsUploading(true);
    setError(null);
    setIsLoading(true);
    onOpenChange(false);

    try {
      const pdfContent = await extractTextFromPDF(selectedFile);

      const filePath = `${user.id}/${Date.now()}_${selectedFile.name}`;
      await supabase.storage
        .from("bank-statements")
        .upload(filePath, selectedFile);

      const { data: functionData, error: functionError } = await supabase.functions.invoke(
        "analyze-expenses",
        {
          body: {
            pdfContent,
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

  const handlePowensSync = async () => {
    setIsLoading(true);
    onOpenChange(false);
    
    const data = await syncTransactions();
    
    if (data) {
      onAnalysisComplete(data);
    }
    
    setIsLoading(false);
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

          {/* Powens Option */}
          {isConnected && bankConnection ? (
            <div className="relative border-2 border-emerald-500/50 rounded-2xl p-6 bg-emerald-500/5">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mb-3">
                  <Building2 className="w-6 h-6 text-emerald-500" />
                </div>
                <h4 className="font-medium text-foreground mb-1">
                  {bankConnection.bank_name || "Banque connectée"}
                </h4>
                <p className="text-sm text-muted-foreground mb-3">
                  {bankConnection.last_sync_at 
                    ? `Dernière synchro : ${new Date(bankConnection.last_sync_at).toLocaleDateString("fr-FR")}`
                    : "Prêt à synchroniser"
                  }
                </p>
                <div className="flex gap-2">
                  <Button 
                    onClick={handlePowensSync}
                    disabled={isPowensLoading}
                    size="sm"
                    className="gap-2"
                  >
                    {isPowensLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <RefreshCw className="w-4 h-4" />
                    )}
                    Synchroniser
                  </Button>
                  <Button 
                    onClick={disconnect}
                    disabled={isPowensLoading}
                    variant="outline"
                    size="sm"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div 
              onClick={initConnection}
              className="relative border-2 border-dashed border-border rounded-2xl p-6 hover:border-primary/50 hover:bg-muted/50 transition-colors cursor-pointer"
            >
              {isPowensLoading && (
                <div className="absolute inset-0 bg-background/80 flex items-center justify-center rounded-2xl">
                  <Loader2 className="w-6 h-6 text-primary animate-spin" />
                </div>
              )}
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  <Link2 className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-medium text-foreground mb-1">
                  Synchronisation bancaire
                </h4>
                <p className="text-sm text-muted-foreground">
                  Connectez votre banque pour un import automatique
                </p>
              </div>
            </div>
          )}

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
                Analyser PDF
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
