import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BookAppointmentButton from "../components/BookAppointmentButton";
import Footer from "../components/Footer";
import {
  CalendarDays,
  CheckCircle,
  ChevronRight,
  Clock3,
  FileText,
  Stethoscope,
  Video,
} from "lucide-react";
import Navbar from "../components/Navbar";

function PatientDashboard() {
  const [patientImage, setPatientImage] = useState("");

  useEffect(() => {
    const loadProfilePicture = () => {
      try {
        const savedProfile = localStorage.getItem("telemedicinePatientProfile");

        if (!savedProfile) {
          setPatientImage("");
          return;
        }

        const profile = JSON.parse(savedProfile);
        setPatientImage(
          typeof profile.profilePicture === "string"
            ? profile.profilePicture
            : ""
        );
      } catch (error) {
        console.error("Unable to load profile picture:", error);
        setPatientImage("");
      }
    };

    // Load the saved picture when the dashboard opens.
    loadProfilePicture();

    // Refresh when My Profile saves changes in this browser tab.
    window.addEventListener("profileUpdate", loadProfilePicture);

    // Refresh when localStorage changes in another tab.
    window.addEventListener("storage", loadProfilePicture);

    // Refresh if the user returns to this page.
    window.addEventListener("pageshow", loadProfilePicture);

    return () => {
      window.removeEventListener("profileUpdate", loadProfilePicture);
      window.removeEventListener("storage", loadProfilePicture);
      window.removeEventListener("pageshow", loadProfilePicture);
    };
  }, []);
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
            max-w-6xl
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
              WELCOME / HERO CARD — MATCHES THE HOME HERO DESIGN
          ================================================== */}
          <section
            className="
              relative mx-auto flex max-w-6xl items-center overflow-hidden
              rounded-[22px]
              bg-gradient-to-r from-[#410200] via-[#536276] to-[#151b54]
              px-4 py-5 shadow-2xl
              sm:rounded-[30px] sm:px-7 sm:py-8
              lg:min-h-[500px] lg:rounded-[36px] lg:px-16 lg:py-14
            "
          >
            {/* Soft background glow */}
            <div className="absolute -left-20 -top-20 h-60 w-60 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-20 right-10 h-60 w-60 rounded-full bg-blue-300/10 blur-3xl" />

            {/* ================= LEFT CONTENT ================= */}
            <div
              className="
                relative z-10 w-[68%] text-left text-white
                sm:w-[62%]
                lg:w-full lg:max-w-xl lg:text-left
              "
            >
              {/* Small badge */}
              <div
                className="
                  mb-2 inline-flex items-center gap-1 rounded-full bg-white/15
                  px-2.5 py-1 text-[9px] font-medium backdrop-blur-sm
                  sm:mb-3 sm:gap-1.5 sm:px-3 sm:py-1.5 sm:text-[11px]
                  lg:mb-5 lg:gap-2 lg:px-4 lg:py-2 lg:text-sm
                "
              >
                <CheckCircle size={11} className="sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4" />
                Your health, our priority
              </div>

              {/* Heading */}
              <h2
                className="
                  text-[22px] font-bold leading-[1.1]
                  sm:text-4xl
                  lg:text-6xl lg:leading-tight
                "
              >
                How can we help you?
                <br />
                <span className="text-[#F9A603]">Your Expert Care.</span>
              </h2>

              {/* Description */}
              <p
                className="
                  mt-2 max-w-[175px] text-[9px] leading-4 text-white/80
                  sm:mt-3 sm:max-w-[300px] sm:text-xs sm:leading-5
                  lg:mx-0 lg:mt-5 lg:max-w-lg lg:text-base lg:leading-7
                "
              >
                Connect with your doctor, manage your consultations, and stay on top
                of your healthcare — all in one place.
              </p>

              {/* Book Appointment Button */}
              <BookAppointmentButton />
            </div>

            {/* ================= RIGHT IMAGE ================= */}
            <div
              className="
                absolute bottom-0 right-0 flex w-[42%] justify-end
                sm:w-[40%]
                lg:absolute lg:bottom-0 lg:right-8 lg:mt-0 lg:w-[46%]
              "
            >
              <div className="relative">
                {/* Image glow and blending effect */}

<div
  className="
    absolute inset-0
    rounded-t-[70px] rounded-b-[20px]
    bg-gradient-to-t
    from-[#151b54]/70
    via-[#536276]/15
    to-transparent
    blur-2xl
    scale-110
  "
/>

{/* Saved Patient Profile Picture */}
<img
src={
patientImage ||
"https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600"
}
alt="Patient Profile"
onError={(event) => {
event.currentTarget.onerror = null;
event.currentTarget.src =
"https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600";
}}
className="
relative z-10
h-[185px] w-[145px]
object-cover object-top
rounded-t-[70px] rounded-b-[20px]
shadow-[0_0_25px_rgba(255,255,255,0.18),0_10px_35px_rgba(0,0,0,0.35)]
[mask-image:linear-gradient(to_bottom,black_70%,transparent_100%)]
sm:h-[280px] sm:w-[230px]
sm:rounded-t-[100px] sm:rounded-b-[25px]
sm:[mask-image:linear-gradient(to_bottom,black_78%,transparent_100%)]
lg:h-[440px] lg:w-[390px]
lg:rounded-t-[140px] lg:rounded-b-[30px]
lg:[mask-image:linear-gradient(to_bottom,black_82%,transparent_100%)]
"
/>



                {/* Floating mini card */}
                <div
                  className="
                    absolute bottom-2 -left-8 z-20 rounded-lg bg-white/95
                    px-2 py-1.5 shadow-xl backdrop-blur-sm
                    sm:bottom-4 sm:-left-8 sm:rounded-xl sm:px-3 sm:py-2
                    lg:bottom-5 lg:-left-10 lg:rounded-2xl lg:px-4 lg:py-3
                  "
                >
                  <p className="text-[7px] font-medium text-slate-500 sm:text-[9px] lg:text-xs">
                    Available Online
                  </p>
                  <div className="mt-0.5 flex items-center gap-1 sm:gap-1.5 lg:mt-1 lg:gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 sm:h-2 sm:w-2 lg:h-2.5 lg:w-2.5" />
                    <span className="text-[8px] font-semibold text-slate-800 sm:text-[10px] lg:text-sm">
                      Expert Doctors
                    </span>
                  </div>
                </div>
              </div>
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

              {/* Total Appointments */}
              <Link
                to="/appointments"
                className="
                  block rounded-2xl border border-slate-100 bg-white p-5
                  shadow-sm no-underline transition duration-200
                  hover:-translate-y-1 hover:border-[#245b5b]/30 hover:shadow-md
                  focus:outline-none focus:ring-2 focus:ring-[#0B63CE]
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

                <div className="mt-3 flex items-center justify-between text-xs font-medium text-[#245b5b]">
                  <span>View appointments</span>
                  <ChevronRight size={16} />
                </div>
              </Link>

              {/* Upcoming Appointments */}
              <Link to="/appointments?filter=upcoming"
                className="
                  block rounded-2xl border border-slate-100 bg-white p-5
                  shadow-sm no-underline transition duration-200
                  hover:-translate-y-1 hover:border-blue-200 hover:shadow-md
                  focus:outline-none focus:ring-2 focus:ring-[#0B63CE]
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

                <div className="mt-3 flex items-center justify-between text-xs font-medium text-blue-600">
                  <span>View upcoming</span>
                  <ChevronRight size={16} />
                </div>
              </Link>

              {/* Prescriptions */}
              <Link
                to="/prescriptions"
                className="
                  block rounded-2xl border border-slate-100 bg-white p-5
                  shadow-sm no-underline transition duration-200
                  hover:-translate-y-1 hover:border-purple-200 hover:shadow-md
                  focus:outline-none focus:ring-2 focus:ring-[#0B63CE]
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

                <div className="mt-3 flex items-center justify-between text-xs font-medium text-purple-600">
                  <span>View prescriptions</span>
                  <ChevronRight size={16} />
                </div>
              </Link>

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
                    to="/consultation"
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