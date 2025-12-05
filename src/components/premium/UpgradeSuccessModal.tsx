import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Crown, Check, Sparkles } from "lucide-react";

interface UpgradeSuccessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const confettiColors = [
  "hsl(var(--primary))",
  "hsl(38 92% 50%)",
  "hsl(142 76% 36%)",
  "hsl(262 83% 58%)",
  "hsl(0 84% 60%)",
];

function ConfettiPiece({ delay, left }: { delay: number; left: number }) {
  const color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
  const rotation = Math.random() * 360;
  
  return (
    <motion.div
      initial={{ y: -20, x: 0, opacity: 1, rotate: 0 }}
      animate={{ 
        y: 400, 
        x: (Math.random() - 0.5) * 100,
        opacity: 0,
        rotate: rotation + 720,
      }}
      transition={{ 
        duration: 2 + Math.random(),
        delay,
        ease: "easeOut",
      }}
      className="absolute w-2 h-2 rounded-sm"
      style={{ 
        left: `${left}%`,
        backgroundColor: color,
      }}
    />
  );
}

export function UpgradeSuccessModal({ open, onOpenChange }: UpgradeSuccessModalProps) {
  const [confetti, setConfetti] = useState<{ id: number; delay: number; left: number }[]>([]);

  useEffect(() => {
    if (open) {
      const pieces = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        delay: Math.random() * 0.5,
        left: Math.random() * 100,
      }));
      setConfetti(pieces);
    }
  }, [open]);

  const features = [
    "Jauge de Sérénité Financière",
    "Coach Épargne interactif",
    "Analyse 50/30/20 détaillée",
    "Analyse IA des dépenses",
    "Recommandations personnalisées",
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md overflow-hidden">
        {/* Confetti */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <AnimatePresence>
            {open && confetti.map((piece) => (
              <ConfettiPiece key={piece.id} delay={piece.delay} left={piece.left} />
            ))}
          </AnimatePresence>
        </div>

        <DialogHeader className="relative z-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="mx-auto mb-4"
          >
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center shadow-lg">
              <Crown className="w-10 h-10 text-white" />
            </div>
          </motion.div>
          
          <DialogTitle className="text-center text-2xl">
            Bienvenue dans Premium ! 🎉
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-4 relative z-10">
          <p className="text-center text-muted-foreground">
            Vous avez maintenant accès à toutes les fonctionnalités Premium :
          </p>

          <div className="space-y-2">
            {features.map((feature, index) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="flex items-center gap-3 p-2 rounded-lg bg-primary/5"
              >
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <Check className="w-3 h-3 text-primary" />
                </div>
                <span className="text-sm font-medium">{feature}</span>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <Button 
              onClick={() => onOpenChange(false)} 
              className="w-full gap-2"
              size="lg"
            >
              <Sparkles className="w-4 h-4" />
              Explorer le Dashboard
            </Button>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
