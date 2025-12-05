import { lazy, Suspense } from "react";
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
import { PageLoader } from "@/components/ui/PageLoader";

// Eagerly load critical landing page
import Landing from "./pages/Landing";

// Lazy load all other pages for code splitting
const Auth = lazy(() => import("./pages/Auth"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const Catalogue = lazy(() => import("./pages/Catalogue"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Simulations = lazy(() => import("./pages/Simulations"));
const Settings = lazy(() => import("./pages/Settings"));
const ToolPage = lazy(() => import("./pages/ToolPage"));
const InteretsComposes = lazy(() => import("./pages/tools/InteretsComposes"));
const SimulateurImmobilier = lazy(() => import("./pages/tools/SimulateurImmobilier"));
const SimulateurIR = lazy(() => import("./pages/tools/SimulateurIR"));
const SimulateurSuccession = lazy(() => import("./pages/tools/SimulateurSuccession"));
const ComparateurLMNP = lazy(() => import("./pages/tools/ComparateurLMNP"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Academie = lazy(() => import("./pages/Academie"));
const SimulateurIRPublic = lazy(() => import("./pages/public/SimulateurIRPublic"));
const AcademiePublic = lazy(() => import("./pages/public/AcademiePublic"));
const BlogIndex = lazy(() => import("./pages/public/BlogIndex"));
const BlogArticle = lazy(() => import("./pages/public/BlogArticle"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <WealthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Suspense fallback={<PageLoader />}>
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
                <Route path="/tools/droits-succession" element={<ProtectedRoute><OnboardingGuard><SimulateurSuccession /></OnboardingGuard></ProtectedRoute>} />
                <Route path="/tools/comparateur-lmnp" element={<ProtectedRoute><OnboardingGuard><ComparateurLMNP /></OnboardingGuard></ProtectedRoute>} />
                <Route path="/tools/:toolId" element={<ProtectedRoute><OnboardingGuard><ToolPage /></OnboardingGuard></ProtectedRoute>} />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </WealthProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
