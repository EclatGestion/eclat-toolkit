export interface CabinetContract {
  company: string;
  client: string;
  contract: string;
  subscriptionDate: string | null;
  encours: number | null;
  vlDate: string | null;
  profile: string;
  advisor: string;
  type: string;
  pvmv: number | null;
  pvmvAnnualise: number | null;
}

export interface ProfilePerf {
  profile: string;
  global: number | null;
  annualized: number | null;
}

export interface PipelineEntry {
  company: string;
  client: string;
  contract: string;
  expected: number;
}

export interface Avance {
  client: string;
  contract: string;
  amount: number;
}

export interface AltarocEngagement {
  client: string;
  contract: string;
  /** Montant d'engagement restant à appeler (non encore versé). */
  remaining: number;
  vlDate: string | null;
}

export interface EntryFee {
  client: string;
  product: string;
  contract: string;
  month: string;
  valorisation: number | null;
  commission: number;
  paid: string | null;
}

export interface Mandat {
  client: string;
  assureur: string;
  mandat: string;
  depositaire: string;
  valorisation: number | null;
  retroAnnuelle: number | null;
}

export interface CaAssureur {
  assureur: string;
  encours: number | null;
  caTotal: number | null;
  caFraisEntreeCIF: number | null;
  caFraisEntreeIAS: number | null;
  caEncoursCIF: number | null;
  caEncoursIAS: number | null;
  caStructures: number | null;
}

export interface PrevoyanceLine {
  nom: string;
  prenom: string;
  etablissement: string | null;
  intitule: string;
  typologie: string;
  mensuelHT: number;
}

export interface CabinetTransaction {
  date: string;
  label: string;
  subcategory: string;
  category: string;
  side: "credit" | "debit" | string;
  amount: number;
}

export interface CabinetData {
  snapshotDate: string;
  contracts: CabinetContract[];
  perfByProfile: ProfilePerf[];
  pipeline: PipelineEntry[];
  avances: Avance[];
  altarocEngagements: AltarocEngagement[];
  collecte: Record<string, number>;
  entryFees: EntryFee[];
  mandats: Mandat[];
  caAssureurs: CaAssureur[];
  prevoyance: PrevoyanceLine[];
  transactions: CabinetTransaction[];
}

export type CabinetDataSource = "live" | "snapshot";
