import { useState } from 'react';
import { Search, TrendingUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface StockSearchInputProps {
  onSearch: (ticker: string) => void;
  isLoading: boolean;
}

const popularStocks = [
  { ticker: 'AAPL', name: 'Apple' },
  { ticker: 'MSFT', name: 'Microsoft' },
  { ticker: 'GOOGL', name: 'Google' },
  { ticker: 'AMZN', name: 'Amazon' },
  { ticker: 'NVDA', name: 'Nvidia' },
  { ticker: 'MC.PA', name: 'LVMH' },
  { ticker: 'OR.PA', name: "L'Oréal" },
  { ticker: 'TTE.PA', name: 'TotalEnergies' },
];

export function StockSearchInput({ onSearch, isLoading }: StockSearchInputProps) {
  const [ticker, setTicker] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ticker.trim()) {
      onSearch(ticker.trim().toUpperCase());
    }
  };

  const handleQuickSelect = (t: string) => {
    setTicker(t);
    onSearch(t);
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={ticker}
            onChange={(e) => setTicker(e.target.value.toUpperCase())}
            placeholder="Entrez un ticker (ex: AAPL, MC.PA)"
            className="pl-10 h-12 text-lg"
            disabled={isLoading}
          />
        </div>
        <Button 
          type="submit" 
          size="lg" 
          disabled={isLoading || !ticker.trim()}
          className="px-8"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Analyse...
            </div>
          ) : (
            <>
              <TrendingUp className="h-4 w-4 mr-2" />
              Analyser
            </>
          )}
        </Button>
      </form>

      <div className="flex flex-wrap gap-2">
        <span className="text-sm text-muted-foreground self-center">Populaires :</span>
        {popularStocks.map((stock) => (
          <Badge
            key={stock.ticker}
            variant="outline"
            className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
            onClick={() => handleQuickSelect(stock.ticker)}
          >
            {stock.ticker}
          </Badge>
        ))}
      </div>
    </div>
  );
}
