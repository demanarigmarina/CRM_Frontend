import { ChevronRight, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PageBase, PageContentState } from "../../components/page";
import { useDashboard } from "./hooks/useDashboard";
import MyTasksTable from "./components/MyTaskTable";
import MyMeetingsTable from "./components/MyMeetingTable";

const TASKS_ROUTE = "/tasks";
const MEETINGS_ROUTE = "/meetings";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { stats, loading, error } = useDashboard();

  const tasks = stats?.tasks || [];
  const meetings = stats?.meetings || [];

  return (
    <PageBase>
      <div className="mb-3 flex w-full min-w-0 shrink-0 items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-lg font-semibold text-gray-800">Dashboard</h1>
          <p className="truncate text-xs text-gray-400">
            Manage your tasks and meetings
          </p>
        </div>

        <button
          type="button"
          className="flex shrink-0 items-center gap-2 rounded-md border border-gray-200 px-4 py-2 text-xs text-gray-600 transition hover:bg-gray-50"
        >
          <Filter size={13} />
          Filter
        </button>
      </div>

      {error && (
        <div className="mb-2 rounded-md bg-red-50 px-3 py-2 text-xs text-red-500">
          {error}
        </div>
      )}

      <PageContentState loading={loading}>
        <div className="flex h-full w-full min-w-0 flex-1 flex-col overflow-hidden">
          <section className="mt-4 w-full min-w-0 shrink-0">
            <div className="mb-3 flex w-full items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold text-gray-700">My Tasks</h2>
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] text-gray-500">
                  {tasks.length}
                </span>
              </div>

              <button
                type="button"
                onClick={() => navigate(TASKS_ROUTE)}
                className="mr-8 inline-flex shrink-0 items-center whitespace-nowrap text-xs font-medium text-gray-500 transition hover:text-red-500"
              >
                <span>View more</span>
                <ChevronRight size={15} strokeWidth={2.2} className="-ml-0.5" />
              </button>
            </div>

            <MyTasksTable tasks={tasks} />
          </section>

          <section className="mt-auto w-full min-w-0 shrink-0 pb-2">
            <div className="mb-3 flex w-full items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold text-gray-700">My Meetings</h2>
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] text-gray-500">
                  {meetings.length}
                </span>
              </div>

              <button
                type="button"
                onClick={() => navigate(MEETINGS_ROUTE)}
                className="mr-8 inline-flex shrink-0 items-center whitespace-nowrap text-xs font-medium text-gray-500 transition hover:text-red-500"
              >
                <span>View more</span>
                <ChevronRight size={15} strokeWidth={2.2} className="-ml-0.5" />
              </button>
            </div>

            <MyMeetingsTable meetings={meetings} />
          </section>
        </div>
      </PageContentState>
    </PageBase>
  );
}