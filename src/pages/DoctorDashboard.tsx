import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  Clock3,
  CheckCircle2,
  ArrowRight,
  Video,
  FileText,
  Check,
  X,
  CalendarCheck,
  Activity,
  ShieldCheck,
  Eye,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import drMunibImage from "../assets/dr-munib121.jpg";

const DOCTORS_STORAGE_KEY = "telemedicineAdminDoctors";

type DoctorProfile = {
  id: string;
  name: string;
  specialty: string;
  qualification: string;
  pmdcNumber: string;
  languages: string[];
  feePKR: number;
  feeUSD: number;
  nextAvailableSlot: string;
  status: "Active" | "Inactive";
  image: string;
};

const defaultDoctorProfile: DoctorProfile = {
  id: "munib",
  name: "Dr. Munib",
  specialty: "Medical Specialist",
  qualification: "MBBS, FCPS",
  pmdcNumber: "XXXXX-M",
  languages: ["English", "Urdu"],
  feePKR: 3000,
  feeUSD: 25,
  nextAvailableSlot: "Today • 04:00 PM",
  status: "Active",
  image: drMunibImage,
};

function getDoctorProfile(): DoctorProfile {
  try {
    const savedData = localStorage.getItem(DOCTORS_STORAGE_KEY);

    if (!savedData) {
      return defaultDoctorProfile;
    }

    const savedDoctors: unknown = JSON.parse(savedData);

    if (!Array.isArray(savedDoctors)) {
      return defaultDoctorProfile;
    }

    const savedDoctor = savedDoctors.find(
      (doctor: Partial<DoctorProfile>) =>
        doctor && String(doctor.id) === "munib"
    ) as Partial<DoctorProfile> | undefined;

    if (!savedDoctor) {
      return defaultDoctorProfile;
    }

    const savedImage =
      typeof savedDoctor.image === "string"
        ? savedDoctor.image.trim()
        : "";

    const validImage =
      savedImage.startsWith("data:image/") ||
      savedImage.startsWith("https://") ||
      savedImage.startsWith("http://");

    return {
      ...defaultDoctorProfile,
      ...savedDoctor,

      id: "munib",

      name:
        typeof savedDoctor.name === "string" &&
        savedDoctor.name.trim()
          ? savedDoctor.name
          : defaultDoctorProfile.name,

      specialty:
        typeof savedDoctor.specialty === "string" &&
        savedDoctor.specialty.trim()
          ? savedDoctor.specialty
          : defaultDoctorProfile.specialty,

      qualification:
        typeof savedDoctor.qualification === "string" &&
        savedDoctor.qualification.trim()
          ? savedDoctor.qualification
          : defaultDoctorProfile.qualification,

      pmdcNumber:
        typeof savedDoctor.pmdcNumber === "string" &&
        savedDoctor.pmdcNumber.trim()
          ? savedDoctor.pmdcNumber
          : defaultDoctorProfile.pmdcNumber,

      languages:
        Array.isArray(savedDoctor.languages) &&
        savedDoctor.languages.every(
          (language) => typeof language === "string"
        )
          ? savedDoctor.languages
          : defaultDoctorProfile.languages,

      feePKR:
        typeof savedDoctor.feePKR === "number" &&
        Number.isFinite(savedDoctor.feePKR)
          ? savedDoctor.feePKR
          : defaultDoctorProfile.feePKR,

      feeUSD:
        typeof savedDoctor.feeUSD === "number" &&
        Number.isFinite(savedDoctor.feeUSD)
          ? savedDoctor.feeUSD
          : defaultDoctorProfile.feeUSD,

      nextAvailableSlot:
        typeof savedDoctor.nextAvailableSlot === "string" &&
        savedDoctor.nextAvailableSlot.trim()
          ? savedDoctor.nextAvailableSlot
          : defaultDoctorProfile.nextAvailableSlot,

      status:
        savedDoctor.status === "Active" ||
        savedDoctor.status === "Inactive"
          ? savedDoctor.status
          : defaultDoctorProfile.status,

      image: validImage
        ? savedImage
        : defaultDoctorProfile.image,
    };
  } catch (error) {
    console.error("Unable to load doctor profile:", error);
    return defaultDoctorProfile;
  }
}

