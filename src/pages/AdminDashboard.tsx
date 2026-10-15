import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Stethoscope,
  Users,
  CalendarDays,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  UserRound,
  Clock3,
  CheckCircle2,
  XCircle,
  ArrowUpRight,
   Plus,
  Search,
} from "lucide-react";

type AppointmentStatus = "Confirmed" | "Pending" | "Cancelled";

type Appointment = {
  id: string;
  patient: string;
  doctor: string;
  date: string;
  time: string;
  status: AppointmentStatus;
};

const initialAppointments: Appointment[] = [
  {
    id: "APT-1001",
    patient: "Ayesha Khan",
    doctor: "Dr. Munib",
    date: "15 Oct 2026",
    time: "04:00 PM",
    status: "Confirmed",
  },
  {
    id: "APT-1002",
    patient: "Fatima Noor",
    doctor: "Dr. Nazli",
    date: "16 Oct 2026",
    time: "11:00 AM",
    status: "Pending",
  },
  {
    id: "APT-1003",
    patient: "Sara Ahmed",
    doctor: "Dr. Munib",
    date: "16 Oct 2026",
    time: "02:00 PM",
    status: "Pending",
  },
  {
    id: "APT-1004",
    patient: "Maryam Ali",
    doctor: "Dr. Nazli",
    date: "17 Oct 2026",
    time: "10:00 AM",
    status: "Cancelled",
  },
  {
    id: "APT-1005",
    patient: "Zainab Shah",
    doctor: "Dr. Munib",
    date: "18 Oct 2026",
    time: "12:00 PM",
    status: "Confirmed",
  },
];

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

function AdminDashboard() {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [appointments] = useState(initialAppointments);

  const stats = [
    {
      title: "Total Doctors",
      value: "2",
      subtitle: "Registered doctors",
      icon: Stethoscope,
      color: "bg-blue-50 text-[#0B63CE]",
    },
    {
      title: "Total Patients",
      value: "128",
      subtitle: "Registered patients",
      icon: Users,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      title: "Total Appointments",
      value: String(appointments.length),
      subtitle: "Sample appointments",
      icon: CalendarDays,
      color: "bg-amber-50 text-amber-600",
    },
    {
      title: "Pending Appointments",
      value: String(
        appointments.filter((a) => a.status === "Pending").length,
      ),
      subtitle: "Awaiting approval",
      icon: Clock3,
      color: "bg-purple-50 text-purple-600",
    },
  ];

  const filteredAppointments = appointments.filter((appointment) =>
    [
      appointment.id,
      appointment.patient,
      appointment.doctor,
      appointment.status,
    ].some((value) => value.toLowerCase().includes(search.toLowerCase())),
  );

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userRole");
    window.dispatchEvent(new Event("authChange"));
    navigate("/doctor-login");
  };

  const getStatusStyle = (status: AppointmentStatus) => {
    switch (status) {
      case "Confirmed":
        return "bg-emerald-50 text-emerald-700";
      case "Pending":
        return "bg-amber-50 text-amber-700";
      case "Cancelled":
        return "bg-red-50 text-red-600";
    }
  };

  return (
    <div className="min-h-screen bg-[#f8faf9] text-slate-800">
      {/* Mobile overlay */}
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
        <div className="flex h-20 items-center justify-between border-b border-slate-100 px-6">
          <Link to="/admin-dashboard" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0B63CE] text-white">
  <Plus size={28} strokeWidth={3} />
