import { useCallback, useMemo, useState } from "react";
import { FaPlus } from "react-icons/fa";
import Select from "react-select";

import {
  PageBase,
  PageHeader,
  PageToolbar,
  PageContentState,
} from "../../../components/page";

import FilterPopover from "../../../components/filters/FilterPopover";
import { useFilterPopover } from "../../../components/filters/useFilterPopover";
import { getSelectProps } from "../../../components/select/selectConfig";

import CallsForm from "./CallsForm";
import CallsTable from "./CallsTable";
import CallsKanban from "./CallsKanban";
import useCalls from "../hooks/useCalls";

const STATUS_OPTIONS = [
  { label: "Scheduled", value: "Scheduled" },
  { label: "Completed", value: "Completed" },
  { label: "Cancelled", value: "Cancelled" },
  { label: "Missed", value: "Missed" },
];

const TYPE_OPTIONS = [
  { label: "Follow-up Call", value: "Follow-up Call" },
  { label: "Initial Client Contact", value: "Initial Client Contact" },
  { label: "Sales Discussion", value: "Sales Discussion" },
  { label: "Other", value: "Other" },
];

const CATEGORY_OPTIONS = [
  { label: "All Calls", value: "All" },
  { label: "Future Calls", value: "Future Call" },
  { label: "Past Calls", value: "Past Call" },
];

const getCallTime = (call) => {
  const value = call.scheduledAt || call.completedAt || call.createdAt;
  const time = new Date(value).getTime();

  return Number.isNaN(time) ? 0 : time;
};

const sortCallsFutureToPast = (calls) => {
  return [...calls].sort((a, b) => {
    const aIsFuture = a.category === "Future Call";
    const bIsFuture = b.category === "Future Call";

    if (aIsFuture && !bIsFuture) return -1;
    if (!aIsFuture && bIsFuture) return 1;

    if (aIsFuture && bIsFuture) {
      return getCallTime(a) - getCallTime(b);
    }

    return getCallTime(b) - getCallTime(a);
  });
};

