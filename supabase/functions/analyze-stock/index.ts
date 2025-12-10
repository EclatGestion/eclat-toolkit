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

async function fetchStockData(ticker: string): Promise<StockData> {
  // Use v8/finance/chart endpoint which doesn't require crumb authentication
  // Include all modules we need in a single call
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?interval=1d&range=1y&includePrePost=false`;
  console.log('Fetching Yahoo chart:', url);
  
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'application/json',
      'Accept-Language': 'en-US,en;q=0.9',
    }
  });
  
  if (!response.ok) {
    const text = await response.text();
    console.error('Yahoo chart error:', response.status, text);
    throw new Error(`Ticker not found: ${ticker}. Use suffixes for EU stocks (e.g., BNP.PA, SAP.DE)`);
  }
  
  const data = await response.json();
  const chart = data?.chart?.result?.[0];
  
  if (!chart) {
    throw new Error(`Stock ${ticker} not found. For EU stocks use: BNP.PA (Paris), SAP.DE (Frankfurt), ASML.AS (Amsterdam)`);
  }

  const meta = chart.meta || {};
  const timestamps = chart.timestamp || [];
  const quotes = chart.indicators?.quote?.[0] || {};
  const closes = quotes.close || [];

  // Build price history
  const priceHistory: { date: string; price: number }[] = [];
  for (let i = 0; i < timestamps.length; i++) {
    if (closes[i] !== null && closes[i] !== undefined) {
      const date = new Date(timestamps[i] * 1000).toISOString().split('T')[0];
      priceHistory.push({ date, price: closes[i] });
    }
  }

  // Extract data from meta (available without authentication)
  const currentPrice = meta.regularMarketPrice || 0;
  const previousClose = meta.previousClose || meta.chartPreviousClose || currentPrice;
  const change = currentPrice - previousClose;
  const changePercent = previousClose ? (change / previousClose) * 100 : 0;

  // Try to get additional metrics from a secondary endpoint (optional, may fail)
  let pe: number | null = null;
  let eps: number | null = null;
  let dividendYield: number | null = null;
  let marketCap: number | null = null;
  let beta: number | null = null;

  // Try Yahoo Finance v6 quote endpoint (less strict auth)
  try {
    const quoteUrl = `https://query1.finance.yahoo.com/v6/finance/quote?symbols=${encodeURIComponent(ticker)}`;
    const quoteRes = await fetch(quoteUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      }
    });
    if (quoteRes.ok) {
      const quoteData = await quoteRes.json();
      const quote = quoteData?.quoteResponse?.result?.[0];
      if (quote) {
        pe = quote.trailingPE || null;
        eps = quote.epsTrailingTwelveMonths || null;
        dividendYield = quote.dividendYield || null;
        marketCap = quote.marketCap || null;
        beta = quote.beta || null;
      }
    }
  } catch (e) {
    console.log('v6 quote endpoint failed, using defaults:', e);
  }

  const stockData: StockData = {
    ticker: meta.symbol || ticker,
    name: meta.longName || meta.shortName || meta.symbol || ticker,
    sector: 'N/A', // Not available without auth
    industry: 'N/A',
    price: currentPrice,
    change,
    changePercent,
    marketCap: marketCap || 0,
    pe,
    peHistorical: pe,
    evEbitda: null,
    revenueGrowth: null,
    netMargin: null,
    roe: null,
    debtToEbitda: null,
    dividendYield,
    eps,
    beta,
    priceHistory,
    peers: [],
  };

  console.log('Stock data fetched:', stockData.name, '| Price:', currentPrice, '| History:', priceHistory.length, 'points');
  return stockData;
}

async function analyzeWithAI(stockData: StockData, apiKey: string): Promise<any> {
  const prompt = `Tu es un Analyste Senior Equity Research (Buy-Side) chez un family office prestigieux.

## DONNÉES DE L'ACTION
Ticker: ${stockData.ticker}
Nom: ${stockData.name}
Secteur: ${stockData.sector}
Industrie: ${stockData.industry}
Prix actuel: ${stockData.price.toFixed(2)}€
Variation jour: ${stockData.changePercent?.toFixed(2)}%
Capitalisation: ${stockData.marketCap ? (stockData.marketCap / 1e9).toFixed(2) + ' Mds€' : 'N/A'}

## MÉTRIQUES FONDAMENTALES
- P/E actuel: ${stockData.pe?.toFixed(2) || 'N/A'}x
- EV/EBITDA: ${stockData.evEbitda?.toFixed(2) || 'N/A'}x
- Marge nette: ${stockData.netMargin?.toFixed(1) || 'N/A'}%
- ROE: ${stockData.roe?.toFixed(1) || 'N/A'}%
- Dividende yield: ${stockData.dividendYield?.toFixed(2) || '0'}%
- EPS: ${stockData.eps?.toFixed(2) || 'N/A'}€
- Beta: ${stockData.beta?.toFixed(2) || 'N/A'}

## HISTORIQUE DES COURS (1 an)
Prix début période: ${stockData.priceHistory[0]?.price.toFixed(2) || 'N/A'}€
Prix actuel: ${stockData.price.toFixed(2)}€
Performance 1 an: ${stockData.priceHistory.length > 0 ? (((stockData.price - stockData.priceHistory[0].price) / stockData.priceHistory[0].price) * 100).toFixed(2) : 'N/A'}%

## MISSION
En te basant sur ta connaissance du marché et de cette entreprise, génère une analyse d'investissement complète en JSON strict (pas de markdown, juste le JSON):

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
        { role: 'system', content: 'Tu es un analyste financier senior expert en Equity Research. Tu réponds uniquement en JSON valide. Tu as une excellente connaissance des entreprises cotées et de leurs fondamentaux.' },
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
  
  console.log('AI response received');
  
  // Parse JSON from response
  try {
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

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'LOVABLE_API_KEY not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Analyzing stock: ${ticker}`);

    // Fetch stock data from Yahoo Finance
    const stockData = await fetchStockData(ticker.toUpperCase());
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
