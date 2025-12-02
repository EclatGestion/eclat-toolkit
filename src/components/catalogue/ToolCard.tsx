import { LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ToolCardProps {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
}

export function ToolCard({ id, title, description, icon: Icon, iconColor, iconBg }: ToolCardProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-card rounded-3xl p-6 shadow-card hover:shadow-lg transition-all duration-300 flex flex-col">
      <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-4", iconBg)}>
        <Icon className={cn("w-7 h-7", iconColor)} />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground flex-1 mb-4">{description}</p>
      <Button
        onClick={() => navigate(`/tools/${id}`)}
        className="w-full rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
      >
        Lancer
      </Button>
    </div>
  );
}
