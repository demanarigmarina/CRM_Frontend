import{
  BASE_NAV,
  ROLE_ROUTES,
  ROLE_BASE_PATH,
}from"../constants/navigation";
import{
  isTeamlessAgent,
  isTeamlessManager,
}from"./teamAccess";

const PERMISSION_BY_KEY={
  dashboard:"Dashboard",
  users:"Settings",
  teams:"Teams",
  team:"Teams",
  reports:"Reports",
  prospects:"Prospects",
  leads:"Leads",
  clients:"Clients",
  quotations:"Quotations",
  tasks:"Tasks",
  meetings:"Meetings",
  calls:"Calls",
};

const normalize=value=>
  String(value||"")
    .trim()
    .toLowerCase();

const getSavedPermissions=user=>
  Array.isArray(user?.permissions)
    ?user.permissions
        .map(permission=>String(permission||"").trim())
        .filter(Boolean)
    :[];

export const hasPermission=(user,permission)=>{
  if(!user||!permission)return false;

  /*
   * Users without customized access keep the normal
   * navigation supplied by their role.
   */
  if(user.permissionsCustomized!==true){
    if(permission==="Settings"){
      return user.role!=="Support Staff";
    }

    return true;
  }

  /*
   * Customized users only receive permissions that were
   * explicitly selected in Edit Access.
   */
  return getSavedPermissions(user).some(
    savedPermission=>
      normalize(savedPermission)===
      normalize(permission),
  );
};

const removeEmptyGroups=items=>
  items.filter((item,index,list)=>{
    if(item.type!=="group"){
      return true;
    }

    const nextGroupIndex=list.findIndex(
      (candidate,candidateIndex)=>
        candidateIndex>index&&
        candidate.type==="group",
    );

    const sectionEnd=
      nextGroupIndex===-1
        ?list.length
        :nextGroupIndex;

    return list
      .slice(index+1,sectionEnd)
      .some(candidate=>
        candidate.type!=="group",
      );
  });

const applyTeamRestrictions=(items,user)=>{
  if(isTeamlessAgent(user)){
    return items.filter(
      item=>
        item.type==="group"||
        item.to==="/sales-agent",
    );
  }

  if(isTeamlessManager(user)){
    return items.filter(
      item=>
        item.type==="group"||
        item.to==="/sales-manager"||
        item.to==="/sales-manager/team",
    );
  }

  return items;
};

export const getNavLinks=role=>{
  const basePath=ROLE_BASE_PATH[role]||"";

  return(ROLE_ROUTES[role]||[])
    .map(key=>{
      const item=BASE_NAV[key];

      if(!item)return null;

      if(item.type==="group"){
        return{
          ...item,
          key,
        };
      }

      return{
        key,
        permission:
          PERMISSION_BY_KEY[key]||
          item.label,
        to:
          key==="dashboard"
            ?basePath
            :`${basePath}/${key}`,
        label:item.label,
        Icon:item.icon.default,
        ActiveIcon:item.icon.active,
      };
    })
    .filter(Boolean);
};

export const filterNavItems=(items,user)=>{
  const permissionFiltered=items.filter(item=>{
    if(item.type==="group"){
      return true;
    }

    return hasPermission(
      user,
      item.permission||item.label,
    );
  });

  return removeEmptyGroups(
    applyTeamRestrictions(
      permissionFiltered,
      user,
    ),
  );
};