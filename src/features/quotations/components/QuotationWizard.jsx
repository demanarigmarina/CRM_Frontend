import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Expand, X } from "lucide-react";

import BaseModal from "../../../components/modal/BaseModal";
import TemplateBuilder from "../Builder/TemplateBuilder";
import { QUOTATION_TEMPLATES } from "../Templates/templateDefaults";
import { buildFullAddress } from "../../../utils/buildFullAddress";
import { getDisplayName } from "../../../utils/name";

import {
  // addDays,
  calculateQuotationTotals,
  createQuotationNumber,
  toDateInput,
} from "../utils/quotationCalculations";

// Modular Component Imports
import QuotationForm from "./QuotationForm";
import { ChooseTemplateStep, ReviewStep } from "./QuotationRenderer";

function Stepper({ step }) {
  const steps = ["Choose Template", "Fill Quotation Details", "Review & Preview"];

  return (
    <div className="grid grid-cols-3 border-b border-slate-200 px-8 py-5 shrink-0">
      {steps.map((label, index) => {
        const number = index + 1;
        const complete = number < step;
        const active = number === step;

        return (
          <div
            key={label}
            className={`flex items-center text-[11px] font-medium ${active ? "text-red-500" : "text-slate-700"}`}
          >
            <span
              className={`mr-3 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                complete
                  ? "border border-red-500 text-red-500"
                  : active
                    ? "bg-red-500 text-white"
                    : "bg-slate-100 text-slate-700"
              }`}
            >
              {complete ? <Check size={13} /> : number}
            </span>
            <span className="whitespace-nowrap">{label}</span>
            {index < steps.length - 1 && <span className="mx-5 h-px flex-1 bg-slate-200" />}
          </div>
        );
      })}
    </div>
  );
}

function WizardHeader({ onClose }) {
  return (
    <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-8 py-5">
      <h2 className="text-xl font-semibold text-slate-900">Add New Quotation</h2>
      <div className="flex items-center gap-2">
        <button type="button" className="rounded-md p-2 text-slate-500 hover:bg-slate-100">
          <Expand size={18} />
        </button>
        <button type="button" onClick={onClose} className="rounded-md p-2 text-slate-500 hover:bg-slate-100">
          <X size={20} />
        </button>
      </div>
    </div>
  );
}

