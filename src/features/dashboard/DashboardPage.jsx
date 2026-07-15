import { RefreshCw } from "lucide-react";

import {
  PageBase,
  PageHeader,
  PageContentState,
} from "../../components/page";

import { useDashboard } from "./hooks/useDashboard";

import MyTasksTable from "./components/MyTaskTable";
import MyMeetingsTable from "./components/MyMeetingTable";

export default function DashboardPage() {

  const {
    stats,
    loading,
    error,
    refetch,
  } = useDashboard();

  const tasks = Array.isArray(stats?.tasks)
    ? stats.tasks
    : [];

  const meetings = Array.isArray(stats?.meetings)
    ? stats.meetings
    : [];

  return (
    <PageBase>
      <div className="mb-5 flex items-center justify-between">
        <PageHeader
          title="Dashboard"
          subtitle="Manage your tasks and meetings"
        />

        <button
          onClick={refetch}
          disabled={loading}
          type="button"
          className="flex items-center gap-2 rounded-lg bg-red-500 px-3 py-2 text-xs font-semibold text-white hover:bg-red-600">
          <RefreshCw size={12}/>
          Refresh
        </button>

      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <PageContentState loading={loading}>
        <div className="grid gap-6 xl:grid-cols-2">
          <MyTasksTable
            tasks={tasks}
          />
          <MyMeetingsTable
            meetings={meetings}
          />
        </div>
      </PageContentState>
    </PageBase>
  );
}