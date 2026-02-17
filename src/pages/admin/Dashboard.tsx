import { Outlet } from "react-router-dom";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Dashboard() {
  const isMobile = useIsMobile();

  return (
    <div className={`flex ${isMobile ? "flex-col" : ""} h-screen bg-background`}>
      <AdminSidebar />
      <main className={`flex-1 overflow-y-auto ${isMobile ? "p-4" : "p-6"}`}>
        <Outlet />
      </main>
    </div>
  );
}
