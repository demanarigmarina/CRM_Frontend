import { CheckCircle, Edit2, PhoneCall, Trash2 } from "lucide-react";

const KANBAN_COLUMNS = [
  {
    key: "Future Call",
    label: "Future Calls",
    description: "Scheduled client calls",
    color: "bg-sky-50 border-sky-200 text-sky-700",
  },
  {
    key: "Past Call",
    label: "Past Calls",
    description: "Completed or finished calls",
    color: "bg-emerald-50 border-emerald-200 text-emerald-700",
  },
];

const formatDateTime = (value) => {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleString("en-PH", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const getContactValue = (call) => {
  return call.contactValue || call.phone || call.email || "-";
};

export default function CallsKanban({
  calls = [],
  loading = false,
  activeCategory = "All",
  onEdit,
  onDelete,
  onComplete,
}) {
  const visibleColumns =
    activeCategory === "All"
      ? KANBAN_COLUMNS
      : KANBAN_COLUMNS.filter((column) => column.key === activeCategory);

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {visibleColumns.map((column) => (
          <div
            key={column.key}
            className="rounded-lg border border-gray-200 bg-white min-h-[450px] p-4"
          >
            <div className="h-5 w-32 bg-gray-100 rounded mb-4" />
            <div className="space-y-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-32 rounded-lg border border-gray-100 bg-gray-50 animate-pulse"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {visibleColumns.map((column) => {
        const columnCalls = calls.filter((call) => call.category === column.key);

        return (
          <section
            key={column.key}
            className="rounded-lg border border-gray-200 bg-white min-h-[450px] flex flex-col"
          >
            <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-gray-700">
                  {column.label}
                </h3>
                <p className="text-xs text-gray-400">{column.description}</p>
              </div>

              <span
                className={`text-xs font-medium border rounded-full px-2.5 py-1 ${column.color}`}
              >
                {columnCalls.length}
              </span>
            </div>

            <div className="flex-1 p-3 space-y-3 overflow-y-auto">
              {columnCalls.length === 0 ? (
                <div className="h-32 rounded-lg border border-dashed border-gray-200 flex items-center justify-center text-sm text-gray-400">
                  No calls
                </div>
              ) : (
                columnCalls.map((call) => (
                  <article
                    key={call._id}
                    className="rounded-lg border border-gray-200 bg-white p-4 hover:border-red-200 hover:bg-red-50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h4 className="text-sm font-semibold text-gray-800 truncate">
                          {call.clientName || "Unnamed client"}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1 truncate">
                          {call.companyName || "No company"}
                        </p>
                      </div>

                      <span className="h-8 w-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center shrink-0">
                        <PhoneCall size={15} />
                      </span>
                    </div>

                    <div className="mt-3 space-y-1.5 text-xs text-gray-500">
                      <p>
                        {call.contactMethod || "Phone"}: {getContactValue(call)}
                      </p>
                      <p>{call.callType || "Follow-up Call"}</p>
                      <p>{formatDateTime(call.scheduledAt)}</p>
                    </div>

                    <div className="mt-3">
                      <span className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-600">
                        {call.status || "Scheduled"}
                      </span>
                    </div>

                    <div className="mt-4 flex items-center justify-end gap-2">
                      {call.status !== "Completed" && (
                        <button
                          type="button"
                          onClick={() => onComplete?.(call._id)}
                          className="p-1.5 rounded-md text-gray-400 hover:text-emerald-600 hover:bg-white"
                          title="Mark completed"
                        >
                          <CheckCircle size={15} />
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => onEdit?.(call)}
                        className="p-1.5 rounded-md text-gray-400 hover:text-sky-600 hover:bg-white"
                        title="Edit call"
                      >
                        <Edit2 size={15} />
                      </button>

                      <button
                        type="button"
                        onClick={() => onDelete?.(call._id)}
                        className="p-1.5 rounded-md text-gray-400 hover:text-red-600 hover:bg-white"
                        title="Delete call"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}