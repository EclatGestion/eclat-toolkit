import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Target, TrendingDown, Infinity, Clock } from "lucide-react";
import { DecapitalisationChart } from "./DecapitalisationChart";

interface SimulationRetraiteProps {
  rendementActuel: number;
}

export function SimulationRetraite({ rendementActuel }: SimulationRetraiteProps) {
  const [renteMensuelle, setRenteMensuelle] = useState(2000);
  const [dureeRente, setDureeRente] = useState(25);
  const [rendementNet, setRendementNet] = useState(rendementActuel || 4);
  const [mode, setMode] = useState<"perpetuelle" | "temporaire">("temporaire");

  // Calcul du capital requis
  const { capitalRequis, chartData } = useMemo(() => {
    let capital: number;
    const data: { annee: number; capital: number }[] = [];

    if (mode === "perpetuelle") {
      // Rente perpétuelle : Capital = Rente annuelle / Rendement
      const renteAnnuelle = renteMensuelle * 12;
      capital = renteAnnuelle / (rendementNet / 100);
      
      // Chart: capital reste constant
      for (let i = 0; i <= 30; i++) {
        data.push({ annee: i, capital: Math.round(capital) });
      }
    } else {
      // Rente temporaire : Formule de la valeur actuelle d'une annuité
      const r = rendementNet / 100 / 12; // taux mensuel
      const n = dureeRente * 12; // nombre de mois
      
      if (r > 0) {
        capital = renteMensuelle * ((1 - Math.pow(1 + r, -n)) / r);
      } else {
        capital = renteMensuelle * n;
      }
      
      // Chart: décapitalisation progressive
      let capitalRestant = capital;
      const tauxMensuel = rendementNet / 100 / 12;
      
      for (let annee = 0; annee <= dureeRente; annee++) {
        data.push({ annee, capital: Math.round(Math.max(0, capitalRestant)) });
        
        // Simuler 12 mois
        for (let mois = 0; mois < 12; mois++) {
          capitalRestant = capitalRestant * (1 + tauxMensuel) - renteMensuelle;
        }
      }
    }

    return { capitalRequis: Math.round(capital), chartData: data };
  }, [renteMensuelle, dureeRente, rendementNet, mode]);

  // Format montant
  const formatMontant = (value: number): string => {
    if (value >= 1000000) {
      return `${(value / 1000000).toLocaleString("fr-FR", { maximumFractionDigits: 2 })} M€`;
    }
    return `${value.toLocaleString("fr-FR")} €`;
  };

  return (
    <Card className="bg-card border-border/50">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Target className="w-5 h-5 text-primary" />
          Simulation Retraite
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Calculez le capital nécessaire pour obtenir une rente mensuelle
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Rente mensuelle souhaitée */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label className="text-sm font-medium">Rente mensuelle souhaitée</Label>
            <span className="text-lg font-bold text-primary">
              {renteMensuelle.toLocaleString("fr-FR")} €
            </span>
          </div>
          <Slider
            value={[renteMensuelle]}
            onValueChange={(v) => setRenteMensuelle(v[0])}
            min={500}
            max={10000}
            step={100}
            className="py-2"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>500 €</span>
            <span>10 000 €</span>
          </div>
        </div>

        {/* Mode de rente */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Type de rente</Label>
          <RadioGroup
            value={mode}
            onValueChange={(v) => setMode(v as "perpetuelle" | "temporaire")}
            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
          >
            <Label
              htmlFor="perpetuelle"
              className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                mode === "perpetuelle"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <RadioGroupItem value="perpetuelle" id="perpetuelle" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Infinity className="w-4 h-4 text-primary" />
                  <span className="font-medium">Préserver le capital</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Rente perpétuelle, capital intact
                </p>
              </div>
            </Label>
            <Label
              htmlFor="temporaire"
              className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                mode === "temporaire"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <RadioGroupItem value="temporaire" id="temporaire" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-orange-500" />
                  <span className="font-medium">Consommer le capital</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Rente temporaire sur N années
                </p>
              </div>
            </Label>
          </RadioGroup>
        </div>

        {/* Durée de la rente (uniquement en mode temporaire) */}
        {mode === "temporaire" && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Durée de la rente
              </Label>
              <span className="text-lg font-bold text-foreground">
                {dureeRente} ans
              </span>
            </div>
            <Slider
              value={[dureeRente]}
              onValueChange={(v) => setDureeRente(v[0])}
              min={5}
              max={40}
              step={1}
              className="py-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>5 ans</span>
              <span>40 ans</span>
            </div>
          </div>
        )}

        {/* Rendement net estimé */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label className="text-sm font-medium">Rendement net estimé</Label>
            <span className="text-lg font-bold text-foreground">
              {rendementNet.toFixed(1)} %
            </span>
          </div>
          <Slider
            value={[rendementNet]}
            onValueChange={(v) => setRendementNet(v[0])}
            min={1}
            max={12}
            step={0.5}
            className="py-2"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>1%</span>
            <span>12%</span>
          </div>
        </div>

        {/* Résultat : Capital Requis */}
        <div className="bg-primary/10 rounded-2xl p-6 text-center">
          <p className="text-sm text-muted-foreground mb-2">Capital requis</p>
          <p className="text-3xl sm:text-4xl font-bold text-primary">
            {formatMontant(capitalRequis)}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            {mode === "perpetuelle" 
              ? "pour une rente perpétuelle (capital préservé)"
              : `pour une rente sur ${dureeRente} ans`
            }
          </p>
        </div>

        {/* Graphique de décapitalisation */}
        <DecapitalisationChart 
          data={chartData} 
          mode={mode}
          duree={mode === "temporaire" ? dureeRente : 30}
        />
      </CardContent>
    </Card>
  );
}