type AppointmentStatus = "Pending" | "Approved" | "Rejected";

type Appointment = {
  id: number;
  patient: string;
  initials: string;
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
    type: "Medical Consultation",
    date: "Tomorrow",
    time: "11:00 AM",
    reason: "I need advice regarding my general health.",
    status: "Approved",
  },
];

function DoctorDashboard() {
  const [doctorProfile, setDoctorProfile] =
    useState<DoctorProfile>(getDoctorProfile);

  const [appointments, setAppointments] =
    useState<Appointment[]>(initialAppointments);

  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

  const [successMessage, setSuccessMessage] = useState("");

  // Admin ke updated doctor data ko load aur sync karein.
  useEffect(() => {
    const updateDoctorProfile = () => {
      setDoctorProfile(getDoctorProfile());
    };

    updateDoctorProfile();

    window.addEventListener("storage", updateDoctorProfile);
    window.addEventListener("doctorsUpdated", updateDoctorProfile);

    return () => {
      window.removeEventListener("storage", updateDoctorProfile);
      window.removeEventListener("doctorsUpdated", updateDoctorProfile);
    };
  }, []);

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

  const pendingAppointments = appointments.filter(
    (appointment) => appointment.status === "Pending"
  ).length;

  const approvedAppointments = appointments.filter(
    (appointment) => appointment.status === "Approved"
  ).length;

  const todayAppointments = useMemo(
    () =>
      appointments.filter(
        (appointment) =>
          appointment.date === "Today" &&
          appointment.status === "Approved"
      ),
    [appointments]
  );

  const visibleAppointments = appointments.filter(
    (appointment) =>
      appointment.status === "Pending" ||
      appointment.status === "Approved"
  );

  const stats = [
    {
      title: "Total Appointments",
      value: appointments.filter(
        (appointment) => appointment.status !== "Rejected"
      ).length,
      description: "Active and scheduled bookings",
      icon: CalendarDays,
      iconBg: "bg-blue-50",
      iconColor: "text-[#0B63CE]",
    },
    {
      title: "Pending Requests",
      value: pendingAppointments,
      description: "Awaiting your decision",
      icon: Clock3,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
    },
    {
      title: "Approved",
      value: approvedAppointments,
      description: "Confirmed appointments",
      icon: CalendarCheck,
      iconBg: "bg-teal-50",
      iconColor: "text-teal-700",
    },
    {
      title: "Completed",
      value: 8,
      description: "Previous consultations",
      icon: CheckCircle2,
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
    },
  ];

  const statusStyles: Record<AppointmentStatus, string> = {
    Pending: "bg-amber-50 text-amber-700 border-amber-100",
    Approved: "bg-emerald-50 text-emerald-700 border-emerald-100",
    Rejected: "bg-red-50 text-red-700 border-red-100",
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f8faf9]">
      <Navbar />

      <main className="mx-auto w-full max-w-6xl px-4 pb-10 pt-28 sm:px-6 lg:px-8">
        {/* PAGE HEADER */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-slate-500">
              Doctor Portal
            </p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#183b3b] sm:text-3xl">
              Dashboard
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Manage your appointments and keep track of your patients.
            </p>
          </div>

          <Link
            to="/doctor-appointments"
            className="inline-flex items-center gap-2 rounded-full bg-[#0B63CE] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0955AE]"
          >
            <CalendarDays size={17} />
            Manage Appointments
          </Link>
        </div>

        {/* DOCTOR HERO CARD */}
        <section
          className="
            relative isolate mx-auto flex w-full items-center
            overflow-hidden rounded-[22px]
            bg-gradient-to-r from-[#410200] via-[#536276] to-[#151b54]
            px-4 py-5 shadow-xl
            sm:rounded-[30px] sm:px-7 sm:py-8
            lg:min-h-[340px] lg:rounded-[30px] lg:px-10 lg:py-8
            xl:min-h-[360px] xl:px-12
          "
        >
          <div className="pointer-events-none absolute -left-12 -top-12 -z-10 h-36 w-36 rounded-full bg-white/10 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-12 right-16 -z-10 h-40 w-40 rounded-full bg-blue-300/10 blur-3xl" />

          {/* LEFT CONTENT */}
          <div
            className="
              relative z-10 w-[64%] min-w-0
              sm:w-[62%] lg:w-[59%] xl:w-[60%]
            "
          >
            <div className="mb-2 inline-flex max-w-full items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[9px] font-medium text-white/90 sm:mb-3 sm:gap-2 sm:px-3 sm:py-1.5 sm:text-xs">
              <ShieldCheck className="shrink-0" size={13} />
              <span>Doctor Workspace</span>
            </div>

            <h2 className="text-[21px] font-bold leading-[1.4] text-white sm:text-3xl sm:leading-tight lg:text-[36px] xl:text-[40px]">
              Welcome back,{" "}
              <span className="text-[#F9A603]">
                {doctorProfile.name}!
              </span>
            </h2>

            <p className="mt-2 text-[10px] leading-4 text-blue-100 sm:mt-3 sm:text-sm sm:leading-5">
              {doctorProfile.specialty}
              <span className="mx-1 text-white/40 sm:mx-2">•</span>
              Online Consultations
            </p>

            <p className="mt-2 max-w-[330px] text-[10px] leading-[17px] text-white/80 sm:mt-3 sm:text-sm sm:leading-6">
              Manage your appointments and provide quality care to your patients.
            </p>

            <div className="mt-3 flex flex-col items-start gap-2 sm:mt-5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
              <div className="inline-flex max-w-full items-center gap-1.5 rounded-lg border border-white/15 bg-white/10 px-2 py-2 sm:gap-2 sm:rounded-xl sm:px-3">
                <Clock3
                  size={14}
                  className="shrink-0 text-[#F9A603] sm:h-4 sm:w-4"
                />

                <span className="text-[10px] font-semibold leading-4 text-white sm:whitespace-nowrap sm:text-xs">
                  {pendingAppointments} Pending Requests
                </span>
              </div>

              <Link
                to="/doctor-appointments"
                className="inline-flex max-w-full items-center justify-center gap-1.5 rounded-full bg-white px-3 py-2 text-[10px] font-bold leading-4 text-[#183b3b] transition hover:bg-blue-50 sm:gap-2 sm:px-4 sm:py-2.5 sm:text-sm"
              >
                <span>Review Appointments</span>
                <ArrowRight
                  size={13}
                  className="shrink-0 sm:h-[15px] sm:w-[15px]"
                />
              </Link>
            </div>
          </div>

          {/* DOCTOR IMAGE */}
          <div
            className="
              pointer-events-none absolute inset-y-0 right-0
              flex w-[39%] items-end justify-center
              sm:w-[40%] lg:right-4 lg:w-[39%] xl:right-6 xl:w-[40%]
            "
          >
            <div className="absolute bottom-2 left-1/2 h-24 w-24 -translate-x-1/2 rounded-full bg-white/10 blur-2xl sm:bottom-4 sm:h-36 sm:w-36 lg:h-44 lg:w-44" />

            <img
              src={doctorProfile.image}
              alt={doctorProfile.name}
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src = drMunibImage;
              }}
              className="
                relative z-10 block h-[145px] w-[112px]
                rounded-t-[48px] object-cover object-top
                [mask-image:linear-gradient(to_bottom,black_94%,transparent_100%)]
                sm:h-[245px] sm:w-[195px] sm:rounded-t-[75px]
                lg:h-[285px] lg:w-[220px]
                xl:h-[305px] xl:w-[245px]
              "
            />

            <div
              className="
                absolute bottom-3 right-1 z-20
                rounded-lg bg-white px-2 py-1.5 shadow-lg
                sm:bottom-5 sm:right-0 sm:rounded-xl sm:px-3 sm:py-2
                lg:right-1
              "
            >
              <p className="hidden text-[10px] text-slate-500 sm:block">
                Available Online
              </p>

              <div className="flex items-center gap-1 sm:mt-1 sm:gap-1.5">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500 sm:h-2 sm:w-2" />

                <span className="whitespace-nowrap text-[9px] font-semibold text-slate-800 sm:text-xs">
                  <span className="sm:hidden">Online</span>
                  <span className="hidden sm:inline">Expert Doctor</span>
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* STATISTICS */}
        <section className="mt-8">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-[#183b3b] sm:text-xl">
              Practice Overview
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              A summary of your appointment activity.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-5">
            {stats.map((stat) => {
              const Icon = stat.icon;

              const filter =
                stat.title === "Total Appointments"
                  ? "All"
                  : stat.title === "Pending Requests"
                    ? "Pending"
                    : stat.title === "Approved"
                      ? "Approved"
                      : "Completed";

              return (
                <Link
                  key={stat.title}
                  to={`/doctor-appointments?filter=${filter}`}
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

        {/* MAIN DASHBOARD GRID */}
        <section className="mt-8 grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
          {/* APPOINTMENT REQUESTS */}
          <div className="min-w-0 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6 lg:col-span-2">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-[#183b3b]">
                    Appointment Requests
                  </h2>

                  {pendingAppointments > 0 && (
                    <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-amber-50 px-2 text-xs font-bold text-amber-700">
                      {pendingAppointments}
                    </span>
                  )}
                </div>

                <p className="mt-1 text-sm text-slate-500">
                  Review patient bookings and confirm their appointments.
                </p>
              </div>

              <Link
                to="/doctor-appointments"
                className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-[#0B63CE] hover:text-[#0955AE]"
              >
                View all
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* SUCCESS MESSAGE */}
            {successMessage && (
              <div
                role="status"
                className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700"
              >
                <CheckCircle2 size={18} />
                {successMessage}
              </div>
            )}

            <div className="mt-5 space-y-3">
              {visibleAppointments.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center">
                  <CalendarCheck
                    className="mx-auto text-slate-400"
                    size={32}
                  />

                  <p className="mt-3 font-semibold text-slate-700">
                    All caught up!
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    There are no pending or upcoming appointments to review.
                  </p>
                </div>
              ) : (
                visibleAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="rounded-xl border border-slate-100 p-4 transition hover:border-blue-100 hover:bg-slate-50/50"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex min-w-0 items-start gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#e5f4f2] text-sm font-bold text-[#245b5b]">
                          {appointment.initials}
                        </div>

                        <div className="min-w-0">
                          <h3 className="font-semibold text-slate-800">
                            {appointment.patient}
                          </h3>

                          <p className="mt-1 text-sm text-slate-500">
                            {appointment.type}
                          </p>

                          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-slate-500">
                            <span className="inline-flex items-center gap-1">
                              <CalendarDays size={14} />
                              {appointment.date}
                            </span>

                            <span className="inline-flex items-center gap-1">
                              <Clock3 size={14} />
                              {appointment.time}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => setSelectedAppointment(appointment)}
                            className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[#0B63CE] transition hover:text-[#0955AE]"
                          >
                            <Eye size={15} />
                            View Details
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                        {appointment.status === "Pending" ? (
                          <>
                            <button
                              type="button"
                              onClick={() =>
                                updateStatus(appointment.id, "Approved")
                              }
                              className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#0B63CE] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0955AE]"
                            >
                              <Check size={15} />
                              Accept
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                updateStatus(appointment.id, "Rejected")
                              }
                              className="inline-flex items-center justify-center gap-1.5 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                            >
                              <X size={15} />
                              Reject
                            </button>
                          </>
                        ) : (
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${statusStyles[appointment.status]}`}
                          >
                            <CheckCircle2 size={14} />
                            {appointment.status}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="min-w-0 space-y-6">
            {/* TODAY'S SCHEDULE */}
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-[#183b3b]">
                    Today's Schedule
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Your confirmed consultations.
                  </p>
                </div>

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#0B63CE]">
                  <CalendarDays size={20} />
                </div>
              </div>

              <div className="mt-5 space-y-4">
                {todayAppointments.length === 0 ? (
                  <div className="rounded-xl bg-slate-50 px-3 py-7 text-center">
                    <Clock3
                      className="mx-auto text-slate-400"
                      size={26}
                    />

                    <p className="mt-2 text-sm font-semibold text-slate-700">
                      No confirmed appointments today
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Approved appointments scheduled for today will appear here.
                    </p>
                  </div>
                ) : (
                  todayAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex gap-3"
                    >
                      <div className="flex flex-col items-center">
                        <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-[#0B63CE]" />
                        <span className="mt-1 w-px flex-1 bg-slate-200" />
                      </div>

                      <div className="min-w-0 flex-1 pb-3">
                        <p className="text-sm font-bold text-[#183b3b]">
                          {appointment.time}
                        </p>

                        <p className="mt-1 text-sm font-semibold text-slate-700">
                          {appointment.patient}
                        </p>

                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          {appointment.type}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <Link
                to="/doctor-appointments"
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-[#0B63CE]"
              >
                View Full Schedule
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* QUICK ACTIONS */}
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-lg font-bold text-[#183b3b]">
                Quick Actions
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Access your most-used tools.
              </p>

              <div className="mt-4 space-y-3">
                {/* MANAGE AVAILABILITY */}
                <Link
                  to="/doctor-availability"
                  className="group flex items-center gap-3 rounded-xl border border-slate-100 p-3 transition hover:border-blue-200 hover:bg-blue-50/50"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#0B63CE]">
                    <Clock3 size={20} />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-slate-800">
                      Manage Availability
                    </span>

                    <span className="mt-1 block text-xs text-slate-500">
                      Set your working hours and consultation slots
                    </span>
                  </span>

                  <ArrowRight
                    size={16}
                    className="shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-[#0B63CE]"
                  />
                </Link>

                {/* PRESCRIPTIONS */}
                <Link
                  to="/doctor-prescriptions"
                  className="group flex items-center gap-3 rounded-xl border border-slate-100 p-3 transition hover:border-blue-200 hover:bg-blue-50/50"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#0B63CE]">
                    <FileText size={20} />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-slate-800">
                      Prescriptions
                    </span>

                    <span className="mt-1 block text-xs text-slate-500">
                      Prepare patient prescriptions
                    </span>
                  </span>

                  <ArrowRight
                    size={16}
                    className="shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-[#0B63CE]"
                  />
                </Link>

                {/* ONLINE CONSULTATION */}
                <Link
                  to="/consultation"
                  className="group flex items-center gap-3 rounded-xl border border-slate-100 p-3 transition hover:border-blue-200 hover:bg-blue-50/50"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#0B63CE]">
                    <Video size={20} />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-slate-800">
                      Online Consultation
                    </span>

                    <span className="mt-1 block text-xs text-slate-500">
                      Open the consultation room
                    </span>
                  </span>

                  <ArrowRight
                    size={16}
                    className="shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-[#0B63CE]"
                  />
                </Link>
              </div>
            </div>

            {/* PROFESSIONAL NOTE */}
            <div className="rounded-2xl border border-[#dcece8] bg-[#e5f4f2] p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#245b5b]">
                  <Activity size={19} />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-[#183b3b]">
                    Your practice, at a glance
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-slate-600">
                    Review pending requests regularly and keep your
                    appointment schedule up to date.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER NOTE */}
        <p className="mt-8 text-center text-xs text-slate-400">
          Telemedicine Doctor Portal · Demonstration data
        </p>

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

              <div className="mt-6 space-y-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Consultation Type
                  </p>

                  <p className="mt-1 font-semibold text-slate-700">
                    {selectedAppointment.type}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl bg-slate-50 p-3">
                    <CalendarDays size={18} className="text-[#0B63CE]" />
                    <p className="mt-2 text-xs text-slate-500">Date</p>

                    <p className="mt-1 text-sm font-semibold text-slate-700">
                      {selectedAppointment.date}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-3">
                    <Clock3 size={18} className="text-[#0B63CE]" />
                    <p className="mt-2 text-xs text-slate-500">Time</p>

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
                    Current Status
                  </p>

                  <span
                    className={`mt-2 inline-flex rounded-full border px-3 py-1.5 text-xs font-semibold ${statusStyles[selectedAppointment.status]}`}
                  >
                    {selectedAppointment.status}
                  </span>
                </div>
              </div>

              {selectedAppointment.status === "Pending" && (
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() =>
                      updateStatus(selectedAppointment.id, "Approved")
                    }
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#0B63CE] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0955AE]"
                  >
                    <Check size={17} />
                    Approve Appointment
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      updateStatus(selectedAppointment.id, "Rejected")
                    }
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-red-200 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                  >
                    <X size={17} />
                    Reject
                  </button>
                </div>
              )}

              {selectedAppointment.status !== "Pending" && (
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
      </main>

      <Footer />
    </div>
  );
}

export default DoctorDashboard;
