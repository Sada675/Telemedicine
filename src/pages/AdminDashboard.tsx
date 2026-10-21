import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import {
  Stethoscope,
  Users,
  CalendarDays,
  Clock3,
  CheckCircle2,
  XCircle,
  ArrowUpRight,
  Plus,
  Search,
  Activity,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
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

function AdminDashboard() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<"All" | AppointmentStatus>("All");

  const [rowsPerPage, setRowsPerPage] = useState(3);
  const [rowsPerPageInput, setRowsPerPageInput] = useState("3");
  const [currentPage, setCurrentPage] = useState(1);

  const [appointments] = useState<Appointment[]>(initialAppointments);

  const [pageDropdownOpen, setPageDropdownOpen] = useState(false);
  const [pageInput, setPageInput] = useState("1");

  const pageDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        pageDropdownRef.current &&
        !pageDropdownRef.current.contains(event.target as Node)
      ) {
        setPageDropdownOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setPageDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const pendingAppointments = appointments.filter(
    (appointment) => appointment.status === "Pending",
  ).length;

  const confirmedAppointments = appointments.filter(
    (appointment) => appointment.status === "Confirmed",
  ).length;

  const stats = [
    {
      title: "Total Doctors",
      value: "2",
      subtitle: "Registered doctors",
      icon: Stethoscope,
      iconStyle: "bg-blue-50 text-[#0B63CE]",
      accent: "border-l-[#0B63CE]",
      path: "/manage-doctors",
    },
    {
      title: "Total Patients",
      value: "128",
      subtitle: "Registered patients",
      icon: Users,
      iconStyle: "bg-emerald-50 text-emerald-600",
      accent: "border-l-emerald-500",
      path: "/manage-patients",
    },
    {
      title: "Total Appointments",
      value: String(appointments.length),
      subtitle: "Sample appointments",
      icon: CalendarDays,
      iconStyle: "bg-amber-50 text-amber-600",
      accent: "border-l-amber-500",
      path: "/manage-appointments",
    },
    {
      title: "Pending Appointments",
      value: String(pendingAppointments),
      subtitle: "Awaiting approval",
      icon: Clock3,
      iconStyle: "bg-purple-50 text-purple-600",
      accent: "border-l-purple-500",
      path: "/manage-appointments",
    },
  ];

  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch = [
      appointment.id,
      appointment.patient,
      appointment.doctor,
      appointment.status,
      appointment.date,
      appointment.time,
    ].some((value) =>
      value.toLowerCase().includes(search.trim().toLowerCase()),
    );

    const matchesStatus =
      statusFilter === "All" || appointment.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredAppointments.length / rowsPerPage),
  );

  const safeCurrentPage = Math.min(currentPage, totalPages);

  const startIndex =
    filteredAppointments.length === 0
      ? 0
      : (safeCurrentPage - 1) * rowsPerPage;

  const endIndex = Math.min(
    startIndex + rowsPerPage,
    filteredAppointments.length,
  );

  const paginatedAppointments = filteredAppointments.slice(
    startIndex,
    endIndex,
  );

  const pageNumbers: (number | "ellipsis")[] = [];

  if (totalPages <= 5) {
    for (let page = 1; page <= totalPages; page += 1) {
      pageNumbers.push(page);
    }
  } else {
    pageNumbers.push(1);

    if (safeCurrentPage > 3) {
      pageNumbers.push("ellipsis");
    }

    const firstMiddlePage = Math.max(2, safeCurrentPage - 1);
    const lastMiddlePage = Math.min(totalPages - 1, safeCurrentPage + 1);

    for (
      let page = firstMiddlePage;
      page <= lastMiddlePage;
      page += 1
    ) {
      pageNumbers.push(page);
    }

    if (safeCurrentPage < totalPages - 2) {
      pageNumbers.push("ellipsis");
    }

    pageNumbers.push(totalPages);
  }

  const changeSearch = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
    setPageInput("1");
  };

  const changeStatusFilter = (
    value: "All" | AppointmentStatus,
  ) => {
    setStatusFilter(value);
    setCurrentPage(1);
    setPageInput("1");
  };

  const changeRowsPerPage = (value: number) => {
    if (!Number.isInteger(value) || value < 1) return;

    setRowsPerPage(value);
    setRowsPerPageInput(String(value));
    setCurrentPage(1);
    setPageInput("1");
  };

  const handleRowsPerPageInput = (value: string) => {
    setRowsPerPageInput(value);

    if (value.trim() === "") return;

    const parsedValue = Number(value);

    if (
      Number.isInteger(parsedValue) &&
      parsedValue >= 1 &&
      parsedValue <= 10000
    ) {
      setRowsPerPage(parsedValue);
      setCurrentPage(1);
      setPageInput("1");
    }
  };

  const validateRowsPerPageInput = () => {
    const parsedValue = Number(rowsPerPageInput);

    if (
      rowsPerPageInput.trim() === "" ||
      !Number.isInteger(parsedValue) ||
      parsedValue < 1 ||
      parsedValue > 10000
    ) {
      setRowsPerPageInput(String(rowsPerPage));
      return;
    }

    changeRowsPerPage(parsedValue);
  };

  const goToPage = (page: number) => {
    const validPage = Math.max(1, Math.min(page, totalPages));

    setCurrentPage(validPage);
    setPageInput(String(validPage));
    setPageDropdownOpen(false);
  };

  const handlePageInput = (value: string) => {
    setPageInput(value);

    if (value.trim() === "") return;

    const parsedPage = Number(value);

    if (
      Number.isInteger(parsedPage) &&
      parsedPage >= 1 &&
      parsedPage <= totalPages
    ) {
      setCurrentPage(parsedPage);
    }
  };

  const validatePageInput = () => {
    const parsedPage = Number(pageInput);

    if (
      pageInput.trim() === "" ||
      !Number.isInteger(parsedPage) ||
      parsedPage < 1 ||
      parsedPage > totalPages
    ) {
      setPageInput(String(safeCurrentPage));
      return;
    }

    goToPage(parsedPage);
  };

  const getStatusStyle = (status: AppointmentStatus) => {
    switch (status) {
      case "Confirmed":
        return {
          badge: "bg-emerald-50 text-emerald-700 ring-emerald-600/15",
          dot: "bg-emerald-500",
          icon: CheckCircle2,
        };

      case "Pending":
        return {
          badge: "bg-amber-50 text-amber-700 ring-amber-600/15",
          dot: "bg-amber-500",
          icon: Clock3,
        };

      case "Cancelled":
        return {
          badge: "bg-red-50 text-red-600 ring-red-600/15",
          dot: "bg-red-500",
          icon: XCircle,
        };
    }
  };

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Karachi",
  });

  return (
    <div className="min-h-screen w-full bg-[#f5f8fc] text-slate-800">
      <div className="mx-auto w-full max-w-[1400px] space-y-7 px-6 py-6 sm:px-10 lg:px-14 xl:px-16">
        {/* Welcome Banner */}
        <section className="relative isolate overflow-hidden rounded-[24px] bg-gradient-to-r from-[#410200] via-[#354a66] to-[#151b54] p-6 text-white shadow-xl shadow-slate-200/60 sm:p-8 lg:p-9">
          <div className="pointer-events-none absolute -right-10 -top-20 -z-10 h-64 w-64 rounded-full border-[35px] border-white/[0.05]" />

          <div className="pointer-events-none absolute -bottom-28 right-32 -z-10 h-64 w-64 rounded-full bg-blue-400/10 blur-3xl" />

          <div className="flex flex-col justify-between gap-7 sm:flex-row sm:items-center">
            <div className="max-w-2xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-medium text-blue-50 backdrop-blur-sm">
                <Sparkles size={13} />
                Your Admin Workspace
              </div>

              <p className="text-xs font-medium tracking-wide text-blue-100/90 sm:text-sm">
                {currentDate}
              </p>

              <h3 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-[36px]">
                Welcome back, Administrator!
              </h3>

              <p className="mt-3 max-w-xl text-sm leading-6 text-blue-50/85">
                Manage doctors, patients, appointments, and your
                telemedicine platform — all from one place.
              </p>

              <Link
                to="/manage-appointments"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-xs font-bold text-[#183b3b] shadow-lg transition hover:-translate-y-0.5 hover:bg-blue-50 sm:text-sm"
              >
                Explore Appointments
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="hidden shrink-0 sm:flex">
              <div className="flex h-24 w-24 items-center justify-center rounded-[28px] border border-white/15 bg-white/10 shadow-inner backdrop-blur-sm lg:h-28 lg:w-28">
                <Plus size={58} strokeWidth={2.4} className="text-white" />
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-white/15 pt-5">
            <div className="flex items-center gap-2 text-xs text-blue-50/90">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Platform overview
            </div>

            <div className="flex items-center gap-2 text-xs text-blue-50/90">
              <ShieldCheck size={15} />
              Admin workspace
            </div>
          </div>
        </section>

        {/* Statistics */}
        <section>
          <div className="mb-5 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#0B63CE]">
                Overview
              </p>

              <h3 className="mt-1 text-xl font-extrabold tracking-tight text-[#183b3b]">
                Platform Statistics
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                A quick look at your platform activity.
              </p>
            </div>

            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-2 text-[11px] font-semibold text-emerald-700">
              <Activity size={14} />
              Platform summary
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <Link
                  key={stat.title}
                  to={stat.path}
                  className={`group rounded-2xl border border-slate-100 border-l-[3px] ${stat.accent} bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/60 sm:p-6`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[12px] font-semibold text-slate-500">
                        {stat.title}
                      </p>

                      <h4 className="mt-3 text-3xl font-extrabold tracking-tight text-[#183b3b] sm:text-[34px]">
                        {stat.value}
                      </h4>
                    </div>

                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition duration-300 group-hover:scale-105 ${stat.iconStyle}`}
                    >
                      <Icon size={22} strokeWidth={2} />
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between gap-2 border-t border-slate-100 pt-4">
                    <p className="text-[11px] text-slate-500">
                      {stat.subtitle}
                    </p>

                    <ArrowUpRight
                      size={16}
                      className="shrink-0 text-slate-300 transition group-hover:text-[#0B63CE]"
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Quick Actions */}
        <section>
          <div className="mb-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#0B63CE]">
              Shortcuts
            </p>

            <h3 className="mt-1 text-xl font-extrabold tracking-tight text-[#183b3b]">
              Quick Actions
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Jump directly to the sections you use most.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Link
              to="/manage-doctors"
              className="group flex items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-100/50"
            >
              <div className="flex min-w-0 items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-[#0B63CE] transition group-hover:bg-[#0B63CE] group-hover:text-white">
                  <Stethoscope size={22} />
                </div>

                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-[#183b3b]">
                    Manage Doctors
                  </h4>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Doctor profiles and fees
                  </p>
                </div>
              </div>

              <ArrowUpRight
                size={19}
                className="shrink-0 text-slate-400 transition group-hover:text-[#0B63CE]"
              />
            </Link>

            <Link
              to="/manage-patients"
              className="group flex items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-100/50"
            >
              <div className="flex min-w-0 items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 transition group-hover:bg-emerald-600 group-hover:text-white">
                  <Users size={22} />
                </div>

                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-[#183b3b]">
                    Manage Patients
                  </h4>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Patient information
                  </p>
                </div>
              </div>

              <ArrowUpRight
                size={19}
                className="shrink-0 text-slate-400 transition group-hover:text-emerald-600"
              />
            </Link>

            <Link
              to="/manage-appointments"
              className="group flex items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-amber-200 hover:shadow-lg hover:shadow-amber-100/50"
            >
              <div className="flex min-w-0 items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 transition group-hover:bg-amber-500 group-hover:text-white">
                  <CalendarDays size={22} />
                </div>

                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-[#183b3b]">
                    Manage Appointments
                  </h4>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Review appointment requests
                  </p>
                </div>
              </div>

              <ArrowUpRight
                size={19}
                className="shrink-0 text-slate-400 transition group-hover:text-amber-600"
              />
            </Link>
          </div>
        </section>

        {/* Recent Appointments */}
        <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
          <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:p-6">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-[#0B63CE]">
                  <CalendarCheck size={19} />
                </div>

                <h3 className="text-lg font-extrabold tracking-tight text-[#183b3b]">
                  Recent Appointments
                </h3>
              </div>

              <p className="mt-2 text-xs leading-5 text-slate-500 sm:ml-11 sm:text-sm">
                Review the latest appointment activity.
              </p>
            </div>

            <Link
              to="/manage-appointments"
              className="inline-flex items-center justify-center gap-2 self-start rounded-full bg-[#0B63CE] px-5 py-3 text-xs font-bold text-white shadow-sm transition hover:bg-[#0955AE] sm:self-center sm:text-sm"
            >
              View All
              <ArrowUpRight size={16} />
            </Link>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 sm:px-6 lg:flex-row lg:items-center">
            <div className="flex w-full flex-col gap-3 sm:flex-row lg:max-w-2xl">
              <div className="relative w-full sm:flex-1">
                <Search
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(event) => changeSearch(event.target.value)}
                  placeholder="Search patient, doctor, ID or date..."
                  aria-label="Search appointments"
                  className="w-full rounded-xl border border-slate-200 bg-[#fafcff] py-3 pl-10 pr-4 text-xs outline-none transition placeholder:text-slate-400 focus:border-[#0B63CE] focus:bg-white focus:ring-4 focus:ring-blue-50 sm:text-sm"
                />
              </div>

              <div className="w-full sm:w-44">
                <label htmlFor="appointment-status-filter" className="sr-only">
                  Filter appointments by status
                </label>

                <select
                  id="appointment-status-filter"
                  value={statusFilter}
                  onChange={(event) =>
                    changeStatusFilter(
                      event.target.value as "All" | AppointmentStatus,
                    )
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-xs font-semibold text-slate-600 outline-none transition focus:border-[#0B63CE] focus:ring-4 focus:ring-blue-50 sm:text-sm"
                >
                  <option value="All">All statuses</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Pending">Pending</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-[11px] font-medium text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                {confirmedAppointments} Confirmed
              </span>

              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                {pendingAppointments} Pending
              </span>
            </div>
          </div>

          {/* Appointments Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left">
              <thead className="bg-[#f8fafc]">
                <tr className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">
                  <th className="px-6 py-4">Appointment</th>
                  <th className="px-6 py-4">Patient</th>
                  <th className="px-6 py-4">Doctor</th>
                  <th className="px-6 py-4">Date &amp; Time</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {paginatedAppointments.map((appointment) => {
                  const status = getStatusStyle(appointment.status);
                  const StatusIcon = status.icon;

                  return (
                    <tr
                      key={appointment.id}
                      className="transition-colors hover:bg-[#f8fbff]"
                    >
                      <td className="px-6 py-5">
                        <span className="text-xs font-bold text-[#0B63CE]">
                          {appointment.id}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#dcebe8] bg-[#e5f4f2] text-sm font-bold text-[#183b3b]">
                            {appointment.patient.charAt(0)}
                          </div>

                          <div>
                            <p className="text-xs font-bold text-slate-700">
                              {appointment.patient}
                            </p>
                            <p className="mt-1 text-[10px] text-slate-400">
                              Patient
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[#0B63CE]">
                            <Stethoscope size={15} />
                          </div>

                          <span className="text-xs font-semibold text-slate-600">
                            {appointment.doctor}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <p className="whitespace-nowrap text-xs font-semibold text-slate-700">
                          {appointment.date}
                        </p>

                        <p className="mt-1.5 flex items-center gap-1.5 text-[11px] text-slate-500">
                          <Clock3 size={12} />
                          {appointment.time}
                        </p>
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-[10px] font-bold ring-1 ring-inset ${status.badge}`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${status.dot}`}
                          />

                          <StatusIcon size={12} />
                          {appointment.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}

                {filteredAppointments.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                        <Search size={22} />
                      </div>

                      <p className="mt-3 text-sm font-bold text-slate-700">
                        No appointments found
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Try searching with a different name, ID, or status.
                      </p>

                      {(search || statusFilter !== "All") && (
                        <button
                          type="button"
                          onClick={() => {
                            setSearch("");
                            setStatusFilter("All");
                            setCurrentPage(1);
                            setPageInput("1");
                          }}
                          className="mt-4 text-xs font-bold text-[#0B63CE] hover:underline"
                        >
                          Clear search and filters
                        </button>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="flex flex-col gap-4 border-t border-slate-100 bg-[#fcfdff] px-5 py-4 sm:px-6">
            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
              {/* Rows per page and summary */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-3">
  <label
    htmlFor="appointments-rows-per-page"
    className="whitespace-nowrap text-[11px] text-slate-500"
  >
    Rows per page:
  </label>

{/* Dropdown options */}
<select
aria-label="Choose rows per page"
value={[3, 5, 10, 20].includes(rowsPerPage)
? String(rowsPerPage)
: "custom"}
onChange={(event) => {
if (event.target.value !== "custom") {
changeRowsPerPage(Number(event.target.value));
}
}}
className="w-[85px] rounded-lg border border-slate-200 bg-white px-2 py-2 text-xs font-semibold text-slate-700 outline-none transition focus:border-[#0B63CE] focus:ring-4 focus:ring-blue-50"

>

<option value="3">3 rows</option>

<option value="5">5 rows</option>
<option value="10">10 rows</option>
<option value="20">20 rows</option>
<option value="custom">Custom</option>

  </select>

{/* Custom number input */}
<input
id="appointments-rows-per-page"
type="number"
min={1}
max={10000}
step={1}
value={rowsPerPageInput}
onChange={(event) =>
handleRowsPerPageInput(event.target.value)
}
onBlur={validateRowsPerPageInput}
onKeyDown={(event) => {
if (event.key === "Enter") {
event.currentTarget.blur();
}
}}
aria-label="Enter custom rows per page"
className="w-[76px] rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs font-semibold text-slate-700 outline-none transition focus:border-[#0B63CE] focus:ring-4 focus:ring-blue-50"
/>

{/* Results summary */}

  <p className="text-[11px] text-slate-500" aria-live="polite">
    Showing{" "}
    <span className="font-bold text-slate-700">
      {startIndex + (filteredAppointments.length > 0 ? 1 : 0)}
      –{endIndex}
    </span>{" "}
    of{" "}
    <span className="font-bold text-slate-700">
      {filteredAppointments.length}
    </span>{" "}
    appointments
  </p>
</div>


              {/* Page Selection: custom menu opens upward */}
              <div
                ref={pageDropdownRef}
                className="relative flex items-center gap-2"
              >
                <label
                  htmlFor="appointments-page-input"
                  className="whitespace-nowrap text-[11px] font-medium text-slate-500"
                >
                  Go to page:
                </label>

                <div className="relative w-[112px]">
                  <input
                    id="appointments-page-input"
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    value={pageInput}
                    onFocus={() => setPageDropdownOpen(true)}
                    onClick={() => setPageDropdownOpen(true)}
                    onChange={(event) => handlePageInput(event.target.value)}
                    onBlur={() => {
                      window.setTimeout(() => {
                        if (
                          !pageDropdownRef.current?.contains(
                            document.activeElement,
                          )
                        ) {
                          validatePageInput();
                        }
                      }, 0);
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        validatePageInput();
                        setPageDropdownOpen(false);
                        event.currentTarget.blur();
                      }

                      if (event.key === "Escape") {
                        setPageInput(String(safeCurrentPage));
                        setPageDropdownOpen(false);
                        event.currentTarget.blur();
                      }

                      if (event.key === "ArrowDown") {
                        event.preventDefault();
                        setPageDropdownOpen(true);
                      }
                    }}
                    aria-label="Enter page number"
                    aria-expanded={pageDropdownOpen}
                    aria-controls="appointments-page-options"
                    aria-autocomplete="list"
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 pr-8 text-xs font-semibold text-slate-700 outline-none transition focus:border-[#0B63CE] focus:ring-4 focus:ring-blue-50"
                  />

                  <button
                    type="button"
                    aria-label="Toggle page selection"
                    aria-expanded={pageDropdownOpen}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => {
                      setPageDropdownOpen((open) => !open);
                    }}
                    className="absolute inset-y-0 right-0 flex w-8 items-center justify-center text-slate-400 transition hover:text-[#0B63CE]"
                  >
                    <ChevronDown
                      size={15}
                      className={`transition-transform ${
                        pageDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {pageDropdownOpen && (
                    <div
                      id="appointments-page-options"
                      role="listbox"
                      aria-label="Available pages"
                      className="absolute bottom-full left-0 z-50 mb-2 max-h-48 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-300/40"
                    >
                      {Array.from(
                        { length: totalPages },
                        (_, index) => index + 1,
                      ).map((page) => (
                        <button
                          key={page}
                          type="button"
                          role="option"
                          aria-selected={safeCurrentPage === page}
                          onMouseDown={(event) => event.preventDefault()}
                          onClick={() => goToPage(page)}
                          className={`mb-0.5 flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs font-semibold transition last:mb-0 ${
                            safeCurrentPage === page
                              ? "bg-blue-50 text-[#0B63CE]"
                              : "text-slate-600 hover:bg-slate-50 hover:text-[#0B63CE]"
                          }`}
                        >
                          <span>Page {page}</span>

                          {safeCurrentPage === page && (
                            <CheckCircle2
                              size={14}
                              className="text-[#0B63CE]"
                            />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <span className="whitespace-nowrap text-[10px] text-slate-400">
                  of {totalPages}
                </span>
              </div>

              {/* Previous, page numbers and next */}
              <div className="flex flex-wrap items-center gap-1.5 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => goToPage(safeCurrentPage - 1)}
                  disabled={safeCurrentPage <= 1}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-[#0B63CE] hover:text-[#0B63CE] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:text-slate-600"
                  aria-label="Previous page"
                >
                  <ChevronLeft size={15} />
                  <span className="hidden sm:inline">Previous</span>
                </button>

                {pageNumbers.map((page, index) =>
                  page === "ellipsis" ? (
                    <span
                      key={`ellipsis-${index}`}
                      className="px-1 text-xs text-slate-400"
                    >
                      …
                    </span>
                  ) : (
                    <button
                      key={page}
                      type="button"
                      onClick={() => goToPage(page)}
                      aria-label={`Go to page ${page}`}
                      aria-current={
                        safeCurrentPage === page ? "page" : undefined
                      }
                      className={`h-9 min-w-9 rounded-lg px-2.5 text-xs font-bold transition ${
                        safeCurrentPage === page
                          ? "bg-[#0B63CE] text-white shadow-sm"
                          : "border border-slate-200 bg-white text-slate-600 hover:border-[#0B63CE] hover:text-[#0B63CE]"
                      }`}
                    >
                      {page}
                    </button>
                  ),
                )}

                <button
                  type="button"
                  onClick={() => goToPage(safeCurrentPage + 1)}
                  disabled={safeCurrentPage >= totalPages}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-[#0B63CE] hover:text-[#0B63CE] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:text-slate-600"
                  aria-label="Next page"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>

            <p className="text-[10px] text-slate-400">
              Sample data · Not connected to the database
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="flex flex-col items-center justify-between gap-2 border-t border-slate-200/70 pt-5 pb-2 text-center sm:flex-row sm:text-left">
          <p className="text-[11px] text-slate-400">
            © 2026 Telemedicine Admin Panel. All rights reserved.
          </p>

          <p className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <ShieldCheck size={13} />
            Secure Admin Workspace
          </p>
        </footer>
      </div>
    </div>
  );
}

export default AdminDashboard;
