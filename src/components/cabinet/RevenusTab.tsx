import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CabinetData } from "@/lib/cabinet/types";
import { monthlyCashflow } from "@/lib/cabinet/aggregate";
import { formatEuro } from "@/lib/cabinet/format";

function euroTooltip(value: number | string) {
  return formatEuro(typeof value === "number" ? value : Number(value));
}

export function RevenusTab({ data }: { data: CabinetData }) {
  const caAssureurs = [...data.caAssureurs]
    .filter((a) => (a.caTotal ?? 0) > 0)
    .sort((a, b) => (b.caTotal ?? 0) - (a.caTotal ?? 0));
  const cashflow = monthlyCashflow(data.transactions).slice(-12);
  const feesPending = data.entryFees.filter((f) => !f.paid);
  const feesPaid = data.entryFees.filter((f) => f.paid);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Chiffre d'affaires par assureur</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ height: Math.max(220, caAssureurs.length * 32) }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={caAssureurs} layout="vertical" margin={{ left: 8, right: 16 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" tickFormatter={(v) => formatEuro(v, true)} fontSize={12} />
                  <YAxis type="category" dataKey="assureur" width={140} fontSize={12} />
                  <Tooltip formatter={euroTooltip} />
                  <Legend />
                  <Bar dataKey="caFraisEntreeCIF" stackId="ca" name="Frais d'entrée CIF" fill="hsl(43, 51%, 34%)" />
                  <Bar dataKey="caFraisEntreeIAS" stackId="ca" name="Frais d'entrée IAS" fill="hsl(15, 100%, 59%)" />
                  <Bar dataKey="caEncoursCIF" stackId="ca" name="Encours CIF" fill="hsl(227, 100%, 59%)" />
                  <Bar dataKey="caEncoursIAS" stackId="ca" name="Encours IAS" fill="hsl(172, 66%, 50%)" />
                  <Bar dataKey="caStructures" stackId="ca" name="Structurés" fill="hsl(291, 64%, 42%)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Trésorerie cabinet (Qonto, 12 derniers mois)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cashflow}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" fontSize={11} />
                  <YAxis tickFormatter={(v) => formatEuro(v, true)} fontSize={12} width={56} />
                  <Tooltip formatter={euroTooltip} />
                  <Legend />
                  <Bar dataKey="credit" name="Encaissements" fill="hsl(122, 39%, 49%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="debit" name="Dépenses" fill="hsl(0, 72%, 51%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              D'après l'export Qonto présent dans la feuille « Liste Client NOUS ».
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            Commissions frais d'entrée
            {feesPending.length > 0 && (
              <Badge variant="destructive">
                {feesPending.length} en attente · {formatEuro(feesPending.reduce((s, f) => s + f.commission, 0))}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-muted-foreground border-b">
                  <th className="py-2 pr-3 font-medium">Client</th>
                  <th className="py-2 pr-3 font-medium">Produit</th>
                  <th className="py-2 pr-3 font-medium">Contrat</th>
                  <th className="py-2 pr-3 font-medium">Versement</th>
                  <th className="py-2 pr-3 font-medium text-right">Valorisation</th>
                  <th className="py-2 pr-3 font-medium text-right">Commission</th>
                  <th className="py-2 font-medium">Statut</th>
                </tr>
              </thead>
              <tbody>
                {[...feesPending, ...feesPaid].map((f, i) => (
                  <tr key={i} className="border-b last:border-0">
                    <td className="py-2 pr-3 whitespace-nowrap">{f.client}</td>
                    <td className="py-2 pr-3 whitespace-nowrap">{f.product}</td>
                    <td className="py-2 pr-3 whitespace-nowrap">{f.contract}</td>
                    <td className="py-2 pr-3 whitespace-nowrap">{f.month}</td>
                    <td className="py-2 pr-3 text-right whitespace-nowrap">{formatEuro(f.valorisation)}</td>
                    <td className="py-2 pr-3 text-right font-medium whitespace-nowrap">{formatEuro(f.commission)}</td>
                    <td className="py-2">
                      {f.paid ? (
                        <Badge variant="secondary">Payée {f.paid !== "StrikeIn" ? `· ${f.paid}` : ""}</Badge>
                      ) : (
                        <Badge variant="destructive">En attente</Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">
              Mandats de gestion · rétrocessions{" "}
              <span className="text-muted-foreground font-normal">
                ({formatEuro(data.mandats.reduce((s, m) => s + (m.retroAnnuelle ?? 0), 0))}/an)
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-muted-foreground border-b">
                    <th className="py-2 pr-3 font-medium">Client</th>
                    <th className="py-2 pr-3 font-medium">Assureur</th>
                    <th className="py-2 pr-3 font-medium">Mandat</th>
                    <th className="py-2 pr-3 font-medium text-right">Valorisation</th>
                    <th className="py-2 font-medium text-right">Rétro / an</th>
                  </tr>
                </thead>
                <tbody>
                  {data.mandats.map((m, i) => (
                    <tr key={i} className="border-b last:border-0">
                      <td className="py-2 pr-3 whitespace-nowrap">{m.client}</td>
                      <td className="py-2 pr-3 whitespace-nowrap">{m.assureur}</td>
                      <td className="py-2 pr-3 whitespace-nowrap">{m.mandat}</td>
                      <td className="py-2 pr-3 text-right whitespace-nowrap">{formatEuro(m.valorisation)}</td>
                      <td className="py-2 text-right font-medium whitespace-nowrap">{formatEuro(m.retroAnnuelle)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">
              Revenus récurrents (prévoyance & honoraires){" "}
              <span className="text-muted-foreground font-normal">
                ({formatEuro(data.prevoyance.reduce((s, p) => s + p.mensuelHT, 0))}/mois HT)
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-muted-foreground border-b">
                    <th className="py-2 pr-3 font-medium">Client</th>
                    <th className="py-2 pr-3 font-medium">Établissement</th>
                    <th className="py-2 pr-3 font-medium">Intitulé</th>
                    <th className="py-2 font-medium text-right">Mensuel HT</th>
                  </tr>
                </thead>
                <tbody>
                  {data.prevoyance.map((p, i) => (
                    <tr key={i} className="border-b last:border-0">
                      <td className="py-2 pr-3 whitespace-nowrap">
                        {p.nom} {p.prenom}
                      </td>
                      <td className="py-2 pr-3 whitespace-nowrap">{p.etablissement ?? "—"}</td>
                      <td className="py-2 pr-3 whitespace-nowrap">{p.intitule}</td>
                      <td className="py-2 text-right font-medium whitespace-nowrap">{formatEuro(p.mensuelHT)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
