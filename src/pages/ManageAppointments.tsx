import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import {
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
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Stethoscope,
  Users,
  X,
  RotateCcw,
  ClipboardCheck,
  Home,
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
    // Use demo data if stored data cannot be read.
  }

  return initialAppointments;
}

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
  return (
    new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 0,
    }).format(fee) + ` ${currency}`
  );
}

function getStatusClasses(status: AppointmentStatus) {
  switch (status) {
    case "Pending":
      return "border-amber-100 bg-amber-50 text-amber-700";

    case "Confirmed":
      return "border-emerald-100 bg-emerald-50 text-emerald-700";

    case "Cancelled":
      return "border-red-100 bg-red-50 text-red-700";

    case "Completed":
      return "border-blue-100 bg-blue-50 text-blue-700";
  }
}

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
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

function AdminAppointments() {
  const [appointments, setAppointments] =
    useState<Appointment[]>(readAppointments);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [doctorFilter, setDoctorFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");

  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

  const [notice, setNotice] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [rowsPerPage, setRowsPerPage] = useState(3);
  const [rowsPerPageInput, setRowsPerPageInput] = useState("3");
  const [pageInput, setPageInput] = useState("1");
  const [pageDropdownOpen, setPageDropdownOpen] = useState(false);
  const pageDropdownRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (
        pageDropdownRef.current &&
        !pageDropdownRef.current.contains(event.target as Node)
      ) {
        setPageDropdownOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setPageDropdownOpen(false);
        setSelectedAppointment(null);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const doctors = useMemo(
    () => [...new Set(appointments.map((appointment) => appointment.doctorName))],
    [appointments]
  );

  const stats = useMemo(
    () => [
      {
        label: "Total Appointments",
        value: appointments.length,
        icon: CalendarDays,
        iconBg: "bg-blue-50",
        iconColor: "text-[#0B63CE]",
        description: "All appointment records",
      },
      {
        label: "Pending",
        value: appointments.filter((a) => a.status === "Pending").length,
        icon: Clock3,
        iconBg: "bg-amber-50",
        iconColor: "text-amber-600",
        description: "Awaiting confirmation",
      },
      {
        label: "Confirmed",
        value: appointments.filter((a) => a.status === "Confirmed").length,
        icon: CheckCircle2,
        iconBg: "bg-emerald-50",
        iconColor: "text-emerald-600",
        description: "Approved appointments",
      },
      {
        label: "Cancelled",
        value: appointments.filter((a) => a.status === "Cancelled").length,
        icon: XCircle,
        iconBg: "bg-red-50",
        iconColor: "text-red-600",
        description: "Cancelled appointments",
      },
    ],
    [appointments]
  );

  const filteredAppointments = useMemo(() => {
    const query = search.trim().toLowerCase();

    return appointments.filter((appointment) => {
      const searchableValues = [
        appointment.id,
        appointment.patientName,
        appointment.patientEmail,
        appointment.patientPhone,
        appointment.doctorName,
        appointment.specialty,
        appointment.reason,
      ];

      const matchesSearch = searchableValues.some((value) =>
        value.toLowerCase().includes(query)
      );

      const matchesStatus =
        statusFilter === "All" || appointment.status === statusFilter;

      const matchesDoctor =
        doctorFilter === "All" || appointment.doctorName === doctorFilter;

      const matchesDate =
        !dateFilter || appointment.date === dateFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesDoctor &&
        matchesDate
      );
    });
  }, [appointments, search, statusFilter, doctorFilter, dateFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredAppointments.length / rowsPerPage)
  );

  const safeCurrentPage = Math.min(currentPage, totalPages);

  const startIndex =
    filteredAppointments.length === 0
      ? 0
      : (safeCurrentPage - 1) * rowsPerPage;

  const endIndex = Math.min(
    startIndex + rowsPerPage,
    filteredAppointments.length
  );

  const paginatedAppointments = filteredAppointments.slice(
    startIndex,
    endIndex
  );

  // Generate compact pagination buttons with ellipses.
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
    const lastMiddlePage = Math.min(
      totalPages - 1,
      safeCurrentPage + 1
    );

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


  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }

    setPageInput(String(Math.min(currentPage, totalPages)));
  }, [currentPage, totalPages]);

  function goToPage(page: number) {
    const nextPage = Math.max(1, Math.min(page, totalPages));

    setCurrentPage(nextPage);
    setPageInput(String(nextPage));
    setPageDropdownOpen(false);
  }

  function handlePageInput(value: string) {
    if (value !== "" && !/^\d+$/.test(value)) return;
    setPageInput(value);
  }

  function validatePageInput() {
    if (pageInput.trim() === "") {
      setPageInput(String(safeCurrentPage));
      return;
    }

    goToPage(Number(pageInput));
  }

  function changeRowsPerPage(value: number) {
  if (
    !Number.isInteger(value) ||
    value < 1 ||
    value > 10000
  ) {
    return;
  }

  setRowsPerPage(value);
  setRowsPerPageInput(String(value));

  setCurrentPage(1);
  setPageInput("1");
  setPageDropdownOpen(false);
}


