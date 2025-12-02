import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useWealth, Income } from "@/contexts/WealthContext";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Pencil, Trash2, Plus } from "lucide-react";

const incomeSchema = z.object({
  label: z.string().min(2, "Le nom doit contenir au moins 2 caractères").max(100),
  amount: z.number().min(0, "Le montant doit être positif"),
  frequency: z.enum(["monthly", "annual"]),
  category: z.string().min(1, "Sélectionnez une catégorie"),
});

type IncomeFormValues = z.infer<typeof incomeSchema>;

interface AddIncomeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const incomeCategories = [
  "Salaire",
  "Loyers",
  "Dividendes",
  "Intérêts",
  "Freelance",
  "Autre",
];

export function AddIncomeModal({ open, onOpenChange }: AddIncomeModalProps) {
  const { incomes, addIncome, updateIncome, removeIncome } = useWealth();
  const [editingIncome, setEditingIncome] = useState<Income | null>(null);
  const [showForm, setShowForm] = useState(false);

  const form = useForm<IncomeFormValues>({
    resolver: zodResolver(incomeSchema),
    defaultValues: {
      label: "",
      amount: 0,
      frequency: "monthly",
      category: "Salaire",
    },
  });

  useEffect(() => {
    if (editingIncome) {
      form.reset({
        label: editingIncome.label,
        amount: editingIncome.amount,
        frequency: editingIncome.frequency,
        category: editingIncome.category,
      });
      setShowForm(true);
    }
  }, [editingIncome, form]);

  const resetForm = () => {
    form.reset({
      label: "",
      amount: 0,
      frequency: "monthly",
      category: "Salaire",
    });
    setEditingIncome(null);
    setShowForm(false);
  };

  const onSubmit = async (values: IncomeFormValues) => {
    const incomeData = {
      label: values.label,
      amount: values.amount,
      frequency: values.frequency,
      category: values.category,
    };
    if (editingIncome) {
      await updateIncome(editingIncome.id, incomeData);
      toast({ title: "Revenu modifié" });
    } else {
      await addIncome(incomeData);
      toast({ title: "Revenu ajouté" });
    }
    resetForm();
  };

  const handleDelete = async (id: string) => {
    await removeIncome(id);
    toast({ title: "Revenu supprimé" });
  };

  const formatCurrency = (value: number) => value.toLocaleString("fr-FR") + " €";

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) resetForm(); onOpenChange(o); }}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Gérer les Revenus</DialogTitle>
          <DialogDescription>
            Ajoutez vos sources de revenus pour calculer votre épargne.
          </DialogDescription>
        </DialogHeader>

        {/* Liste des revenus existants */}
        {incomes.length > 0 && !showForm && (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {incomes.map((income) => (
              <div
                key={income.id}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-xl"
              >
                <div>
                  <p className="font-medium text-foreground">{income.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {income.category} • {income.frequency === "monthly" ? "Mensuel" : "Annuel"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-emerald-600">
                    +{formatCurrency(income.amount)}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditingIncome(income)}
                    className="h-8 w-8"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(income.id)}
                    className="h-8 w-8 hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bouton ajouter ou formulaire */}
        {!showForm ? (
          <Button onClick={() => setShowForm(true)} className="gap-2 mt-2">
            <Plus className="w-4 h-4" />
            Ajouter un revenu
          </Button>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="label"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Libellé</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Salaire net" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Montant (€)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          value={field.value === 0 ? "" : field.value}
                          onChange={(e) => {
                            const val = e.target.value;
                            field.onChange(val === "" ? 0 : parseFloat(val));
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="frequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fréquence</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="monthly">Mensuel</SelectItem>
                          <SelectItem value="annual">Annuel</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Catégorie</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {incomeCategories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" onClick={resetForm} className="flex-1">
                  Annuler
                </Button>
                <Button type="submit" className="flex-1">
                  {editingIncome ? "Modifier" : "Ajouter"}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
