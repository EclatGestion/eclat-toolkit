export function formatEuro(value: number | null | undefined, compact = false): string {
  if (value === null || value === undefined) return "—";
  if (compact) {
    if (Math.abs(value) >= 1_000_000) {
      return (value / 1_000_000).toLocaleString("fr-FR", { maximumFractionDigits: 2 }) + " M€";
    }
    if (Math.abs(value) >= 10_000) {
      return Math.round(value / 1000).toLocaleString("fr-FR") + " k€";
    }
  }
  return value.toLocaleString("fr-FR", { maximumFractionDigits: 0 }) + " €";
}

export function formatPercent(value: number | null | undefined): string {
  if (value === null || value === undefined) return "—";
  return value.toLocaleString("fr-FR", { maximumFractionDigits: 2 }) + " %";
}

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}
