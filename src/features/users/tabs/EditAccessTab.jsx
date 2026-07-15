import { ChevronDown, Save } from "lucide-react";
import { getDisplayName } from "../../../utils/name";
import useUserAccess from "../hooks/useUserAccess";
import AccessCard from "../components/AccessCard";
import RoleTemplateSelect from "../components/RoleTemplateSelect";

export default function EditAccessTab() {
  const {
    users,
    selectedUserId,
    selectedUser,
    setSelectedUser,
    roleTemplate,
    setRoleTemplate,
    selectedAccess,
    unselectedAccess,
    toggleAccess,
    saveAccess,
    cancelChanges,
    saving,
  } = useUserAccess();

  const teamName = typeof selectedUser?.team === "string"
    ? selectedUser.team
    : selectedUser?.team?.name || "—";

  return (
    <div className="flex h-full min-h-0 flex-col pt-1">
      {/* HEADER & DROPDOWNS SELECTION AREA */}
      <div className="grid shrink-0 grid-cols-1 gap-2.5 lg:grid-cols-[1.3fr_1fr_.8fr] lg:items-end">
        <div className="pb-0.5">
          <h2 className="text-base font-semibold leading-tight text-slate-800">
            Edit User Access &amp; Default Role Access
          </h2>
          <p className="mt-0.5 text-[11px] leading-4 text-slate-400">
            Manage what this user can see and access in the system.
          </p>
        </div>

        {/* SELECT USER DROPDOWN */}
        <div>
          <label className="block text-[11px] font-medium text-slate-600">
            Select User
          </label>

          <div className="relative mt-1">
            <select
              value={selectedUserId}
              onChange={(event) => setSelectedUser(event.target.value)}
              className="h-9 w-full appearance-none rounded-md border border-slate-300 bg-white px-3 pr-8 text-[11px] text-slate-700 outline-none transition focus:border-red-400 focus:ring-1 focus:ring-red-100"
            >
              {/* 1. BLANK INTERFACE PLACEHOLDER HAKBANG */}
              <option value="">-- Select a User --</option>
              
              {users.map((user) => (
                <option key={user.employeeId} value={user.employeeId}>
                  {getDisplayName(user, { includeMiddleInitial: true, includeSuffix: true })} ({user.employeeId})
                </option>
              ))}
            </select>
              
            <ChevronDown
              size={14}
              className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500"
            />
          </div>
        </div>

        {/* ROLE TEMPLATE DROPDOWN */}
        <RoleTemplateSelect 
          value={roleTemplate} 
          onChange={setRoleTemplate} 
          disabled={!selectedUserId} // Naka-disable kapag walang user na napili
        />
      </div>

      {/* 2. CONDITIONAL RENDERING NG MGA METADATA AT TILES */}
      {selectedUser ? (
        <>
          <div className="mt-2.5 grid min-h-0 flex-1 grid-cols-1 gap-3 lg:grid-cols-[250px_minmax(0,1fr)]">
            {/* USER PROFILE INFO PANEL */}
            <section className="self-start rounded-lg border border-gray-200 bg-white p-4">
              <h3 className="border-b border-gray-200 pb-3 text-sm font-semibold text-slate-800">
                User Information
              </h3>

              <dl className="text-xs">
                <div className="flex items-center justify-between gap-3 border-b border-gray-200 py-3">
                  <dt className="shrink-0 text-slate-500">Full Name</dt>
                  <dd className="truncate text-right font-medium text-slate-700">
                    {getDisplayName(selectedUser, { includeMiddleInitial: true, includeSuffix: true })}
                  </dd>
                </div>

                <div className="flex items-center justify-between gap-3 border-b border-gray-200 py-3">
                  <dt className="shrink-0 text-slate-500">Email Address</dt>
                  <dd className="truncate text-right text-slate-700">
                    {selectedUser?.email || "—"}
                  </dd>
                </div>

                <div className="flex items-center justify-between gap-3 border-b border-gray-200 py-3">
                  <dt className="shrink-0 text-slate-500">Role</dt>
                  <dd className="truncate text-right text-slate-700">
                    {selectedUser?.role || "—"}
                  </dd>
                </div>

                <div className="flex items-center justify-between gap-3 border-b border-gray-200 py-3">
                  <dt className="shrink-0 text-slate-500">Team</dt>
                  <dd className="truncate text-right text-slate-700">
                    {teamName}
                  </dd>
                </div>

                <div className="flex items-center justify-between gap-3 pt-3">
                  <dt className="shrink-0 text-slate-500">Status</dt>
                  <dd>
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                      selectedUser?.status === "Active"
                        ? "bg-green-100 text-green-600"
                        : "bg-gray-100 text-gray-500"
                    }`}>
                      {selectedUser?.status || "Inactive"}
                    </span>
                  </dd>
                </div>
              </dl>
            </section>

            {/* DYNAMIC PERMISSIONS ACCESS TILES */}
            <div className="min-h-0 overflow-auto rounded-lg border border-gray-200 bg-white">
              <AccessCard
                title="Selected Access"
                items={selectedAccess}
                selected
                onClick={toggleAccess}
              />

              <div className="border-t border-gray-200">
                <AccessCard
                  title="Unselected Access"
                  items={unselectedAccess}
                  onClick={toggleAccess}
                />
              </div>
            </div>
          </div>

          {/* ACTION BUTTONS (MESSAGES CONTROLS) */}
          <div className="mt-2.5 flex shrink-0 justify-end gap-2.5">
            <button
              type="button"
              onClick={cancelChanges}
              disabled={saving}
              className="h-9 min-w-[100px] rounded-md border border-gray-300 bg-white px-4 text-[11px] font-semibold text-slate-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={saveAccess}
              disabled={saving}
              className="flex h-9 min-w-[155px] items-center justify-center gap-2 rounded-md bg-red-600 px-4 text-[11px] font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save size={14} />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </>
      ) : (
        /* BLANK STATE PLACEHOLDER KAPAG WALANG USER NA NAKASELECT */
        <div className="mt-2.5 flex flex-1 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50/50 p-8 text-center">
          <div className="max-w-sm space-y-1">
            <p className="text-xs font-medium text-slate-600">No User Selected</p>
            <p className="text-[11px] text-slate-400">
              Please choose a staff record from the dropdown menu to adjust their roles and permission modules.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}