function handleRowsPerPageInput(value: string) {
  setRowsPerPageInput(value);

  if (value.trim() === "") return;

  const number = Number(value);

  if (
    Number.isInteger(number) &&
    number >= 1 &&
    number <= 10000
  ) {
    setRowsPerPage(number);
    setCurrentPage(1);
    setPageInput("1");
    setPageDropdownOpen(false);
  }
}
  

function validateRowsPerPageInput() {
  const value = Number(rowsPerPageInput);

  if (
    rowsPerPageInput.trim() === "" ||
    !Number.isInteger(value) ||
    value < 1 ||
    value > 10000
  ) {
    setRowsPerPageInput(String(rowsPerPage));
    return;
  }

  changeRowsPerPage(value);
}

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

  function clearFilters() {
    setSearch("");
    setStatusFilter("All");
    setDoctorFilter("All");
    setDateFilter("");
    setCurrentPage(1);
    setPageInput("1");
  }

  function changeSearch(value: string) {
    setSearch(value);
    setCurrentPage(1);
    setPageInput("1");
  }

  function changeStatusFilter(value: string) {
    setStatusFilter(value);
    setCurrentPage(1);
    setPageInput("1");
  }

  function changeDoctorFilter(value: string) {
    setDoctorFilter(value);
    setCurrentPage(1);
    setPageInput("1");
  }

  function changeDateFilter(value: string) {
    setDateFilter(value);
    setCurrentPage(1);
    setPageInput("1");
  }

  const hasActiveFilters =
    search.trim() !== "" ||
    statusFilter !== "All" ||
    doctorFilter !== "All" ||
    dateFilter !== "";

  return (
  <div className="min-h-screen w-full bg-[#f8faf9] text-slate-800">
  <main className="mx-auto w-full max-w-[1200px] space-y-7 px-4 py-9 sm:px-6 lg:px-8 xl:px-10">
 
{/* Page Heading */}
<section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
  <div>
    {/* Breadcrumb */}
    <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
      <Link
        to="/admin-dashboard"
        className="flex items-center gap-1.5 text-slate-500 transition hover:text-[#0B63CE]"
      >
        <Home size={15} />
        Dashboard
      </Link>

      <ChevronRight size={15} className="text-slate-400" />

      <span className="font-semibold text-[#0B63CE]">
        Manage Appointments
      </span>
    </div>

    {/* Heading */}
    <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">
      Manage Appointments
    </h1>

    {/* Description */}
    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
      View, filter and manage patient appointments, consultation schedules,
      and appointment statuses.
    </p>
  </div>

  {/* Total Appointments */}
  <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-slate-200/80 bg-white px-4 py-3 shadow-sm">
    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-[#0B63CE]">
      <CalendarCheck size={21} />
    </div>

    <div>
      <p className="text-xs font-medium text-slate-400">
        Total Appointments
      </p>

      <p className="mt-1 text-sm font-extrabold text-[#183b3b]">
        {appointments.length} registered
      </p>
    </div>
  </div>
</section>


        {/* Success notice */}
        {notice && (
          <div
            role="status"
            className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
          >
            <CheckCircle2 size={18} />
            <span>{notice}</span>
          </div>
        )}

        {/* Statistics cards */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      {stat.label}
                    </p>

                    <p className="mt-3 text-3xl font-bold text-[#183b3b]">
                      {stat.value}
                    </p>
                  </div>

                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${stat.iconBg} ${stat.iconColor}`}
                  >
                    <Icon size={23} />
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-1 text-xs text-slate-400">
                  <ArrowUpRight size={14} />
                  <span>{stat.description}</span>
                </div>
              </div>
            );
          })}
        </section>

        {/* Appointments table */}
        <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
          {/* Table heading and filters */}
          <div className="space-y-4 border-b border-slate-100 p-5 sm:p-6">
            <div>
              <h2 className="text-lg font-bold text-[#183b3b]">
                Appointment Records
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Search records, filter appointments and update their status.
              </p>
            </div>

            {/* Search */}
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="search"
                value={search}
                onChange={(event) => changeSearch(event.target.value)}
                placeholder="Search appointment ID, patient, email, phone or doctor..."
                aria-label="Search appointments"
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#0B63CE] focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <div className="relative">
                <Filter
                  size={17}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <select
                  value={statusFilter}
                  onChange={(event) =>
                    changeStatusFilter(event.target.value)
                  }
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

              <div className="relative">
                <Stethoscope
                  size={17}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <select
                  value={doctorFilter}
                  onChange={(event) =>
                    changeDoctorFilter(event.target.value)
                  }
                  aria-label="Filter by doctor"
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-9 text-sm text-slate-700 outline-none focus:border-[#0B63CE] focus:ring-2 focus:ring-blue-100"
                >
                  <option value="All">All Doctors</option>

                  {doctors.map((doctor) => (
                    <option key={doctor} value={doctor}>
                      {doctor}
                    </option>
                  ))}
                </select>

                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>

              <div className="relative">
                <CalendarDays
                  size={17}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="date"
                  value={dateFilter}
                  onChange={(event) =>
                    changeDateFilter(event.target.value)
                  }
                  aria-label="Filter by appointment date"
                  className="w-full min-w-0 rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-3 text-sm text-slate-700 outline-none focus:border-[#0B63CE] focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <button
                type="button"
                onClick={clearFilters}
                disabled={!hasActiveFilters}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-[#0B63CE] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RotateCcw size={16} />
                Clear Filters
              </button>
            </div>

            {hasActiveFilters && (
              <p className="text-xs text-slate-500">
                Showing {filteredAppointments.length} matching appointment
                {filteredAppointments.length === 1 ? "" : "s"}.
              </p>
            )}
          </div>

          {/* Responsive table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-[#f8faf9]">
                  {[
                    "Appointment",
                    "Patient",
                    "Doctor",
                    "Date & Time",
                    "Fee",
                    "Status",
                    "Actions",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="whitespace-nowrap px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {paginatedAppointments.map((appointment) => (
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
                          {getInitials(appointment.patientName)}
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

                        {(appointment.status === "Pending" ||
                          appointment.status === "Confirmed") && (
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
                        Try changing your search or filters.
                      </p>

                      <button
                        type="button"
                        onClick={clearFilters}
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

{/* Pagination footer */}
<div className="flex flex-col gap-4 border-t border-slate-100 bg-[#fcfdff] px-5 py-4 sm:px-6">
  <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
    {/* Rows per page and summary */}
    <div className="flex flex-wrap items-center gap-x-3 gap-y-3">
      <label
        htmlFor="appointments-rows-per-page"
        className="whitespace-nowrap text-[11px] text-slate-500"
      >
        Result per page:
      </label>

      <select
        aria-label="Choose rows per page"
        value={
          [3, 5, 10, 20].includes(rowsPerPage)
            ? String(rowsPerPage)
            : "custom"
        }
        onChange={(event) => {
          if (event.target.value !== "custom") {
            changeRowsPerPage(Number(event.target.value));
          }
        }}
        className="w-[85px] rounded-lg border border-slate-200 bg-white px-2 py-2 text-xs font-semibold text-slate-700 outline-none transition focus:border-[#0B63CE] focus:ring-4 focus:ring-blue-50"
      >
        <option value="3">3</option>
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="20">20</option>
      </select>

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

      <p className="text-[11px] text-slate-500" aria-live="polite">
        Showing{" "}
        <span className="font-bold text-slate-700">
          {startIndex + (filteredAppointments.length > 0 ? 1 : 0)}–{endIndex}
        </span>{" "}
        of{" "}
        <span className="font-bold text-slate-700">
          {filteredAppointments.length}
        </span>{" "}
        appointments
      </p>
    </div>

    {/* Page Selection: dropdown opens upward */}
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
          onChange={(event) =>
            handlePageInput(event.target.value)
          }
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
          onClick={() =>
            setPageDropdownOpen((open) => !open)
          }
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
    Appointment information overview · Sample data
  </p>
</div>

        </section>
      </main>

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

                <h2
                  id="appointment-modal-title"
                  className="text-xl font-bold text-[#183b3b]"
                >
                  {selectedAppointment.id}
                </h2>

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
              {/* Status and fee */}
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
                  <p className="text-xs text-slate-500">
                    Consultation Fee
                  </p>

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
                <h3 className="mb-3 font-semibold text-[#183b3b]">
                  Patient Information
                </h3>

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
                    icon={<Users size={17} />}
                    label="Patient ID"
                    value={`Patient for ${selectedAppointment.id}`}
                  />
                </div>
              </div>

              {/* Consultation information */}
              <div>
                <h3 className="mb-3 font-semibold text-[#183b3b]">
                  Consultation Information
                </h3>

                <div className="grid gap-3 sm:grid-cols-2">
                  <DetailItem
                    icon={<Stethoscope size={17} />}
                    label="Doctor"
                    value={selectedAppointment.doctorName}
                  />

                  <DetailItem
                    icon={<ClipboardCheck size={17} />}
                    label="Specialty"
                    value={selectedAppointment.specialty}
                  />

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
                    icon={<CalendarCheck size={17} />}
                    label="Appointment ID"
                    value={selectedAppointment.id}
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
            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 p-5 sm:flex-row sm:flex-wrap sm:justify-end sm:p-6">
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

              {(selectedAppointment.status === "Pending" ||
                selectedAppointment.status === "Confirmed") && (
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

              {selectedAppointment.status === "Confirmed" && (
                <button
                  type="button"
                  onClick={() =>
                    updateStatus(selectedAppointment.id, "Completed")
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
                >
                  <CheckCircle2 size={17} />
                  Mark Completed
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminAppointments;
