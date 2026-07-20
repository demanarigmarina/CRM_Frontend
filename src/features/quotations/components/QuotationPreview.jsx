import React from "react";
import intellicrmLogo from "../../../assets/iCRM_Logo_Black.png";
import { formatCurrency } from "../../../utils/currency";
import { toNumber } from "../utils/quotationCalculations";

export default function QuotationPreview({ details, selectedTemplate, totals }) {
  const visibleItems = details.items.filter(
    (item) => item.description || toNumber(item.unitPrice) > 0,
  );

  return (
    <article className="mx-auto min-h-[650px] w-full max-w-2xl bg-white px-8 py-7 text-[9px] text-slate-700 shadow-sm">
      <div className="flex items-start justify-between border-b border-red-100 pb-5">
        <div>
          <img
            src={intellicrmLogo}
            alt="IntelliCRM"
            className="h-10 w-auto object-contain object-left"
          />
          <p className="mt-1 font-medium">{details.companyName}</p>
        </div>
        <div className="text-right">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">QUOTATION</h1>
          <p className="mt-2">Quotation #: <strong>{details.quotationNumber}</strong></p>
          <p>Date: {details.quotationDate}</p>
          <p>Valid Until: {details.validUntil}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-10 border-b border-red-100 py-5">
        <div>
          <p className="font-semibold uppercase text-red-500">From:</p>
          <p className="mt-2 font-semibold">{details.companyName}</p>
          <p>{details.companyAddress || "—"}</p>
          <p>Phone: {details.companyPhone || "—"}</p>
          <p>Email: {details.companyEmail || "—"}</p>
        </div>
        <div>
          <p className="font-semibold uppercase text-red-500">To:</p>
          <p className="mt-2 font-semibold">{details.clientName || "—"}</p>
          <p>{details.clientCompany || "—"}</p>
          <p>{details.clientAddress || "—"}</p>
          <p>Phone: {details.clientPhone || "—"}</p>
          <p>Email: {details.clientEmail || "—"}</p>
        </div>
      </div>

      <div className="py-4">
        <p className="font-semibold uppercase text-red-500">Subject / Title</p>
        <p className="mt-2 font-medium">{details.quotationTitle}</p>
        {selectedTemplate.sections.includes("text") && details.introduction && (
          <p className="mt-3 leading-5 text-slate-500">{details.introduction}</p>
        )}
      </div>

      {selectedTemplate.sections.includes("event") && (
        <div className="border-b border-red-100 py-4">
          <p className="font-semibold uppercase text-red-500">Event Details</p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <p>Event: {details.eventName || "—"}</p>
            <p>Venue: {details.eventVenue || "—"}</p>
            <p>Date: {details.eventDate || "—"}</p>
            <p>Guests: {details.eventGuests || "—"}</p>
          </div>
        </div>
      )}

      {selectedTemplate.sections.includes("overview") && (
        <div className="border-b border-red-100 py-4">
          <p className="font-semibold uppercase text-red-500">Project Overview</p>
          {details.overviewProjectName && <p className="mt-2 font-medium">{details.overviewProjectName}</p>}
          {details.overviewObjectives && (
            <p className="mt-2 whitespace-pre-line leading-5 text-slate-500">
              <span className="font-medium text-slate-600">Objectives: </span>
              {details.overviewObjectives}
            </p>
          )}
          {details.overviewScope && (
            <p className="mt-2 whitespace-pre-line leading-5 text-slate-500">
              <span className="font-medium text-slate-600">Scope: </span>
              {details.overviewScope}
            </p>
          )}
        </div>
      )}

      {selectedTemplate.sections.includes("items") && (
        <div>
          <div className="grid grid-cols-[36px_1fr_70px_110px_110px] border-y border-red-100 bg-red-50/40 font-semibold uppercase text-red-500">
            {["#", "Description", "Qty", "Unit Price", "Amount"].map((label) => (
              <span key={label} className="px-2 py-2">{label}</span>
            ))}
          </div>
          {visibleItems.map((item, index) => {
            const amount = toNumber(item.quantity) * toNumber(item.unitPrice);
            return (
              <div key={item.id} className="grid grid-cols-[36px_1fr_70px_110px_110px] border-b border-slate-100">
                <span className="px-2 py-2">{index + 1}</span>
                <span className="px-2 py-2">{item.description}</span>
                <span className="px-2 py-2">{item.quantity}</span>
                <span className="px-2 py-2">{formatCurrency(item.unitPrice, details.currency)}</span>
                <span className="px-2 py-2 text-right font-medium">{formatCurrency(amount, details.currency)}</span>
              </div>
            );
          })}

          <div className="ml-auto mt-3 w-64 text-xs">
            <div className="flex justify-between py-1">
              <span>Subtotal</span>
              <span>{formatCurrency(totals.subtotal, details.currency)}</span>
            </div>
            {totals.discountAmount > 0 && (
              <div className="flex justify-between py-1">
                <span>Discount</span>
                <span>-{formatCurrency(totals.discountAmount, details.currency)}</span>
              </div>
            )}
            <div className="flex justify-between py-1">
              <span>VAT ({details.taxRate || 0}%)</span>
              <span>{formatCurrency(totals.taxAmount, details.currency)}</span>
            </div>
            <div className="mt-1 flex justify-between border-t border-red-100 bg-red-50/50 px-2 py-2 text-sm font-bold text-red-500">
              <span>Total</span>
              <span>{formatCurrency(totals.total, details.currency)}</span>
            </div>
          </div>
        </div>
      )}

      {selectedTemplate.sections.includes("materials") && (
        <div className="mt-6">
          <p className="mb-2 font-semibold uppercase text-red-500">Materials List</p>
          <div className="grid grid-cols-[1fr_70px_110px_110px] border-y border-red-100 bg-red-50/40 font-semibold uppercase text-red-500">
            {["Material", "Qty", "Unit Cost", "Total"].map((label) => (
              <span key={label} className="px-2 py-2">{label}</span>
            ))}
          </div>
          {details.materials
            .filter((m) => m.material || toNumber(m.unitCost) > 0)
            .map((material) => {
              const total = toNumber(material.quantity) * toNumber(material.unitCost);
              return (
                <div key={material.id} className="grid grid-cols-[1fr_70px_110px_110px] border-b border-slate-100">
                  <span className="px-2 py-2">{material.material}</span>
                  <span className="px-2 py-2">{material.quantity}</span>
                  <span className="px-2 py-2">{formatCurrency(material.unitCost, details.currency)}</span>
                  <span className="px-2 py-2 text-right font-medium">{formatCurrency(total, details.currency)}</span>
                </div>
              );
            })}
        </div>
      )}

      {selectedTemplate.sections.includes("timeline") && (
        <div className="mt-6">
          <p className="mb-2 font-semibold uppercase text-red-500">Timeline / Milestones</p>
          <div className="grid grid-cols-[1fr_110px_110px] border-y border-red-100 bg-red-50/40 font-semibold uppercase text-red-500">
            {["Phase", "Start", "End"].map((label) => (
              <span key={label} className="px-2 py-2">{label}</span>
            ))}
          </div>
          {details.milestones
            .filter((m) => m.phase)
            .map((milestone) => (
              <div key={milestone.id} className="grid grid-cols-[1fr_110px_110px] border-b border-slate-100">
                <span className="px-2 py-2">{milestone.phase}</span>
                <span className="px-2 py-2">{milestone.startDate || "—"}</span>
                <span className="px-2 py-2">{milestone.endDate || "—"}</span>
              </div>
            ))}
        </div>
      )}

      {selectedTemplate.sections.includes("payment") && (
        <div className="mt-6 border-t border-red-100 pt-4">
          <p className="font-semibold uppercase text-red-500">Payment Information</p>
          <div className="mt-2 grid grid-cols-3 gap-2">
            <p>Method: {details.paymentMethod || "—"}</p>
            <p>Down Payment: {formatCurrency(details.downPayment, details.currency)}</p>
            <p>Balance: {formatCurrency(details.balance, details.currency)}</p>
          </div>
          {details.paymentSchedule && (
            <p className="mt-2 whitespace-pre-line leading-5 text-slate-500">{details.paymentSchedule}</p>
          )}
        </div>
      )}

      <div className="mt-7 grid grid-cols-2 gap-10">
        <div>
          {selectedTemplate.sections.includes("terms") && (
            <>
              <p className="font-semibold uppercase text-red-500">Terms &amp; Conditions</p>
              <p className="mt-2 whitespace-pre-line leading-5 text-slate-500">{details.terms || "—"}</p>
            </>
          )}
          {selectedTemplate.sections.includes("notes") && details.notes && (
            <div className="mt-5">
              <p className="font-semibold uppercase text-red-500">Notes</p>
              <p className="mt-2 whitespace-pre-line leading-5 text-slate-500">{details.notes}</p>
            </div>
          )}
        </div>
        {selectedTemplate.sections.includes("signature") && (
          <div className="self-end text-center">
            <div className="mx-auto mb-2 w-36 border-b border-slate-400" />
            <p className="font-semibold">{details.preparedBy}</p>
            <p className="text-slate-500">{details.preparedByRole}</p>
          </div>
        )}
      </div>
    </article>
  );
}