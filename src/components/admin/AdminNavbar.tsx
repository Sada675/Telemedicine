import { useLocation, useNavigate } from "react-router-dom";
import { Bell, Menu, UserRound } from "lucide-react";

type AdminNavbarProps = {
setSidebarOpen: (open: boolean) => void;
};

const pageInfo: Record<string, { title: string; description: string }> = {
"/admin-dashboard": {
title: "Dashboard Overview",
description: "Welcome back! Here is your platform overview.",
},
"/manage-doctors": {
title: "Manage Doctors",
description: "View and manage doctor profiles and accounts.",
},
"/manage-patients": {
title: "Manage Patients",
description: "View and manage registered patient accounts.",
},
"/manage-appointments": {
title: "Manage Appointments",
description: "Review and manage appointment requests.",
},
"/notifications": {
title: "Notifications",
description: "Stay updated with platform activity.",
},
"/admin-settings": {
title: "Admin Settings",
description: "Manage your administrator preferences.",
},
};

function AdminNavbar({ setSidebarOpen }: AdminNavbarProps) {
const location = useLocation();
const navigate = useNavigate();

const currentPage = pageInfo[location.pathname] ?? {
title: "Admin Dashboard",
description: "Manage your telemedicine platform.",
};

return ( <header className="sticky top-0 z-30 flex min-h-[70px] w-full items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-4 shadow-sm sm:px-6 lg:px-8">
{/* Left Side */} <div className="flex min-w-0 items-center gap-3 sm:gap-4">
<button
type="button"
onClick={() => setSidebarOpen(true)}
className="shrink-0 rounded-lg p-2 text-slate-600 transition hover:bg-blue-50 hover:text-[#0B63CE] lg:hidden"
aria-label="Open sidebar"
> <Menu size={23} /> </button>

    <div className="min-w-0">
      <h2 className="truncate text-lg font-bold leading-tight text-[#183b3b] sm:text-xl">
        {currentPage.title}
      </h2>

      <p className=" text-xs leading-relaxed text-slate-500 sm:text-sm">
        {currentPage.description}
      </p>
    </div>
  </div>

  {/* Right Side */}
  <div className="flex shrink-0 items-center gap-3 sm:gap-5">
    <button
      type="button"
      onClick={() => navigate("/notifications")}
      aria-label="Open notifications"
      className="relative rounded-xl border border-slate-200 p-2.5 text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-[#0B63CE]"
    >
      <Bell size={20} />

      <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
    </button>

    <div className="hidden items-center gap-3 border-l border-slate-200 pl-4 sm:flex sm:pl-5">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e5f4f2] text-[#183b3b] ring-1 ring-[#d5ebe6]">
        <UserRound size={21} />
      </div>

      <div className="hidden flex-col gap-1 md:flex">
        <p className="text-sm font-semibold leading-tight text-slate-800">
          Administrator
        </p>

        <p className="text-xs leading-tight text-slate-500">
          Admin Account
        </p>
      </div>
    </div>
  </div>
</header>

);
}

export default AdminNavbar;
