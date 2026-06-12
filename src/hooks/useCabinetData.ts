import { useQuery } from "@tanstack/react-query";
import snapshot from "@/data/cabinet/snapshot.json";
import { CabinetData, CabinetDataSource } from "@/lib/cabinet/types";
import { parseContractsFromCsv } from "@/lib/cabinet/parseCsv";

/** ID du Google Sheet « 0. Liste Client NOUS » (Drive Éclat GP). */
export const CABINET_SHEET_ID =
  import.meta.env.VITE_CABINET_SHEET_ID ?? "1QyXDJ7uLJUM8-ot2zTZ6P-ER0AImMb-UPUeBFQakbXo";

export const CABINET_SHEET_URL = `https://docs.google.com/spreadsheets/d/${CABINET_SHEET_ID}/edit`;

const CSV_EXPORT_URL = `https://docs.google.com/spreadsheets/d/${CABINET_SHEET_ID}/export?format=csv`;

const snapshotData = snapshot as unknown as CabinetData;

export interface CabinetDataResult {
  data: CabinetData;
  source: CabinetDataSource;
}

/**
 * Charge les données du cabinet : tente une lecture live du Google Sheet
 * (fonctionne si la feuille est partagée « tous les utilisateurs disposant du
 * lien — lecteur »), sinon retombe sur le snapshot embarqué.
 *
 * En mode live, la liste des contrats est rafraîchie depuis la feuille ; le
 * type de produit et la performance sont réutilisés depuis le snapshot
 * (rapprochés par numéro de contrat).
 */
export function useCabinetData() {
  return useQuery<CabinetDataResult>({
    queryKey: ["cabinet-data"],
    staleTime: 5 * 60 * 1000,
    retry: false,
    queryFn: async () => {
      try {
        const res = await fetch(CSV_EXPORT_URL, { redirect: "follow" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const csv = await res.text();
        const liveContracts = parseContractsFromCsv(csv);
        if (liveContracts.length === 0) throw new Error("Aucun contrat dans le CSV");

        const enrichment = new Map(
          snapshotData.contracts.map((c) => [c.contract.toLowerCase(), c])
        );
        const contracts = liveContracts.map((c) => {
          const known = enrichment.get(c.contract.toLowerCase());
          return known
            ? { ...c, type: known.type, pvmv: known.pvmv, pvmvAnnualise: known.pvmvAnnualise }
            : c;
        });
        return { data: { ...snapshotData, contracts }, source: "live" as const };
      } catch {
        return { data: snapshotData, source: "snapshot" as const };
      }
    },
  });
}
