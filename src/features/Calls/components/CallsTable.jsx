import { CheckCircle, Edit2, PhoneCall, Trash2 } from "lucide-react";

import {
  BaseTable,
  TableRow,
  TableCell,
  TablePagination,
  useTablePagination,
} from "../../../components/table";

const columns = [
  { key: "number", label: "#" },
  { key: "clientName", label: "Client" },
  { key: "companyName", label: "Company" },
  { key: "contact", label: "Contact" },
  { key: "callType", label: "Call Type" },
  { key: "scheduledAt", label: "Schedule" },
  { key: "status", label: "Status" },
  { key: "actions", label: "Actions", align: "text-right" },
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

const getStatusClass = (status) => {
  switch (status) {
    case "Completed":
      return "bg-emerald-50 text-emerald-700";
    case "Cancelled":
      return "bg-red-50 text-red-700";
    case "Missed":
      return "bg-orange-50 text-orange-700";
    default:
      return "bg-sky-50 text-sky-700";
  }
};

const getContactValue = (call) => {
  return call.contactValue || call.phone || call.email || "-";
};

export default function CallsTable({
  calls = [],
  loading = false,
  onEdit,
  onDelete,
  onComplete,
}) {
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
  } = useTablePagination(calls, 10);

  return (
    <>
      <BaseTable
        columns={columns}
        empty={
          loading
            ? "Loading calls..."
            : calls.length === 0
              ? "No calls found."
              : null
        }
        colSpan={columns.length}
        minHeightClass="min-h-[calc(100vh-345px)]"
        heightClass="h-[450px]"
      >
        {paginatedItems.map((call, index) => (
          <TableRow key={call._id} title="Call record">
            <TableCell>{from + index}</TableCell>

            <TableCell>
              <div className="flex items-center gap-2">
                <span className="h-8 w-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center shrink-0">
                  <PhoneCall size={15} />
                </span>
                <span className="font-medium text-gray-700">
                  {call.clientName || "-"}
                </span>
              </div>
            </TableCell>

            <TableCell>{call.companyName || "-"}</TableCell>

            <TableCell>
              <div>
                <p>{getContactValue(call)}</p>
                <p className="text-xs text-gray-400">
                  {call.contactMethod || "Phone"}
                </p>
              </div>
            </TableCell>

            <TableCell>{call.callType || "-"}</TableCell>
            <TableCell>{formatDateTime(call.scheduledAt)}</TableCell>

            <TableCell>
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClass(
                  call.status,
                )}`}
              >
                {call.status || "Scheduled"}
              </span>
            </TableCell>

            <TableCell align="text-right">
              <div className="flex items-center justify-end gap-2">
                {call.status !== "Completed" && (
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      onComplete?.(call._id);
                    }}
                    className="text-gray-400 hover:text-emerald-600"
                    title="Mark completed"
                  >
                    <CheckCircle size={16} />
                  </button>
                )}

                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    onEdit?.(call);
                  }}
                  className="text-gray-400 hover:text-sky-600"
                  title="Edit call"
                >
                  <Edit2 size={16} />
                </button>

                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    onDelete?.(call._id);
                  }}
                  className="text-gray-400 hover:text-red-600"
                  title="Delete call"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </TableCell>
          </TableRow>
        ))}
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