import { useMemo, useState } from "react";
import Select from "react-select";
import { DotLoader } from "react-spinners";
import { 
  Pencil, 
  User, 
  Calendar, 
  FileText, 
  Clock, 
  LayoutGrid, 
  FileSpreadsheet, 
  Layers, 
  Briefcase, 
  Settings, 
  Car,
  Building,
  DollarSign,
  Truck,
  ShieldCheck,
  Hammer,
  Code,
  Sparkles,
  Wrench,
  Scissors
} from "lucide-react";

import { getSelectProps } from "../../../components/select/selectConfig";

import Modal from "../../../components/modal/Modal";
import ModalTabs from "../../../components/modal/ModalTabs";

import FormDrawer from "../../../components/form/FormDrawer";
import {
  FormLabel,
  FormInput,
  FormTextarea,
} from "../../../components/form/FormField";

import BaseBadge from "../../../components/badge/BaseBadge";
import UserDisplayName from "../../../components/UserDisplayName";

import ActivityTimeline from "../../../components/activity/ActivityTimeline";
import TaskTimeline from "../../../components/task/TaskTimeline";
import TemplateSelector from "../Templates/TemplateSelector";

import { getDisplayName } from "../../../utils/name";
import { formatDate, formatDateTime } from "../../../utils/date";
import { formatCurrencyFull } from "../../../utils/currency";

const CURRENCIES = [
  { label: "₱ PHP", value: "PHP" },
  { label: "$ USD", value: "USD" },
  { label: "€ EUR", value: "EUR" },
];


const STAGE_COLORS = {
  Draft: { tone: "gray" },
  Sent: { tone: "blue" },
  "Under Review": { tone: "amber" },
  Negotiation: { tone: "purple" },
  Approved: { tone: "green" },
  Rejected: { tone: "red" },
  Expired: { tone: "gray" },
};

const VIEW_TABS = ["Activity", "Tasks"];

