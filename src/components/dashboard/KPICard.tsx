import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
}

export function KPICard({ title, value, icon: Icon, iconColor, iconBg }: KPICardProps) {
  return (
    <div className="bg-card rounded-3xl p-5 shadow-card flex items-center gap-4">
      <div className={cn("w-14 h-14 rounded-full flex items-center justify-center", iconBg)}>
        <Icon className={cn("w-6 h-6", iconColor)} />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-xl font-semibold text-foreground">{value}</p>
      </div>
    </div>
  );
}
