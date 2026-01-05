import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { motion } from "framer-motion";
import {
  Calculator,
  TrendingUp,
  Percent,
  Building2,
  PiggyBank,
  Wallet,
  Users,
  ChartBar,
  Target,
  LineChart,
  FileText,
  MoreVertical,
  Eye,
  Pencil,
  Copy,
  Trash2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { SavedSimulation } from "@/hooks/useSavedSimulations";

const toolIcons: Record<string, React.ElementType> = {
  "interets-composes": TrendingUp,
  "simulateur-ir": Percent,
  "simulateur-immobilier": Building2,
  "assurance-vie": PiggyBank,
  "optimisation-per": Wallet,
  "simulateur-succession": Users,
  "comparateur-lmnp": ChartBar,
  "capacite-epargne": Calculator,
  "inflation": LineChart,
  "goal-based": Target,
  "analyse-action": FileText,
  "bilan-patrimonial": Calculator,
};

const toolColors: Record<string, string> = {
  "interets-composes": "bg-emerald-500/10 text-emerald-600",
  "simulateur-ir": "bg-blue-500/10 text-blue-600",
  "simulateur-immobilier": "bg-orange-500/10 text-orange-600",
  "assurance-vie": "bg-purple-500/10 text-purple-600",
  "optimisation-per": "bg-indigo-500/10 text-indigo-600",
  "simulateur-succession": "bg-rose-500/10 text-rose-600",
  "comparateur-lmnp": "bg-amber-500/10 text-amber-600",
  "capacite-epargne": "bg-teal-500/10 text-teal-600",
  "inflation": "bg-red-500/10 text-red-600",
  "goal-based": "bg-cyan-500/10 text-cyan-600",
  "analyse-action": "bg-violet-500/10 text-violet-600",
  "bilan-patrimonial": "bg-sky-500/10 text-sky-600",
};

const toolRoutes: Record<string, string> = {
  "interets-composes": "/tools/interets-composes",
  "simulateur-ir": "/tools/simulateur-ir",
  "simulateur-immobilier": "/tools/simulateur-immobilier",
  "assurance-vie": "/tools/assurance-vie",
  "optimisation-per": "/tools/optimisation-per",
  "simulateur-succession": "/tools/simulateur-succession",
  "comparateur-lmnp": "/tools/comparateur-lmnp",
  "capacite-epargne": "/tools/capacite-epargne",
  "inflation": "/tools/inflation",
  "goal-based": "/tools/goal-based",
  "analyse-action": "/tools/analyse-action",
  "bilan-patrimonial": "/tools/bilan-patrimonial",
};

interface SimulationCardProps {
  simulation: SavedSimulation;
  onRename: (id: string, newName: string) => Promise<boolean>;
  onDuplicate: (simulation: SavedSimulation) => Promise<any>;
  onDelete: (id: string) => Promise<boolean>;
}

export function SimulationCard({
  simulation,
  onRename,
  onDuplicate,
  onDelete,
}: SimulationCardProps) {
  const navigate = useNavigate();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [newName, setNewName] = useState(simulation.name);
  const [isLoading, setIsLoading] = useState(false);

  const Icon = toolIcons[simulation.tool_type] || Calculator;
  const colorClass = toolColors[simulation.tool_type] || "bg-muted text-muted-foreground";
  const route = toolRoutes[simulation.tool_type] || "/toolbox";

  const handleView = () => {
    // Navigate to tool with simulation ID in state
    navigate(route, { state: { simulationId: simulation.id, loadSimulation: simulation } });
  };

  const handleRename = async () => {
    if (newName.trim() && newName !== simulation.name) {
      setIsLoading(true);
      await onRename(simulation.id, newName.trim());
      setIsLoading(false);
    }
    setShowRenameDialog(false);
  };

  const handleDuplicate = async () => {
    setIsLoading(true);
    await onDuplicate(simulation);
    setIsLoading(false);
  };

  const handleDelete = async () => {
    setIsLoading(true);
    await onDelete(simulation.id);
    setIsLoading(false);
    setShowDeleteDialog(false);
  };

  // Format key results for display
  const getResultPreview = () => {
    const results = simulation.results;
    const previews: { label: string; value: string }[] = [];

    // Common result fields
    if (results.capitalFinal !== undefined) {
      previews.push({ label: "Capital", value: `${Number(results.capitalFinal).toLocaleString("fr-FR")}€` });
    }
    if (results.impot !== undefined) {
      previews.push({ label: "Impôt", value: `${Number(results.impot).toLocaleString("fr-FR")}€` });
    }
    if (results.mensualite !== undefined) {
      previews.push({ label: "Mensualité", value: `${Number(results.mensualite).toLocaleString("fr-FR")}€` });
    }
    if (results.reductionIR !== undefined) {
      previews.push({ label: "Réduction IR", value: `${Number(results.reductionIR).toLocaleString("fr-FR")}€` });
    }
    if (results.capaciteEpargne !== undefined) {
      previews.push({ label: "Capacité", value: `${Number(results.capaciteEpargne).toLocaleString("fr-FR")}€` });
    }
    if (results.pouvoirAchatFinal !== undefined) {
      previews.push({ label: "Pouvoir d'achat", value: `${Number(results.pouvoirAchatFinal).toLocaleString("fr-FR")}€` });
    }

    return previews.slice(0, 2);
  };

  const resultPreviews = getResultPreview();

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
      >
        <Card className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-border">
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${colorClass}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-medium text-foreground truncate">{simulation.name}</h3>
                  <p className="text-sm text-muted-foreground">{simulation.tool_label}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {format(new Date(simulation.created_at), "dd MMMM yyyy", { locale: fr })}
                  </p>
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleView}>
                    <Eye className="w-4 h-4 mr-2" />
                    Voir
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowRenameDialog(true)}>
                    <Pencil className="w-4 h-4 mr-2" />
                    Renommer
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDuplicate}>
                    <Copy className="w-4 h-4 mr-2" />
                    Dupliquer
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => setShowDeleteDialog(true)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Supprimer
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {resultPreviews.length > 0 && (
              <div className="flex gap-3 mt-4 pt-3 border-t border-border/50">
                {resultPreviews.map((preview, index) => (
                  <div key={index} className="flex-1">
                    <p className="text-xs text-muted-foreground">{preview.label}</p>
                    <p className="font-semibold text-foreground">{preview.value}</p>
                  </div>
                ))}
              </div>
            )}

            <Button
              variant="secondary"
              size="sm"
              onClick={handleView}
              className="w-full mt-4 gap-2"
            >
              <Eye className="w-4 h-4" />
              Ouvrir
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cette simulation ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. La simulation "{simulation.name}" sera définitivement supprimée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Rename Dialog */}
      <Dialog open={showRenameDialog} onOpenChange={setShowRenameDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Renommer la simulation</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Nouveau nom..."
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRenameDialog(false)}>
              Annuler
            </Button>
            <Button onClick={handleRename} disabled={!newName.trim() || isLoading}>
              Renommer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
