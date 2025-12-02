import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Catalogue from "./pages/Catalogue";
import Dashboard from "./pages/Dashboard";
import Simulations from "./pages/Simulations";
import Settings from "./pages/Settings";
import ToolPage from "./pages/ToolPage";
import InteretsComposes from "./pages/tools/InteretsComposes";
import SimulateurImmobilier from "./pages/tools/SimulateurImmobilier";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
          <Route path="/" element={<Catalogue />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/simulations" element={<Simulations />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/tools/interets-composes" element={<InteretsComposes />} />
          <Route path="/tools/simulateur-immobilier" element={<SimulateurImmobilier />} />
          <Route path="/tools/:toolId" element={<ToolPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
