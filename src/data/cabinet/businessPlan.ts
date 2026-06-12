/**
 * Trajectoire du business plan Éclat Gestion Privée.
 * Source : Google Sheet « Copie de 2025.06.24 - BP EGP » (version Antonin - TAM),
 * exercice fiscal du 1er juillet au 30 juin.
 */

export const BP_SHEET_URL =
  "https://docs.google.com/spreadsheets/d/1sb1VirI-eG6oU6j012zHgbBKk3O7AF_oTY6zqhMWtV4/edit";

export const BP_VERSION = "Copie de 2025.06.24 - BP EGP";

/** Jalon d'encours sous gestion cible (fin de période). */
export interface BpMilestone {
  /** Date de fin de période (ISO). */
  date: string;
  label: string;
  /** Encours sous gestion cible à cette date. */
  encours: number;
}

/** Jalons trimestriels puis annuels du BP (encours cibles en fin de période). */
export const BP_ENCOURS_MILESTONES: BpMilestone[] = [
  { date: "2025-06-30", label: "30/06/2025", encours: 4_570_000 },
  { date: "2025-09-30", label: "T3 2025", encours: 6_689_000 },
  { date: "2025-12-31", label: "T4 2025", encours: 8_389_000 },
  { date: "2026-03-31", label: "T1 2026", encours: 9_653_000 },
  { date: "2026-06-30", label: "T2 2026", encours: 10_653_000 },
  { date: "2026-09-30", label: "T3 2026", encours: 10_626_368 },
  { date: "2026-12-31", label: "T4 2026", encours: 11_599_802 },
  { date: "2027-03-31", label: "T1 2027", encours: 12_570_802 },
  { date: "2027-06-30", label: "T2 2027", encours: 13_539_375 },
  { date: "2028-06-30", label: "2027-28", encours: 17_403_981 },
  { date: "2029-06-30", label: "2028-29", encours: 20_229_942 },
  { date: "2030-06-30", label: "2029-30", encours: 23_027_642 },
];

/** Objectifs annuels par exercice fiscal (1er juillet → 30 juin). */
export interface BpFiscalYear {
  label: string;
  /** Début d'exercice (ISO). */
  start: string;
  /** Fin d'exercice (ISO). */
  end: string;
  /** Encours sous gestion cible en fin d'exercice. */
  encoursFin: number;
  /** Collecte nette cible sur l'exercice. */
  collecte: number;
  /** Chiffre d'affaires cible sur l'exercice. */
  ca: number;
  /** Bénéfice / (perte) cible sur l'exercice. */
  benefice: number;
}

export const BP_FISCAL_YEARS: BpFiscalYear[] = [
  {
    label: "2024-2025 (réalisé BP)",
    start: "2024-07-01",
    end: "2025-06-30",
    encoursFin: 4_570_000,
    collecte: 770_000,
    ca: 104_642,
    benefice: 28_406,
  },
  {
    label: "2025-2026",
    start: "2025-07-01",
    end: "2026-06-30",
    encoursFin: 10_653_000,
    collecte: 6_083_000,
    ca: 200_154,
    benefice: 97_656,
  },
  {
    label: "2026-2027",
    start: "2026-07-01",
    end: "2027-06-30",
    encoursFin: 13_539_375,
    collecte: 3_000_000,
    ca: 178_957,
    benefice: 49_902,
  },
  {
    label: "2027-2028",
    start: "2027-07-01",
    end: "2028-06-30",
    encoursFin: 17_403_981,
    collecte: 4_000_000,
    ca: 261_108,
    benefice: 43_325,
  },
  {
    label: "2028-2029",
    start: "2028-07-01",
    end: "2029-06-30",
    encoursFin: 20_229_942,
    collecte: 3_000_000,
    ca: 344_517,
    benefice: 67_265,
  },
  {
    label: "2029-2030",
    start: "2029-07-01",
    end: "2030-06-30",
    encoursFin: 23_027_642,
    collecte: 3_000_000,
    ca: 386_091,
    benefice: 89_948,
  },
];

/** Exercice fiscal du BP couvrant la date donnée (s'il existe). */
export function fiscalYearAt(dateIso: string): BpFiscalYear | undefined {
  return BP_FISCAL_YEARS.find((fy) => dateIso >= fy.start && dateIso <= fy.end);
}

/**
 * Encours cible du BP à une date donnée, interpolé linéairement entre les
 * deux jalons qui l'encadrent.
 */
export function encoursTargetAt(dateIso: string): number | null {
  const ms = BP_ENCOURS_MILESTONES;
  if (dateIso <= ms[0].date) return ms[0].encours;
  if (dateIso >= ms[ms.length - 1].date) return ms[ms.length - 1].encours;
  for (let i = 0; i < ms.length - 1; i++) {
    if (dateIso >= ms[i].date && dateIso <= ms[i + 1].date) {
      const t0 = new Date(ms[i].date).getTime();
      const t1 = new Date(ms[i + 1].date).getTime();
      const t = new Date(dateIso).getTime();
      const ratio = t1 > t0 ? (t - t0) / (t1 - t0) : 0;
      return ms[i].encours + (ms[i + 1].encours - ms[i].encours) * ratio;
    }
  }
  return null;
}
