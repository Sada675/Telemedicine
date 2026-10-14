import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import {
  CalendarDays,
  Clock3,
  ArrowRight,
  Check,
  UserRound,
} from "lucide-react";

import drMunib from "../assets/dr-munib121.jpg";
import ladyDoc from "../assets/lady-doc.jpg";

type DaySchedule = {
  day: string;
  enabled: boolean;
  startTime: string;
  endTime: string;
  breakStart: string;
  breakEnd: string;
};

type AvailabilitySettings = {
  schedule: DaySchedule[];
  appointmentDuration: string;
  maxAppointments: string;
  consultationFee: string;
};

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

type AvailableDate = {
  day: string;
  date: string;
  month: string;
  isoDate: string;
  weekday: string;
};

const doctors: Doctor[] = [
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

// Default schedule matches DoctorAvailability.tsx.
// Saved settings will override these values for Dr. Munib.
const defaultSchedule: DaySchedule[] = [
  {
    day: "Monday",
    enabled: true,
    startTime: "09:00",
    endTime: "17:00",
    breakStart: "13:00",
    breakEnd: "14:00",
  },
  {
    day: "Tuesday",
    enabled: true,
    startTime: "09:00",
    endTime: "17:00",
    breakStart: "13:00",
    breakEnd: "14:00",
  },
  {
    day: "Wednesday",
    enabled: true,
    startTime: "10:00",
    endTime: "16:00",
    breakStart: "13:00",
    breakEnd: "14:00",
  },
  {
    day: "Thursday",
    enabled: true,
    startTime: "09:00",
    endTime: "17:00",
    breakStart: "13:00",
    breakEnd: "14:00",
  },
  {
    day: "Friday",
    enabled: true,
    startTime: "09:00",
    endTime: "14:00",
    breakStart: "12:00",
    breakEnd: "12:30",
  },
  {
    day: "Saturday",
    enabled: false,
    startTime: "09:00",
    endTime: "13:00",
    breakStart: "11:00",
    breakEnd: "11:30",
  },
  {
    day: "Sunday",
    enabled: false,
    startTime: "09:00",
    endTime: "13:00",
    breakStart: "11:00",
    breakEnd: "11:30",
  },
];

function getLocalDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function timeToMinutes(time: string): number {
  if (!time || !time.includes(":")) return 0;

  const [hours, minutes] = time.split(":").map(Number);

  return hours * 60 + minutes;
}

function minutesToTime(totalMinutes: number): string {
  const hours24 = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  const period = hours24 >= 12 ? "PM" : "AM";
  const hours12 = hours24 % 12 || 12;

  return `${String(hours12).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0",
  )} ${period}`;
}

function getDayLabel(date: Date): string {
  const today = new Date();
  const tomorrow = new Date();

  today.setHours(0, 0, 0, 0);
  tomorrow.setHours(0, 0, 0, 0);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const currentDate = new Date(date);
  currentDate.setHours(0, 0, 0, 0);

  if (currentDate.getTime() === today.getTime()) {
    return "Today";
  }

  if (currentDate.getTime() === tomorrow.getTime()) {
    return "Tomorrow";
  }

  return date.toLocaleDateString("en-US", {
    weekday: "short",
  });
}

function formatFullDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getAvailableDates(
  schedule: DaySchedule[],
  duration: number,
): AvailableDate[] {
  const availableDates: AvailableDate[] = [];
  const today = new Date();

  for (let offset = 0; offset < 30; offset++) {
    const date = new Date(today);
    date.setDate(today.getDate() + offset);

    const weekday = date.toLocaleDateString("en-US", {
      weekday: "long",
    });

    const daySchedule = schedule.find(
      (item) => item.day === weekday && item.enabled,
    );

    if (!daySchedule) continue;

    const slots = getSlotsForDate(date, daySchedule, duration);

    if (slots.length === 0) continue;

    availableDates.push({
      day: getDayLabel(date),
      date: String(date.getDate()),
      month: date.toLocaleDateString("en-US", {
        month: "short",
      }),
      isoDate: getLocalDateKey(date),
      weekday,
    });

    // Show a manageable number of available dates.
    if (availableDates.length >= 10) break;
  }

  return availableDates;
}

function getSlotsForDate(
  date: Date,
  schedule: DaySchedule,
  duration: number,
): string[] {
  if (!schedule.enabled || duration <= 0) return [];

  const start = timeToMinutes(schedule.startTime);
  const end = timeToMinutes(schedule.endTime);
  const breakStart = timeToMinutes(schedule.breakStart);
  const breakEnd = timeToMinutes(schedule.breakEnd);

  if (end <= start) return [];

  const slots: string[] = [];
  const now = new Date();
  const isToday = getLocalDateKey(date) === getLocalDateKey(now);
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  for (
    let slotStart = start;
    slotStart + duration <= end;
    slotStart += duration
  ) {
    const slotEnd = slotStart + duration;

    // Do not show slots that overlap the doctor's break.
    const overlapsBreak =
      breakStart < breakEnd &&
      slotStart < breakEnd &&
      slotEnd > breakStart;

    if (overlapsBreak) continue;

    // Do not show past appointment times for today.
    if (isToday && slotStart <= currentMinutes) continue;

    slots.push(minutesToTime(slotStart));
  }

  return slots;
}

function BookAppointment() {
  const navigate = useNavigate();

  const [selectedDoctor, setSelectedDoctor] = useState<Doctor>(doctors[0]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [reason, setReason] = useState("");

  const [availabilitySettings, setAvailabilitySettings] =
    useState<AvailabilitySettings | null>(null);

  // Read the doctor's saved availability settings.
  useEffect(() => {
    const loadAvailability = () => {
      const savedSettings = localStorage.getItem(
        "doctorAvailabilitySettings",
      );

      if (!savedSettings) {
        setAvailabilitySettings(null);
        return;
      }

      try {
        const parsedSettings = JSON.parse(
          savedSettings,
        ) as AvailabilitySettings;

        if (Array.isArray(parsedSettings.schedule)) {
          setAvailabilitySettings(parsedSettings);
        } else {
          setAvailabilitySettings(null);
        }
      } catch {
        console.error("Unable to load doctor availability.");
        setAvailabilitySettings(null);
      }
    };

    loadAvailability();

    // Listen for updates made in another browser tab.
    window.addEventListener("storage", loadAvailability);

    // Listen for updates made in the same tab.
    window.addEventListener("availabilityUpdated", loadAvailability);

    return () => {
      window.removeEventListener("storage", loadAvailability);
      window.removeEventListener("availabilityUpdated", loadAvailability);
    };
  }, []);

  // Only Dr. Munib uses the saved settings for now.
  const currentSchedule = useMemo(() => {
    if (selectedDoctor.id === 1 && availabilitySettings?.schedule) {
      return availabilitySettings.schedule;
    }

    return defaultSchedule;
  }, [selectedDoctor.id, availabilitySettings]);

  const appointmentDuration = useMemo(() => {
    if (selectedDoctor.id === 1 && availabilitySettings) {
      const duration = Number(availabilitySettings.appointmentDuration);

      if (Number.isFinite(duration) && duration > 0) {
        return duration;
      }
    }

    return 30;
  }, [selectedDoctor.id, availabilitySettings]);

  const availableDates = useMemo(() => {
    return getAvailableDates(currentSchedule, appointmentDuration);
  }, [currentSchedule, appointmentDuration]);

  const activeDate = availableDates.find(
    (date) => date.isoDate === selectedDate,
  );

  const timeSlots = useMemo(() => {
    if (!activeDate) return [];

    const daySchedule = currentSchedule.find(
      (item) => item.day === activeDate.weekday && item.enabled,
    );

    if (!daySchedule) return [];

    return getSlotsForDate(
      new Date(`${activeDate.isoDate}T12:00:00`),
      daySchedule,
      appointmentDuration,
    );
  }, [activeDate, currentSchedule, appointmentDuration]);

  // Select the first available date when settings or doctor change.
  useEffect(() => {
    const currentDateExists = availableDates.some(
      (date) => date.isoDate === selectedDate,
    );

    if (!currentDateExists) {
      setSelectedDate(availableDates[0]?.isoDate ?? "");
      setSelectedTime("");
    }
  }, [availableDates, selectedDate]);

  // Keep the selected time valid for the selected date.
  useEffect(() => {
    if (!timeSlots.includes(selectedTime)) {
      setSelectedTime(timeSlots[0] ?? "");
    }
  }, [timeSlots, selectedTime]);

  const consultationFee =
    selectedDoctor.id === 1 && availabilitySettings
      ? `PKR ${Number(
          availabilitySettings.consultationFee || 0,
        ).toLocaleString("en-PK")}`
      : selectedDoctor.feePKR;

  const canContinue = Boolean(
    selectedDoctor &&
      activeDate &&
      selectedTime &&
      timeSlots.includes(selectedTime) &&
      reason.trim(),
  );

  const handleDoctorSelect = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setSelectedDate("");
    setSelectedTime("");
  };

  return (
    <div className="min-h-screen bg-[#f8faf9]">
      <Navbar />

      <main className="px-4 pb-16 pt-28 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-6xl">
          {/* Page Header */}
          <div className="mb-8">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#e5f4f2] px-4 py-2 text-sm font-semibold text-[#245b5b]">
              <CalendarDays size={16} />
              Book Appointment
            </div>

            <h1 className="text-3xl font-bold text-[#183b3b] sm:text-4xl">
              Schedule Your Consultation
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              Choose your doctor, select a convenient time, and tell us
              briefly what you would like to discuss.
            </p>
          </div>

          {/* Progress */}
          <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0B63CE] text-sm font-bold text-white">
                1
              </div>

              <div className="flex-1">
                <p className="text-sm font-semibold text-[#183b3b]">
                  Appointment Details
                </p>
                <p className="text-xs text-slate-500">
                  Doctor, date, time & consultation reason
                </p>
              </div>

              <div className="hidden h-px w-16 bg-slate-200 sm:block" />

              <div className="hidden items-center gap-2 sm:flex">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-400">
                  2
                </div>
                <span className="text-sm text-slate-400">
                  Review & Payment
                </span>
              </div>

              <div className="hidden h-px w-16 bg-slate-200 sm:block" />

              <div className="hidden items-center gap-2 sm:flex">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-400">
                  3
                </div>
                <span className="text-sm text-slate-400">Confirmation</span>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
            {/* LEFT SIDE */}
            <div className="space-y-6">
              {/* Select Doctor */}
              <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
                <div className="mb-5">
                  <h2 className="text-xl font-bold text-[#183b3b]">
                    1. Choose Your Doctor
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Select the doctor you would like to consult.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {doctors.map((doctor) => {
                    const isSelected = selectedDoctor.id === doctor.id;

                    const doctorFee =
                      doctor.id === 1 && availabilitySettings
                        ? `PKR ${Number(
                            availabilitySettings.consultationFee || 0,
                          ).toLocaleString("en-PK")}`
                        : doctor.feePKR;

                    return (
                      <button
                        key={doctor.id}
                        type="button"
                        onClick={() => handleDoctorSelect(doctor)}
                        className={`relative rounded-2xl border p-4 text-left transition-all ${
                          isSelected
                            ? "border-[#183b3b] bg-[#f1f8f7] shadow-md"
                            : "border-slate-200 hover:border-[#8bb5b0] hover:shadow-sm"
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-[#0B63CE] text-white">
                            <Check size={14} />
                          </div>
                        )}

                        <div className="flex gap-4">
                          <img
                            src={doctor.image}
                            alt={doctor.name}
                            className="h-20 w-20 rounded-2xl object-cover object-top"
                          />

                          <div className="min-w-0">
                            <h3 className="font-bold text-[#183b3b]">
                              {doctor.name}
                            </h3>

                            <p className="mt-1 text-sm text-[#536276]">
                              {doctor.specialty}
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              {doctor.qualifications}
                            </p>

                            <p className="mt-2 text-xs text-slate-500">
                              {doctor.languages}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 border-t border-slate-200 pt-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-slate-500">
                              Consultation fee
                            </span>

                            <span className="text-sm font-bold text-[#183b3b]">
                              {doctorFee}
                            </span>
                          </div>

                          <p className="mt-1 text-right text-xs text-slate-400">
                            International: {doctor.feeUSD}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* Select Date */}
              <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
                <div className="mb-5">
                  <h2 className="text-xl font-bold text-[#183b3b]">
                    2. Select Date
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Choose an available date for your consultation.
                  </p>
                </div>

                {availableDates.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                    {availableDates.map((item) => {
                      const isSelected = selectedDate === item.isoDate;

                      return (
                        <button
                          key={item.isoDate}
                          type="button"
                          onClick={() => {
                            setSelectedDate(item.isoDate);
                            setSelectedTime("");
                          }}
                          className={`rounded-2xl border px-3 py-4 transition-all ${
                            isSelected
                              ? "border-[#0B63CE] bg-[#0B63CE] text-white shadow-md"
                              : "border-slate-200 bg-white text-[#183b3b] hover:border-[#8bb5b0]"
                          }`}
                        >
                          <p
                            className={`text-xs font-medium ${
                              isSelected ? "text-white/80" : "text-slate-500"
                            }`}
                          >
                            {item.day}
                          </p>

                          <p className="mt-1 text-2xl font-bold">
                            {item.date}
                          </p>

                          <p
                            className={`text-xs ${
                              isSelected ? "text-white/80" : "text-slate-500"
                            }`}
                          >
                            {item.month}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <p className="rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
                    No available dates. Please check the doctor's working
                    schedule.
                  </p>
                )}
              </section>

              {/* Time */}
              <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
                <div className="mb-5">
                  <h2 className="text-xl font-bold text-[#183b3b]">
                    3. Choose Time
                  </h2>

                  <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                    <Clock3 size={16} />
                    <span>All times are shown in your local timezone.</span>
                  </div>
                </div>

                {timeSlots.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                    {timeSlots.map((time) => {
                      const isSelected = selectedTime === time;

                      return (
                        <button
                          key={time}
                          type="button"
                          onClick={() => setSelectedTime(time)}
                          className={`rounded-xl border px-4 py-3 text-sm font-semibold transition-all ${
                            isSelected
                              ? "border-[#0B63CE] bg-[#0B63CE] text-white shadow-md"
                              : "border-slate-200 text-[#183b3b] hover:border-[#8bb5b0] hover:bg-[#f5faf9]"
                          }`}
                        >
                          {time}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <p className="rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
                    No time slots are available for this date. Please select
                    another date.
                  </p>
                )}
              </section>

              {/* Reason */}
              <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
                <div className="mb-5">
                  <h2 className="text-xl font-bold text-[#183b3b]">
                    4. Consultation Reason
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Briefly tell the doctor what you would like help with.
                  </p>
                </div>

                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={5}
                  placeholder="For example: I would like to discuss my recent symptoms..."
                  className="w-full resize-none rounded-2xl border border-slate-200 bg-[#fbfdfc] px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#536276] focus:ring-2 focus:ring-[#536276]/10"
                />

                <p className="mt-2 text-xs text-slate-500">
                  Please do not include passwords or other sensitive account
                  information.
                </p>
              </section>
            </div>

            {/* RIGHT SIDE SUMMARY */}
            <aside className="lg:sticky lg:top-24 lg:h-fit">
              <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div className="bg-gradient-to-r from-[#410200] via-[#536276] to-[#151b54] p-6 text-white">
                  <p className="text-sm text-white/70">
                    Appointment Summary
                  </p>

                  <h2 className="mt-1 text-xl font-bold">
                    Your Consultation
                  </h2>
                </div>

                <div className="space-y-5 p-6">
                  {/* Doctor */}
                  <div className="flex items-center gap-3">
                    <img
                      src={selectedDoctor.image}
                      alt={selectedDoctor.name}
                      className="h-14 w-14 rounded-xl object-cover object-top"
                    />

                    <div>
                      <p className="text-sm font-bold text-[#183b3b]">
                        {selectedDoctor.name}
                      </p>

                      <p className="text-xs text-slate-500">
                        {selectedDoctor.specialty}
                      </p>
                    </div>
                  </div>

                  <div className="h-px bg-slate-100" />

                  {/* Details */}
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="rounded-lg bg-[#e5f4f2] p-2 text-[#245b5b]">
                        <CalendarDays size={17} />
                      </div>

                      <div>
                        <p className="text-xs text-slate-400">Date</p>

                        <p className="mt-0.5 text-sm font-semibold text-[#183b3b]">
                          {activeDate
                            ? formatFullDate(new Date(`${activeDate.isoDate}T12:00:00`))
                            : "No date available"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="rounded-lg bg-[#e5f4f2] p-2 text-[#245b5b]">
                        <Clock3 size={17} />
                      </div>

                      <div>
                        <p className="text-xs text-slate-400">Time</p>

                        <p className="mt-0.5 text-sm font-semibold text-[#183b3b]">
                          {selectedTime || "Select a time"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="rounded-lg bg-[#e5f4f2] p-2 text-[#245b5b]">
                        <UserRound size={17} />
                      </div>

                      <div>
                        <p className="text-xs text-slate-400">Consultation</p>

                        <p className="mt-0.5 text-sm font-semibold text-[#183b3b]">
                          Online Video Consultation
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-slate-100" />

                  {/* Fee */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">
                      Consultation Fee
                    </span>

                    <span className="text-lg font-bold text-[#183b3b]">
                      {consultationFee}
                    </span>
                  </div>

                  <button
                    type="button"
                    disabled={!canContinue}
                    onClick={() =>
                      navigate("/review-appointment", {
                        state: {
                          selectedDoctor,

                          // Keep the original day-number property for
                          // compatibility with the existing review page.
                          selectedDate: activeDate?.date ?? "",
                          selectedDateISO: selectedDate,
                          selectedDateLabel: activeDate
                            ? formatFullDate(
                                new Date(`${activeDate.isoDate}T12:00:00`),
                              )
                            : "",

                          selectedTime,
                          reason,
                          consultationFee,
                        },
                      })
                    }
                    className={`flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-semibold text-white shadow-md transition-all ${
                      canContinue
                        ? "btn-dark hover:-translate-y-0.5 hover:bg-[#245b5b] hover:shadow-lg"
                        : "cursor-not-allowed bg-slate-300"
                    }`}
                  >
                    Continue to Review
                    <ArrowRight size={17} />
                  </button>

                  <p className="text-center text-xs leading-5 text-slate-500">
                    Your selected slot will be temporarily held during the
                    booking process.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}

export default BookAppointment;