import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  CalendarPlus,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileText,
  Filter,
  Stethoscope,
  X,
  XCircle,
} from "lucide-react";

import drMunib from "../assets/dr-munib121.jpg";
import ladyDoc from "../assets/lady-doc.jpg";

type AppointmentStatus =
  | "Pending"
  | "Approved"
  | "Completed"
  | "Cancelled";

type Appointment = {
  id: string;
  doctor: string;
  specialty: string;
  image: string;
  date: string;
  time: string;
  fee: string;
  status: AppointmentStatus;
  type: string;
};

const initialAppointments: Appointment[] = [
  {
    id: "APT-10263481",
    doctor: "Dr. Munib",
    specialty: "Medical Specialist",
    image: drMunib,
    date: "Oct 10, 2026",
    time: "04:00 PM",
    fee: "PKR 3,000",
    status: "Approved",
    type: "Online Consultation",
  },
  {
    id: "APT-10263482",
    doctor: "Dr. Nazli",
    specialty: "Medical Specialist",
    image: ladyDoc,
    date: "Oct 12, 2026",
    time: "11:00 AM",
    fee: "PKR 3,000",
    status: "Pending",
    type: "Online Consultation",
  },
  {
    id: "APT-10263483",
    doctor: "Dr. Munib",
    specialty: "Medical Specialist",
    image: drMunib,
    date: "Oct 05, 2026",
    time: "02:00 PM",
    fee: "PKR 3,000",
    status: "Completed",
    type: "Online Consultation",
  },
  {
    id: "APT-10263484",
    doctor: "Dr. Nazli",
    specialty: "Medical Specialist",
    image: ladyDoc,
    date: "Oct 03, 2026",
    time: "10:00 AM",
    fee: "PKR 3,000",
    status: "Cancelled",
    type: "Online Consultation",
  },
];

const filters = [
  "All",
  "Upcoming",
  "Pending",
  "Completed",
  "Cancelled",
] as const;

type FilterType = (typeof filters)[number];

