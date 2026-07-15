import {
  TablePagination,
  useTablePagination,
} from "../../../components/table";

import { CalendarDays } from "lucide-react";

function formatDate(date) {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function MyMeetingsTable({ meetings = [] }) {
  const now = new Date();

  const todayStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  // Upcoming meetings only
  const relevantMeetings = meetings
    .filter((meeting) => {
      if (!meeting.date) return false;

      return new Date(meeting.date) >= todayStart;
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date));

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
  } = useTablePagination(relevantMeetings, 5);

  const tableHeight =
    rowsPerPage === 5
      ? ""
      : "max-h-[280px] overflow-y-auto";

  return (
    <div className="h-[500px] overflow-hidden rounded-xl border border-gray-200 bg-white flex flex-col">
      {/* Header */}
      <div className="p-5 pb-3">

        <div className="mb-5 flex items-start gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-500">
            <CalendarDays size={18} />
          </div>

          <div>
            <h2 className="text-md font-semibold text-gray-700">
              My Meetings
            </h2>

            <p className="text-xs text-gray-400">
              Upcoming schedules and appointments.
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-md">
          <table className="min-w-full table-fixed text-left text-xs">
            <thead className="border-b border-gray-200 bg-white">
              <tr>
                <th className="w-[38%] px-4 py-3 font-semibold uppercase text-gray-500">
                  Title
                </th>

                <th className="w-[22%] px-4 py-3 font-semibold uppercase text-gray-500">
                  Date
                </th>

                <th className="w-[20%] px-4 py-3 font-semibold uppercase text-gray-500">
                  From
                </th>

                <th className="w-[20%] px-4 py-3 font-semibold uppercase text-gray-500">
                  To
                </th>

              </tr>
            </thead>
          </table>

          {/* Table Body */}
          <div className={tableHeight}>
            <table className="min-w-full table-fixed text-left text-xs">
              <tbody>
                {paginatedItems.length > 0 ? (
                  paginatedItems.map((meeting) => (
                    <tr
                      key={meeting._id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition"
                    >
                      <td className="w-[38%] truncate px-4 py-3 font-medium text-gray-700">
                        {meeting.meetingTitle}
                      </td>

                      <td className="w-[22%] whitespace-nowrap px-4 py-3 text-gray-600">
                        {formatDate(meeting.date)}
                      </td>

                      <td className="w-[20%] whitespace-nowrap px-4 py-3 text-gray-600">
                        {meeting.startTime || "—"}
                      </td>

                      <td className="w-[20%] whitespace-nowrap px-4 py-3 text-gray-600">
                        {meeting.endTime || "—"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="py-35 text-center text-sm text-gray-400"
                    >
                      No upcoming meetings scheduled.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-auto border-t border-gray-200 bg-gray-50/50 px-3 py-2">

        <TablePagination
          rowsOptions={[5, 10]}
          currentPage={currentPage}
          totalPages={totalPages}
          totalRows={totalRows}
          rowsPerPage={rowsPerPage}
          from={from}
          to={to}
          pageWindow={pageWindow}
          onGoTo={goTo}
          onRowsPerPageChange={setRowsPerPage}
          marginTop="mt-0"
        />

      </div>

    </div>
  );
}