import { getProfileImage } from "../../utils/avatar";
import { getDisplayName } from "../../utils/name";
import { formatDate } from "../../utils/date";
import BaseBadge from "../../components/badge/BaseBadge";
import {
  BaseTable,
  TableRow,
  TableCell,
  TablePagination,
  useTablePagination,
} from "../../components/table";
import { isOverdue } from "./utils/reportPresentation";
import LoaderTables from "../../components/loader/TablesLazyLoader";

// Priority tone mapping for badges
const priorityTones = {
  High: "red",
  Medium: "yellow",
  Low: "green",
};

// Status tone mapping for badges
const statusTones = {
  "To Do": "gray",
  "In Progress": "blue",
  Completed: "green",
};

// Table column headers
const HEADERS = [
  { label: "Employee" },
  { label: "Task Subject" },
  { label: "Priority" },
  { label: "Due Date" },
  { label: "Status" },
];

export default function ReportTable({ filteredTasks, isLoading = false }) {
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
  } = useTablePagination(filteredTasks ?? [], 10);

  return (
    <LoaderTables
      paginatedItems={isLoading ? "loading" : paginatedItems}
      headers={HEADERS.map((h) => h.label)}
      emptyMessage="No tasks found matching the filters."
      heightClass="h-[450px]"
      currentPage={currentPage}
      totalPages={totalPages}
      totalRows={totalRows}
      rowsPerPage={rowsPerPage}
      from={from}
      to={to}
      pageWindow={pageWindow}
      onGoTo={goTo}
      onRowsPerPageChange={setRowsPerPage}
      renderRow={(task) => {
        const employee = task.assignedTo;
        const overdue = isOverdue(task.dueDate);
        return (
          <TableRow key={task._id}>
            {/* Employee */}
            <TableCell>
              {employee ? (
                <div className="flex items-center gap-2">
                  <img
                    src={getProfileImage(employee)}
                    alt="avatar"
                    className="w-8 h-8 rounded-full object-cover border"
                  />
                  <div>
                    <p className="text-sm text-gray-700 leading-tight">
                      {getDisplayName(employee, {
                        includeMiddleInitial: true,
                        includeSuffix: true,
                      })}
                    </p>
                    <p className="text-xs text-gray-400">
                      {employee.employeeId}
                    </p>
                  </div>
                </div>
              ) : (
                <span className="text-xs text-gray-400 italic">Unassigned</span>
              )}
            </TableCell>

            {/* Task Subject */}
            <TableCell>
              <p className="text-gray-500 truncate">{task.subject}</p>
              {task.description && (
                <p className="text-xs text-gray-400 truncate mt-0.5">
                  {task.description}
                </p>
              )}
            </TableCell>

            {/* Priority */}
            <TableCell>
              <BaseBadge
                tone={priorityTones[task.priority] || "gray"}
                size="sm"
                shape="soft"
              >
                {task.priority}
              </BaseBadge>
            </TableCell>

            {/* Due Date */}
            <TableCell>
              <span className="text-sm text-gray-600">
                {formatDate(task.dueDate)}
              </span>
              {overdue && (
                <BaseBadge tone="red" size="xs" shape="soft" className="ml-2">
                  Overdue
                </BaseBadge>
              )}
            </TableCell>

            {/* Status */}
            <TableCell>
              <BaseBadge
                tone={statusTones[task.status] || "gray"}
                size="sm"
                shape="soft"
              >
                {task.status}
              </BaseBadge>
            </TableCell>
          </TableRow>
        );
      }}
    />
  );
}
