import { useState } from "react";
import { FiEdit2, FiUserCheck, FiX } from "react-icons/fi";

import ViewDrawer from "../../components/view/ViewDrawer";
import ViewTabs from "../../components/view/ViewTabs";
import ViewProfileHero from "../../components/view/ViewProfileHero";
import { Field, SectionBlock } from "../../components/view/ViewField";
import UserCard from "../../components/view/ViewUserCard";
import AssignAgentModal from "../../components/modal/AssignAgentModal";
import BaseBadge from "../../components/badge/BaseBadge";

import { useActivities } from "../../hooks/useActivities";
import ActivityTimeline from "../../components/activity/ActivityTimeline";

import { getDisplayName } from "../../utils/name";
import { formatDate, formatDateTime } from "../../utils/date";
import { formatPhone } from "../../utils/format";
import { buildFullAddress } from "../../utils/buildFullAddress";

// Config
const TABS = ["Overview", "Activity"];

const customerStatusConfig = {
  Active: {
    text: "Active",
    tone: "green",
  },
  Inactive: {
    text: "Inactive",
    tone: "gray",
  },
  Lost: {
    text: "Lost",
    tone: "red",
  },
};

const btnOutlineBase =
  "flex items-center gap-1.5 px-3 py-1.5 text-sm border rounded-md transition-colors cursor-pointer";

