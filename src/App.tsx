import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Portfolio from "./pages/Portfolio";
import Pricing from "./pages/Pricing";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import DashboardHome from "./pages/admin/DashboardHome";
import ProfileEditor from "./pages/admin/ProfileEditor";
import SocialEditor from "./pages/admin/SocialEditor";
import ExperienceEditor from "./pages/admin/ExperienceEditor";
import ProjectsEditor from "./pages/admin/ProjectsEditor";
import PricingEditor from "./pages/admin/PricingEditor";
import SettingsEditor from "./pages/admin/SettingsEditor";
import RequestsEditor from "./pages/admin/RequestsEditor";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import FloatingHeader from "./components/FloatingHeader";
import FloatingFooter from "./components/FloatingFooter";

const queryClient = new QueryClient();

const pageTransition = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.3, ease: "easeOut" as const } },
  exit: { opacity: 0, transition: { duration: 0.2, ease: "easeIn" as const } },
};

function AppLayout() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  if (isAdmin) {
    return (
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}>
            <Route index element={<DashboardHome />} />
            <Route path="profile" element={<ProfileEditor />} />
            <Route path="socials" element={<SocialEditor />} />
            <Route path="experience" element={<ExperienceEditor />} />
            <Route path="projects" element={<ProjectsEditor />} />
            <Route path="pricing" element={<PricingEditor />} />
            <Route path="requests" element={<RequestsEditor />} />
            <Route path="settings" element={<SettingsEditor />} />
          </Route>
          <Route path="*" element={<motion.div {...pageTransition}><NotFound /></motion.div>} />
        </Routes>
      </AnimatePresence>
    );
  }

  return (
    <div className="flex h-screen flex-col">
      <FloatingHeader />
      <div className="flex-1 overflow-auto">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<motion.div {...pageTransition} className="h-full overflow-hidden"><Index /></motion.div>} />
            <Route path="/portfolio" element={<motion.div {...pageTransition}><Portfolio /></motion.div>} />
            <Route path="/pricing" element={<motion.div {...pageTransition}><Pricing /></motion.div>} />
            <Route path="*" element={<motion.div {...pageTransition}><NotFound /></motion.div>} />
          </Routes>
        </AnimatePresence>
        <FloatingFooter />
      </div>
    </div>
  );
}

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppLayout />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
