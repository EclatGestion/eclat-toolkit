import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Download, RefreshCw } from "lucide-react";
import { TierLock } from "@/components/premium/TierLock";
import { ChatInterface } from "@/components/simulators/goal-based/ChatInterface";
import { AllocationChart } from "@/components/simulators/goal-based/AllocationChart";
import { EnveloppesChart } from "@/components/simulators/goal-based/EnveloppesChart";
import { ProjectionChart } from "@/components/simulators/goal-based/ProjectionChart";
import { SuccessProbability } from "@/components/simulators/goal-based/SuccessProbability";
import { ActionPlan } from "@/components/simulators/goal-based/ActionPlan";
import { ResultsKPI } from "@/components/simulators/goal-based/ResultsKPI";
import { SaveSimulationButton } from "@/components/simulators/SaveSimulationButton";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface GoalData {
  type: string | null;
  horizon: number | null;
  montantCible: number | null;
  age: number | null;
  capaciteEpargne: number | null;
  capitalInitial: number | null;
}

interface Results {
  allocation: { actions: number; obligations: number; fondsEuro: number; scpi: number };
  enveloppes: { av: number; per: number; pea: number; cto: number };
  rendementPondere: number;
  capitalFinal: number;
  versementMensuelRecommande: number;
  probabiliteSucces: number;
  projection: Array<{ annee: number; capital: number; versements: number }>;
  actionPlan: Array<{ mois: number; action: string; priorite: 'haute' | 'moyenne' | 'basse'; categorie: string }>;
}

export default function GoalBasedInvestment() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [goalData, setGoalData] = useState<GoalData>({
    type: null,
    horizon: null,
    montantCible: null,
    age: null,
    capaciteEpargne: null,
    capitalInitial: null,
  });
  const [results, setResults] = useState<Results | null>(null);
  const [goalSummary, setGoalSummary] = useState<string>("");

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = { role: 'user', content };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('analyze-investment-goal', {
        body: { messages: newMessages, goalData },
      });

      if (error) throw error;

      if (data.error) {
        toast.error(data.error);
        return;
      }

      const assistantMessage: Message = { role: 'assistant', content: data.message };
      setMessages([...newMessages, assistantMessage]);

      if (data.complete && data.results) {
        setGoalData(data.goalData);
        setResults(data.results);
        setGoalSummary(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([]);
    setGoalData({
      type: null,
      horizon: null,
      montantCible: null,
      age: null,
      capaciteEpargne: null,
      capitalInitial: null,
    });
    setResults(null);
    setGoalSummary("");
  };

  const handleExportPDF = () => {
    toast.info("Export PDF en cours de développement...");
    // TODO: Implémenter l'export PDF
  };

  return (
    <MainLayout title="Conseiller IA Personnalisé">
      <TierLock requiredTier="expert" variant="section">
        <div className="space-y-6">
          {/* Header avec badges */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-muted-foreground">
                Décrivez votre objectif en langage naturel, l'IA construit votre stratégie d'investissement.
              </p>
            </div>
            {results && (
              <div className="flex gap-2">
                <SaveSimulationButton
                  toolType="conseiller-ia"
                  toolLabel="Conseiller IA"
                  parameters={{
                    goalData,
                    goalSummary,
                  }}
                  results={{
                    allocation: results.allocation,
                    enveloppes: results.enveloppes,
                    capitalFinal: results.capitalFinal,
                    probabiliteSucces: results.probabiliteSucces,
                    versementMensuelRecommande: results.versementMensuelRecommande,
                    rendementPondere: results.rendementPondere,
                  }}
                />
                <Button variant="outline" size="sm" onClick={handleReset}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Nouvel objectif
                </Button>
                <Button variant="default" size="sm" onClick={handleExportPDF}>
                  <Download className="w-4 h-4 mr-2" />
                  Exporter PDF
                </Button>
              </div>
            )}
          </div>

          {/* Chat Interface */}
          <Card className="shadow-card">
            <CardHeader className="pb-0">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-primary" />
                Conversation avec votre conseiller IA
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ChatInterface
                messages={messages}
                isLoading={isLoading}
                onSendMessage={handleSendMessage}
              />
            </CardContent>
          </Card>

          {/* Résultats */}
          {results && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Résumé de l'objectif */}
              {goalSummary && (
                <Card className="shadow-card bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
                  <CardContent className="p-4">
                    <p className="text-foreground font-medium">{goalSummary}</p>
                  </CardContent>
                </Card>
              )}

              {/* KPIs */}
              <ResultsKPI
                capitalFinal={results.capitalFinal}
                versementMensuelRecommande={results.versementMensuelRecommande}
                rendementPondere={results.rendementPondere}
                horizon={goalData.horizon || 10}
              />

              {/* Charts Row 1 */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <AllocationChart allocation={results.allocation} />
                <EnveloppesChart enveloppes={results.enveloppes} />
                <SuccessProbability
                  probability={results.probabiliteSucces}
                  capitalFinal={results.capitalFinal}
                  montantCible={goalData.montantCible || 0}
                />
              </div>

              {/* Projection Chart */}
              <ProjectionChart
                projection={results.projection}
                montantCible={goalData.montantCible || 0}
              />

              {/* Action Plan */}
              <ActionPlan actions={results.actionPlan} />
            </div>
          )}
        </div>
      </TierLock>
    </MainLayout>
  );
}
