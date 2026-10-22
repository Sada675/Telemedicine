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
    path: "/admin-notifications",
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
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-white/10 bg-[#420704] shadow-xl transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="flex h-20 shrink-0 items-center justify-between border-b border-white/15 px-5">
          <Link
            to="/admin-dashboard"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0B63CE] text-white ring-1 ring-white/20">
              <Plus size={28} strokeWidth={3} />
            </div>

            <div>
              <h1 className="text-lg font-bold tracking-wide text-white">
                Telemedicine
              </h1>

              <p className="text-xs font-medium text-white/90">
                Admin Panel
              </p>
            </div>
          </Link>

          {/* Mobile Close Button */}
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-2 text-white/70 transition hover:bg-white/10 hover:text-white lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-4 pt-7">
          <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-[0.15em] text-white/80">
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
                    `group flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "border-white/15 bg-[#0B63CE] text-white shadow-lg shadow-black/10"
                        : "border-transparent text-white/85 hover:border-white/10 hover:bg-white/10 hover:text-white"
                    }`
                  }
                >
                  <Icon
                    size={19}
                    className="shrink-0 transition-transform duration-200 group-hover:scale-105"
                  />

                  <span>{item.name}</span>

                  {item.name === "Notifications" && (
                    <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1.5 text-xs font-semibold text-white">
                      3
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Admin Profile & Logout */}
        <div className="shrink-0 border-t border-white/15 p-4">
          <div className="mb-3 flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/15">
              <UserRound size={21} />
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">
                Administrator
              </p>

              <p className="text-xs text-rose-200/75">
                Super Admin
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl border border-transparent px-4 py-3 text-sm font-medium text-white/90 transition-all duration-200 hover:border-rose-300/15 hover:bg-rose-500/10 hover:text-white"
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
