import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  ReferenceDot,
} from "recharts";
import { ExternalLink, TrendingUp, TrendingDown, Target, PiggyBank, Banknote } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { CabinetData } from "@/lib/cabinet/types";
import { computeKpis } from "@/lib/cabinet/aggregate";
import { formatEuro, formatDate } from "@/lib/cabinet/format";
import {
  BP_ENCOURS_MILESTONES,
  BP_FISCAL_YEARS,
  BP_SHEET_URL,
  BP_VERSION,
  encoursTargetAt,
  fiscalYearAt,
} from "@/data/cabinet/businessPlan";

function GapBadge({ gap, base }: { gap: number; base: number }) {
  const pct = base > 0 ? (gap / base) * 100 : 0;
  const ahead = gap >= 0;
  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1",
        ahead ? "text-emerald-600 border-emerald-300" : "text-red-600 border-red-300"
      )}
    >
      {ahead ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
      {ahead ? "+" : "−"}
      {formatEuro(Math.abs(gap), true)} ({ahead ? "+" : ""}
      {pct.toLocaleString("fr-FR", { maximumFractionDigits: 1 })} %)
    </Badge>
  );
}

interface ComparisonCardProps {
  icon: typeof Target;
  title: string;
  real: number;
  target: number;
  realLabel: string;
  targetLabel: string;
  note?: string;
}

function ComparisonCard({ icon: Icon, title, real, target, realLabel, targetLabel, note }: ComparisonCardProps) {
  const pctDone = target > 0 ? Math.min(150, (real / target) * 100) : 0;
  return (
    <Card className="shadow-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <Icon className="w-4 h-4 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-end justify-between gap-2">
          <div>
            <p className="text-2xl font-semibold">{formatEuro(real)}</p>
            <p className="text-xs text-muted-foreground">{realLabel}</p>
          </div>
          <GapBadge gap={real - target} base={target} />
        </div>
        <div>
          <Progress value={Math.min(100, pctDone)} />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>
              {pctDone.toLocaleString("fr-FR", { maximumFractionDigits: 1 })} % de l'objectif
            </span>
            <span>
              {targetLabel} : {formatEuro(target)}
            </span>
          </div>
        </div>
        {note && <p className="text-xs text-muted-foreground">{note}</p>}
      </CardContent>
    </Card>
  );
}

