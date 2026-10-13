import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
CalendarDays,
Clock3,
CheckCircle2,
Users,
ArrowRight,
Video,
FileText,
ClipboardList,
Check,
X,
CalendarCheck,
Activity,
ShieldCheck,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import drMunibImage from "../assets/dr-munib121.jpg";

type AppointmentStatus = "Pending" | "Approved" | "Rejected";

type Appointment = {
id: number;
patient: string;
initials: string;
type: string;
date: string;
time: string;
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
status: "Pending",
},
{
id: 2,
patient: "Fatima Ahmed",
initials: "FA",
type: "Follow-up Consultation",
date: "Today",
time: "05:00 PM",
status: "Pending",
},
{
id: 3,
patient: "Sara Ali",
initials: "SA",
type: "Medical Consultation",
date: "Tomorrow",
time: "11:00 AM",
status: "Approved",
},
];

function DoctorDashboard() {
const [appointments, setAppointments] =
useState<Appointment[]>(initialAppointments);

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

return ( <div className="min-h-screen overflow-x-hidden bg-[#f8faf9]"> <Navbar />


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

    {/* HERO CARD */}
    <section
      className="
        relative isolate flex min-h-[300px] items-center
        overflow-hidden rounded-[24px]
        bg-gradient-to-r from-[#410200] via-[#536276] to-[#151b54]
        px-5 py-8 shadow-xl
        sm:min-h-[340px] sm:rounded-[30px] sm:px-8
        lg:min-h-[390px] lg:px-12 lg:py-10
      "
    >
      {/* Background glow */}
      <div className="pointer-events-none absolute -left-20 -top-24 -z-10 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

      <div className="pointer-events-none absolute right-1/4 top-0 -z-10 h-64 w-64 rounded-full bg-blue-300/10 blur-3xl" />

      {/* Decorative circle */}
      <div className="pointer-events-none absolute -right-20 -top-20 -z-10 h-64 w-64 rounded-full border-[35px] border-white/5 sm:h-80 sm:w-80" />

      {/* HERO CONTENT */}
      <div className="relative z-20 w-[68%] max-w-2xl text-white sm:w-[65%] lg:w-[62%]">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-white/90 backdrop-blur-sm sm:text-sm">
          <ShieldCheck size={16} />
          Doctor Workspace
        </div>

        <h2 className="text-2xl font-bold leading-tight sm:text-4xl lg:text-5xl">
          Welcome back,
          <br />
          <span className="text-[#F9A603]">Dr. Munib!</span>
        </h2>

        <p className="mt-3 text-xs font-medium text-blue-100 sm:text-sm">
          Medical Specialist
          <span className="mx-2 text-white/40">•</span>
          Online Consultations
        </p>

        <p className="mt-4 max-w-md text-xs leading-5 text-white/80 sm:text-sm sm:leading-6 lg:text-base">
          Your patients are counting on you. Review appointment
          requests, organize your schedule, and provide quality
          care from one place.
        </p>

        {/* Pending summary */}
        <div className="mt-5 inline-flex max-w-full items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2.5 backdrop-blur-sm sm:mt-6 sm:px-4">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F9A603]/20 text-[#F9A603]">
            <Clock3 size={17} />
          </span>

          <span className="min-w-0">
            <span className="block text-sm font-bold text-white">
              {pendingAppointments} pending{" "}
              {pendingAppointments === 1 ? "request" : "requests"}
            </span>

            <span className="mt-0.5 block text-[10px] text-white/70 sm:text-xs ">
              Review your appointment requests
            </span>
          </span>
        </div>

        <Link
          to="/doctor-appointments"
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-xs font-bold text-[#183b3b] shadow-lg transition hover:bg-blue-50 sm:mt-6 sm:ml-6 sm:px-5 sm:py-3 sm:text-sm"
        >
          Review Appointments
          <ArrowRight size={16} />
        </Link>
      </div>

      {/* DOCTOR IMAGE */}
      <div className="absolute bottom-0 right-10 flex h-full w-[40%] items-end justify-end sm:w-[38%] lg:w-[39%]">
        {/* Image background glow */}
        <div className="absolute bottom-0 right-0 h-3/4 w-full bg-gradient-to-t from-[#151b54]/70 via-white/5 to-transparent blur-2xl" />

        <img
          src={drMunibImage}
          alt="Dr. Munib, Medical Specialist"
          className="
            relative z-10
            h-[220px] w-full max-w-[180px]
            object-cover object-top
            rounded-t-[75px] rounded-b-none
            [mask-image:linear-gradient(to_bottom,black_85%,transparent_100%)]
            drop-shadow-[0_0_22px_rgba(255,255,255,0.15)]
            sm:h-[290px] sm:max-w-[240px] sm:rounded-t-[105px]
            lg:h-[365px] lg:max-w-[320px] lg:rounded-t-[125px]
          "
        />
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

          return (
            <div
              key={stat.title}
              className="
                rounded-2xl border border-slate-100 bg-white p-4
                shadow-sm transition duration-200
                hover:-translate-y-1 hover:shadow-md
                sm:p-5
              "
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
            </div>
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
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                        <CheckCircle2 size={14} />
                        Approved
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
            <Link
              to="/doctor-appointments"
              className="group flex items-center gap-3 rounded-xl border border-slate-100 p-3 transition hover:border-blue-200 hover:bg-blue-50/50"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#0B63CE]">
                <ClipboardList size={20} />
              </span>

              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-slate-800">
                  Manage Appointments
                </span>

                <span className="mt-1 block text-xs text-slate-500">
                  Review and update bookings
                </span>
              </span>

              <ArrowRight
                size={16}
                className="shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-[#0B63CE]"
              />
            </Link>

            <Link
              to="/doctor-prescriptions"
              className="group flex items-center gap-3 rounded-xl border border-slate-100 p-3 transition hover:border-teal-200 hover:bg-teal-50/50"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
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
                className="shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-teal-700"
              />
            </Link>

            <Link
              to="/consultation"
              className="group flex items-center gap-3 rounded-xl border border-slate-100 p-3 transition hover:border-emerald-200 hover:bg-emerald-50/50"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
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
                className="shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-emerald-700"
              />
            </Link>

            <Link
              to="/patient-dashboard"
              className="group flex items-center gap-3 rounded-xl border border-slate-100 p-3 transition hover:border-purple-200 hover:bg-purple-50/50"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-700">
                <Users size={20} />
              </span>

              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-slate-800">
                  Patient Portal
                </span>

                <span className="mt-1 block text-xs text-slate-500">
                  Preview the patient dashboard
                </span>
              </span>

              <ArrowRight
                size={16}
                className="shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-purple-700"
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
  </main>

  <Footer />
</div>


);
}

export default DoctorDashboard;
