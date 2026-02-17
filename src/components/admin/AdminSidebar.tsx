import { Link, useLocation } from "react-router-dom";
import { User, Link2, Briefcase, FolderOpen, DollarSign, Settings, LogOut, LayoutDashboard, Inbox, FileText, Shield, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/abdullah" },
  { label: "Profile", icon: User, path: "/abdullah/profile" },
  { label: "Social Links", icon: Link2, path: "/abdullah/socials" },
  { label: "Experience", icon: Briefcase, path: "/abdullah/experience" },
  { label: "Portfolio", icon: FolderOpen, path: "/abdullah/projects" },
  { label: "Blog", icon: FileText, path: "/abdullah/blog" },
  { label: "Pricing", icon: DollarSign, path: "/abdullah/pricing" },
  { label: "Requests", icon: Inbox, path: "/abdullah/requests" },
  { label: "Policies", icon: Shield, path: "/abdullah/policies" },
  { label: "Settings", icon: Settings, path: "/abdullah/settings" },
];

export default function AdminSidebar() {
  const location = useLocation();
  const { signOut } = useAuth();
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

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

  const sidebarContent = (
    <>
      <div className="border-b p-4">
        <Link to="/abdullah" className="text-lg font-bold text-foreground" onClick={() => setOpen(false)}>
          Admin Panel
        </Link>
        <p className="text-xs text-muted-foreground">Manage your website</p>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={() => setOpen(false)}
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
          <Link to="/" onClick={() => setOpen(false)}>
            <LayoutDashboard className="h-4 w-4" />
            View Site
          </Link>
        </Button>
        <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-destructive" onClick={signOut}>
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </>
  );

  if (isMobile) {
    return (
      <>
        {/* Mobile top bar */}
        <div className="fixed top-0 left-0 right-0 z-50 flex h-14 items-center gap-3 border-b bg-card px-4">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0 flex flex-col">
              {sidebarContent}
            </SheetContent>
          </Sheet>
          <span className="text-sm font-bold text-foreground">Admin Panel</span>
        </div>
        {/* Spacer for fixed header */}
        <div className="h-14 shrink-0" />
      </>
    );
  }

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r bg-card">
      {sidebarContent}
    </aside>
  );
}
