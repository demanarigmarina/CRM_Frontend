import { useEffect } from "react";
import { Pencil, PhoneCall, Trash2 } from "lucide-react";

import {
  BaseTable,
  TableRow,
  TableCell,
  TablePagination,
  useTablePagination,
} from "../../../components/table";

function getFullName(name) {
  if (!name) return "-";

  const fullName = [name.firstName, name.middleInitial, name.lastName]
    .filter(Boolean)
    .join(" ");

  return fullName || "-";
}

function getStatusClass(status) {
  switch (status) {
    case "New":
      return "bg-sky-50 text-sky-600";
    case "Contacted":
      return "bg-amber-50 text-amber-600";
    case "Qualified":
      return "bg-purple-50 text-purple-600";
    case "Converted":
      return "bg-emerald-50 text-emerald-600";
    case "Lost":
      return "bg-red-50 text-red-600";
    default:
      return "bg-gray-50 text-gray-500";
  }
}

const columns = [
  { key: "number", label: "#" },
  { key: "companyName", label: "Company" },
  { key: "representative", label: "Representative" },
  { key: "companyEmailAddress", label: "Company Email" },
  { key: "phone", label: "Phone" },
  { key: "leadSource", label: "Lead Source" },
  { key: "status", label: "Status" },
  { key: "actions", label: "", align: "text-right" },
];

export default function ProspectTable({
  prospects = [],
  loading = false,
  onEdit,
  onDelete,
  onContact,
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
  } = useTablePagination(prospects, 10);

  useEffect(() => {
    if (totalRows === 0 || currentPage > totalPages) {
      goTo(1);
    }
  }, [currentPage, totalRows, totalPages, goTo]);

  if (loading) {
    return (
      <div className="flex min-h-0 flex-1 flex-col">
        <BaseTable
          columns={columns}
          empty="Loading prospects..."
          colSpan={columns.length}
          minHeightClass="min-h-[calc(100vh-430px)]"
          heightClass="h-[430px]"
        />
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <BaseTable
        columns={columns}
        empty={paginatedItems.length === 0 ? "No prospects found." : null}
        colSpan={columns.length}
        minHeightClass="min-h-[calc(100vh-430px)]"
        heightClass="h-[430px]"
      >
        {paginatedItems.map((prospect, index) => (
          <TableRow
            key={prospect._id || index}
            title="Prospect row"
            className="text-gray-700"
          >
            <TableCell>
              {(currentPage - 1) * rowsPerPage + index + 1}
            </TableCell>

            <TableCell>
              <div className="max-w-[160px] truncate">
                {prospect.companyName || "-"}
              </div>
            </TableCell>

            <TableCell>
              <div className="max-w-[180px] truncate">
                {getFullName(prospect.representativeName)}
              </div>
            </TableCell>

            <TableCell>
              <div className="max-w-[220px] truncate">
                {prospect.companyEmailAddress || "-"}
              </div>
            </TableCell>

            <TableCell>
              <div className="max-w-[140px] truncate">
                {prospect.phone || "-"}
              </div>
            </TableCell>

            <TableCell>
              <div className="max-w-[130px] truncate">
                {prospect.leadSource || "-"}
              </div>
            </TableCell>

            <TableCell>
              <span
                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClass(
                  prospect.status
                )}`}
              >
                {prospect.status || "New"}
              </span>
            </TableCell>

            <TableCell align="text-right">
              <div className="flex justify-end gap-2 text-gray-400">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onContact(prospect._id);
                  }}
                  className="transition hover:text-emerald-600"
                  title="Mark as contacted"
                >
                  <PhoneCall size={15} />
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(prospect);
                  }}
                  className="transition hover:text-sky-600"
                  title="Edit prospect"
                >
                  <Pencil size={15} />
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(prospect._id);
                  }}
                  className="transition hover:text-red-600"
                  title="Delete prospect"
                >
                  <Trash2 size={15} />
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
        marginTop="mt-5"
      />
    </div>
  );
}