import { Pencil, Calendar, User } from "lucide-react";
import { getProfileImage } from "../../utils/avatar";
import { getDisplayName } from "../../utils/name";
import { formatDate } from "../../utils/date";
import { formatCurrencyCompact } from "../../utils/currency";
import { getProbabilityTone } from "./utils/dealPresentation";

import {
  BaseTable,
  TableRow,
  TableCell,
  TablePagination,
  useTablePagination,
} from "../../components/table";
import LoaderTables from "../../components/loader/TablesLazyLoader";

import BaseBadge from "../../components/badge/BaseBadge";
import UserDisplayName from "../../components/UserDisplayName";

const STAGE_CONFIG = {
  Prospecting: { tone: "blue" },
  Qualification: { tone: "indigo" },
  Proposal: { tone: "purple" },
  Negotiation: { tone: "amber" },
  Won: { tone: "green" },
  Lost: { tone: "red" },
};

export default function DealTable({ deals, permissions = {}, onView, onEdit, isLoading = false }) {
  const columns = [
    { label: "Deal" },
    { label: "Value" },
    { label: "Probability" },
    { label: "Assigned To" },
    { label: "Expected Close" },
    { label: "Stage" },
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
  } = useTablePagination(deals, 10);

  const HEADERS = columns.map((col) => col.label);

  if (isLoading) {
    return (
      <LoaderTables
        paginatedItems="loading"
        headers={HEADERS}
        emptyMessage="No deals found."
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
        renderRow={(deal) => {
          const customerName = deal.customer
            ? `${getDisplayName(deal.customer, { includeMiddleInitial: true, includeSuffix: true })}`
            : null;
          const assignedTo = deal.assignedTo;
          const assignedName = assignedTo ? (
            <UserDisplayName user={assignedTo} showYou={true}>
              {getDisplayName(assignedTo, {
                includeMiddleInitial: true,
                includeSuffix: true,
              })}
            </UserDisplayName>
          ) : (
            "Unassigned"
          );
          const assignedPhoto = getProfileImage(assignedTo);
          const stageConfig =
            STAGE_CONFIG[deal.stage] || STAGE_CONFIG.Prospecting;

          return (
            <TableRow key={deal._id} onClick={() => onView(deal)}>
              <TableCell className="max-w-72">
                <div className="min-w-0">
                  <p className="font-medium truncate">{deal.title}</p>
                  {customerName && (
                    <p className="text-xs text-gray-400 truncate mt-0.5">
                      {deal.customer?.company && (
                        <span className="font-medium text-gray-500">
                          {deal.customer.company} ·{" "}
                        </span>
                      )}
                      {customerName}
                    </p>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <span className="text-sm font-semibold text-gray-700">
                  {formatCurrencyCompact(deal.value, deal.currency)}
                </span>
              </TableCell>
              <TableCell>
                <BaseBadge
                  tone={getProbabilityTone(deal.probability).tone}
                  size="sm"
                  shape="pill"
                >
                  {deal.probability}%
                </BaseBadge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {assignedTo ? (
                    <img
                      src={assignedPhoto}
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
                      !assignedTo
                        ? "text-gray-400 italic"
                        : "text-gray-700 group-hover:text-[#ef4444]"
                    }`}
                  >
                    {assignedName}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                {deal.expectedCloseDate ? (
                  <span className="flex items-center gap-1 text-sm text-gray-600 group-hover:text-[#ef4444]">
                    <Calendar size={12} className="shrink-0" />
                    {formatDate(deal.expectedCloseDate)}
                  </span>
                ) : (
                  <span className="text-sm text-gray-400">—</span>
                )}
              </TableCell>
              <TableCell>
                <BaseBadge tone={stageConfig.tone} shape="soft">
                  {deal.stage}
                </BaseBadge>
              </TableCell>
              {permissions.canEdit && (
                <TableCell align="text-right">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(deal);
                    }}
                    className="p-2 rounded-md transition-colors text-gray-400 hover:text-[#ef4444] cursor-pointer"
                    title="Edit deal"
                  >
                    <Pencil size={16} />
                  </button>
                </TableCell>
              )}
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
        empty={paginatedItems.length === 0 ? "No deals found." : null}
        colSpan={columns.length}
        heightClass="h-112.5"
      >
        {paginatedItems.map((deal) => {
          const customerName = deal.customer
            ? `${getDisplayName(deal.customer, { includeMiddleInitial: true, includeSuffix: true })}`
            : null;
          const assignedTo = deal.assignedTo;
          const assignedName = assignedTo ? (
            <UserDisplayName user={assignedTo} showYou={true}>
              {getDisplayName(assignedTo, {
                includeMiddleInitial: true,
                includeSuffix: true,
              })}
            </UserDisplayName>
          ) : (
            "Unassigned"
          );
          const assignedPhoto = getProfileImage(assignedTo);
          const stageConfig =
            STAGE_CONFIG[deal.stage] || STAGE_CONFIG.Prospecting;

          return (
            <TableRow key={deal._id} onClick={() => onView(deal)}>
              {/* Deal (Title + Customer) */}
              <TableCell className="max-w-72">
                <div className="min-w-0">
                  <p className="font-medium truncate">{deal.title}</p>
                  {customerName && (
                    <p className="text-xs text-gray-400 truncate mt-0.5">
                      {deal.customer?.company && (
                        <span className="font-medium text-gray-500">
                          {deal.customer.company} ·{" "}
                        </span>
                      )}
                      {customerName}
                    </p>
                  )}
                </div>
              </TableCell>

              {/* Value */}
              <TableCell>
                <span className="text-sm font-semibold text-gray-700">
                  {formatCurrencyCompact(deal.value, deal.currency)}
                </span>
              </TableCell>

              {/* Probability */}
              <TableCell>
                <BaseBadge
                  tone={getProbabilityTone(deal.probability).tone}
                  size="sm"
                  shape="pill"
                >
                  {deal.probability}%
                </BaseBadge>
              </TableCell>

              {/* Assigned To */}
              <TableCell>
                <div className="flex items-center gap-2">
                  {assignedTo ? (
                    <img
                      src={assignedPhoto}
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
                      !assignedTo
                        ? "text-gray-400 italic"
                        : "text-gray-700 group-hover:text-[#ef4444]"
                    }`}
                  >
                    {assignedName}
                  </span>
                </div>
              </TableCell>

              {/* Expected Close */}
              <TableCell>
                {deal.expectedCloseDate ? (
                  <span className="flex items-center gap-1 text-sm text-gray-600 group-hover:text-[#ef4444]">
                    <Calendar size={12} className="shrink-0" />
                    {formatDate(deal.expectedCloseDate)}
                  </span>
                ) : (
                  <span className="text-sm text-gray-400">—</span>
                )}
              </TableCell>

              {/* Stage */}
              <TableCell>
                <BaseBadge tone={stageConfig.tone} shape="soft">
                  {deal.stage}
                </BaseBadge>
              </TableCell>

              {/* Edit */}
              <TableCell align="text-right">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(deal);
                  }}
                  className="p-2 rounded-md transition-colors text-gray-400 hover:text-[#ef4444] cursor-pointer"
                  title="Edit deal"
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