export default function QuotationModal({
  stages = [],
  open,
  mode, // "create" | "view" | "edit"
  formData,
  viewingQuotation,
  activities = [],
  activitiesLoading = false,
  tasks = [],          
  tasksLoading = false, 
  clients = [],
  salesAgents = [],
  permissions = {},
  templates = [],
  loading = false,
  onChange,
  onSelectChange,
  onSwitchToEdit,
  onSubmit,
  onSaveDraft,
  onDelete,
  onClose,
  onAddTask,
  onCreateCustomTemplate,
}) {
  const [activeTab, setActiveTab] = useState("Activity");
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const clientOptions = useMemo(
    () =>
      clients.map((c) => ({
        label: `${getDisplayName(c, { includeSuffix: true })}${c.company ? ` — ${c.company}` : ""}`,
        value: c._id,
      })),
    [clients],
  );

  const agentOptions = useMemo(
    () =>
      salesAgents.map((u) => ({
        label: `${getDisplayName(u, { includeSuffix: true })}`,
        value: u._id,
      })),
    [salesAgents],
  );

  const selectedTemplate = useMemo(
    () => templates.find((t) => t.id === formData?.templateId) || templates[0] || null,
    [templates, formData?.templateId],
  );

  if (!open) return null;

  const isView = mode === "view";
  const isEdit = mode === "edit";
  const isCreate = mode === "create";
  
  const stageColor =
    STAGE_COLORS[isView ? viewingQuotation?.stage : formData?.stage] || { tone: "gray" };

  const renderView = () => {
    const d = viewingQuotation;
    if (!d) return null;

    const clientName = d.client ? getDisplayName(d.client, { includeMiddleInitial: true, includeSuffix: true }) : "—";
    const assignedName = d.assignedTo ? getDisplayName(d.assignedTo, { includeMiddleInitial: true, includeSuffix: true }) : "Unassigned";
    const createdByName = d.createdBy ? getDisplayName(d.createdBy, { includeMiddleInitial: true, includeSuffix: true }) : "—";

    return (
      <div className="flex flex-row flex-1 min-h-0 h-full">
        <div className="flex flex-col flex-1 min-h-0 pr-6 overflow-y-auto">
          <h2 className="text-2xl font-semibold text-gray-800 leading-snug mb-3">{d.title}</h2> 
          <div className="flex items-center gap-3 mb-5 flex-wrap">
            <BaseBadge tone={stageColor.tone} shape="pill">{d.stage}</BaseBadge>
            <div className="text-sm font-semibold text-gray-700">{formatCurrencyFull(d.value, d.currency)}</div>
          </div>
          <div className="mb-6">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Notes</p>
            {d.notes ? <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{d.notes}</p> : <p className="text-sm text-gray-400 italic">Add Notes</p>}
          </div>
          <ModalTabs tabs={VIEW_TABS} activeTab={activeTab} onTabChange={setActiveTab} />
          <div className="flex-1 min-h-0">
            {activeTab === "Activity" && <ActivityTimeline activities={activities} loading={activitiesLoading} />}
            {activeTab === "Tasks" && (
              <>
                {!tasksLoading && tasks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"><FileText size={18} className="text-gray-400" /></div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">No tasks yet</p>
                      <p className="text-xs text-gray-400 mt-0.5">Create a task to track work for this quotation</p>
                    </div>
                    {onAddTask && (
                      <button type="button" onClick={() => { onClose(); onAddTask(); }} className="flex items-center gap-1.5 px-4 py-2 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors cursor-pointer"><Plus size={14} /> Add Task</button>
                    )}
                  </div>
                ) : <TaskTimeline tasks={tasks} loading={tasksLoading} />}
              </>
            )}
          </div>
        </div>
        <div className="w-px bg-gray-200 shrink-0" />
        <div className="w-56 shrink-0 pl-6 overflow-y-auto">
          <p className="text-sm font-semibold text-gray-800 mb-4">Details</p>
          <div className="flex flex-col gap-4">
            <div>
              <div className="flex items-center gap-1.5 mb-0.5"><User size={11} className="text-gray-400" /><p className="text-[10px] text-gray-400 uppercase tracking-wider">Client</p></div>
              <p className="text-sm font-medium text-gray-700">{clientName}</p>
              {d.client?.company && <p className="text-xs text-gray-400">{d.client.company}</p>}
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-0.5"><User size={11} className="text-gray-400" /><p className="text-[10px] text-gray-400 uppercase tracking-wider">Sales Agent</p></div>
              <p className="text-sm font-medium text-gray-700">{d.assignedTo ? <UserDisplayName user={d.assignedTo}>{assignedName}</UserDisplayName> : "Unassigned"}</p>
              {d.assignedTo?.role && <p className="text-xs text-gray-400">{d.assignedTo.role}</p>}
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-0.5"><Calendar size={11} className="text-gray-400" /><p className="text-[10px] text-gray-400 uppercase tracking-wider">Expected Close</p></div>
              <p className="text-sm font-medium text-gray-700">{formatDate(d.expectedCloseDate) || "—"}</p>
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-0.5"><User size={11} className="text-gray-400" /><p className="text-[10px] text-gray-400 uppercase tracking-wider">Created By</p></div>
              <p className="text-sm font-medium text-gray-700">{d.createdBy ? <UserDisplayName user={d.createdBy}>{createdByName}</UserDisplayName> : "—"}</p>
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-0.5"><Clock size={11} className="text-gray-400" /><p className="text-[10px] text-gray-400 uppercase tracking-wider">Created At</p></div>
              <p className="text-sm font-medium text-gray-700">{formatDateTime(d.createdAt) || "—"}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderViewFooter = () => {
    const d = viewingQuotation;
    if (!d) return null;
    return (
      <div className="flex justify-end items-center gap-2">
        {permissions.canDelete && (
          <button type="button" onClick={() => onDelete(d._id)} className="px-4 py-2 text-sm border border-red-300 text-red-500 rounded-md hover:bg-red-50 transition-colors cursor-pointer ml-auto">Delete</button>
        )}
        {permissions.canEdit && (
          <button type="button" onClick={onSwitchToEdit} className="flex items-center gap-1.5 px-4 py-2 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors cursor-pointer"><Pencil size={14} /> Edit Quotation</button>
        )}
      </div>
    );
  };

  const renderForm = () => {
    const selectedClient = clientOptions.find((o) => o.value === formData?.client) || null;
    const selectedAgent = agentOptions.find((o) => o.value === formData?.assignedTo) || null;

    return (
      <form id="quotation-form" onSubmit={onSubmit} className="flex flex-col h-full min-h-0 bg-gray-50/50">
        <div className="flex-1 overflow-y-auto min-h-0 p-5 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-5">
            
            {/* Title Document-Header input */}
            <div>
              <input
                type="text"
                name="title"
                value={formData?.title || ""}
                onChange={onChange}
                placeholder="Untitled Quotation Document Title..."
                required
                className="w-full text-xl font-bold text-gray-800 placeholder-gray-300 border-b border-transparent hover:border-gray-200 focus:border-red-500 focus:outline-none pb-1 transition-all"
              />
            </div>

            <div className="pt-4 border-t border-dashed border-gray-200">
              <TemplateSelector
                templates={templates}
                selectedId={formData?.templateId || "standard"}
                onSelect={(id) => onSelectChange("templateId", id)}
                onCreateCustom={onCreateCustomTemplate}
              />
            </div>

            {/* Standard Primary Metadata */}
            <div className="grid grid-cols-2 gap-4 pt-2 text-sm border-t border-gray-100">
              <div>
                <FormLabel required>Client Profile</FormLabel>
                <Select
                  {...getSelectProps({ isClearable: true })}
                  placeholder="Select client..."
                  options={clientOptions}
                  value={selectedClient}
                  onChange={(opt) => onSelectChange("client", opt?.value || "")}
                />
              </div>
              <div>
                <FormLabel>Expected Close Date</FormLabel>
                <FormInput
                  type="date"
                  name="expectedCloseDate"
                  value={formData?.expectedCloseDate || ""}
                  onChange={onChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <FormLabel>Currency</FormLabel>
                <Select
                  {...getSelectProps({ isSearchable: false })}
                  placeholder="Currency"
                  options={CURRENCIES}
                  value={CURRENCIES.find((c) => c.value === formData?.currency) || null}
                  onChange={(opt) => onSelectChange("currency", opt?.value || "PHP")}
                />
              </div>
              <div>
                <FormLabel required>Estimated Deal Value</FormLabel>
                <FormInput
                  type="number"
                  name="value"
                  min="0"
                  step="0.01"
                  value={formData?.value || ""}
                  onChange={onChange}
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            {/* Administrative Fields */}
            <div className="grid grid-cols-1 gap-4 pt-2">
              {isCreate && (
                <div>
                  <FormLabel>Pipeline Stage</FormLabel>
                  <Select
                    {...getSelectProps({ isSearchable: false })}
                    placeholder="Stage"
                    options={stages.map((s) => ({ value: s, label: s }))}
                    value={stages.map((s) => ({ value: s, label: s })).find((c) => c.value === formData?.stage) || null}
                    onChange={(opt) => onSelectChange("stage", opt?.value || "")}
                  />
                </div>
              )}

              {permissions.canAssign && (
                <div>
                  <FormLabel>Assigned Sales Agent</FormLabel>
                  <Select
                    {...getSelectProps({ isClearable: true })}
                    placeholder="Select agent..."
                    options={agentOptions}
                    value={selectedAgent}
                    onChange={(opt) => onSelectChange("assignedTo", opt?.value || "")}
                  />
                </div>
              )}

              <div>
                <FormLabel>Document Footnotes & Terms</FormLabel>
                <FormTextarea
                  name="notes"
                  value={formData?.notes || ""}
                  onChange={onChange}
                  rows={3}
                  placeholder="Add explicit contract adjustments here..."
                />
              </div>
            </div>

          </div>
        </div>
      </form>
    );
  };

  const title = isCreate ? "New Quotation" : isEdit ? "Edit Quotation" : viewingQuotation?.title || "Quotation Details";
  
  if (isView) {
    return (
      <Modal open={open} title={title} onClose={onClose} maxWidth="max-w-3xl" className="min-h-[85vh]" footer={renderViewFooter()}>
        {renderView()}
      </Modal>
    );
  }

  return (
    <FormDrawer
      open={open}
      title={isCreate ? "Add New Quotation" : "Edit Quotation"}
      formId="quotation-form"
      loading={loading}
      onClose={onClose}
      onCancel={onClose}
      footer={isView ? renderViewFooter() : null}
    >
      {renderForm()}
    </FormDrawer>
  );
}