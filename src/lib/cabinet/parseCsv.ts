import { CabinetContract } from "./types";

/** Parse un CSV (export Google Sheets) en lignes de cellules, en gérant les guillemets. */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          cell += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        cell += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      row.push(cell);
      cell = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += ch;
    }
  }
  if (cell !== "" || row.length > 0) {
    row.push(cell);
    rows.push(row);
  }
  return rows;
}

function parseAmount(raw: string): number | null {
  const cleaned = raw
    .replace(/€/g, "")
    .replace(/[\s\u00a0\u202f]/g, "")
    .replace(",", ".")
    .trim();
  if (!cleaned || cleaned === "-") return null;
  const value = Number(cleaned);
  return Number.isFinite(value) ? Math.round(value * 100) / 100 : null;
}

function parseFrDate(raw: string): string | null {
  const m = raw.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!m) return null;
  return `${m[3]}-${m[2].padStart(2, "0")}-${m[1].padStart(2, "0")}`;
}

/**
 * Extrait la liste des contrats depuis le CSV du Google Sheet « Liste Client NOUS ».
 * Localise l'en-tête « Companie | Client | Contrat | ... | Conseiller » puis lit
 * les lignes jusqu'à la fin du bloc (lignes vides).
 */
export function parseContractsFromCsv(csvText: string): CabinetContract[] {
  const rows = parseCsv(csvText);
  const headerIdx = rows.findIndex(
    (r) =>
      r[0]?.trim().toLowerCase().startsWith("compan") &&
      r[1]?.trim().toLowerCase() === "client" &&
      r.some((c) => c.trim().toLowerCase() === "conseiller")
  );
  if (headerIdx === -1) {
    throw new Error("Table des contrats introuvable dans le CSV");
  }
  const contracts: CabinetContract[] = [];
  let emptyStreak = 0;
  for (let i = headerIdx + 1; i < rows.length; i++) {
    const r = rows[i];
    const client = r[1]?.trim() ?? "";
    if (!client) {
      emptyStreak++;
      if (emptyStreak >= 3) break;
      continue;
    }
    emptyStreak = 0;
    contracts.push({
      company: r[0]?.trim() ?? "",
      client,
      contract: r[2]?.trim() ?? "",
      subscriptionDate: parseFrDate(r[3] ?? ""),
      encours: parseAmount(r[4] ?? ""),
      vlDate: parseFrDate(r[5] ?? ""),
      profile: r[6]?.trim() ?? "",
      advisor: r[7]?.trim() ?? "",
      type: "Autre",
      pvmv: null,
      pvmvAnnualise: null,
    });
  }
  return contracts;
}