function Appointments() {
  const [appointments, setAppointments] =
    useState<Appointment[]>(initialAppointments);

  const [searchParams] = useSearchParams();

const [activeFilter, setActiveFilter] = useState(
  searchParams.get("filter") === "upcoming" ? "Upcoming" : "All"
);

  const [appointmentToCancel, setAppointmentToCancel] =
    useState<string | null>(null);

  const getCount = (status: FilterType) => {
    if (status === "All") {
      return appointments.length;
    }

    if (status === "Upcoming") {
      return appointments.filter(
        (appointment) =>
          appointment.status === "Approved" ||
          appointment.status === "Pending",
      ).length;
    }

    return appointments.filter(
      (appointment) => appointment.status === status,
    ).length;
  };

  const filteredAppointments = appointments.filter(
    (appointment) => {
      if (activeFilter === "All") return true;

      if (activeFilter === "Upcoming") {
        return (
          appointment.status === "Approved" ||
          appointment.status === "Pending"
        );
      }

      return appointment.status === activeFilter;
    },
  );

  const cancelAppointment = () => {
    if (!appointmentToCancel) return;

    setAppointments((previousAppointments) =>
      previousAppointments.map((appointment) =>
        appointment.id === appointmentToCancel
          ? { ...appointment, status: "Cancelled" }
          : appointment,
      ),
    );

    setAppointmentToCancel(null);
  };

  const statusStyles: Record<AppointmentStatus, string> = {
    Pending: "bg-amber-50 text-amber-700 ring-amber-200",
    Approved: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    Completed: "bg-blue-50 text-blue-700 ring-blue-200",
    Cancelled: "bg-rose-50 text-rose-700 ring-rose-200",
  };

  const summaryCards = [
    {
      label: "Total Appointments",
      value: appointments.length,
      icon: CalendarDays,
      iconBg: "bg-[#e5f4f2]",
      iconColor: "text-[#245b5b]",
      filter: "All" as FilterType,
    },
    {
      label: "Upcoming",
      value: getCount("Upcoming"),
      icon: Clock3,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      filter: "Upcoming" as FilterType,
    },
    {
      label: "Pending Approval",
      value: getCount("Pending"),
      icon: FileText,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
      filter: "Pending" as FilterType,
    },
    {
      label: "Completed",
      value: getCount("Completed"),
      icon: CheckCircle2,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      filter: "Completed" as FilterType,
    },
  ];

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#f8faf9]">
      <Navbar />

      <main className="mx-auto w-full max-w-7xl px-4 pb-12 pt-[96px] sm:px-6 lg:px-8">
        {/* Back Navigation */}
        <Link
          to="/patient-dashboard"
          className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 no-underline transition hover:text-[#0B63CE]"
        >
          <ArrowLeft size={17} />
          Back to Dashboard
        </Link>

        {/* Page Header */}
        <section className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#245b5b]">
              <CalendarDays size={17} />
              Patient Portal
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-[#183b3b] sm:text-3xl">
              My Appointments
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
              Manage your consultations, track appointment
              status, and stay connected with your doctors.
            </p>
          </div>

          <Link
            to="/book-appointment"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0B63CE] px-5 py-3 text-sm font-semibold text-white no-underline shadow-sm transition hover:bg-[#0955AE] sm:w-auto"
          >
            <CalendarPlus size={18} />
            Book Appointment
          </Link>
        </section>

        {/* Summary Cards */}
        <section className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {summaryCards.map((card) => {
            const Icon = card.icon;

            return (
              <button
                key={card.label}
                type="button"
                onClick={() => setActiveFilter(card.filter)}
                className={`rounded-2xl border bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-5 ${
                  activeFilter === card.filter
                    ? "border-[#245b5b]/40 ring-1 ring-[#245b5b]/10"
                    : "border-slate-100"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl sm:h-11 sm:w-11 ${card.iconBg} ${card.iconColor}`}
                  >
                    <Icon size={21} />
                  </div>

                  <ChevronRight
                    size={17}
                    className="text-slate-300"
                  />
                </div>

                <p className="mt-4 text-2xl font-bold text-[#183b3b] sm:text-3xl">
                  {card.value}
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
                  {card.label}
                </p>
              </button>
            );
          })}
        </section>

        {/* Appointment List Container */}
        <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
          {/* List Header */}
          <div className="border-b border-slate-100 p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-[#183b3b]">
                  Your Consultations
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {filteredAppointments.length}{" "}
                  {filteredAppointments.length === 1
                    ? "appointment"
                    : "appointments"}{" "}
                  found
                </p>
              </div>

              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Filter size={17} />
                <span>Filter by status</span>
              </div>
            </div>

            {/* Filters */}
            <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
              {filters.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
                    activeFilter === filter
                      ? "bg-[#183b3b] text-white shadow-sm"
                      : "bg-slate-50 text-slate-600 hover:bg-[#e5f4f2] hover:text-[#183b3b]"
                  }`}
                >
                  {filter}
                  <span className="ml-2 text-xs opacity-75">
                    {getCount(filter)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Appointment Cards */}
          <div className="space-y-4 bg-[#fcfdfc] p-4 sm:p-6">
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((appointment) => (
                <article
                  key={appointment.id}
                  className="overflow-hidden rounded-2xl border border-slate-100 bg-white transition hover:border-slate-200 hover:shadow-md"
                >
                  {/* Card Top */}
                  <div className="flex flex-col gap-4 p-4 sm:p-5 md:flex-row md:items-center md:justify-between">
                    <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                      <img
                        src={appointment.image}
                        alt={appointment.doctor}
                        className="h-[68px] w-[68px] shrink-0 rounded-2xl border border-slate-100 object-cover sm:h-20 sm:w-20"
                      />

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-base font-bold text-[#183b3b] sm:text-lg">
                            {appointment.doctor}
                          </h3>

                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold ring-1 sm:text-xs ${statusStyles[appointment.status]}`}
                          >
                            {appointment.status === "Approved" && (
                              <CheckCircle2 size={12} />
                            )}

                            {appointment.status === "Pending" && (
                              <Clock3 size={12} />
                            )}

                            {appointment.status === "Completed" && (
                              <CheckCircle2 size={12} />
                            )}

                            {appointment.status === "Cancelled" && (
                              <XCircle size={12} />
                            )}

                            {appointment.status}
                          </span>
                        </div>

                        <p className="mt-1 text-sm text-slate-500">
                          {appointment.specialty}
                        </p>

                        <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
                          <Stethoscope size={13} />
                          {appointment.type}
                        </p>
                      </div>
                    </div>

                    <div className="rounded-xl bg-[#f8faf9] px-4 py-3 md:min-w-[150px]">
                      <p className="text-xs text-slate-400">
                        Appointment Fee
                      </p>

                      <p className="mt-1 text-base font-bold text-[#183b3b]">
                        {appointment.fee}
                      </p>

                      <p className="mt-1 text-[11px] text-slate-400">
                        Reference: {appointment.id}
                      </p>
                    </div>
                  </div>

                  {/* Date and Time */}
                  <div className="grid grid-cols-2 gap-3 border-t border-slate-100 px-4 py-4 sm:px-5 md:grid-cols-3">
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#e5f4f2] text-[#245b5b]">
                        <CalendarDays size={17} />
                      </div>

                      <div>
                        <p className="text-xs text-slate-400">
                          Date
                        </p>

                        <p className="mt-1 text-sm font-semibold text-slate-700">
                          {appointment.date}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <Clock3 size={17} />
                      </div>

                      <div>
                        <p className="text-xs text-slate-400">
                          Time
                        </p>

                        <p className="mt-1 text-sm font-semibold text-slate-700">
                          {appointment.time}
                        </p>
                      </div>
                    </div>

                    <div className="col-span-2 flex items-center gap-2 md:col-span-1 md:justify-end">
                      {appointment.status === "Approved" && (
                        <span className="text-xs font-medium text-emerald-700">
                          Your appointment is approved.
                        </span>
                      )}

                      {appointment.status === "Pending" && (
                        <span className="text-xs font-medium text-amber-700">
                          Waiting for doctor approval.
                        </span>
                      )}

                      {appointment.status === "Completed" && (
                        <span className="text-xs font-medium text-blue-700">
                          Consultation completed.
                        </span>
                      )}

                      {appointment.status === "Cancelled" && (
                        <span className="text-xs font-medium text-rose-600">
                          This appointment is cancelled.
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-white px-4 py-4 sm:px-5">
                    <p className="text-xs text-slate-400">
                      Booking ID: {appointment.id}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {(appointment.status === "Approved" ||
                        appointment.status === "Pending") && (
                        <button
                          type="button"
                          onClick={() =>
                            setAppointmentToCancel(appointment.id)
                          }
                          className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 sm:text-sm"
                        >
                          <X size={15} />
                          Cancel
                        </button>
                      )}
                      
                      {appointment.status === "Approved" && (
                        <Link
    to="/consultation"
    className="inline-flex items-center gap-1.5 rounded-lg bg-[#0B63CE] px-3 py-2 text-xs font-semibold text-white no-underline transition hover:bg-[#0955AE] sm:text-sm"
  >
    Join Consultation
    <ChevronRight size={15} />
  </Link>
)}

                    </div>
                  </div>
                </article>
              ))
            ) : (
              /* Empty State */
              <div className="px-4 py-14 text-center sm:py-20">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#e5f4f2] text-[#245b5b]">
                  <CalendarDays size={30} />
                </div>

                <h3 className="mt-5 text-lg font-bold text-[#183b3b]">
                  No appointments found
                </h3>

                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                  There are no appointments in this category yet.
                  Book a consultation when you need medical guidance.
                </p>

                <Link
                  to="/book-appointment"
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#0B63CE] px-5 py-3 text-sm font-semibold text-white no-underline transition hover:bg-[#0955AE]"
                >
                  <CalendarPlus size={17} />
                  Book Appointment
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Helpful Note */}
        <div className="mt-5 flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50/70 p-4">
          <div className="mt-0.5 text-blue-600">
            <FileText size={19} />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-800">
              Need help with an appointment?
            </h3>

            <p className="mt-1 text-xs leading-5 text-slate-600 sm:text-sm">
              Your appointment status is shown above. Video
              consultations and server-side appointment management
              will be connected during backend integration.
            </p>
          </div>
        </div>
      </main>

      <Footer />

      {/* Cancel Confirmation Modal */}
      {appointmentToCancel && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 px-4 py-6 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="cancel-title"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl sm:p-7"
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
              <XCircle size={28} />
            </div>

            <h2
              id="cancel-title"
              className="mt-4 text-center text-xl font-bold text-[#183b3b]"
            >
              Cancel appointment?
            </h2>

            <p className="mt-2 text-center text-sm leading-6 text-slate-500">
              Are you sure you want to cancel this appointment?
              You can close this window if you do not want to proceed.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setAppointmentToCancel(null)}
                className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Keep Appointment
              </button>

              <button
                type="button"
                onClick={cancelAppointment}
                className="rounded-xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-rose-700"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Appointments;
