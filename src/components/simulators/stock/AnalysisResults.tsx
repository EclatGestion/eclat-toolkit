import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Target, AlertTriangle, Sparkles, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

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

interface AnalysisResultsProps {
  analysis: Analysis;
  currentPrice: number;
}

function ScoreCircle({ score, label }: { score: number; label: string }) {
  const color = score >= 7 ? 'text-emerald-500' : score >= 5 ? 'text-amber-500' : 'text-red-500';
  const bgColor = score >= 7 ? 'bg-emerald-500' : score >= 5 ? 'bg-amber-500' : 'bg-red-500';
  
  return (
    <div className="flex flex-col items-center">
      <div className="relative h-16 w-16">
        <svg className="h-16 w-16 -rotate-90">
          <circle
            cx="32"
            cy="32"
            r="28"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            className="text-muted"
          />
          <circle
            cx="32"
            cy="32"
            r="28"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeDasharray={`${(score / 10) * 176} 176`}
            className={color}
          />
        </svg>
        <div className={cn('absolute inset-0 flex items-center justify-center text-lg font-bold', color)}>
          {score}
        </div>
      </div>
      <span className="text-xs text-muted-foreground mt-1">{label}</span>
    </div>
  );
}

export function AnalysisResults({ analysis, currentPrice }: AnalysisResultsProps) {
  const recommandationColors: Record<string, string> = {
    'ACHAT FORT': 'bg-emerald-600 text-white',
    'ACHAT': 'bg-emerald-500 text-white',
    'CONSERVER': 'bg-amber-500 text-white',
    'ALLÉGER': 'bg-orange-500 text-white',
    'VENTE': 'bg-red-500 text-white',
  };

  const isUpside = analysis.valorisation.upside > 0;

  return (
    <div className="space-y-6">
      {/* Recommendation Card */}
      <Card className="border-2 border-primary/20">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Badge className={cn('text-lg px-4 py-1', recommandationColors[analysis.recommandation])}>
                  {analysis.recommandation}
                </Badge>
                <Badge variant="outline">{analysis.profilInvestisseur}</Badge>
              </div>
              <p className="text-muted-foreground max-w-xl">{analysis.these}</p>
            </div>
            
            <div className="flex flex-col items-center p-4 rounded-lg bg-muted/50">
              <span className="text-sm text-muted-foreground">Objectif 12 mois</span>
              <span className="text-3xl font-bold">${analysis.valorisation.prixCible.toFixed(2)}</span>
              <div className={cn(
                'flex items-center gap-1 text-sm font-medium',
                isUpside ? 'text-emerald-500' : 'text-red-500'
              )}>
                {isUpside ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                <span>{isUpside ? '+' : ''}{analysis.valorisation.upside.toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scores */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="h-5 w-5" />
            Scores d'Analyse
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-around">
            <ScoreCircle score={analysis.scoreGlobal} label="Global" />
            <ScoreCircle score={analysis.scoreQualite} label="Qualité" />
            <ScoreCircle score={analysis.scoreValorisation} label="Valorisation" />
            <ScoreCircle score={analysis.scoreMomentum} label="Momentum" />
          </div>
        </CardContent>
      </Card>

      {/* Moat */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Avantage Concurrentiel (Moat)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 mb-3">
            <Badge variant="outline">{analysis.moat.type}</Badge>
            <Badge 
              variant="outline"
              className={cn(
                analysis.moat.force === 'Fort' ? 'border-emerald-500 text-emerald-500' :
                analysis.moat.force === 'Moyen' ? 'border-amber-500 text-amber-500' :
                'border-red-500 text-red-500'
              )}
            >
              {analysis.moat.force}
            </Badge>
          </div>
          <p className="text-muted-foreground">{analysis.moat.description}</p>
        </CardContent>
      </Card>

      {/* Catalysts & Risks */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-emerald-500">
              <Sparkles className="h-5 w-5" />
              Catalyseurs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {analysis.catalyseurs.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-emerald-500 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-red-500">
              <AlertTriangle className="h-5 w-5" />
              Risques Principaux
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {analysis.risquesPrincipaux.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-red-500 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
