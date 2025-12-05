import { LayoutDashboard, Grid3X3, Save, Settings, GraduationCap } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { cn } from "@/lib/utils";
import eclatLogo from "@/assets/eclat-logo.png";

const navItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard, badge: null },
  { title: "Catalogue d'Outils", url: "/catalogue", icon: Grid3X3, badge: "5" },
  { title: "Académie", url: "/academie-pro", icon: GraduationCap, badge: null },
  { title: "Mes Simulations", url: "/simulations", icon: Save, badge: null },
  { title: "Profil & Paramètres", url: "/settings", icon: Settings, badge: null },
];

export function Sidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-64 bg-sidebar border-r border-sidebar-border h-screen fixed left-0 top-0">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-sidebar-border">
        <img src={eclatLogo} alt="Éclat logo" className="w-10 h-10" />
        <span className="text-xl font-bold text-foreground">Éclat Toolkit</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.url}
            to={item.url}
            end={item.url === "/dashboard"}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-2xl text-sidebar-foreground transition-all duration-200",
              "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )}
            activeClassName="bg-sidebar-accent text-sidebar-primary font-medium border-l-4 border-sidebar-primary"
          >
            <item.icon className="w-5 h-5" />
            <span className="flex-1">{item.title}</span>
            {item.badge && (
              <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
