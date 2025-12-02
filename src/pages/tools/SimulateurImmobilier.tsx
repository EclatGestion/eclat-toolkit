import { useState, useMemo } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { InputSlider } from "@/components/simulators/interets-composes/InputSlider";
import { TauxBadges } from "@/components/simulators/immobilier/TauxBadges";
import { DurationPills } from "@/components/simulators/immobilier/DurationPills";
import { DonutChart } from "@/components/simulators/immobilier/DonutChart";
import { CapacityBar } from "@/components/simulators/immobilier/CapacityBar";
import { Home, TrendingUp, ArrowRight } from "lucide-react";

function calculateMensualite(montant: number, tauxAnnuel: number, dureeAnnees: number) {
  if (montant <= 0 || tauxAnnuel <= 0 || dureeAnnees <= 0) {
    return { mensualite: 0, coutTotal: 0, interets: 0 };
  }
  
  const tauxMensuel = tauxAnnuel / 100 / 12;
  const nbMensualites = dureeAnnees * 12;
  
  const mensualite = (montant * tauxMensuel * Math.pow(1 + tauxMensuel, nbMensualites)) 
                     / (Math.pow(1 + tauxMensuel, nbMensualites) - 1);
  
  const coutTotal = mensualite * nbMensualites;
  const interets = coutTotal - montant;
  
  return {
    mensualite: Math.round(mensualite),
    coutTotal: Math.round(coutTotal),
    interets: Math.round(interets)
  };
}

function calculateCapacite(
  salaire: number,
  charges: number,
  tauxEndettement: number,
  tauxInteret: number,
  dureeAnnees: number
) {
  const mensualiteMax = (salaire * (tauxEndettement / 100)) - charges;
  
  if (mensualiteMax <= 0 || tauxInteret <= 0 || dureeAnnees <= 0) {
    return { capacite: 0, mensualiteMax: 0 };
  }
  
  const tauxMensuel = tauxInteret / 100 / 12;
  const nbMensualites = dureeAnnees * 12;
  
  const capacite = mensualiteMax * 
    (Math.pow(1 + tauxMensuel, nbMensualites) - 1) / 
    (tauxMensuel * Math.pow(1 + tauxMensuel, nbMensualites));
  
  return {
    capacite: Math.max(0, Math.round(capacite)),
    mensualiteMax: Math.max(0, Math.round(mensualiteMax))
  };
}

