import {BASE_NAV,ROLE_ROUTES,ROLE_BASE_PATH} from "../constants/navigation";
import {isTeamlessAgent,isTeamlessManager} from "./teamAccess";

const PERMISSION_BY_KEY={
  dashboard:"Dashboard",
  users:"Users",
  teams:"Teams",
  team:"Teams",
  prospects:"Prospects",
  leads:"Leads",
  clients:"Clients",
  quotations:"Quotations",
  tasks:"Tasks",
  meetings:"Meetings",
  calls:"Calls",
  reports:"Reports",
};

const normalize=value=>String(value||"").trim().toLowerCase();

export const hasPermission=(user,permission)=>{
  if(!user)return false;

  if(Array.isArray(user.permissions)){
    return user.permissions.some(
      item=>normalize(item)===normalize(permission),
    );
  }

  if(permission==="Settings"){
    return user.role!=="Support Staff";
  }

  return true;
};

const removeEmptyGroups=items=>items.filter((item,index,list)=>{
  if(item.type!=="group")return true;
  return list.slice(index+1).some(next=>next.type!=="group");
});

const applyTeamRestrictions=(items,user)=>{
  if(isTeamlessAgent(user)){
    const allowedPaths=new Set([
      "/sales-agent",
      "/sales-agent/calls",
    ]);

    return items.filter(item=>
      item.type==="group"||allowedPaths.has(item.to),
    );
  }

  if(isTeamlessManager(user)){
    const allowedPaths=new Set([
      "/sales-manager",
      "/sales-manager/team",
      "/sales-manager/calls",
    ]);

    return items.filter(item=>
      item.type==="group"||allowedPaths.has(item.to),
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
        permission:PERMISSION_BY_KEY[key]||item.label,
        to:key==="dashboard"?basePath:`${basePath}/${key}`,
        label:item.label,
        Icon:item.icon.default,
        ActiveIcon:item.icon.active,
      };
    })
    .filter(Boolean);
};

export const filterNavItems=(items,user)=>{
  const permissionFilteredItems=Array.isArray(user?.permissions)
    ?items.filter(item=>
      item.type==="group"||
      hasPermission(user,item.permission||item.label),
    )
    :items;

  return removeEmptyGroups(
    applyTeamRestrictions(permissionFilteredItems,user),
  );
};