export default function CallsPage() {
  const { calls, loading, addCall, editCall, removeCall, completeCall } =
    useCalls();

  const [viewMode, setViewMode] = useState("table");
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [filterStatus, setFilterStatus] = useState(null);
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterType, setFilterType] = useState(null);

  const [formOpen, setFormOpen] = useState(false);
  const [editingCall, setEditingCall] = useState(null);

  const clearAllFilters = useCallback(() => {
    setFilterStatus(null);
    setFilterType(null);
    setFilterCategory("All");
    setActiveCategory("All");
  }, []);

  const {
    filterOpen,
    setFilterOpen,
    filterRef,
    activeFilterCount,
    clearAllFilters: handleClearFilters,
  } = useFilterPopover({ filterStatus, filterType, filterCategory }, clearAllFilters);

  const filteredCalls = useMemo(() => {
    const query = search.trim().toLowerCase();

    const result = calls.filter((call) => {
      const matchesCategory =
        activeCategory === "All" || call.category === activeCategory;

      const contactValue =
        call.contactValue || call.phone || call.email || "";

      const matchesSearch =
        !query ||
        call.clientName?.toLowerCase().includes(query) ||
        call.companyName?.toLowerCase().includes(query) ||
        contactValue.toLowerCase().includes(query) ||
        call.contactMethod?.toLowerCase().includes(query) ||
        call.callType?.toLowerCase().includes(query);

      const matchesStatus = !filterStatus || call.status === filterStatus;
      const matchesType = !filterType || call.callType === filterType;

      return matchesCategory && matchesSearch && matchesStatus && matchesType;
    });

    return sortCallsFutureToPast(result);
  }, [calls, activeCategory, search, filterStatus, filterType]);

  const sortedAllCalls = useMemo(() => sortCallsFutureToPast(calls), [calls]);

  const futureCount = calls.filter(
    (call) => call.category === "Future Call",
  ).length;

  const pastCount = calls.filter(
    (call) => call.category === "Past Call",
  ).length;

  const getCategoryCount = (category) => {
    if (category === "All") return calls.length;
    if (category === "Future Call") return futureCount;
    return pastCount;
  };

  const handleOpenCreate = () => {
    setEditingCall(null);
    setFormOpen(true);
  };

  const handleEdit = (call) => {
    setEditingCall(call);
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setEditingCall(null);
  };

  const handleSubmit = async (payload) => {
    const success = editingCall
      ? await editCall(editingCall._id, payload)
      : await addCall(payload);

    if (success) {
      handleCloseForm();
    }

    return success;
  };

  return (
    <PageBase>
      <div className="flex items-center justify-between mb-4">
        <PageHeader title="Calls" subtitle="Track future and past client calls." />

        <PageToolbar
          searchValue={search}
          onSearchChange={(event) => setSearch(event.target.value)}
          searchPlaceholder="Search calls..."
          view={viewMode}
          onViewChange={setViewMode}
          filterSlot={
            <FilterPopover
              filterRef={filterRef}
              filterOpen={filterOpen}
              onToggle={() => setFilterOpen((previous) => !previous)}
              activeFilterCount={activeFilterCount}
              onClearAll={handleClearFilters}
            >
              <div>
                <p className="text-xs text-gray-400 mb-1">Status</p>
                <Select
                  {...getSelectProps({ variant: "filter" })}
                  placeholder="All statuses"
                  options={STATUS_OPTIONS}
                  value={
                    STATUS_OPTIONS.find(
                      (option) => option.value === filterStatus,
                    ) || null
                  }
                  onChange={(option) => setFilterStatus(option?.value || null)}
                />
              </div>

              <div>
                <p className="text-xs text-gray-400 mb-1">Category</p>
                <Select
                  {...getSelectProps({ variant: "filter" })}
                  placeholder="All calls"
                  options={CATEGORY_OPTIONS}
                  value={
                    CATEGORY_OPTIONS.find(
                      (option) => option.value === filterCategory,
                    ) || null
                  }
                  onChange={(option) => {
                    const val = option?.value || "All";
                    setFilterCategory(val);
                    setActiveCategory(val);
                  }}
                />
              </div>

              <div>
                <p className="text-xs text-gray-400 mb-1">Call Type</p>
                <Select
                  {...getSelectProps({ variant: "filter" })}
                  placeholder="All call types"
                  options={TYPE_OPTIONS}
                  value={
                    TYPE_OPTIONS.find(
                      (option) => option.value === filterType,
                    ) || null
                  }
                  onChange={(option) => setFilterType(option?.value || null)}
                />
              </div>
            </FilterPopover>
          }
          actionButton={
            <button
              type="button"
              onClick={handleOpenCreate}
              className="bg-red-500 hover:bg-red-600 text-white py-2 px-5 rounded-md cursor-pointer min-w-[130px]"
            >
              <span className="flex items-center justify-center gap-2 text-sm whitespace-nowrap">
                <FaPlus size={11} />
                Add Call
              </span>
            </button>
          }
        />
      </div>

      {/* category buttons removed — use Filter popover to select All/Future/Past */}

      <PageContentState loading={loading}>
        {viewMode === "table" ? (
          <CallsTable
            calls={filteredCalls}
            loading={loading}
            onEdit={handleEdit}
            onDelete={removeCall}
            onComplete={completeCall}
          />
        ) : (
          <CallsKanban
            calls={filteredCalls}
            loading={loading}
            activeCategory={activeCategory}
            onEdit={handleEdit}
            onDelete={removeCall}
            onComplete={completeCall}
          />
        )}
      </PageContentState>

      <CallsForm
        open={formOpen}
        editingCall={editingCall}
        onSubmit={handleSubmit}
        onClose={handleCloseForm}
        onCancel={handleCloseForm}
        loading={loading}
      />
    </PageBase>
  );
}