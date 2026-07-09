import { CheckCircle, Edit2, PhoneCall, Trash2 } from "lucide-react";

import BaseKanban from "../../../components/kanban/BaseKanban";
import BaseDraggableCard from "../../../components/kanban/BaseDraggableCard";
import KanbanColumnHeader from "../../../components/kanban/KanbanColumnHeader";
import LoaderCards from "../../../components/loader/CardsLazyLoader";

const CALL_CATEGORIES = ["Future Call", "Past Call"];

const CATEGORY_LABEL = {
  "Future Call": "Future Calls",
  "Past Call": "Past Calls",
};

const CATEGORY_SUBTEXT = {
  "Future Call": "Scheduled client calls",
  "Past Call": "Completed or finished calls",
};

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

const normalizeCategory = (call) => {
  if (call.category === "Past Call" || call.status === "Completed") {
    return "Past Call";
  }

  return "Future Call";
};

const groupCallsByCategory = (calls = [], visibleStatuses = CALL_CATEGORIES) => {
  return visibleStatuses.reduce((grouped, status) => {
    grouped[status] = calls.filter((call) => normalizeCategory(call) === status);
    return grouped;
  }, {});
};

export default function CallsKanban({
  calls = [],
  loading = false,
  activeCategory = "All",
  onEdit,
  onDelete,
  onComplete,
  onCategoryChange,
}) {
  const visibleStatuses =
    activeCategory === "All"
      ? CALL_CATEGORIES
      : CALL_CATEGORIES.filter((status) => status === activeCategory);

  const columns = groupCallsByCategory(calls, visibleStatuses);

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    const oldCategory = source.droppableId;
    const newCategory = destination.droppableId;

    if (oldCategory === newCategory) return;

    if (onCategoryChange) {
      await onCategoryChange(draggableId, newCategory);
      return;
    }

    if (newCategory === "Past Call") {
      await onComplete?.(draggableId);
    }
  };

  if (loading) {
    return <LoaderCards columns={visibleStatuses} />;
  }

  return (
    <BaseKanban
      columns={columns}
      statuses={visibleStatuses}
      onDragEnd={handleDragEnd}
      emptyMessage="No calls"
      successStatus="Past Call"
      maxHeight="calc(100vh - 280px)"
      renderHeader={(status, items) => (
        <KanbanColumnHeader
          label={status}
          count={items.length}
          successStatus="Past Call"
          subtext={CATEGORY_SUBTEXT[status]}
        />
      )}
      renderCard={(call, index, items) => {
        const category = normalizeCategory(call);
        const isCompleted = call.status === "Completed" || category === "Past Call";

        return (
          <BaseDraggableCard
            key={call._id}
            id={String(call._id)}
            index={index}
            isLast={index === items.length - 1}
            wrapperClassName="hover:border-red-200 hover:bg-red-50"
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
              <p className="truncate">
                {call.contactMethod || "Phone"}: {getContactValue(call)}
              </p>

              <p className="truncate">
                {call.callType || "Follow-up Call"}
              </p>

              <p>{formatDateTime(call.scheduledAt)}</p>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                  isCompleted
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-sky-50 text-sky-700"
                }`}
              >
                {call.status || "Scheduled"}
              </span>

              <span className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-600">
                {CATEGORY_LABEL[category]}
              </span>
            </div>

            <div
              className="mt-4 flex items-center justify-end gap-2"
              onClick={(event) => event.stopPropagation()}
              onMouseDown={(event) => event.stopPropagation()}
              onPointerDown={(event) => event.stopPropagation()}
            >
              {!isCompleted && (
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    onComplete?.(call._id);
                  }}
                  className="p-1.5 rounded-md text-gray-400 hover:text-emerald-600 hover:bg-white"
                  title="Mark completed"
                >
                  <CheckCircle size={15} />
                </button>
              )}

              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onEdit?.(call);
                }}
                className="p-1.5 rounded-md text-gray-400 hover:text-sky-600 hover:bg-white"
                title="Edit call"
              >
                <Edit2 size={15} />
              </button>

              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onDelete?.(call._id);
                }}
                className="p-1.5 rounded-md text-gray-400 hover:text-red-600 hover:bg-white"
                title="Delete call"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </BaseDraggableCard>
        );
      }}
    />
  );
}