</div>

            <div>
              <h1 className="text-lg font-bold text-[#183b3b]">
                Telemedicine
              </h1>
              <p className="text-xs text-slate-500">Admin Panel</p>
            </div>
          </Link>

          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-4 pt-7">
          <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Main Menu
          </p>

          <nav className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = item.name === "Dashboard";

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    active
                      ? "bg-[#0B63CE] text-white shadow-md shadow-blue-100"
                      : "text-slate-600 hover:bg-blue-50 hover:text-[#0B63CE]"
                  }`}
                >
                  <Icon size={19} />
                  {item.name}
                  {item.name === "Notifications" && (
                    <span className="ml-auto rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
                      3
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto border-t border-slate-100 p-4">
          <div className="mb-4 flex items-center gap-3 rounded-xl bg-[#f8faf9] p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-[#0B63CE]">
              <UserRound size={21} />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">Administrator</p>
              <p className="text-xs text-slate-500">Super Admin</p>
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

      {/* Main content */}
      <main className="min-h-screen lg:ml-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-100 bg-white/95 px-4 backdrop-blur sm:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
              aria-label="Open sidebar"
            >
              <Menu size={23} />
            </button>

            <div>
              <h2 className="text-lg font-bold text-[#183b3b] sm:text-xl">
                Dashboard Overview
              </h2>
              <p className="hidden text-xs text-slate-500 sm:block">
                Welcome back! Here is your platform overview.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/notifications")}
              aria-label="Notifications"
              className="relative rounded-xl border border-slate-100 p-2.5 text-slate-600 transition hover:bg-blue-50 hover:text-[#0B63CE]"
            >
              <Bell size={20} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
            </button>

            <div className="hidden items-center gap-3 border-l border-slate-100 pl-4 sm:flex">
              <div className="text-right">
                <p className="text-sm font-semibold">Administrator</p>
                <p className="text-xs text-slate-500">Admin Account</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e5f4f2] text-[#183b3b]">
                <UserRound size={21} />
              </div>
            </div>
          </div>
        </header>

        <div className="space-y-7 p-4 sm:p-8">
          {/* Welcome section */}
          <section className="overflow-hidden rounded-2xl bg-gradient-to-r from-[#410200] via-[#536276] to-[#151b54] p-6 text-white shadow-lg sm:p-8">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
              <div>
                <p className="text-sm text-gray-100">
  {new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Karachi",
  })}
</p>
                <h3 className="text-2xl font-bold sm:text-3xl">
                  Welcome, Administrator!
                </h3>
                <p className="mt-2 max-w-xl text-sm leading-6 text-blue-50">
                  Manage doctors, patients, appointments, and your
                  telemedicine platform from one place.
                </p>
              </div>

              <div className="flex h-16 w-16 items-center justify-center self-start rounded-2xl bg-white/15 sm:self-center">
                <Plus size={34} strokeWidth={3} />
              </div>
            </div>
          </section>

          {/* Statistics */}
          <section>
            <div className="mb-5">
              <h3 className="text-lg font-bold text-[#183b3b]">
                Platform Statistics
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                A quick look at your platform activity.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((stat) => {
                const Icon = stat.icon;

                return (
                  <div
                    key={stat.title}
                    className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-slate-500">
                          {stat.title}
                        </p>
                        <h4 className="mt-3 text-3xl font-bold text-[#183b3b]">
                          {stat.value}
                        </h4>
                      </div>

                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color}`}
                      >
                        <Icon size={23} />
                      </div>
                    </div>

                    <p className="mt-4 text-xs text-slate-500">
                      {stat.subtitle}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Quick actions */}
          <section>
            <h3 className="mb-4 text-lg font-bold text-[#183b3b]">
              Quick Actions
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Link
                to="/manage-doctors"
                className="group flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-md"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-[#0B63CE]">
                    <Stethoscope size={23} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#183b3b]">
                      Manage Doctors
                    </h4>
                    <p className="mt-1 text-xs text-slate-500">
                      Doctor profiles and fees
                    </p>
                  </div>
                </div>
                <ArrowUpRight
                  size={20}
                  className="text-slate-400 transition group-hover:text-[#0B63CE]"
                />
              </Link>

              <Link
                to="/manage-patients"
                className="group flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-md"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <Users size={23} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#183b3b]">
                      Manage Patients
                    </h4>
                    <p className="mt-1 text-xs text-slate-500">
                      Patient information
                    </p>
                  </div>
                </div>
                <ArrowUpRight
                  size={20}
                  className="text-slate-400 transition group-hover:text-[#0B63CE]"
                />
              </Link>

              <Link
                to="/manage-appointments"
                className="group flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-md"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                    <CalendarDays size={23} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#183b3b]">
                      Manage Appointments
                    </h4>
                    <p className="mt-1 text-xs text-slate-500">
                      Review appointment requests
                    </p>
                  </div>
                </div>
                <ArrowUpRight
                  size={20}
                  className="text-slate-400 transition group-hover:text-[#0B63CE]"
                />
              </Link>
            </div>
          </section>

          {/* Recent appointments */}
          <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
            <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:p-6">
              <div>
                <h3 className="text-lg font-bold text-[#183b3b]">
                  Recent Appointments
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Review the latest appointment activity.
                </p>
              </div>

              <Link
                to="/manage-appointments"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0B63CE] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0955AE]"
              >
                View All
                <ArrowUpRight size={17} />
              </Link>
            </div>

            {/* Search */}
            <div className="border-b border-slate-100 p-5">
              <div className="relative max-w-sm">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search patient, doctor, ID or status..."
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#0B63CE] focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left">
                <thead className="bg-[#f8faf9]">
                  <tr className="text-xs uppercase tracking-wider text-slate-500">
                    <th className="px-6 py-4 font-semibold">Appointment</th>
                    <th className="px-6 py-4 font-semibold">Patient</th>
                    <th className="px-6 py-4 font-semibold">Doctor</th>
                    <th className="px-6 py-4 font-semibold">Date & Time</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredAppointments.map((appointment) => (
                    <tr
                      key={appointment.id}
                      className="transition hover:bg-slate-50"
                    >
                      <td className="px-6 py-5">
                        <span className="text-sm font-semibold text-[#0B63CE]">
                          {appointment.id}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e5f4f2] text-sm font-semibold text-[#183b3b]">
                            {appointment.patient.charAt(0)}
                          </div>
                          <span className="text-sm font-medium text-slate-700">
                            {appointment.patient}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-5 text-sm text-slate-600">
                        {appointment.doctor}
                      </td>

                      <td className="px-6 py-5">
                        <p className="text-sm font-medium text-slate-700">
                          {appointment.date}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {appointment.time}
                        </p>
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusStyle(appointment.status)}`}
                        >
                          {appointment.status === "Confirmed" && (
                            <CheckCircle2 size={14} />
                          )}
                          {appointment.status === "Pending" && (
                            <Clock3 size={14} />
                          )}
                          {appointment.status === "Cancelled" && (
                            <XCircle size={14} />
                          )}
                          {appointment.status}
                        </span>
                      </td>
                    </tr>
                  ))}

                  {filteredAppointments.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-12 text-center text-sm text-slate-500"
                      >
                        No appointments match your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="border-t border-slate-100 px-6 py-4 text-xs text-slate-500">
              Showing {filteredAppointments.length} of {appointments.length}{" "}
              sample appointments
            </div>
          </section>

          {/* Footer */}
          <footer className="pb-2 text-center text-xs text-slate-400">
            © 2026 Telemedicine Admin Panel. All rights reserved.
          </footer>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
