import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Bell,
  CalendarDays,
  Check,
  CheckCheck,
  ChevronDown,
  CreditCard,
  FileText,
  Clock,
  Info,
  MoreHorizontal,
  Trash2,
  Inbox,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

type UserRole = "patient" | "doctor";

type NotificationType =
  | "appointment"
  | "payment"
  | "prescription"
  | "reminder"
  | "system";

type FilterType =
  | "all"
  | "unread"
  | "appointments"
  | "payments"
  | "prescriptions";

interface NotificationItem {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const PATIENT_STORAGE_KEY = "telemedicineNotifications";
const DOCTOR_STORAGE_KEY = "telemedicineDoctorNotifications";

const patientNotifications: NotificationItem[] = [
  {
    id: 1,
    type: "appointment",
    title: "Appointment Approved",
    message:
      "Dr. Munib has approved your appointment for October 14 at 4:00 PM.",
    time: "10 minutes ago",
    read: false,
  },
  {
    id: 2,
    type: "appointment",
    title: "Appointment Request Received",
    message:
      "Your appointment request with Dr. Nazli is awaiting confirmation.",
    time: "1 hour ago",
    read: false,
  },
  {
    id: 3,
    type: "payment",
    title: "Payment Successful",
    message:
      "Your payment of PKR 3,000 was completed successfully.",
    time: "Yesterday, 3:45 PM",
    read: false,
  },
  {
    id: 4,
    type: "prescription",
    title: "New Prescription Available",
    message:
      "Dr. Munib has added a prescription to your account.",
    time: "Yesterday, 11:20 AM",
    read: true,
  },
  {
    id: 5,
    type: "reminder",
    title: "Upcoming Consultation",
    message:
      "Your consultation with Dr. Nazli is scheduled for tomorrow at 11:00 AM.",
    time: "2 days ago",
    read: true,
  },
  {
    id: 6,
    type: "system",
    title: "Welcome to Telemedicine",
    message:
      "Manage your appointments and prescriptions in one place.",
    time: "3 days ago",
    read: true,
  },
];

const doctorNotifications: NotificationItem[] = [
  {
    id: 101,
    type: "appointment",
    title: "New Appointment Request",
    message:
      "A patient has requested an appointment for October 14 at 4:00 PM.",
    time: "10 minutes ago",
    read: false,
  },
  {
    id: 102,
    type: "appointment",
    title: "Upcoming Appointment",
    message:
      "You have a scheduled consultation tomorrow at 11:00 AM.",
    time: "1 hour ago",
    read: false,
  },
  {
    id: 103,
    type: "reminder",
    title: "Appointment Reminder",
    message:
      "Please review your upcoming consultations and appointment schedule.",
    time: "Yesterday, 3:45 PM",
    read: false,
  },
  {
    id: 104,
    type: "payment",
    title: "Consultation Payment",
    message:
      "A patient has completed payment for a consultation.",
    time: "Yesterday, 11:20 AM",
    read: true,
  },
  {
    id: 105,
    type: "prescription",
    title: "Prescription Reminder",
    message:
      "Remember to complete and review pending patient prescriptions.",
    time: "2 days ago",
    read: true,
  },
  {
    id: 106,
    type: "system",
    title: "Welcome to Telemedicine",
    message:
      "Manage your appointments and consultations from your dashboard.",
    time: "3 days ago",
    read: true,
  },
];

const filterOptions: {
  label: string;
  value: FilterType;
}[] = [
  { label: "All notifications", value: "all" },
  { label: "Unread", value: "unread" },
  { label: "Appointments", value: "appointments" },
  { label: "Payments", value: "payments" },
  { label: "Prescriptions", value: "prescriptions" },
];

function getUserRole(): UserRole {
  const role = (
    localStorage.getItem("userRole") || "patient"
  ).toLowerCase();

  return role === "doctor" ? "doctor" : "patient";
}

function getStorageKey(role: UserRole) {
  return role === "doctor"
    ? DOCTOR_STORAGE_KEY
    : PATIENT_STORAGE_KEY;
}

function getInitialNotifications(
  role: UserRole
): NotificationItem[] {
  return role === "doctor"
    ? doctorNotifications
    : patientNotifications;
}

function getIcon(type: NotificationType) {
  switch (type) {
    case "appointment":
    case "reminder":
      return CalendarDays;
    case "payment":
      return CreditCard;
    case "prescription":
      return FileText;
    default:
      return Info;
  }
}

function getIconStyle(type: NotificationType) {
  switch (type) {
    case "appointment":
      return "bg-blue-50 text-[#0B63CE]";
    case "payment":
      return "bg-emerald-50 text-emerald-600";
    case "prescription":
      return "bg-violet-50 text-violet-600";
    case "reminder":
      return "bg-amber-50 text-amber-600";
    default:
      return "bg-slate-100 text-slate-600";
  }
}

function getActionLink(
  type: NotificationType,
  role: UserRole
) {
  if (role === "doctor") {
    switch (type) {
      case "appointment":
      case "reminder":
        return "/doctor-appointments";
      case "prescription":
        return "/doctor-prescriptions";
      case "payment":
        return "/doctor-appointments";
      default:
        return "/doctor-dashboard";
    }
  }

  switch (type) {
    case "appointment":
    case "reminder":
      return "/appointments";
    case "payment":
      return "/appointments";
    case "prescription":
      return "/prescriptions";
    default:
      return "/patient-dashboard";
  }
}

function getActionText(
  type: NotificationType,
  role: UserRole
) {
  if (role === "doctor") {
    switch (type) {
      case "appointment":
      case "reminder":
        return "View appointments";
      case "payment":
        return "View appointments";
      case "prescription":
        return "View prescriptions";
      default:
        return "View dashboard";
    }
  }

  switch (type) {
    case "appointment":
    case "reminder":
      return "View appointment";
    case "payment":
      return "View payment";
    case "prescription":
      return "View prescription";
    default:
      return "View dashboard";
  }
}

function Notifications() {
  const [role, setRole] = useState<UserRole>(getUserRole);
  const [notifications, setNotifications] = useState<
    NotificationItem[]
  >([]);
  const [loaded, setLoaded] = useState(false);
  const [filter, setFilter] = useState<FilterType>("all");
  const [filterOpen, setFilterOpen] = useState(false);
  const [menuId, setMenuId] = useState<number | null>(null);
  const [clearConfirm, setClearConfirm] = useState(false);

  const filterRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Load the notifications belonging to the current role.
  useEffect(() => {
    function loadNotifications() {
      const currentRole = getUserRole();
      const storageKey = getStorageKey(currentRole);
      const initialData = getInitialNotifications(currentRole);

      setRole(currentRole);
      setLoaded(false);
      setFilter("all");
      setMenuId(null);
      setClearConfirm(false);

      try {
        const saved = localStorage.getItem(storageKey);

        if (saved !== null) {
          const parsed: unknown = JSON.parse(saved);

          if (Array.isArray(parsed)) {
            setNotifications(parsed as NotificationItem[]);
          } else {
            setNotifications(initialData);
          }
        } else {
          setNotifications(initialData);
        }
      } catch {
        setNotifications(initialData);
      } finally {
        setLoaded(true);
      }
    }

    loadNotifications();

    // Support role changes and login/logout in the same tab.
    window.addEventListener("authChange", loadNotifications);
    window.addEventListener("storage", loadNotifications);

    return () => {
      window.removeEventListener("authChange", loadNotifications);
      window.removeEventListener("storage", loadNotifications);
    };
  }, []);

  // Save changes only after notifications have loaded.
  useEffect(() => {
    if (!loaded) return;

    try {
      localStorage.setItem(
        getStorageKey(role),
        JSON.stringify(notifications)
      );
    } catch {
      console.error("Unable to save notifications.");
    }
  }, [notifications, loaded, role]);

  // Close dropdowns when clicking outside.
  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      const target = event.target as Node;

      if (
        filterRef.current &&
        !filterRef.current.contains(target)
      ) {
        setFilterOpen(false);
      }

      if (
        menuRef.current &&
        !menuRef.current.contains(target)
      ) {
        setMenuId(null);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  const isDoctor = role === "doctor";

  const dashboardLink = isDoctor
    ? "/doctor-dashboard"
    : "/patient-dashboard";

  const unreadCount = notifications.filter(
    (item) => !item.read
  ).length;

  const selectedFilter =
    filterOptions.find(
      (option) => option.value === filter
    )?.label ?? "All notifications";

  const filteredNotifications = notifications.filter(
    (item) => {
      switch (filter) {
        case "unread":
          return !item.read;

        case "appointments":
          return (
            item.type === "appointment" ||
            item.type === "reminder"
          );

        case "payments":
          return item.type === "payment";

        case "prescriptions":
          return item.type === "prescription";

        default:
          return true;
      }
    }
  );

  function markAsRead(id: number) {
    setNotifications((previous) =>
      previous.map((item) =>
        item.id === id ? { ...item, read: true } : item
      )
    );

    setMenuId(null);
  }

  function toggleRead(id: number) {
    setNotifications((previous) =>
      previous.map((item) =>
        item.id === id
          ? { ...item, read: !item.read }
          : item
      )
    );

    setMenuId(null);
  }

  function deleteNotification(id: number) {
    setNotifications((previous) =>
      previous.filter((item) => item.id !== id)
    );

    setMenuId(null);
  }

  function markAllAsRead() {
    setNotifications((previous) =>
      previous.map((item) => ({
        ...item,
        read: true,
      }))
    );
  }

  function clearAll() {
    setNotifications([]);
    setClearConfirm(false);
  }

  if (!loaded) {
    return (
      <div className="min-h-screen bg-[#f8faf9]">
        <Navbar />
        <div className="mx-auto max-w-5xl px-4 py-16 text-center text-sm text-slate-500">
          Loading notifications...
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-clip bg-[#f8faf9] text-slate-800">
      <Navbar />

      <main className="mx-auto min-h-[70vh] w-full max-w-5xl px-3 py-24 sm:px-6 sm:py-24 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#0B63CE]">
              <Bell size={22} />
            </div>

            <div className="min-w-0">
              <h1 className="text-xl font-bold text-slate-900 sm:text-2xl lg:text-3xl">
                Notifications
              </h1>

              <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
                {isDoctor
                  ? "Stay updated on your appointments and consultations."
                  : "Stay updated on your healthcare activities."}
              </p>

              {unreadCount > 0 && (
                <p className="mt-1.5 text-xs font-medium text-[#0B63CE] sm:text-sm">
                  {unreadCount} unread{" "}
                  {unreadCount === 1
                    ? "notification"
                    : "notifications"}
                </p>
              )}
            </div>
          </div>

          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllAsRead}
              className="inline-flex w-fit items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-[#0B63CE] transition hover:bg-blue-50 sm:text-sm"
            >
              <CheckCheck size={17} />
              Mark all as read
            </button>
          )}
        </div>

        {/* Notifications container */}
        <section className="relative w-full min-w-0 rounded-xl border border-slate-200 bg-white shadow-sm sm:rounded-2xl">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-3 py-4 sm:px-5 lg:px-6">
            <div className="min-w-0">
              <h2 className="text-sm font-semibold text-slate-900 sm:text-base">
                Recent notifications
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                {filteredNotifications.length} notifications
              </p>
            </div>

            {/* Filter dropdown */}
            <div className="relative shrink-0" ref={filterRef}>
              <button
                type="button"
                aria-haspopup="listbox"
                aria-expanded={filterOpen}
                onClick={() =>
                  setFilterOpen((previous) => !previous)
                }
                className={`flex max-w-[185px] items-center gap-2 rounded-lg border px-2.5 py-2 text-xs font-medium transition sm:max-w-none sm:px-3.5 sm:py-2.5 sm:text-sm ${
                  filterOpen
                    ? "border-[#0B63CE] text-[#0B63CE] ring-2 ring-blue-50"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                <span className="truncate">{selectedFilter}</span>

                <ChevronDown
                  size={15}
                  className={`shrink-0 transition-transform ${
                    filterOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {filterOpen && (
                <div
                  role="listbox"
                  aria-label="Filter notifications"
                  className="absolute right-0 top-full z-30 mt-2 w-48 max-w-[calc(100vw-32px)] rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl sm:w-52"
                >
                  {filterOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      role="option"
                      aria-selected={filter === option.value}
                      onClick={() => {
                        setFilter(option.value);
                        setFilterOpen(false);
                      }}
                      className={`flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-left text-xs transition sm:text-sm ${
                        filter === option.value
                          ? "bg-blue-50 font-semibold text-[#0B63CE]"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <span>{option.label}</span>

                      {filter === option.value && (
                        <Check size={15} className="shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Notification list */}
          {filteredNotifications.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {filteredNotifications.map((notification) => {
                const Icon = getIcon(notification.type);

                return (
                  <article
                    key={notification.id}
                    className={`flex min-w-0 gap-3 px-3 py-4 transition sm:gap-4 sm:px-5 sm:py-5 lg:px-6 ${
                      notification.read
                        ? "bg-white hover:bg-slate-50/70"
                        : "bg-blue-50/40 hover:bg-blue-50/70"
                    }`}
                  >
                    {/* Icon */}
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl sm:h-12 sm:w-12 ${getIconStyle(
                        notification.type
                      )}`}
                    >
                      <Icon size={20} strokeWidth={1.8} />
                    </div>

                    {/* Text */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <h3
                          className={`break-words text-[13px] sm:text-sm ${
                            notification.read
                              ? "font-semibold text-slate-800"
                              : "font-bold text-slate-900"
                          }`}
                        >
                          {notification.title}
                        </h3>

                        {!notification.read && (
                          <span
                            className="h-2 w-2 shrink-0 rounded-full bg-[#0B63CE]"
                            aria-label="Unread"
                          />
                        )}
                      </div>

                      <p className="mt-1.5 break-words text-xs leading-5 text-slate-500 sm:text-sm sm:leading-6">
                        {notification.message}
                      </p>

                      <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-2">
                        <span className="inline-flex items-center gap-1 text-[10px] text-slate-400 sm:text-xs">
                          <Clock size={12} />
                          {notification.time}
                        </span>

                        <Link
                          to={getActionLink(
                            notification.type,
                            role
                          )}
                          onClick={() =>
                            markAsRead(notification.id)
                          }
                          className="text-[11px] font-semibold text-[#0B63CE] hover:underline sm:text-xs"
                        >
                          {getActionText(
                            notification.type,
                            role
                          )}
                        </Link>
                      </div>
                    </div>

                    {/* Options */}
                    <div
                      className="relative shrink-0"
                      ref={
                        menuId === notification.id
                          ? menuRef
                          : null
                      }
                    >
                      <button
                        type="button"
                        aria-label={`Options for ${notification.title}`}
                        aria-expanded={
                          menuId === notification.id
                        }
                        onClick={() =>
                          setMenuId((current) =>
                            current === notification.id
                              ? null
                              : notification.id
                          )
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 sm:h-9 sm:w-9"
                      >
                        <MoreHorizontal size={19} />
                      </button>

                      {menuId === notification.id && (
                        <div className="absolute right-0 top-9 z-30 w-44 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl sm:w-48">
                          <button
                            type="button"
                            onClick={() =>
                              toggleRead(notification.id)
                            }
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-xs text-slate-700 hover:bg-slate-50 sm:text-sm"
                          >
                            <Check size={15} />

                            {notification.read
                              ? "Mark as unread"
                              : "Mark as read"}
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              deleteNotification(notification.id)
                            }
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-xs text-rose-600 hover:bg-rose-50 sm:text-sm"
                          >
                            <Trash2 size={15} />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center px-4 py-12 text-center sm:py-16">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-[#0B63CE]">
                <Inbox size={27} />
              </div>

              <h3 className="mt-4 text-base font-bold text-slate-900">
                {filter === "unread"
                  ? "You're all caught up!"
                  : "No notifications found"}
              </h3>

              <p className="mt-2 max-w-sm text-xs leading-5 text-slate-500 sm:text-sm">
                {filter === "unread"
                  ? "You have no unread notifications."
                  : "No notifications are available in this category."}
              </p>

              {filter !== "all" && (
                <button
                  type="button"
                  onClick={() => setFilter("all")}
                  className="mt-4 text-sm font-semibold text-[#0B63CE] hover:underline"
                >
                  View all notifications
                </button>
              )}
            </div>
          )}

          {/* Bottom actions */}
          {notifications.length > 0 && (
            <div className="flex flex-col gap-3 border-t border-slate-100 px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:py-4 lg:px-6">
              <p className="text-[11px] text-slate-400 sm:text-xs">
                Showing {filteredNotifications.length} of{" "}
                {notifications.length} notifications
              </p>

              <button
                type="button"
                onClick={() => setClearConfirm(true)}
                className="inline-flex w-fit items-center gap-2 text-xs font-medium text-slate-500 hover:text-rose-600 sm:text-sm"
              >
                <Trash2 size={14} />
                Clear all notifications
              </button>
            </div>
          )}
        </section>

        <div className="mt-5">
          <Link
            to={dashboardLink}
            className="text-xs font-medium text-slate-500 transition hover:text-[#0B63CE] sm:text-sm"
          >
            ← Back to dashboard
          </Link>
        </div>
      </main>

      <Footer />

      {/* Confirmation modal */}
      {clearConfirm && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 px-4 py-6"
          onClick={() => setClearConfirm(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="clear-title"
            className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl sm:p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
              <Trash2 size={22} />
            </div>

            <h2
              id="clear-title"
              className="mt-4 text-lg font-bold text-slate-900"
            >
              Clear all notifications?
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              All notifications for your current role will be
              removed from this browser. This action cannot be
              undone.
            </p>

            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <button
                type="button"
                onClick={() => setClearConfirm(false)}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={clearAll}
                className="rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-700"
              >
                Clear all
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Notifications;
