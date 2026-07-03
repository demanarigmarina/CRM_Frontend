import {
  Pencil,
  AlertCircle,
  User,
  Calendar,
  Magnet,
  UserCheck,
  Handshake,
  TriangleAlert,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getProfileImage } from "../../utils/avatar";
import { getDisplayName } from "../../utils/name";
import { formatDate, isDueToday, isOverdue } from "../../utils/date";

import {
  BaseTable,
  TableRow,
  TableCell,
  TablePagination,
  useTablePagination,
} from "../../components/table";
import LoaderTables from "../../components/loader/TablesLazyLoader";

import UserDisplayName from "../../components/UserDisplayName";
import BaseBadge from "../../components/badge/BaseBadge";
import StatusDropdown from "../../components/select/StatusDropdown";

import {
  canFullyEditTask,
  getTaskEditDisabledReason,
} from "./utils/taskPermissions";

const TASK_STATUSES = ["To Do", "In Progress", "Completed"];
const TASK_PRIORITIES = ["Low", "Medium", "High"];

const TASK_STATUS_TONE = {
  "To Do": "gray",
  "In Progress": "amber",
  Completed: "green",
};
const TASK_PRIORITY_TONE = {
  Low: "blue",
  Medium: "yellow",
  High: "red",
};

const RELATED_ICON = {
  Lead: Magnet,
  Customer: UserCheck,
  Quotation: Handshake,
};

const getRelatedName = (task) => {
  if (!task.relatedToType || !task.relatedTo) return null;
  const ref = task.relatedTo;
  const type = task.relatedToType;
  if (type === "Lead" || type === "Customer") {
    return [ref.firstName, ref.lastName].filter(Boolean).join(" ") || "Unknown";
  }
  if (type === "Quotation") return ref.title || "Unknown";
  return null;
};

const getResponsibleName = (task, currentUserId) => {
  const assigned = task.assignedTo;
  const createdBy = task.createdBy;

  if (task.scope === "Personal") {
    const isOwn = createdBy?._id === currentUserId;
    return {
      label: isOwn ? (
        "You"
      ) : createdBy ? (
        <UserDisplayName user={createdBy}>
          {getDisplayName(createdBy, {
            includeMiddleInitial: true,
            includeSuffix: true,
          })}
        </UserDisplayName>
      ) : (
        "Unknown"
      ),
      type: "personal",
      user: createdBy || null,
    };
  }

  if (!assigned) {
    return { label: "Unassigned", type: "unassigned", user: null };
  }

  const isOwn = assigned?._id === currentUserId;
  return {
    label: isOwn ? (
      "You"
    ) : (
      <UserDisplayName user={assigned}>
        {getDisplayName(assigned, {
          includeMiddleInitial: true,
          includeSuffix: true,
        })}
      </UserDisplayName>
    ),
    type: "assigned",
    user: assigned,
  };
};

