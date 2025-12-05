import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, AlertTriangle } from "lucide-react";

export type TypeLocation = "longue_duree" | "tourisme_classe" | "tourisme_non_classe";

interface TypeLocationSelectProps {
  value: TypeLocation;
  onChange: (value: TypeLocation) => void;
}

export function TypeLocationSelect({ value, onChange }: TypeLocationSelectProps) {
  return (
    <Card className="rounded-2xl">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-base">
          <MapPin className="w-5 h-5 text-violet-500" />
          Type de Location
          <Badge variant="outline" className="ml-2 text-xs">Loi Le Meur 2025</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Select value={value} onValueChange={(v) => onChange(v as TypeLocation)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="longue_duree">
              <div className="flex flex-col items-start py-1">
                <span className="font-medium">Location longue durée</span>
                <span className="text-xs text-muted-foreground">Micro-BIC: 50% d'abattement (plafond 77 700€)</span>
              </div>
            </SelectItem>
            <SelectItem value="tourisme_classe">
              <div className="flex flex-col items-start py-1">
                <span className="font-medium">Meublé tourisme classé</span>
                <span className="text-xs text-muted-foreground">Micro-BIC: 50% d'abattement (plafond 77 700€)</span>
              </div>
            </SelectItem>
            <SelectItem value="tourisme_non_classe">
              <div className="flex flex-col items-start py-1">
                <span className="font-medium">Meublé tourisme non classé (Airbnb)</span>
                <span className="text-xs text-amber-600">⚠️ Micro-BIC: 30% d'abattement (plafond 15 000€)</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
        
        {value === "tourisme_non_classe" && (
          <Alert className="border-amber-200 bg-amber-50/50 dark:bg-amber-950/20">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-xs text-amber-700 dark:text-amber-400">
              La Loi Le Meur 2025 a durci la fiscalité des meublés de tourisme non classés. 
              Le régime réel devient souvent plus avantageux.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
