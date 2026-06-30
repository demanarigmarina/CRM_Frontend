import { BASE_NAV, ROLE_ROUTES, ROLE_BASE_PATH } from "../constants/navigation";
import { isTeamlessAgent, isTeamlessManager } from "./teamAccess";

export const getNavLinks = (role) => {
  const basePath = ROLE_BASE_PATH[role] || "";

  return (ROLE_ROUTES[role] || [])
    .map((key) => {
      const item = BASE_NAV[key];

      // Skip invalid keys
      if (!item) return null;

      // Section header (Module)
      if (item.type === "group") {
        return item;
      }

      return {
        to: key === "dashboard" ? basePath : `${basePath}/${key}`,
        label: item.label,
        Icon: item.icon.default,
        ActiveIcon: item.icon.active,
      };
    })
    .filter(Boolean);
};

export const filterNavItems = (items, user) => {
  if (isTeamlessAgent(user)) {
    return items.filter((i) => i.to === "/sales-agent");
  }

  if (isTeamlessManager(user)) {
    return items.filter(
      (i) =>
        i.to === "/sales-manager" ||
        i.to === "/sales-manager/team"
    );
  }

  return items;
};