export default function TaskTable({
  tasks,
  permissions = {},
  onEdit,
  onView,
  onUpdateStatus,
  onUpdatePriority,
  isLoading = false,
}) {
  const { user: currentUser } = useAuth();

  const columns = [
    { label: "Task" },
    { label: "Responsible" },
    { label: "Priority" },
    { label: "Due" },
    { label: "Status" },
    { label: "Scope" },
    ...(permissions.canEdit ? [{ label: "", align: "text-right" }] : []),
  ];

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
  } = useTablePagination(tasks, 10);

  const HEADERS = columns.map((col) => col.label);

  if (isLoading) {
    return (
      <LoaderTables
        paginatedItems="loading"
        headers={HEADERS}
        emptyMessage="No tasks found."
        heightClass="h-112.5"
        currentPage={currentPage}
        totalPages={totalPages}
        totalRows={totalRows}
        rowsPerPage={rowsPerPage}
        from={from}
        to={to}
        pageWindow={pageWindow}
        onGoTo={goTo}
        onRowsPerPageChange={setRowsPerPage}
        renderRow={() => <TableRow />}
      />
    );
  }

  return (
    <>
      <BaseTable
        columns={columns}
        empty={paginatedItems.length === 0 ? "No tasks found." : null}
        colSpan={columns.length}
        heightClass="h-112.5"
      >
        {paginatedItems.map((task) => {
          const overdue = isOverdue(task.dueDate, task.status);
          const dueToday = isDueToday(task.dueDate, task.status);
          const responsible = getResponsibleName(task, currentUser?.id);
          const responsiblePhoto = getProfileImage(responsible.user);

          const relatedName = getRelatedName(task);
          const RelatedIcon = RELATED_ICON[task.relatedToType];

          const canEditCurrentTask = canFullyEditTask(
            task,
            currentUser,
            permissions,
          );
          const editDisabledReason = getTaskEditDisabledReason(
            task,
            currentUser,
            permissions,
          );

          return (
            <TableRow key={task._id} onClick={() => onView(task)}>
              {/* Task (Subject + Type + Related) */}
              <TableCell className="max-w-72">
                <div className="flex items-center gap-2">
                  <div className="min-w-0">
                    <p className="font-medium truncate">
                      {task.taskType && task.taskType !== "Other"
                        ? `${task.taskType}: `
                        : ""}
                      {task.subject}
                    </p>
                    {relatedName && RelatedIcon && (
                      <div className="flex items-center gap-1 mt-0.5">
                        <RelatedIcon
                          size={11}
                          strokeWidth={2}
                          className="text-gray-400 shrink-0"
                        />
                        <span className="text-xs text-gray-400 truncate">
                          {relatedName} ({task.relatedToType})
                        </span>
                      </div>
                    )}
                    {task.description && !relatedName && (
                      <p className="text-xs text-gray-400 truncate mt-0.5">
                        {task.description}
                      </p>
                    )}
                  </div>
                </div>
              </TableCell>

              {/* Responsible */}
              <TableCell>
                <div className="flex items-center gap-2">
                  {responsible.user ? (
                    <img
                      src={responsiblePhoto}
                      alt=""
                      className="w-7 h-7 rounded-full object-cover border border-gray-300 shrink-0"
                    />
                  ) : (
                    <span className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                      <User size={13} className="text-gray-400" />
                    </span>
                  )}
                  <span
                    className={`text-sm truncate ${
                      responsible.type === "unassigned"
                        ? "text-gray-400 italic"
                        : "text-gray-700 group-hover:text-[#ef4444]"
                    }`}
                  >
                    {responsible.label}
                  </span>
                </div>
              </TableCell>

              {/* Priority */}
              <TableCell>
                <StatusDropdown
                  status={task.priority}
                  statuses={TASK_PRIORITIES}
                  toneMap={TASK_PRIORITY_TONE}
                  disabled={!permissions.canEdit}
                  onSelect={(newPriority) =>
                    onUpdatePriority(task._id, newPriority)
                  }
                />
              </TableCell>

              {/* Due (with overdue / today indicators) */}
              <TableCell>
                {task.dueDate ? (
                  <div className="flex flex-col">
                    <span
                      className={`flex items-center gap-1 text-sm ${
                        overdue
                          ? "text-red-500 font-medium"
                          : dueToday
                            ? "text-amber-500 font-medium"
                            : "text-gray-600 group-hover:text-[#ef4444]"
                      }`}
                      title={
                        overdue
                          ? `Overdue — was due on ${formatDate(task.dueDate)}`
                          : dueToday
                            ? `Due today — ${formatDate(task.dueDate)}`
                            : `Due on ${formatDate(task.dueDate)}`
                      }
                    >
                      {overdue || dueToday ? (
                        <TriangleAlert size={12} className="shrink-0" />
                      ) : (
                        <Calendar size={12} className="shrink-0" />
                      )}
                      {formatDate(task.dueDate)}
                    </span>
                  </div>
                ) : (
                  <span className="text-sm text-gray-400">—</span>
                )}
              </TableCell>

              {/* Status */}
              <TableCell>
                <StatusDropdown
                  status={task.status}
                  statuses={TASK_STATUSES}
                  toneMap={TASK_STATUS_TONE}
                  disabled={!permissions.canEdit}
                  onSelect={(newStatus) => onUpdateStatus(task._id, newStatus)}
                />
              </TableCell>

              {/* Scope */}
              <TableCell>
                <BaseBadge
                  shape="pill"
                  tone={task.scope === "Personal" ? "indigo" : "teal"}
                >
                  {task.scope === "Personal" ? "Personal" : "Assigned"}
                </BaseBadge>
              </TableCell>

              {/* Edit */}
              {permissions.canEdit && (
                <TableCell
                  title={!canEditCurrentTask ? editDisabledReason : ""}
                  className="inline-block text-right"
                >
                  <button
                    disabled={!canEditCurrentTask}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(task);
                    }}
                    className={`p-2 rounded-md transition-colors ${
                      !canEditCurrentTask
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-gray-400 hover:text-[#ef4444] cursor-pointer"
                    }`}
                    title={
                      !canEditCurrentTask ? editDisabledReason : "Edit task"
                    }
                  >
                    <Pencil size={16} />
                  </button>
                </TableCell>
              )}
            </TableRow>
          );
        })}
      </BaseTable>

      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalRows={totalRows}
        rowsPerPage={rowsPerPage}
        from={from}
        to={to}
        pageWindow={pageWindow}
        onGoTo={goTo}
        onRowsPerPageChange={setRowsPerPage}
      />
    </>
  );
}