// Main component
export default function CustomerView({
  open,
  customer,
  salesAgents = [],
  permissions = {},
  onClose,
  onEdit,
  onReassignCustomer,
}) {
  const [activeTab, setActiveTab] = useState("Overview");
  const [reassignModalOpen, setReassignModalOpen] = useState(false);
  const { activities, loading: activitiesLoading } = useActivities(
    open && customer ? "Customer" : null,
    customer?._id,
  );

  const addr = customer?.address ?? {};
  const hasOwner = Boolean(customer?.assignedTo);

  const status = customerStatusConfig[customer?.status] ?? {
    text: customer?.status || "Unknown",
    tone: "gray",
  };

  const statusBadge = (
    <BaseBadge tone={status.tone} size="sm" shape="soft">
      {status.text}
    </BaseBadge>
  );

  return (
    <ViewDrawer
      open={open}
      onClose={() => {
        setActiveTab("Overview");
        onClose?.();
      }}
    >
      {customer && (
        <>
          {/* Header */}
          <div className="shrink-0 px-6 py-3 bg-white">
            <div className="flex justify-between items-center gap-2 mb-2">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("Overview");
                  onClose?.();
                }}
                className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer shrink-0"
              >
                <FiX size={18} />
              </button>

              {permissions.canAssign && (
                <div className="flex items-center gap-2 flex-wrap justify-end">
                  <button
                    type="button"
                    onClick={() => setReassignModalOpen(true)}
                    className={`${btnOutlineBase} border-sky-600 text-sky-800 hover:bg-sky-50`}
                  >
                    <FiUserCheck size={14} /> {hasOwner ? "Reassign" : "Assign"}
                  </button>
                  <span
                    title={
                      !permissions.canEdit
                        ? "You don't have permission to edit customers"
                        : undefined
                    }
                    className="inline-flex"
                  >
                    <button
                      type="button"
                      onClick={() => permissions.canEdit && onEdit?.(customer)}
                      disabled={!permissions.canEdit}
                      className={`${btnOutlineBase} ${
                        !permissions.canEdit
                          ? "border-gray-200 text-gray-400 cursor-not-allowed pointer-events-none"
                          : "border-gray-300 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <FiEdit2 size={13} /> Edit
                    </button>
                  </span>
                </div>
              )}
            </div>

            <ViewProfileHero
              record={customer}
              subtitle={`${customer.company || "—"} · ${customer.industry || "—"}`}
              badge={statusBadge}
            />

            <ViewTabs
              tabs={TABS}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-6 py-1">
            {activeTab === "Overview" && (
              <>
                <SectionBlock title="Relationship">
                  <div className="col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <UserCard user={customer.createdBy} label="Created by" />
                    {customer.assignedTo ? (
                      <UserCard
                        user={customer.assignedTo}
                        label="Account owner"
                      />
                    ) : (
                      <div className="flex items-center p-3 bg-gray-50 rounded-md">
                        <p className="text-sm text-gray-400 italic">
                          No account owner assigned
                        </p>
                      </div>
                    )}
                  </div>
                  {customer.createdFromLead ? (
                    <div className="col-span-3 rounded-md border border-amber-100 bg-amber-50/60 px-3 py-2.5 mt-2">
                      <p className="text-xs font-semibold text-amber-900 uppercase tracking-wide mb-1">
                        Source lead
                      </p>
                      <p className="text-sm text-gray-800">
                        {getDisplayName(customer.createdFromLead, {
                          includeSuffix: true,
                        })}
                        {customer.createdFromLead.company
                          ? ` · ${customer.createdFromLead.company}`
                          : ""}
                      </p>
                      {customer.createdFromLead.status && (
                        <p className="text-xs text-gray-600 mt-0.5">
                          Lead status: {customer.createdFromLead.status}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="col-span-3">
                      <p className="text-sm text-gray-400 italic">
                        Not created from a lead.
                      </p>
                    </div>
                  )}
                </SectionBlock>

                <SectionBlock title="Personal Information">
                  <Field label="First Name" value={customer.firstName} />
                  <Field label="Middle Name" value={customer.middleName} />
                  <Field label="Last Name" value={customer.lastName} />
                  <Field
                    label="Suffix"
                    value={
                      customer.suffixName === "N/A" ? "—" : customer.suffixName
                    }
                  />
                  <Field
                    label="Date of Birth"
                    value={formatDate(customer.dateOfBirth)}
                  />
                  <Field label="Sex" value={customer.sex} />
                  <Field label="Phone" value={formatPhone(customer.phone)} />
                  <Field label="Email" value={customer.email} />
                </SectionBlock>

                <SectionBlock title="Customer Information">
                  <Field label="Company" value={customer.company} />
                  <Field label="Industry" value={customer.industry} />
                  <Field label="Lead source" value={customer.leadSource} />
                  <Field label="Status" value={status.text} />
                  <Field label="Customer type" value={customer.customerType} />
                </SectionBlock>

                <SectionBlock title="Address">
                  <div className="col-span-3">
                    <Field
                      label="Full Address"
                      value={buildFullAddress(addr)}
                    />
                  </div>
                  <Field label="House No." value={addr.houseNumber} />
                  <Field label="Street" value={addr.street} />
                  <Field label="Barangay" value={addr.barangay} />
                  <Field
                    label="City / Municipality"
                    value={addr.municipality}
                  />
                  <Field label="Province" value={addr.province} />
                  <Field label="Zip Code" value={addr.zipCode} />
                  <Field label="Country" value={addr.country} />
                </SectionBlock>

                <SectionBlock title="Notes" fullWidth>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {customer.notes || "—"}
                  </p>
                </SectionBlock>

                <SectionBlock title="Record">
                  <Field
                    label="Created"
                    value={formatDateTime(customer.createdAt)}
                  />
                  <Field
                    label="Updated"
                    value={formatDateTime(customer.updatedAt)}
                  />
                </SectionBlock>
              </>
            )}

            {activeTab === "Activity" && (
              <ActivityTimeline
                activities={activities}
                loading={activitiesLoading}
              />
            )}
          </div>
        </>
      )}

      {/* Reassign modal */}
      <AssignAgentModal
        open={open && reassignModalOpen && Boolean(customer)}
        currentAssignee={customer?.assignedTo}
        salesAgents={salesAgents}
        title={hasOwner ? "Reassign customer" : "Assign account owner"}
        subtitle="Choose who owns this customer record."
        currentLabel="Current"
        selectLabel={
          hasOwner ? "New account owner (Sales Agent)" : "Account owner"
        }
        confirmLabel={hasOwner ? "Save reassignment" : "Save"}
        confirmingLabel="Saving…"
        onConfirm={(agentId) => onReassignCustomer?.(customer._id, agentId)}
        onClose={() => setReassignModalOpen(false)}
      />
    </ViewDrawer>
  );
}