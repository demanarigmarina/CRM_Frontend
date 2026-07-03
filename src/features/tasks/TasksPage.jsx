import { useState, useMemo, useCallback, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { DotLoader } from "react-spinners";
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
import { useTasks } from "../../hooks/useTasks";
import { useTaskModal } from "./hooks/useTaskModal";
import { useUsers } from "../users/hooks/useUsers";
import { useLeads } from "../leads/hooks/useLeads";
import { useCustomers } from "../customers/hooks/useCustomers";
import { useQuotations } from "../quotations/hooks/useQuotations";

import TaskKanban from "./TaskKanban";
import TaskTable from "./TaskTable";
import TaskModal from "./TaskModal";

export default function TasksPage() {
  const permissions = usePermissions("tasks");
  const { user: currentUser } = useAuth();
  const isCurrentAgent = currentUser.role === "Sales Agent";
  const location = useLocation();

  const {
    tasks,
    columns,
    loading,
    submitting,
    reorderTasks,
    updateTaskStatus,
    updateTaskPriority,
    createTask,
    updateTask,
    deleteTask,
    STATUSES,
  } = useTasks();

  const {
    modalOpen,
    mode,
    origin,
    activeTab,
    setActiveTab,
    formData,
    viewingTask,
    activities,
    activitiesLoading,
    openCreate,
    openView,
    openEdit,
    switchToEdit,
    switchToView,
    closeModal,
    handleChange,
    handleSelectChange,
  } = useTaskModal();

  // Auto-open create modal when navigated
useEffect(() => {
  if (location.state?.openCreate) {
    openCreate();

    // Clear the state so a page refresh doesn't re-trigger it
    window.history.replaceState({}, "");
  }
}, [location.state, openCreate]);

  const { users: assignableUsers = [] } = useUsers({
    skip: !permissions.canAssign,
    mode: "assignable",
    resource: "task",
  });
  const { leads = [] } = useLeads();
  const { customers = [] } = useCustomers();
  const { quotations = [] } = useQuotations();

  const [view, setView] = useState("kanban");
  const [search, setSearch] = useState("");
  const [filterPriority, setFilterPriority] = useState(null);
  const [filterResponsible, setFilterResponsible] = useState(null);
  const [filterStatus, setFilterStatus] = useState(null);
  const [filterRelatedType, setFilterRelatedType] = useState(null);
  const [filterScope, setFilterScope] = useState(null);

  const clearAllFilters = useCallback(() => {
    setFilterPriority(null);
    setFilterResponsible(null);
    setFilterStatus(null);
    setFilterRelatedType(null);
    setFilterScope(null);
  }, []);

  const {
    filterOpen,
    setFilterOpen,
    filterRef,
    activeFilterCount,
    clearAllFilters: handleClear,
  } = useFilterPopover(
    {
      filterPriority,
      filterResponsible,
      filterStatus,
      filterRelatedType,
      filterScope,
    },
    clearAllFilters,
  );

  const matchesTaskFilters = useCallback(
    (task) => {
      const q = search.toLowerCase();

      const assigneeName = task.assignedTo
        ? getDisplayName(task.assignedTo, {
            includeMiddleInitial: true,
            includeSuffix: true,
          }).toLowerCase()
        : "";

      const matchesSearch =
        !q ||
        task.subject?.toLowerCase().includes(q) ||
        task.status?.toLowerCase().includes(q) ||
        task.priority?.toLowerCase().includes(q) ||
        assigneeName.includes(q);

      return (
        matchesSearch &&
        (!filterPriority || task.priority === filterPriority) &&
        (!filterResponsible || task.assignedTo?._id === filterResponsible) &&
        (!filterStatus || task.status === filterStatus) &&
        (!filterRelatedType || task.relatedToType === filterRelatedType) &&
        (!filterScope || task.scope === filterScope)
      );
    },
    [
      search,
      filterPriority,
      filterResponsible,
      filterStatus,
      filterRelatedType,
      filterScope,
    ],
  );

  const agentFilterOptions = useMemo(() => {
    const uniqueAgents = new Map();
    tasks.forEach((t) => {
      if (t.assignedTo) {
        uniqueAgents.set(t.assignedTo._id, t.assignedTo);
      }
    });
    return Array.from(uniqueAgents.values()).map((u) => ({
      label: `${getDisplayName(u, { includeMiddleInitial: true, includeSuffix: true })}`,
      value: u._id,
    }));
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    return tasks.filter(matchesTaskFilters);
  }, [tasks, matchesTaskFilters]);

  const filteredColumns = useMemo(() => {
    const filtered = {};
    for (const status of STATUSES) {
      filtered[status] = (columns[status] || []).filter(matchesTaskFilters);
    }
    return filtered;
  }, [columns, STATUSES, matchesTaskFilters]);

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    const isSameColumn = destination.droppableId === source.droppableId;
    const isSamePosition = destination.index === source.index;

    if (isSameColumn && isSamePosition) return;

    const destinationStatus = destination.droppableId;

    if (isSameColumn) {
      const column = [...(columns[source.droppableId] || [])];
      const [moved] = column.splice(source.index, 1);
      if (!moved) return;
      column.splice(destination.index, 0, moved);
      const updates = column.map((task, idx) => ({
        _id: task._id,
        position: idx,
      }));
      reorderTasks(updates);
      return;
    }

    const sourceColumn = [...(columns[source.droppableId] || [])];
    const destinationColumn = [...(columns[destination.droppableId] || [])];
    const [moved] = sourceColumn.splice(source.index, 1);
    if (!moved) return;

    destinationColumn.splice(destination.index, 0, {
      ...moved,
      status: destinationStatus,
    });

    const updates = [
      ...sourceColumn.map((task, idx) => ({
        _id: task._id,
        status: source.droppableId,
        position: idx,
      })),
      ...destinationColumn.map((task, idx) => ({
        _id: task._id,
        status: destinationStatus,
        position: idx,
      })),
    ];

    await updateTaskStatus(
      draggableId,
      destinationStatus,
      destination.index,
      updates,
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      scope: formData.scope || "Personal",
      assignedTo:
        formData.scope === "Personal" ? null : formData.assignedTo || null,
      dueDate: formData.dueDate || null,
      reminderAt: formData.reminderAt || null,
      relatedToType: formData.relatedToType || undefined,
      relatedTo: formData.relatedTo || undefined,
    };
    if (mode === "create") {
      const created = await createTask(payload);
      if (created) closeModal();
    } else if (mode === "edit" && viewingTask) {
      const updated = await updateTask(viewingTask._id, payload);
      if (updated) closeModal();
    }
  };

  const handleUpdateStatus = async (taskId, newStatus) => {
    await updateTaskStatus(taskId, newStatus, 0);
  };

  const handleUpdatePriority = async (taskId, newPriority) => {
    await updateTaskPriority(taskId, newPriority);
  };

  const handleDelete = async (taskId) => {
    const deleted = await deleteTask(taskId);
    if (deleted) closeModal();
  };

  return (
    <PageBase>
      <div className="flex items-center justify-between mb-4">
        <PageHeader
          title="Tasks"
          subtitle={
            isCurrentAgent
              ? "Organize and track your assigned tasks and follow-ups"
              : "View and manage tasks across your team"
          }
        />

        <PageToolbar
          searchValue={search}
          onSearchChange={(e) => setSearch(e.target.value)}
          searchPlaceholder="Search tasks..."
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
              <div>
                <p className="text-xs text-gray-400 mb-1">Related Type</p>
                <Select
                  {...getSelectProps({ variant: "filter" })}
                  placeholder="All types"
                  options={["Lead", "Customer", "Quotation"].map((t) => ({
                    label: t,
                    value: t,
                  }))}
                  value={
                    filterRelatedType
                      ? { label: filterRelatedType, value: filterRelatedType }
                      : null
                  }
                  onChange={(opt) => setFilterRelatedType(opt?.value || null)}
                />
              </div>

              {!isCurrentAgent && (
                <div>
                  <p className="text-xs text-gray-400 mb-1">Responsible</p>
                  <Select
                    {...getSelectProps({ variant: "filter" })}
                    placeholder="All responsibles"
                    options={agentFilterOptions}
                    value={
                      agentFilterOptions.find(
                        (o) => o.value === filterResponsible,
                      ) || null
                    }
                    onChange={(opt) => setFilterResponsible(opt?.value || null)}
                    isSearchable
                  />
                </div>
              )}

              <div>
                <p className="text-xs text-gray-400 mb-1">Priority</p>
                <Select
                  {...getSelectProps({ variant: "filter" })}
                  placeholder="All priorities"
                  options={["Low", "Medium", "High"].map((p) => ({
                    label: p,
                    value: p,
                  }))}
                  value={
                    filterPriority
                      ? { label: filterPriority, value: filterPriority }
                      : null
                  }
                  onChange={(opt) => setFilterPriority(opt?.value || null)}
                />
              </div>

              {view === "table" && (
                <div>
                  <p className="text-xs text-gray-400 mb-1">Status</p>
                  <Select
                    {...getSelectProps({ variant: "filter" })}
                    placeholder="All statuses"
                    options={STATUSES.map((s) => ({ label: s, value: s }))}
                    value={
                      filterStatus
                        ? { label: filterStatus, value: filterStatus }
                        : null
                    }
                    onChange={(opt) => setFilterStatus(opt?.value || null)}
                  />
                </div>
              )}

              <div>
                <p className="text-xs text-gray-400 mb-1">Scope</p>
                <Select
                  {...getSelectProps({ variant: "filter" })}
                  placeholder="All scopes"
                  options={["Personal", "Assigned"].map((s) => ({
                    label: s,
                    value: s,
                  }))}
                  value={
                    filterScope
                      ? { label: filterScope, value: filterScope }
                      : null
                  }
                  onChange={(opt) => setFilterScope(opt?.value || null)}
                />
              </div>
            </FilterPopover>
          }
          actionButton={
            permissions.canCreate && (
              <button
                onClick={() => openCreate()}
                className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md cursor-pointer"
              >
                <span className="flex items-center gap-2 text-sm">
                  <FaPlus size={11} /> New Task
                </span>
              </button>
            )
          }
        />
      </div>

      <PageContentState>
        {view === "kanban" ? (
          <TaskKanban
            columns={filteredColumns}
            statuses={STATUSES}
            permissions={permissions}
            onDragEnd={handleDragEnd}
            onAddTask={(status) => openCreate(status)}
            onCardClick={(task) => openView(task)}
            isLoading={loading}
          />
        ) : (
          <TaskTable
            tasks={filteredTasks}
            permissions={permissions}
            onView={(task) => openView(task)}
            onEdit={(task) => openEdit(task)}
            onUpdateStatus={handleUpdateStatus}
            onUpdatePriority={handleUpdatePriority}
            isLoading={loading}
          />
        )}
      </PageContentState>

      <TaskModal
        open={modalOpen}
        mode={mode}
        origin={origin}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        formData={formData}
        viewingTask={viewingTask}
        activities={activities}
        activitiesLoading={activitiesLoading}
        currentUser={currentUser}
        assignableUsers={assignableUsers}
        leads={leads}
        customers={customers}
        quotations={quotations}
        permissions={permissions}
        loading={submitting}
        onChange={handleChange}
        onSelectChange={handleSelectChange}
        onSwitchToEdit={switchToEdit}
        onSwitchToView={switchToView}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
        onClose={closeModal}
      />
    </PageBase>
  );
}