function WizardFooter({
  loading,
  onBack,
  onCancel,
  onContinue,
  onSaveDraft,
  onSubmit,
  selectedTemplate,
  step,
}) {
  const TemplateIcon = selectedTemplate?.icon;

  return (
    <div className="flex shrink-0 items-center justify-between border-t border-slate-200 bg-white px-6 py-4">
      <button
        type="button"
        onClick={onCancel}
        className="rounded-md border border-slate-200 px-5 py-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
      >
        Cancel
      </button>

      {/* RESTORED TEMPLATE TEXT */}
      <div className="hidden items-center gap-2 md:flex">
        {step === 1 && selectedTemplate && (
          <div className="flex items-center gap-2 rounded-full bg-slate-50 px-4 py-1.5 border border-slate-100">
            {TemplateIcon && (
              <span className={`flex h-5 w-5 items-center justify-center rounded-md ${selectedTemplate.iconClass}`}>
                <TemplateIcon size={12} />
              </span>
            )}
            <span className="text-[11px] font-medium text-slate-600">
              Selected Template: <strong className="text-slate-800">{selectedTemplate.name}</strong>
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        {step > 1 && (
          <button
            type="button"
            onClick={onBack}
            disabled={loading}
            className="flex items-center gap-2 rounded-md border border-slate-200 px-5 py-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            <ArrowLeft size={14} /> Back
          </button>
        )}
        {step > 1 && (
          <button
            type="button"
            onClick={onSaveDraft}
            disabled={loading}
            className="rounded-md border border-slate-200 px-6 py-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            Save Draft
          </button>
        )}
        {step < 3 ? (
          <button
            type="button"
            onClick={onContinue}
            disabled={loading}
            className="flex items-center gap-4 rounded-md bg-red-500 px-6 py-2.5 text-xs font-medium text-white hover:bg-red-600"
          >
            {step === 1 ? "Continue" : "Next: Review & Preview"} <ArrowRight size={14} />
          </button>
        ) : (
          <button
            type="button"
            onClick={onSubmit}
            disabled={loading}
            className="flex items-center gap-3 rounded-md bg-red-500 px-7 py-2.5 text-xs font-medium text-white hover:bg-red-600"
          >
            {loading ? "Creating..." : "Create Quotation"} <CheckCircle2 size={15} />
          </button>
        )}
      </div>
    </div>
  );
}

const getClientDetails = (client) => {
  if (!client) {
    return {
      clientName: "",
      clientCompany: "",
      clientEmail: "",
      clientPhone: "",
      clientAddress: "",
    };
  }
  const address = buildFullAddress(client.address);
  return {
    clientName: getDisplayName(client, { includeMiddleInitial: true, includeSuffix: true }),
    clientCompany: client.company || "",
    clientEmail: client.email || "",
    clientPhone: client.phone || "",
    clientAddress: address === "—" ? "" : address,
  };
};

const createInitialDetails = (formData, clients, currentUser) => {
  const now = new Date();
  const selectedClient = clients.find((c) => String(c._id) === String(formData.client || ""));
  const companyAddress = buildFullAddress(currentUser?.address);

  return {
    // Basic Info
    quotationNumber: createQuotationNumber(),
    quotationDate: toDateInput(now),
    validUntil: formData.expectedCloseDate || "", 
    quotationTitle: formData.title || "",
    currency: formData.currency || "PHP",

    // Company Info (Populates default details using active user session profile)
    companyName: currentUser?.company || "",
    companyEmail: currentUser?.email || "",
    companyPhone: currentUser?.phone || "",
    companyAddress: companyAddress === "—" ? "" : companyAddress,

    // Client Info (Blank, ready for dynamic selection)
    clientId: formData.client || "",
    ...getClientDetails(selectedClient),

    // Sections (No pre-written mock summaries or filler texts)
    introduction: "",
    overviewProjectName: formData.title || "",
    overviewObjectives: "",
    overviewScope: "",
    eventName: "",
    eventVenue: "",
    eventDate: "",
    eventGuests: "",

    // Empty Lists (Starts blank for adding rows cleanly)
    items: [],
    materials: [],
    milestones: [],

    // Payment Info
    paymentMethod: "",
    downPayment: "0",
    balance: "0",
    paymentSchedule: "",

    // Pricing & Terms
    discount: "0",
    taxRate: "0",
    terms: "",
    notes: formData.notes || "",

    // Signatures (Populates default values using user credentials)
    preparedBy: getDisplayName(currentUser, { includeMiddleInitial: true, includeSuffix: true, fallback: "" }),
    preparedByRole: currentUser?.role || "",
    stage: formData.stage || "Draft",
    assignedTo: formData.assignedTo || "",
  };
};

export default function QuotationWizard({
  clients = [],
  currentUser,
  formData,
  loading,
  onClose,
  onSubmit,
  open,
  permissions = {},
  salesAgents = [],
  stages = [],
}) {
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState(
    QUOTATION_TEMPLATES.find((t) => t.id === "product"),
  );
  const [quotationTitle, setQuotationTitle] = useState(formData.title || "");
  const [details, setDetails] = useState(() => createInitialDetails(formData, clients, currentUser));
  const [activeTab, setActiveTab] = useState("preview");
  const [showBuilder, setShowBuilder] = useState(false);
  const [error, setError] = useState("");

  const filteredTemplates = useMemo(() => {
    const query = search.trim().toLowerCase();
    return QUOTATION_TEMPLATES.filter((t) => {
      const matchesCategory = category === "All" || t.category === category;
      const matchesSearch = !query || t.name.toLowerCase().includes(query) || t.description.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [category, search]);

  const totals = useMemo(() => {
    return calculateQuotationTotals(details.items, details.taxRate, details.discount);
  }, [details.discount, details.items, details.taxRate]);

  if (!open) return null;

  const updateDetails = (name, value) => {
    if (name === "requestedTemplateChange") {
      setStep(1);
      return;
    }
    setDetails((curr) => ({ ...curr, [name]: value }));
  };

  const changeClient = (clientId) => {
    const selectedClient = clients.find((c) => String(c._id) === String(clientId));
    setDetails((curr) => ({ ...curr, clientId, ...getClientDetails(selectedClient) }));
  };

  const addItem = () => {
    setDetails((curr) => ({
      ...curr,
      items: [...curr.items, { id: `item-${Date.now()}`, description: "", quantity: "1", unitPrice: "" }],
    }));
  };

  const updateItem = (itemId, name, value) => {
    setDetails((curr) => ({
      ...curr,
      items: curr.items.map((item) => (item.id === itemId ? { ...item, [name]: value } : item)),
    }));
  };

  const removeItem = (itemId) => {
    setDetails((curr) => ({
      ...curr,
      items: curr.items.filter((item) => item.id !== itemId),
    }));
  };

  const addRow = (listKey, row) => {
    setDetails((curr) => ({
      ...curr,
      [listKey]: [...curr[listKey], { ...row, id: `${listKey}-${Date.now()}` }],
    }));
  };

  const updateRow = (listKey, rowId, name, value) => {
    setDetails((curr) => ({
      ...curr,
      [listKey]: curr[listKey].map((row) => (row.id === rowId ? { ...row, [name]: value } : row)),
    }));
  };

  const removeRow = (listKey, rowId) => {
    setDetails((curr) => ({
      ...curr,
      [listKey]: curr[listKey].filter((row) => row.id !== rowId),
    }));
  };

  const validateTemplate = () => {
    if (!quotationTitle.trim()) {
      setError("Enter a quotation title before continuing.");
      return false;
    }
    if (!selectedTemplate) {
      setError("Select a quotation template before continuing.");
      return false;
    }
    return true;
  };

  const validateDetails = () => {
    if (!details.quotationTitle.trim() || !details.companyName.trim()) {
      setError("Complete required quotation and company fields.");
      return false;
    }
    if (!details.clientId) {
      setError("Select a client record before continuing.");
      return false;
    }
    return true;
  };

  const continueToNextStep = () => {
    setError("");
    if (step === 1) {
      if (!validateTemplate()) return;
      setDetails((curr) => ({ ...curr, quotationTitle: quotationTitle.trim() }));
      setStep(2);
      return;
    }
    if (step === 2 && validateDetails()) {
      setStep(3);
    }
  };

  const createPayload = (stage) => ({
    ...formData,
    title: details.quotationTitle.trim() || quotationTitle.trim(),
    client: details.clientId,
    value: totals.total,
    currency: details.currency,
    stage: stage || details.stage || "Draft",
    expectedCloseDate: details.validUntil || null,
    assignedTo: details.assignedTo,
    notes: [details.notes, details.terms].filter(Boolean).join("\n\n"),
  });

  const submitQuotation = async (stage) => {
    setError("");
    if (!validateTemplate() || !validateDetails()) {
      if (step !== 2) setStep(2);
      return;
    }
    await onSubmit({ preventDefault: () => undefined }, createPayload(stage));
  };

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      submitting={loading}
      closeOnBackdrop={false}
      maxWidth="max-w-[1180px]"
      className="!h-[94vh] !max-h-[94vh] !rounded-lg !p-0"
    >
      {showBuilder ? (
        <TemplateBuilder
          onCancel={() => setShowBuilder(false)}
          onUseTemplate={(t) => {
            setSelectedTemplate(t);
            setShowBuilder(false);
            setStep(2);
            setDetails((curr) => ({
              ...curr,
              quotationTitle: quotationTitle.trim() || curr.quotationTitle,
            }));
          }}
        />
      ) : (
        <div className="flex h-full min-h-0 flex-col overflow-hidden">
          <WizardHeader onClose={onClose} />
          <Stepper step={step} />

          {step === 1 && (
            <div className="flex-1 min-h-0 overflow-y-auto">
              <ChooseTemplateStep
                category={category}
                error={error}
                filteredTemplates={filteredTemplates}
                onBuildCustom={() => setShowBuilder(true)}
                onCategoryChange={setCategory}
                onSearchChange={setSearch}
                onSelectTemplate={setSelectedTemplate}
                quotationTitle={quotationTitle}
                search={search}
                selectedTemplate={selectedTemplate}
                setQuotationTitle={setQuotationTitle}
              />
            </div>
          )}

          {step === 2 && (
            <div className="flex-1 min-h-0 overflow-y-auto">
              <QuotationForm
                clients={clients}
                details={details}
                error={error}
                onAddItem={addItem}
                onAddRow={addRow}
                onChangeClient={changeClient}
                onRemoveItem={removeItem}
                onRemoveRow={removeRow}
                onUpdate={updateDetails}
                onUpdateItem={updateItem}
                onUpdateRow={updateRow}
                selectedTemplate={selectedTemplate}
              />
            </div>
          )}

          {step === 3 && (
            <div className="flex-1 min-h-0 overflow-y-auto">
              <ReviewStep
                activeTab={activeTab}
                details={details}
                onEditDetails={() => setStep(2)}
                onTabChange={setActiveTab}
                onUpdate={updateDetails}
                permissions={permissions}
                salesAgents={salesAgents}
                selectedTemplate={selectedTemplate}
                stages={stages}
                totals={totals}
              />
            </div>
          )}

          <WizardFooter
            loading={loading}
            onBack={() => {
              setError("");
              setStep((curr) => Math.max(1, curr - 1));
            }}
            onCancel={onClose}
            onContinue={continueToNextStep}
            onSaveDraft={() => submitQuotation("Draft")}
            onSubmit={() => submitQuotation()}
            selectedTemplate={selectedTemplate}
            step={step}
          />
        </div>
      )}
    </BaseModal>
  );
}