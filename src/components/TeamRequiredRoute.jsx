import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { isTeamlessAgent, isTeamlessManager } from "../utils/teamAccess";

export default function TeamRequiredRoute() {
  const { user } = useAuth();

  if (isTeamlessAgent(user)) {
    return <Navigate to="/sales-agent/team-required" replace />;
  }

  if (isTeamlessManager(user)) {
    return <Navigate to="/sales-manager/team" replace />;
  }

  return <Outlet />;
}
