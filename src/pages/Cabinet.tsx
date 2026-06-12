import { useQueryClient } from "@tanstack/react-query";
import {
  Banknote,
  Briefcase,
  FileText,
  PiggyBank,
  Target,
  TrendingUp,
  Users,
  AlarmClock,
} from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { StatCard } from "@/components/cabinet/StatCard";
import { DataSourceBadge } from "@/components/cabinet/DataSourceBadge";
import { OverviewTab } from "@/components/cabinet/OverviewTab";
import { ClientsTab } from "@/components/cabinet/ClientsTab";
import { RevenusTab } from "@/components/cabinet/RevenusTab";
import { PipelineTab } from "@/components/cabinet/PipelineTab";
import { useCabinetData } from "@/hooks/useCabinetData";
import { computeKpis } from "@/lib/cabinet/aggregate";
import { formatEuro } from "@/lib/cabinet/format";

export default function Cabinet() {
  const { data: result, isLoading, isFetching } = useCabinetData();
  const queryClient = useQueryClient();

  if (isLoading || !result) {
    return (
      <MainLayout title="Pilotage Cabinet">
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-3xl" />
            ))}
          </div>
          <Skeleton className="h-96 rounded-3xl" />
        </div>
      </MainLayout>
    );
  }

  const { data, source } = result;
  const kpis = computeKpis(data);

  return (
    <MainLayout title="Pilotage Cabinet">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Éclat Gestion Privée</h2>
            <p className="text-sm text-muted-foreground">
              Vue consolidée du cabinet, connectée à la feuille « 0. Liste Client NOUS ».
            </p>
          </div>
          <DataSourceBadge
            source={source}
            snapshotDate={data.snapshotDate}
            onRefresh={() => queryClient.invalidateQueries({ queryKey: ["cabinet-data"] })}
            isRefreshing={isFetching}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Encours global"
            value={formatEuro(kpis.encoursGlobal)}
            subtitle="y c. engagements Altaroc non appelés"
            icon={Briefcase}
          />
          <StatCard
            title="Clients"
            value={String(kpis.nbClients)}
            subtitle={`${kpis.nbContrats} contrats`}
            icon={Users}
            iconColor="text-blue-600"
            iconBg="bg-blue-500/10"
          />
          <StatCard
            title="Encours moyen / client"
            value={formatEuro(kpis.encoursMoyenClient)}
            icon={PiggyBank}
            iconColor="text-teal-600"
            iconBg="bg-teal-500/10"
          />
          <StatCard
            title="Collecte 2025/2026"
            value={formatEuro(kpis.collecte)}
            icon={TrendingUp}
            iconColor="text-emerald-600"
            iconBg="bg-emerald-500/10"
          />
          <StatCard
            title="CA total"
            value={formatEuro(kpis.caTotal)}
            subtitle="toutes sources assureurs"
            icon={Banknote}
            iconColor="text-amber-600"
            iconBg="bg-amber-500/10"
          />
          <StatCard
            title="Pipeline"
            value={formatEuro(kpis.pipelineTotal)}
            subtitle={`${data.pipeline.length} projets`}
            icon={Target}
            iconColor="text-purple-600"
            iconBg="bg-purple-500/10"
          />
          <StatCard
            title="Commissions en attente"
            value={formatEuro(kpis.feesPending)}
            subtitle="frais d'entrée non payés"
            icon={AlarmClock}
            iconColor="text-red-600"
            iconBg="bg-red-500/10"
          />
          <StatCard
            title="Récurrent"
            value={`${formatEuro(kpis.recurrentPrevoyanceMensuel)}/mois`}
            subtitle={`+ ${formatEuro(kpis.retroMandatsAnnuelles)}/an de rétro mandats`}
            icon={FileText}
            iconColor="text-indigo-600"
            iconBg="bg-indigo-500/10"
          />
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="flex-wrap h-auto">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="clients">Clients</TabsTrigger>
            <TabsTrigger value="revenus">Revenus & Trésorerie</TabsTrigger>
            <TabsTrigger value="pipeline">Pipeline & Engagements</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <OverviewTab data={data} />
          </TabsContent>
          <TabsContent value="clients">
            <ClientsTab data={data} />
          </TabsContent>
          <TabsContent value="revenus">
            <RevenusTab data={data} />
          </TabsContent>
          <TabsContent value="pipeline">
            <PipelineTab data={data} />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
