import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Stethoscope,
  Users,
  CalendarDays,
  Bell,
  Settings,
  LogOut,
  X,
  UserRound,
  Plus,
} from "lucide-react";

type AdminSidebarProps = {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
};

const navigation = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    path: "/admin-dashboard",
  },
  {
    name: "Manage Doctors",
    icon: Stethoscope,
    path: "/manage-doctors",
  },
  {
    name: "Manage Patients",
    icon: Users,
    path: "/manage-patients",
  },
  {
    name: "Appointments",
    icon: CalendarDays,
    path: "/manage-appointments",
  },
  {
    name: "Notifications",
    icon: Bell,
    path: "/notifications",
  },
  {
    name: "Settings",
    icon: Settings,
    path: "/admin-settings",
  },
];

function AdminSidebar({
  sidebarOpen,
  setSidebarOpen,
}: AdminSidebarProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userRole");

    window.dispatchEvent(new Event("authChange"));

    setSidebarOpen(false);
    navigate("/admin-login", { replace: true });
  };

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-100 bg-white transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="flex h-20 shrink-0 items-center justify-between border-b border-slate-100 px-6">
          <Link
            to="/admin-dashboard"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0B63CE] text-white">
              <Plus size={28} strokeWidth={3} />
            </div>

            <div>
              <h1 className="text-lg font-bold text-[#183b3b]">
                Telemedicine
              </h1>

              <p className="text-xs text-slate-500">
                Admin Panel
              </p>
            </div>
          </Link>

          {/* Mobile Close Button */}
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-4 pt-7">
          <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Main Menu
          </p>

          <nav className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  end
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                      isActive
                        ? "bg-[#0B63CE] text-white shadow-md shadow-blue-100"
                        : "text-slate-600 hover:bg-blue-50 hover:text-[#0B63CE]"
                    }`
                  }
                >
                  <Icon size={19} />

                  <span>{item.name}</span>

                  {item.name === "Notifications" && (
                    <span className="ml-auto rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
                      3
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Admin Profile & Logout */}
        <div className="shrink-0 border-t border-slate-100 p-4">
          <div className="mb-4 flex items-center gap-3 rounded-xl bg-[#f8faf9] p-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-[#0B63CE]">
              <UserRound size={21} />
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-800">
                Administrator
              </p>

              <p className="text-xs text-slate-500">
                Super Admin
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50"
          >
            <LogOut size={19} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}

export default AdminSidebar;
