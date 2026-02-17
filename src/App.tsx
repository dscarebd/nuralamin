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
import ProjectDetail from "./pages/ProjectDetail";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
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
import BlogEditor from "./pages/admin/BlogEditor";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import FloatingHeader from "./components/FloatingHeader";
import FloatingFooter from "./components/FloatingFooter";
import { usePrefetchData } from "./hooks/usePrefetchData";

const queryClient = new QueryClient();

const pageTransition = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.3, ease: "easeOut" as const } },
  exit: { opacity: 0, transition: { duration: 0.2, ease: "easeIn" as const } },
};

function AppLayout() {
  usePrefetchData();
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  const isHome = location.pathname === "/";

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
            <Route path="blog" element={<BlogEditor />} />
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
      <div className="flex-1 overflow-auto">
        <FloatingHeader />
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<motion.div {...pageTransition} className="lg:h-full lg:overflow-hidden"><Index /></motion.div>} />
            <Route path="/portfolio" element={<motion.div {...pageTransition}><Portfolio /></motion.div>} />
            <Route path="/portfolio/:id" element={<motion.div {...pageTransition}><ProjectDetail /></motion.div>} />
            <Route path="/blog" element={<motion.div {...pageTransition}><Blog /></motion.div>} />
            <Route path="/blog/:slug" element={<motion.div {...pageTransition}><BlogPost /></motion.div>} />
            <Route path="/pricing" element={<motion.div {...pageTransition}><Pricing /></motion.div>} />
            <Route path="*" element={<motion.div {...pageTransition}><NotFound /></motion.div>} />
          </Routes>
        </AnimatePresence>
        {/* Footer inside scroll area: visible on mobile/tablet always, and on desktop for non-home pages */}
        {!isHome && <FloatingFooter />}
        <div className="lg:hidden">
          {isHome && <FloatingFooter />}
        </div>
      </div>
      {/* Footer outside scroll area: desktop home only */}
      {isHome && (
        <div className="hidden lg:block">
          <FloatingFooter />
        </div>
      )}
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
