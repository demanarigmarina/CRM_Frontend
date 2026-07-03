import { Routes, Route } from "react-router-dom";

import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

import AppLayout from "./layouts/AppLayout";
import AuthLayout from "./layouts/AuthLayout";

import TeamRequiredRoute from "./components/TeamRequiredRoute";

// System pages
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";

// Admin pages
import AdminIndex from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/Users";
import AdminTeams from "./pages/admin/Teams";
import AdminLeads from "./pages/admin/Leads";
import AdminClients from "./pages/admin/Clients";
import AdminQuotations from "./pages/admin/Quotations";
import AdminReports from "./pages/admin/Reports";
import AdminTasks from "./pages/admin/Tasks";
import AdminProspects from "./pages/admin/Prospects";
import AdminMeetings from "./pages/admin/Meetings";
import AdminCalls from "./pages/admin/Calls";
import AdminSettings from "./pages/admin/Settings";

// Sales Manager pages
import SalesManagerIndex from "./pages/salesManager/Dashboard";
import TeamOverview from "./pages/salesManager/TeamOverview";
import SalesManagerLeads from "./pages/salesManager/Leads";
import SalesManagerClients from "./pages/salesManager/Clients";
import SalesManagerQuotations from "./pages/salesManager/Quotations";
import SalesManagerTasks from "./pages/salesManager/Tasks";
import SalesManagerProspects from "./pages/salesManager/Prospects";
import SalesManagerMeetings from "./pages/salesManager/Meetings";
import SalesManagerCalls from "./pages/salesManager/Calls";
import SalesManagerSettings from "./pages/salesManager/Settings";

// Sales Agent pages
import SalesAgentIndex from "./pages/salesAgent/Dashboard";
import SalesAgentTeamRequired from "./pages/salesAgent/TeamRequired";
import SalesAgentLeads from "./pages/salesAgent/Leads";
import SalesAgentClients from "./pages/salesAgent/Clients";
import SalesAgentQuotations from "./pages/salesAgent/Quotations";
import SalesAgentTasks from "./pages/salesAgent/Tasks";
import SalesAgentProspects from "./pages/salesAgent/Prospects";
import SalesAgentMeetings from "./pages/salesAgent/Meetings";
import SalesAgentCalls from "./pages/salesAgent/Calls";
import SalesAgentSettings from "./pages/salesAgent/Settings";

// Support Staff pages
import SupportStaffIndex from "./pages/supportStaff/Dashboard";

import PrivateRoute from "./components/PrivateRoute";
import SessionRedirect from "./components/SessionRedirect";

function App() {
  return (
    <Routes>
      <Route path="/" element={<SessionRedirect />} />

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>

      <Route path="/unauthorized" element={<Unauthorized />} />

      <Route element={<PrivateRoute roles={["Admin"]} />}>
        <Route element={<AppLayout />}>
          {/* ADMIN */}
          <Route path="/admin" element={<AdminIndex />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/teams" element={<AdminTeams />} />
          <Route path="/admin/leads" element={<AdminLeads />} />
          <Route path="/admin/clients" element={<AdminClients />} />
          <Route path="/admin/quotations" element={<AdminQuotations />}/>
          <Route path="/admin/quotations" element={<AdminQuotations />} />
          <Route path="/admin/tasks" element={<AdminTasks />} />
          <Route path="/admin/prospects" element={<AdminProspects />} />
          <Route path="/admin/meetings" element={<AdminMeetings />} />
          <Route path="/admin/calls" element={<AdminCalls />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          <Route path="/admin/reports" element={<AdminReports />} />
        </Route>
      </Route>

      {/* SALES MANAGER */}
      <Route element={<PrivateRoute roles={["Sales Manager"]} />}>
        <Route element={<AppLayout />}>
          <Route path="/sales-manager" element={<SalesManagerIndex />} />
          <Route path="/sales-manager/team" element={<TeamOverview />} />
          <Route element={<TeamRequiredRoute />}>
            <Route
              path="/sales-manager/leads"
              element={<SalesManagerLeads />}
            />
            <Route
              path="/sales-manager/clients"
              element={<SalesManagerClients />}
            />
            <Route
            path="/sales-manager/quotations"
            element={<SalesManagerQuotations />}
            />
            <Route
              path="/sales-manager/quotations"
              element={<SalesManagerQuotations />}
            />
            <Route
              path="/sales-manager/tasks"
              element={<SalesManagerTasks />}
            />
            <Route
             path="/sales-manager/prospects"
             element={<SalesManagerProspects />}
            />

            <Route
              path="/sales-manager/meetings"
              element={<SalesManagerMeetings />}
            />

            <Route
              path="/sales-manager/calls"
              element={<SalesManagerCalls />}
            />
            <Route
              path="/sales-manager/settings"
              element={<SalesManagerSettings />}
            />
          </Route>
        </Route>
      </Route>

      {/* SALES AGENT */}
      <Route element={<PrivateRoute roles={["Sales Agent"]} />}>
        <Route element={<AppLayout />}>
          <Route 
          path="/sales-agent"
           element={<SalesAgentIndex />} 
          />
          <Route
            path="/sales-agent/team-required"
            element={<SalesAgentTeamRequired />}
          />
          <Route element={<TeamRequiredRoute />}>
            <Route 
             path="/sales-agent/leads"
             element={<SalesAgentLeads />} 
            />
            <Route
              path="/sales-agent/clients"
              element={<SalesAgentClients />}
            />
           <Route
              path="/sales-agent/quotations"
              element={<SalesAgentQuotations />}
             />
            <Route 
            path="/sales-agent/quotations"
             element={<SalesAgentQuotations />} 
            />
            <Route
              path="/sales-agent/prospects"
              element={<SalesAgentProspects />}
            />

            <Route
              path="/sales-agent/meetings"
              element={<SalesAgentMeetings />}
            />

            <Route
              path="/sales-agent/calls"
              element={<SalesAgentCalls />}
            />
            <Route 
              path="/sales-agent/tasks"
              element={<SalesAgentTasks />} 
            />
            <Route
              path="/sales-agent/settings"
              element={<SalesAgentSettings />}
            />
          </Route>
        </Route>
      </Route>

      <Route element={<PrivateRoute roles={["Support Staff"]} />}>
        <Route element={<AppLayout />}>
          {/* SUPPORT STAFF */}
          <Route path="/support-staff" element={<SupportStaffIndex />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
