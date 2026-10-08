import { Link } from "react-router-dom";
import BookAppointmentButton from "../components/BookAppointmentButton";
import Footer from "../components/Footer";
import {
  CalendarDays,
  ChevronRight,
  Clock3,
  FileText,
  Stethoscope,
  Video,
} from "lucide-react";
import Navbar from "../components/Navbar";

function PatientDashboard() {
  const recentActivities = [
    {
      icon: FileText,
      title: "Prescription ready",
      description: "Dr. Nazli added a new prescription",
      time: "Yesterday",
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      icon: CalendarDays,
      title: "Appointment confirmed",
      description: "Your consultation with Dr. Munib is confirmed",
      time: "2 days ago",
      iconBg: "bg-[#e5f4f2]",
      iconColor: "text-[#245b5b]",
    },
    {
      icon: Clock3,
      title: "Appointment completed",
      description: "Your previous consultation was completed",
      time: "5 days ago",
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
  ];

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#f8faf9]">

      {/* =====================================================
          COMMON NAVBAR
      ====================================================== */}
      <Navbar />

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}
      <main className="w-full min-w-0">

        <div
  className="
    mx-auto
    w-full
    max-w-7xl
    px-4
    pb-8
    pt-[96px]
    sm:px-6
    lg:px-8
  "
>

          {/* =================================================
              DASHBOARD TOP HEADER
          ================================================== */}
          <div className="mb-6 flex w-full items-center justify-between gap-4">

            <div className="min-w-0">

              <p className="text-xs font-medium text-slate-500 sm:text-sm">
                Patient Dashboard
              </p>

              <h1 className="mt-1 truncate text-xl font-bold text-[#183b3b] sm:text-2xl">
                Good morning, Sadaye 👋
              </h1>

            </div>

          </div>

          {/* =================================================
              WELCOME / HERO CARD
          ================================================== */}
          <section
            className="
              relative
              w-full
              overflow-hidden
              rounded-[26px]
              bg-gradient-to-r
              from-[#410200]
              via-[#536276]
              to-[#151b54]
              p-6
              text-white
              shadow-xl
              sm:p-8
              lg:p-10
            "
          >

            <div
              className="
                absolute
                -right-16
                -top-20
                h-56
                w-56
                rounded-full
                bg-white/10
                blur-2xl
              "
            />

            <div
              className="
                absolute
                -bottom-24
                -right-10
                h-64
                w-64
                rounded-full
                border
                border-white/10
              "
            />

            <div className="relative z-10 max-w-2xl">

              <span
                className="
                  inline-flex
                  items-center
                  rounded-full
                  bg-white/15
                  px-4
                  py-2
                  text-xs
                  font-semibold
                  backdrop-blur-sm
                "
              >
                Your health, our priority
              </span>

              <h2 className="mt-5 text-2xl font-bold leading-tight sm:text-3xl lg:text-4xl">
                How can we help you today?
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-7 text-white/85 sm:text-base">
                Connect with your doctor, manage your consultations,
                and stay on top of your healthcare — all in one place.
              </p>

              <BookAppointmentButton />

            </div>
          </section>

          {/* =================================================
              CARE OVERVIEW
          ================================================== */}
          <section className="mt-6">

            <div className="mb-4">

              <h2 className="text-lg font-bold text-[#183b3b]">
                Your Care Overview
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                A quick look at your healthcare activity.
              </p>

            </div>

            <div className="grid gap-4 sm:grid-cols-3">

              {/* Total */}
              <div
                className="
                  rounded-2xl
                  border
                  border-slate-100
                  bg-white
                  p-5
                  shadow-sm
                  transition
                  hover:-translate-y-0.5
                  hover:shadow-md
                "
              >

                <div className="flex items-center justify-between">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e5f4f2] text-[#245b5b]">
                    <CalendarDays size={21} />
                  </div>

                  <span className="text-xs font-semibold text-slate-400">
                    Total
                  </span>

                </div>

                <p className="mt-4 text-3xl font-bold text-[#183b3b]">
                  8
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Appointments
                </p>

              </div>

              {/* Upcoming */}
              <div
                className="
                  rounded-2xl
                  border
                  border-slate-100
                  bg-white
                  p-5
                  shadow-sm
                  transition
                  hover:-translate-y-0.5
                  hover:shadow-md
                "
              >

                <div className="flex items-center justify-between">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Clock3 size={21} />
                  </div>

                  <span className="text-xs font-semibold text-slate-400">
                    Upcoming
                  </span>

                </div>

                <p className="mt-4 text-3xl font-bold text-[#183b3b]">
                  1
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Scheduled
                </p>

              </div>

              {/* Prescriptions */}
              <div
                className="
                  rounded-2xl
                  border
                  border-slate-100
                  bg-white
                  p-5
                  shadow-sm
                  transition
                  hover:-translate-y-0.5
                  hover:shadow-md
                "
              >

                <div className="flex items-center justify-between">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                    <FileText size={21} />
                  </div>

                  <span className="text-xs font-semibold text-slate-400">
                    Available
                  </span>

                </div>

                <p className="mt-4 text-3xl font-bold text-[#183b3b]">
                  3
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Prescriptions
                </p>

              </div>

            </div>
          </section>

          {/* =================================================
              NEXT CONSULTATION
          ================================================== */}
          <section className="mt-6">

            <div className="mb-4 flex items-end justify-between">

              <div>

                <h2 className="text-lg font-bold text-[#183b3b]">
                  Next Consultation
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Your upcoming online consultation.
                </p>

              </div>

              <Link
                to="/appointments"
                className="
                  hidden
                  items-center
                  gap-1
                  text-sm
                  font-semibold
                  text-[#536276]
                  no-underline
                  hover:text-[#183b3b]
                  sm:flex
                "
              >
                View all
                <ChevronRight size={16} />
              </Link>

            </div>

            <div
              className="
                overflow-hidden
                rounded-2xl
                border
                border-slate-100
                bg-white
                shadow-sm
              "
            >

              <div className="p-5 sm:p-6">

                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                  <div className="flex items-center gap-4">

                    <div
                      className="
                        flex
                        h-16
                        w-16
                        shrink-0
                        items-center
                        justify-center
                        rounded-2xl
                        btn-dark
                        text-lg
                        font-bold
                        text-white
                      "
                    >
                      DM
                    </div>

                    <div>

                      <div className="flex flex-wrap items-center gap-2">

                        <h3 className="text-lg font-bold text-slate-800">
                          Dr. Munib
                        </h3>

                        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-600">
                          Confirmed
                        </span>

                      </div>

                      <p className="mt-1 text-sm text-slate-500">
                        Medical Specialist
                      </p>

                    </div>

                  </div>

                  <div className="grid grid-cols-2 gap-3">

                    <div className="rounded-xl bg-[#f8faf9] px-4 py-3">

                      <p className="text-xs text-slate-400">
                        Date
                      </p>

                      <p className="mt-1 text-sm font-semibold text-slate-700">
                        Oct 10, 2026
                      </p>

                    </div>

                    <div className="rounded-xl bg-[#f8faf9] px-4 py-3">

                      <p className="text-xs text-slate-400">
                        Time
                      </p>

                      <p className="mt-1 text-sm font-semibold text-slate-700">
                        04:00 PM
                      </p>

                    </div>

                  </div>

                  <Link
                    to="/appointments"
                    className="
                      inline-flex
                      items-center
                      justify-center
                      gap-2
                      rounded-full
                      btn-dark
                      px-5
                      py-3
                      text-sm
                      font-semibold
                      text-white
                      no-underline
                      shadow-sm
                      transition
                    "
                  >
                    <Video size={17} />
                    Join Consultation
                    <ChevronRight size={16} />
                  </Link>

                </div>
              </div>
            </div>
          </section>

          {/* =================================================
              BOTTOM TWO COLUMNS
          ================================================== */}
          <section className="mt-6 grid gap-6 lg:grid-cols-5">

            {/* Need Care */}
            <div
              className="
                relative
                overflow-hidden
                rounded-2xl
                bg-[#e5f4f2]
                p-6
                lg:col-span-2
              "
            >

              <div className="relative z-10">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[#245b5b] shadow-sm">
                  <Stethoscope size={21} />
                </div>

                <h3 className="mt-5 text-xl font-bold text-[#183b3b]">
                  Need care today?
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Book an online consultation with one of our
                  qualified doctors whenever you need medical guidance.
                </p>

                <Link
                  to="/book-appointment"
                  className="
                    mt-5
                    inline-flex
                    items-center
                    gap-2
                    rounded-full
                    btn-dark
                    px-5
                    py-3
                    text-sm
                    font-semibold
                    text-white
                    no-underline
                    transition
                  "
                >
                  Book a Consultation
                  <ChevronRight size={16} />
                </Link>

              </div>

              <div className="absolute -bottom-12 -right-10 h-40 w-40 rounded-full bg-white/50" />

            </div>

            {/* Recent Activity */}
            <div
              className="
                rounded-2xl
                border
                border-slate-100
                bg-white
                p-6
                shadow-sm
                lg:col-span-3
              "
            >

              <div className="flex items-center justify-between">

                <div>

                  <h3 className="text-lg font-bold text-[#183b3b]">
                    Recent Activity
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Your latest healthcare updates.
                  </p>

                </div>

                <button
                  type="button"
                  className="
                    hidden
                    text-sm
                    font-semibold
                    text-[#536276]
                    hover:text-[#183b3b]
                    sm:block
                  "
                >
                  View all
                </button>

              </div>

              <div className="mt-5 divide-y divide-slate-100">

                {recentActivities.map((activity) => {
                  const Icon = activity.icon;

                  return (
                    <div
                      key={activity.title}
                      className="
                        flex
                        items-center
                        gap-4
                        py-4
                        first:pt-0
                        last:pb-0
                      "
                    >

                      <div
                        className={`
                          flex
                          h-11
                          w-11
                          shrink-0
                          items-center
                          justify-center
                          rounded-xl
                          ${activity.iconBg}
                          ${activity.iconColor}
                        `}
                      >
                        <Icon size={19} />
                      </div>

                      <div className="min-w-0 flex-1">

                        <p className="text-sm font-semibold text-slate-800">
                          {activity.title}
                        </p>

                        <p className="mt-1 truncate text-xs text-slate-500">
                          {activity.description}
                        </p>

                      </div>

                      <span className="shrink-0 text-xs text-slate-400">
                        {activity.time}
                      </span>

                    </div>
                  );
                })}

              </div>
            </div>
          </section>

        </div>
      </main>
      <Footer />
    </div>
  );
}

export default PatientDashboard;