import {
  LayoutDashboard,
  Users,
  Network,
  UsersRound,
  Magnet,
  UserCheck,
  Handshake,
  BarChart2,
  ListTodo,
  Briefcase,
  CalendarDays,
  Phone,
  FileText,
} from "lucide-react";

const createIcon = (Icon) => ({
  default: Icon,
  active: Icon,
});

export const BASE_NAV = {
  dashboard: {
    icon: createIcon(LayoutDashboard),
    label: "Dashboard",
  },

  users: {
    icon: createIcon(Users),
    label: "Users",
  },

  teams: {
    icon: createIcon(Network),
    label: "Teams",
  },

  team: {
    icon: createIcon(UsersRound),
    label: "My Team",
  },

  reports: {
    icon: createIcon(BarChart2),
    label: "Reports",
  },

  // Module Header
  module: {
    label: "Module",
    type: "group",
  },

  prospects: {
    icon: createIcon(Briefcase),
    label: "Prospects",
  },

  leads: {
    icon: createIcon(Magnet),
    label: "Leads",
  },

  customers: {
    icon: createIcon(UserCheck),
    label: "Customers",
  },

  quotations: {
    icon: createIcon(FileText),
    label: "Quotations",
  },

  tasks: {
    icon: createIcon(ListTodo),
    label: "Tasks",
  },

  meetings: {
    icon: createIcon(CalendarDays),
    label: "Meetings",
  },

  calls: {
    icon: createIcon(Phone),
    label: "Calls",
  },
};

export const ROLE_ROUTES = {
  Admin: [
    "dashboard",

    "users",
    "teams",

    "reports",

    "module",

    "prospects",
    "leads",
    "customers",
    "quotations",
    "tasks",
    "meetings",
    "calls",
  ],

  "Sales Manager": [
    "dashboard",

    "team",

    "module",

    "prospects",
    "leads",
    "customers",
    "quotations",
    "tasks",
    "meetings",
    "calls",
  ],

  "Sales Agent": [
    "dashboard",

    "module",

    "prospects",
    "leads",
    "customers",
    "quotations",
    "tasks",
    "meetings",
    "calls",
  ],

  "Support Staff": [
    "dashboard",
  ],
};

export const ROLE_BASE_PATH = {
  Admin: "/admin",
  "Sales Manager": "/sales-manager",
  "Sales Agent": "/sales-agent",
  "Support Staff": "/support-staff",
};