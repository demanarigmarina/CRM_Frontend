import { useState, useMemo, useRef, useCallback } from "react";
import { FaPlus } from "react-icons/fa";
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
import { useCustomers } from "./hooks/useCustomers";
import { useCustomerForm } from "./hooks/useCustomerForm";
import { useUsers } from "../users/hooks/useUsers";

import CustomerTable from "./CustomerTable";
import CustomerForm from "./CustomerForm";
import CustomerView from "./CustomerView";

const STATUS_OPTIONS = ["Active", "Inactive", "Lost"].map((s) => ({
  label: s,
  value: s,
}));

const TYPE_OPTIONS = ["Individual", "Business"].map((s) => ({
  label: s,
  value: s,
}));

export default function CustomersPage() {
  const permissions = usePermissions("customers");
  const { user: currentUser } = useAuth();
  const isCurrentAgent = currentUser.role === "Sales Agent";

  const { users: salesAgents = [] } = useUsers({
    skip: !permissions.canAssign,
    mode: "assignable",
    resource: "customer",
  });

  const [viewingCustomer, setViewingCustomer] = useState(null);
  const [viewPaneOpen, setViewPaneOpen] = useState(false);
  const closeTimerRef = useRef(null);

  const openViewPane = (customer) => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setViewingCustomer(customer);
    setViewPaneOpen(true);
  };

  const closeViewPane = () => {
    setViewPaneOpen(false);
    closeTimerRef.current = setTimeout(() => setViewingCustomer(null), 300);
  };

  const syncViewingCustomer = (customerId, updated) => {
    if (updated && viewingCustomer?._id === customerId)
      setViewingCustomer((prev) => ({ ...prev, ...updated }));
  };

  const {
    customers = [],
    loading,
    createCustomer,
    updateCustomer,
    assignCustomer,
    updateCustomerStatus,
  } = useCustomers();

  const {
    formData,
    addressCodes,
    avatar,
    preview,
    showSidePane,
    editingCustomer,
    handleChange,
    handleAddressSelect,
    handleAvatarChange,
    clearAvatar,
    openCreateSidePane,
    openEditSidePane,
    closeSidePane,
  } = useCustomerForm();

  // Filters
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState(null);
  const [filterType, setFilterType] = useState(null);
  const [filterAssigned, setFilterAssigned] = useState(null);

  const clearAllFilters = useCallback(() => {
    setFilterStatus(null);
    setFilterType(null);
    setFilterAssigned(null);
  }, []);

  const {
    filterOpen,
    setFilterOpen,
    filterRef,
    activeFilterCount,
    clearAllFilters: handleClear,
  } = useFilterPopover(
    { filterStatus, filterType, filterAssigned },
    clearAllFilters,
  );

  const agentFilterOptions = useMemo(() => {
    const uniqueAgents = new Map();
    customers.forEach((c) => {
      if (c.assignedTo) uniqueAgents.set(c.assignedTo._id, c.assignedTo);
    });
    return Array.from(uniqueAgents.values()).map((u) => ({
      label: getDisplayName(u, { includeSuffix: true }),
      value: u._id,
    }));
  }, [customers]);

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const fullName = getDisplayName(customer, {
        includeMiddleInitial: true,
        includeSuffix: true,
      }).toLowerCase();
      const q = search.toLowerCase();
      return (
        (!q ||
          fullName.includes(q) ||
          customer.email?.toLowerCase().includes(q) ||
          customer.company?.toLowerCase().includes(q) ||
          customer.phone?.toLowerCase().includes(q)) &&
        (!filterStatus || customer.status === filterStatus) &&
        (!filterType || customer.customerType === filterType) &&
        (!filterAssigned || customer.assignedTo?._id === filterAssigned)
      );
    });
  }, [customers, search, filterStatus, filterType, filterAssigned]);

  const handleReassignCustomer = async (customerId, assignedTo) => {
    const updated = await assignCustomer(customerId, assignedTo);
    syncViewingCustomer(customerId, updated);
    return Boolean(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = editingCustomer
      ? await updateCustomer(editingCustomer, formData, avatar)
      : await createCustomer(formData, avatar);
    if (result) closeSidePane();
  };

  const handleUpdateStatus = async (customerid, newStatus) => {
    await updateCustomerStatus(customerid, newStatus);
  };

  return (
    <PageBase>
      <div className="flex items-center justify-between mb-4">
        <PageHeader
          title="Customers"
          subtitle={
            isCurrentAgent
              ? "Customers assigned to you or converted from your leads"
              : "View and manage customers across your team"
          }
        />

        <PageToolbar
          searchValue={search}
          onSearchChange={(e) => setSearch(e.target.value)}
          searchPlaceholder="Search customers..."
          filterSlot={
            <FilterPopover
              filterRef={filterRef}
              filterOpen={filterOpen}
              onToggle={() => setFilterOpen((p) => !p)}
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
                    filterStatus
                      ? { label: filterStatus, value: filterStatus }
                      : null
                  }
                  onChange={(opt) => setFilterStatus(opt?.value || null)}
                />
              </div>

              <div>
                <p className="text-xs text-gray-400 mb-1">Customer Type</p>
                <Select
                  {...getSelectProps({ variant: "filter" })}
                  placeholder="All types"
                  options={TYPE_OPTIONS}
                  value={
                    filterType ? { label: filterType, value: filterType } : null
                  }
                  onChange={(opt) => setFilterType(opt?.value || null)}
                />
              </div>

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
            </FilterPopover>
          }
              actionButton={
              <button
                type="button"
                onClick={() => {
                  setEditingProspect(null);
                  setOpenForm(true);
                }}
                className="bg-red-500 hover:bg-red-600 text-white h-12 px-6 rounded-md cursor-pointer min-w-[175px]"
              >
                <span className="flex items-center justify-center gap-2 text-sm whitespace-nowrap font-medium">
                  <FaPlus size={11} />
                  Add Prospect
                </span>
              </button>
            }
        />
      </div>

      <PageContentState>
        <CustomerTable
          customers={filteredCustomers}
          permissions={permissions}
          onView={openViewPane}
          onEdit={permissions.canEdit ? openEditSidePane : undefined}
          onUpdateStatus={handleUpdateStatus}
          isLoading={loading}
        />
      </PageContentState>

      <CustomerView
        open={viewPaneOpen}
        customer={viewingCustomer}
        salesAgents={salesAgents}
        permissions={permissions}
        onClose={closeViewPane}
        onEdit={(customer) => {
          closeViewPane();
          openEditSidePane(customer);
        }}
        onReassignCustomer={handleReassignCustomer}
      />

      {permissions.canCreate && (
        <CustomerForm
          open={showSidePane}
          editingCustomer={editingCustomer}
          formData={formData}
          salesAgents={salesAgents}
          addressCodes={addressCodes}
          permissions={permissions}
          preview={preview}
          loading={loading}
          onChange={handleChange}
          onAddressSelect={handleAddressSelect}
          onAvatarChange={handleAvatarChange}
          onClearAvatar={clearAvatar}
          onSubmit={handleSubmit}
          onClose={closeSidePane}
          onCancel={closeSidePane}
        />
      )}
    </PageBase>
  );
}