export default function SimulateurImmobilier() {
  const [activeTab, setActiveTab] = useState("mensualite");
  
  // Tab A - Mensualité
  const [montantProjet, setMontantProjet] = useState(250000);
  const [apportPersonnel, setApportPersonnel] = useState(30000);
  const [dureeMensualite, setDureeMensualite] = useState(20);
  const [tauxMensualite, setTauxMensualite] = useState(3.80);

  // Tab B - Capacité
  const [salaire, setSalaire] = useState(4000);
  const [charges, setCharges] = useState(200);
  const [tauxEndettement, setTauxEndettement] = useState(35);
  const [dureeCapacite, setDureeCapacite] = useState(20);
  const [tauxCapacite, setTauxCapacite] = useState(3.90);
  const [apportCapacite, setApportCapacite] = useState(30000);

  const resultMensualite = useMemo(() => {
    const montantEmprunte = Math.max(0, montantProjet - apportPersonnel);
    return calculateMensualite(montantEmprunte, tauxMensualite, dureeMensualite);
  }, [montantProjet, apportPersonnel, dureeMensualite, tauxMensualite]);

  const resultCapacite = useMemo(() => {
    return calculateCapacite(salaire, charges, tauxEndettement, tauxCapacite, dureeCapacite);
  }, [salaire, charges, tauxEndettement, tauxCapacite, dureeCapacite]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <MainLayout title="Simulateur Immobilier">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Carte Gauche - Paramètres */}
        <div className="bg-card rounded-3xl p-6 md:p-8 shadow-card">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 rounded-2xl bg-muted p-1 mb-6">
              <TabsTrigger 
                value="mensualite" 
                className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Home className="w-4 h-4 mr-2" />
                Mensualité
              </TabsTrigger>
              <TabsTrigger 
                value="capacite"
                className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Capacité
              </TabsTrigger>
            </TabsList>

            {/* Onglet A - Mensualité */}
            <TabsContent value="mensualite" className="space-y-6 mt-0">
              <InputSlider
                label="Montant du Projet"
                value={montantProjet}
                onChange={setMontantProjet}
                min={50000}
                max={1000000}
                step={5000}
                unit="€"
              />
              
              <InputSlider
                label="Apport Personnel"
                value={apportPersonnel}
                onChange={setApportPersonnel}
                min={0}
                max={200000}
                step={1000}
                unit="€"
              />

              <div className="space-y-3">
                <Label className="text-sm font-medium text-foreground">Durée du prêt</Label>
                <DurationPills
                  durations={[10, 15, 20, 25]}
                  selectedDuration={dureeMensualite}
                  onSelect={setDureeMensualite}
                />
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium text-foreground">Taux d'intérêt</Label>
                <TauxBadges selectedRate={tauxMensualite} onSelect={setTauxMensualite} />
                <InputSlider
                  label=""
                  value={tauxMensualite}
                  onChange={setTauxMensualite}
                  min={1}
                  max={6}
                  step={0.1}
                  unit="%"
                  formatValue={(v) => `${v.toFixed(2)} %`}
                />
              </div>
            </TabsContent>

            {/* Onglet B - Capacité */}
            <TabsContent value="capacite" className="space-y-6 mt-0">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">Salaire Net Mensuel (Foyer)</Label>
                <Input
                  type="number"
                  value={salaire}
                  onChange={(e) => setSalaire(Number(e.target.value))}
                  className="bg-muted/50 border-0 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">Charges Actuelles (crédits...)</Label>
                <Input
                  type="number"
                  value={charges}
                  onChange={(e) => setCharges(Number(e.target.value))}
                  className="bg-muted/50 border-0 rounded-xl"
                />
              </div>

              <InputSlider
                label="Taux d'Endettement Max"
                value={tauxEndettement}
                onChange={setTauxEndettement}
                min={25}
                max={40}
                step={1}
                unit="%"
                formatValue={(v) => `${v} %`}
              />

              <div className="space-y-3">
                <Label className="text-sm font-medium text-foreground">Durée souhaitée</Label>
                <DurationPills
                  durations={[15, 20, 25]}
                  selectedDuration={dureeCapacite}
                  onSelect={setDureeCapacite}
                />
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium text-foreground">Taux du marché</Label>
                <TauxBadges selectedRate={tauxCapacite} onSelect={setTauxCapacite} />
                <InputSlider
                  label=""
                  value={tauxCapacite}
                  onChange={setTauxCapacite}
                  min={1}
                  max={6}
                  step={0.1}
                  unit="%"
                  formatValue={(v) => `${v.toFixed(2)} %`}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Carte Droite - Résultats */}
        <div className="bg-card rounded-3xl p-6 md:p-8 shadow-card">
          <Tabs value={activeTab} className="w-full">
            <TabsList className="invisible h-0 overflow-hidden">
              <TabsTrigger value="mensualite">Mensualité</TabsTrigger>
              <TabsTrigger value="capacite">Capacité</TabsTrigger>
            </TabsList>

            {/* Résultats Mensualité */}
            <TabsContent value="mensualite" className="mt-0">
              <div className="text-center mb-8">
                <p className="text-sm text-muted-foreground mb-2">Mensualité Estimée</p>
                <p className="text-4xl md:text-5xl font-bold text-primary">
                  {formatCurrency(resultMensualite.mensualite)}
                  <span className="text-lg font-normal text-muted-foreground">/mois</span>
                </p>
              </div>

              <DonutChart
                capital={Math.max(0, montantProjet - apportPersonnel)}
                interets={resultMensualite.interets}
                coutTotal={resultMensualite.coutTotal}
              />

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="bg-muted/50 rounded-2xl p-4 text-center">
                  <p className="text-xs text-muted-foreground">Montant emprunté</p>
                  <p className="text-lg font-semibold text-foreground">
                    {formatCurrency(Math.max(0, montantProjet - apportPersonnel))}
                  </p>
                </div>
                <div className="bg-muted/50 rounded-2xl p-4 text-center">
                  <p className="text-xs text-muted-foreground">Nombre de mensualités</p>
                  <p className="text-lg font-semibold text-foreground">
                    {dureeMensualite * 12}
                  </p>
                </div>
              </div>
            </TabsContent>

            {/* Résultats Capacité */}
            <TabsContent value="capacite" className="mt-0">
              <div className="text-center mb-8">
                <p className="text-sm text-muted-foreground mb-2">Montant Maximum Empruntable</p>
                <p className="text-4xl md:text-5xl font-bold text-primary">
                  {formatCurrency(resultCapacite.capacite)}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Mensualité max : {formatCurrency(resultCapacite.mensualiteMax)}/mois
                </p>
              </div>

              <div className="space-y-6">
                <CapacityBar capacite={resultCapacite.capacite} apport={apportCapacite} />

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground">Votre Apport</Label>
                  <Input
                    type="number"
                    value={apportCapacite}
                    onChange={(e) => setApportCapacite(Number(e.target.value))}
                    className="bg-muted/50 border-0 rounded-xl"
                    placeholder="30 000 €"
                  />
                </div>
              </div>

              <div className="mt-8 p-4 bg-primary/5 rounded-2xl border border-primary/20">
                <p className="text-sm text-muted-foreground">
                  Ce montant vous permet d'investir ?
                </p>
                <Button className="mt-3 w-full rounded-xl">
                  Voir nos biens éligibles
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
}
