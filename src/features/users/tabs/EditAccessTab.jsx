import {RefreshCw,Save} from "lucide-react";
import Select from "react-select";
import {getDisplayName} from "../../../utils/name";
import {getSelectProps} from "../../../components/select/selectConfig";
import useUserAccess from "../hooks/useUserAccess";
import AccessCard from "../components/AccessCard";
import RoleTemplateSelect from "../components/RoleTemplateSelect";

export default function EditAccessTab(){
  const{
    users,
    roles,
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
    resetToTemplate,
    loading,
    accessLoading,
    saving,
    hasChanges,
  }=useUserAccess();

  const busy=loading||accessLoading||saving;
  const normalizedStatus=String(selectedUser?.status||"inactive").toLowerCase();
  const isActive=normalizedStatus==="active";

  const teamName=typeof selectedUser?.team==="string"
    ?selectedUser.team
    :selectedUser?.team?.name||"—";

  const userOptions=users.map(user=>({
    value:user.employeeId,
    label:`${getDisplayName(user,{
      includeMiddleInitial:true,
      includeSuffix:true,
    })} (${user.employeeId})`,
  }));

  const selectedUserOption=userOptions.find(
    option=>option.value===selectedUserId,
  )||null;

  const userSelectProps=getSelectProps({
    isSearchable:true,
  });

  const userSelectStyles={
    ...(userSelectProps.styles||{}),
    control:(base,state)=>({
      ...base,
      minHeight:36,
      height:36,
      borderColor:state.isFocused?"#f87171":"#cbd5e1",
      boxShadow:state.isFocused?"0 0 0 1px #fee2e2":"none",
      fontSize:11,
      cursor:state.isDisabled?"not-allowed":"pointer",
      "&:hover":{
        borderColor:state.isFocused?"#f87171":"#94a3b8",
      },
    }),
    valueContainer:base=>({
      ...base,
      height:34,
      padding:"0 10px",
    }),
    input:base=>({
      ...base,
      margin:0,
      padding:0,
    }),
    singleValue:base=>({
      ...base,
      margin:0,
      color:"#334155",
    }),
    placeholder:base=>({
      ...base,
      margin:0,
      color:"#94a3b8",
    }),
    indicatorsContainer:base=>({
      ...base,
      height:34,
    }),
    dropdownIndicator:base=>({
      ...base,
      padding:7,
    }),
    clearIndicator:base=>({
      ...base,
      padding:7,
    }),
    menuPortal:base=>({
      ...base,
      zIndex:9999,
    }),
    menuList:base=>({
      ...base,
      maxHeight:220,
      overflowY:"auto",
    }),
    option:(base,state)=>({
      ...base,
      fontSize:11,
      cursor:"pointer",
      backgroundColor:state.isSelected
        ?"#ef4444"
        :state.isFocused
          ?"#fef2f2"
          :"white",
      color:state.isSelected?"white":"#334155",
    }),
  };

  if(loading){
    return(
      <div className="flex h-full min-h-[300px] items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <RefreshCw size={16} className="animate-spin"/>
          Loading access settings...
        </div>
      </div>
    );
  }

  return(
    <div className="flex h-full min-h-0 flex-col pt-1">
      <div className="grid shrink-0 grid-cols-1 gap-2.5 lg:grid-cols-[1.3fr_.8fr_.8fr] lg:items-end">
        <div className="pb-0.5">
          <h2 className="text-base font-semibold leading-tight text-slate-800">
            Edit User Access &amp; Default Role Access
          </h2>

          <p className="mt-0.5 text-[11px] leading-4 text-slate-400">
            Manage what this user can see and access in the system.
          </p>
        </div>

        <div className="min-w-0">
          <label className="block text-[11px] font-medium text-slate-600">
            Select User
          </label>

          <div className="relative mt-1 w-full">
            <Select
              {...userSelectProps}
              styles={userSelectStyles}
              options={userOptions}
              value={selectedUserOption}
              onChange={option=>{
                if(option?.value){
                  void setSelectedUser(option.value);
                }
              }}
              placeholder={users.length?"Search or select a user...":"No users available"}
              noOptionsMessage={()=>"No users found"}
              isDisabled={busy||users.length===0}
              isLoading={accessLoading}
              isClearable={false}
              maxMenuHeight={220}
              menuPlacement="auto"
              menuShouldScrollIntoView={false}
              menuPortalTarget={
                typeof document!=="undefined"
                  ?document.body
                  :undefined
              }
            />
          </div>
        </div>

        <RoleTemplateSelect
          value={roleTemplate}
          onChange={setRoleTemplate}
          roles={roles}
          disabled={busy||!selectedUser}
        />
      </div>

      <div className="mt-2.5 grid min-h-0 flex-1 grid-cols-1 gap-3 lg:grid-cols-[250px_minmax(0,1fr)]">
        <section className="self-start rounded-lg border border-gray-200 bg-white p-4">
          <h3 className="border-b border-gray-200 pb-3 text-sm font-semibold text-slate-800">
            User Information
          </h3>

          <dl className="text-xs">
            <div className="flex items-center justify-between gap-3 border-b border-gray-200 py-3">
              <dt className="shrink-0 text-slate-500">Full Name</dt>
              <dd className="truncate text-right font-medium text-slate-700">
                {selectedUser
                  ?getDisplayName(selectedUser,{
                    includeMiddleInitial:true,
                    includeSuffix:true,
                  })
                  :"—"}
              </dd>
            </div>

            <div className="flex items-center justify-between gap-3 border-b border-gray-200 py-3">
              <dt className="shrink-0 text-slate-500">Employee ID</dt>
              <dd className="truncate text-right text-slate-700">
                {selectedUser?.employeeId||"—"}
              </dd>
            </div>

            <div className="flex items-center justify-between gap-3 border-b border-gray-200 py-3">
              <dt className="shrink-0 text-slate-500">Email Address</dt>
              <dd
                title={selectedUser?.email||""}
                className="max-w-[145px] truncate text-right text-slate-700"
              >
                {selectedUser?.email||"—"}
              </dd>
            </div>

            <div className="flex items-center justify-between gap-3 border-b border-gray-200 py-3">
              <dt className="shrink-0 text-slate-500">Current Role</dt>
              <dd className="truncate text-right text-slate-700">
                {selectedUser?.role||"—"}
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
                  isActive
                    ?"bg-green-100 text-green-600"
                    :"bg-gray-100 text-gray-500"
                }`}>
                  {isActive?"Active":"Inactive"}
                </span>
              </dd>
            </div>
          </dl>
        </section>

        <div className="relative min-h-0 overflow-auto rounded-lg border border-gray-200 bg-white">
          {accessLoading&&(
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/75">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <RefreshCw size={14} className="animate-spin"/>
                Loading permissions...
              </div>
            </div>
          )}

          {!selectedUser?(
            <div className="flex h-full min-h-[220px] items-center justify-center text-xs text-slate-400">
              Select a user to manage access permissions.
            </div>
          ):(
            <>
              <AccessCard
                title="Selected Access"
                items={selectedAccess}
                selected
                onClick={busy?undefined:toggleAccess}
              />

              <div className="border-t border-gray-200">
                <AccessCard
                  title="Unselected Access"
                  items={unselectedAccess}
                  onClick={busy?undefined:toggleAccess}
                />
              </div>
            </>
          )}
        </div>
      </div>

      <div className="mt-2.5 flex shrink-0 flex-wrap justify-end gap-2.5">
        <button
          type="button"
          onClick={resetToTemplate}
          disabled={busy||!selectedUser||!roleTemplate}
          className="flex h-9 min-w-[135px] items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 text-[11px] font-semibold text-slate-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw size={13}/>
          Reset Template
        </button>

        <button
          type="button"
          onClick={cancelChanges}
          disabled={busy||!hasChanges}
          className="h-9 min-w-[100px] rounded-md border border-gray-300 bg-white px-4 text-[11px] font-semibold text-slate-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={saveAccess}
          disabled={busy||!selectedUser||!hasChanges}
          className="flex h-9 min-w-[155px] items-center justify-center gap-2 rounded-md bg-red-600 px-4 text-[11px] font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving
            ?<RefreshCw size={14} className="animate-spin"/>
            :<Save size={14}/>}

          {saving?"Saving...":"Save Changes"}
        </button>
      </div>
    </div>
  );
}