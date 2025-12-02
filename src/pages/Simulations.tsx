import { MainLayout } from "@/components/layout/MainLayout";
import { Save, FolderOpen } from "lucide-react";

export default function Simulations() {
  return (
    <MainLayout title="Mes Simulations">
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-20 h-20 rounded-3xl bg-muted flex items-center justify-center mb-6">
          <FolderOpen className="w-10 h-10 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          Aucune simulation sauvegardée
        </h2>
        <p className="text-muted-foreground max-w-md">
          Vos simulations sauvegardées apparaîtront ici. Lancez un outil depuis le catalogue et sauvegardez vos résultats pour les retrouver plus tard.
        </p>
      </div>
    </MainLayout>
  );
}
