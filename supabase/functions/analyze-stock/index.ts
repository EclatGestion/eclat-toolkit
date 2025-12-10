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

async function fetchStockData(ticker: string, apiKey: string): Promise<StockData> {
  const baseUrl = 'https://financialmodelingprep.com/api/v3';
  
  // Fetch multiple endpoints in parallel
  const [profileRes, quoteRes, ratiosRes, metricsRes, historyRes, peersRes] = await Promise.all([
    fetch(`${baseUrl}/profile/${ticker}?apikey=${apiKey}`),
    fetch(`${baseUrl}/quote/${ticker}?apikey=${apiKey}`),
    fetch(`${baseUrl}/ratios-ttm/${ticker}?apikey=${apiKey}`),
    fetch(`${baseUrl}/key-metrics-ttm/${ticker}?apikey=${apiKey}`),
    fetch(`${baseUrl}/historical-price-full/${ticker}?serietype=line&apikey=${apiKey}`),
    fetch(`${baseUrl}/stock_peers?symbol=${ticker}&apikey=${apiKey}`),
  ]);

  const [profile, quote, ratios, metrics, history, peersData] = await Promise.all([
    profileRes.json(),
    quoteRes.json(),
    ratiosRes.json(),
    metricsRes.json(),
    historyRes.json(),
    peersRes.json(),
  ]);

  console.log('Profile:', JSON.stringify(profile));
  console.log('Quote:', JSON.stringify(quote));

  if (!profile?.[0] || !quote?.[0]) {
    throw new Error(`Stock ${ticker} not found`);
  }

  const profileData = profile[0];
  const quoteData = quote[0];
  const ratiosData = ratios?.[0] || {};
  const metricsData = metrics?.[0] || {};
  
  // Get 1 year of price history
  const priceHistory = (history?.historical || [])
    .slice(0, 252)
    .reverse()
    .map((h: any) => ({ date: h.date, price: h.close }));

  // Fetch peer data
  const peerTickers = peersData?.[0]?.peersList?.slice(0, 3) || [];
  let peers: StockData['peers'] = [];
  
  if (peerTickers.length > 0) {
    try {
      const peerQuotes = await Promise.all(
        peerTickers.map((t: string) => 
          fetch(`${baseUrl}/quote/${t}?apikey=${apiKey}`).then(r => r.json())
        )
      );
      
      peers = peerTickers.map((t: string, i: number) => ({
        name: peerQuotes[i]?.[0]?.name || t,
        ticker: t,
        pe: peerQuotes[i]?.[0]?.pe || null,
        growth: null // Would need additional API call
      }));
    } catch (e) {
      console.error('Error fetching peers:', e);
    }
  }

  return {
    ticker: profileData.symbol,
    name: profileData.companyName,
    sector: profileData.sector || 'Unknown',
    industry: profileData.industry || 'Unknown',
    price: quoteData.price,
    change: quoteData.change,
    changePercent: quoteData.changesPercentage,
    marketCap: quoteData.marketCap,
    pe: quoteData.pe,
    peHistorical: ratiosData.priceEarningsRatioTTM || quoteData.pe,
    evEbitda: metricsData.enterpriseValueOverEBITDATTM || null,
    revenueGrowth: metricsData.revenuePerShareTTM ? 
      ((metricsData.revenuePerShareTTM / (metricsData.revenuePerShareTTM * 0.9) - 1) * 100) : null,
    netMargin: ratiosData.netProfitMarginTTM ? ratiosData.netProfitMarginTTM * 100 : null,
    roe: ratiosData.returnOnEquityTTM ? ratiosData.returnOnEquityTTM * 100 : null,
    debtToEbitda: metricsData.debtToEquityTTM || null,
    dividendYield: ratiosData.dividendYielTTM ? ratiosData.dividendYielTTM * 100 : null,
    eps: quoteData.eps,
    beta: profileData.beta,
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
