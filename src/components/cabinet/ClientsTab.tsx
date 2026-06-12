import { useMemo, useState } from "react";
import { Search, ChevronDown, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { CabinetData } from "@/lib/cabinet/types";
import { groupByClient } from "@/lib/cabinet/aggregate";
import { formatEuro, formatDate, formatPercent } from "@/lib/cabinet/format";

export function ClientsTab({ data }: { data: CabinetData }) {
  const [search, setSearch] = useState("");
  const [advisor, setAdvisor] = useState("all");
  const [openClient, setOpenClient] = useState<string | null>(null);

  const allClients = useMemo(() => groupByClient(data.contracts), [data.contracts]);
  const advisors = useMemo(
    () => [...new Set(data.contracts.map((c) => c.advisor).filter(Boolean))].sort(),
    [data.contracts]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return allClients.filter((c) => {
      if (advisor !== "all" && !c.advisors.includes(advisor)) return false;
      if (!q) return true;
      return (
        c.client.toLowerCase().includes(q) ||
        c.contracts.some(
          (ct) => ct.contract.toLowerCase().includes(q) || ct.company.toLowerCase().includes(q)
        )
      );
    });
  }, [allClients, search, advisor]);

  const totalFiltered = filtered.reduce((s, c) => s + c.totalEncours, 0);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un client, un contrat, une compagnie…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={advisor} onValueChange={setAdvisor}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Conseiller" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les conseillers</SelectItem>
            {advisors.map((a) => (
              <SelectItem key={a} value={a}>
                {a}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <p className="text-sm text-muted-foreground">
        {filtered.length} client{filtered.length > 1 ? "s" : ""} ·{" "}
        {filtered.reduce((s, c) => s + c.contracts.length, 0)} contrats ·{" "}
        <span className="font-medium text-foreground">{formatEuro(totalFiltered)}</span> d'encours
      </p>

      <div className="space-y-2">
        {filtered.map((client) => {
          const isOpen = openClient === client.client;
          return (
            <Collapsible
              key={client.client}
              open={isOpen}
              onOpenChange={(open) => setOpenClient(open ? client.client : null)}
            >
              <Card className="shadow-card overflow-hidden">
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full h-auto justify-between px-4 py-3 rounded-none hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <ChevronDown
                        className={cn("w-4 h-4 shrink-0 text-muted-foreground transition-transform", isOpen && "rotate-180")}
                      />
                      <span className="font-medium truncate">{client.client}</span>
                      <Badge variant="secondary" className="shrink-0">
                        {client.contracts.length} contrat{client.contracts.length > 1 ? "s" : ""}
                      </Badge>
                      {client.advisors.map((a) => (
                        <Badge key={a} variant="outline" className="shrink-0 hidden sm:inline-flex">
                          {a}
                        </Badge>
                      ))}
                    </div>
                    <span className="font-semibold shrink-0 ml-3">{formatEuro(client.totalEncours)}</span>
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-0 pb-3 px-4">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-left text-xs text-muted-foreground border-b">
                            <th className="py-2 pr-3 font-medium">Compagnie</th>
                            <th className="py-2 pr-3 font-medium">Contrat</th>
                            <th className="py-2 pr-3 font-medium">Type</th>
                            <th className="py-2 pr-3 font-medium">Profil</th>
                            <th className="py-2 pr-3 font-medium">Souscription</th>
                            <th className="py-2 pr-3 font-medium text-right">Encours</th>
                            <th className="py-2 pr-3 font-medium text-right">PV/MV</th>
                            <th className="py-2 font-medium">VL au</th>
                          </tr>
                        </thead>
                        <tbody>
                          {client.contracts.map((ct, i) => (
                            <tr key={i} className="border-b last:border-0">
                              <td className="py-2 pr-3 whitespace-nowrap">{ct.company}</td>
                              <td className="py-2 pr-3 max-w-64 truncate" title={ct.contract}>
                                {ct.contract}
                              </td>
                              <td className="py-2 pr-3">
                                <Badge variant="outline">{ct.type}</Badge>
                              </td>
                              <td className="py-2 pr-3 whitespace-nowrap">{ct.profile || "—"}</td>
                              <td className="py-2 pr-3 whitespace-nowrap">{formatDate(ct.subscriptionDate)}</td>
                              <td className="py-2 pr-3 text-right font-medium whitespace-nowrap">
                                {formatEuro(ct.encours)}
                              </td>
                              <td className="py-2 pr-3 text-right whitespace-nowrap">
                                {ct.pvmv !== null ? (
                                  <span
                                    className={cn(
                                      "inline-flex items-center gap-1",
                                      ct.pvmv >= 0 ? "text-emerald-600" : "text-red-600"
                                    )}
                                  >
                                    {ct.pvmv >= 0 ? (
                                      <TrendingUp className="w-3.5 h-3.5" />
                                    ) : (
                                      <TrendingDown className="w-3.5 h-3.5" />
                                    )}
                                    {formatPercent(ct.pvmv)}
                                  </span>
                                ) : (
                                  "—"
                                )}
                              </td>
                              <td className="py-2 whitespace-nowrap">{formatDate(ct.vlDate)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          );
        })}
        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-12">Aucun client ne correspond à la recherche.</p>
        )}
      </div>
    </div>
  );
}
