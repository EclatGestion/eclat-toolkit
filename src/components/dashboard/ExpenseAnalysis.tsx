import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ImportModal } from "./ImportModal";
import { 
  Upload, 
  TrendingDown, 
  Lightbulb, 
  AlertTriangle,
  CheckCircle,
  Loader2,
  RefreshCw
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

interface CategorizedExpense {
  category: string;
  total: number;
  count: number;
  percentage: number;
}

interface TopExpense {
  label: string;
  amount: number;
  category: string;
  date: string;
}

interface Recommendation {
  title: string;
  description: string;
  potentialSavings?: number;
  priority: "high" | "medium" | "low";
}

interface AnalysisData {
  categorizedExpenses: CategorizedExpense[];
  topExpenses: TopExpense[];
  recommendations: Recommendation[];
  totalExpenses: number;
  period?: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  Logement: "#2D60FF",
  Alimentation: "#16DBCC",
  Transport: "#FFBB38",
  Santé: "#FF6B6B",
  Loisirs: "#9333EA",
  Abonnements: "#F97316",
  Shopping: "#EC4899",
  Épargne: "#22C55E",
  Divers: "#718EBF",
};

const PRIORITY_CONFIG = {
  high: { icon: AlertTriangle, color: "text-rose-500", bg: "bg-rose-500/10" },
  medium: { icon: Lightbulb, color: "text-amber-500", bg: "bg-amber-500/10" },
  low: { icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-500/10" },
};

export function ExpenseAnalysis() {
  const { user } = useAuth();
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastAnalysisDate, setLastAnalysisDate] = useState<string | null>(null);

  // Load last analysis from database
  useEffect(() => {
    if (user) {
      loadLastAnalysis();
    }
  }, [user]);

  const loadLastAnalysis = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("expense_analyses")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (data && !error) {
      setAnalysisData({
        categorizedExpenses: (data.categorized_expenses as unknown) as CategorizedExpense[],
        topExpenses: (data.top_expenses as unknown) as TopExpense[],
        recommendations: (data.recommendations as unknown) as Recommendation[],
        totalExpenses: Number(data.total_amount) || 0,
      });
      setLastAnalysisDate(new Date(data.created_at!).toLocaleDateString("fr-FR"));
    }
  };

  const handleAnalysisComplete = (data: AnalysisData) => {
    setAnalysisData(data);
    setLastAnalysisDate(new Date().toLocaleDateString("fr-FR"));
  };

  const formatCurrency = (value: number) => {
    return Math.abs(value).toLocaleString("fr-FR") + " €";
  };

  // Prepare pie chart data
  const pieData = analysisData?.categorizedExpenses?.map((cat) => ({
    name: cat.category,
    value: Math.abs(cat.total),
    color: CATEGORY_COLORS[cat.category] || CATEGORY_COLORS.Divers,
  })) || [];

  return (
    <div className="bg-card rounded-3xl p-6 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Analyse des Dépenses</h3>
          {lastAnalysisDate && (
            <p className="text-xs text-muted-foreground mt-0.5">
              Dernière analyse : {lastAnalysisDate}
            </p>
          )}
        </div>
        <Button 
          onClick={() => setIsImportModalOpen(true)} 
          variant="outline" 
          size="sm"
          className="gap-2"
        >
          {analysisData ? <RefreshCw className="w-4 h-4" /> : <Upload className="w-4 h-4" />}
          {analysisData ? "Nouvelle analyse" : "Importer"}
        </Button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
          <p className="text-muted-foreground">Analyse en cours...</p>
          <p className="text-xs text-muted-foreground mt-1">
            L'IA examine votre relevé bancaire
          </p>
        </div>
      ) : !analysisData ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <TrendingDown className="w-8 h-8 text-primary" />
          </div>
          <h4 className="text-foreground font-medium mb-2">
            Analysez vos dépenses avec l'IA
          </h4>
          <p className="text-sm text-muted-foreground text-center mb-4 max-w-sm">
            Importez votre relevé bancaire PDF pour obtenir une analyse détaillée 
            et des recommandations personnalisées.
          </p>
          <div className="flex gap-3">
            <Button onClick={() => setIsImportModalOpen(true)} className="gap-2">
              <Upload className="w-4 h-4" />
              Importer un PDF
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Total dépenses */}
          <div className="flex items-center justify-center">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Total des dépenses</p>
              <p className="text-3xl font-bold text-foreground">
                {formatCurrency(analysisData.totalExpenses)}
              </p>
            </div>
          </div>

          {/* Charts & Top 5 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pie Chart */}
            <div>
              <h4 className="text-sm font-medium text-foreground mb-3">Répartition par catégorie</h4>
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => formatCurrency(value)}
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "12px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : null}
              {/* Legend */}
              <div className="flex flex-wrap justify-center gap-2 mt-2">
                {pieData.slice(0, 5).map((entry) => (
                  <div key={entry.name} className="flex items-center gap-1.5">
                    <div 
                      className="w-2.5 h-2.5 rounded-full" 
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-xs text-muted-foreground">{entry.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top 5 Expenses */}
            <div>
              <h4 className="text-sm font-medium text-foreground mb-3">Top 5 des dépenses</h4>
              <div className="space-y-2">
                {analysisData.topExpenses?.slice(0, 5).map((expense, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                        {index + 1}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-foreground truncate max-w-[180px]">
                          {expense.label}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {expense.category} • {expense.date}
                        </p>
                      </div>
                    </div>
                    <span className="font-semibold text-foreground">
                      {formatCurrency(expense.amount)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recommendations */}
          {analysisData.recommendations && analysisData.recommendations.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                Recommandations IA
              </h4>
              <div className="space-y-3">
                {analysisData.recommendations.map((rec, index) => {
                  const config = PRIORITY_CONFIG[rec.priority];
                  const Icon = config.icon;
                  return (
                    <div 
                      key={index}
                      className={`p-4 rounded-xl ${config.bg} border border-transparent`}
                    >
                      <div className="flex items-start gap-3">
                        <Icon className={`w-5 h-5 ${config.color} mt-0.5 shrink-0`} />
                        <div>
                          <p className="font-medium text-foreground">{rec.title}</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {rec.description}
                          </p>
                          {rec.potentialSavings && rec.potentialSavings > 0 && (
                            <p className="text-sm font-medium text-emerald-600 mt-2">
                              Économie potentielle : {formatCurrency(rec.potentialSavings)}/mois
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      <ImportModal 
        open={isImportModalOpen} 
        onOpenChange={setIsImportModalOpen}
        onAnalysisComplete={handleAnalysisComplete}
        setIsLoading={setIsLoading}
      />
    </div>
  );
}
