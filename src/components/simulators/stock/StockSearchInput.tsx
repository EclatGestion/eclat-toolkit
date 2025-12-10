import { useState } from 'react';
import { Search, TrendingUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import { useStockSearch } from '@/hooks/useStockSearch';

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
  const [open, setOpen] = useState(false);
  const { query, setQuery, suggestions, isSearching } = useStockSearch();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim().toUpperCase());
      setOpen(false);
    }
  };

  const handleSelect = (symbol: string) => {
    setQuery(symbol);
    setOpen(false);
    onSearch(symbol);
  };

  const handleQuickSelect = (ticker: string) => {
    setQuery(ticker);
    onSearch(ticker);
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="flex gap-3">
        <Popover open={open && query.length >= 2} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  if (e.target.value.length >= 2) {
                    setOpen(true);
                  }
                }}
                onFocus={() => {
                  if (query.length >= 2) setOpen(true);
                }}
                placeholder="Rechercher une action (Apple, Total, LVMH...)"
                className="pl-10 h-12 text-lg"
                disabled={isLoading}
              />
            </div>
          </PopoverTrigger>
          <PopoverContent 
            className="p-0 w-[var(--radix-popover-trigger-width)] bg-popover border shadow-lg" 
            align="start"
            sideOffset={4}
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            <Command>
              <CommandList>
                {isSearching && (
                  <CommandEmpty className="py-4 text-center text-sm text-muted-foreground">
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                      Recherche...
                    </div>
                  </CommandEmpty>
                )}
                {!isSearching && suggestions.length === 0 && query.length >= 2 && (
                  <CommandEmpty className="py-4 text-center text-sm text-muted-foreground">
                    Aucun résultat pour "{query}"
                  </CommandEmpty>
                )}
                {suggestions.length > 0 && (
                  <CommandGroup heading="Suggestions">
                    {suggestions.map((stock) => (
                      <CommandItem
                        key={stock.symbol}
                        value={stock.symbol}
                        onSelect={() => handleSelect(stock.symbol)}
                        className="cursor-pointer"
                      >
                        <span className="font-semibold text-foreground">{stock.symbol}</span>
                        <span className="ml-2 text-muted-foreground truncate flex-1">
                          {stock.shortname}
                        </span>
                        <Badge variant="outline" className="ml-auto text-xs">
                          {stock.exchange}
                        </Badge>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <Button 
          type="submit" 
          size="lg" 
          disabled={isLoading || !query.trim()}
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
