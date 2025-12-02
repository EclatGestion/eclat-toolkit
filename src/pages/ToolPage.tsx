import { useParams, useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Wrench } from "lucide-react";

const toolNames: Record<string, string> = {
  "simulateur-ir": "Simulateur Impôt sur le Revenu",
  "droits-succession": "Droits de Succession",
  "capacite-emprunt": "Capacité d'Emprunt",
  "rentabilite-locative": "Rentabilité Pinel/LMNP",
  "interets-composes": "Intérêts Composés",
};

export default function ToolPage() {
  const { toolId } = useParams<{ toolId: string }>();
  const navigate = useNavigate();
  const toolName = toolId ? toolNames[toolId] || "Outil inconnu" : "Outil";

  return (
    <MainLayout title={toolName}>
      <div className="max-w-2xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6 rounded-2xl hover:bg-muted"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour au catalogue
        </Button>

        <div className="bg-card rounded-3xl p-8 shadow-card text-center">
          <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Wrench className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            {toolName}
          </h2>
          <p className="text-muted-foreground mb-6">
            Cet outil est en cours de développement. Revenez bientôt pour l'utiliser !
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 text-amber-600 rounded-2xl text-sm font-medium">
            🚧 En construction
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
