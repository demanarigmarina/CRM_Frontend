import { useCallback, useState } from "react";
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

import ProspectForm from "./ProspectForm";
import ProspectTable from "./ProspectTable";
import useProspect from "../hooks/useProspect";

const STATUS_OPTIONS = [
  { label: "New", value: "New" },
  { label: "Contacted", value: "Contacted" },
  { label: "Qualified", value: "Qualified" },
  { label: "Converted", value: "Converted" },
  { label: "Lost", value: "Lost" },
];

const SOURCE_OPTIONS = [
  { label: "Website", value: "Website" },
  { label: "Facebook", value: "Facebook" },
  { label: "Referral", value: "Referral" },
  { label: "Walk-in", value: "Walk-in" },
  { label: "Email", value: "Email" },
  { label: "Phone Call", value: "Phone Call" },
  { label: "Event", value: "Event" },
  { label: "Other", value: "Other" },
];

export default function ProspectPage() {
  const {
    prospects,
    loading,

    searchTerm,
    setSearchTerm,

    statusFilter,
    setStatusFilter,

    sourceFilter,
    setSourceFilter,

    addProspect,
    editProspect,
    removeProspect,
    markAsContacted,
  } = useProspect();

  const [openForm, setOpenForm] = useState(false);
  const [editingProspect, setEditingProspect] = useState(null);

  const clearAllFilters = useCallback(() => {
    setStatusFilter("All");
    setSourceFilter("All");
  }, [setStatusFilter, setSourceFilter]);

  const {
    filterOpen,
    setFilterOpen,
    filterRef,
    activeFilterCount,
    clearAllFilters: handleClear,
  } = useFilterPopover(
    {
      statusFilter: statusFilter === "All" ? null : statusFilter,
      sourceFilter: sourceFilter === "All" ? null : sourceFilter,
    },
    clearAllFilters
  );

  const handleOpenAdd = () => {
    setEditingProspect(null);
    setOpenForm(true);
  };

  const handleOpenEdit = (prospect) => {
    setEditingProspect(prospect);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setEditingProspect(null);
    setOpenForm(false);
  };

  const handleSave = async (payload) => {
    const success = editingProspect
      ? await editProspect(editingProspect._id, payload)
      : await addProspect(payload);

    if (success) {
      handleCloseForm();
    }
  };

  return (
    <PageBase>
      <div className="flex items-center justify-between mb-4">
        <PageHeader
          title="Prospects"
          subtitle="Store client forms and track potential customers before they are contacted."
        />

        <PageToolbar
          searchValue={searchTerm}
          onSearchChange={(e) => setSearchTerm(e.target.value)}
          searchPlaceholder="Search prospects..."
          filterSlot={
            <FilterPopover
              filterRef={filterRef}
              filterOpen={filterOpen}
              onToggle={() => setFilterOpen((prev) => !prev)}
              activeFilterCount={activeFilterCount}
              onClearAll={handleClear}
            >
              <div>
                <p className="text-xs text-gray-400 mb-1">Status</p>
                <Select
                  {...getSelectProps({ variant: "filter" })}
                  placeholder="All statuses"
                  options={STATUS_OPTIONS}
                  value={
                    STATUS_OPTIONS.find(
                      (option) => option.value === statusFilter
                    ) || null
                  }
                  onChange={(option) =>
                    setStatusFilter(option?.value || "All")
                  }
                />
              </div>

              <div>
                <p className="text-xs text-gray-400 mb-1">Lead Source</p>
                <Select
                  {...getSelectProps({ variant: "filter" })}
                  placeholder="All sources"
                  options={SOURCE_OPTIONS}
                  value={
                    SOURCE_OPTIONS.find(
                      (option) => option.value === sourceFilter
                    ) || null
                  }
                  onChange={(option) =>
                    setSourceFilter(option?.value || "All")
                  }
                />
              </div>
            </FilterPopover>
          }
          actionButton={
            <button
              onClick={handleOpenAdd}
              className="bg-red-500 hover:bg-red-600 text-white py-2 px-5 rounded-md cursor-pointer min-w-[150px]"
            >
              <span className="flex items-center justify-center gap-2 text-sm whitespace-nowrap">
                <FaPlus size={11} />
                Add Prospect
              </span>
            </button>
          }
        />
      </div>

      <PageContentState loading={false}>
        <ProspectTable
          prospects={prospects}
          loading={loading}
          onEdit={handleOpenEdit}
          onDelete={removeProspect}
          onContact={markAsContacted}
        />
      </PageContentState>

      <ProspectForm
        open={openForm}
        editingProspect={editingProspect}
        onSave={handleSave}
        onClose={handleCloseForm}
      />
    </PageBase>
  );
}