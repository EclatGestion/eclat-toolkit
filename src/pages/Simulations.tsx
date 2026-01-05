import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FolderOpen, 
  Search, 
  Calculator, 
  TrendingUp, 
  Percent, 
  Building2, 
  PiggyBank, 
  Wallet,
  Filter,
  Wrench
} from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { SimulationCard } from "@/components/simulations/SimulationCard";
import { useSavedSimulations } from "@/hooks/useSavedSimulations";

const toolFilters = [
  { value: "all", label: "Tous", icon: Filter },
  { value: "interets-composes", label: "Intérêts", icon: TrendingUp },
  { value: "simulateur-ir", label: "IR", icon: Percent },
  { value: "simulateur-immobilier", label: "Immobilier", icon: Building2 },
  { value: "assurance-vie", label: "Assurance-Vie", icon: PiggyBank },
  { value: "optimisation-per", label: "PER", icon: Wallet },
];

export default function Simulations() {
  const navigate = useNavigate();
  const { simulations, loading, updateSimulation, deleteSimulation, duplicateSimulation } = useSavedSimulations();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  const filteredSimulations = useMemo(() => {
    return simulations.filter((sim) => {
      const matchesSearch = sim.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sim.tool_label.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = selectedFilter === "all" || sim.tool_type === selectedFilter;
      return matchesSearch && matchesFilter;
    });
  }, [simulations, searchQuery, selectedFilter]);

  const handleRename = async (id: string, newName: string) => {
    return updateSimulation(id, { name: newName });
  };

  if (loading) {
    return (
      <MainLayout title="Mes Simulations">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-48 rounded-xl" />
            ))}
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Mes Simulations">
      <div className="space-y-6">
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher une simulation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {toolFilters.map((filter) => {
            const Icon = filter.icon;
            const isActive = selectedFilter === filter.value;
            const count = filter.value === "all" 
              ? simulations.length 
              : simulations.filter(s => s.tool_type === filter.value).length;

            if (filter.value !== "all" && count === 0) return null;

            return (
              <motion.button
                key={filter.value}
                onClick={() => setSelectedFilter(filter.value)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all
                  ${isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }
                `}
              >
                <Icon className="w-3.5 h-3.5" />
                {filter.label}
                {count > 0 && (
                  <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                    {count}
                  </Badge>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Content */}
        {simulations.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center min-h-[50vh] text-center"
          >
            <div className="w-20 h-20 rounded-3xl bg-muted flex items-center justify-center mb-6">
              <FolderOpen className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              Aucune simulation sauvegardée
            </h2>
            <p className="text-muted-foreground max-w-md mb-6">
              Lancez un outil depuis le catalogue et cliquez sur "Sauvegarder" pour retrouver vos simulations ici.
            </p>
            <Button onClick={() => navigate("/toolbox")} className="gap-2">
              <Wrench className="w-4 h-4" />
              Découvrir les outils
            </Button>
          </motion.div>
        ) : filteredSimulations.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <Search className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              Aucun résultat
            </h3>
            <p className="text-muted-foreground">
              Essayez un autre terme de recherche ou filtre.
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            <AnimatePresence>
              {filteredSimulations.map((simulation) => (
                <SimulationCard
                  key={simulation.id}
                  simulation={simulation}
                  onRename={handleRename}
                  onDuplicate={duplicateSimulation}
                  onDelete={deleteSimulation}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </MainLayout>
  );
}
