import { useState } from "react";
import { CheckSquare, Calendar } from "lucide-react";

import {
  TablePagination,
  useTablePagination,
} from "../../../components/table";

const normalizeStatus = (status) => {
  if (!status) return "Pending";
  if (status === "To Do") return "Pending";
  if (status === "In Progress") return "Ongoing";
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
};

const PRIORITY_COLOR_MAP = {
  Low: "bg-blue-500",
  Medium: "bg-yellow-500",
  High: "bg-red-500",
};

export default function MyTasksTable({ tasks = [], onTaskClick }) {
  const [activeStatus, setActiveStatus] = useState("Pending");

  const statuses = [
    {
      name: "Pending",
      color: "text-orange-500",
      empty: "No urgent pending tasks.",
    },
    {
      name: "Ongoing",
      color: "text-blue-600",
      empty: "No urgent ongoing tasks.",
    },
    {
      name: "Completed",
      color: "text-green-600",
      empty: "No recent completed tasks.",
    },
    {
      name: "Overdue",
      color: "text-red-600",
      empty: "No overdue tasks.",
    },
  ];

  const sortedTasks = [...tasks].sort((a, b) => {
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;

    return new Date(a.dueDate) - new Date(b.dueDate);
  });

  const filteredTasks = sortedTasks.filter((task) => {
    const status = normalizeStatus(task.status);
  
    const today = new Date();
    const dueDate = task.dueDate
      ? new Date(task.dueDate)
      : null;
  
    const daysUntilDue = dueDate
      ? Math.ceil(
          (dueDate - today) /
          (1000 * 60 * 60 * 24)
        )
      : null;
  
    switch(activeStatus) {
  
      case "Pending":
        return (
          status === "Pending" &&
          (
            !dueDate ||
            daysUntilDue <= 7
          )
        );
  
      case "Ongoing":
        return status === "Ongoing";
  
      case "Completed":
        return status === "Completed";
  
      case "Overdue":
        return (
          dueDate &&
          dueDate < today &&
          status !== "Completed"
        );
  
      default:
        return false;
    }
  });

  const dashboardTasks = filteredTasks.slice(0,10);

  const {
    currentPage,
    rowsPerPage,
    totalRows,
    totalPages,
    paginatedItems,
    pageWindow,
    from,
    to,
    goTo,
    setRowsPerPage,
  } = useTablePagination(filteredTasks, 5);

  const contentHeight =
    rowsPerPage === 5
      ? ""
      : "max-h-[260px] overflow-y-auto";

  return (
    <div className="h-[500px] overflow-hidden rounded-xl border border-gray-200 bg-white flex flex-col">

      {/* Header */}
      <div className="p-5 pb-3">

        <div className="mb-5 flex items-start gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-500">
            <CheckSquare size={18} />
          </div>

          <div>
            <h2 className="text-md font-semibold text-gray-700">
              My Tasks
            </h2>

            <p className="text-xs text-gray-400">
              Urgent and near-due task tracker.
            </p>
          </div>

        </div>

        {/* Status Tabs */}
        <div className="mb-4 flex h-[44px] items-center border-b border-gray-200">

          {statuses.map((status) => {
            const count = tasks.filter(
              (task) => normalizeStatus(task.status) === status.name
            ).length;

            return (
              <button
                key={status.name}
                onClick={() => setActiveStatus(status.name)}
                className={`mr-8 pb-2 text-xs font-semibold uppercase transition ${
                  activeStatus === status.name
                    ? `${status.color} border-b-2 border-red-500`
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {status.name}
                <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-semibold text-gray-600">
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Task List */}
        <div className={contentHeight}>
          {paginatedItems.length > 0 ? (
            <div className="space-y-2">
              {dashboardTasks.map((task) => (
                <div
                  key={task._id}
                  onClick={() => onTaskClick?.(task)}
                  className="flex items-center justify-between rounded-md border border-gray-100 px-4 py-3 transition hover:bg-gray-50 cursor-pointer"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <input
                      type="checkbox"
                      checked={normalizeStatus(task.status) === "Completed"}
                      readOnly
                      className="h-4 w-4 rounded border-gray-300 text-red-500 pointer-events-none"
                    />
                    <div className="min-w-0">
                      {task.taskType &&
                        task.taskType !== "Other" && (
                          <p className="text-[11px] text-gray-400">
                            {task.taskType}
                          </p>
                        )}
                      <p
                        className={`truncate text-sm font-medium ${
                          normalizeStatus(task.status) === "Completed"
                            ? "line-through text-gray-400"
                            : "text-gray-700"
                        }`}
                      >
                        {task.subject}
                      </p>
                    </div>
                  </div>
                  <div className="ml-4 flex shrink-0 items-center gap-3">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        PRIORITY_COLOR_MAP[task.priority] || "bg-gray-400"
                      }`}
                    />
                    {task.dueDate && (
                      <div className="flex items-center gap-1 text-xs text-gray-500 whitespace-nowrap">
                        <Calendar size={12} />
                        {new Date(task.dueDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-[260px] items-center justify-center">
              <p className="text-sm text-gray-400">
                {
                  statuses.find(
                    (status) => status.name === activeStatus
                  )?.empty
                }
              </p>
            </div>
          )}
        </div>
      </div>
      {/* Footer */}
      <div className="mt-auto border-t border-gray-200 bg-gray-50/50 px-3 py-2">
        <TablePagination
          rowsOptions={[5, 10]}
          currentPage={currentPage}
          totalPages={totalPages}
          totalRows={totalRows}
          rowsPerPage={rowsPerPage}
          from={from}
          to={to}
          pageWindow={pageWindow}
          onGoTo={goTo}
          onRowsPerPageChange={setRowsPerPage}
          marginTop="mt-0"
        />
      </div>
    </div>
  );
}