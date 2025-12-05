import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Trophy } from "lucide-react";

interface BilanGlobalCardProps {
  dureeDetention: number;
  totalImpotNue: number;
  totalCashflowNue: number;
  plusValueNue: number;
  bilanNetNue: number;
  totalImpotLMNP: number;
  totalCashflowLMNP: number;
  plusValueLMNP: number;
  bilanNetLMNP: number;
  gagnant: "LMNP" | "Location Nue";
  economieGlobale: number;
  simulerPlusValue: boolean;
}

export function BilanGlobalCard({
  dureeDetention,
  totalImpotNue,
  totalCashflowNue,
  plusValueNue,
  bilanNetNue,
  totalImpotLMNP,
  totalCashflowLMNP,
  plusValueLMNP,
  bilanNetLMNP,
  gagnant,
  economieGlobale,
  simulerPlusValue,
}: BilanGlobalCardProps) {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(value);

  return (
    <Card className="rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <TrendingUp className="w-5 h-5 text-primary" />
          Bilan Global sur {dureeDetention} ans
          {simulerPlusValue && (
            <Badge variant="outline" className="ml-2 text-xs">+ Plus-value revente</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]"></TableHead>
              <TableHead className="text-right">Location Nue</TableHead>
              <TableHead className="text-right">LMNP</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="text-sm">Total impôts ({dureeDetention} ans)</TableCell>
              <TableCell className="text-right text-destructive">-{formatCurrency(totalImpotNue)}</TableCell>
              <TableCell className="text-right text-destructive">-{formatCurrency(totalImpotLMNP)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-sm">Cashflow cumulé</TableCell>
              <TableCell className="text-right">{formatCurrency(totalCashflowNue)}</TableCell>
              <TableCell className="text-right">{formatCurrency(totalCashflowLMNP)}</TableCell>
            </TableRow>
            {simulerPlusValue && (
              <TableRow>
                <TableCell className="text-sm">Impôt Plus-Value revente</TableCell>
                <TableCell className="text-right text-destructive">-{formatCurrency(plusValueNue)}</TableCell>
                <TableCell className="text-right text-destructive">-{formatCurrency(plusValueLMNP)}</TableCell>
              </TableRow>
            )}
            <TableRow className="border-t-2 bg-muted/30">
              <TableCell className="font-semibold">Bilan Net Total</TableCell>
              <TableCell className={`text-right font-bold text-lg ${gagnant === "Location Nue" ? "text-emerald-600" : ""}`}>
                {formatCurrency(bilanNetNue)}
                {gagnant === "Location Nue" && <Trophy className="inline ml-1 w-4 h-4" />}
              </TableCell>
              <TableCell className={`text-right font-bold text-lg ${gagnant === "LMNP" ? "text-emerald-600" : ""}`}>
                {formatCurrency(bilanNetLMNP)}
                {gagnant === "LMNP" && <Trophy className="inline ml-1 w-4 h-4" />}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <div className="mt-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-emerald-600" />
            <span className="font-semibold text-emerald-700 dark:text-emerald-400">
              Recommandation : {gagnant}
            </span>
          </div>
          <p className="text-sm text-emerald-600 dark:text-emerald-500 mt-1">
            Économie globale de <span className="font-bold">{formatCurrency(economieGlobale)}</span> sur {dureeDetention} ans
            {simulerPlusValue && " (revente incluse)"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
