import { Link } from "react-router-dom";

import {
  TableRow,
  TableCell,
  useTablePagination,
} from "../../../components/table";
import LoaderTables from "../../../components/loader/TablesLazyLoader";

// Table headers
const HEADERS = [
  { label: "Report Name" },
  { label: "Description" },
  { label: "Category" },
];

export default function ReportTable({
  reports = [],
  isLoading = false,
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
  } = useTablePagination(reports, 10);

  return (
    <LoaderTables
      paginatedItems={isLoading ? "loading" : paginatedItems}
      headers={HEADERS.map((h) => h.label)}
      emptyMessage="No reports found."
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
      renderRow={(report) => (
        <TableRow key={report.id}>
          {/* Report Name */}
          <TableCell>
            <Link
              to={report.route}
              className="font-medium text-red-600 hover:underline"
            >
              {report.title}
            </Link>
          </TableCell>

          {/* Description */}
          <TableCell>
            <span className="text-gray-600">
              {report.description}
            </span>
          </TableCell>

          {/* Category */}
          <TableCell>
            <span className="text-gray-600">
              {report.category}
            </span>
          </TableCell>
        </TableRow>
      )}
    />
  );
}