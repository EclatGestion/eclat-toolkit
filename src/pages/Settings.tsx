import { MainLayout } from "@/components/layout/MainLayout";
import { User, Bell, Shield, CreditCard } from "lucide-react";

const settingsSections = [
  {
    title: "Profil",
    description: "Gérez vos informations personnelles",
    icon: User,
    iconColor: "text-primary",
    iconBg: "bg-primary/10",
  },
  {
    title: "Notifications",
    description: "Configurez vos préférences de notifications",
    icon: Bell,
    iconColor: "text-amber-500",
    iconBg: "bg-amber-500/10",
  },
  {
    title: "Sécurité",
    description: "Mot de passe et authentification",
    icon: Shield,
    iconColor: "text-emerald-500",
    iconBg: "bg-emerald-500/10",
  },
  {
    title: "Abonnement",
    description: "Gérez votre plan et facturation",
    icon: CreditCard,
    iconColor: "text-purple-500",
    iconBg: "bg-purple-500/10",
  },
];

export default function Settings() {
  return (
    <MainLayout title="Profil & Paramètres">
      <div className="max-w-2xl">
        <div className="space-y-4">
          {settingsSections.map((section) => (
            <div
              key={section.title}
              className="bg-card rounded-3xl p-6 shadow-card flex items-center gap-4 cursor-pointer hover:shadow-lg transition-all duration-300"
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${section.iconBg}`}>
                <section.icon className={`w-6 h-6 ${section.iconColor}`} />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{section.title}</h3>
                <p className="text-sm text-muted-foreground">{section.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
