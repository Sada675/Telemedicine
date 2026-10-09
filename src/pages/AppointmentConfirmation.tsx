import { useLocation, useNavigate } from "react-router-dom";
import {
  CalendarDays,
  Clock3,
  CheckCircle2,
  ClipboardCheck,
  CreditCard,
  Home,
  ArrowRight,
  Stethoscope,
  ShieldCheck,
  Copy,
} from "lucide-react";
import { useState } from "react";

import Navbar from "../components/Navbar";
import drMunib from "../assets/dr-munib121.jpg";
import ladyDoc from "../assets/lady-doc.jpg";

type Doctor = {
  id: number;
  name: string;
  specialty: string;
  qualifications: string;
  languages: string;
  feePKR: string;
  feeUSD: string;
  image: string;
};

type ConfirmationData = {
  selectedDoctor?: Doctor;
  selectedDate?: string;
  selectedTime?: string;
  reason?: string;
  fee?: string;
  paymentMethod?: string;
  paymentStatus?: string;
};

const defaultDoctors: Doctor[] = [
  {
    id: 1,
    name: "Dr. Munib",
    specialty: "Medical Specialist",
    qualifications: "MBBS, FCPS",
    languages: "English, Urdu",
    feePKR: "PKR 3,000",
    feeUSD: "$25",
    image: drMunib,
  },
  {
    id: 2,
    name: "Dr. Nazli",
    specialty: "Medical Specialist",
    qualifications: "MBBS, FCPS",
    languages: "English, Urdu",
    feePKR: "PKR 3,000",
    feeUSD: "$25",
    image: ladyDoc,
  },
];

function AppointmentConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();

  const appointment = (location.state || {}) as ConfirmationData;

  const selectedDoctor =
    appointment.selectedDoctor || defaultDoctors[0];

  const selectedDate = appointment.selectedDate || "10";
  const selectedTime = appointment.selectedTime || "04:00 PM";
  const fee = appointment.fee || selectedDoctor.feePKR;

  const [copied, setCopied] = useState(false);

  // Frontend demo reference; it is not a saved server-side booking ID.
  const [appointmentId] = useState(
    () => `APT-${Date.now().toString().slice(-8)}`
  );

  const dateLabels: Record<string, string> = {
    "10": "10 October 2026",
    "11": "11 October 2026",
    "12": "12 October 2026",
    "13": "13 October 2026",
    "14": "14 October 2026",
  };

  const formattedDate =
    dateLabels[selectedDate] ||
    `${selectedDate} October 2026`;

  const copyAppointmentId = async () => {
    try {
      await navigator.clipboard.writeText(appointmentId);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8faf9]">
      <Navbar />

      <main className="px-4 pb-16 pt-28 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-5xl">

          {/* Success heading */}
          <section className="mb-8 text-center">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 ring-8 ring-emerald-50">
              <CheckCircle2 size={43} strokeWidth={1.8} />
            </div>

            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
              <ClipboardCheck size={16} />
              Booking Details Ready
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-[#183b3b] sm:text-4xl lg:text-5xl">
              Appointment Confirmation
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              Your appointment details are ready. Please keep your
              reference number for future reference.
            </p>
          </section>

          {/* Demo notice */}
          <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-800">
            <p className="font-bold">Demo confirmation</p>
            <p className="mt-1">
              This is a frontend demonstration. Your appointment has
              not been saved to a server, and no real payment has
              been processed.
            </p>
          </div>

          {/* Appointment reference */}
          <section className="mb-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Appointment Reference
                </p>

                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <h2 className="break-all text-2xl font-bold tracking-wide text-[#183b3b] sm:text-3xl">
                    {appointmentId}
                  </h2>

                  <button
                    type="button"
                    onClick={copyAppointmentId}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-[#0B63CE] hover:text-[#0B63CE]"
                    aria-label="Copy appointment reference"
                  >
                    <Copy size={14} />
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>

                <p className="mt-2 text-sm text-slate-500">
                  Keep this reference for your records.
                </p>
              </div>

              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                Pending Approval
              </div>
            </div>
          </section>

          <div className="grid items-start gap-6 lg:grid-cols-[1fr_320px]">

            {/* Appointment details */}
            <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

              <div className="border-b border-slate-100 p-5 sm:p-7">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-blue-50 p-3 text-[#0B63CE]">
                    <CalendarDays size={23} />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-[#183b3b]">
                      Your Appointment
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Review your consultation information.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5 sm:p-7">

                {/* Doctor */}
                <div className="flex flex-col gap-4 rounded-2xl bg-[#f8faf9] p-4 sm:flex-row sm:items-center">
                  <img
                    src={selectedDoctor.image}
                    alt={selectedDoctor.name}
                    className="h-24 w-24 rounded-2xl object-cover"
                  />

                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#0B63CE]">
                      Your Doctor
                    </p>

                    <h3 className="mt-1 text-xl font-bold text-[#183b3b]">
                      {selectedDoctor.name}
                    </h3>

                    <p className="mt-1 text-sm text-slate-600">
                      {selectedDoctor.specialty}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      {selectedDoctor.qualifications}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Languages: {selectedDoctor.languages}
                    </p>
                  </div>
                </div>

                {/* Date and time */}
                <div className="mt-6 grid gap-4 sm:grid-cols-2">

                  <div className="rounded-2xl border border-slate-200 p-4">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#0B63CE]">
                      <CalendarDays size={20} />
                    </div>

                    <p className="text-sm text-slate-500">
                      Appointment Date
                    </p>

                    <p className="mt-2 font-bold text-[#183b3b]">
                      {formattedDate}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 p-4">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#e5f4f2] text-[#245b5b]">
                      <Clock3 size={20} />
                    </div>

                    <p className="text-sm text-slate-500">
                      Appointment Time
                    </p>

                    <p className="mt-2 font-bold text-[#183b3b]">
                      {selectedTime}
                    </p>
                  </div>

                </div>

                {/* Reason */}
                {appointment.reason && (
                  <div className="mt-4 rounded-2xl border border-slate-200 p-4">
                    <p className="text-sm text-slate-500">
                      Reason for Visit
                    </p>

                    <p className="mt-2 break-words font-semibold text-[#183b3b]">
                      {appointment.reason}
                    </p>
                  </div>
                )}

                {/* Status information */}
                <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                  <div className="flex items-start gap-3">
                    <Clock3
                      size={20}
                      className="mt-0.5 shrink-0 text-amber-600"
                    />

                    <div>
                      <h3 className="font-bold text-amber-900">
                        Waiting for Approval
                      </h3>

                      <p className="mt-1 text-sm leading-6 text-amber-800">
                        The appointment status is currently shown as
                        Pending Approval in this demo. Actual approval
                        requires a connected backend and doctor-side
                        workflow.
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </section>

            {/* Payment summary */}
            <aside className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-blue-50 p-3 text-[#0B63CE]">
                  <CreditCard size={22} />
                </div>

                <h2 className="text-lg font-bold text-[#183b3b]">
                  Payment Summary
                </h2>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="text-slate-500">
                    Consultation fee
                  </span>

                  <span className="font-semibold text-[#183b3b]">
                    {fee}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="text-slate-500">
                    Payment method
                  </span>

                  <span className="font-semibold capitalize text-[#183b3b]">
                    {appointment.paymentMethod === "card"
                      ? "Debit / Credit Card"
                      : appointment.paymentMethod || "Not selected"}
                  </span>
                </div>

                <div className="border-t border-dashed border-slate-200" />

                <div className="flex items-center justify-between gap-3">
                  <span className="font-bold text-[#183b3b]">
                    Total
                  </span>

                  <span className="text-2xl font-bold text-[#0B63CE]">
                    {fee}
                  </span>
                </div>

                <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
                  <p className="text-sm font-bold text-amber-800">
                    Demo payment status
                  </p>

                  <p className="mt-1 text-xs leading-5 text-amber-700">
                    {appointment.paymentStatus === "Demo"
                      ? "No real payment was processed."
                      : "Payment has not been verified by a payment provider."}
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-xl bg-[#e5f4f2] p-4">
                <div className="flex items-start gap-3">
                  <ShieldCheck
                    size={20}
                    className="mt-0.5 shrink-0 text-[#245b5b]"
                  />

                  <p className="text-xs leading-5 text-[#245b5b]">
                    This page displays your appointment information.
                    Secure server-side storage and payment processing
                    have not yet been connected.
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <button
                  type="button"
                  onClick={() => navigate("/patient-dashboard")}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0B63CE] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#0955AE] focus:outline-none focus:ring-4 focus:ring-blue-100"
                >
                  Go to Patient Dashboard
                  <ArrowRight size={17} />
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3.5 text-sm font-bold text-[#183b3b] transition hover:bg-slate-50"
                >
                  <Home size={17} />
                  Back to Home
                </button>
              </div>

            </aside>
          </div>

          {/* Footer message */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 text-sm text-slate-500">
              <Stethoscope size={17} />
              <span>
                Thank you for choosing our telemedicine service.
              </span>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default AppointmentConfirmation;
