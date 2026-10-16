import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";
import AdminSidebar from "./AdminSidebar";

function AdminLayout() {
const [sidebarOpen, setSidebarOpen] = useState(false);

return ( <div className="min-h-screen bg-[#f8faf9] text-slate-800"> <AdminSidebar
     sidebarOpen={sidebarOpen}
     setSidebarOpen={setSidebarOpen}
   />

  <main className="min-h-screen min-w-0 lg:ml-64">
    <AdminNavbar setSidebarOpen={setSidebarOpen} />

    <div className="min-w-0">
      <Outlet />
    </div>
  </main>
</div>

);
}

export default AdminLayout;
