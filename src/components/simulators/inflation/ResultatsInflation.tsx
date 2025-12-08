import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { TrendingDown, AlertTriangle, CheckCircle, ArrowRight } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

interface ResultatsInflationProps {
  montant: number;
  inflation: number;
  duree: number;
  comparatifActif: boolean;
  rendement: number;
}

export function ResultatsInflation({
  montant,
  inflation,
  duree,
  comparatifActif,
  rendement,
}: ResultatsInflationProps) {
  // Calculs
  const inflationRate = inflation / 100;
  const rendementRate = rendement / 100;

  // Valeur réelle future (pouvoir d'achat après inflation)
  const valeurFutureReelle = montant / Math.pow(1 + inflationRate, duree);
  const pertePouvoirAchat = montant - valeurFutureReelle;
  const pourcentagePerte = (pertePouvoirAchat / montant) * 100;

  // Avec rendement (si comparatif activé)
  const valeurFutureRendement = montant * Math.pow(1 + rendementRate, duree);
  const valeurReelleRendement = valeurFutureRendement / Math.pow(1 + inflationRate, duree);
  const gainReel = valeurReelleRendement - valeurFutureReelle;

  // Données pour le graphique barres (évolution année par année)
  const yearlyData = Array.from({ length: duree + 1 }, (_, i) => {
    const valeurNominale = montant;
    const valeurReelle = montant / Math.pow(1 + inflationRate, i);
    const valeurAvecRendement = comparatifActif
      ? (montant * Math.pow(1 + rendementRate, i)) / Math.pow(1 + inflationRate, i)
      : undefined;

    return {
      annee: `Année ${i}`,
      valeurNominale,
      valeurReelle: Math.round(valeurReelle),
      valeurAvecRendement: valeurAvecRendement ? Math.round(valeurAvecRendement) : undefined,
    };
  });

  // Données pour le camembert
  const pieData = [
    { name: "Conservé", value: Math.round(valeurFutureReelle), color: "hsl(var(--chart-2))" },
    { name: "Perdu", value: Math.round(pertePouvoirAchat), color: "hsl(var(--destructive))" },
  ];

  const formatEuro = (value: number) =>
    new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(value);

  return (
    <div className="space-y-6">
      {/* KPIs principaux */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Perte pouvoir d'achat */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="rounded-3xl shadow-card border-destructive/20 bg-destructive/5">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Pouvoir d'achat perdu</p>
                  <p className="text-3xl font-bold text-destructive">
                    {formatEuro(pertePouvoirAchat)}
                  </p>
                  <p className="text-sm text-destructive/80 mt-1">
                    -{pourcentagePerte.toFixed(1)}% en {duree} ans
                  </p>
                </div>
                <div className="p-3 rounded-2xl bg-destructive/10">
                  <TrendingDown className="h-6 w-6 text-destructive" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Valeur réelle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="rounded-3xl shadow-card">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Valeur réelle de l'épargne</p>
                  <p className="text-3xl font-bold text-foreground">
                    {formatEuro(valeurFutureReelle)}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    (équivalent pouvoir d'achat)
                  </p>
                </div>
                <div className="p-3 rounded-2xl bg-muted">
                  <AlertTriangle className="h-6 w-6 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Avec rendement (si comparatif) */}
        {comparatifActif && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="rounded-3xl shadow-card border-green-500/20 bg-green-500/5">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Avec rendement ({rendement}%)</p>
                    <p className="text-3xl font-bold text-green-600">
                      {formatEuro(valeurReelleRendement)}
                    </p>
                    <p className="text-sm text-green-600/80 mt-1">
                      +{formatEuro(gainReel)} vs sans rendement
                    </p>
                  </div>
                  <div className="p-3 rounded-2xl bg-green-500/10">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graphique barres évolution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="rounded-3xl shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Évolution du pouvoir d'achat</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={yearlyData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <XAxis
                      dataKey="annee"
                      tick={{ fontSize: 10 }}
                      tickFormatter={(value) => value.replace("Année ", "A")}
                    />
                    <YAxis
                      tick={{ fontSize: 10 }}
                      tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                    />
                    <Tooltip
                      formatter={(value: number) => formatEuro(value)}
                      labelFormatter={(label) => label}
                      contentStyle={{
                        borderRadius: "12px",
                        border: "none",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      }}
                    />
                    <Bar
                      dataKey="valeurReelle"
                      name="Valeur réelle"
                      fill="hsl(var(--destructive))"
                      radius={[4, 4, 0, 0]}
                    />
                    {comparatifActif && (
                      <Bar
                        dataKey="valeurAvecRendement"
                        name="Avec rendement"
                        fill="hsl(var(--chart-2))"
                        radius={[4, 4, 0, 0]}
                      />
                    )}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Camembert répartition */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="rounded-3xl shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Répartition après {duree} ans</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={4}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Legend />
                    <Tooltip formatter={(value: number) => formatEuro(value)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Message pédagogique */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="rounded-3xl shadow-card bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="py-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-primary/10 shrink-0">
                <AlertTriangle className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">
                  {pertePouvoirAchat > 10000
                    ? "⚠️ Attention : votre épargne perd significativement de sa valeur !"
                    : "💡 L'inflation érode votre pouvoir d'achat chaque année."}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {comparatifActif && gainReel > 0
                    ? `En plaçant votre épargne à ${rendement}%, vous préservez votre pouvoir d'achat et gagnez ${formatEuro(gainReel)} de plus.`
                    : "Placer votre épargne sur des supports rémunérés peut limiter l'impact de l'inflation."}
                </p>
              </div>
              <ArrowRight className="h-5 w-5 text-primary shrink-0" />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
