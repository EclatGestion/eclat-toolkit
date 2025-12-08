import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PiggyBank, TrendingUp, BookOpen, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface ResultatsEpargneProps {
  capaciteEpargne: number;
  tauxEpargne: number;
  revenusTotaux: number;
  depensesFixes: number;
  depensesVariables: number;
}

export function ResultatsEpargne({
  capaciteEpargne,
  tauxEpargne,
  revenusTotaux,
  depensesFixes,
  depensesVariables,
}: ResultatsEpargneProps) {
  // Couleur du taux selon la valeur
  const getTauxColor = () => {
    if (tauxEpargne < 10) return "text-red-500 bg-red-500/10";
    if (tauxEpargne < 20) return "text-amber-500 bg-amber-500/10";
    return "text-emerald-500 bg-emerald-500/10";
  };

  const getTauxLabel = () => {
    if (tauxEpargne < 10) return "À améliorer";
    if (tauxEpargne < 20) return "Correct";
    return "Excellent";
  };

  // Données pour le camembert
  const pieData = [
    { name: "Dépenses fixes", value: depensesFixes, color: "#f97316" },
    { name: "Dépenses variables", value: depensesVariables, color: "#a855f7" },
    { name: "Épargne", value: Math.max(0, capaciteEpargne), color: "#10b981" },
  ];

  // Données pour la projection 12 mois
  const projectionData = Array.from({ length: 12 }, (_, i) => ({
    mois: ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"][i],
    epargne: Math.max(0, capaciteEpargne) * (i + 1),
  }));

  return (
    <div className="space-y-6">
      {/* KPIs principaux */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="rounded-3xl shadow-card bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <PiggyBank className="h-6 w-6 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">
                  Capacité d'épargne mensuelle
                </span>
              </div>
              <p className={cn(
                "text-4xl font-bold",
                capaciteEpargne >= 0 ? "text-primary" : "text-red-500"
              )}>
                {capaciteEpargne.toLocaleString("fr-FR")} €
              </p>
              {capaciteEpargne < 0 && (
                <p className="text-sm text-red-500 mt-2">
                  Attention : vos dépenses dépassent vos revenus
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="rounded-3xl shadow-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-xl bg-muted">
                  <TrendingUp className="h-6 w-6 text-muted-foreground" />
                </div>
                <span className="text-sm text-muted-foreground">
                  Taux d'épargne
                </span>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-4xl font-bold">
                  {tauxEpargne.toFixed(1)}%
                </p>
                <span className={cn("px-3 py-1 rounded-full text-sm font-medium", getTauxColor())}>
                  {getTauxLabel()}
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Camembert répartition */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="rounded-3xl shadow-card">
            <CardHeader>
              <CardTitle className="text-base">Répartition du budget</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => `${value.toLocaleString("fr-FR")} €`}
                      contentStyle={{
                        borderRadius: "12px",
                        border: "none",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-4 mt-4 flex-wrap">
                {pieData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-xs text-muted-foreground">{item.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Projection 12 mois */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card className="rounded-3xl shadow-card">
            <CardHeader>
              <CardTitle className="text-base">Projection sur 12 mois</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={projectionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis
                      dataKey="mois"
                      tick={{ fontSize: 11 }}
                      stroke="hsl(var(--muted-foreground))"
                    />
                    <YAxis
                      tick={{ fontSize: 11 }}
                      stroke="hsl(var(--muted-foreground))"
                      tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                    />
                    <Tooltip
                      formatter={(value: number) => [`${value.toLocaleString("fr-FR")} €`, "Épargne cumulée"]}
                      contentStyle={{
                        borderRadius: "12px",
                        border: "none",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      }}
                    />
                    <Bar
                      dataKey="epargne"
                      fill="hsl(var(--primary))"
                      radius={[6, 6, 0, 0]}
                      barSize={20}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-center text-sm text-muted-foreground mt-4">
                Épargne potentielle sur 1 an :{" "}
                <span className="font-semibold text-primary">
                  {(Math.max(0, capaciteEpargne) * 12).toLocaleString("fr-FR")} €
                </span>
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Encart Académie */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <Card className="rounded-3xl shadow-card bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border-primary/20">
          <CardContent className="py-6">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">Envie d'aller plus loin ?</p>
                  <p className="text-sm text-muted-foreground">
                    Découvrez nos conseils pour optimiser votre épargne
                  </p>
                </div>
              </div>
              <Button asChild className="rounded-xl">
                <Link to="/blog/comment-ameliorer-capacite-epargne">
                  Lire l'article
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
