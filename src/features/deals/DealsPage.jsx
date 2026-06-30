import { useState, useMemo, useCallback } from "react";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

import {
  PageBase,
  PageHeader,
  PageToolbar,
  PageContentState,
} from "../../components/page";

import FilterPopover from "../../components/filters/FilterPopover";
import { useFilterPopover } from "../../components/filters/useFilterPopover";
import { getSelectProps } from "../../components/select/selectConfig";

import { getDisplayName } from "../../utils/name";

import { usePermissions } from "../../permissions/usePermissions";
import { useAuth } from "../../context/AuthContext";
import { useDeals } from "./hooks/useDeals";
import { useDealModal } from "./hooks/useDealModal";
import { useCustomers } from "../customers/hooks/useCustomers";
import { useUsers } from "../users/hooks/useUsers";

import DealKanban from "./DealKanban";
import DealTable from "./DealTable";
import DealModal from "./DealModal";

export default function DealsPage() {
  const permissions = usePermissions("deals");
  const { user: currentUser } = useAuth();
  const isCurrentAgent = currentUser.role === "Sales Agent";
  const navigate = useNavigate();

  const { customers = [] } = useCustomers();

  const { users: salesAgents = [] } = useUsers({
    skip: !permissions.canAssign,
    mode: "assignable",
    resource: "deal",
  });

  const {
    deals,
    columns,
    loading,
    submitting,
    reorderDeals,
    createDeal,
    updateDeal,
    deleteDeal,
    updateDealStage,
    STAGES,
  } = useDeals();

  const {
    modalOpen,
    mode,
    origin,
    activeTab,
    setActiveTab,
    formData,
    viewingDeal,
    activities,
    activitiesLoading,
    tasks,
    tasksLoading,
    openCreate,
    openView,
    openEdit,
    switchToEdit,
    switchToView,
    closeModal,
    handleChange,
    handleSelectChange,
  } = useDealModal();

  const [view, setView] = useState("kanban");
  const [search, setSearch] = useState("");
  const [filterStage, setFilterStage] = useState(null);
  const [filterAssigned, setFilterAssigned] = useState(null);

  const clearAllFilters = useCallback(() => {
    setFilterStage(null);
    setFilterAssigned(null);
  }, []);

  const {
    filterOpen,
    setFilterOpen,
    filterRef,
    activeFilterCount,
    clearAllFilters: handleClear,
  } = useFilterPopover({ filterStage, filterAssigned }, clearAllFilters);

  const matchesDealFilters = useCallback(
    (deal) => {
      const q = search.toLowerCase();

      const assigneeName = deal.assignedTo
        ? getDisplayName(deal.assignedTo, {
            includeMiddleInitial: true,
            includeSuffix: true,
          }).toLowerCase()
        : "";

      const customerName = deal.customer
        ? getDisplayName(deal.customer, {
            includeMiddleInitial: true,
            includeSuffix: true,
          }).toLowerCase()
        : "";

      const matchesSearch =
        !q ||
        deal.title?.toLowerCase().includes(q) ||
        deal.stage?.toLowerCase().includes(q) ||
        assigneeName.includes(q) ||
        customerName.includes(q) ||
        deal.customer?.company?.toLowerCase().includes(q);

      return (
        matchesSearch &&
        (!filterStage || deal.stage === filterStage) &&
        (!filterAssigned || deal.assignedTo?._id === filterAssigned)
      );
    },
    [search, filterStage, filterAssigned],
  );

  const agentFilterOptions = useMemo(() => {
    const uniqueAgents = new Map();
    deals.forEach((d) => {
      if (d.assignedTo) uniqueAgents.set(d.assignedTo._id, d.assignedTo);
    });
    return Array.from(uniqueAgents.values()).map((u) => ({
      label: getDisplayName(u, {
        includeMiddleInitial: true,
        includeSuffix: true,
      }),
      value: u._id,
    }));
  }, [deals]);

  const filteredDeals = useMemo(() => {
    return deals.filter(matchesDealFilters);
  }, [deals, matchesDealFilters]);

  const filteredColumns = useMemo(() => {
    const filtered = {};
    for (const stage of STAGES) {
      filtered[stage] = (columns[stage] || []).filter(matchesDealFilters);
    }
    return filtered;
  }, [columns, STAGES, matchesDealFilters]);

  const handleDragEnd = async (result) => {
    const { destination, source } = result;

    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const sourceStage = source.droppableId;
    const destStage = destination.droppableId;
    const isSameColumn = sourceStage === destStage;

    const sourceCol = [...(columns[sourceStage] || [])];
    const moved = sourceCol[source.index];
    if (!moved) return;

    if (isSameColumn) {
      sourceCol.splice(source.index, 1);
      sourceCol.splice(destination.index, 0, moved);
      await reorderDeals(
        sourceCol.map((d, idx) => ({ _id: d._id, position: idx })),
      );
      return;
    }

    const destCol = [...(columns[destStage] || [])];
    destCol.splice(destination.index, 0, { ...moved, stage: destStage });

    const updates = [
      ...sourceCol
        .filter((_, i) => i !== source.index)
        .map((d, idx) => ({ _id: d._id, stage: sourceStage, position: idx })),
      ...destCol.map((d, idx) => ({
        _id: d._id,
        stage: destStage,
        position: idx,
      })),
    ];

    await updateDealStage(moved._id, destStage, destination.index, updates);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mode === "create") {
      const created = await createDeal(formData);
      if (created) closeModal();
    } else if (mode === "edit" && viewingDeal) {
      const updated = await updateDeal(viewingDeal._id, formData);
      if (updated) closeModal();
    }
  };

  const handleDelete = async (dealId) => {
    const deleted = await deleteDeal(dealId);
    if (deleted) closeModal();
  };

  // Derive the tasks path based on the current user's role
  const tasksPath =
    currentUser.role === "Admin"
      ? "/admin/tasks"
      : currentUser.role === "Sales Manager"
        ? "/sales-manager/tasks"
        : "/sales-agent/tasks";

  const handleAddTask = () => {
    closeModal();
    navigate(tasksPath, { state: { openCreate: true } });
  };

  return (
    <PageBase>
      <div className="flex items-center justify-between mb-4">
        <PageHeader
          title="Deals"
          subtitle="Monitor and manage deals across the sales pipeline"
        />

        <PageToolbar
          searchValue={search}
          onSearchChange={(e) => setSearch(e.target.value)}
          searchPlaceholder="Search deals..."
          view={view}
          onViewChange={setView}
          filterSlot={
            <FilterPopover
              filterRef={filterRef}
              filterOpen={filterOpen}
              onToggle={() => setFilterOpen((p) => !p)}
              activeFilterCount={activeFilterCount}
              onClearAll={handleClear}
            >
              {!isCurrentAgent && (
                <div>
                  <p className="text-xs text-gray-400 mb-1">Assigned To</p>
                  <Select
                    {...getSelectProps({ variant: "filter" })}
                    placeholder="All agents"
                    options={agentFilterOptions}
                    value={
                      agentFilterOptions.find(
                        (o) => o.value === filterAssigned,
                      ) || null
                    }
                    onChange={(opt) => setFilterAssigned(opt?.value || null)}
                    isSearchable
                  />
                </div>
              )}
              {view === "table" && (
                <div>
                  <p className="text-xs text-gray-400 mb-1">Stage</p>
                  <Select
                    {...getSelectProps({ variant: "filter" })}
                    placeholder="All stages"
                    options={STAGES.map((s) => ({ label: s, value: s }))}
                    value={
                      filterStage
                        ? { label: filterStage, value: filterStage }
                        : null
                    }
                    onChange={(opt) => setFilterStage(opt?.value || null)}
                  />
                </div>
              )}
            </FilterPopover>
          }
          actionButton={
            permissions.canCreate && (
              <button
                onClick={() => openCreate()}
                className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md cursor-pointer"
              >
                <span className="flex items-center gap-2 text-sm">
                  <FaPlus size={11} /> New Deal
                </span>
              </button>
            )
          }
        />
      </div>

      <PageContentState>
        {view === "kanban" ? (
          <DealKanban
            columns={filteredColumns}
            stages={STAGES}
            permissions={permissions}
            onDragEnd={handleDragEnd}
            onAddDeal={(stage) => openCreate(stage)}
            onCardClick={(deal) => openView(deal)}
            isLoading={loading}
          />
        ) : (
          <DealTable
            deals={filteredDeals}
            permissions={permissions}
            onView={(deal) => openView(deal)}
            onEdit={(deal) => openEdit(deal)}
            isLoading={loading}
          />
        )}
      </PageContentState>

      <DealModal
        stages={STAGES}
        open={modalOpen}
        mode={mode}
        origin={origin}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        formData={formData}
        viewingDeal={viewingDeal}
        activities={activities}
        activitiesLoading={activitiesLoading}
        tasks={tasks}
        tasksLoading={tasksLoading}
        customers={customers}
        salesAgents={salesAgents}
        permissions={permissions}
        loading={submitting}
        onChange={handleChange}
        onSelectChange={handleSelectChange}
        onSwitchToEdit={switchToEdit}
        onSwitchToView={switchToView}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
        onClose={closeModal}
        onAddTask={handleAddTask}
      />
    </PageBase>
  );
}