import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  CheckCircle,
  Save,
  CalendarCheck,
  Users,
  Settings2,
  ChevronLeft,
  ChevronRight,
  Coffee,
  Stethoscope,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

type DaySchedule = {
  day: string;
  enabled: boolean;
  startTime: string;
  endTime: string;
  breakStart: string;
  breakEnd: string;
};

type Appointment = {
  id: number;
  patient: string;
  time: string;
  date: string;
  status: "Approved" | "Pending";
};

const initialSchedule: DaySchedule[] = [
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

const initialAppointments: Appointment[] = [
  {
    id: 1,
    patient: "Ayesha Khan",
    time: "10:00 AM",
    date: "Today",
    status: "Approved",
  },
  {
    id: 2,
    patient: "Fatima Ahmed",
    time: "11:30 AM",
    date: "Today",
    status: "Approved",
  },
  {
    id: 3,
    patient: "Sara Ali",
    time: "02:00 PM",
    date: "Tomorrow",
    status: "Pending",
  },
  {
    id: 4,
    patient: "Maryam Noor",
    time: "04:00 PM",
    date: "Tomorrow",
    status: "Approved",
  },
];

function DoctorAvailability() {
  const [schedule, setSchedule] =
    useState<DaySchedule[]>(initialSchedule);

  const [appointmentDuration, setAppointmentDuration] =
    useState("30");

  const [maxAppointments, setMaxAppointments] = useState("12");

  const [consultationFee, setConsultationFee] = useState("3000");

  const [appointments, setAppointments] =
    useState<Appointment[]>(initialAppointments);

  const [saved, setSaved] = useState(false);

  const [weekOffset, setWeekOffset] = useState(0);

  const [scheduleError, setScheduleError] = useState("");

  const [feeError, setFeeError] = useState("");

  const [activeDay, setActiveDay] = useState("Monday");

  const updateSchedule = (
    dayName: string,
    field: keyof DaySchedule,
    value: string | boolean
  ) => {
    setSchedule((previous) =>
      previous.map((day) =>
        day.day === dayName
          ? { ...day, [field]: value }
          : day
      )
    );

    setSaved(false);
    setScheduleError("");
  };

  const handleSaveSchedule = () => {
    const enabledDays = schedule.filter((day) => day.enabled);

    if (enabledDays.length === 0) {
      setScheduleError(
        "Please make at least one day available."
      );
      setSaved(false);
      return;
    }

    const invalidDay = enabledDays.find(
      (day) => day.startTime >= day.endTime
    );

    if (invalidDay) {
      setScheduleError(
        `${invalidDay.day}: End time must be later than start time.`
      );
      setSaved(false);
      return;
    }

    const invalidBreak = enabledDays.find(
      (day) =>
        day.breakStart < day.startTime ||
        day.breakEnd > day.endTime ||
        day.breakStart >= day.breakEnd
    );

    if (invalidBreak) {
      setScheduleError(
        `${invalidBreak.day}: Please enter a valid break within working hours.`
      );
      setSaved(false);
      return;
    }

    if (
      !Number.isFinite(Number(maxAppointments)) ||
      Number(maxAppointments) < 1 ||
      !Number.isInteger(Number(maxAppointments))
    ) {
      setScheduleError(
        "Maximum appointments must be a whole number greater than zero."
      );
      setSaved(false);
      return;
    }

    if (
      !Number.isFinite(Number(consultationFee)) ||
      Number(consultationFee) < 0 ||
      consultationFee.trim() === ""
    ) {
      setFeeError("Please enter a valid consultation fee.");
      setSaved(false);
      return;
    }

    setScheduleError("");
    setFeeError("");

    const settings = {
      schedule,
      appointmentDuration,
      maxAppointments,
      consultationFee,
    };

    localStorage.setItem(
      "doctorAvailabilitySettings",
      JSON.stringify(settings)
    );

    setSaved(true);
  };



  // Load saved settings when the page opens.
  useState(() => {
    const savedSettings = localStorage.getItem(
      "doctorAvailabilitySettings"
    );

    if (!savedSettings) return;

    try {
      const settings = JSON.parse(savedSettings);

      if (Array.isArray(settings.schedule)) {
        setSchedule(settings.schedule);
      }

      if (settings.appointmentDuration) {
        setAppointmentDuration(settings.appointmentDuration);
      }

      if (settings.maxAppointments) {
        setMaxAppointments(settings.maxAppointments);
      }

      if (settings.consultationFee !== undefined) {
        setConsultationFee(String(settings.consultationFee));
      }
    } catch {
      // Ignore invalid local storage data.
    }
  });

  const getWeekDates = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();

    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

    const monday = new Date(today);
    monday.setDate(
      today.getDate() + mondayOffset + weekOffset * 7
    );

    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + index);
      return date;
    });
  };

  const weekDates = getWeekDates();

  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

  const todayKey = new Date().toDateString();

  const availableDays = schedule.filter(
    (day) => day.enabled
  ).length;

  const approvedAppointments = appointments.filter(
    (appointment) => appointment.status === "Approved"
  ).length;

  const pendingAppointments = appointments.filter(
    (appointment) => appointment.status === "Pending"
  ).length;

  const activeDaySchedule = schedule.find(
    (day) => day.day === activeDay
  );

  const toggleAppointmentStatus = (id: number) => {
    setAppointments((previous) =>
      previous.map((appointment) =>
        appointment.id === id
          ? {
              ...appointment,
              status:
                appointment.status === "Approved"
                  ? "Pending"
                  : "Approved",
            }
          : appointment
      )
    );
  };

  const inputClass =
    "mt-2 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none transition focus:border-[#0B63CE] focus:ring-2 focus:ring-blue-100";

  return (
    <div className="min-h-screen bg-[#f8faf9]">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back to dashboard */}
        <Link
          to="/doctor-dashboard"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-[#0B63CE]"
        >
          <ArrowLeft size={17} />
          Back to Dashboard
        </Link>

        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-[#0B63CE]">
              <CalendarDays size={25} />
            </div>

            <h1 className="text-2xl font-bold text-[#183b3b] sm:text-3xl">
              Availability & Schedule
            </h1>

            <p className="mt-2 text-sm text-gray-500 sm:text-base">
              Manage your working hours and consultation availability.
            </p>
          </div>

          <button
            type="button"
            onClick={handleSaveSchedule}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0B63CE] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0955AE]"
          >
            <Save size={18} />
            Save Schedule
          </button>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Available Days
                </p>

                <h2 className="mt-2 text-3xl font-bold text-[#183b3b]">
                  {availableDays}
                  <span className="ml-1 text-base font-medium text-gray-400">
                    / 7
                  </span>
                </h2>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-[#0B63CE]">
                <CalendarCheck size={23} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Appointment Duration
                </p>

                <h2 className="mt-2 text-3xl font-bold text-[#183b3b]">
                  {appointmentDuration}
                  <span className="ml-1 text-sm font-medium text-gray-400">
                    min
                  </span>
                </h2>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-[#245b5b]">
                <Clock3 size={23} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Approved Appointments
                </p>

                <h2 className="mt-2 text-3xl font-bold text-[#183b3b]">
                  {approvedAppointments}
                </h2>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-600">
                <CheckCircle size={23} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Pending Appointments
                </p>

                <h2 className="mt-2 text-3xl font-bold text-[#183b3b]">
                  {pendingAppointments}
                </h2>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-[#F9A603]">
                <Users size={23} />
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Availability */}
        <section className="mb-8 rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-100 p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#0B63CE]">
                <CalendarDays size={21} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-[#183b3b]">
                  Weekly Availability
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Enable your working days and set consultation hours.
                </p>
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {schedule.map((day) => (
              <div
                key={day.day}
                className="p-5 transition hover:bg-gray-50/50 sm:px-6"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                  {/* Day and toggle */}
                  <div className="flex min-w-[180px] items-center justify-between gap-4 lg:justify-start">
                    <div>
                      <h3 className="font-semibold text-[#183b3b]">
                        {day.day}
                      </h3>

                      <p
                        className={`mt-1 text-xs font-medium ${
                          day.enabled
                            ? "text-green-600"
                            : "text-gray-400"
                        }`}
                      >
                        {day.enabled ? "Available" : "Unavailable"}
                      </p>
                    </div>

                    <button
                      type="button"
                      role="switch"
                      aria-checked={day.enabled}
                      aria-label={`Toggle ${day.day} availability`}
                      onClick={() =>
                        updateSchedule(
                          day.day,
                          "enabled",
                          !day.enabled
                        )
                      }
                      className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                        day.enabled
                          ? "bg-[#0B63CE]"
                          : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
                          day.enabled
                            ? "left-[22px]"
                            : "left-0.5"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Working hours */}
                  <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor={`${day.day}-start`}
                        className="text-xs font-medium text-gray-500"
                      >
                        Start Time
                      </label>

                      <input
                        id={`${day.day}-start`}
                        type="time"
                        disabled={!day.enabled}
                        value={day.startTime}
                        onChange={(event) =>
                          updateSchedule(
                            day.day,
                            "startTime",
                            event.target.value
                          )
                        }
                        className={`${inputClass} disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400`}
                      />
                    </div>

                    <div>
                      <label
                        htmlFor={`${day.day}-end`}
                        className="text-xs font-medium text-gray-500"
                      >
                        End Time
                      </label>

                      <input
                        id={`${day.day}-end`}
                        type="time"
                        disabled={!day.enabled}
                        value={day.endTime}
                        onChange={(event) =>
                          updateSchedule(
                            day.day,
                            "endTime",
                            event.target.value
                          )
                        }
                        className={`${inputClass} disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400`}
                      />
                    </div>
                  </div>

                  {/* Break times */}
                  <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor={`${day.day}-break-start`}
                        className="flex items-center gap-1 text-xs font-medium text-gray-500"
                      >
                        <Coffee size={13} />
                        Break Start
                      </label>

                      <input
                        id={`${day.day}-break-start`}
                        type="time"
                        disabled={!day.enabled}
                        value={day.breakStart}
                        onChange={(event) =>
                          updateSchedule(
                            day.day,
                            "breakStart",
                            event.target.value
                          )
                        }
                        className={`${inputClass} disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400`}
                      />
                    </div>

                    <div>
                      <label
                        htmlFor={`${day.day}-break-end`}
                        className="flex items-center gap-1 text-xs font-medium text-gray-500"
                      >
                        <Coffee size={13} />
                        Break End
                      </label>

                      <input
                        id={`${day.day}-break-end`}
                        type="time"
                        disabled={!day.enabled}
                        value={day.breakEnd}
                        onChange={(event) =>
                          updateSchedule(
                            day.day,
                            "breakEnd",
                            event.target.value
                          )
                        }
                        className={`${inputClass} disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {scheduleError && (
            <div className="mx-5 mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 sm:mx-6">
              {scheduleError}
            </div>
          )}

          {saved && (
            <div className="mx-5 mb-4 flex items-center gap-2 rounded-xl bg-green-50 px-4 py-3 text-sm font-medium text-green-700 sm:mx-6">
              <CheckCircle size={18} />
              Your availability and settings have been saved successfully.
            </div>
          )}

          <div className="flex flex-col gap-3 border-t border-gray-100 bg-gray-50/70 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <p className="text-xs leading-5 text-gray-500">
              Your changes are saved in this browser for this demo.
            </p>

            <button
              type="button"
              onClick={handleSaveSchedule}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0B63CE] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0955AE]"
            >
              <Save size={17} />
              Save Availability
            </button>
          </div>
        </section>

        {/* Consultation Settings */}
        <section className="mb-8 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-[#245b5b]">
              <Settings2 size={21} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-[#183b3b]">
                Consultation Settings
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Configure your appointment preferences.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label
                htmlFor="duration"
                className="text-sm font-semibold text-gray-700"
              >
                Appointment Duration
              </label>

              <select
                id="duration"
                value={appointmentDuration}
                onChange={(event) => {
                  setAppointmentDuration(event.target.value);
                  setSaved(false);
                }}
                className={inputClass}
              >
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
                <option value="60">60 minutes</option>
              </select>

              <p className="mt-2 text-xs text-gray-400">
                Duration of each consultation.
              </p>
            </div>

            <div>
              <label
                htmlFor="maxAppointments"
                className="text-sm font-semibold text-gray-700"
              >
                Maximum Appointments / Day
              </label>

              <input
                id="maxAppointments"
                type="number"
                min="1"
                step="1"
                value={maxAppointments}
                onChange={(event) => {
                  setMaxAppointments(event.target.value);
                  setSaved(false);
                  setScheduleError("");
                }}
                className={inputClass}
              />

              <p className="mt-2 text-xs text-gray-400">
                Maximum consultations you can accept daily.
              </p>
            </div>

            <div>
              <label
                htmlFor="consultationFee"
                className="text-sm font-semibold text-gray-700"
              >
                Consultation Fee (PKR)
              </label>

              <input
                id="consultationFee"
                type="number"
                min="0"
                step="1"
                value={consultationFee}
                onChange={(event) => {
                  setConsultationFee(event.target.value);
                  setSaved(false);
                  setFeeError("");
                }}
                className={inputClass}
              />

              <p className="mt-2 text-xs text-gray-400">
                Your consultation fee in Pakistani rupees.
              </p>

              {feeError && (
                <p className="mt-2 text-xs text-red-600">
                  {feeError}
                </p>
              )}
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 rounded-xl bg-blue-50 p-4 sm:flex-row sm:items-center">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-[#0B63CE]">
              <Stethoscope size={21} />
            </div>

            <div>
              <p className="text-sm font-semibold text-[#183b3b]">
                Your consultation preferences
              </p>

              <p className="mt-1 text-xs leading-5 text-gray-600">
                {appointmentDuration}-minute appointments · Up to{" "}
                {maxAppointments || "0"} appointments per day · PKR{" "}
                {Number(consultationFee || 0).toLocaleString("en-PK")} per consultation
              </p>
            </div>
          </div>
        </section>

        {/* Weekly Calendar */}
        <section className="mb-8 rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div>
              <h2 className="text-lg font-bold text-[#183b3b]">
                Weekly Calendar
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Review your availability for the selected week.
              </p>
            </div>

            <div className="flex items-center justify-between gap-3 sm:justify-end">
              <button
                type="button"
                onClick={() =>
                  setWeekOffset((previous) => previous - 1)
                }
                className="rounded-lg border border-gray-200 p-2 text-gray-600 transition hover:bg-gray-50"
                aria-label="Previous week"
              >
                <ChevronLeft size={19} />
              </button>

              <span className="min-w-[135px] text-center text-sm font-semibold text-[#183b3b]">
                {formatDate(weekDates[0])} –{" "}
                {formatDate(weekDates[6])}
              </span>

              <button
                type="button"
                onClick={() =>
                  setWeekOffset((previous) => previous + 1)
                }
                className="rounded-lg border border-gray-200 p-2 text-gray-600 transition hover:bg-gray-50"
                aria-label="Next week"
              >
                <ChevronRight size={19} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3 sm:p-6 lg:grid-cols-7">
            {weekDates.map((date) => {
              const dayName = date.toLocaleDateString("en-US", {
                weekday: "long",
              });

              const daySchedule = schedule.find(
                (day) => day.day === dayName
              );

              const isToday = date.toDateString() === todayKey;

              return (
                <button
                  key={date.toISOString()}
                  type="button"
                  onClick={() => setActiveDay(dayName)}
                  className={`rounded-xl border p-4 text-left transition ${
                    activeDay === dayName
                      ? "border-[#0B63CE] bg-blue-50 ring-1 ring-[#0B63CE]"
                      : "border-gray-100 bg-white hover:border-blue-200 hover:bg-gray-50"
                  }`}
                >
                  <p className="text-xs font-medium text-gray-500">
                    {dayName.slice(0, 3)}
                  </p>

                  <p className="mt-2 text-xl font-bold text-[#183b3b]">
                    {date.getDate()}
                  </p>

                  <div className="mt-3 flex items-center gap-1.5">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        daySchedule?.enabled
                          ? "bg-green-500"
                          : "bg-gray-300"
                      }`}
                    />

                    <span className="text-xs text-gray-500">
                      {daySchedule?.enabled
                        ? "Available"
                        : "Off"}
                    </span>
                  </div>

                  {isToday && (
                    <span className="mt-3 inline-block rounded-md bg-[#0B63CE] px-2 py-1 text-[10px] font-semibold text-white">
                      Today
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="border-t border-gray-100 p-5 sm:px-6">
            <h3 className="font-semibold text-[#183b3b]">
              {activeDay} Schedule
            </h3>

            {activeDaySchedule?.enabled ? (
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-xl bg-green-50 p-4">
                  <p className="text-xs text-gray-500">
                    Working Hours
                  </p>

                  <p className="mt-2 text-sm font-semibold text-green-700">
                    {activeDaySchedule.startTime} –{" "}
                    {activeDaySchedule.endTime}
                  </p>
                </div>

                <div className="rounded-xl bg-amber-50 p-4">
                  <p className="text-xs text-gray-500">
                    Break Time
                  </p>

                  <p className="mt-2 text-sm font-semibold text-amber-700">
                    {activeDaySchedule.breakStart} –{" "}
                    {activeDaySchedule.breakEnd}
                  </p>
                </div>

                <div className="rounded-xl bg-blue-50 p-4">
                  <p className="text-xs text-gray-500">
                    Appointment Duration
                  </p>

                  <p className="mt-2 text-sm font-semibold text-[#0B63CE]">
                    {appointmentDuration} minutes
                  </p>
                </div>
              </div>
            ) : (
              <div className="mt-4 rounded-xl bg-gray-50 p-5 text-center">
                <CalendarDays
                  size={26}
                  className="mx-auto text-gray-300"
                />

                <p className="mt-2 text-sm font-medium text-gray-600">
                  You are unavailable on {activeDay}.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Upcoming Appointments */}
        <section className="mb-8 rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div>
              <h2 className="text-lg font-bold text-[#183b3b]">
                Upcoming Appointments
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Review your upcoming patient consultations.
              </p>
            </div>

            <Link
              to="/doctor-appointments"
              className="inline-flex items-center justify-center rounded-full border border-blue-100 px-5 py-2.5 text-sm font-semibold text-[#0B63CE] transition hover:bg-blue-50"
            >
              View All Appointments
            </Link>
          </div>

          <div className="divide-y divide-gray-100">
            {appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-50 font-semibold text-[#0B63CE]">
                    {appointment.patient.charAt(0)}
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-[#183b3b]">
                      {appointment.patient}
                    </h3>

                    <p className="mt-1 text-xs text-gray-500">
                      {appointment.date} · {appointment.time}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 sm:justify-end">
                  <span
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                      appointment.status === "Approved"
                        ? "bg-green-50 text-green-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {appointment.status}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      toggleAppointmentStatus(appointment.id)
                    }
                    className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-600 transition hover:bg-gray-50"
                  >
                    Toggle Status
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-100 bg-gray-50/70 px-5 py-4 sm:px-6">
            <p className="text-xs leading-5 text-gray-500">
              Demo data only. Appointment status changes here do not
              update the Doctor Appointments page or patient records.
            </p>
          </div>
        </section>

        {/* Final Save */}
        <div className="mb-4 flex flex-col gap-4 rounded-2xl bg-gradient-to-r from-[#183b3b] to-[#245b5b] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <h2 className="text-lg font-bold text-white">
              Ready to update your schedule?
            </h2>

            <p className="mt-2 text-sm leading-6 text-white/75">
              Save your availability and consultation preferences.
            </p>
          </div>

          <button
            type="button"
            onClick={handleSaveSchedule}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#183b3b] transition hover:bg-gray-100"
          >
            <Save size={17} />
            Save Changes
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default DoctorAvailability;
