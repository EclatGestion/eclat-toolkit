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
  CartesianGrid,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CabinetData } from "@/lib/cabinet/types";
import { sumBy, subscriptionsByYear, BucketTotal } from "@/lib/cabinet/aggregate";
import { formatEuro, formatPercent } from "@/lib/cabinet/format";

const PALETTE = [
  "hsl(43, 51%, 34%)",
  "hsl(15, 100%, 59%)",
  "hsl(172, 66%, 50%)",
  "hsl(227, 100%, 59%)",
  "hsl(291, 64%, 42%)",
  "hsl(38, 92%, 50%)",
  "hsl(0, 0%, 25%)",
  "hsl(340, 82%, 52%)",
  "hsl(122, 39%, 49%)",
  "hsl(0, 0%, 60%)",
];

function euroTooltip(value: number | string) {
  return formatEuro(typeof value === "number" ? value : Number(value));
}

function DonutCard({ title, data }: { title: string; data: BucketTotal[] }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  return (
    <Card className="shadow-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="name" innerRadius={50} outerRadius={75} paddingAngle={2}>
                {data.map((_, i) => (
                  <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                ))}
              </Pie>
              <Tooltip formatter={euroTooltip} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 space-y-1 max-h-36 overflow-y-auto pr-1">
          {data.map((d, i) => (
            <div key={d.name} className="flex items-center gap-2 text-sm">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: PALETTE[i % PALETTE.length] }} />
              <span className="flex-1 truncate text-muted-foreground">
                {d.name} <span className="text-xs">({d.count})</span>
              </span>
              <span className="font-medium">{formatEuro(d.value, true)}</span>
              <span className="text-xs text-muted-foreground w-12 text-right">
                {total > 0 ? ((d.value / total) * 100).toFixed(1) : "0"}%
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function OverviewTab({ data }: { data: CabinetData }) {
  const byCompany = sumBy(data.contracts, (c) => c.company);
  const byProfile = sumBy(data.contracts, (c) => c.profile);
  const byType = sumBy(data.contracts, (c) => c.type);
  const byAdvisor = sumBy(data.contracts, (c) => c.advisor);
  const byYear = subscriptionsByYear(data.contracts);
  const totalEncours = byCompany.reduce((s, d) => s + d.value, 0);
  const perf = data.perfByProfile.filter((p) => p.global !== null);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="shadow-card lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Encours par compagnie</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ height: Math.max(240, byCompany.length * 32) }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={byCompany} layout="vertical" margin={{ left: 8, right: 16 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" tickFormatter={(v) => formatEuro(v, true)} fontSize={12} />
                  <YAxis type="category" dataKey="name" width={150} fontSize={12} />
                  <Tooltip formatter={euroTooltip} />
                  <Bar dataKey="value" name="Encours" fill="hsl(43, 51%, 34%)" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Répartition par conseiller</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {byAdvisor.map((a, i) => (
                <div key={a.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">{a.name}</span>
                    <span className="text-muted-foreground">
                      {formatEuro(a.value, true)} · {a.count} contrats
                    </span>
                  </div>
                  <Progress value={totalEncours > 0 ? (a.value / totalEncours) * 100 : 0} />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Performance par profil</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                {perf.map((p) => (
                  <div key={p.profile} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{p.profile}</span>
                    <span className="flex items-center gap-3">
                      <span className={p.global! >= 0 ? "text-emerald-600 font-medium" : "text-red-600 font-medium"}>
                        {formatPercent(p.global)}
                      </span>
                      <span className="text-xs text-muted-foreground w-20 text-right">
                        {formatPercent(p.annualized)} /an
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DonutCard title="Répartition par profil de risque" data={byProfile} />
        <DonutCard title="Répartition par type de produit" data={byType} />
        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Encours souscrit par année</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={byYear}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" fontSize={12} />
                  <YAxis tickFormatter={(v) => formatEuro(v, true)} fontSize={12} width={56} />
                  <Tooltip formatter={euroTooltip} />
                  <Bar dataKey="value" name="Encours" fill="hsl(172, 66%, 50%)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Encours actuel des contrats, ventilé par année de souscription.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
