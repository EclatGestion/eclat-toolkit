import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { TierLock } from '@/components/premium/TierLock';
import { StockSearchInput } from '@/components/simulators/stock/StockSearchInput';
import { StockKPICards } from '@/components/simulators/stock/StockKPICards';
import { StockPriceChart } from '@/components/simulators/stock/StockPriceChart';
import { ValuationGauge } from '@/components/simulators/stock/ValuationGauge';
import { SWOTCard } from '@/components/simulators/stock/SWOTCard';
import { AnalysisResults } from '@/components/simulators/stock/AnalysisResults';
import { SaveSimulationButton } from '@/components/simulators/SaveSimulationButton';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { LineChart, Info, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';

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

interface Analysis {
  profilInvestisseur: string;
  scoreQualite: number;
  scoreValorisation: number;
  scoreMomentum: number;
  scoreGlobal: number;
  moat: {
    type: string;
    force: string;
    description: string;
  };
  swot: {
    forces: string[];
    faiblesses: string[];
    opportunites: string[];
    menaces: string[];
  };
  valorisation: {
    verdict: string;
    justification: string;
    prixCible: number;
    upside: number;
  };
  recommandation: string;
  these: string;
  risquesPrincipaux: string[];
  catalyseurs: string[];
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-8 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardContent className="p-6">
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-[200px] w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-[200px] w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function AnalyseAction() {
  const [isLoading, setIsLoading] = useState(false);
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (ticker: string) => {
    setIsLoading(true);
    setError(null);
    setStockData(null);
    setAnalysis(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('analyze-stock', {
        body: { ticker }
      });

      if (fnError) {
        throw new Error(fnError.message);
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setStockData(data.stockData);
      setAnalysis(data.analysis);
      toast.success(`Analyse de ${data.stockData.name} terminée`);
    } catch (err) {
      console.error('Search error:', err);
      const message = err instanceof Error ? err.message : 'Erreur lors de l\'analyse';
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout title="Analyse Action">
      <TierLock requiredTier="expert" featureName="Analyse Action IA">
        <div className="space-y-6 pb-20">
          {/* Header */}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-indigo-500/10">
                <LineChart className="h-6 w-6 text-indigo-500" />
              </div>
              <h1 className="text-2xl font-bold">Analyse Action</h1>
            </div>
            <p className="text-muted-foreground">
              Analyse fondamentale complète avec recommandation IA style Equity Research
            </p>
          </div>

          {/* Search */}
          <Card>
            <CardHeader>
              <CardTitle>Rechercher une action</CardTitle>
              <CardDescription>
                Entrez un ticker (AAPL, MSFT, MC.PA...) pour obtenir une analyse complète
              </CardDescription>
            </CardHeader>
            <CardContent>
              <StockSearchInput onSearch={handleSearch} isLoading={isLoading} />
            </CardContent>
          </Card>

          {/* Info Alert */}
          {!stockData && !isLoading && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Cette analyse utilise des données en temps réel de Financial Modeling Prep et une analyse IA avancée 
                pour générer une note d'investissement professionnelle comparable aux rapports Equity Research.
              </AlertDescription>
            </Alert>
          )}

          {/* Error */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Loading */}
          {isLoading && <LoadingSkeleton />}

          {/* Results */}
          {stockData && analysis && (
            <div className="space-y-6">
              {/* Stock Header */}
              <Card className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-indigo-500/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-3xl font-bold">{stockData.name}</h2>
                      <p className="text-lg text-muted-foreground">{stockData.ticker} • {stockData.sector}</p>
                    </div>
                    <div className="flex gap-2">
                      <SaveSimulationButton
                        toolType="analyse-action"
                        toolLabel="Analyse Action"
                        parameters={{
                          ticker: stockData.ticker,
                          name: stockData.name,
                          sector: stockData.sector,
                        }}
                        results={{
                          price: stockData.price,
                          scoreGlobal: analysis.scoreGlobal,
                          recommandation: analysis.recommandation,
                          valorisationVerdict: analysis.valorisation.verdict,
                          prixCible: analysis.valorisation.prixCible,
                          upside: analysis.valorisation.upside,
                        }}
                      />
                      <Button variant="outline" className="gap-2">
                        <FileText className="h-4 w-4" />
                        Exporter PDF
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* KPIs */}
              <StockKPICards stockData={stockData} />

              {/* Price Chart */}
              <StockPriceChart 
                priceHistory={stockData.priceHistory} 
                currentPrice={stockData.price}
                ticker={stockData.ticker}
              />

              {/* Analysis Results */}
              <AnalysisResults analysis={analysis} currentPrice={stockData.price} />

              {/* Valuation & SWOT */}
              <div className="grid md:grid-cols-2 gap-6">
                <ValuationGauge
                  pe={stockData.pe}
                  evEbitda={stockData.evEbitda}
                  netMargin={stockData.netMargin}
                  roe={stockData.roe}
                  debtToEbitda={stockData.debtToEbitda}
                  verdict={analysis.valorisation.verdict}
                  justification={analysis.valorisation.justification}
                />
                <SWOTCard swot={analysis.swot} />
              </div>

              {/* Peers Comparison */}
              {stockData.peers.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Comparables sectoriels</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {stockData.peers.map((peer) => (
                        <div 
                          key={peer.ticker}
                          className="p-4 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                          onClick={() => handleSearch(peer.ticker)}
                        >
                          <p className="font-medium">{peer.name}</p>
                          <p className="text-sm text-muted-foreground">{peer.ticker}</p>
                          <p className="text-sm mt-1">
                            P/E: <span className="font-medium">{peer.pe?.toFixed(1) || 'N/A'}x</span>
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </TierLock>
    </MainLayout>
  );
}
