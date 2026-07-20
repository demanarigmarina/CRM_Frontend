import React from "react";
import { FileText, Layers3, Lightbulb, CheckCircle2 } from "lucide-react";
import { TEMPLATE_SECTIONS } from "../Templates/templateDefaults";
import { formatCurrency } from "../../../utils/currency";
import { getDisplayName } from "../../../utils/name";
import { FieldLabel } from "./QuotationForm";

const FIELD_CLASS =
  "w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-red-300 focus:ring-2 focus:ring-red-100";

export function QuotationSummaryWidget({ details, selectedTemplate, totals }) {
  return (
    <aside className="w-72 shrink-0 rounded-lg border border-slate-200 bg-white">
      <h3 className="border-b border-slate-200 px-4 py-4 text-sm font-semibold text-slate-900">
        Quotation Summary
      </h3>
      <div className="space-y-5 p-4">
        <div className="flex gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-violet-50 text-violet-500">
            <FileText size={15} />
          </span>
          <div>
            <p className="text-[10px] text-slate-500">Template</p>
            <p className="mt-1 text-xs font-medium text-slate-800">
              {selectedTemplate.name} Template
            </p>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-4">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-red-50 text-red-500">
              <Layers3 size={15} />
            </span>
            <div>
              <p className="text-[10px] text-slate-500">
                Sections Included ({selectedTemplate.sections.length})
              </p>
            </div>
          </div>
          <div className="mt-3 space-y-2.5 pl-1">
            {selectedTemplate.sections.map((section) => (
              <p key={section} className="flex items-center gap-2 text-[10px] text-slate-600">
                <CheckCircle2 size={13} className="text-emerald-500" />
                {TEMPLATE_SECTIONS[section]?.label || section}
              </p>
            ))}
          </div>
        </div>

        <div className="border-t border-slate-100 pt-4">
          <p className="text-[10px] text-slate-500">Total Amount</p>
          <p className="mt-1 text-lg font-bold text-red-500">
            {formatCurrency(totals.total, details.currency)}
          </p>
        </div>

        <div className="rounded-md bg-red-50 p-4 text-[10px] leading-5 text-slate-600">
          <div className="mb-1 flex items-center gap-2 font-semibold text-slate-800">
            <Lightbulb size={14} className="text-red-500" />
            Tip
          </div>
          Review the quotation preview. You can return to edit details if needed.
        </div>
      </div>
    </aside>
  );
}

export function FormDataPanel({ details, totals }) {
  const rows = [
    ["Quotation Number", details.quotationNumber],
    ["Subject / Title", details.quotationTitle],
    ["Client", details.clientName],
    ["Company", details.companyName],
    ["Quotation Date", details.quotationDate],
    ["Valid Until", details.validUntil],
    ["Currency", details.currency],
    ["Subtotal", formatCurrency(totals.subtotal, details.currency)],
    ["Tax", formatCurrency(totals.taxAmount, details.currency)],
    ["Total", formatCurrency(totals.total, details.currency)],
  ];

  return (
    <div className="grid grid-cols-2 gap-4 rounded-lg border border-slate-200 bg-white p-6">
      {rows.map(([label, value]) => (
        <div key={label} className="rounded-md bg-slate-50 p-4">
          <p className="text-[10px] uppercase tracking-wide text-slate-400">{label}</p>
          <p className="mt-1 text-xs font-medium text-slate-800">{value || "—"}</p>
        </div>
      ))}
    </div>
  );
}

export function SettingsPanel({ details, onUpdate, permissions, salesAgents, stages }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6">
      <h3 className="text-sm font-semibold text-slate-900">Quotation Settings</h3>
      <div className="mt-5 grid grid-cols-2 gap-4">
        <div>
          <FieldLabel>Pipeline Stage</FieldLabel>
          <select
            value={details.stage}
            onChange={(e) => onUpdate("stage", e.target.value)}
            className={FIELD_CLASS}
          >
            {stages.map((stage) => (
              <option key={stage} value={stage}>{stage}</option>
            ))}
          </select>
        </div>
        {permissions.canAssign && (
          <div>
            <FieldLabel>Assigned To</FieldLabel>
            <select
              value={details.assignedTo}
              onChange={(e) => onUpdate("assignedTo", e.target.value)}
              className={FIELD_CLASS}
            >
              <option value="">Unassigned</option>
              {salesAgents.map((agent) => (
                <option key={agent._id} value={agent._id}>
                  {getDisplayName(agent, { includeSuffix: true })}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="col-span-2">
          <FieldLabel>Internal Notes</FieldLabel>
          <textarea
            value={details.notes}
            onChange={(e) => onUpdate("notes", e.target.value)}
            rows={5}
            className={`${FIELD_CLASS} resize-none`}
            placeholder="Add notes for this quotation..."
          />
        </div>
      </div>
    </div>
  );
}