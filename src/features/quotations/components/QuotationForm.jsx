import React from "react";
import { Plus, Trash2, CheckCircle2, Lightbulb, Pencil } from "lucide-react";
import { TEMPLATE_SECTIONS } from "../Templates/templateDefaults";
import { formatCurrency } from "../../../utils/currency";
import { getDisplayName } from "../../../utils/name";
import { toNumber } from "../utils/quotationCalculations";

const FIELD_CLASS =
  "w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-red-300 focus:ring-2 focus:ring-red-100";

const CURRENCIES = [
  { value: "PHP", label: "Philippine Peso (PHP)" },
  { value: "USD", label: "US Dollar (USD)" },
  { value: "EUR", label: "Euro (EUR)" },
];

export function FieldLabel({ children, required = false }) {
  return (
    <label className="mb-1.5 block text-[11px] font-medium text-slate-600">
      {children}
      {required && <span className="ml-1 text-red-500">*</span>}
    </label>
  );
}

function SectionHeading({ children }) {
  return (
    <h3 className="border-b border-slate-100 pb-3 text-sm font-semibold text-slate-900">
      {children}
    </h3>
  );
}

function SelectedTemplatePanel({ template, onChangeTemplate }) {
  const Icon = template.icon;
  return (
    <aside className="w-56 shrink-0 rounded-lg border border-slate-200 p-4">
      <p className="text-xs font-medium text-slate-600">Selected Template</p>
      <span className={`mt-4 flex h-12 w-12 items-center justify-center rounded-lg ${template.iconClass}`}>
        <Icon size={22} />
      </span>
      <h3 className="mt-4 text-sm font-semibold text-slate-800">{template.name} Template</h3>
      <p className="mt-2 text-[11px] leading-5 text-slate-500">{template.description}</p>
      <div className="mt-4 flex items-center gap-2 text-[11px] text-slate-500">
        <span>{template.sections.length} Sections</span>
      </div>
      <button
        type="button"
        onClick={onChangeTemplate}
        className="mt-5 flex w-full items-center justify-between rounded-md border border-slate-200 px-3 py-2.5 text-[11px] font-medium text-slate-700 hover:bg-slate-50"
      >
        Change Template
        <Pencil size={13} />
      </button>

      <div className="mt-6 border-t border-slate-100 pt-5">
        <p className="text-xs font-semibold text-slate-800">Template Sections</p>
        <div className="mt-4 space-y-3">
          {template.sections.map((section) => (
            <div key={section} className="flex items-center gap-2 text-[10px] text-slate-600">
              <CheckCircle2 size={14} className="text-emerald-500" />
              {TEMPLATE_SECTIONS[section]?.label || section}
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

function ItemEditor({ currency, items, onAdd, onRemove, onUpdate }) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <SectionHeading>Product / Items</SectionHeading>
        <button
          type="button"
          onClick={onAdd}
          className="flex items-center gap-2 rounded-md border border-red-200 px-3 py-2 text-[11px] font-medium text-red-500 hover:bg-red-50"
        >
          <Plus size={13} />
          Add Item
        </button>
      </div>
      <div className="overflow-hidden rounded-md border border-slate-200">
        <div className="grid grid-cols-[42px_1fr_90px_130px_130px_42px] bg-slate-50 text-[10px] font-semibold text-slate-600">
          {["#", "Description", "Qty", "Unit Price", "Amount", ""].map((label, i) => (
            <span key={i} className="px-3 py-2.5">{label}</span>
          ))}
        </div>
        {items.map((item, index) => {
          const amount = toNumber(item.quantity) * toNumber(item.unitPrice);
          return (
            <div key={item.id} className="grid grid-cols-[42px_1fr_90px_130px_130px_42px] items-center border-t border-slate-100 text-xs">
              <span className="px-3 text-slate-500">{index + 1}</span>
              <input
                value={item.description}
                onChange={(e) => onUpdate(item.id, "description", e.target.value)}
                className="border-0 px-3 py-3 text-xs outline-none focus:ring-0"
                placeholder="Item description"
              />
              <input
                type="number"
                min="0"
                value={item.quantity}
                onChange={(e) => onUpdate(item.id, "quantity", e.target.value)}
                className="border-0 px-3 py-3 text-xs outline-none focus:ring-0"
              />
              <input
                type="number"
                min="0"
                step="0.01"
                value={item.unitPrice}
                onChange={(e) => onUpdate(item.id, "unitPrice", e.target.value)}
                className="border-0 px-3 py-3 text-xs outline-none focus:ring-0"
                placeholder="0.00"
              />
              <span className="px-3 font-medium text-slate-700">
                {formatCurrency(amount, currency)}
              </span>
              <button
                type="button"
                onClick={() => onRemove(item.id)}
                className="mx-auto rounded p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500"
              >
                <Trash2 size={13} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MaterialEditor({ currency, materials, onAdd, onRemove, onUpdate }) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <SectionHeading>Materials List</SectionHeading>
        <button
          type="button"
          onClick={onAdd}
          className="flex items-center gap-2 rounded-md border border-red-200 px-3 py-2 text-[11px] font-medium text-red-500 hover:bg-red-50"
        >
          <Plus size={13} />
          Add Material
        </button>
      </div>
      <div className="overflow-hidden rounded-md border border-slate-200">
        <div className="grid grid-cols-[42px_1fr_90px_130px_130px_42px] bg-slate-50 text-[10px] font-semibold text-slate-600">
          {["#", "Material", "Qty", "Unit Cost", "Total", ""].map((label, i) => (
            <span key={i} className="px-3 py-2.5">{label}</span>
          ))}
        </div>
        {materials.map((material, index) => {
          const total = toNumber(material.quantity) * toNumber(material.unitCost);
          return (
            <div key={material.id} className="grid grid-cols-[42px_1fr_90px_130px_130px_42px] items-center border-t border-slate-100 text-xs">
              <span className="px-3 text-slate-500">{index + 1}</span>
              <input
                value={material.material}
                onChange={(e) => onUpdate(material.id, "material", e.target.value)}
                className="border-0 px-3 py-3 text-xs outline-none focus:ring-0"
                placeholder="Material name"
              />
              <input
                type="number"
                min="0"
                value={material.quantity}
                onChange={(e) => onUpdate(material.id, "quantity", e.target.value)}
                className="border-0 px-3 py-3 text-xs outline-none focus:ring-0"
              />
              <input
                type="number"
                min="0"
                step="0.01"
                value={material.unitCost}
                onChange={(e) => onUpdate(material.id, "unitCost", e.target.value)}
                className="border-0 px-3 py-3 text-xs outline-none focus:ring-0"
                placeholder="0.00"
              />
              <span className="px-3 font-medium text-slate-700">
                {formatCurrency(total, currency)}
              </span>
              <button
                type="button"
                onClick={() => onRemove(material.id)}
                className="mx-auto rounded p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500"
              >
                <Trash2 size={13} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MilestoneEditor({ milestones, onAdd, onRemove, onUpdate }) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <SectionHeading>Timeline / Milestones</SectionHeading>
        <button
          type="button"
          onClick={onAdd}
          className="flex items-center gap-2 rounded-md border border-red-200 px-3 py-2 text-[11px] font-medium text-red-500 hover:bg-red-50"
        >
          <Plus size={13} />
          Add Milestone
        </button>
      </div>
      <div className="overflow-hidden rounded-md border border-slate-200">
        <div className="grid grid-cols-[1fr_150px_150px_42px] bg-slate-50 text-[10px] font-semibold text-slate-600">
          {["Phase", "Start Date", "End Date", ""].map((label, i) => (
            <span key={i} className="px-3 py-2.5">{label}</span>
          ))}
        </div>
        {milestones.map((milestone) => (
          <div key={milestone.id} className="grid grid-cols-[1fr_150px_150px_42px] items-center border-t border-slate-100 text-xs">
            <input
              value={milestone.phase}
              onChange={(e) => onUpdate(milestone.id, "phase", e.target.value)}
              className="border-0 px-3 py-3 text-xs outline-none focus:ring-0"
              placeholder="e.g. Planning"
            />
            <input
              type="date"
              value={milestone.startDate}
              onChange={(e) => onUpdate(milestone.id, "startDate", e.target.value)}
              className="border-0 px-3 py-3 text-xs outline-none focus:ring-0"
            />
            <input
              type="date"
              value={milestone.endDate}
              onChange={(e) => onUpdate(milestone.id, "endDate", e.target.value)}
              className="border-0 px-3 py-3 text-xs outline-none focus:ring-0"
            />
            <button
              type="button"
              onClick={() => onRemove(milestone.id)}
              className="mx-auto rounded p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500"
            >
              <Trash2 size={13} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function QuotationForm({
  clients,
  details,
  error,
  onAddItem,
  onAddRow,
  onChangeClient,
  onRemoveItem,
  onRemoveRow,
  onUpdate,
  onUpdateItem,
  onUpdateRow,
  selectedTemplate,
}) {
  const hasSection = (section) => selectedTemplate.sections.includes(section);

  return (
    <div className="flex min-h-0 flex-1 gap-5 p-6">
      <SelectedTemplatePanel
        template={selectedTemplate}
        onChangeTemplate={() => onUpdate("requestedTemplateChange", true)}
      />

      <div className="min-h-0 flex-1 overflow-y-auto rounded-lg border border-slate-200 p-6">
        {error && (
          <div className="mb-5 rounded-md border border-red-200 bg-red-50 px-4 py-2.5 text-xs text-red-600">
            {error}
          </div>
        )}

        <div className="space-y-6">
          <section>
            <SectionHeading>Quotation Basic Information</SectionHeading>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <FieldLabel required>Quotation Number</FieldLabel>
                <input
                  value={details.quotationNumber}
                  onChange={(e) => onUpdate("quotationNumber", e.target.value)}
                  className={FIELD_CLASS}
                />
              </div>
              <div>
                <FieldLabel required>Quotation Date</FieldLabel>
                <input
                  type="date"
                  value={details.quotationDate}
                  onChange={(e) => onUpdate("quotationDate", e.target.value)}
                  className={FIELD_CLASS}
                />
              </div>
              <div>
                <FieldLabel>Valid Until</FieldLabel>
                <input
                  type="date"
                  value={details.validUntil}
                  onChange={(e) => onUpdate("validUntil", e.target.value)}
                  className={FIELD_CLASS}
                />
              </div>
              <div>
                <FieldLabel required>Currency</FieldLabel>
                <select
                  value={details.currency}
                  onChange={(e) => onUpdate("currency", e.target.value)}
                  className={FIELD_CLASS}
                >
                  {CURRENCIES.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
              <div className="col-span-2">
                <FieldLabel required>Subject / Title</FieldLabel>
                <input
                  value={details.quotationTitle}
                  onChange={(e) => onUpdate("quotationTitle", e.target.value)}
                  className={FIELD_CLASS}
                  placeholder="e.g. Supply of Office Equipment"
                />
              </div>
            </div>
          </section>

          {hasSection("company") && (
            <section>
              <SectionHeading>Company Information</SectionHeading>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <FieldLabel required>Company Name</FieldLabel>
                  <input
                    value={details.companyName}
                    onChange={(e) => onUpdate("companyName", e.target.value)}
                    className={FIELD_CLASS}
                  />
                </div>
                <div>
                  <FieldLabel required>Email</FieldLabel>
                  <input
                    type="email"
                    value={details.companyEmail}
                    onChange={(e) => onUpdate("companyEmail", e.target.value)}
                    className={FIELD_CLASS}
                  />
                </div>
                <div>
                  <FieldLabel>Phone</FieldLabel>
                  <input
                    value={details.companyPhone}
                    onChange={(e) => onUpdate("companyPhone", e.target.value)}
                    className={FIELD_CLASS}
                  />
                </div>
                <div>
                  <FieldLabel>Address</FieldLabel>
                  <input
                    value={details.companyAddress}
                    onChange={(e) => onUpdate("companyAddress", e.target.value)}
                    className={FIELD_CLASS}
                  />
                </div>
              </div>
            </section>
          )}

          {hasSection("client") && (
            <section>
              <SectionHeading>Client Information</SectionHeading>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <FieldLabel required>Client Record</FieldLabel>
                  <select
                    value={details.clientId}
                    onChange={(e) => onChangeClient(e.target.value)}
                    className={FIELD_CLASS}
                  >
                    <option value="">Select a client...</option>
                    {clients.map((c) => (
                      <option key={c._id} value={c._id}>
                        {getDisplayName(c, { includeSuffix: true })}
                        {c.company ? ` — ${c.company}` : ""}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <FieldLabel required>Client Name</FieldLabel>
                  <input
                    value={details.clientName}
                    onChange={(e) => onUpdate("clientName", e.target.value)}
                    className={FIELD_CLASS}
                    placeholder="Enter client name"
                  />
                </div>
                <div>
                  <FieldLabel required>Email</FieldLabel>
                  <input
                    type="email"
                    value={details.clientEmail}
                    onChange={(e) => onUpdate("clientEmail", e.target.value)}
                    className={FIELD_CLASS}
                    placeholder="Enter email"
                  />
                </div>
                <div>
                  <FieldLabel>Phone</FieldLabel>
                  <input
                    value={details.clientPhone}
                    onChange={(e) => onUpdate("clientPhone", e.target.value)}
                    className={FIELD_CLASS}
                    placeholder="Enter phone number"
                  />
                </div>
                <div>
                  <FieldLabel>Address</FieldLabel>
                  <input
                    value={details.clientAddress}
                    onChange={(e) => onUpdate("clientAddress", e.target.value)}
                    className={FIELD_CLASS}
                    placeholder="Enter client address"
                  />
                </div>
              </div>
            </section>
          )}

          {hasSection("overview") && (
            <section>
              <SectionHeading>Project Overview</SectionHeading>
              <div className="mt-4 space-y-4">
                <div>
                  <FieldLabel>Project Name</FieldLabel>
                  <input
                    value={details.overviewProjectName}
                    onChange={(e) => onUpdate("overviewProjectName", e.target.value)}
                    className={FIELD_CLASS}
                    placeholder="e.g. CRM Implementation"
                  />
                </div>
                <div>
                  <FieldLabel>Objectives</FieldLabel>
                  <textarea
                    value={details.overviewObjectives}
                    onChange={(e) => onUpdate("overviewObjectives", e.target.value)}
                    rows={3}
                    className={`${FIELD_CLASS} resize-none`}
                    placeholder="Describe the goals of this project..."
                  />
                </div>
                <div>
                  <FieldLabel>Scope Description</FieldLabel>
                  <textarea
                    value={details.overviewScope}
                    onChange={(e) => onUpdate("overviewScope", e.target.value)}
                    rows={3}
                    className={`${FIELD_CLASS} resize-none`}
                    placeholder="Describe the scope of work..."
                  />
                </div>
              </div>
            </section>
          )}

          {hasSection("event") && (
            <section>
              <SectionHeading>Event Details</SectionHeading>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <FieldLabel>Event Name</FieldLabel>
                  <input
                    value={details.eventName}
                    onChange={(e) => onUpdate("eventName", e.target.value)}
                    className={FIELD_CLASS}
                    placeholder="e.g. Annual Sales Seminar"
                  />
                </div>
                <div>
                  <FieldLabel>Venue</FieldLabel>
                  <input
                    value={details.eventVenue}
                    onChange={(e) => onUpdate("eventVenue", e.target.value)}
                    className={FIELD_CLASS}
                    placeholder="Enter venue"
                  />
                </div>
                <div>
                  <FieldLabel>Event Date</FieldLabel>
                  <input
                    type="date"
                    value={details.eventDate}
                    onChange={(e) => onUpdate("eventDate", e.target.value)}
                    className={FIELD_CLASS}
                  />
                </div>
                <div>
                  <FieldLabel>Number of Guests</FieldLabel>
                  <input
                    type="number"
                    min="0"
                    value={details.eventGuests}
                    onChange={(e) => onUpdate("eventGuests", e.target.value)}
                    className={FIELD_CLASS}
                    placeholder="0"
                  />
                </div>
              </div>
            </section>
          )}

          {hasSection("text") && (
            <section>
              <SectionHeading>Introduction</SectionHeading>
              <textarea
                value={details.introduction}
                onChange={(e) => onUpdate("introduction", e.target.value)}
                rows={3}
                className={`${FIELD_CLASS} mt-4 resize-none`}
                placeholder="Add a short introduction for this quotation..."
              />
            </section>
          )}

          {hasSection("items") && (
            <ItemEditor
              currency={details.currency}
              items={details.items}
              onAdd={onAddItem}
              onRemove={onRemoveItem}
              onUpdate={onUpdateItem}
            />
          )}

          {hasSection("materials") && (
            <MaterialEditor
              currency={details.currency}
              materials={details.materials}
              onAdd={() => onAddRow("materials", { material: "", quantity: "1", unitCost: "" })}
              onRemove={(rowId) => onRemoveRow("materials", rowId)}
              onUpdate={(rowId, name, val) => onUpdateRow("materials", rowId, name, val)}
            />
          )}

          {hasSection("timeline") && (
            <MilestoneEditor
              milestones={details.milestones}
              onAdd={() => onAddRow("milestones", { phase: "", startDate: "", endDate: "" })}
              onRemove={(rowId) => onRemoveRow("milestones", rowId)}
              onUpdate={(rowId, name, val) => onUpdateRow("milestones", rowId, name, val)}
            />
          )}

          {hasSection("summary") && (
            <section>
              <SectionHeading>Pricing Summary</SectionHeading>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <FieldLabel>Discount Amount</FieldLabel>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={details.discount}
                    onChange={(e) => onUpdate("discount", e.target.value)}
                    className={FIELD_CLASS}
                  />
                </div>
                <div>
                  <FieldLabel>Tax Rate (%)</FieldLabel>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={details.taxRate}
                    onChange={(e) => onUpdate("taxRate", e.target.value)}
                    className={FIELD_CLASS}
                  />
                </div>
              </div>
            </section>
          )}

          {hasSection("payment") && (
            <section>
              <SectionHeading>Payment Information</SectionHeading>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <FieldLabel>Payment Method</FieldLabel>
                  <input
                    value={details.paymentMethod}
                    onChange={(e) => onUpdate("paymentMethod", e.target.value)}
                    className={FIELD_CLASS}
                    placeholder="e.g. Bank Transfer"
                  />
                </div>
                <div>
                  <FieldLabel>Down Payment</FieldLabel>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={details.downPayment}
                    onChange={(e) => onUpdate("downPayment", e.target.value)}
                    className={FIELD_CLASS}
                  />
                </div>
                <div>
                  <FieldLabel>Remaining Balance</FieldLabel>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={details.balance}
                    onChange={(e) => onUpdate("balance", e.target.value)}
                    className={FIELD_CLASS}
                  />
                </div>
                <div className="col-span-2">
                  <FieldLabel>Payment Schedule</FieldLabel>
                  <textarea
                    value={details.paymentSchedule}
                    onChange={(e) => onUpdate("paymentSchedule", e.target.value)}
                    rows={4}
                    className={`${FIELD_CLASS} resize-none`}
                    placeholder="e.g. 20% initial, 40% progress, 40% completion"
                  />
                </div>
              </div>
            </section>
          )}

          {hasSection("terms") && (
            <section>
              <SectionHeading>Terms &amp; Conditions</SectionHeading>
              <textarea
                value={details.terms}
                onChange={(e) => onUpdate("terms", e.target.value)}
                rows={5}
                className={`${FIELD_CLASS} mt-4 resize-none`}
              />
            </section>
          )}

          {hasSection("notes") && (
            <section>
              <SectionHeading>Notes</SectionHeading>
              <textarea
                value={details.notes}
                onChange={(e) => onUpdate("notes", e.target.value)}
                rows={4}
                className={`${FIELD_CLASS} mt-4 resize-none`}
                placeholder="Add a note for the client..."
              />
            </section>
          )}

          {hasSection("signature") && (
            <section>
              <SectionHeading>Signature</SectionHeading>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <FieldLabel>Prepared By</FieldLabel>
                  <input
                    value={details.preparedBy}
                    onChange={(e) => onUpdate("preparedBy", e.target.value)}
                    className={FIELD_CLASS}
                  />
                </div>
                <div>
                  <FieldLabel>Position</FieldLabel>
                  <input
                    value={details.preparedByRole}
                    onChange={(e) => onUpdate("preparedByRole", e.target.value)}
                    className={FIELD_CLASS}
                  />
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}