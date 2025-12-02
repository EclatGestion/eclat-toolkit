import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useWealth, Expense } from "@/contexts/WealthContext";
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

const expenseSchema = z.object({
  label: z.string().min(2, "Le nom doit contenir au moins 2 caractères").max(100),
  amount: z.number().min(0, "Le montant doit être positif"),
  frequency: z.enum(["monthly", "annual"]),
  category: z.string().min(1, "Sélectionnez une catégorie"),
});

type ExpenseFormValues = z.infer<typeof expenseSchema>;

interface AddExpenseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const expenseCategories = [
  "Logement",
  "Transport",
  "Alimentation",
  "Assurances",
  "Abonnements",
  "Loisirs",
  "Impôts",
  "Crédits",
  "Autre",
];

export function AddExpenseModal({ open, onOpenChange }: AddExpenseModalProps) {
  const { expenses, addExpense, updateExpense, removeExpense } = useWealth();
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [showForm, setShowForm] = useState(false);

  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      label: "",
      amount: 0,
      frequency: "monthly",
      category: "Logement",
    },
  });

  useEffect(() => {
    if (editingExpense) {
      form.reset({
        label: editingExpense.label,
        amount: editingExpense.amount,
        frequency: editingExpense.frequency,
        category: editingExpense.category,
      });
      setShowForm(true);
    }
  }, [editingExpense, form]);

  const resetForm = () => {
    form.reset({
      label: "",
      amount: 0,
      frequency: "monthly",
      category: "Logement",
    });
    setEditingExpense(null);
    setShowForm(false);
  };

  const onSubmit = (values: ExpenseFormValues) => {
    const expenseData = {
      label: values.label,
      amount: values.amount,
      frequency: values.frequency,
      category: values.category,
    };
    if (editingExpense) {
      updateExpense(editingExpense.id, expenseData);
      toast({ title: "Dépense modifiée" });
    } else {
      addExpense(expenseData);
      toast({ title: "Dépense ajoutée" });
    }
    resetForm();
  };

  const handleDelete = (id: string) => {
    removeExpense(id);
    toast({ title: "Dépense supprimée" });
  };

  const formatCurrency = (value: number) => value.toLocaleString("fr-FR") + " €";

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) resetForm(); onOpenChange(o); }}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Gérer les Dépenses</DialogTitle>
          <DialogDescription>
            Ajoutez vos charges et dépenses récurrentes.
          </DialogDescription>
        </DialogHeader>

        {/* Liste des dépenses existantes */}
        {expenses.length > 0 && !showForm && (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {expenses.map((expense) => (
              <div
                key={expense.id}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-xl"
              >
                <div>
                  <p className="font-medium text-foreground">{expense.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {expense.category} • {expense.frequency === "monthly" ? "Mensuel" : "Annuel"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-rose-600">
                    -{formatCurrency(expense.amount)}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditingExpense(expense)}
                    className="h-8 w-8"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(expense.id)}
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
            Ajouter une dépense
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
                      <Input placeholder="Ex: Loyer" {...field} />
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
                        {expenseCategories.map((cat) => (
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
                  {editingExpense ? "Modifier" : "Ajouter"}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
