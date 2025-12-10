import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface StockSuggestion {
  symbol: string;
  shortname: string;
  exchange: string;
  quoteType: string;
}

export function useStockSearch() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<StockSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const { data, error } = await supabase.functions.invoke('search-ticker', {
          body: { query },
        });

        if (error) {
          console.error('Search error:', error);
          setSuggestions([]);
        } else {
          setSuggestions(data?.quotes || []);
        }
      } catch (err) {
        console.error('Search failed:', err);
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  return { query, setQuery, suggestions, isSearching };
}
