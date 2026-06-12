import { RefreshCw, ExternalLink, CloudOff, Cloud } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CabinetDataSource } from "@/lib/cabinet/types";
import { CABINET_SHEET_URL } from "@/hooks/useCabinetData";
import { formatDate } from "@/lib/cabinet/format";

interface DataSourceBadgeProps {
  source: CabinetDataSource;
  snapshotDate: string;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export function DataSourceBadge({ source, snapshotDate, onRefresh, isRefreshing }: DataSourceBadgeProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex">
            <Badge variant={source === "live" ? "default" : "secondary"} className="gap-1.5">
              {source === "live" ? <Cloud className="w-3.5 h-3.5" /> : <CloudOff className="w-3.5 h-3.5" />}
              {source === "live" ? "Connecté au Google Sheet" : `Snapshot du ${formatDate(snapshotDate)}`}
            </Badge>
          </span>
        </TooltipTrigger>
        <TooltipContent className="max-w-72">
          {source === "live"
            ? "Les données sont lues en direct depuis « 0. Liste Client NOUS »."
            : "Lecture directe du Google Sheet indisponible (la feuille n'est pas partagée par lien). Les données affichées sont la copie embarquée. Pour activer la synchro live : partager la feuille en « Tous les utilisateurs disposant du lien — Lecteur »."}
        </TooltipContent>
      </Tooltip>
      <Button variant="ghost" size="sm" onClick={onRefresh} disabled={isRefreshing} className="gap-1.5">
        <RefreshCw className={isRefreshing ? "w-4 h-4 animate-spin" : "w-4 h-4"} />
        Actualiser
      </Button>
      <Button variant="ghost" size="sm" asChild className="gap-1.5">
        <a href={CABINET_SHEET_URL} target="_blank" rel="noopener noreferrer">
          <ExternalLink className="w-4 h-4" />
          Ouvrir le Sheet
        </a>
      </Button>
    </div>
  );
}
