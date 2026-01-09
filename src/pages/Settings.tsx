import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { PremiumStatusCard } from "@/components/premium/PremiumStatusCard";
import { ProfileSettingsModal } from "@/components/settings/ProfileSettingsModal";
import { NotificationSettingsModal } from "@/components/settings/NotificationSettingsModal";
import { SecuritySettingsModal } from "@/components/settings/SecuritySettingsModal";
import { DeleteAccountModal } from "@/components/settings/DeleteAccountModal";
import { DataExportModal } from "@/components/settings/DataExportModal";
import { User, Bell, Shield, CreditCard, ChevronRight, LogOut, Trash2, Download } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
const settingsSections = [{
  id: "profile",
  title: "Profil",
  description: "Gérez vos informations personnelles",
  icon: User,
  iconColor: "text-primary",
  iconBg: "bg-primary/10"
}, {
  id: "notifications",
  title: "Notifications",
  description: "Configurez vos préférences de notifications",
  icon: Bell,
  iconColor: "text-warning",
  iconBg: "bg-warning/10"
}, {
  id: "security",
  title: "Sécurité",
  description: "Mot de passe et authentification",
  icon: Shield,
  iconColor: "text-success",
  iconBg: "bg-success/10"
}, {
  id: "export",
  title: "Exporter mes données",
  description: "Télécharger une copie de vos données (RGPD)",
  icon: Download,
  iconColor: "text-primary",
  iconBg: "bg-primary/10"
}];
const containerVariants = {
  hidden: {
    opacity: 0
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};
const itemVariants = {
  hidden: {
    opacity: 0,
    y: 10
  },
  visible: {
    opacity: 1,
    y: 0
  }
};
export default function Settings() {
  const {
    signOut
  } = useAuth();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [openModal, setOpenModal] = useState<string | null>(null);
  const handleSignOut = async () => {
    await signOut();
  };
  const handleSectionClick = (sectionId: string) => {
    setOpenModal(sectionId);
  };
  return <MainLayout title="Profil & Paramètres">
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="max-w-2xl space-y-6">
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
            {settingsSections.map(section => <motion.div key={section.id} whileHover={{
            scale: 1.01
          }} whileTap={{
            scale: 0.99
          }} onClick={() => handleSectionClick(section.id)} className="bg-card rounded-2xl p-4 shadow-card flex items-center gap-4 cursor-pointer hover:shadow-lg transition-all duration-300">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${section.iconBg}`}>
                  <section.icon className={`w-5 h-5 ${section.iconColor}`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-foreground">{section.title}</h3>
                  <p className="text-sm text-muted-foreground">{section.description}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </motion.div>)}
          </div>
        </motion.div>

        {/* Sign Out */}
        <motion.div variants={itemVariants}>
          <Button variant="outline" onClick={handleSignOut} className="w-full gap-2 text-destructive hover:text-destructive hover:bg-destructive/10">
            <LogOut className="w-4 h-4" />
            Se déconnecter
          </Button>
        </motion.div>

        {/* Danger Zone */}
        <motion.div variants={itemVariants} className="pt-4">
          <h2 className="text-lg font-semibold text-destructive mb-4 flex items-center gap-2">​Suppression de compte<Trash2 className="w-5 h-5" />
            Zone de danger
          </h2>
          <div onClick={() => setShowDeleteModal(true)} className="bg-destructive/5 border border-destructive/20 rounded-2xl p-4 flex items-center gap-4 cursor-pointer hover:bg-destructive/10 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-destructive/10">
              <Trash2 className="w-5 h-5 text-destructive" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-destructive">Supprimer mon compte</h3>
              <p className="text-sm text-muted-foreground">Action irréversible</p>
            </div>
            <ChevronRight className="w-5 h-5 text-destructive/50" />
          </div>
        </motion.div>
      </motion.div>

      {/* Modals */}
      <ProfileSettingsModal open={openModal === "profile"} onOpenChange={open => setOpenModal(open ? "profile" : null)} />
      <NotificationSettingsModal open={openModal === "notifications"} onOpenChange={open => setOpenModal(open ? "notifications" : null)} />
      <SecuritySettingsModal open={openModal === "security"} onOpenChange={open => setOpenModal(open ? "security" : null)} />
      <DataExportModal open={openModal === "export"} onOpenChange={open => setOpenModal(open ? "export" : null)} />
      <DeleteAccountModal open={showDeleteModal} onOpenChange={setShowDeleteModal} />
    </MainLayout>;
}