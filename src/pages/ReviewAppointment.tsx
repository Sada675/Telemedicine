import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  CreditCard,
  FileText,
  LockKeyhole,
  ShieldCheck,
  Stethoscope,
  UserRound,
  Video,
} from "lucide-react";

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

type AppointmentData = {
  selectedDoctor?: Doctor;
  selectedDate?: string;
  selectedTime?: string;
  reason?: string;
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

function ReviewAppointment() {
  const navigate = useNavigate();
  const location = useLocation();

  const appointment = (location.state || {}) as AppointmentData;

  const selectedDoctor =
    appointment.selectedDoctor || defaultDoctors[0];

  const selectedDate = appointment.selectedDate || "10";
  const selectedTime = appointment.selectedTime || "04:00 PM";
  const reason = appointment.reason || "";

  const dateLabels: Record<string, string> = {
    "10": "Saturday, 10 October 2026",
    "11": "Sunday, 11 October 2026",
    "12": "Monday, 12 October 2026",
    "13": "Tuesday, 13 October 2026",
    "14": "Wednesday, 14 October 2026",
  };

  const formattedDate =
    dateLabels[selectedDate] || `${selectedDate} October 2026`;

  const fee = selectedDoctor.feePKR;

  const handleContinue = () => {
    navigate("/payment", {
      state: {
        selectedDoctor,
        selectedDate,
        selectedTime,
        reason,
        fee,
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#f8faf9]">
      <Navbar />

      <main className="px-4 pb-16 pt-28 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-6xl">

          {/* Back Button */}
          <button
            type="button"
            onClick={() => navigate("/book-appointment")}
            className="mb-6 inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-white hover:text-[#0B63CE]"
          >
            <ArrowLeft size={17} />
            Back to appointment details
          </button>

          {/* Header */}
          <div className="mb-8">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#cce7e1] bg-[#e5f4f2] px-4 py-2 text-sm font-semibold text-[#245b5b]">
              <ShieldCheck size={17} />
              Secure Appointment Booking
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-[#183b3b] sm:text-4xl lg:text-5xl">
              Review Your Appointment
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              Almost there! Please review your consultation details
              before proceeding to payment.
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center justify-between">

              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  <Check size={18} />
                </div>

                <div>
                  <p className="text-xs font-semibold text-emerald-700 sm:text-sm">
                    Step 1
                  </p>
                  <p className="text-xs font-semibold text-[#183b3b] sm:text-sm">
                    Appointment
                  </p>
                </div>
              </div>

              <div className="mx-2 h-px flex-1 bg-[#0B63CE] sm:mx-5" />

              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0B63CE] text-sm font-bold text-white shadow-md shadow-blue-200">
                  2
                </div>

                <div>
                  <p className="text-xs font-semibold text-[#0B63CE] sm:text-sm">
                    Step 2
                  </p>
                  <p className="text-xs font-semibold text-[#183b3b] sm:text-sm">
                    Review
                  </p>
                </div>
              </div>

              <div className="mx-2 h-px flex-1 bg-slate-200 sm:mx-5" />

              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-400">
                  3
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-400 sm:text-sm">
                    Step 3
                  </p>
                  <p className="text-xs font-semibold text-slate-500 sm:text-sm">
                    Payment
                  </p>
                </div>
              </div>

            </div>
          </div>

          <div className="grid items-start gap-6 lg:grid-cols-[1fr_360px]">

            {/* LEFT COLUMN */}
            <div className="space-y-6">

              {/* Doctor Card */}
              <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

                <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-7">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-[#e5f4f2] p-2.5 text-[#245b5b]">
                      <Stethoscope size={21} />
                    </div>

                    <div>
                      <h2 className="font-bold text-[#183b3b]">
                        Your Doctor
                      </h2>
                      <p className="text-xs text-slate-500">
                        Consultation specialist
                      </p>
                    </div>
                  </div>

                  <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                    Selected
                  </span>
                </div>

                <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:p-7">

                  <img
                    src={selectedDoctor.image}
                    alt={selectedDoctor.name}
                    className="h-28 w-28 rounded-2xl border border-slate-100 object-cover object-top"
                  />

                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-[#183b3b]">
                      {selectedDoctor.name}
                    </h3>

                    <p className="mt-1 text-sm font-medium text-[#0B63CE]">
                      {selectedDoctor.specialty}
                    </p>

                    <p className="mt-2 text-sm text-slate-600">
                      {selectedDoctor.qualifications}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Languages: {selectedDoctor.languages}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#f0f8f6] px-3 py-1.5 text-xs font-medium text-[#245b5b]">
                        <Video size={14} />
                        Online Consultation
                      </span>
                    </div>
                  </div>

                </div>
              </section>

              {/* Appointment Details */}
              <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">

                <div className="mb-6 flex items-center gap-3">
                  <div className="rounded-xl bg-blue-50 p-2.5 text-[#0B63CE]">
                    <CalendarDays size={21} />
                  </div>

                  <div>
                    <h2 className="font-bold text-[#183b3b]">
                      Appointment Details
                    </h2>

                    <p className="mt-1 text-xs text-slate-500">
                      Confirm your selected date and time.
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">

                  <div className="rounded-2xl border border-slate-100 bg-[#f8faf9] p-4">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#0B63CE] shadow-sm">
                      <CalendarDays size={19} />
                    </div>

                    <p className="text-xs font-medium text-slate-500">
                      Consultation Date
                    </p>

                    <p className="mt-2 text-sm font-bold leading-6 text-[#183b3b]">
                      {formattedDate}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-100 bg-[#f8faf9] p-4">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#0B63CE] shadow-sm">
                      <Clock3 size={19} />
                    </div>

                    <p className="text-xs font-medium text-slate-500">
                      Consultation Time
                    </p>

                    <p className="mt-2 text-sm font-bold text-[#183b3b]">
                      {selectedTime}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Your local timezone
                    </p>
                  </div>

                </div>

                <div className="mt-4 flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50/60 p-4">
                  <Video className="mt-0.5 shrink-0 text-[#0B63CE]" size={19} />

                  <div>
                    <p className="text-sm font-semibold text-[#183b3b]">
                      Video Consultation
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-600">
                      Your consultation will take place online. Meeting
                      details can be provided after the appointment is
                      confirmed by the doctor.
                    </p>
                  </div>
                </div>

              </section>

              {/* Consultation Reason */}
              <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">

                <div className="mb-5 flex items-center gap-3">
                  <div className="rounded-xl bg-amber-50 p-2.5 text-amber-600">
                    <FileText size={21} />
                  </div>

                  <div>
                    <h2 className="font-bold text-[#183b3b]">
                      Consultation Reason
                    </h2>

                    <p className="mt-1 text-xs text-slate-500">
                      Information you provided for the doctor.
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-[#f8faf9] p-4">
                  <p className="text-sm leading-7 text-slate-700">
                    {reason.trim() ||
                      "No consultation reason was provided."}
                  </p>
                </div>

                {!reason.trim() && (
                  <button
                    type="button"
                    onClick={() => navigate("/book-appointment")}
                    className="mt-3 text-sm font-semibold text-[#0B63CE] hover:underline"
                  >
                    Add consultation reason
                  </button>
                )}

              </section>

              {/* Patient Information */}
              <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">

                <div className="mb-5 flex items-center gap-3">
                  <div className="rounded-xl bg-purple-50 p-2.5 text-purple-600">
                    <UserRound size={21} />
                  </div>

                  <div>
                    <h2 className="font-bold text-[#183b3b]">
                      Patient Information
                    </h2>

                    <p className="mt-1 text-xs text-slate-500">
                      Your consultation will be booked for this patient.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-[#f8faf9] p-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#dcefeb] font-bold text-[#245b5b]">
                    SN
                  </div>

                  <div>
                    <p className="font-semibold text-[#183b3b]">
                      Sadaye Noor
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Logged-in patient
                    </p>

                    <p className="mt-2 text-xs leading-5 text-slate-500">
                      Please ensure your profile contains your correct
                      contact details before booking.
                    </p>
                  </div>
                </div>

              </section>

            </div>

            {/* RIGHT COLUMN */}
            <aside className="lg:sticky lg:top-24">

              <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

                {/* Summary Header */}
                <div className="bg-gradient-to-br from-[#410200] via-[#536276] to-[#151b54] p-6 text-white">

                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/10">
                    <CalendarDays size={24} />
                  </div>

                  <p className="text-sm font-medium text-white/75">
                    Appointment Summary
                  </p>

                  <h2 className="mt-1 text-2xl font-bold">
                    Almost Done!
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-white/80">
                    Review your booking before continuing to secure
                    payment.
                  </p>
                </div>

                <div className="space-y-5 p-5 sm:p-6">

                  {/* Doctor */}
                  <div className="flex items-center gap-3">
                    <img
                      src={selectedDoctor.image}
                      alt={selectedDoctor.name}
                      className="h-14 w-14 rounded-xl object-cover object-top"
                    />

                    <div>
                      <p className="font-bold text-[#183b3b]">
                        {selectedDoctor.name}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {selectedDoctor.specialty}
                      </p>
                    </div>
                  </div>

                  <div className="h-px bg-slate-100" />

                  {/* Date & Time */}
                  <div className="space-y-4">

                    <div className="flex items-start gap-3">
                      <div className="rounded-xl bg-[#e5f4f2] p-2.5 text-[#245b5b]">
                        <CalendarDays size={17} />
                      </div>

                      <div>
                        <p className="text-xs text-slate-500">
                          Appointment Date
                        </p>

                        <p className="mt-1 text-sm font-semibold leading-5 text-[#183b3b]">
                          {formattedDate}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="rounded-xl bg-blue-50 p-2.5 text-[#0B63CE]">
                        <Clock3 size={17} />
                      </div>

                      <div>
                        <p className="text-xs text-slate-500">
                          Appointment Time
                        </p>

                        <p className="mt-1 text-sm font-semibold text-[#183b3b]">
                          {selectedTime}
                        </p>
                      </div>
                    </div>

                  </div>

                  <div className="h-px bg-slate-100" />

                  {/* Price */}
                  <div>
                    <h3 className="mb-4 font-bold text-[#183b3b]">
                      Payment Summary
                    </h3>

                    <div className="flex items-center justify-between gap-3 text-sm">
                      <span className="text-slate-500">
                        Consultation Fee
                      </span>

                      <span className="font-semibold text-[#183b3b]">
                        {fee}
                      </span>
                    </div>

                    <div className="mt-4 border-t border-dashed border-slate-200 pt-4">
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-semibold text-[#183b3b]">
                          Total Amount
                        </span>

                        <span className="text-2xl font-bold text-[#0B63CE]">
                          {fee}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Notice */}
                  <div className="flex items-start gap-2.5 rounded-xl bg-emerald-50 p-3.5">
                    <ShieldCheck
                      size={18}
                      className="mt-0.5 shrink-0 text-emerald-600"
                    />

                    <p className="text-xs leading-5 text-emerald-800">
                      Your appointment details will be carried forward
                      to the payment step.
                    </p>
                  </div>

                  {/* Continue */}
                  <button
                    type="button"
                    onClick={handleContinue}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0B63CE] px-5 py-4 text-sm font-bold text-white shadow-lg shadow-blue-200/60 transition duration-200 hover:-translate-y-0.5 hover:bg-[#0955AE] hover:shadow-xl"
                  >
                    <CreditCard size={18} />
                    Continue to Payment
                    <ArrowRight size={17} />
                  </button>

                  {/* Back */}
                  <button
                    type="button"
                    onClick={() => navigate("/book-appointment")}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:border-[#0B63CE] hover:bg-blue-50 hover:text-[#0B63CE]"
                  >
                    <ArrowLeft size={16} />
                    Edit Appointment
                  </button>

                  <div className="flex items-center justify-center gap-2 pt-1 text-xs text-slate-400">
                    <LockKeyhole size={14} />
                    Secure booking experience
                  </div>

                </div>
              </div>

              {/* Support Card */}
              <div className="mt-5 rounded-2xl border border-[#d6e9e4] bg-[#eaf5f2] p-5">
                <div className="flex items-start gap-3">
                  <div className="rounded-xl bg-white p-2.5 text-[#245b5b]">
                    <CheckCircle2 size={20} />
                  </div>

                  <div>
                    <h3 className="font-bold text-[#183b3b]">
                      Need to make a change?
                    </h3>

                    <p className="mt-2 text-xs leading-6 text-slate-600">
                      You can go back and update your selected doctor,
                      appointment date, time, or consultation reason
                      before proceeding.
                    </p>
                  </div>
                </div>
              </div>

            </aside>
          </div>

          {/* Bottom Security Note */}
          <div className="mt-8 flex flex-col items-center justify-center gap-2 text-center sm:flex-row sm:gap-3">
            <ShieldCheck size={18} className="text-emerald-600" />

            <p className="text-xs leading-5 text-slate-500">
              Your health information should remain private. Only share
              information necessary for your medical consultation.
            </p>
          </div>

        </div>
      </main>
    </div>
  );
}

export default ReviewAppointment;
