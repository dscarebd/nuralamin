import { Link, useLocation } from "react-router-dom";
import { User, Link2, Briefcase, FolderOpen, DollarSign, Settings, LogOut, LayoutDashboard, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/admin" },
  { label: "Profile", icon: User, path: "/admin/profile" },
  { label: "Social Links", icon: Link2, path: "/admin/socials" },
  { label: "Experience", icon: Briefcase, path: "/admin/experience" },
  { label: "Portfolio", icon: FolderOpen, path: "/admin/projects" },
  { label: "Pricing", icon: DollarSign, path: "/admin/pricing" },
  { label: "Requests", icon: Inbox, path: "/admin/requests" },
  { label: "Settings", icon: Settings, path: "/admin/settings" },
];

export default function AdminSidebar() {
  const location = useLocation();
  const { signOut } = useAuth();

  const { data: unreadCount = 0 } = useQuery({
    queryKey: ["unread_requests_count"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("contact_requests")
        .select("*", { count: "exact", head: true })
        .eq("is_read", false);
      if (error) return 0;
      return count ?? 0;
    },
    refetchInterval: 30000,
  });

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
            {item.label === "Requests" && unreadCount > 0 && (
              <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1.5 text-[11px] font-semibold text-destructive-foreground">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
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
