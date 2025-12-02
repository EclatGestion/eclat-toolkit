import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useWealth, Asset } from "@/contexts/WealthContext";
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
import { Building2, TrendingUp, Coins, Wallet, MoreHorizontal } from "lucide-react";

const assetSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères").max(100),
  type: z.enum(["Immobilier", "Bourse", "Crypto", "Cash", "Épargne", "Autre"]),
  value: z.number().min(0, "La valeur doit être positive"),
  bankName: z.string().optional(),
});

type AssetFormValues = z.infer<typeof assetSchema>;

interface AddAssetModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editAsset?: Asset | null;
}

const assetTypes = [
  { value: "Cash", label: "Compte Bancaire", icon: Wallet },
  { value: "Immobilier", label: "Immobilier", icon: Building2 },
  { value: "Bourse", label: "Bourse / Actions", icon: TrendingUp },
  { value: "Crypto", label: "Crypto", icon: Coins },
  { value: "Épargne", label: "Épargne", icon: Wallet },
  { value: "Autre", label: "Autre", icon: MoreHorizontal },
] as const;

export function AddAssetModal({ open, onOpenChange, editAsset }: AddAssetModalProps) {
  const { addAsset, updateAsset } = useWealth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AssetFormValues>({
    resolver: zodResolver(assetSchema),
    defaultValues: {
      name: "",
      type: "Cash",
      value: 0,
      bankName: "",
    },
  });

  // Reset form when editAsset changes
  useEffect(() => {
    if (editAsset) {
      form.reset({
        name: editAsset.name,
        type: editAsset.type,
        value: editAsset.value,
        bankName: editAsset.bankName || "",
      });
    } else {
      form.reset({
        name: "",
        type: "Cash",
        value: 0,
        bankName: "",
      });
    }
  }, [editAsset, form]);

  const onSubmit = async (values: AssetFormValues) => {
    setIsSubmitting(true);
    try {
      const assetData = {
        name: values.name,
        type: values.type,
        value: values.value,
        bankName: values.bankName,
      };
      
      if (editAsset) {
        updateAsset(editAsset.id, assetData);
        toast({
          title: "Actif modifié",
          description: `${values.name} a été mis à jour.`,
        });
      } else {
        addAsset(assetData);
        toast({
          title: "Actif ajouté",
          description: `${values.name} a été ajouté à votre patrimoine.`,
        });
      }
      form.reset();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editAsset ? "Modifier l'actif" : "Ajouter un actif"}</DialogTitle>
          <DialogDescription>
            {editAsset
              ? "Modifiez les informations de votre actif."
              : "Ajoutez un nouvel actif à votre patrimoine."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type d'actif</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {assetTypes.map((type) => {
                        const Icon = type.icon;
                        return (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex items-center gap-2">
                              <Icon className="w-4 h-4" />
                              {type.label}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom de l'actif</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Appartement Lyon" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valeur actuelle (€)</FormLabel>
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
              name="bankName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Établissement (optionnel)</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: BNP Paribas" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1"
              >
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? "Enregistrement..." : editAsset ? "Modifier" : "Ajouter"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
