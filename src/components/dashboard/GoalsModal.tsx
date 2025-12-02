import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useWealth, FireGoal } from "@/contexts/WealthContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { Plus, Trash2, Pencil, Target } from "lucide-react";

const goalSchema = z.object({
  label: z.string().min(2, "Le nom doit contenir au moins 2 caractères").max(50),
  target: z.number().min(100, "L'objectif doit être d'au moins 100€"),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Couleur invalide"),
});

type GoalFormValues = z.infer<typeof goalSchema>;

const PRESET_COLORS = [
  "#2D60FF",
  "#16DBCC",
  "#FFBB38",
  "#FF82AC",
  "#9333EA",
  "#22C55E",
  "#F97316",
  "#EF4444",
];

interface GoalsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GoalsModal({ open, onOpenChange }: GoalsModalProps) {
  const { fireGoals, addFireGoal, updateFireGoal, removeFireGoal } = useWealth();
  const [editingGoal, setEditingGoal] = useState<FireGoal | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const form = useForm<GoalFormValues>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      label: "",
      target: 10000,
      color: "#2D60FF",
    },
  });

  const resetForm = () => {
    form.reset({ label: "", target: 10000, color: "#2D60FF" });
    setEditingGoal(null);
    setIsFormVisible(false);
  };

  const onSubmit = (values: GoalFormValues) => {
    const goalData = {
      label: values.label,
      target: values.target,
      color: values.color,
    };
    
    if (editingGoal) {
      updateFireGoal(editingGoal.id, goalData);
      toast({
        title: "Objectif modifié",
        description: `${values.label} a été mis à jour.`,
      });
    } else {
      addFireGoal(goalData);
      toast({
        title: "Objectif ajouté",
        description: `${values.label} a été créé.`,
      });
    }
    resetForm();
  };

  const handleEdit = (goal: FireGoal) => {
    setEditingGoal(goal);
    form.reset({
      label: goal.label,
      target: goal.target,
      color: goal.color,
    });
    setIsFormVisible(true);
  };

  const handleDelete = (goal: FireGoal) => {
    removeFireGoal(goal.id);
    toast({
      title: "Objectif supprimé",
      description: `${goal.label} a été supprimé.`,
    });
  };

  const handleAddNew = () => {
    resetForm();
    setIsFormVisible(true);
  };

  return (
    <Dialog open={open} onOpenChange={(open) => {
      if (!open) resetForm();
      onOpenChange(open);
    }}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Gérer mes objectifs FIRE
          </DialogTitle>
          <DialogDescription>
            Définissez vos objectifs financiers personnalisés.
          </DialogDescription>
        </DialogHeader>

        {/* Liste des objectifs existants */}
        <div className="space-y-3 mt-4">
          {fireGoals.map((goal) => (
            <div
              key={goal.id}
              className="flex items-center justify-between p-3 bg-muted/50 rounded-xl"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: goal.color }}
                />
                <div>
                  <p className="font-medium text-sm">{goal.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {goal.target.toLocaleString("fr-FR")} €
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleEdit(goal)}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <Pencil className="w-4 h-4 text-muted-foreground" />
                </button>
                <button
                  onClick={() => handleDelete(goal)}
                  className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </button>
              </div>
            </div>
          ))}

          {fireGoals.length === 0 && (
            <div className="text-center py-6 text-muted-foreground">
              Aucun objectif défini
            </div>
          )}
        </div>

        {/* Bouton Ajouter */}
        {!isFormVisible && (
          <Button
            variant="outline"
            onClick={handleAddNew}
            className="w-full mt-4 gap-2"
          >
            <Plus className="w-4 h-4" />
            Ajouter un objectif
          </Button>
        )}

        {/* Formulaire */}
        {isFormVisible && (
          <div className="mt-4 p-4 border rounded-xl bg-card">
            <h4 className="font-medium mb-4">
              {editingGoal ? "Modifier l'objectif" : "Nouvel objectif"}
            </h4>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="label"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom de l'objectif</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Voyage au Japon" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="target"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Montant cible (€)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="10000"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Couleur</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-2">
                          <div className="flex flex-wrap gap-2">
                            {PRESET_COLORS.map((color) => (
                              <button
                                key={color}
                                type="button"
                                onClick={() => field.onChange(color)}
                                className={`w-8 h-8 rounded-full transition-all ${
                                  field.value === color
                                    ? "ring-2 ring-offset-2 ring-primary scale-110"
                                    : "hover:scale-105"
                                }`}
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                          <Input
                            type="color"
                            className="w-10 h-10 p-1 cursor-pointer"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                    className="flex-1"
                  >
                    Annuler
                  </Button>
                  <Button type="submit" className="flex-1">
                    {editingGoal ? "Modifier" : "Créer"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
