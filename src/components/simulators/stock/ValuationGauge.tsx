import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ValuationGaugeProps {
  pe: number | null;
  evEbitda: number | null;
  netMargin: number | null;
  roe: number | null;
  debtToEbitda: number | null;
  verdict: string;
  justification: string;
}

interface MetricBarProps {
  label: string;
  value: number | null;
  suffix: string;
  min: number;
  max: number;
  optimalMin?: number;
  optimalMax?: number;
  invertColor?: boolean;
}

function MetricBar({ label, value, suffix, min, max, optimalMin = min, optimalMax = max, invertColor = false }: MetricBarProps) {
  if (value === null) {
    return (
      <div className="space-y-1">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{label}</span>
          <span className="font-medium">N/A</span>
        </div>
        <div className="h-2 bg-muted rounded-full" />
      </div>
    );
  }

  const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
  
  let color = 'bg-amber-500';
  if (!invertColor) {
    if (value >= optimalMin && value <= optimalMax) {
      color = 'bg-emerald-500';
    } else if (value > optimalMax * 1.5 || value < optimalMin * 0.5) {
      color = 'bg-red-500';
    }
  } else {
    if (value <= optimalMax) {
      color = 'bg-emerald-500';
    } else if (value > optimalMax * 1.5) {
      color = 'bg-red-500';
    }
  }

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{value.toFixed(1)}{suffix}</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div 
          className={cn('h-full rounded-full transition-all', color)}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export function ValuationGauge({ 
  pe, 
  evEbitda, 
  netMargin, 
  roe, 
  debtToEbitda,
  verdict,
  justification 
}: ValuationGaugeProps) {
  const verdictColor = 
    verdict === 'Sous-évaluée' ? 'bg-emerald-500' :
    verdict === 'Surévaluée' ? 'bg-red-500' : 'bg-amber-500';

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Valorisation</CardTitle>
          <span className={cn('px-3 py-1 rounded-full text-white text-sm font-medium', verdictColor)}>
            {verdict}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">{justification}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <MetricBar 
          label="P/E Ratio" 
          value={pe} 
          suffix="x" 
          min={0} 
          max={50}
          optimalMin={10}
          optimalMax={20}
        />
        <MetricBar 
          label="EV/EBITDA" 
          value={evEbitda} 
          suffix="x" 
          min={0} 
          max={30}
          optimalMin={5}
          optimalMax={12}
        />
        <MetricBar 
          label="Marge Nette" 
          value={netMargin} 
          suffix="%" 
          min={0} 
          max={40}
          optimalMin={10}
          optimalMax={30}
        />
        <MetricBar 
          label="ROE" 
          value={roe} 
          suffix="%" 
          min={0} 
          max={40}
          optimalMin={15}
          optimalMax={30}
        />
        <MetricBar 
          label="Dette/Equity" 
          value={debtToEbitda} 
          suffix="x" 
          min={0} 
          max={5}
          optimalMax={1.5}
          invertColor
        />
      </CardContent>
    </Card>
  );
}
