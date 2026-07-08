import { useState } from "react";
import {
  ChevronRight,
  ChevronDown,
  Folder,
} from "lucide-react";

import logo from "../../assets/intellicrm_logo.svg";
import logoOnly from "../../assets/i7logo.svg";

import { useAuth } from "../../context/AuthContext";
import { getNavLinks, filterNavItems } from "../../utils/navigation";

import SidebarItem from "./SidebarItem";

export default function Sidebar() {
  const { user } = useAuth();

  const [isCollapsed, setIsCollapsed] = useState(false);

  // Module is closed by default
  const [moduleOpen, setModuleOpen] = useState(false);

  const navItems = filterNavItems(getNavLinks(user?.role), user);

  const modulePages = [
    "prospects",
    "leads",
    "clients",
    "quotations",
    "tasks",
    "meetings",
    "calls",
  ];

  // Navigation shown above Module
  const topItems = navItems.filter((item) => {
    if (!item.to) return false;

    return !modulePages.some((page) => item.to.includes(page));
  });

  // Navigation inside Module
  const moduleItems = navItems.filter((item) => {
    if (!item.to) return false;

    return modulePages.some((page) => item.to.includes(page));
  });

  return (
    <div
      className={`${
        isCollapsed ? "w-20" : "w-60"
      } bg-white text-gray-900 flex flex-col transition-all duration-300 border-r border-gray-200`}
    >
      {/* HEADER */}
      <div className="border-b-2 border-gray-200 h-23 relative flex items-center px-4">
        <img
          src={isCollapsed ? logoOnly : logo}
          alt="CRM Logo"
          className={`transition-all duration-300 ${
            isCollapsed ? "h-8" : "h-10"
          }`}
        />

        <div
          onClick={() => setIsCollapsed((prev) => !prev)}
          className={`absolute -right-4.5 -bottom-4.5 cursor-pointer bg-[#E7000B] border-4 border-gray-100 rounded-full p-1 flex items-center justify-center transition-transform duration-300 z-10 ${
            isCollapsed ? "" : "rotate-180"
          }`}
        >
          <ChevronRight size={23} color="white" strokeWidth={2.5} />
        </div>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">

        {/* TOP NAVIGATION */}
        {topItems.map((item) => (
          <SidebarItem
            key={item.to}
            item={item}
            isCollapsed={isCollapsed}
          />
        ))}

        {/* MODULE */}
          <button
            type="button"
            onClick={() => {
              if (isCollapsed) {
                setIsCollapsed(false);
                setModuleOpen(true);
              } else {
                setModuleOpen((prev) => !prev);
              }
            }}
            className={`w-full py-3 rounded-md hover:bg-gray-100 transition flex items-center ${
              isCollapsed
                ? "justify-center px-0"
                : "justify-between px-4"
            }`}
          >
            <div className="flex items-center gap-4">
              <Folder size={20} />
              {!isCollapsed && <span>Modules</span>}
            </div>

            {!isCollapsed &&
              (moduleOpen ? (
                <ChevronDown size={18} />
              ) : (
                <ChevronRight size={18} />
              ))}
          </button>

        {/* MODULE ITEMS */}
        {moduleOpen &&
          moduleItems.map((item) => (
            <div
              key={item.to}
              className={isCollapsed ? "" : "ml-6"}
            >
              <SidebarItem
                item={item}
                isCollapsed={isCollapsed}
              />
            </div>
          ))}
      </nav>
    </div>
  );
}