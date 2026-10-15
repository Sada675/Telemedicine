import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
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
  Search,
  Eye,
  CheckCircle2,
  XCircle,
  Clock3,
  CalendarCheck,
  ChevronDown,
  UserRound,
  Phone,
  Mail,
  MapPin,
  Filter,
  ArrowUpRight,
} from "lucide-react";

type AppointmentStatus =
  | "Pending"
  | "Confirmed"
  | "Cancelled"
  | "Completed";

type Appointment = {
  id: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  fee: number;
  currency: "PKR" | "USD";
  reason: string;
  status: AppointmentStatus;
  type: "Online Consultation";
};

const STORAGE_KEY = "telemedicineAdminAppointments";

const initialAppointments: Appointment[] = [
  {
    id: "APT-1001",
    patientName: "Ayesha Khan",
    patientEmail: "ayesha@example.com",
    patientPhone: "+92 300 1234567",
    doctorName: "Dr. Munib",
    specialty: "Medical Specialist",
    date: "2026-10-16",
    time: "04:00 PM",
    fee: 3000,
    currency: "PKR",
    reason: "General medical consultation",
    status: "Pending",
    type: "Online Consultation",
  },
  {
    id: "APT-1002",
    patientName: "Fatima Ali",
    patientEmail: "fatima@example.com",
    patientPhone: "+92 301 2345678",
    doctorName: "Dr. Nazli",
    specialty: "Medical Specialist",
    date: "2026-10-16",
    time: "05:00 PM",
    fee: 3000,
    currency: "PKR",
    reason: "Follow-up consultation",
    status: "Confirmed",
    type: "Online Consultation",
  },
  {
    id: "APT-1003",
    patientName: "Sara Ahmed",
    patientEmail: "sara@example.com",
    patientPhone: "+92 302 3456789",
    doctorName: "Dr. Munib",
    specialty: "Medical Specialist",
    date: "2026-10-17",
    time: "11:00 AM",
    fee: 25,
    currency: "USD",
    reason: "Medical advice",
    status: "Pending",
    type: "Online Consultation",
  },
  {
    id: "APT-1004",
    patientName: "Hina Malik",
    patientEmail: "hina@example.com",
    patientPhone: "+92 303 4567890",
    doctorName: "Dr. Nazli",
    specialty: "Medical Specialist",
    date: "2026-10-17",
    time: "02:00 PM",
    fee: 3000,
    currency: "PKR",
    reason: "General health check",
    status: "Cancelled",
    type: "Online Consultation",
  },
  {
    id: "APT-1005",
    patientName: "Maryam Noor",
    patientEmail: "maryam@example.com",
    patientPhone: "+92 304 5678901",
    doctorName: "Dr. Munib",
    specialty: "Medical Specialist",
    date: "2026-10-18",
    time: "03:00 PM",
    fee: 3000,
    currency: "PKR",
    reason: "Follow-up appointment",
    status: "Completed",
    type: "Online Consultation",
  },
  {
    id: "APT-1006",
    patientName: "Zainab Shah",
    patientEmail: "zainab@example.com",
    patientPhone: "+92 305 6789012",
    doctorName: "Dr. Nazli",
    specialty: "Medical Specialist",
    date: "2026-10-18",
    time: "04:30 PM",
    fee: 25,
    currency: "USD",
    reason: "Online medical consultation",
    status: "Confirmed",
    type: "Online Consultation",
  },
];

function readAppointments(): Appointment[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      const parsed: unknown = JSON.parse(saved);

      if (Array.isArray(parsed)) {
        return parsed as Appointment[];
      }
    }
  } catch {
    // Use demo data if saved data cannot be read.
  }

  return initialAppointments;
}

const navigationItems = [
  {
    label: "Dashboard",
    path: "/admin-dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Manage Doctors",
    path: "/manage-doctors",
    icon: Stethoscope,
  },
  {
    label: "Manage Patients",
    path: "/manage-patients",
    icon: Users,
  },
  {
    label: "Appointments",
    path: "/manage-appointments",
    icon: CalendarDays,
  },
  {
    label: "Notifications",
    path: "/notifications",
    icon: Bell,
  },
  {
    label: "Settings",
    path: "/admin-settings",
    icon: Settings,
  },
];

