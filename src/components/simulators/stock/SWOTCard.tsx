import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, AlertTriangle, Lightbulb, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SWOT {
  forces: string[];
  faiblesses: string[];
  opportunites: string[];
  menaces: string[];
}

interface SWOTCardProps {
  swot: SWOT;
}

export function SWOTCard({ swot }: SWOTCardProps) {
  const quadrants = [
    {
      title: 'Forces',
      items: swot.forces,
      icon: Shield,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/30',
    },
    {
      title: 'Faiblesses',
      items: swot.faiblesses,
      icon: AlertTriangle,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/30',
    },
    {
      title: 'Opportunités',
      items: swot.opportunites,
      icon: Lightbulb,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30',
    },
    {
      title: 'Menaces',
      items: swot.menaces,
      icon: AlertCircle,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/30',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Analyse SWOT</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quadrants.map((q) => (
            <div 
              key={q.title}
              className={cn(
                'p-4 rounded-lg border',
                q.bgColor,
                q.borderColor
              )}
            >
              <div className="flex items-center gap-2 mb-3">
                <q.icon className={cn('h-5 w-5', q.color)} />
                <h4 className={cn('font-semibold', q.color)}>{q.title}</h4>
              </div>
              <ul className="space-y-2">
                {q.items.map((item, idx) => (
                  <li key={idx} className="text-sm flex items-start gap-2">
                    <span className={cn('mt-1.5 h-1.5 w-1.5 rounded-full flex-shrink-0', q.color.replace('text-', 'bg-'))} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
