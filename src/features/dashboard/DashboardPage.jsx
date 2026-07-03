import { RefreshCw, AlertCircle, Users } from "lucide-react";

import { PageBase, PageHeader } from "../../components/page";
import { useAuth } from "../../context/AuthContext";
import { useDashboard } from "./hooks/useDashboard";
import { isTeamlessAgent, isTeamlessManager } from "../../utils/teamAccess";

import KpiSection from "./components/KpiSection";
import LeadFunnelChart from "./components/LeadFunnelChart";
import MonthlyTrendsChart from "./components/MonthlyTrendsChart";
import QuotationPipelineChart from "./components/QuotationPipelineChart";
import TaskBreakdownChart from "./components/TaskBreakdownChart";
import LeadSourceChart from "./components/LeadSourceChart";
import TopPerformersSection from "./components/TopPerformersSection";
import RecentActivitySection from "./components/RecentActivitySection";

function TeamlessBanner({ user }) {
  if (!isTeamlessAgent(user) && !isTeamlessManager(user)) return null;

  const isAgent = isTeamlessAgent(user);

  return (
    <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
      <Users size={16} className="mt-0.5 shrink-0 text-amber-500" />
      <p>
        You're not assigned to a team. Please contact{" "}
        {isAgent ? "your administrator or sales manager" : "your administrator"}{" "}
        to be added to a team.
      </p>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { stats, loading, error, refetch } = useDashboard();

  if (error) {
    return (
      <PageBase className="items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-gray-400">
          <AlertCircle size={32} className="text-red-400" />
          <p className="text-sm">{error}</p>
          <button
            onClick={refetch}
            className="flex items-center gap-1.5 text-xs text-sky-600 hover:text-sky-700 font-medium"
          >
            <RefreshCw size={12} />
            Retry
          </button>
        </div>
      </PageBase>
    );
  }

  const charts = stats?.charts;
  const topPerformers = stats?.topPerformers ?? null;
  const recentActivity = stats?.recentActivity ?? [];

  return (
    <PageBase className="space-y-6 overflow-y-auto pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <PageHeader
          title="Dashboard"
          subtitle="Overview of your CRM activity"
        />
        <button
          onClick={refetch}
          disabled={loading}
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
        >
          <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
          {loading ? "Refreshing…" : "Refresh"}
        </button>
      </div>

      {/* Teamless Banner */}
      <TeamlessBanner user={user} />

      {/* KPI Cards */}
      <KpiSection kpi={stats?.kpi} loading={loading} />

      {/* Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <LeadFunnelChart data={charts?.leadFunnel} loading={loading} />
        <MonthlyTrendsChart
          monthlyLeads={charts?.monthlyLeads}
          monthlyClients={charts?.monthlyClients}
          loading={loading}
        />
      </div>

      {/* Row 2 */}
      <QuotationPipelineChart data={charts?.quotationPipeline} loading={loading} />

      {/* Row 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TaskBreakdownChart data={charts?.taskBreakdown} loading={loading} />
        <LeadSourceChart data={charts?.leadSources} loading={loading} />
      </div>

      {/* Row 4 */}
      <div
        className={
          topPerformers === null
            ? "w-full"
            : "grid grid-cols-1 lg:grid-cols-2 gap-4"
        }
      >
        {topPerformers !== null && (
          <TopPerformersSection data={topPerformers} loading={loading} />
        )}
        <RecentActivitySection data={recentActivity} loading={loading} />
      </div>
    </PageBase>
  );
}
