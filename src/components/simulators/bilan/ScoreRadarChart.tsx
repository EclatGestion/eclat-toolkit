import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";

interface ScoreRadarChartProps {
  financesScore: number;
  epargneScore: number;
  immobilierScore: number;
  fiscaliteScore: number;
  transmissionScore: number;
}

export function ScoreRadarChart({
  financesScore,
  epargneScore,
  immobilierScore,
  fiscaliteScore,
  transmissionScore,
}: ScoreRadarChartProps) {
  const data = [
    { pilier: "Finances", score: financesScore, fullMark: 100 },
    { pilier: "Épargne", score: epargneScore, fullMark: 100 },
    { pilier: "Immobilier", score: immobilierScore, fullMark: 100 },
    { pilier: "Fiscalité", score: fiscaliteScore, fullMark: 100 },
    { pilier: "Transmission", score: transmissionScore, fullMark: 100 },
  ];

  const scoreGlobal = Math.round(
    (financesScore + epargneScore + immobilierScore + fiscaliteScore + transmissionScore) / 5
  );

  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-emerald-500";
    if (score >= 50) return "text-amber-500";
    return "text-red-500";
  };

  return (
    <div className="flex flex-col items-center">
      <div className="text-center mb-4">
        <div className="text-sm text-muted-foreground">Score Global</div>
        <div className={`text-5xl font-bold ${getScoreColor(scoreGlobal)}`}>
          {scoreGlobal}
          <span className="text-xl text-muted-foreground">/100</span>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart data={data} cx="50%" cy="50%" outerRadius="75%">
          <PolarGrid stroke="hsl(var(--border))" />
          <PolarAngleAxis 
            dataKey="pilier" 
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
          />
          <PolarRadiusAxis 
            angle={90} 
            domain={[0, 100]} 
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
          />
          <Radar
            name="Score"
            dataKey="score"
            stroke="hsl(var(--primary))"
            fill="hsl(var(--primary))"
            fillOpacity={0.3}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>

      {/* Légende des scores */}
      <div className="grid grid-cols-5 gap-2 w-full mt-4 text-center text-xs">
        {data.map((item) => (
          <div key={item.pilier} className="p-2 rounded-lg bg-muted/50">
            <div className="text-muted-foreground truncate">{item.pilier}</div>
            <div className={`font-bold ${getScoreColor(item.score)}`}>{item.score}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
