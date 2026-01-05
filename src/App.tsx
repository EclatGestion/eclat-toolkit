import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { WealthProvider } from "@/contexts/WealthContext";
import { PremiumProvider } from "@/contexts/PremiumContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { OnboardingGuard } from "@/components/auth/OnboardingGuard";
import { PublicRoute } from "@/components/auth/PublicRoute";
import { PageLoader } from "@/components/ui/PageLoader";
import { CookieBanner } from "@/components/cookies/CookieBanner";

// Eagerly load critical landing page
import Landing from "./pages/Landing";

// Lazy load all other pages for code splitting
const Auth = lazy(() => import("./pages/Auth"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const MonParcours = lazy(() => import("./pages/MonParcours"));
const Toolbox = lazy(() => import("./pages/Toolbox"));
const Patrimoine = lazy(() => import("./pages/Patrimoine"));
const Simulations = lazy(() => import("./pages/Simulations"));
const Settings = lazy(() => import("./pages/Settings"));
const ToolPage = lazy(() => import("./pages/ToolPage"));
const PartenaireAssuranceVie = lazy(() => import("./pages/PartenaireAssuranceVie"));
const ContactEclat = lazy(() => import("./pages/ContactEclat"));
const InteretsComposes = lazy(() => import("./pages/tools/InteretsComposes"));
const SimulateurImmobilier = lazy(() => import("./pages/tools/SimulateurImmobilier"));
const SimulateurIR = lazy(() => import("./pages/tools/SimulateurIR"));
const SimulateurSuccession = lazy(() => import("./pages/tools/SimulateurSuccession"));
const ComparateurLMNP = lazy(() => import("./pages/tools/ComparateurLMNP"));
const CapaciteEpargne = lazy(() => import("./pages/tools/CapaciteEpargne"));
const Inflation = lazy(() => import("./pages/tools/Inflation"));
const AssuranceVie = lazy(() => import("./pages/tools/AssuranceVie"));
const OptimisationPER = lazy(() => import("./pages/tools/OptimisationPER"));
const BilanPatrimonialAvance = lazy(() => import("./pages/tools/BilanPatrimonialAvance"));
const GoalBasedInvestment = lazy(() => import("./pages/tools/GoalBasedInvestment"));
const AnalyseAction = lazy(() => import("./pages/tools/AnalyseAction"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Academie = lazy(() => import("./pages/Academie"));
const SimulateurIRPublic = lazy(() => import("./pages/public/SimulateurIRPublic"));
const AcademiePublic = lazy(() => import("./pages/public/AcademiePublic"));
const BlogIndex = lazy(() => import("./pages/public/BlogIndex"));
const BlogArticle = lazy(() => import("./pages/public/BlogArticle"));
const Pricing = lazy(() => import("./pages/public/Pricing"));
const MentionsLegales = lazy(() => import("./pages/public/MentionsLegales"));
const PolitiqueConfidentialite = lazy(() => import("./pages/public/PolitiqueConfidentialite"));
const CGU = lazy(() => import("./pages/public/CGU"));
const DiagnosticPatrimonial = lazy(() => import("./pages/public/DiagnosticPatrimonial"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <PremiumProvider>
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
                  <Route path="/pricing" element={<Pricing />} />
                  <Route path="/blog" element={<BlogIndex />} />
                  <Route path="/blog/:slug" element={<BlogArticle />} />
                  <Route path="/mentions-legales" element={<MentionsLegales />} />
                  <Route path="/confidentialite" element={<PolitiqueConfidentialite />} />
                  <Route path="/cgu" element={<CGU />} />
                  <Route path="/diagnostic" element={<DiagnosticPatrimonial />} />
                  
                  {/* Partner Pages */}
                  <Route path="/partenaire/assurance-vie" element={<PartenaireAssuranceVie />} />
                  
                  {/* Redirects for old routes */}
                  <Route path="/dashboard" element={<Navigate to="/mon-parcours" replace />} />
                  <Route path="/catalogue" element={<Navigate to="/toolbox" replace />} />
                  
                  {/* Protected Pages */}
                  <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
                  <Route path="/mon-parcours" element={<ProtectedRoute><OnboardingGuard><MonParcours /></OnboardingGuard></ProtectedRoute>} />
                  <Route path="/toolbox" element={<ProtectedRoute><OnboardingGuard><Toolbox /></OnboardingGuard></ProtectedRoute>} />
                  <Route path="/contact-eclat" element={<ProtectedRoute><OnboardingGuard><ContactEclat /></OnboardingGuard></ProtectedRoute>} />
                  <Route path="/patrimoine" element={<ProtectedRoute><OnboardingGuard><Patrimoine /></OnboardingGuard></ProtectedRoute>} />
                  <Route path="/simulations" element={<ProtectedRoute><OnboardingGuard><Simulations /></OnboardingGuard></ProtectedRoute>} />
                  <Route path="/settings" element={<ProtectedRoute><OnboardingGuard><Settings /></OnboardingGuard></ProtectedRoute>} />
                  <Route path="/academie-pro" element={<ProtectedRoute><OnboardingGuard><Academie /></OnboardingGuard></ProtectedRoute>} />
                  <Route path="/tools/interets-composes" element={<ProtectedRoute><OnboardingGuard><InteretsComposes /></OnboardingGuard></ProtectedRoute>} />
                  <Route path="/tools/simulateur-immobilier" element={<ProtectedRoute><OnboardingGuard><SimulateurImmobilier /></OnboardingGuard></ProtectedRoute>} />
                  <Route path="/tools/simulateur-ir" element={<ProtectedRoute><OnboardingGuard><SimulateurIR /></OnboardingGuard></ProtectedRoute>} />
                  <Route path="/tools/droits-succession" element={<ProtectedRoute><OnboardingGuard><SimulateurSuccession /></OnboardingGuard></ProtectedRoute>} />
                  <Route path="/tools/comparateur-lmnp" element={<ProtectedRoute><OnboardingGuard><ComparateurLMNP /></OnboardingGuard></ProtectedRoute>} />
                  <Route path="/tools/capacite-epargne" element={<ProtectedRoute><OnboardingGuard><CapaciteEpargne /></OnboardingGuard></ProtectedRoute>} />
                  <Route path="/tools/inflation" element={<ProtectedRoute><OnboardingGuard><Inflation /></OnboardingGuard></ProtectedRoute>} />
                  <Route path="/tools/assurance-vie" element={<ProtectedRoute><OnboardingGuard><AssuranceVie /></OnboardingGuard></ProtectedRoute>} />
                  <Route path="/tools/optimisation-per" element={<ProtectedRoute><OnboardingGuard><OptimisationPER /></OnboardingGuard></ProtectedRoute>} />
                  <Route path="/tools/bilan-patrimonial" element={<ProtectedRoute><OnboardingGuard><BilanPatrimonialAvance /></OnboardingGuard></ProtectedRoute>} />
                  <Route path="/tools/goal-based-investment" element={<ProtectedRoute><OnboardingGuard><GoalBasedInvestment /></OnboardingGuard></ProtectedRoute>} />
                  <Route path="/tools/analyse-action" element={<ProtectedRoute><OnboardingGuard><AnalyseAction /></OnboardingGuard></ProtectedRoute>} />
                  <Route path="/tools/:toolId" element={<ProtectedRoute><OnboardingGuard><ToolPage /></OnboardingGuard></ProtectedRoute>} />
                  
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
              <CookieBanner />
            </BrowserRouter>
          </TooltipProvider>
        </WealthProvider>
      </PremiumProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
