import { useState, type FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

import {
  ArrowLeft,
  Check,
  CreditCard,
  LockKeyhole,
  WalletCards,
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

type PaymentData = {
  selectedDoctor?: Doctor;
  selectedDate?: string;
  selectedTime?: string;
  reason?: string;
  fee?: string;
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

function Payment() {
  const navigate = useNavigate();
  const location = useLocation();

  const appointment = (location.state || {}) as PaymentData;

  const selectedDoctor =
    appointment.selectedDoctor || defaultDoctors[0];

  const selectedDate = appointment.selectedDate || "10";
  const selectedTime = appointment.selectedTime || "04:00 PM";
  const fee = appointment.fee || selectedDoctor.feePKR;

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardholder, setCardholder] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [error, setError] = useState("");

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

  const handleCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 16);

    setCardNumber(
      digits.replace(/(.{4})/g, "$1 ").trim()
    );
  };

  const handleExpiry = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 4);

    setExpiry(
      digits.length > 2
        ? `${digits.slice(0, 2)}/${digits.slice(2)}`
        : digits
    );
  };

  const handleCvv = (value: string) => {
    setCvv(value.replace(/\D/g, "").slice(0, 4));
  };

  const handlePayment = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (paymentMethod === "card") {
      const digits = cardNumber.replace(/\s/g, "");

      if (!cardholder.trim()) {
        setError("Please enter the cardholder's name.");
        return;
      }

      if (digits.length !== 16) {
        setError("Please enter a valid 16-digit card number.");
        return;
      }

      if (!/^\d{2}\/\d{2}$/.test(expiry)) {
        setError("Please enter the expiry date in MM/YY format.");
        return;
      }

      const [month, year] = expiry.split("/").map(Number);

      if (month < 1 || month > 12) {
        setError("Please enter a valid expiry month.");
        return;
      }

      const now = new Date();
      const currentYear = now.getFullYear() % 100;
      const currentMonth = now.getMonth() + 1;

      if (
        year < currentYear ||
        (year === currentYear && month < currentMonth)
      ) {
        setError("This card has expired. Please use another card.");
        return;
      }

      if (!/^\d{3,4}$/.test(cvv)) {
        setError("Please enter a valid 3 or 4-digit CVV.");
        return;
      }
    }

    // Demo only: this does not process a real payment.
    navigate("/appointment-confirmation", {
      state: {
        selectedDoctor,
        selectedDate,
        selectedTime,
        reason: appointment.reason || "",
        fee,
        paymentMethod,
        paymentStatus: "Demo",
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#f8faf9]">
      <Navbar />

      <main className="px-4 pb-16 pt-28 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-6xl">
          {/* Back button */}
          <button
            type="button"
            onClick={() =>
              navigate("/review-appointment", {
                state: appointment,
              })
            }
            className="mb-6 inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-white hover:text-[#0B63CE]"
          >
            <ArrowLeft size={17} />
            Back to review
          </button>

          {/* Heading */}
          <div className="mb-8">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#cce7e1] bg-[#e5f4f2] px-4 py-2 text-sm font-semibold text-[#245b5b]">
              <LockKeyhole size={16} />
              Secure Checkout
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-[#183b3b] sm:text-4xl lg:text-5xl">
              Complete Your Payment
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              You are one step away from booking your online
              consultation. Review your amount and choose a payment
              method to continue.
            </p>
          </div>

          {/* Progress */}
          <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center justify-between gap-2">
              {[
                { number: 1, title: "Appointment", complete: true },
                { number: 2, title: "Review", complete: true },
                { number: 3, title: "Payment", complete: false },
              ].map((step, index) => (
                <div
                  key={step.number}
                  className="flex min-w-0 flex-1 items-center"
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                        step.complete
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-[#0B63CE] text-white"
                      }`}
                    >
                      {step.complete ? (
                        <Check size={18} />
                      ) : (
                        step.number
                      )}
                    </div>

                    <div>
                      <p
                        className={`text-xs font-semibold sm:text-sm ${
                          step.complete
                            ? "text-emerald-700"
                            : "text-[#0B63CE]"
                        }`}
                      >
                        Step {step.number}
                      </p>

                      <p className="text-xs font-semibold text-[#183b3b] sm:text-sm">
                        {step.title}
                      </p>
                    </div>
                  </div>

                  {index < 2 && (
                    <div
                      className={`mx-2 h-px min-w-2 flex-1 sm:mx-4 ${
                        index === 0
                          ? "bg-emerald-300"
                          : "bg-[#0B63CE]"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid items-start gap-6 lg:grid-cols-[1fr_360px]">
            {/* Payment form */}
            <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 p-5 sm:p-7">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-blue-50 p-3 text-[#0B63CE]">
                    <WalletCards size={23} />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-[#183b3b]">
                      Payment Method
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Select how you would like to pay.
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handlePayment} className="p-5 sm:p-7">
                {/* Card option */}
                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod("card");
                    setError("");
                  }}
                  className={`mb-4 flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition ${
                    paymentMethod === "card"
                      ? "border-[#0B63CE] bg-blue-50/60 ring-1 ring-[#0B63CE]"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="rounded-xl bg-white p-3 text-[#0B63CE] shadow-sm">
                    <CreditCard size={23} />
                  </div>

                  <div className="flex-1">
                    <p className="font-bold text-[#183b3b]">
                      Debit / Credit Card
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Demo card payment interface
                    </p>
                  </div>

                  <div
                    className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                      paymentMethod === "card"
                        ? "border-[#0B63CE] bg-[#0B63CE] text-white"
                        : "border-slate-300"
                    }`}
                  >
                    {paymentMethod === "card" && <Check size={13} />}
                  </div>
                </button>

                {/* Demo card preview */}
                {paymentMethod === "card" && (
                  <div className="mb-7 overflow-hidden rounded-2xl bg-gradient-to-br from-[#183b3b] via-[#245b5b] to-[#0B63CE] p-5 text-white shadow-lg sm:p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs font-medium tracking-wider text-white/70">
                          TELEMEDICINE
                        </p>

                        <p className="mt-1 text-sm font-semibold">
                          Payment Card
                        </p>
                      </div>

                      <CreditCard size={29} />
                    </div>

                    <div className="mt-8">
                      <p className="text-xs text-white/60">
                        CARD NUMBER
                      </p>

                      <p className="mt-2 break-all text-lg font-semibold tracking-[0.12em] sm:text-xl">
                        {cardNumber || "•••• •••• •••• ••••"}
                      </p>
                    </div>

                    <div className="mt-6 flex items-end justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-[10px] text-white/60">
                          CARDHOLDER
                        </p>

                        <p className="mt-1 truncate text-sm font-semibold uppercase">
                          {cardholder || "YOUR NAME"}
                        </p>
                      </div>

                      <div className="shrink-0">
                        <p className="text-[10px] text-white/60">
                          EXPIRES
                        </p>

                        <p className="mt-1 text-sm font-semibold">
                          {expiry || "MM/YY"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Card fields */}
                {paymentMethod === "card" && (
                  <div className="space-y-5">
                    <div>
                      <label
                        htmlFor="cardholder"
                        className="mb-2 block text-sm font-semibold text-[#183b3b]"
                      >
                        Cardholder Name
                      </label>

                      <input
                        id="cardholder"
                        type="text"
                        autoComplete="cc-name"
                        value={cardholder}
                        onChange={(e) =>
                          setCardholder(
                            e.target.value.replace(/[0-9]/g, "")
                          )
                        }
                        placeholder="Name on your card"
                        className="w-full rounded-xl border border-slate-200 bg-[#fbfdfc] px-4 py-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#0B63CE] focus:ring-4 focus:ring-blue-50"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="cardNumber"
                        className="mb-2 block text-sm font-semibold text-[#183b3b]"
                      >
                        Card Number
                      </label>

                      <div className="relative">
                        <CreditCard
                          size={19}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                          id="cardNumber"
                          type="text"
                          inputMode="numeric"
                          autoComplete="cc-number"
                          value={cardNumber}
                          onChange={(e) =>
                            handleCardNumber(e.target.value)
                          }
                          placeholder="1234 5678 9012 3456"
                          className="w-full rounded-xl border border-slate-200 bg-[#fbfdfc] py-3.5 pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#0B63CE] focus:ring-4 focus:ring-blue-50"
                        />
                      </div>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="expiry"
                          className="mb-2 block text-sm font-semibold text-[#183b3b]"
                        >
                          Expiry Date
                        </label>

                        <input
                          id="expiry"
                          type="text"
                          inputMode="numeric"
                          autoComplete="cc-exp"
                          value={expiry}
                          onChange={(e) =>
                            handleExpiry(e.target.value)
                          }
                          placeholder="MM/YY"
                          className="w-full rounded-xl border border-slate-200 bg-[#fbfdfc] px-4 py-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#0B63CE] focus:ring-4 focus:ring-blue-50"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="cvv"
                          className="mb-2 block text-sm font-semibold text-[#183b3b]"
                        >
                          Security Code (CVV)
                        </label>

                        <input
                          id="cvv"
                          type="password"
                          inputMode="numeric"
                          autoComplete="cc-csc"
                          value={cvv}
                          onChange={(e) => handleCvv(e.target.value)}
                          placeholder="•••"
                          className="w-full rounded-xl border border-slate-200 bg-[#fbfdfc] px-4 py-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#0B63CE] focus:ring-4 focus:ring-blue-50"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Error message */}
                {error && (
                  <div
                    role="alert"
                    className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
                  >
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0B63CE] px-5 py-4 text-sm font-bold text-white transition hover:bg-[#0955AE] focus:outline-none focus:ring-4 focus:ring-blue-100"
                >
                  Continue to Confirmation
                </button>
              </form>
            </section>

            {/* Appointment summary */}
            <aside className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-lg font-bold text-[#183b3b]">
                Appointment Summary
              </h2>

              <div className="mt-5 flex items-center gap-4">
                <img
                  src={selectedDoctor.image}
                  alt={selectedDoctor.name}
                  className="h-16 w-16 rounded-2xl object-cover"
                />

                <div className="min-w-0">
                  <h3 className="font-bold text-[#183b3b]">
                    {selectedDoctor.name}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    {selectedDoctor.specialty}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {selectedDoctor.qualifications}
                  </p>
                </div>
              </div>

              <div className="my-5 border-t border-dashed border-slate-200" />

              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-slate-500">Appointment date</p>
                  <p className="mt-1 font-semibold text-[#183b3b]">
                    {formattedDate}
                  </p>
                </div>

                <div>
                  <p className="text-slate-500">Appointment time</p>
                  <p className="mt-1 font-semibold text-[#183b3b]">
                    {selectedTime}
                  </p>
                </div>

                {appointment.reason && (
                  <div>
                    <p className="text-slate-500">Reason for visit</p>
                    <p className="mt-1 break-words font-semibold text-[#183b3b]">
                      {appointment.reason}
                    </p>
                  </div>
                )}
              </div>

              <div className="my-5 border-t border-slate-200" />

              <div className="flex items-center justify-between gap-3">
                <span className="font-semibold text-slate-600">
                  Consultation fee
                </span>

                <span className="text-xl font-bold text-[#0B63CE]">
                  {fee}
                </span>
              </div>

              <div className="mt-5 flex items-start gap-3 rounded-xl bg-[#e5f4f2] p-4">
                <LockKeyhole
                  size={19}
                  className="mt-0.5 shrink-0 text-[#245b5b]"
                />

                <p className="text-xs leading-5 text-[#245b5b]">
                  Your appointment details are displayed here for
                  review. Real payment processing requires a payment
                  provider integration.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Payment;