export function BusinessPlanTab({ data }: { data: CabinetData }) {
  const kpis = computeKpis(data);
  const asOf = data.snapshotDate;
  const currentFy = fiscalYearAt(asOf);
  const targetAtDate = encoursTargetAt(asOf) ?? 0;

  const chartData = BP_ENCOURS_MILESTONES.map((m) => ({
    label: m.label,
    date: m.date,
    plan: m.encours,
  }));

  // Positionne le réel sur le jalon le plus proche de la date des données.
  const closestMilestone = BP_ENCOURS_MILESTONES.reduce((best, m) =>
    Math.abs(new Date(m.date).getTime() - new Date(asOf).getTime()) <
    Math.abs(new Date(best.date).getTime() - new Date(asOf).getTime())
      ? m
      : best
  );

  const remainingToFyTarget = currentFy ? currentFy.encoursFin - kpis.encoursGlobal : 0;
  const daysLeft = currentFy
    ? Math.max(0, Math.round((new Date(currentFy.end).getTime() - new Date(asOf).getTime()) / 86_400_000))
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <p className="text-sm text-muted-foreground">
          Comparaison du réalisé (données « Liste Client NOUS » au {formatDate(asOf)}) avec la
          trajectoire du business plan <span className="font-medium text-foreground">{BP_VERSION}</span>{" "}
          — exercice fiscal du 1<sup>er</sup> juillet au 30 juin.
        </p>
        <Button variant="ghost" size="sm" asChild className="gap-1.5 shrink-0">
          <a href={BP_SHEET_URL} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="w-4 h-4" />
            Ouvrir le BP
          </a>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <ComparisonCard
          icon={Target}
          title="Encours vs trajectoire BP"
          real={kpis.encoursGlobal}
          target={targetAtDate}
          realLabel={`Encours réel au ${formatDate(asOf)}`}
          targetLabel={`Cible BP au ${formatDate(asOf)} (interpolée)`}
        />
        {currentFy && (
          <ComparisonCard
            icon={PiggyBank}
            title={`Collecte exercice ${currentFy.label}`}
            real={kpis.collecte}
            target={currentFy.collecte}
            realLabel="Collecte réalisée (feuille « Liste Client NOUS »)"
            targetLabel="Objectif BP de l'exercice"
            note={
              remainingToFyTarget > 0
                ? `Il reste ${formatEuro(remainingToFyTarget)} d'encours à constituer pour atteindre la cible de fin d'exercice (${formatEuro(currentFy.encoursFin)}) dans ${daysLeft} jours.`
                : `Cible d'encours de fin d'exercice (${formatEuro(currentFy?.encoursFin ?? 0)}) déjà dépassée.`
            }
          />
        )}
        {currentFy && (
          <ComparisonCard
            icon={Banknote}
            title={`CA exercice ${currentFy.label}`}
            real={kpis.caTotal}
            target={currentFy.ca}
            realLabel="CA assureurs constaté (feuille)"
            targetLabel="Objectif CA BP de l'exercice"
            note="Indicatif : le CA constaté provient du tableau « CA par assureur » de la feuille et peut ne pas couvrir exactement l'exercice ni toutes les sources (honoraires, défisc., prévoyance)."
          />
        )}
      </div>

      <Card className="shadow-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">
            Trajectoire d'encours sous gestion : BP vs réalisé
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ left: 8, right: 24, top: 12 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" fontSize={11} />
                <YAxis tickFormatter={(v) => formatEuro(v, true)} fontSize={12} width={64} />
                <Tooltip formatter={(v: number) => formatEuro(v)} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="plan"
                  name="Objectif BP"
                  stroke="hsl(43, 51%, 34%)"
                  strokeWidth={2}
                  strokeDasharray="6 4"
                  dot={{ r: 3 }}
                />
                <ReferenceDot
                  x={closestMilestone.label}
                  y={kpis.encoursGlobal}
                  r={7}
                  fill="hsl(15, 100%, 59%)"
                  stroke="white"
                  strokeWidth={2}
                  label={{
                    value: `Réel : ${formatEuro(kpis.encoursGlobal, true)}`,
                    position: "bottom",
                    fontSize: 12,
                    fill: "hsl(15, 100%, 59%)",
                  }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Le point orange situe l'encours réel ({formatEuro(kpis.encoursGlobal)} au {formatDate(asOf)})
            sur le jalon BP le plus proche ({closestMilestone.label} :{" "}
            {formatEuro(closestMilestone.encours)}).
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Objectifs annuels du business plan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-muted-foreground border-b">
                  <th className="py-2 pr-3 font-medium">Exercice</th>
                  <th className="py-2 pr-3 font-medium text-right">Encours fin d'exercice</th>
                  <th className="py-2 pr-3 font-medium text-right">Collecte</th>
                  <th className="py-2 pr-3 font-medium text-right">CA</th>
                  <th className="py-2 pr-3 font-medium text-right">Bénéfice</th>
                  <th className="py-2 font-medium">Statut</th>
                </tr>
              </thead>
              <tbody>
                {BP_FISCAL_YEARS.map((fy) => {
                  const isCurrent = currentFy?.label === fy.label;
                  return (
                    <tr key={fy.label} className={cn("border-b last:border-0", isCurrent && "bg-primary/5")}>
                      <td className="py-2 pr-3 whitespace-nowrap font-medium">{fy.label}</td>
                      <td className="py-2 pr-3 text-right whitespace-nowrap">{formatEuro(fy.encoursFin)}</td>
                      <td className="py-2 pr-3 text-right whitespace-nowrap">{formatEuro(fy.collecte)}</td>
                      <td className="py-2 pr-3 text-right whitespace-nowrap">{formatEuro(fy.ca)}</td>
                      <td className="py-2 pr-3 text-right whitespace-nowrap">{formatEuro(fy.benefice)}</td>
                      <td className="py-2">
                        {isCurrent ? (
                          <span className="flex items-center gap-2 flex-wrap">
                            <Badge>En cours</Badge>
                            <GapBadge gap={kpis.encoursGlobal - fy.encoursFin} base={fy.encoursFin} />
                          </span>
                        ) : asOf > fy.end ? (
                          <Badge variant="secondary">Clos</Badge>
                        ) : (
                          <Badge variant="outline">À venir</Badge>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Pour l'exercice en cours, l'écart affiché compare l'encours réel actuel à la cible de fin
            d'exercice.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
