import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";

export type ModeTransmission = "vente" | "donation" | "succession";

interface PlusValueSectionProps {
  simulerPlusValue: boolean;
  setSimulerPlusValue: (value: boolean) => void;
  modeTransmission: ModeTransmission;
  setModeTransmission: (value: ModeTransmission) => void;
  estResidencePrincipale: boolean;
  setEstResidencePrincipale: (value: boolean) => void;
  dureeDetention: number;
  setDureeDetention: (value: number) => void;
  prixReventeEstime: number;
  setPrixReventeEstime: (value: number) => void;
  prixBien: number;
  formatCurrency: (value: number) => string;
}

export function PlusValueSection({
  simulerPlusValue,
  setSimulerPlusValue,
  modeTransmission,
  setModeTransmission,
  estResidencePrincipale,
  setEstResidencePrincipale,
  dureeDetention,
  setDureeDetention,
  prixReventeEstime,
  setPrixReventeEstime,
  prixBien,
  formatCurrency,
}: PlusValueSectionProps) {
  return (
    <Card className="rounded-2xl">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-base">
          <TrendingUp className="w-5 h-5 text-red-500" />
          Simulation Plus-Value à la Revente
          <Badge variant="destructive" className="ml-2 text-xs">Réforme 2025</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Activer la simulation</Label>
          <Switch checked={simulerPlusValue} onCheckedChange={setSimulerPlusValue} />
        </div>
        
        {simulerPlusValue && (
          <>
            <div className="space-y-2">
              <Label>Mode de transmission</Label>
              <Select value={modeTransmission} onValueChange={(v) => setModeTransmission(v as ModeTransmission)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vente">Vente</SelectItem>
                  <SelectItem value="donation">Donation (exonéré)</SelectItem>
                  <SelectItem value="succession">Succession (exonéré)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {modeTransmission === "vente" && (
              <>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="rp" 
                    checked={estResidencePrincipale} 
                    onCheckedChange={(v) => setEstResidencePrincipale(v as boolean)} 
                  />
                  <Label htmlFor="rp" className="text-sm cursor-pointer">
                    Le bien deviendra ma résidence principale avant la vente
                  </Label>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Durée de détention prévue</Label>
                    <span className="text-sm font-semibold">{dureeDetention} ans</span>
                  </div>
                  <Slider
                    value={[dureeDetention]}
                    onValueChange={([v]) => setDureeDetention(v)}
                    min={1}
                    max={35}
                    step={1}
                  />
                  <p className="text-xs text-muted-foreground">
                    {dureeDetention >= 22 ? "✅ Exonération IR" : `${Math.max(0, 22 - dureeDetention)} ans avant exonération IR`}
                    {" • "}
                    {dureeDetention >= 30 ? "✅ Exonération totale" : `${Math.max(0, 30 - dureeDetention)} ans avant exonération totale`}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Prix de revente estimé</Label>
                    <span className="text-sm font-semibold text-primary">{formatCurrency(prixReventeEstime)}</span>
                  </div>
                  <Slider
                    value={[prixReventeEstime]}
                    onValueChange={([v]) => setPrixReventeEstime(v)}
                    min={Math.round(prixBien * 0.5)}
                    max={Math.round(prixBien * 2.5)}
                    step={5000}
                  />
                </div>
              </>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
