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
import Modal from "../../components/modal/Modal";
import TemplateBuilder from "./Builder/TemplateBuilder";
import { useQuotationTemplates } from "./hooks/useQuotationTemplates";

import { getDisplayName } from "../../utils/name";

import { usePermissions } from "../../permissions/usePermissions";
import { useAuth } from "../../context/AuthContext";
import { useQuotations } from "./hooks/useQuotations";
import { useQuotationModal } from "./hooks/useQuotationModal";
import { useClients } from "../clients/hooks/useClients";
import { useUsers } from "../users/hooks/useUsers";

import QuotationKanban from "./components/QuotationKanban";
import QuotationTable from "./components/QuotationTable";
import QuotationModal from "./components/QuotationModal";

export default function QuotationsPage() {
  const permissions = usePermissions("quotations");
  const { user: currentUser } = useAuth();
  const isCurrentAgent = currentUser.role === "Sales Agent";
  const navigate = useNavigate();

  const { clients = [] } = useClients();

  const { users = [] } = useUsers({
    skip: !permissions.canAssign,
  });

  const salesAgents = useMemo(
    () =>
      users.filter(
        (user) => user.role?.trim().toLowerCase() === "sales agent"
      ),
    [users]
  );

  const {
    quotations,
    columns,
    loading,
    submitting,
    reorderQuotations,
    createQuotation,
    updateQuotation,
    deleteQuotation,
    updateQuotationStage,
    STAGES,
  } = useQuotations();

  const {
    modalOpen,
    mode,
    origin,
    activeTab,
    setActiveTab,
    formData,
    viewingQuotation,
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
  } = useQuotationModal();

  const {
    templates,
    selectTemplate,
    saveTemplate,
  } = useQuotationTemplates();

  const [templateBuilderOpen, setTemplateBuilderOpen] = useState(false);
  const [builderTemplate, setBuilderTemplate] = useState(null);

  const openTemplateBuilder = useCallback((template = null) => {
    setBuilderTemplate(
      template ?? {
        id: `custom_${Date.now()}`,
        name: "My Custom Template",
        description: "User-defined layout template",
        icon: null,
        sections: [],
      },
    );
    setTemplateBuilderOpen(true);
  }, []);

  const closeTemplateBuilder = useCallback(() => {
    setTemplateBuilderOpen(false);
    setBuilderTemplate(null);
  }, []);

  const handleSaveTemplate = useCallback(
    (template) => {
      saveTemplate(template);
      selectTemplate(template.id);
      handleSelectChange("templateId", template.id);
      closeTemplateBuilder();
    },
    [saveTemplate, selectTemplate, handleSelectChange, closeTemplateBuilder],
  );

  const handleCreateCustomTemplate = useCallback(() => {
    openTemplateBuilder();
  }, [openTemplateBuilder]);

  const [view, setView] = useState("table");
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

  const matchesQuotationFilters = useCallback(
    (quotation) => {
      const q = search.toLowerCase();

      const assigneeName = quotation.assignedTo
        ? getDisplayName(quotation.assignedTo, {
            includeMiddleInitial: true,
            includeSuffix: true,
          }).toLowerCase()
        : "";

      const clientName = quotation.client
        ? getDisplayName(quotation.client, {
            includeMiddleInitial: true,
            includeSuffix: true,
          }).toLowerCase()
        : "";

      const matchesSearch =
        !q ||
        quotation.title?.toLowerCase().includes(q) ||
        quotation.stage?.toLowerCase().includes(q) ||
        assigneeName.includes(q) ||
        clientName.includes(q) ||
        quotation.client?.company?.toLowerCase().includes(q);

      return (
        matchesSearch &&
        (!filterStage || quotation.stage === filterStage) &&
        (!filterAssigned || quotation.assignedTo?._id === filterAssigned)
      );
    },
    [search, filterStage, filterAssigned],
  );

  const agentFilterOptions = useMemo(() => {
    const uniqueAgents = new Map();
    quotations.forEach((d) => {
      if (d.assignedTo) uniqueAgents.set(d.assignedTo._id, d.assignedTo);
    });
    return Array.from(uniqueAgents.values()).map((u) => ({
      label: getDisplayName(u, {
        includeMiddleInitial: true,
        includeSuffix: true,
      }),
      value: u._id,
    }));
  }, [quotations]);

  const filteredQuotations = useMemo(() => {
    return quotations.filter(matchesQuotationFilters);
  }, [quotations, matchesQuotationFilters]);

  const filteredColumns = useMemo(() => {
    const filtered = {};
    for (const stage of STAGES) {
      filtered[stage] = (columns[stage] || []).filter(matchesQuotationFilters);
    }
    return filtered;
  }, [columns, STAGES, matchesQuotationFilters]);

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
      await reorderQuotations(
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

    await updateQuotationStage(
      moved._id,
      destStage,
      destination.index,
      updates,
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mode === "create") {
      const created = await createQuotation(formData);
      if (created) closeModal();
    } else if (mode === "edit" && viewingQuotation) {
      const updated = await updateQuotation(viewingQuotation._id, formData);
      if (updated) closeModal();
    }
  };

  const handleDelete = async (quotationId) => {
    const deleted = await deleteQuotation(quotationId);
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
          title="Quotations"
          subtitle="Monitor and manage quotations across the sales pipeline"
        />

        <PageToolbar
          searchValue={search}
          onSearchChange={(e) => setSearch(e.target.value)}
          searchPlaceholder="Search quotations..."
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
                  <FaPlus size={11} /> Add Quotation
                </span>
              </button>
            )
          }
        />
      </div>

      <PageContentState>
        {view === "kanban" ? (
          <QuotationKanban
            columns={filteredColumns}
            stages={STAGES}
            permissions={permissions}
            onDragEnd={handleDragEnd}
            onAddQuotation={(stage) => openCreate(stage)}
            onCardClick={(quotation) => openView(quotation)}
            isLoading={loading}
          />
        ) : (
          <QuotationTable
            quotations={filteredQuotations}
            permissions={permissions}
            onView={(quotation) => openView(quotation)}
            onEdit={(quotation) => openEdit(quotation)}
            isLoading={loading}
          />
        )}
      </PageContentState>

      <QuotationModal
        stages={STAGES}
        open={modalOpen}
        mode={mode}
        origin={origin}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        formData={formData}
        viewingQuotation={viewingQuotation}
        activities={activities}
        activitiesLoading={activitiesLoading}
        tasks={tasks}
        tasksLoading={tasksLoading}
        clients={clients}
        salesAgents={salesAgents}
        permissions={permissions}
        templates={templates}
        loading={submitting}
        onChange={handleChange}
        onSelectChange={handleSelectChange}
        onSwitchToEdit={switchToEdit}
        onSwitchToView={switchToView}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
        onClose={closeModal}
        onAddTask={handleAddTask}
        onCreateCustomTemplate={handleCreateCustomTemplate}
      />

      {templateBuilderOpen && (
        <Modal
          open={templateBuilderOpen}
          title={builderTemplate?.name || "Custom Quotation Template"}
          onClose={closeTemplateBuilder}
          maxWidth="max-w-7xl"
          className="min-h-[85vh]"
        >
          <TemplateBuilder
            template={builderTemplate}
            onSave={handleSaveTemplate}
            onCancel={closeTemplateBuilder}
          />
        </Modal>
      )}
    </PageBase>
  );
}
