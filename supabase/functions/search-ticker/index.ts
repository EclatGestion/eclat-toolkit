import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query } = await req.json();
    
    if (!query || query.length < 2) {
      return new Response(
        JSON.stringify({ quotes: [] }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Searching for ticker: ${query}`);

    const searchUrl = `https://query2.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(query)}&quotesCount=10&newsCount=0&enableFuzzyQuery=true&quotesQueryId=tss_match_phrase_query`;
    
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      console.error(`Yahoo search failed: ${response.status}`);
      throw new Error(`Yahoo Finance search failed: ${response.status}`);
    }

    const data = await response.json();
    
    // Filter to only include stocks and ETFs
    const quotes = (data.quotes || [])
      .filter((q: any) => ['EQUITY', 'ETF'].includes(q.quoteType))
      .map((q: any) => ({
        symbol: q.symbol,
        shortname: q.shortname || q.longname || q.symbol,
        exchange: q.exchange || '',
        quoteType: q.quoteType,
      }));

    console.log(`Found ${quotes.length} results for "${query}"`);

    return new Response(
      JSON.stringify({ quotes }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Search ticker error:', errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage, quotes: [] }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
