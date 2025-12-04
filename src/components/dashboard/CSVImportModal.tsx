import { useState, useRef, useCallback, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Upload,
  FileSpreadsheet,
  ChevronRight,
  ChevronLeft,
  Check,
  Loader2,
  Save,
  Trash2,
} from "lucide-react";
import {
  parseCSVPreview,
  parseFullCSV,
  autoDetectColumns,
  CSVParseConfig,
  CSVPreviewData,
  ParsedTransaction,
} from "@/lib/csvParser";
import {
  getBankMappings,
  saveBankMapping,
  deleteBankMapping,
  markMappingAsUsed,
  BankMapping,
} from "@/lib/bankMappings";

interface CSVImportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAnalysisComplete: (data: any) => void;
  setIsLoading: (loading: boolean) => void;
}

type Step = "upload" | "mapping" | "config";

const COLUMN_COLORS = {
  date: "bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700",
  label: "bg-emerald-100 dark:bg-emerald-900/30 border-emerald-300 dark:border-emerald-700",
  amount: "bg-amber-100 dark:bg-amber-900/30 border-amber-300 dark:border-amber-700",
};

export function CSVImportModal({
  open,
  onOpenChange,
  onAnalysisComplete,
  setIsLoading,
}: CSVImportModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Step state
  const [currentStep, setCurrentStep] = useState<Step>("upload");

  // Upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<CSVPreviewData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Mapping state
  const [config, setConfig] = useState<CSVParseConfig>({
    dateColumn: -1,
    labelColumn: -1,
    amountColumn: -1,
    hasHeader: true,
    invertSign: false,
    dateFormat: "auto",
  });

  // Saved mappings
  const [savedMappings, setSavedMappings] = useState<BankMapping[]>([]);
  const [selectedMappingId, setSelectedMappingId] = useState<string>("");
  const [saveMappingName, setSaveMappingName] = useState("");
  const [showSaveInput, setShowSaveInput] = useState(false);

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedTransactions, setParsedTransactions] = useState<ParsedTransaction[]>([]);

  // Load saved mappings
  useEffect(() => {
    setSavedMappings(getBankMappings());
  }, [open]);

  // Reset state when modal closes
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setCurrentStep("upload");
        setSelectedFile(null);
        setPreviewData(null);
        setError(null);
        setConfig({
          dateColumn: -1,
          labelColumn: -1,
          amountColumn: -1,
          hasHeader: true,
          invertSign: false,
          dateFormat: "auto",
        });
        setSelectedMappingId("");
        setSaveMappingName("");
        setShowSaveInput(false);
        setParsedTransactions([]);
      }, 300);
    }
  }, [open]);

  const handleFileSelect = useCallback(async (file: File) => {
    if (!file.name.toLowerCase().endsWith(".csv")) {
      setError("Veuillez sélectionner un fichier CSV");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Le fichier est trop volumineux (max 10 Mo)");
      return;
    }

    setError(null);
    setSelectedFile(file);

    try {
      const preview = await parseCSVPreview(file);
      setPreviewData(preview);

      // Auto-detect columns
      const detected = autoDetectColumns(preview.headers);
      setConfig((prev) => ({
        ...prev,
        dateColumn: detected.dateColumn ?? -1,
        labelColumn: detected.labelColumn ?? -1,
        amountColumn: detected.amountColumn ?? -1,
      }));

      setCurrentStep("mapping");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la lecture du fichier");
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) handleFileSelect(file);
    },
    [handleFileSelect]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const applyMapping = (mapping: BankMapping) => {
    setConfig(mapping.config);
    setSelectedMappingId(mapping.id);
  };

  const handleSaveMapping = () => {
    if (!saveMappingName.trim()) return;
    
    const saved = saveBankMapping(saveMappingName.trim(), config);
    setSavedMappings(getBankMappings());
    setSelectedMappingId(saved.id);
    setShowSaveInput(false);
    setSaveMappingName("");
    
    toast({
      title: "Profil sauvegardé",
      description: `Le profil "${saved.name}" a été enregistré.`,
    });
  };

  const handleDeleteMapping = (id: string) => {
    deleteBankMapping(id);
    setSavedMappings(getBankMappings());
    if (selectedMappingId === id) {
      setSelectedMappingId("");
    }
  };

  const handleGoToConfig = async () => {
    if (!selectedFile) return;

    // Parse transactions with current config to show preview
    try {
      const transactions = await parseFullCSV(selectedFile, config);
      setParsedTransactions(transactions);
      setCurrentStep("config");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors du parsing");
    }
  };

  const handleAnalyze = async () => {
    if (!user || parsedTransactions.length === 0) return;

    setIsProcessing(true);
    setIsLoading(true);
    onOpenChange(false);

    try {
      // Mark mapping as used if one was selected
      if (selectedMappingId) {
        markMappingAsUsed(selectedMappingId);
      }

      // Send structured transactions to edge function
      const { data, error: fnError } = await supabase.functions.invoke("analyze-expenses", {
        body: {
          transactions: parsedTransactions,
          userId: user.id,
          fileName: selectedFile?.name || "import.csv",
          source: "csv",
        },
      });

      if (fnError) throw fnError;

      if (data?.error) {
        throw new Error(data.error);
      }

      if (data?.success && data?.data) {
        onAnalysisComplete(data.data);
        toast({
          title: "Analyse terminée",
          description: `${parsedTransactions.length} transactions analysées avec succès.`,
        });
      }
    } catch (err) {
      console.error("Analysis error:", err);
      toast({
        title: "Erreur d'analyse",
        description: err instanceof Error ? err.message : "Une erreur est survenue",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setIsLoading(false);
    }
  };

  const isMappingValid = config.dateColumn >= 0 && config.labelColumn >= 0 && config.amountColumn >= 0;

  const getColumnHighlight = (colIndex: number) => {
    if (colIndex === config.dateColumn) return COLUMN_COLORS.date;
    if (colIndex === config.labelColumn) return COLUMN_COLORS.label;
    if (colIndex === config.amountColumn) return COLUMN_COLORS.amount;
    return "";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5" />
            Importer un relevé CSV
          </DialogTitle>
        </DialogHeader>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 py-2">
          {(["upload", "mapping", "config"] as Step[]).map((step, i) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  currentStep === step
                    ? "bg-primary text-primary-foreground"
                    : i < ["upload", "mapping", "config"].indexOf(currentStep)
                    ? "bg-primary/20 text-primary"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {i + 1}
              </div>
              {i < 2 && <div className="w-8 h-0.5 bg-muted mx-1" />}
            </div>
          ))}
        </div>

        {/* Step content */}
        {currentStep === "upload" && (
          <div className="space-y-4">
            <div
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors"
            >
              <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-foreground font-medium mb-1">
                Glissez votre fichier CSV ici
              </p>
              <p className="text-sm text-muted-foreground">
                ou cliquez pour sélectionner
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleInputChange}
                className="hidden"
              />
            </div>

            {savedMappings.length > 0 && (
              <div className="p-4 bg-muted/50 rounded-xl">
                <p className="text-sm font-medium text-foreground mb-2">
                  Profils bancaires enregistrés
                </p>
                <div className="flex flex-wrap gap-2">
                  {savedMappings.map((mapping) => (
                    <div
                      key={mapping.id}
                      className="flex items-center gap-1 px-3 py-1.5 bg-background rounded-lg text-sm border"
                    >
                      <span>{mapping.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {error && (
              <p className="text-sm text-destructive text-center">{error}</p>
            )}
          </div>
        )}

        {currentStep === "mapping" && previewData && (
          <div className="space-y-4">
            {/* Saved mappings selector */}
            {savedMappings.length > 0 && (
              <div className="flex items-center gap-2">
                <Label className="text-sm shrink-0">Profil :</Label>
                <Select value={selectedMappingId} onValueChange={(id) => {
                  const mapping = savedMappings.find(m => m.id === id);
                  if (mapping) applyMapping(mapping);
                }}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Choisir un profil existant" />
                  </SelectTrigger>
                  <SelectContent>
                    {savedMappings.map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        {m.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedMappingId && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteMapping(selectedMappingId)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            )}

            {/* Column mapping selectors */}
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label className="text-sm flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-blue-500" />
                  Date
                </Label>
                <Select
                  value={config.dateColumn.toString()}
                  onValueChange={(v) => setConfig({ ...config, dateColumn: parseInt(v) })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Colonne" />
                  </SelectTrigger>
                  <SelectContent>
                    {previewData.headers.map((h, i) => (
                      <SelectItem key={i} value={i.toString()}>
                        {h || `Col ${i + 1}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-emerald-500" />
                  Libellé
                </Label>
                <Select
                  value={config.labelColumn.toString()}
                  onValueChange={(v) => setConfig({ ...config, labelColumn: parseInt(v) })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Colonne" />
                  </SelectTrigger>
                  <SelectContent>
                    {previewData.headers.map((h, i) => (
                      <SelectItem key={i} value={i.toString()}>
                        {h || `Col ${i + 1}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-amber-500" />
                  Montant
                </Label>
                <Select
                  value={config.amountColumn.toString()}
                  onValueChange={(v) => setConfig({ ...config, amountColumn: parseInt(v) })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Colonne" />
                  </SelectTrigger>
                  <SelectContent>
                    {previewData.headers.map((h, i) => (
                      <SelectItem key={i} value={i.toString()}>
                        {h || `Col ${i + 1}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Preview table */}
            <div className="border rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted">
                    <tr>
                      {previewData.headers.map((h, i) => (
                        <th
                          key={i}
                          className={`px-3 py-2 text-left font-medium border-b ${getColumnHighlight(i)}`}
                        >
                          {h || `Col ${i + 1}`}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.rows.slice(0, 5).map((row, rowIndex) => (
                      <tr key={rowIndex} className="border-b last:border-b-0">
                        {row.map((cell, cellIndex) => (
                          <td
                            key={cellIndex}
                            className={`px-3 py-2 ${getColumnHighlight(cellIndex)}`}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep("upload")}>
                <ChevronLeft className="w-4 h-4 mr-1" />
                Retour
              </Button>
              <Button onClick={handleGoToConfig} disabled={!isMappingValid}>
                Suivant
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        )}

        {currentStep === "config" && (
          <div className="space-y-4">
            {/* Config options */}
            <div className="space-y-3 p-4 bg-muted/50 rounded-xl">
              <div className="flex items-center gap-3">
                <Checkbox
                  id="hasHeader"
                  checked={config.hasHeader}
                  onCheckedChange={(checked) =>
                    setConfig({ ...config, hasHeader: checked as boolean })
                  }
                />
                <Label htmlFor="hasHeader" className="text-sm cursor-pointer">
                  La première ligne est un en-tête
                </Label>
              </div>

              <div className="flex items-center gap-3">
                <Checkbox
                  id="invertSign"
                  checked={config.invertSign}
                  onCheckedChange={(checked) =>
                    setConfig({ ...config, invertSign: checked as boolean })
                  }
                />
                <Label htmlFor="invertSign" className="text-sm cursor-pointer">
                  Inverser le signe des montants (dépenses en positif)
                </Label>
              </div>

              <div className="flex items-center gap-3">
                <Label className="text-sm">Format de date :</Label>
                <Select
                  value={config.dateFormat}
                  onValueChange={(v) =>
                    setConfig({ ...config, dateFormat: v as CSVParseConfig["dateFormat"] })
                  }
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Auto-détection</SelectItem>
                    <SelectItem value="DD/MM/YYYY">JJ/MM/AAAA</SelectItem>
                    <SelectItem value="YYYY-MM-DD">AAAA-MM-JJ</SelectItem>
                    <SelectItem value="MM/DD/YYYY">MM/JJ/AAAA</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Parsed transactions preview */}
            <div>
              <p className="text-sm font-medium text-foreground mb-2">
                Aperçu ({parsedTransactions.length} dépenses détectées)
              </p>
              <div className="border rounded-xl overflow-hidden max-h-48 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted sticky top-0">
                    <tr>
                      <th className="px-3 py-2 text-left font-medium">Date</th>
                      <th className="px-3 py-2 text-left font-medium">Libellé</th>
                      <th className="px-3 py-2 text-right font-medium">Montant</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsedTransactions.slice(0, 10).map((t, i) => (
                      <tr key={i} className="border-b last:border-b-0">
                        <td className="px-3 py-2">{t.date}</td>
                        <td className="px-3 py-2 truncate max-w-[200px]">{t.label}</td>
                        <td className="px-3 py-2 text-right text-rose-600">
                          {t.amount.toLocaleString("fr-FR")} €
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Save mapping option */}
            <div className="flex items-center gap-2">
              {!showSaveInput ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSaveInput(true)}
                  className="gap-1"
                >
                  <Save className="w-4 h-4" />
                  Sauvegarder ce profil
                </Button>
              ) : (
                <>
                  <Input
                    placeholder="Nom du profil (ex: LCL)"
                    value={saveMappingName}
                    onChange={(e) => setSaveMappingName(e.target.value)}
                    className="flex-1"
                  />
                  <Button size="sm" onClick={handleSaveMapping} disabled={!saveMappingName.trim()}>
                    <Check className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setShowSaveInput(false)}>
                    Annuler
                  </Button>
                </>
              )}
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep("mapping")}>
                <ChevronLeft className="w-4 h-4 mr-1" />
                Retour
              </Button>
              <Button
                onClick={handleAnalyze}
                disabled={isProcessing || parsedTransactions.length === 0}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyse...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-1" />
                    Analyser ({parsedTransactions.length})
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
