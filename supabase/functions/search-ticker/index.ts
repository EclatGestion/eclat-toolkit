import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Input validation: query must be alphanumeric with dots/spaces, max 50 chars
function validateQuery(query: string): boolean {
  return /^[A-Za-z0-9.\s-]{1,50}$/.test(query);
}

// Get Yahoo Finance authentication (cookie + crumb)
async function getYahooAuth(): Promise<{ cookie: string; crumb: string } | null> {
  try {
    // Step 1: Get cookies from fc.yahoo.com
    const cookieResponse = await fetch('https://fc.yahoo.com', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });
    
    const setCookieHeader = cookieResponse.headers.get('set-cookie');
    if (!setCookieHeader) {
      console.error('No cookies received from fc.yahoo.com');
      return null;
    }
    
    // Extract all cookies
    const cookies = setCookieHeader.split(',').map(c => c.split(';')[0].trim()).join('; ');
    console.log('Got cookies from fc.yahoo.com');
    
    // Step 2: Get crumb using cookies
    const crumbResponse = await fetch('https://query2.finance.yahoo.com/v1/test/getcrumb', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Cookie': cookies,
      },
    });
    
    if (!crumbResponse.ok) {
      console.error('Failed to get crumb:', crumbResponse.status);
      return null;
    }
    
    const crumb = await crumbResponse.text();
    console.log('Got crumb from Yahoo Finance:', crumb.substring(0, 10) + '...');
    
    return { cookie: cookies, crumb };
  } catch (error) {
    console.error('Error getting Yahoo auth:', error);
    return null;
  }
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authentication check
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      console.error('[search-ticker] Auth error:', authError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { query } = await req.json();
    
    // Input validation
    if (!query || typeof query !== 'string' || query.length < 2) {
      return new Response(
        JSON.stringify({ quotes: [] }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!validateQuery(query)) {
      return new Response(
        JSON.stringify({ error: 'Invalid query format', quotes: [] }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[search-ticker] User ${user.id} searching for: ${query}`);

    // Get Yahoo Finance authentication
    const auth = await getYahooAuth();
    
    if (!auth) {
      console.error('Failed to get Yahoo authentication, trying without auth');
    }

    const searchUrl = `https://query2.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(query)}&quotesCount=10&newsCount=0&enableFuzzyQuery=true&quotesQueryId=tss_match_phrase_query${auth ? `&crumb=${encodeURIComponent(auth.crumb)}` : ''}`;
    
    const headers: Record<string, string> = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'application/json',
    };
    
    if (auth) {
      headers['Cookie'] = auth.cookie;
    }
    
    const response = await fetch(searchUrl, { headers });

    if (!response.ok) {
      console.error(`Yahoo search failed: ${response.status}`);
      
      // Fallback: return empty results instead of error to not break UX
      // The user can still type the ticker directly
      return new Response(
        JSON.stringify({ quotes: [], fallback: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
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
    
    // Return empty results as fallback to not break UX
    return new Response(
      JSON.stringify({ quotes: [], error: errorMessage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
