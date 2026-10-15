import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import VideoCallRoom from "../components/VideoCallRoom";

import {
ArrowLeft,
CalendarDays,
Clock3,
ShieldCheck,
CheckCircle,
} from "lucide-react";

function Consultation() {
  const [callEnded, setCallEnded] = useState(false);

  const handleLeaveCall = () => {
    setCallEnded(true);
  };
  
return ( <div className="min-h-screen bg-[#f8faf9]"> <Navbar />

  <main className="mx-auto max-w-7xl px-4 pb-10 pt-28 sm:px-6 lg:px-8">
    {/* Back Button */}
    <Link
      to="/patient-dashboard"
      className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 no-underline transition hover:text-[#0B63CE]"
    >
      <ArrowLeft size={18} />
      Back to Dashboard
    </Link>

    {/* Page Heading */}
    <div className="mb-7">
      <p className="text-sm font-medium text-[#0B63CE]">
        Online Consultation
      </p>

      <h1 className="mt-2 text-2xl font-bold text-[#183b3b] sm:text-3xl">
        Join Your Consultation
      </h1>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        Connect with your doctor through a secure video consultation.
      </p>
    </div>

    <div className="grid gap-6 lg:grid-cols-3">
      {/* Video Consultation */}
      <section className="lg:col-span-2">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          {!callEnded ? (
            <VideoCallRoom
              enabled={!callEnded}
              onLeave={handleLeaveCall}
            />
          ) : (
            <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl bg-slate-50 px-5 py-10 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <CheckCircle size={32} />
              </div>

              <h2 className="mt-5 text-xl font-bold text-[#183b3b]">
                Consultation Ended
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Your video consultation has ended.
              </p>

              <Link
                to="/appointments"
                className="mt-6 rounded-full bg-[#0B63CE] px-6 py-3 text-sm font-semibold text-white no-underline transition hover:bg-[#0955AE]"
              >
                View Appointments
              </Link>
            </div>
          )}
        </div>

        {/* Privacy Notice */}
        <div className="mt-4 flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-4">
          <ShieldCheck
            className="mt-0.5 shrink-0 text-[#0B63CE]"
            size={21}
          />

          <div>
            <h3 className="text-sm font-semibold text-slate-800">
              Your privacy matters
            </h3>

            <p className="mt-1 text-xs leading-5 text-slate-600">
              Keep your consultation details private and join from a
              comfortable, secure location.
            </p>
          </div>
        </div>
      </section>

      {/* Appointment Details */}
      <aside className="h-fit rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-lg font-bold text-[#183b3b]">
          Appointment Details
        </h2>

        <div className="mt-6 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e5f4f2] text-lg font-bold text-[#245b5b]">
            DM
          </div>

          <div>
            <h3 className="font-bold text-slate-800">Dr. Munib</h3>

            <p className="mt-1 text-sm text-slate-500">
              Medical Specialist
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {/* Appointment Date */}
          <div className="flex items-start gap-3 rounded-xl bg-[#f8faf9] p-4">
            <CalendarDays
              size={19}
              className="mt-0.5 shrink-0 text-[#245b5b]"
            />

            <div>
              <p className="text-xs text-slate-500">
                Appointment Date
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-800">
                October 10, 2026
              </p>
            </div>
          </div>

          {/* Appointment Time */}
          <div className="flex items-start gap-3 rounded-xl bg-[#f8faf9] p-4">
            <Clock3
              size={19}
              className="mt-0.5 shrink-0 text-[#245b5b]"
            />

            <div>
              <p className="text-xs text-slate-500">
                Appointment Time
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-800">
                04:00 PM
              </p>
            </div>
          </div>

          {/* Appointment Status */}
          <div className="rounded-xl bg-emerald-50 p-4">
            <p className="text-xs text-slate-500">
              Appointment Status
            </p>

            <p className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Confirmed
            </p>
          </div>
        </div>

        <Link
          to="/appointments"
          className="mt-6 flex w-full items-center justify-center rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 no-underline transition hover:bg-slate-50"
        >
          View All Appointments
        </Link>
      </aside>
    </div>
  </main>

  <Footer />
</div>

);
}

export default Consultation;
