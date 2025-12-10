import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, BarChart3, Percent, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StockData {
  ticker: string;
  name: string;
  sector: string;
  industry: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap: number;
  pe: number | null;
  dividendYield: number | null;
  beta: number | null;
}

interface StockKPICardsProps {
  stockData: StockData;
}

function formatMarketCap(value: number): string {
  if (value >= 1e12) return `${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
  return value.toFixed(0);
}

export function StockKPICards({ stockData }: StockKPICardsProps) {
  const isPositive = stockData.changePercent >= 0;

  const kpis = [
    {
      label: 'Prix',
      value: `$${stockData.price.toFixed(2)}`,
      subValue: `${isPositive ? '+' : ''}${stockData.changePercent.toFixed(2)}%`,
      icon: isPositive ? TrendingUp : TrendingDown,
      color: isPositive ? 'text-emerald-500' : 'text-red-500',
    },
    {
      label: 'Capitalisation',
      value: `$${formatMarketCap(stockData.marketCap)}`,
      subValue: stockData.sector,
      icon: Building2,
      color: 'text-blue-500',
    },
    {
      label: 'P/E Ratio',
      value: stockData.pe ? `${stockData.pe.toFixed(1)}x` : 'N/A',
      subValue: stockData.pe ? (stockData.pe < 15 ? 'Sous-évalué' : stockData.pe > 25 ? 'Cher' : 'Fair') : '',
      icon: BarChart3,
      color: stockData.pe ? (stockData.pe < 15 ? 'text-emerald-500' : stockData.pe > 25 ? 'text-red-500' : 'text-amber-500') : 'text-muted-foreground',
    },
    {
      label: 'Dividende',
      value: stockData.dividendYield ? `${stockData.dividendYield.toFixed(2)}%` : '0%',
      subValue: stockData.dividendYield && stockData.dividendYield > 3 ? 'Attractif' : 'Standard',
      icon: Percent,
      color: stockData.dividendYield && stockData.dividendYield > 3 ? 'text-emerald-500' : 'text-muted-foreground',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {kpis.map((kpi) => (
        <Card key={kpi.label} className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <kpi.icon className={cn('h-4 w-4', kpi.color)} />
              <span className="text-sm text-muted-foreground">{kpi.label}</span>
            </div>
            <p className="text-2xl font-bold">{kpi.value}</p>
            {kpi.subValue && (
              <p className={cn('text-sm', kpi.color)}>{kpi.subValue}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
