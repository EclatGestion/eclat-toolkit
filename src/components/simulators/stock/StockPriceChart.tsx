import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PriceData {
  date: string;
  price: number;
}

interface StockPriceChartProps {
  priceHistory: PriceData[];
  currentPrice: number;
  ticker: string;
}

type Period = '1M' | '3M' | '6M' | '1Y' | '2Y' | '5Y';

export function StockPriceChart({ priceHistory, currentPrice, ticker }: StockPriceChartProps) {
  const [period, setPeriod] = useState<Period>('1Y');

  const periods: { key: Period; label: string; days: number }[] = [
    { key: '1M', label: '1M', days: 21 },
    { key: '3M', label: '3M', days: 63 },
    { key: '6M', label: '6M', days: 126 },
    { key: '1Y', label: '1A', days: 252 },
    { key: '2Y', label: '2A', days: 504 },
    { key: '5Y', label: '5A', days: 1260 },
  ];

  const selectedPeriod = periods.find(p => p.key === period)!;
  const filteredData = priceHistory?.slice(-selectedPeriod.days) || [];

  const startPrice = filteredData[0]?.price ?? currentPrice ?? 0;
  const safeCurrentPrice = currentPrice ?? 0;
  const performance = startPrice > 0 ? ((safeCurrentPrice - startPrice) / startPrice * 100) : 0;
  const isPositive = performance >= 0;

  const prices = filteredData.map(d => d.price).filter(p => p !== undefined && p !== null);
  const minPrice = prices.length > 0 ? Math.min(...prices) * 0.98 : 0;
  const maxPrice = prices.length > 0 ? Math.max(...prices) * 1.02 : 100;

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Évolution du cours - {ticker}</CardTitle>
          <div className="flex gap-1">
            {periods.map((p) => (
              <Button
                key={p.key}
                variant={period === p.key ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setPeriod(p.key)}
                className="h-7 px-2 text-xs"
              >
                {p.label}
              </Button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-3xl font-bold">${safeCurrentPrice.toFixed(2)}</span>
          <span className={cn(
            'text-lg font-medium px-2 py-0.5 rounded',
            isPositive ? 'text-emerald-600 bg-emerald-100' : 'text-red-600 bg-red-100'
          )}>
            {isPositive ? '+' : ''}{performance.toFixed(2)}%
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={filteredData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={isPositive ? '#10b981' : '#ef4444'} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={isPositive ? '#10b981' : '#ef4444'} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  if (period === '5Y' || period === '2Y') {
                    return date.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' });
                  }
                  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
                }}
                interval="preserveStartEnd"
              />
              <YAxis 
                domain={[minPrice, maxPrice]}
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                tickFormatter={(value) => `$${value.toFixed(0)}`}
                width={50}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
                labelFormatter={(value) => new Date(value).toLocaleDateString('fr-FR', { 
                  day: '2-digit', 
                  month: 'long',
                  year: 'numeric'
                })}
                formatter={(value: number) => [`$${value.toFixed(2)}`, 'Prix']}
              />
              <ReferenceLine y={startPrice} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" />
              <Area
                type="monotone"
                dataKey="price"
                stroke={isPositive ? '#10b981' : '#ef4444'}
                strokeWidth={2}
                fill="url(#priceGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
