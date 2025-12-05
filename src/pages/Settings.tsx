import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { PremiumStatusCard } from "@/components/premium/PremiumStatusCard";
import { User, Bell, Shield, CreditCard, ChevronRight, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const settingsSections = [
  {
    id: "profile",
    title: "Profil",
    description: "Gérez vos informations personnelles",
    icon: User,
    iconColor: "text-primary",
    iconBg: "bg-primary/10",
  },
  {
    id: "notifications",
    title: "Notifications",
    description: "Configurez vos préférences de notifications",
    icon: Bell,
    iconColor: "text-amber-500",
    iconBg: "bg-amber-500/10",
  },
  {
    id: "security",
    title: "Sécurité",
    description: "Mot de passe et authentification",
    icon: Shield,
    iconColor: "text-emerald-500",
    iconBg: "bg-emerald-500/10",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

export default function Settings() {
  const { signOut } = useAuth();
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <MainLayout title="Profil & Paramètres">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-2xl space-y-6"
      >
        {/* Subscription Section */}
        <motion.div variants={itemVariants}>
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-primary" />
            Mon Abonnement
          </h2>
          <PremiumStatusCard />
        </motion.div>

        {/* Settings Sections */}
        <motion.div variants={itemVariants}>
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Paramètres
          </h2>
          <div className="space-y-3">
            {settingsSections.map((section) => (
              <motion.div
                key={section.id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => setActiveSection(section.id)}
                className="bg-card rounded-2xl p-4 shadow-card flex items-center gap-4 cursor-pointer hover:shadow-lg transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${section.iconBg}`}>
                  <section.icon className={`w-5 h-5 ${section.iconColor}`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-foreground">{section.title}</h3>
                  <p className="text-sm text-muted-foreground">{section.description}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Sign Out */}
        <motion.div variants={itemVariants}>
          <Button
            variant="outline"
            onClick={handleSignOut}
            className="w-full gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <LogOut className="w-4 h-4" />
            Se déconnecter
          </Button>
        </motion.div>
      </motion.div>
    </MainLayout>
  );
}
