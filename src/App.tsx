import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { WealthProvider } from "@/contexts/WealthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { OnboardingGuard } from "@/components/auth/OnboardingGuard";
import Auth from "./pages/Auth";
import Onboarding from "./pages/Onboarding";
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
              <Route path="/auth" element={<Auth />} />
              <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
              <Route path="/" element={<ProtectedRoute><OnboardingGuard><Dashboard /></OnboardingGuard></ProtectedRoute>} />
              <Route path="/catalogue" element={<ProtectedRoute><OnboardingGuard><Catalogue /></OnboardingGuard></ProtectedRoute>} />
              <Route path="/simulations" element={<ProtectedRoute><OnboardingGuard><Simulations /></OnboardingGuard></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><OnboardingGuard><Settings /></OnboardingGuard></ProtectedRoute>} />
              <Route path="/academie" element={<ProtectedRoute><OnboardingGuard><Academie /></OnboardingGuard></ProtectedRoute>} />
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
