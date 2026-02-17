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
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import RefundPolicy from "./pages/RefundPolicy";
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
import PoliciesEditor from "./pages/admin/PoliciesEditor";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import FloatingHeader from "./components/FloatingHeader";
import FloatingFooter from "./components/FloatingFooter";
import SplashScreen from "./components/SplashScreen";
import ContentProtection from "./components/ContentProtection";
import { usePrefetchData } from "./hooks/usePrefetchData";
import { useImagePreloader } from "./hooks/useImagePreloader";
import { usePageViewTracker } from "./hooks/usePageViewTracker";

const queryClient = new QueryClient();

const pageTransition = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.3, ease: "easeOut" as const } },
  exit: { opacity: 0, transition: { duration: 0.2, ease: "easeIn" as const } },
};

function AppLayout() {
  usePrefetchData();
  usePageViewTracker();
  const { ready, progress } = useImagePreloader();
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/abdullah");
  const isHome = location.pathname === "/";

  if (isAdmin) {
    return (
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/abdullah/login" element={<AdminLogin />} />
          <Route path="/abdullah" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}>
            <Route index element={<DashboardHome />} />
            <Route path="profile" element={<ProfileEditor />} />
            <Route path="socials" element={<SocialEditor />} />
            <Route path="experience" element={<ExperienceEditor />} />
            <Route path="projects" element={<ProjectsEditor />} />
            <Route path="pricing" element={<PricingEditor />} />
            <Route path="blog" element={<BlogEditor />} />
            <Route path="requests" element={<RequestsEditor />} />
            <Route path="policies" element={<PoliciesEditor />} />
            <Route path="settings" element={<SettingsEditor />} />
          </Route>
          <Route path="*" element={<motion.div {...pageTransition}><NotFound /></motion.div>} />
        </Routes>
      </AnimatePresence>
    );
  }

  return (
    <ContentProtection>
      <AnimatePresence>
        {!ready && <SplashScreen progress={progress} />}
      </AnimatePresence>
      <div className="flex h-screen flex-col">
        <div className={`flex-1 overflow-auto ${isHome ? "lg:overflow-hidden lg:flex lg:flex-col" : ""}`}>
          <FloatingHeader />
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<motion.div {...pageTransition} className="lg:flex-1 lg:min-h-0 lg:overflow-hidden"><Index /></motion.div>} />
              <Route path="/portfolio" element={<motion.div {...pageTransition}><Portfolio /></motion.div>} />
              <Route path="/portfolio/:id" element={<motion.div {...pageTransition}><ProjectDetail /></motion.div>} />
              <Route path="/blog" element={<motion.div {...pageTransition}><Blog /></motion.div>} />
              <Route path="/blog/:slug" element={<motion.div {...pageTransition}><BlogPost /></motion.div>} />
              <Route path="/pricing" element={<motion.div {...pageTransition}><Pricing /></motion.div>} />
              <Route path="/privacy-policy" element={<motion.div {...pageTransition}><PrivacyPolicy /></motion.div>} />
              <Route path="/terms-of-service" element={<motion.div {...pageTransition}><TermsOfService /></motion.div>} />
              <Route path="/refund-policy" element={<motion.div {...pageTransition}><RefundPolicy /></motion.div>} />
              <Route path="*" element={<motion.div {...pageTransition}><NotFound /></motion.div>} />
            </Routes>
          </AnimatePresence>
          {!isHome && <FloatingFooter />}
          <div className="lg:hidden">
            {isHome && <FloatingFooter />}
          </div>
        </div>
        {isHome && (
          <div className="hidden lg:block">
            <FloatingFooter />
          </div>
        )}
      </div>
    </ContentProtection>
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
