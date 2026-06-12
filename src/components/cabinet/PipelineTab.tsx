import { Target, HandCoins, Layers } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CabinetData } from "@/lib/cabinet/types";
import { formatEuro } from "@/lib/cabinet/format";

export function PipelineTab({ data }: { data: CabinetData }) {
  const pipeline = [...data.pipeline].sort((a, b) => b.expected - a.expected);
  const pipelineTotal = pipeline.reduce((s, p) => s + p.expected, 0);

  // Montants appelés sur les engagements Altaroc = encours actuels des contrats correspondants
  const calledByContract = new Map(
    data.contracts
      .filter((c) => c.company.toLowerCase() === "altaroc")
      .map((c) => [c.contract.toLowerCase(), c.encours ?? 0])
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="shadow-card lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Target className="w-4 h-4 text-primary" />
              Pipeline de souscriptions
              <Badge variant="secondary">{formatEuro(pipelineTotal)}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-muted-foreground border-b">
                    <th className="py-2 pr-3 font-medium">Client</th>
                    <th className="py-2 pr-3 font-medium">Compagnie</th>
                    <th className="py-2 pr-3 font-medium">Projet</th>
                    <th className="py-2 font-medium text-right">Montant attendu</th>
                  </tr>
                </thead>
                <tbody>
                  {pipeline.map((p, i) => (
                    <tr key={i} className="border-b last:border-0">
                      <td className="py-2 pr-3 whitespace-nowrap font-medium">{p.client}</td>
                      <td className="py-2 pr-3 whitespace-nowrap">{p.company || "—"}</td>
                      <td className="py-2 pr-3 whitespace-nowrap">{p.contract || "—"}</td>
                      <td className="py-2 text-right whitespace-nowrap font-medium">{formatEuro(p.expected)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <HandCoins className="w-4 h-4 text-primary" />
                Avances en cours
                <Badge variant="secondary">
                  {formatEuro(data.avances.reduce((s, a) => s + a.amount, 0))}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {data.avances.map((a, i) => (
                <div key={i} className="flex items-center justify-between gap-3 text-sm">
                  <div className="min-w-0">
                    <p className="font-medium truncate">{a.client}</p>
                    <p className="text-xs text-muted-foreground truncate">{a.contract}</p>
                  </div>
                  <span className="font-semibold whitespace-nowrap">{formatEuro(a.amount)}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <Layers className="w-4 h-4 text-primary" />
                Engagements Altaroc
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.altarocEngagements.map((e, i) => {
                const called = calledByContract.get(e.contract.toLowerCase()) ?? 0;
                const total = called + e.remaining;
                const pctCalled = total > 0 ? Math.min(100, (called / total) * 100) : 0;
                return (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1 gap-2">
                      <span className="font-medium truncate">{e.client}</span>
                      <span className="text-muted-foreground whitespace-nowrap">
                        {formatEuro(called, true)} / {formatEuro(total, true)}
                      </span>
                    </div>
                    <Progress value={pctCalled} />
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {pctCalled.toFixed(0)} % appelé · {e.contract}
                    </p>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
