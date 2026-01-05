import { useState } from "react";
import { Save, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SaveSimulationModal } from "./SaveSimulationModal";
import { useSavedSimulations } from "@/hooks/useSavedSimulations";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

interface SaveSimulationButtonProps {
  toolType: string;
  toolLabel: string;
  parameters: Record<string, any>;
  results: Record<string, any>;
  onSaved?: () => void;
  disabled?: boolean;
}

export function SaveSimulationButton({
  toolType,
  toolLabel,
  parameters,
  results,
  onSaved,
  disabled = false,
}: SaveSimulationButtonProps) {
  const { user } = useAuth();
  const { saveSimulation } = useSavedSimulations();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  const handleSave = async (name: string) => {
    setIsSaving(true);
    const result = await saveSimulation(name, toolType, toolLabel, parameters, results);
    setIsSaving(false);

    if (result) {
      setIsModalOpen(false);
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 2000);
      onSaved?.();
    }
  };

  if (!user) return null;

  const defaultName = `${toolLabel} - ${new Date().toLocaleDateString("fr-FR")}`;

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsModalOpen(true)}
        disabled={disabled || isSaving}
        className="gap-2 relative overflow-hidden"
      >
        <AnimatePresence mode="wait">
          {justSaved ? (
            <motion.div
              key="check"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="flex items-center gap-2 text-green-600"
            >
              <Check className="w-4 h-4" />
              Sauvegardé
            </motion.div>
          ) : (
            <motion.div
              key="save"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Sauvegarder
            </motion.div>
          )}
        </AnimatePresence>
      </Button>

      <SaveSimulationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        defaultName={defaultName}
        isSaving={isSaving}
      />
    </>
  );
}