function formatDate(date: string) {
  if (!date) return "—";

  const parsed = new Date(`${date}T12:00:00`);

  if (Number.isNaN(parsed.getTime())) return date;

  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatFee(fee: number, currency: "PKR" | "USD") {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(fee) + ` ${currency}`;
}

function getStatusClasses(status: AppointmentStatus) {
  switch (status) {
    case "Pending":
      return "bg-amber-50 text-amber-700 border-amber-100";

    case "Confirmed":
      return "bg-emerald-50 text-emerald-700 border-emerald-100";

    case "Cancelled":
      return "bg-red-50 text-red-700 border-red-100";

    case "Completed":
      return "bg-blue-50 text-blue-700 border-blue-100";

    default:
      return "bg-slate-50 text-slate-600 border-slate-100";
  }
}

function AdminAppointments() {
  const navigate = useNavigate();

  const [appointments, setAppointments] =
    useState<Appointment[]>(readAppointments);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    if (!notice) return;

    const timer = window.setTimeout(() => {
      setNotice("");
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [notice]);

  const stats = useMemo(
    () => [
      {
        label: "Total Appointments",
        value: appointments.length,
        icon: CalendarDays,
        iconBg: "bg-blue-50",
        iconColor: "text-[#0B63CE]",
      },
      {
        label: "Pending",
        value: appointments.filter((a) => a.status === "Pending").length,
        icon: Clock3,
        iconBg: "bg-amber-50",
        iconColor: "text-amber-600",
      },
      {
        label: "Confirmed",
        value: appointments.filter((a) => a.status === "Confirmed").length,
        icon: CheckCircle2,
        iconBg: "bg-emerald-50",
        iconColor: "text-emerald-600",
      },
      {
        label: "Cancelled",
        value: appointments.filter((a) => a.status === "Cancelled").length,
        icon: XCircle,
        iconBg: "bg-red-50",
        iconColor: "text-red-600",
      },
    ],
    [appointments]
  );

  const filteredAppointments = useMemo(() => {
    const query = search.trim().toLowerCase();

    return appointments.filter((appointment) => {
      const matchesSearch = [
        appointment.id,
        appointment.patientName,
        appointment.patientEmail,
        appointment.patientPhone,
        appointment.doctorName,
        appointment.specialty,
      ].some((value) => value.toLowerCase().includes(query));

      const matchesStatus =
        statusFilter === "All" ||
        appointment.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [appointments, search, statusFilter]);

  function updateStatus(
    appointmentId: string,
    newStatus: AppointmentStatus
  ) {
    setAppointments((current) =>
      current.map((appointment) =>
        appointment.id === appointmentId
          ? { ...appointment, status: newStatus }
          : appointment
      )
    );

    setSelectedAppointment((current) =>
      current?.id === appointmentId
        ? { ...current, status: newStatus }
        : current
    );

    setNotice(`Appointment ${appointmentId} updated to ${newStatus}.`);
  }

  function handleLogout() {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userRole");

    window.dispatchEvent(new Event("authChange"));

    navigate("/doctor-login");
  }

  function closeSidebar() {
    setSidebarOpen(false);
  }

  return (
    <div className="min-h-screen bg-[#f8faf9] text-slate-800">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={closeSidebar}
          className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-100 bg-white transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Brand */}
        <div className="flex h-20 items-center justify-between border-b border-slate-100 px-5">
          <Link
            to="/admin-dashboard"
            onClick={closeSidebar}
            className="flex items-center gap-3"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0B63CE] text-xl font-bold text-white">
              +
            </span>

            <span>
              <span className="block text-lg font-bold leading-tight text-[#183b3b]">
                Telemedicine
              </span>
              <span className="text-xs text-slate-500">
                Admin Panel
              </span>
            </span>
          </Link>

          <button
            type="button"
            onClick={closeSidebar}
            aria-label="Close menu"
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-6">
          <p className="mb-4 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
            Main Menu
          </p>

          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active = item.path === "/manage-appointments";

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={closeSidebar}
                className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                  active
                    ? "bg-[#0B63CE] text-white shadow-sm"
                    : "text-slate-600 hover:bg-blue-50 hover:text-[#0B63CE]"
                }`}
              >
                <Icon size={19} />
                <span>{item.label}</span>

                {active && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-white" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar footer */}
        <div className="border-t border-slate-100 p-4">
          <div className="mb-4 flex items-center gap-3 rounded-xl bg-[#f8faf9] p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-[#0B63CE]">
              <UserRound size={20} />
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-800">
                Admin
              </p>
              <p className="text-xs text-slate-500">Administrator</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50"
          >
            <LogOut size={19} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="min-w-0 lg:ml-64">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-100 bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              aria-label="Open navigation menu"
              onClick={() => setSidebarOpen(true)}
              className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 lg:hidden"
            >
              <Menu size={21} />
            </button>

            <div className="min-w-0">
              <h1 className="truncate text-lg font-bold text-[#183b3b] sm:text-xl">
                Manage Appointments
              </h1>
              <p className="hidden text-xs text-slate-500 sm:block">
                Review and manage patient appointments
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-4">
            <Link
              to="/notifications"
              aria-label="Notifications"
              className="relative rounded-xl border border-slate-200 p-2.5 text-slate-600 transition hover:bg-blue-50 hover:text-[#0B63CE]"
            >
              <Bell size={19} />
            </Link>

            <div className="hidden h-9 w-px bg-slate-200 sm:block" />

            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-[#0B63CE]">
                <UserRound size={18} />
              </div>

              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-slate-800">
                  Admin
                </p>
                <p className="text-xs text-slate-500">Administrator</p>
              </div>

              <ChevronDown
                size={15}
                className="hidden text-slate-400 sm:block"
              />
            </div>
          </div>
        </header>

        <main className="space-y-6 p-4 sm:p-6 lg:p-8">
          {/* Welcome heading */}
          <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-medium text-[#0B63CE]">
                Appointment Management
              </p>

              <h2 className="mt-1 text-2xl font-bold text-[#183b3b] sm:text-3xl">
                All Appointments
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                View appointment details and manage their status.
              </p>
            </div>

            <div className="flex w-fit items-center gap-2 rounded-xl border border-blue-100 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
              <CalendarCheck size={18} className="text-[#0B63CE]" />
              <span>
                <strong className="text-[#183b3b]">
                  {appointments.length}
                </strong>{" "}
                appointments
              </span>
            </div>
          </section>

          {/* Success notice */}
          {notice && (
            <div
              role="status"
              className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
            >
              <CheckCircle2 size={18} />
              {notice}
            </div>
          )}

          {/* Statistics */}
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500">
                        {stat.label}
                      </p>

                      <p className="mt-3 text-3xl font-bold text-[#183b3b]">
                        {stat.value}
                      </p>
                    </div>

                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.iconBg} ${stat.iconColor}`}
                    >
                      <Icon size={23} />
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-1 text-xs text-slate-400">
                    <ArrowUpRight size={14} />
                    <span>Current appointment records</span>
                  </div>
                </div>
              );
            })}
          </section>

          {/* Appointment table */}
          <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
            {/* Table heading */}
            <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:p-6">
              <div>
                <h3 className="text-lg font-bold text-[#183b3b]">
                  Appointment Records
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Search, filter and update appointments.
                </p>
              </div>

              {/* Search and filter */}
              <div className="flex flex-col gap-3 md:flex-row">
                <div className="relative min-w-0 flex-1">
                  <Search
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search patient, doctor or appointment ID..."
                    aria-label="Search appointments"
                    className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#0B63CE] focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div className="relative md:w-52">
                  <Filter
                    size={17}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <select
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value)}
                    aria-label="Filter by appointment status"
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-9 text-sm text-slate-700 outline-none focus:border-[#0B63CE] focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="Completed">Completed</option>
                  </select>

                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                </div>
              </div>
            </div>

            {/* Responsive table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left">
                <thead>
                  <tr className="border-b border-slate-100 bg-[#f8faf9]">
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Appointment
                    </th>
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Patient
                    </th>
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Doctor
                    </th>
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Date & Time
                    </th>
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Fee
                    </th>
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Status
                    </th>
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredAppointments.map((appointment) => (
                    <tr
                      key={appointment.id}
                      className="transition hover:bg-slate-50/80"
                    >
                      <td className="px-5 py-4">
                        <p className="text-sm font-bold text-[#183b3b]">
                          {appointment.id}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          {appointment.type}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-[#0B63CE]">
                            {appointment.patientName
                              .split(" ")
                              .map((part) => part[0])
                              .slice(0, 2)
                              .join("")}
                          </div>

                          <div>
                            <p className="text-sm font-semibold text-slate-800">
                              {appointment.patientName}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              {appointment.patientEmail}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold text-slate-700">
                          {appointment.doctorName}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {appointment.specialty}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="whitespace-nowrap text-sm font-medium text-slate-700">
                          {formatDate(appointment.date)}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {appointment.time}
                        </p>
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-sm font-semibold text-[#183b3b]">
                        {formatFee(appointment.fee, appointment.currency)}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-semibold ${getStatusClasses(
                            appointment.status
                          )}`}
                        >
                          {appointment.status}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedAppointment(appointment)
                            }
                            aria-label={`View ${appointment.id}`}
                            title="View details"
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-[#0B63CE]"
                          >
                            <Eye size={17} />
                          </button>

                          {appointment.status === "Pending" && (
                            <button
                              type="button"
                              onClick={() =>
                                updateStatus(appointment.id, "Confirmed")
                              }
                              aria-label={`Confirm ${appointment.id}`}
                              title="Confirm appointment"
                              className="flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-100 text-emerald-600 transition hover:bg-emerald-50"
                            >
                              <CheckCircle2 size={17} />
                            </button>
                          )}

                          {(
                            appointment.status === "Pending" ||
                            appointment.status === "Confirmed"
                          ) && (
                            <button
                              type="button"
                              onClick={() =>
                                updateStatus(appointment.id, "Cancelled")
                              }
                              aria-label={`Cancel ${appointment.id}`}
                              title="Cancel appointment"
                              className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-100 text-red-500 transition hover:bg-red-50"
                            >
                              <XCircle size={17} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filteredAppointments.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-5 py-14 text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                          <CalendarDays size={25} />
                        </div>

                        <p className="mt-4 font-semibold text-slate-700">
                          No appointments found
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          Try changing your search or status filter.
                        </p>

                        <button
                          type="button"
                          onClick={() => {
                            setSearch("");
                            setStatusFilter("All");
                          }}
                          className="mt-4 text-sm font-semibold text-[#0B63CE] hover:underline"
                        >
                          Clear filters
                        </button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Table footer */}
            <div className="flex flex-col justify-between gap-2 border-t border-slate-100 px-5 py-4 text-xs text-slate-500 sm:flex-row sm:items-center">
              <p>
                Showing{" "}
                <span className="font-semibold text-slate-700">
                  {filteredAppointments.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-slate-700">
                  {appointments.length}
                </span>{" "}
                appointments
              </p>

              <p>Appointment records are saved in this browser.</p>
            </div>
          </section>
        </main>
      </div>

      {/* Appointment details modal */}
      {selectedAppointment && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedAppointment(null);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="appointment-modal-title"
            className="my-auto w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            {/* Modal header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 p-5 sm:p-6">
              <div>
                <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-[#0B63CE]">
                  <CalendarDays size={14} />
                  Appointment Details
                </div>

                <h3
                  id="appointment-modal-title"
                  className="text-xl font-bold text-[#183b3b]"
                >
                  {selectedAppointment.id}
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  {selectedAppointment.type}
                </p>
              </div>

              <button
                type="button"
                aria-label="Close appointment details"
                onClick={() => setSelectedAppointment(null)}
                className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5 p-5 sm:p-6">
              {/* Status */}
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[#f8faf9] p-4">
                <div>
                  <p className="text-xs font-medium text-slate-500">
                    Current Status
                  </p>

                  <span
                    className={`mt-2 inline-flex rounded-full border px-3 py-1.5 text-xs font-semibold ${getStatusClasses(
                      selectedAppointment.status
                    )}`}
                  >
                    {selectedAppointment.status}
                  </span>
                </div>

                <div className="text-right">
                  <p className="text-xs text-slate-500">Consultation Fee</p>
                  <p className="mt-1 text-lg font-bold text-[#183b3b]">
                    {formatFee(
                      selectedAppointment.fee,
                      selectedAppointment.currency
                    )}
                  </p>
                </div>
              </div>

              {/* Patient information */}
              <div>
                <h4 className="mb-3 font-semibold text-[#183b3b]">
                  Patient Information
                </h4>

                <div className="grid gap-3 sm:grid-cols-2">
                  <DetailItem
                    icon={<UserRound size={17} />}
                    label="Patient Name"
                    value={selectedAppointment.patientName}
                  />

                  <DetailItem
                    icon={<Mail size={17} />}
                    label="Email Address"
                    value={selectedAppointment.patientEmail}
                  />

                  <DetailItem
                    icon={<Phone size={17} />}
                    label="Phone Number"
                    value={selectedAppointment.patientPhone}
                  />

                  <DetailItem
                    icon={<Stethoscope size={17} />}
                    label="Doctor"
                    value={selectedAppointment.doctorName}
                  />
                </div>
              </div>

              {/* Appointment information */}
              <div>
                <h4 className="mb-3 font-semibold text-[#183b3b]">
                  Consultation Information
                </h4>

                <div className="grid gap-3 sm:grid-cols-2">
                  <DetailItem
                    icon={<CalendarDays size={17} />}
                    label="Appointment Date"
                    value={formatDate(selectedAppointment.date)}
                  />

                  <DetailItem
                    icon={<Clock3 size={17} />}
                    label="Appointment Time"
                    value={selectedAppointment.time}
                  />

                  <DetailItem
                    icon={<MapPin size={17} />}
                    label="Consultation Type"
                    value={selectedAppointment.type}
                  />

                  <DetailItem
                    icon={<Stethoscope size={17} />}
                    label="Specialty"
                    value={selectedAppointment.specialty}
                  />
                </div>

                <div className="mt-3 rounded-xl border border-slate-100 p-4">
                  <p className="text-xs font-medium text-slate-500">
                    Reason for Appointment
                  </p>
                  <p className="mt-2 break-words text-sm text-slate-700">
                    {selectedAppointment.reason || "Not provided"}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal actions */}
            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 p-5 sm:flex-row sm:justify-end sm:p-6">
              <button
                type="button"
                onClick={() => setSelectedAppointment(null)}
                className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Close
              </button>

              {selectedAppointment.status === "Pending" && (
                <button
                  type="button"
                  onClick={() =>
                    updateStatus(selectedAppointment.id, "Confirmed")
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0B63CE] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0955AE]"
                >
                  <CheckCircle2 size={17} />
                  Confirm Appointment
                </button>
              )}

              {(
                selectedAppointment.status === "Pending" ||
                selectedAppointment.status === "Confirmed"
              ) && (
                <button
                  type="button"
                  onClick={() =>
                    updateStatus(selectedAppointment.id, "Cancelled")
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                >
                  <XCircle size={17} />
                  Cancel Appointment
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DetailItem({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-w-0 items-start gap-3 rounded-xl border border-slate-100 p-3">
      <div className="mt-0.5 shrink-0 text-[#0B63CE]">{icon}</div>

      <div className="min-w-0">
        <p className="text-xs text-slate-500">{label}</p>
        <p className="mt-1 break-words text-sm font-medium text-slate-700">
          {value || "—"}
        </p>
      </div>
    </div>
  );
}

export default AdminAppointments;
