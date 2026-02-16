import { Link, useLocation } from "react-router-dom";
import { User, Link2, Briefcase, FolderOpen, DollarSign, Settings, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/admin" },
  { label: "Profile", icon: User, path: "/admin/profile" },
  { label: "Social Links", icon: Link2, path: "/admin/socials" },
  { label: "Experience", icon: Briefcase, path: "/admin/experience" },
  { label: "Portfolio", icon: FolderOpen, path: "/admin/projects" },
  { label: "Pricing", icon: DollarSign, path: "/admin/pricing" },
  { label: "Settings", icon: Settings, path: "/admin/settings" },
];

export default function AdminSidebar() {
  const location = useLocation();
  const { signOut } = useAuth();

  return (
    <aside className="flex h-full w-64 flex-col border-r bg-card">
      <div className="border-b p-4">
        <Link to="/admin" className="text-lg font-bold text-foreground">
          Admin Panel
        </Link>
        <p className="text-xs text-muted-foreground">Manage your website</p>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              location.pathname === item.path
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="border-t p-3 space-y-2">
        <Button asChild variant="outline" size="sm" className="w-full justify-start gap-2">
          <Link to="/">
            <LayoutDashboard className="h-4 w-4" />
            View Site
          </Link>
        </Button>
        <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-destructive" onClick={signOut}>
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </aside>
  );
}
