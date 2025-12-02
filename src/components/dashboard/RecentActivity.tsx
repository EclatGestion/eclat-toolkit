import { Calculator, Home, TrendingUp, Scale } from "lucide-react";
import { cn } from "@/lib/utils";

const activities = [
  {
    id: 1,
    title: "Simulation IR 2024",
    date: "Aujourd'hui",
    result: "TMI: 30%",
    icon: Calculator,
    iconColor: "text-primary",
    iconBg: "bg-primary/10",
  },
  {
    id: 2,
    title: "Capacité d'emprunt",
    date: "Hier",
    result: "285 000 €",
    icon: Home,
    iconColor: "text-emerald-500",
    iconBg: "bg-emerald-500/10",
  },
  {
    id: 3,
    title: "Intérêts composés",
    date: "Il y a 3 jours",
    result: "+42 500 €",
    icon: TrendingUp,
    iconColor: "text-orange-500",
    iconBg: "bg-orange-500/10",
  },
  {
    id: 4,
    title: "Droits de succession",
    date: "Il y a 1 semaine",
    result: "15 230 €",
    icon: Scale,
    iconColor: "text-purple-500",
    iconBg: "bg-purple-500/10",
  },
];

export function RecentActivity() {
  return (
    <div className="bg-card rounded-3xl p-6 shadow-card">
      <h3 className="text-lg font-semibold text-foreground mb-4">Activité récente</h3>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-center gap-4">
            <div className={cn("w-12 h-12 rounded-full flex items-center justify-center", activity.iconBg)}>
              <activity.icon className={cn("w-5 h-5", activity.iconColor)} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">{activity.title}</p>
              <p className="text-sm text-muted-foreground">{activity.date}</p>
            </div>
            <p className="text-sm font-medium text-foreground">{activity.result}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
