import {Outlet} from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/sidebar/Sidebar";

export default function AppLayout(){
  return(
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <Sidebar/>
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden px-5 py-4">
        <div className="shrink-0"><Navbar/></div>
        <main className="min-h-0 min-w-0 flex-1 overflow-hidden">
          <Outlet/>
        </main>
      </div>
    </div>
  );
}