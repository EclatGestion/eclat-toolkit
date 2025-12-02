import { LayoutDashboard, Grid3X3, Save, Settings, GraduationCap } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { cn } from "@/lib/utils";

const navItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Outils", url: "/catalogue", icon: Grid3X3 },
  { title: "Académie", url: "/academie", icon: GraduationCap },
  { title: "Profil", url: "/settings", icon: Settings },
];

export function BottomNav() {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-lg">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => (
          <NavLink
            key={item.url}
            to={item.url}
            end={item.url === "/"}
            className={cn(
              "flex flex-col items-center gap-1 px-4 py-2 rounded-2xl text-muted-foreground transition-all duration-200",
              "hover:text-primary"
            )}
            activeClassName="text-primary bg-primary/10"
          >
            <item.icon className="w-5 h-5" />
            <span className="text-xs font-medium">{item.title}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
