export default function LoaderTables({
  paginatedItems,
  headers,
  renderRow,
  emptyMessage = "No results found.",
  heightClass = "h-[450px]",
  currentPage,
  totalPages,
  totalRows,
  rowsPerPage,
  from,
  to,
  pageWindow,
  onGoTo,
  onRowsPerPageChange,
}) {
  if (!paginatedItems) return null;

  const isLoading = paginatedItems === "loading";

  const Bone = ({ className = "" }) => (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
  );

  const skeletonRows = Array.from({ length: rowsPerPage ?? 10 });

  return (
    <>
      {/* ── Table ── */}
      <div className={`w-full overflow-auto ${heightClass}`}>
        <table className="w-full text-sm text-left">
          {/* Header */}
          <thead className="bg-gray-50 border-y border-gray-100 sticky top-0 z-10">
            <tr>
              {isLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <th key={i} className="px-4 py-3">
                      <Bone className="h-3 w-20" />
                    </th>
                  ))
                : headers?.map((header, i) => (
                    <th
                      key={i}
                      className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 whitespace-nowrap"
                    >
                      {header}
                    </th>
                  ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody className="divide-y divide-gray-50">
            {isLoading ? (
              skeletonRows.map((_, i) => (
                <tr key={i} className={i % 2 === 1 ? "bg-gray-50/40" : ""}>
                  {/* Employee */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <Bone className="w-8 h-8 rounded-full shrink-0" />
                      <div className="flex flex-col gap-1.5">
                        <Bone className="h-3 w-24" />
                        <Bone className="h-2.5 w-14" />
                      </div>
                    </div>
                  </td>
                  {/* Task subject */}
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1.5">
                      <Bone className={`h-3`} style={{ width: `${120 + (i % 4) * 20}px` }} />
                      <Bone className={`h-2.5`} style={{ width: `${150 + (i % 3) * 25}px` }} />
                    </div>
                  </td>
                  {/* Priority */}
                  <td className="px-4 py-3">
                    <Bone className="h-6 w-14 rounded-full" />
                  </td>
                  {/* Due date */}
                  <td className="px-4 py-3">
                    <Bone className="h-3 w-24" />
                  </td>
                  {/* Status */}
                  <td className="px-4 py-3">
                    <Bone className="h-7 w-24 rounded-md" />
                  </td>
                </tr>
              ))
            ) : paginatedItems.length === 0 ? (
              <tr>
                <td
                  colSpan={headers?.length ?? 5}
                  className="px-4 py-16 text-center text-sm text-gray-400"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedItems.map((item, i) => renderRow(item, i))
            )}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-4 py-3 border-t border-gray-100 bg-white">
        {/* Left: rows per page + count */}
        <div className="flex items-center gap-2.5 text-sm text-gray-500">
          {isLoading ? (
            <>
              <Bone className="h-3 w-9" />
              <Bone className="h-7 w-14 rounded-md" />
              <Bone className="h-3 w-14" />
            </>
          ) : (
            <>
              <span>Show</span>
              <select
                value={rowsPerPage}
                onChange={(e) => onRowsPerPageChange?.(Number(e.target.value))}
                className="border border-gray-200 rounded-md px-2 py-1 text-sm text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-red-400"
              >
                {[5, 10, 20, 50].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
              <span>
                Showing <span className="font-medium text-gray-700">{from}–{to}</span> of{" "}
                <span className="font-medium text-gray-700">{totalRows}</span> entries
              </span>
            </>
          )}
        </div>

        {/* Right: page buttons */}
        <div className="flex items-center gap-1.5">
          {isLoading ? (
            <>
              <Bone className="h-3 w-32" />
              <Bone className="w-8 h-8 rounded-md" />
              <div className="w-8 h-8 rounded-md animate-pulse bg-red-300" />
              <Bone className="w-8 h-8 rounded-md" />
            </>
          ) : (
            <>
              {/* Prev */}
              <button
                onClick={() => onGoTo?.(currentPage - 1)}
                disabled={currentPage <= 1}
                className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                ‹
              </button>

              {/* Page window */}
              {pageWindow?.map((page) =>
                page === "..." ? (
                  <span key={page} className="w-8 h-8 flex items-center justify-center text-gray-400 text-sm">
                    …
                  </span>
                ) : (
                  <button
                    key={page}
                    onClick={() => onGoTo?.(page)}
                    className={`
                      w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium transition-colors
                      ${currentPage === page
                        ? "bg-red-500 text-white shadow-sm"
                        : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                      }
                    `}
                  >
                    {page}
                  </button>
                )
              )}

              {/* Next */}
              <button
                onClick={() => onGoTo?.(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                ›
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}