import { Pencil } from "lucide-react";
import { getProfileImage } from "../../utils/avatar";
import { getDisplayName } from "../../utils/name";
import { formatPhone } from "../../utils/format";

import StatusDropdown from "../../components/select/StatusDropdown";
import UserDisplayName from "../../components/UserDisplayName";

import {
  BaseTable,
  TableRow,
  TableCell,
  TablePagination,
  useTablePagination,
} from "../../components/table";
import LoaderTables from "../../components/loader/TablesLazyLoader";

const CUSTOMER_STATUSES = ["Active", "Inactive", "Lost"];
const CUSTOMER_STATUS_TONE = {
  Active: "green",
  Inactive: "gray",
  Lost: "red",
};

export default function CustomerTable({
  customers,
  permissions = {},
  onEdit,
  onView,
  onUpdateStatus,
  isLoading = false,
}) {
  const columns = [
    { label: "Name" },
    { label: "Company" },
    { label: "Account owner" },
    { label: "Contact" },
    { label: "Email" },
    { label: "Status" },
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
  } = useTablePagination(customers, 10);

  const HEADERS = columns.map((col) => col.label);

  if (isLoading) {
    return (
      <LoaderTables
        paginatedItems="loading"
        headers={HEADERS}
        emptyMessage="No customers found."
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
        renderRow={(customer) => (
          <TableRow key={customer._id} onClick={() => onView(customer)}>
            <TableCell>
              <div className="flex items-center gap-2">
                <img
                  src={getProfileImage(customer)}
                  alt="avatar"
                  className="w-9 h-9 rounded-full object-cover border border-gray-300"
                />
                <span>
                  {getDisplayName(customer, {
                    includeMiddleInitial: true,
                    includeSuffix: true,
                  })}
                </span>
              </div>
            </TableCell>
            <TableCell>{customer.company}</TableCell>
            {customer.assignedTo ? (
              <TableCell>
                <div className="flex items-center gap-2">
                  <img
                    src={getProfileImage(customer.assignedTo)}
                    alt="avatar"
                    className="w-7 h-7 rounded-full border object-cover border-gray-300"
                  />
                  <UserDisplayName user={customer.assignedTo}>
                    {getDisplayName(customer.assignedTo, {
                      includeMiddleInitial: true,
                      includeSuffix: true,
                    })}
                  </UserDisplayName>
                </div>
              </TableCell>
            ) : (
              <TableCell>
                <span className="text-sm text-gray-400 italic">Unassigned</span>
              </TableCell>
            )}
            <TableCell>
              <div className="text-sm">{formatPhone(customer.phone)}</div>
              <div className="text-xs">{customer.email}</div>
            </TableCell>
            <TableCell>
              <StatusDropdown
                status={customer.status}
                statuses={CUSTOMER_STATUSES}
                toneMap={CUSTOMER_STATUS_TONE}
                disabled={!permissions.canEdit}
                onSelect={(newStatus) =>
                  onUpdateStatus(customer._id, newStatus)
                }
              />
            </TableCell>
            {permissions.canEdit && (
              <TableCell>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(customer);
                  }}
                  className="p-2 rounded-md text-gray-400 hover:text-[#ef4444] transition-colors hover:fill-[#ef4444] cursor-pointer fill"
                  title="Edit customer"
                >
                  <Pencil size={16} />
                </button>
              </TableCell>
            )}
          </TableRow>
        )}
      />
    );
  }

  return (
    <>
      <BaseTable
        columns={columns}
        empty={paginatedItems.length === 0 ? "No customers found." : null}
        colSpan={columns.length}
        heightClass="h-112.5"
      >
        {paginatedItems.map((customer) => (
          <TableRow key={customer._id} onClick={() => onView(customer)}>
            <TableCell>
              <div className="flex items-center gap-2">
                <img
                  src={getProfileImage(customer)}
                  alt="avatar"
                  className="w-9 h-9 rounded-full object-cover border border-gray-300"
                />
                <span>
                  {getDisplayName(customer, {
                    includeMiddleInitial: true,
                    includeSuffix: true,
                  })}
                </span>
              </div>
            </TableCell>
            <TableCell>{customer.company}</TableCell>
            {customer.assignedTo ? (
              <TableCell>
                <div className="flex items-center gap-2">
                  <img
                    src={getProfileImage(customer.assignedTo)}
                    alt="avatar"
                    className="w-7 h-7 rounded-full border object-cover border-gray-300"
                  />
                  <UserDisplayName user={customer.assignedTo}>
                    {getDisplayName(customer.assignedTo, {
                      includeMiddleInitial: true,
                      includeSuffix: true,
                    })}
                  </UserDisplayName>
                </div>
              </TableCell>
            ) : (
              <TableCell>
                <span className="text-sm text-gray-400 italic">Unassigned</span>
              </TableCell>
            )}

            <TableCell>
              <div className="text-sm">{formatPhone(customer.phone)}</div>
            </TableCell>

            <TableCell>
              <div className="text-sm">{customer.email}</div>
            </TableCell>

            <TableCell>
              <StatusDropdown
                status={customer.status}
                statuses={CUSTOMER_STATUSES}
                toneMap={CUSTOMER_STATUS_TONE}
                disabled={!permissions.canEdit}
                onSelect={(newStatus) =>
                  onUpdateStatus(customer._id, newStatus)
                }
              />
            </TableCell>

            {permissions.canEdit && (
              <TableCell>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(customer);
                  }}
                  className="p-2 rounded-md text-gray-400 hover:text-[#ef4444] transition-colors hover:fill-[#ef4444] cursor-pointer fill"
                  title="Edit customer"
                >
                  <Pencil size={16} />
                </button>
              </TableCell>
            )}
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