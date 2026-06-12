import { CabinetContract, CabinetData, CabinetTransaction } from "./types";

export interface ClientSummary {
  client: string;
  contracts: CabinetContract[];
  totalEncours: number;
  advisors: string[];
  companies: string[];
}

export function groupByClient(contracts: CabinetContract[]): ClientSummary[] {
  const map = new Map<string, ClientSummary>();
  for (const c of contracts) {
    const key = c.client.toUpperCase();
    let entry = map.get(key);
    if (!entry) {
      entry = { client: c.client, contracts: [], totalEncours: 0, advisors: [], companies: [] };
      map.set(key, entry);
    }
    entry.contracts.push(c);
    entry.totalEncours += c.encours ?? 0;
    if (c.advisor && !entry.advisors.includes(c.advisor)) entry.advisors.push(c.advisor);
    if (c.company && !entry.companies.includes(c.company)) entry.companies.push(c.company);
  }
  return [...map.values()].sort((a, b) => b.totalEncours - a.totalEncours);
}

export interface BucketTotal {
  name: string;
  value: number;
  count: number;
}

export function sumBy(
  contracts: CabinetContract[],
  key: (c: CabinetContract) => string
): BucketTotal[] {
  const map = new Map<string, BucketTotal>();
  for (const c of contracts) {
    const name = key(c) || "Autre";
    const entry = map.get(name) ?? { name, value: 0, count: 0 };
    entry.value += c.encours ?? 0;
    entry.count++;
    map.set(name, entry);
  }
  return [...map.values()].sort((a, b) => b.value - a.value);
}

export function subscriptionsByYear(contracts: CabinetContract[]): BucketTotal[] {
  const map = new Map<string, BucketTotal>();
  for (const c of contracts) {
    if (!c.subscriptionDate) continue;
    const year = c.subscriptionDate.slice(0, 4);
    const entry = map.get(year) ?? { name: year, value: 0, count: 0 };
    entry.value += c.encours ?? 0;
    entry.count++;
    map.set(year, entry);
  }
  return [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
}

export interface MonthlyCashflow {
  month: string;
  credit: number;
  debit: number;
}

export function monthlyCashflow(transactions: CabinetTransaction[]): MonthlyCashflow[] {
  const map = new Map<string, MonthlyCashflow>();
  for (const t of transactions) {
    const month = t.date.slice(0, 7);
    const entry = map.get(month) ?? { month, credit: 0, debit: 0 };
    if (t.side === "credit") entry.credit += t.amount;
    else entry.debit += t.amount;
    map.set(month, entry);
  }
  return [...map.values()].sort((a, b) => a.month.localeCompare(b.month));
}

export interface CabinetKpis {
  encoursGlobal: number;
  nbClients: number;
  nbContrats: number;
  encoursMoyenClient: number;
  caTotal: number;
  collecte: number;
  pipelineTotal: number;
  feesPending: number;
  recurrentPrevoyanceMensuel: number;
  retroMandatsAnnuelles: number;
}

export function computeKpis(data: CabinetData): CabinetKpis {
  // Comme dans la feuille, l'encours global compte les engagements Altaroc
  // à leur valeur totale (appelé + restant à appeler).
  const encoursGlobal =
    data.contracts.reduce((s, c) => s + (c.encours ?? 0), 0) +
    data.altarocEngagements.reduce((s, e) => s + e.remaining, 0);
  const nbClients = groupByClient(data.contracts).length;
  const caTotal = data.caAssureurs.reduce((s, a) => s + (a.caTotal ?? 0), 0);
  const pipelineTotal = data.pipeline.reduce((s, p) => s + p.expected, 0);
  const feesPending = data.entryFees
    .filter((f) => !f.paid)
    .reduce((s, f) => s + f.commission, 0);
  return {
    encoursGlobal,
    nbClients,
    nbContrats: data.contracts.length,
    encoursMoyenClient: nbClients > 0 ? encoursGlobal / nbClients : 0,
    caTotal,
    collecte: data.collecte["Collecte"] ?? 0,
    pipelineTotal,
    feesPending,
    recurrentPrevoyanceMensuel: data.prevoyance.reduce((s, p) => s + p.mensuelHT, 0),
    retroMandatsAnnuelles: data.mandats.reduce((s, m) => s + (m.retroAnnuelle ?? 0), 0),
  };
}
