import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Receipt, Percent, CheckCircle2 } from "lucide-react";

interface FiscaliteCardProps {
  revenusImposables: number;
  setRevenusImposables: (v: number) => void;
  tmi: number;
  setTmi: (v: number) => void;
  perUtilise: boolean;
  setPerUtilise: (v: boolean) => void;
  lmnpUtilise: boolean;
  setLmnpUtilise: (v: boolean) => void;
}

const TMI_OPTIONS = [
  { value: 0, label: "0%" },
  { value: 11, label: "11%" },
  { value: 30, label: "30%" },
  { value: 41, label: "41%" },
  { value: 45, label: "45%" },
];

export function FiscaliteCard({
  revenusImposables,
  setRevenusImposables,
  tmi,
  setTmi,
  perUtilise,
  setPerUtilise,
  lmnpUtilise,
  setLmnpUtilise,
}: FiscaliteCardProps) {
  // Calcul simplifié de l'IR (estimation)
  const calculerIR = () => {
    const tranches = [
      { limite: 11294, taux: 0 },
      { limite: 28797, taux: 0.11 },
      { limite: 82341, taux: 0.30 },
      { limite: 177106, taux: 0.41 },
      { limite: Infinity, taux: 0.45 },
    ];

    let impot = 0;
    let revenuRestant = revenusImposables;
    let limitePrecedente = 0;

    for (const tranche of tranches) {
      const montantDansTranche = Math.min(revenuRestant, tranche.limite - limitePrecedente);
      if (montantDansTranche <= 0) break;
      impot += montantDansTranche * tranche.taux;
      revenuRestant -= montantDansTranche;
      limitePrecedente = tranche.limite;
    }

    return Math.round(impot);
  };

  const impotEstime = calculerIR();
  const tauxEffectif = revenusImposables > 0 
    ? ((impotEstime / revenusImposables) * 100).toFixed(1) 
    : "0";

  return (
    <Card className="border-0 shadow-lg bg-card">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-lg">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
            <Receipt className="w-5 h-5 text-red-500" />
          </div>
          Fiscalité
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Revenus imposables */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <Receipt className="w-4 h-4 text-muted-foreground" />
              Revenus imposables annuels
            </Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={revenusImposables}
                onChange={(e) => setRevenusImposables(Number(e.target.value))}
                className="w-36 text-right"
              />
              <span className="text-muted-foreground">€</span>
            </div>
          </div>
          <Slider
            value={[revenusImposables]}
            onValueChange={([v]) => setRevenusImposables(v)}
            min={0}
            max={300000}
            step={1000}
            className="py-2"
          />
        </div>

        {/* TMI */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <Percent className="w-4 h-4 text-muted-foreground" />
              Tranche Marginale d'Imposition (TMI)
            </Label>
            <Select value={tmi.toString()} onValueChange={(v) => setTmi(Number(v))}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TMI_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value.toString()}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Leviers fiscaux utilisés */}
        <div className="space-y-4 pt-4 border-t border-border">
          <Label className="text-sm text-muted-foreground">Leviers fiscaux déjà utilisés</Label>
          
          <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
            <div className="flex items-center gap-3">
              <CheckCircle2 className={`w-5 h-5 ${perUtilise ? 'text-emerald-500' : 'text-muted-foreground'}`} />
              <span className="text-sm">PER (Plan Épargne Retraite)</span>
            </div>
            <Switch checked={perUtilise} onCheckedChange={setPerUtilise} />
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
            <div className="flex items-center gap-3">
              <CheckCircle2 className={`w-5 h-5 ${lmnpUtilise ? 'text-emerald-500' : 'text-muted-foreground'}`} />
              <span className="text-sm">LMNP (Location Meublée)</span>
            </div>
            <Switch checked={lmnpUtilise} onCheckedChange={setLmnpUtilise} />
          </div>
        </div>

        {/* Résumé fiscal */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
          <div className="text-center p-3 rounded-xl bg-muted/50">
            <div className="text-xs text-muted-foreground mb-1">IR estimé</div>
            <div className="text-xl font-bold text-red-500">
              {impotEstime.toLocaleString('fr-FR')} €
            </div>
          </div>
          <div className="text-center p-3 rounded-xl bg-muted/50">
            <div className="text-xs text-muted-foreground mb-1">Taux effectif</div>
            <div className="text-xl font-bold text-foreground">
              {tauxEffectif}%
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
