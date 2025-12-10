import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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
  peHistorical: number | null;
  evEbitda: number | null;
  revenueGrowth: number | null;
  netMargin: number | null;
  roe: number | null;
  debtToEbitda: number | null;
  dividendYield: number | null;
  eps: number | null;
  beta: number | null;
  priceHistory: { date: string; price: number }[];
  peers: { name: string; ticker: string; pe: number | null; growth: number | null }[];
}

async function safeJsonParse(response: Response, endpoint: string): Promise<any> {
  const text = await response.text();
  
  // Check for premium/error messages (not JSON)
  if (text.startsWith('Premium') || text.startsWith('Error') || text.startsWith('Invalid') || text.startsWith('Limit')) {
    console.error(`FMP ${endpoint} error:`, text);
    throw new Error(`FMP API: ${text.substring(0, 100)}`);
  }
  
  try {
    return JSON.parse(text);
  } catch (e) {
    console.error(`Failed to parse ${endpoint} response:`, text.substring(0, 200));
    throw new Error(`Invalid response from FMP ${endpoint}`);
  }
}

async function fetchStockData(ticker: string, apiKey: string): Promise<StockData> {
  const baseUrl = 'https://financialmodelingprep.com/api/v3';
  
  // Fetch multiple endpoints in parallel using v3 API (free tier compatible)
  const [profileRes, quoteRes, ratiosRes, historyRes] = await Promise.all([
    fetch(`${baseUrl}/profile/${ticker}?apikey=${apiKey}`),
    fetch(`${baseUrl}/quote/${ticker}?apikey=${apiKey}`),
    fetch(`${baseUrl}/ratios-ttm/${ticker}?apikey=${apiKey}`),
    fetch(`${baseUrl}/historical-price-full/${ticker}?serietype=line&apikey=${apiKey}`),
  ]);

  const [profile, quote, ratios, history] = await Promise.all([
    safeJsonParse(profileRes, 'profile'),
    safeJsonParse(quoteRes, 'quote'),
    safeJsonParse(ratiosRes, 'ratios').catch(() => []),
    safeJsonParse(historyRes, 'history').catch(() => ({ historical: [] })),
  ]);

  console.log('Profile response:', JSON.stringify(profile));
  console.log('Quote response:', JSON.stringify(quote));

  // Handle API errors
  if (profile?.['Error Message'] || quote?.['Error Message']) {
    const errorMsg = profile?.['Error Message'] || quote?.['Error Message'];
    console.error('FMP API Error:', errorMsg);
    throw new Error(`API Error: ${errorMsg}`);
  }

  const profileData = Array.isArray(profile) ? profile[0] : profile;
  const quoteData = Array.isArray(quote) ? quote[0] : quote;
  const ratiosData = Array.isArray(ratios) ? ratios[0] : ratios;
  
  if (!profileData || !quoteData) {
    throw new Error(`Stock ${ticker} not found. Try US stocks like AAPL, MSFT, GOOGL`);
  }

  // Get 1 year of price history
  const historicalData = history?.historical || [];
  const priceHistory = historicalData
    .slice(0, 252)
    .reverse()
    .map((h: any) => ({ date: h.date, price: h.close }));

  // Build peers list from sector (simplified)
  const peers: StockData['peers'] = [];

  return {
    ticker: profileData.symbol || ticker,
    name: profileData.companyName || ticker,
    sector: profileData.sector || 'Unknown',
    industry: profileData.industry || 'Unknown',
    price: quoteData.price || 0,
    change: quoteData.change || 0,
    changePercent: quoteData.changesPercentage || 0,
    marketCap: quoteData.marketCap || 0,
    pe: quoteData.pe || null,
    peHistorical: ratiosData?.priceEarningsRatioTTM || quoteData.pe || null,
    evEbitda: ratiosData?.enterpriseValueOverEBITDATTM || null,
    revenueGrowth: null,
    netMargin: ratiosData?.netProfitMarginTTM ? ratiosData.netProfitMarginTTM * 100 : null,
    roe: ratiosData?.returnOnEquityTTM ? ratiosData.returnOnEquityTTM * 100 : null,
    debtToEbitda: ratiosData?.debtToEquityTTM || null,
    dividendYield: ratiosData?.dividendYielTTM ? ratiosData.dividendYielTTM * 100 : (quoteData.dividendYield || null),
    eps: quoteData.eps || null,
    beta: profileData.beta || null,
    priceHistory,
    peers,
  };
}

