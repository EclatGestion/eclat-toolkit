import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { WealthProvider } from "@/contexts/WealthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { OnboardingGuard } from "@/components/auth/OnboardingGuard";
import { PublicRoute } from "@/components/auth/PublicRoute";
import Auth from "./pages/Auth";
import Onboarding from "./pages/Onboarding";
import Landing from "./pages/Landing";
import Catalogue from "./pages/Catalogue";
import Dashboard from "./pages/Dashboard";
import Simulations from "./pages/Simulations";
import Settings from "./pages/Settings";
import ToolPage from "./pages/ToolPage";
import InteretsComposes from "./pages/tools/InteretsComposes";
import SimulateurImmobilier from "./pages/tools/SimulateurImmobilier";
import SimulateurIR from "./pages/tools/SimulateurIR";
import NotFound from "./pages/NotFound";
import Academie from "./pages/Academie";
import SimulateurIRPublic from "./pages/public/SimulateurIRPublic";
import AcademiePublic from "./pages/public/AcademiePublic";
import BlogIndex from "./pages/public/BlogIndex";
import BlogArticle from "./pages/public/BlogArticle";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <WealthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
            {/* Public SEO Pages */}
              <Route path="/" element={<PublicRoute><Landing /></PublicRoute>} />
              <Route path="/auth" element={<PublicRoute><Auth /></PublicRoute>} />
              <Route path="/simulateur-impot" element={<SimulateurIRPublic />} />
              <Route path="/academie" element={<AcademiePublic />} />
              <Route path="/blog" element={<BlogIndex />} />
              <Route path="/blog/:slug" element={<BlogArticle />} />
              
              {/* Protected Pages */}
              <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><OnboardingGuard><Dashboard /></OnboardingGuard></ProtectedRoute>} />
              <Route path="/catalogue" element={<ProtectedRoute><OnboardingGuard><Catalogue /></OnboardingGuard></ProtectedRoute>} />
              <Route path="/simulations" element={<ProtectedRoute><OnboardingGuard><Simulations /></OnboardingGuard></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><OnboardingGuard><Settings /></OnboardingGuard></ProtectedRoute>} />
              <Route path="/academie-pro" element={<ProtectedRoute><OnboardingGuard><Academie /></OnboardingGuard></ProtectedRoute>} />
              <Route path="/tools/interets-composes" element={<ProtectedRoute><OnboardingGuard><InteretsComposes /></OnboardingGuard></ProtectedRoute>} />
              <Route path="/tools/simulateur-immobilier" element={<ProtectedRoute><OnboardingGuard><SimulateurImmobilier /></OnboardingGuard></ProtectedRoute>} />
              <Route path="/tools/simulateur-ir" element={<ProtectedRoute><OnboardingGuard><SimulateurIR /></OnboardingGuard></ProtectedRoute>} />
              <Route path="/tools/:toolId" element={<ProtectedRoute><OnboardingGuard><ToolPage /></OnboardingGuard></ProtectedRoute>} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </WealthProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
