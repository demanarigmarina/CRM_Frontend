import { Pencil } from "lucide-react";
import { getProfileImage } from "../../utils/avatar";
import { getDisplayName } from "../../utils/name";
import { formatPhone } from "../../utils/format";

import {
  BaseTable,
  TableRow,
  TableCell,
  TablePagination,
  useTablePagination,
} from "../../components/table";
import LoaderTables from "../../components/loader/TablesLazyLoader";

export default function UserTable({ users, onEdit, onView, isLoading = false }) {
  const columns = [
    { label: "User ID" },
    { label: "Name" },
    { label: "Email" },
    { label: "Phone" },
    { label: "Role" },
    { label: "Team" },
    { label: "", align: "text-right" },
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
  } = useTablePagination(users, 10);

  const HEADERS = columns.map((col) => col.label);

  if (isLoading) {
    return (
      <LoaderTables
        paginatedItems="loading"
        headers={HEADERS}
        emptyMessage="No users found."
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
        renderRow={(user) => {
          const teamName = user.team?.name ?? (user.team ? "—" : null);
          return (
            <TableRow key={user.employeeId} onClick={() => onView(user)}>
              <TableCell>{user.employeeId}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <img
                    src={getProfileImage(user)}
                    alt="avatar"
                    className="w-9 h-9 rounded-full object-cover border border-gray-300"
                  />
                  <span>
                    {getDisplayName(user, {
                      includeMiddleInitial: true,
                      includeSuffix: true,
                    })}
                  </span>
                </div>
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{formatPhone(user.phone)}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
                {teamName ?? <span className="text-gray-400">—</span>}
              </TableCell>
              <TableCell align="text-right">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(user);
                  }}
                  className="p-2 rounded-md text-gray-400 hover:text-[#ef4444] transition-colors cursor-pointer"
                  title="Edit user"
                >
                  <Pencil size={16} />
                </button>
              </TableCell>
            </TableRow>
          );
        }}
      />
    );
  }

  return (
    <>
      <BaseTable
        columns={columns}
        empty={paginatedItems.length === 0 ? "No users found." : null}
        colSpan={columns.length}
        heightClass="h-112.5"
      >
        {paginatedItems.map((user) => {
          const teamName = user.team?.name ?? (user.team ? "—" : null);
          return (
            <TableRow key={user.employeeId} onClick={() => onView(user)}>
              <TableCell>{user.employeeId}</TableCell>

              <TableCell>
                <div className="flex items-center gap-2">
                  <img
                    src={getProfileImage(user)}
                    alt="avatar"
                    className="w-9 h-9 rounded-full object-cover border border-gray-300"
                  />
                  <span>
                    {getDisplayName(user, {
                      includeMiddleInitial: true,
                      includeSuffix: true,
                    })}
                  </span>
                </div>
              </TableCell>

              <TableCell>{user.email}</TableCell>
              <TableCell>{formatPhone(user.phone)}</TableCell>

              <TableCell>{user.role}</TableCell>

              <TableCell>
                {teamName ?? <span className="text-gray-400">—</span>}
              </TableCell>

              <TableCell align="text-right">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(user);
                  }}
                  className="p-2 rounded-md text-gray-400 hover:text-[#ef4444] transition-colors cursor-pointer"
                  title="Edit user"
                >
                  <Pencil size={16} />
                </button>
              </TableCell>
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