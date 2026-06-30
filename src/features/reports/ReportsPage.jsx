import { useState, useMemo } from "react";
import Select from "react-select";

import { PageBase, PageHeader, PageToolbar } from "../../components/page";

import FilterPopover from "../../components/filters/FilterPopover";
import { useFilterPopover } from "../../components/filters/useFilterPopover";
import { getSelectProps } from "../../components/select/selectConfig";
import { getDisplayName } from "../../utils/name";
import ReportTable from "./ReportTable";
import ReportAnalytics from "./ReportAnalytics";

// Report tabs
const TABS = [
  { id: "tasks", label: "Tasks" },
  { id: "analytics", label: "Analytics" },
];

// Mock tasks for demo/testing
const mockTasks = [
  {
    _id: "1",
    subject: "Follow up with client",
    description: "Send proposal and pricing",
    priority: "High",
    status: "In Progress",
    dueDate: "2026-05-10",
    assignedTo: {
      _id: "user1",
      firstName: "John",
      lastName: "Doe",
      employeeId: "EMP001",
      profilePicture: null,
    },
  },
  {
    _id: "2",
    subject: "Update customer database",
    description: "Add new contact information",
    priority: "Medium",
    status: "To Do",
    dueDate: "2026-05-15",
    assignedTo: {
      _id: "user2",
      firstName: "Jane",
      lastName: "Smith",
      employeeId: "EMP002",
      profilePicture: null,
    },
  },
  {
    _id: "3",
    subject: "Prepare quarterly report",
    description: null,
    priority: "High",
    status: "To Do",
    dueDate: "2026-05-08",
    assignedTo: {
      _id: "user1",
      firstName: "John",
      lastName: "Doe",
      employeeId: "EMP001",
      profilePicture: null,
    },
  },
  {
    _id: "4",
    subject: "Team meeting preparation",
    description: "Prepare agenda and materials",
    priority: "Medium",
    status: "Completed",
    dueDate: "2026-05-03",
    assignedTo: {
      _id: "user3",
      firstName: "Mike",
      lastName: "Johnson",
      employeeId: "EMP003",
      profilePicture: null,
    },
  },
  {
    _id: "5",
    subject: "Client presentation",
    description: "Present Q2 strategy to stakeholders",
    priority: "High",
    status: "In Progress",
    dueDate: "2026-05-12",
    assignedTo: {
      _id: "user2",
      firstName: "Jane",
      lastName: "Smith",
      employeeId: "EMP002",
      profilePicture: null,
    },
  },
  {
    _id: "6",
    subject: "Email follow-ups",
    description: null,
    priority: "Low",
    status: "To Do",
    dueDate: "2026-05-20",
    assignedTo: null,
  },
];

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState("tasks");
  const [search, setSearch] = useState("");
  const [filterEmployee, setFilterEmployee] = useState(null);
  const [filterStatus, setFilterStatus] = useState(null);
  const [filterDeadlineFrom, setFilterDeadlineFrom] = useState(null);
  const [filterDeadlineTo, setFilterDeadlineTo] = useState(null);

  const clearAllFilters = () => {
    setFilterEmployee(null);
    setFilterStatus(null);
    setFilterDeadlineFrom(null);
    setFilterDeadlineTo(null);
  };

  const { filterOpen, setFilterOpen, filterRef, activeFilterCount } =
    useFilterPopover(
      {
        filterEmployee,
        filterStatus,
        filterDeadlineFrom,
        filterDeadlineTo,
      },
      clearAllFilters,
    );

  const filteredTasks = useMemo(() => {
    return mockTasks.filter((task) => {
      const q = search.toLowerCase();

      const employeeMatch =
        !filterEmployee ||
        getDisplayName(task.assignedTo, {
          includeMiddleInitial: true,
          includeSuffix: true,
        })
          .toLowerCase()
          .includes(filterEmployee.toLowerCase()) ||
        task.assignedTo.employeeId
          .toLowerCase()
          .includes(filterEmployee.toLowerCase());

      const statusMatch = !filterStatus || task.status === filterStatus;

      const deadlineMatch =
        (!filterDeadlineFrom ||
          new Date(task.dueDate) >= new Date(filterDeadlineFrom)) &&
        (!filterDeadlineTo ||
          new Date(task.dueDate) <= new Date(filterDeadlineTo));

      const searchMatch =
        !q ||
        task.subject?.toLowerCase().includes(q) ||
        task.status?.toLowerCase().includes(q) ||
        task.priority?.toLowerCase().includes(q) ||
        getDisplayName(task.assignedTo, {
          includeMiddleInitial: true,
          includeSuffix: true,
        })
          .toLowerCase()
          .includes(q) ||
        task.assignedTo.employeeId.toLowerCase().includes(q);

      return employeeMatch && statusMatch && deadlineMatch && searchMatch;
    });
  }, [
    filterEmployee,
    filterStatus,
    filterDeadlineFrom,
    filterDeadlineTo,
    search,
  ]);

  return (
    <PageBase>
      <div className="flex items-center justify-between mb-4">
        <PageHeader
          title="Reports"
          subtitle="Task assignment reports and analytics"
        />

        {activeTab === "tasks" && (
          <PageToolbar
            searchValue={search}
            onSearchChange={(e) => {
              setSearch(e.target.value);
            }}
            searchPlaceholder="Search tasks..."
            filterSlot={
              <FilterPopover
                filterRef={filterRef}
                filterOpen={filterOpen}
                onToggle={() => setFilterOpen((p) => !p)}
                activeFilterCount={activeFilterCount}
                onClearAll={clearAllFilters}
              >
                <div>
                  <p className="text-xs text-gray-400 mb-1">Employee</p>
                  <input
                    type="text"
                    placeholder="Search by name or ID..."
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-200"
                    value={filterEmployee || ""}
                    onChange={(e) => setFilterEmployee(e.target.value || null)}
                  />
                </div>

                <div>
                  <p className="text-xs text-gray-400 mb-1">Status</p>
                  <Select
                    {...getSelectProps({ variant: "filter" })}
                    placeholder="All Statuses"
                    options={["To Do", "In Progress", "Completed"].map((s) => ({
                      label: s,
                      value: s,
                    }))}
                    value={
                      filterStatus
                        ? { label: filterStatus, value: filterStatus }
                        : null
                    }
                    onChange={(opt) => setFilterStatus(opt?.value || null)}
                  />
                </div>

                <div>
                  <p className="text-xs text-gray-400 mb-1">Deadline From</p>
                  <input
                    type="date"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-200"
                    value={filterDeadlineFrom || ""}
                    onChange={(e) =>
                      setFilterDeadlineFrom(e.target.value || null)
                    }
                  />
                </div>

                <div>
                  <p className="text-xs text-gray-400 mb-1">Deadline To</p>
                  <input
                    type="date"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-200"
                    value={filterDeadlineTo || ""}
                    onChange={(e) =>
                      setFilterDeadlineTo(e.target.value || null)
                    }
                  />
                </div>
              </FilterPopover>
            }
          />
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-gray-200 relative">
        <div className="flex">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-red-500 text-red-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {activeTab === "tasks" && <ReportTable filteredTasks={filteredTasks} />}
      {activeTab === "analytics" && <ReportAnalytics />}
    </PageBase>
  );
}
