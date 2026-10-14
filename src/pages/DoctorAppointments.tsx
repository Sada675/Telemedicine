import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import {
  ArrowLeft,
  CalendarDays,
  CalendarCheck,
  Check,
  CheckCircle2,
  Clock3,
  Eye,
  FileText,
  Filter,
  Search,
  Users,
  X,
  XCircle,
  Stethoscope,
  Video,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

type AppointmentStatus =
  | "Pending"
  | "Approved"
  | "Rejected"
  | "Completed";

type Appointment = {
  id: number;
  patient: string;
  initials: string;
  email: string;
  type: string;
  date: string;
  time: string;
  reason: string;
  status: AppointmentStatus;
};

const initialAppointments: Appointment[] = [
  {
    id: 1,
    patient: "Ayesha Khan",
    initials: "AK",
    email: "ayesha.khan@example.com",
    type: "General Consultation",
    date: "Today",
    time: "04:00 PM",
    reason: "I have been experiencing headaches and dizziness.",
    status: "Pending",
  },
  {
    id: 2,
    patient: "Fatima Ahmed",
    initials: "FA",
    email: "fatima.ahmed@example.com",
    type: "Follow-up Consultation",
    date: "Today",
    time: "05:00 PM",
    reason:
      "I would like to discuss my previous consultation and medication.",
    status: "Pending",
  },
  {
    id: 3,
    patient: "Sara Ali",
    initials: "SA",
    email: "sara.ali@example.com",
    type: "Medical Consultation",
    date: "Tomorrow",
    time: "11:00 AM",
    reason: "I need advice regarding my general health.",
    status: "Approved",
  },
  {
    id: 4,
    patient: "Maryam Noor",
    initials: "MN",
    email: "maryam.noor@example.com",
    type: "General Consultation",
    date: "Tomorrow",
    time: "02:00 PM",
    reason: "I need guidance regarding my health concerns.",
    status: "Rejected",
  },
  {
    id: 5,
    patient: "Zainab Khan",
    initials: "ZK",
    email: "zainab.khan@example.com",
    type: "Follow-up Consultation",
    date: "Today",
    time: "10:00 AM",
    reason: "I want to review my previous consultation.",
    status: "Completed",
  },
];

const statusStyles: Record<AppointmentStatus, string> = {
  Pending: "border-amber-100 bg-amber-50 text-amber-700",
  Approved: "border-emerald-100 bg-emerald-50 text-emerald-700",
  Rejected: "border-red-100 bg-red-50 text-red-700",
  Completed: "border-blue-100 bg-blue-50 text-blue-700",
};

const filters = [
  "All",
  "Pending",
  "Approved",
  "Rejected",
  "Completed",
] as const;

type AppointmentFilter = (typeof filters)[number];

const getValidFilter = (
  filter: string | null
): AppointmentFilter => {
  if (filters.includes(filter as AppointmentFilter)) {
    return filter as AppointmentFilter;
  }

  return "All";
};

function DoctorAppointments() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [appointments, setAppointments] =
    useState<Appointment[]>(initialAppointments);

  const [activeFilter, setActiveFilter] =
    useState<AppointmentFilter>(() =>
      getValidFilter(searchParams.get("filter"))
    );

  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("All Dates");

  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    setActiveFilter(
      getValidFilter(searchParams.get("filter"))
    );
  }, [searchParams]);

  const handleFilterChange = (filter: AppointmentFilter) => {
    setActiveFilter(filter);

    setSearchParams(
      filter === "All" ? {} : { filter }
    );
  };

  const updateStatus = (
    id: number,
    status: "Approved" | "Rejected"
  ) => {
    setAppointments((previous) =>
      previous.map((appointment) =>
        appointment.id === id
          ? { ...appointment, status }
          : appointment
      )
    );

    setSelectedAppointment((previous) =>
      previous?.id === id
        ? { ...previous, status }
        : previous
    );

    setSuccessMessage(
      status === "Approved"
        ? "Appointment approved successfully."
        : "Appointment rejected successfully."
    );

    window.setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  };

  const stats = [
    {
      title: "Total Appointments",
      value: appointments.length,
      description: "All patient bookings",
      icon: CalendarDays,
      iconBg: "bg-blue-50",
      iconColor: "text-[#0B63CE]",
      filter: "All" as AppointmentFilter,
    },
    {
      title: "Pending",
      value: appointments.filter(
        (appointment) => appointment.status === "Pending"
      ).length,
      description: "Awaiting your decision",
      icon: Clock3,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
      filter: "Pending" as AppointmentFilter,
    },
    {
      title: "Approved",
      value: appointments.filter(
        (appointment) => appointment.status === "Approved"
      ).length,
      description: "Confirmed bookings",
      icon: CalendarCheck,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-700",
      filter: "Approved" as AppointmentFilter,
    },
    {
      title: "Rejected",
      value: appointments.filter(
        (appointment) => appointment.status === "Rejected"
      ).length,
      description: "Declined bookings",
      icon: XCircle,
      iconBg: "bg-red-50",
      iconColor: "text-red-600",
      filter: "Rejected" as AppointmentFilter,
    },
  ];

  const filteredAppointments = useMemo(() => {
    const normalizedSearch = searchTerm.toLowerCase().trim();

    return appointments.filter((appointment) => {
      const matchesStatus =
        activeFilter === "All" ||
        appointment.status === activeFilter;

      const matchesSearch =
        appointment.patient
          .toLowerCase()
          .includes(normalizedSearch) ||
        appointment.email
          .toLowerCase()
          .includes(normalizedSearch) ||
        appointment.type
          .toLowerCase()
          .includes(normalizedSearch);

      const matchesDate =
        dateFilter === "All Dates" ||
        appointment.date === dateFilter;

      return matchesStatus && matchesSearch && matchesDate;
    });
  }, [appointments, activeFilter, searchTerm, dateFilter]);

  const clearFilters = () => {
    setActiveFilter("All");
    setSearchTerm("");
    setDateFilter("All Dates");
    setSearchParams({});
  };

  // Pass the selected appointment's details to the consultation page.
  const getConsultationUrl = (appointment: Appointment) => {
    const params = new URLSearchParams({
      appointmentId: String(appointment.id),
      patient: appointment.patient,
      email: appointment.email,
      date: appointment.date,
      time: appointment.time,
      type: appointment.type,
      reason: appointment.reason,
    });

    return `/online-consultation?${params.toString()}`;
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f8faf9]">
      <Navbar />

      <main className="mx-auto w-full max-w-6xl px-4 pb-12 pt-28 sm:px-6 lg:px-8">
        {/* PAGE HEADER */}
        <section className="mb-7">
          <Link
            to="/doctor-dashboard"
            className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-[#0B63CE]"
          >
            <ArrowLeft size={17} />
            Back to Dashboard
          </Link>

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-[#0B63CE]">
                <Stethoscope size={14} />
                Doctor Portal
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-[#183b3b] sm:text-3xl">
                My Appointments
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                Manage your patient bookings, review appointment
                requests, and keep your consultation schedule organized.
              </p>
            </div>
          </div>
        </section>

        {/* STATISTICS CARDS */}
        <section className="mb-8">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-[#183b3b]">
              Appointment Overview
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Keep track of your booking activity.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-5">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <Link
                  key={stat.title}
                  to={
                    stat.filter === "All"
                      ? "/doctor-appointments"
                      : `/doctor-appointments?filter=${stat.filter}`
                  }
                  onClick={() =>
                    handleFilterChange(stat.filter)
                  }
                  aria-label={`View ${stat.title}`}
                  className="block rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-100 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#0B63CE] sm:p-5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-slate-500 sm:text-sm">
                        {stat.title}
                      </p>

                      <p className="mt-3 text-3xl font-bold text-[#183b3b]">
                        {stat.value}
                      </p>
                    </div>

                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl sm:h-11 sm:w-11 ${stat.iconBg} ${stat.iconColor}`}
                    >
                      <Icon size={21} />
                    </div>
                  </div>

                  <p className="mt-3 text-[11px] leading-4 text-slate-500 sm:text-xs">
                    {stat.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>

        {/* MAIN APPOINTMENTS SECTION */}
        <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-lg font-bold text-[#183b3b] sm:text-xl">
                {activeFilter === "All"
                  ? "All Bookings"
                  : `${activeFilter} Appointments`}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                View and manage your patient appointments.
              </p>
            </div>

            <div className="inline-flex w-fit items-center gap-2 rounded-xl bg-[#e5f4f2] px-3 py-2 text-sm font-semibold text-[#245b5b]">
              <Users size={17} />
              {filteredAppointments.length}{" "}
              {filteredAppointments.length === 1
                ? "Appointment"
                : "Appointments"}
            </div>
          </div>

          {/* SUCCESS MESSAGE */}
          {successMessage && (
            <div
              role="status"
              className="mt-5 flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700"
            >
              <CheckCircle2 size={18} />
              {successMessage}
            </div>
          )}

          {/* FILTERS AND SEARCH */}
          <div className="mt-6 space-y-4">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {filters.map((filter) => {
                const count =
                  filter === "All"
                    ? appointments.length
                    : appointments.filter(
                        (appointment) =>
                          appointment.status === filter
                      ).length;

                return (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => handleFilterChange(filter)}
                    aria-pressed={activeFilter === filter}
                    className={`inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition ${
                      activeFilter === filter
                        ? "bg-[#0B63CE] text-white shadow-sm"
                        : "border border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:bg-blue-50 hover:text-[#0B63CE]"
                    }`}
                  >
                    {filter}

                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        activeFilter === filter
                          ? "bg-white/20 text-white"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto]">
              <div className="relative">
                <Search
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) =>
                    setSearchTerm(event.target.value)
                  }
                  placeholder="Search patient name, email or consultation..."
                  aria-label="Search appointments"
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#0B63CE] focus:ring-4 focus:ring-blue-50"
                />
              </div>

              <div className="relative">
                <Filter
                  size={17}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <select
                  value={dateFilter}
                  onChange={(event) =>
                    setDateFilter(event.target.value)
                  }
                  aria-label="Filter appointments by date"
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-9 text-sm font-medium text-slate-600 outline-none transition focus:border-[#0B63CE] focus:ring-4 focus:ring-blue-50 sm:w-44"
                >
                  <option value="All Dates">All Dates</option>
                  <option value="Today">Today</option>
                  <option value="Tomorrow">Tomorrow</option>
                </select>
              </div>
            </div>
          </div>

          {/* APPOINTMENT LIST */}
          <div className="mt-6 space-y-4">
            {filteredAppointments.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-12 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-sm">
                  <CalendarDays size={27} />
                </div>

                <h3 className="mt-4 font-bold text-[#183b3b]">
                  No appointments found
                </h3>

                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                  No appointments match your current search or filters.
                  Try changing the filters or searching for another patient.
                </p>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-4 rounded-full bg-[#0B63CE] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0955AE]"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              filteredAppointments.map((appointment) => (
                <article
                  key={appointment.id}
                  className="rounded-2xl border border-slate-100 p-4 transition hover:border-blue-100 hover:shadow-sm sm:p-5"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    {/* PATIENT INFORMATION */}
                    <div className="flex min-w-0 items-start gap-3 sm:gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#e5f4f2] text-sm font-bold text-[#245b5b] sm:h-14 sm:w-14">
                        {appointment.initials}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-bold text-slate-800">
                            {appointment.patient}
                          </h3>

                          <span
                            className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold ${statusStyles[appointment.status]}`}
                          >
                            {appointment.status}
                          </span>
                        </div>

                        <p className="mt-1 break-all text-xs text-slate-500">
                          {appointment.email}
                        </p>

                        <p className="mt-2 text-sm font-medium text-slate-600">
                          {appointment.type}
                        </p>

                        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500">
                          <span className="inline-flex items-center gap-1.5">
                            <CalendarDays
                              size={15}
                              className="text-[#0B63CE]"
                            />
                            {appointment.date}
                          </span>

                          <span className="inline-flex items-center gap-1.5">
                            <Clock3
                              size={15}
                              className="text-[#0B63CE]"
                            />
                            {appointment.time}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* APPOINTMENT ACTIONS */}
                    <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4 lg:justify-end lg:border-0 lg:pt-0">
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedAppointment(appointment)
                        }
                        className="inline-flex items-center justify-center gap-1.5 rounded-full border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-[#0B63CE]"
                      >
                        <Eye size={16} />
                        Details
                      </button>

                      {appointment.status === "Pending" && (
                        <>
                          <button
                            type="button"
                            onClick={() =>
                              updateStatus(
                                appointment.id,
                                "Approved"
                              )
                            }
                            className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#0B63CE] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0955AE]"
                          >
                            <Check size={16} />
                            Accept
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              updateStatus(
                                appointment.id,
                                "Rejected"
                              )
                            }
                            className="inline-flex items-center justify-center gap-1.5 rounded-full border border-red-100 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                          >
                            <X size={16} />
                            Reject
                          </button>
                        </>
                      )}

                      {appointment.status === "Approved" && (
                        <>
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
                            <CheckCircle2 size={15} />
                            Confirmed
                          </span>

                          <Link
                            to={getConsultationUrl(appointment)}
                            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0B63CE] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0955AE]"
                          >
                            <Video size={16} />
                            Start Consultation
                          </Link>
                        </>
                      )}

                      {appointment.status === "Completed" && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700">
                          <FileText size={15} />
                          Completed
                        </span>
                      )}

                      {appointment.status === "Rejected" && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">
                          <XCircle size={15} />
                          Declined
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>

          {/* BOTTOM INFORMATION */}
          {filteredAppointments.length > 0 && (
            <div className="mt-5 flex flex-col gap-2 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-slate-500">
                Showing {filteredAppointments.length} of{" "}
                {appointments.length} appointments
              </p>
            </div>
          )}
        </section>

        {/* FOOTER NOTE */}
        <p className="mt-8 text-center text-xs text-slate-400">
          Telemedicine Doctor Portal · Demonstration data
        </p>
      </main>

      {/* APPOINTMENT DETAILS MODAL */}
      {selectedAppointment && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
          onClick={() => setSelectedAppointment(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="appointment-details-title"
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:p-7"
            onClick={(event) => event.stopPropagation()}
          >
            {/* MODAL HEADER */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-[#0B63CE]">
                  Appointment Details
                </p>

                <h2
                  id="appointment-details-title"
                  className="mt-1 text-xl font-bold text-[#183b3b]"
                >
                  {selectedAppointment.patient}
                </h2>
              </div>

              <button
                type="button"
                aria-label="Close appointment details"
                onClick={() => setSelectedAppointment(null)}
                className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            {/* PATIENT INFORMATION */}
            <div className="mt-6 flex items-center gap-3 rounded-xl bg-[#f8faf9] p-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#e5f4f2] font-bold text-[#245b5b]">
                {selectedAppointment.initials}
              </div>

              <div className="min-w-0">
                <h3 className="font-semibold text-slate-800">
                  {selectedAppointment.patient}
                </h3>

                <p className="mt-1 break-all text-xs text-slate-500">
                  {selectedAppointment.email}
                </p>
              </div>
            </div>

            {/* APPOINTMENT DETAILS */}
            <div className="mt-5 space-y-5">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Consultation Type
                </p>

                <p className="mt-1 font-semibold text-slate-700">
                  {selectedAppointment.type}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-slate-100 p-3">
                  <CalendarDays
                    size={19}
                    className="text-[#0B63CE]"
                  />

                  <p className="mt-2 text-xs text-slate-500">
                    Appointment Date
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-700">
                    {selectedAppointment.date}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-100 p-3">
                  <Clock3
                    size={19}
                    className="text-[#0B63CE]"
                  />

                  <p className="mt-2 text-xs text-slate-500">
                    Appointment Time
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-700">
                    {selectedAppointment.time}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Reason for Visit
                </p>

                <p className="mt-2 rounded-xl bg-[#f8faf9] p-4 text-sm leading-6 text-slate-600">
                  {selectedAppointment.reason}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Appointment Status
                </p>

                <span
                  className={`mt-2 inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${statusStyles[selectedAppointment.status]}`}
                >
                  {selectedAppointment.status === "Approved" ? (
                    <CheckCircle2 size={14} />
                  ) : selectedAppointment.status === "Rejected" ? (
                    <XCircle size={14} />
                  ) : selectedAppointment.status === "Completed" ? (
                    <FileText size={14} />
                  ) : (
                    <Clock3 size={14} />
                  )}

                  {selectedAppointment.status}
                </span>
              </div>
            </div>

            {/* MODAL ACTIONS */}
            {selectedAppointment.status === "Pending" ? (
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() =>
                    updateStatus(
                      selectedAppointment.id,
                      "Approved"
                    )
                  }
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#0B63CE] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0955AE]"
                >
                  <Check size={17} />
                  Accept Appointment
                </button>

                <button
                  type="button"
                  onClick={() =>
                    updateStatus(
                      selectedAppointment.id,
                      "Rejected"
                    )
                  }
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-red-200 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                >
                  <X size={17} />
                  Reject
                </button>
              </div>
            ) : selectedAppointment.status === "Approved" ? (
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  to={getConsultationUrl(selectedAppointment)}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#0B63CE] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0955AE]"
                >
                  <Video size={17} />
                  Start Consultation
                </Link>

                <button
                  type="button"
                  onClick={() => setSelectedAppointment(null)}
                  className="rounded-full border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  Close Details
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setSelectedAppointment(null)}
                className="mt-6 w-full rounded-full bg-[#0B63CE] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0955AE]"
              >
                Close Details
              </button>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default DoctorAppointments;