async function analyzeWithAI(stockData: StockData, apiKey: string): Promise<any> {
  const prompt = `Tu es un Analyste Senior Equity Research (Buy-Side) chez un family office prestigieux.

## DONNÉES DE L'ACTION
Ticker: ${stockData.ticker}
Nom: ${stockData.name}
Secteur: ${stockData.sector}
Industrie: ${stockData.industry}
Prix actuel: ${stockData.price}€
Variation jour: ${stockData.changePercent?.toFixed(2)}%
Capitalisation: ${(stockData.marketCap / 1e9).toFixed(2)} Mds€

## MÉTRIQUES FONDAMENTALES
- P/E actuel: ${stockData.pe?.toFixed(2) || 'N/A'}x
- EV/EBITDA: ${stockData.evEbitda?.toFixed(2) || 'N/A'}x
- Marge nette: ${stockData.netMargin?.toFixed(1) || 'N/A'}%
- ROE: ${stockData.roe?.toFixed(1) || 'N/A'}%
- Dette/Equity: ${stockData.debtToEbitda?.toFixed(2) || 'N/A'}x
- Dividende yield: ${stockData.dividendYield?.toFixed(2) || '0'}%
- EPS: ${stockData.eps?.toFixed(2) || 'N/A'}€
- Beta: ${stockData.beta?.toFixed(2) || 'N/A'}

## COMPARABLES
${stockData.peers.map(p => `- ${p.name} (${p.ticker}): P/E ${p.pe?.toFixed(2) || 'N/A'}x`).join('\n')}

## MISSION
Génère une analyse d'investissement complète en JSON strict (pas de markdown, juste le JSON):

{
  "profilInvestisseur": "Value|Growth|Dividende|GARP|Turnaround|Quality",
  "scoreQualite": <nombre 1-10>,
  "scoreValorisation": <nombre 1-10>,
  "scoreMomentum": <nombre 1-10>,
  "scoreGlobal": <nombre 1-10>,
  "moat": {
    "type": "Marque|Technologie|Réseau|Coûts|Switching|Aucun",
    "force": "Fort|Moyen|Faible",
    "description": "2-3 phrases sur l'avantage concurrentiel"
  },
  "swot": {
    "forces": ["force 1", "force 2", "force 3"],
    "faiblesses": ["faiblesse 1", "faiblesse 2"],
    "opportunites": ["opportunité 1", "opportunité 2"],
    "menaces": ["menace 1", "menace 2"]
  },
  "valorisation": {
    "verdict": "Sous-évaluée|Correctement valorisée|Surévaluée",
    "justification": "2-3 phrases expliquant le verdict",
    "prixCible": <objectif de cours à 12 mois en nombre>,
    "upside": <pourcentage potentiel en nombre>
  },
  "recommandation": "ACHAT FORT|ACHAT|CONSERVER|ALLÉGER|VENTE",
  "these": "3-4 phrases résumant la thèse d'investissement et pourquoi agir maintenant",
  "risquesPrincipaux": ["risque 1 détaillé", "risque 2 détaillé", "risque 3 détaillé"],
  "catalyseurs": ["catalyseur 1 avec timing", "catalyseur 2 avec timing"]
}

IMPORTANT: Réponds UNIQUEMENT avec le JSON, sans aucun texte avant ou après.`;

  const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'google/gemini-2.5-flash',
      messages: [
        { role: 'system', content: 'Tu es un analyste financier senior expert en Equity Research. Tu réponds uniquement en JSON valide.' },
        { role: 'user', content: prompt }
      ],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('AI API error:', response.status, error);
    throw new Error(`AI analysis failed: ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  
  console.log('AI response:', content);
  
  // Parse JSON from response
  try {
    // Remove potential markdown code blocks
    const jsonStr = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(jsonStr);
  } catch (e) {
    console.error('JSON parse error:', e);
    throw new Error('Failed to parse AI analysis');
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { ticker } = await req.json();
    
    if (!ticker) {
      return new Response(
        JSON.stringify({ error: 'Ticker is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const FMP_API_KEY = Deno.env.get('FMP_API_KEY');
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!FMP_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'FMP_API_KEY not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'LOVABLE_API_KEY not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Analyzing stock: ${ticker}`);

    // Fetch stock data
    const stockData = await fetchStockData(ticker.toUpperCase(), FMP_API_KEY);
    console.log('Stock data fetched:', stockData.name);

    // Analyze with AI
    const analysis = await analyzeWithAI(stockData, LOVABLE_API_KEY);
    console.log('AI analysis complete');

    return new Response(
      JSON.stringify({ stockData, analysis }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: unknown) {
    console.error('Error in analyze-stock:', error);
    const message = error instanceof Error ? error.message : 'Analysis failed';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
