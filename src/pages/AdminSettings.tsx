import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  UserRound,
  Bell,
  ShieldCheck,
  Save,
  RotateCcw,
  Mail,
  CalendarDays,
  Activity,
  CheckCircle2,
  LockKeyhole,
  Eye,
  EyeOff,
  KeyRound,
  Home,
  ChevronRight,
} from "lucide-react";

interface AdminSettingsData {
  name: string;
  email: string;
  role: string;
  emailNotifications: boolean;
  appointmentAlerts: boolean;
  systemUpdates: boolean;
}

const defaultSettings: AdminSettingsData = {
  name: "Administrator",
  email: "admin@telemedicine.com",
  role: "Super Admin",
  emailNotifications: true,
  appointmentAlerts: true,
  systemUpdates: false,
};

type SettingsTab = "profile" | "notifications" | "security";

function AdminSettings() {
  const [activeTab, setActiveTab] =
    useState<SettingsTab>("profile");

  const [settings, setSettings] =
    useState<AdminSettingsData>(defaultSettings);

  const [saved, setSaved] = useState(false);

  // Password states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [passwordError, setPasswordError] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");

  // Load saved settings
  useEffect(() => {
    try {
      const stored = localStorage.getItem(
        "telemedicineAdminSettings",
      );

      if (stored) {
        const parsed = JSON.parse(stored);

        setSettings({
          ...defaultSettings,
          ...parsed,
        });
      }
    } catch (error) {
      console.error("Unable to load admin settings:", error);
    }
  }, []);

  // Update settings fields
  function handleChange(
    field: keyof AdminSettingsData,
    value: string | boolean,
  ) {
    setSettings((previous) => ({
      ...previous,
      [field]: value,
    }));

    setSaved(false);
  }

  // Save profile and notification settings
  function handleSave() {
    try {
      localStorage.setItem(
        "telemedicineAdminSettings",
        JSON.stringify(settings),
      );

      setSaved(true);

      window.setTimeout(() => {
        setSaved(false);
      }, 3000);
    } catch (error) {
      console.error("Unable to save admin settings:", error);
    }
  }

  // Reset profile and notification settings
  function handleReset() {
    setSettings(defaultSettings);

    localStorage.removeItem("telemedicineAdminSettings");

    setSaved(false);
  }

  // Clear password fields
  function clearPasswordFields() {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");

    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);

    setPasswordError("");
    setPasswordMessage("");
  }

  // Validate password form// Update admin password using localStorage (frontend demo only)
function handlePasswordUpdate() {
  setPasswordError("");
  setPasswordMessage("");

  if (
    !currentPassword.trim() ||
    !newPassword ||
    !confirmPassword
  ) {
    setPasswordError("Please fill in all password fields.");
    return;
  }

  if (newPassword.length < 8) {
    setPasswordError(
      "New password must contain at least 8 characters."
    );
    return;
  }

  if (
    !/[A-Z]/.test(newPassword) ||
    !/[0-9]/.test(newPassword)
  ) {
    setPasswordError(
      "Password must contain at least one uppercase letter and one number."
    );
    return;
  }

  if (currentPassword === newPassword) {
    setPasswordError(
      "Your new password must be different from your current password."
    );
    return;
  }

  if (newPassword !== confirmPassword) {
    setPasswordError(
      "New password and confirm password do not match."
    );
    return;
  }

  try {
    // Read saved admin credentials
    const storedCredentials = localStorage.getItem(
      "telemedicineAdminCredentials"
    );

    // Default credentials for the frontend demo
    const credentials = storedCredentials
      ? JSON.parse(storedCredentials)
      : {
          email: "admin@example.com",
          password: "Admin123",
        };

    // Verify current password
    if (currentPassword !== credentials.password) {
      setPasswordError("Your current password is incorrect.");
      return;
    }

    // Save new password
    localStorage.setItem(
      "telemedicineAdminCredentials",
      JSON.stringify({
        ...credentials,
        password: newPassword,
      })
    );

    setPasswordMessage(
      "Password updated successfully! You can now log in with your new password."
    );

    clearPasswordFields();
  } catch (error) {
    console.error("Unable to update password:", error);
    setPasswordError("Unable to update password. Please try again.");
  }
}

  const tabs = [
    {
      id: "profile" as const,
      label: "Profile Settings",
      description: "Manage your account information",
      icon: UserRound,
    },
    {
      id: "notifications" as const,
      label: "Notifications",
      description: "Manage your notification preferences",
      icon: Bell,
    },
    {
      id: "security" as const,
      label: "Security",
      description: "Manage your account security",
      icon: ShieldCheck,
    },
  ];

  return (

  <div className="min-h-screen w-full min-w-0 bg-[#f5f8fc] text-slate-800">
    <div className="mx-auto w-full max-w-[1200px] min-w-0 space-y-7 p-4 sm:p-7 lg:p-9">

        {/* PAGE HEADER */}
        {/* PAGE HEADER */}

<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
  {/* LEFT SIDE: BREADCRUMB + HEADING */}
  <div>
    {/* Breadcrumb — same as other admin pages */}
    <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
      <Link
        to="/admin-dashboard"
        className="flex items-center gap-1.5 text-slate-500 transition hover:text-[#0B63CE]"
      >
        <Home size={15} />
        Dashboard
      </Link>
  <ChevronRight size={15} className="text-slate-400" />

  <span className="font-semibold text-[#0B63CE]">
    Admin Settings
  </span>
</div>

{/* Page Heading */}
<h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">
  Admin Settings
</h1>

{/* Description */}
<p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
  Manage your administrator profile, notification preferences, and account security.
</p>


  </div>

{/* RIGHT SIDE: ADMIN SETTINGS CARD */}

  <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-slate-200/80 bg-white px-4 py-3 shadow-sm">
    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-[#0B63CE]">
      <ShieldCheck size={21} />
    </div>
<div>
  <p className="text-xs font-medium text-slate-400">
    Account Role
  </p>

  <p className="mt-1 text-sm font-extrabold text-[#183b3b]">
    {settings.role}
  </p>
</div>
  </div>
</div>


        {/* PROFILE / NOTIFICATION SAVE MESSAGE */}
        {saved && activeTab !== "security" && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            <CheckCircle2 size={20} />

            <span>
              Your settings have been saved successfully.
            </span>
          </div>
        )}

        {/* SETTINGS LAYOUT */}
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">

          {/* SETTINGS SIDEBAR */}
          <aside className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
            <div className="px-3 py-4">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                General Settings
              </h2>
            </div>

            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      setActiveTab(tab.id);
                      setSaved(false);
                    }}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition ${
                      isActive
                        ? "bg-blue-50 text-[#0B63CE]"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                        isActive
                          ? "bg-white text-[#0B63CE] shadow-sm"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      <Icon size={20} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-semibold">
                        {tab.label}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {tab.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </nav>

            {/* ADMIN ACCOUNT CARD */}
            <div className="mt-5 border-t border-slate-100 pt-4">
              <div className="flex items-center gap-3 rounded-xl bg-[#f8faf9] p-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#e5f4f2] text-[#183b3b]">
                  <UserRound size={22} />
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-800">
                    {settings.name}
                  </p>

                  <p className="text-xs text-slate-500">
                    {settings.role}
                  </p>
                </div>
              </div>
            </div>
          </aside>

          {/* SETTINGS CONTENT */}
          <section className="min-w-0 rounded-2xl border border-slate-200 bg-white shadow-sm">

            {/* ================= PROFILE SETTINGS ================= */}
            {activeTab === "profile" && (
              <>
                <div className="border-b border-slate-100 px-5 py-5 sm:px-7">
                  <h2 className="text-lg font-bold text-[#183b3b]">
                    Profile Information
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Update your administrator account details.
                  </p>
                </div>

                <div className="space-y-6 px-5 py-6 sm:px-7 sm:py-7">

                  {/* PROFILE AVATAR */}
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#e5f4f2] text-[#183b3b]">
                      <UserRound size={32} />
                    </div>

                    <div>
                      <h3 className="font-semibold text-slate-800">
                        Administrator Account
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        Manage your personal information below.
                      </p>
                    </div>
                  </div>

                  {/* PROFILE FORM */}
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                    {/* FULL NAME */}
                    <div>
                      <label
                        htmlFor="adminName"
                        className="mb-2 block text-sm font-medium text-slate-700"
                      >
                        Full Name
                      </label>

                      <div className="relative">
                        <UserRound
                          size={18}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                          id="adminName"
                          type="text"
                          value={settings.name}
                          onChange={(event) =>
                            handleChange("name", event.target.value)
                          }
                          placeholder="Enter your full name"
                          className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#0B63CE] focus:ring-4 focus:ring-blue-50"
                        />
                      </div>
                    </div>

                    {/* EMAIL */}
                    <div>
                      <label
                        htmlFor="adminEmail"
                        className="mb-2 block text-sm font-medium text-slate-700"
                      >
                        Email Address
                      </label>

                      <div className="relative">
                        <Mail
                          size={18}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                          id="adminEmail"
                          type="email"
                          value={settings.email}
                          onChange={(event) =>
                            handleChange("email", event.target.value)
                          }
                          placeholder="Enter your email"
                          className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#0B63CE] focus:ring-4 focus:ring-blue-50"
                        />
                      </div>
                    </div>

                    {/* ROLE */}
                    <div className="sm:col-span-2">
                      <label
                        htmlFor="adminRole"
                        className="mb-2 block text-sm font-medium text-slate-700"
                      >
                        Account Role
                      </label>

                      <input
                        id="adminRole"
                        type="text"
                        value={settings.role}
                        readOnly
                        className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500 outline-none"
                      />

                      <p className="mt-2 text-xs text-slate-400">
                        Your administrator role cannot be changed here.
                      </p>
                    </div>

                  </div>
                </div>
              </>
            )}

            {/* ================= NOTIFICATION SETTINGS ================= */}
            {activeTab === "notifications" && (
              <>
                <div className="border-b border-slate-100 px-5 py-5 sm:px-7">
                  <h2 className="text-lg font-bold text-[#183b3b]">
                    Notification Preferences
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Choose which platform alerts you want to receive.
                  </p>
                </div>

                <div className="divide-y divide-slate-100 px-5 sm:px-7">

                  {/* EMAIL NOTIFICATIONS */}
                  <div className="flex items-center justify-between gap-4 py-5">
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#0B63CE]">
                        <Mail size={20} />
                      </div>

                      <div>
                        <h3 className="text-sm font-semibold text-slate-800">
                          Email Notifications
                        </h3>

                        <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
                          Receive important platform updates by email.
                        </p>
                      </div>
                    </div>

                    <input
                      type="checkbox"
                      checked={settings.emailNotifications}
                      onChange={(event) =>
                        handleChange(
                          "emailNotifications",
                          event.target.checked,
                        )
                      }
                      aria-label="Email notifications"
                      className="h-5 w-5 shrink-0 cursor-pointer accent-[#0B63CE]"
                    />
                  </div>

                  {/* APPOINTMENT ALERTS */}
                  <div className="flex items-center justify-between gap-4 py-5">
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                        <CalendarDays size={20} />
                      </div>

                      <div>
                        <h3 className="text-sm font-semibold text-slate-800">
                          Appointment Alerts
                        </h3>

                        <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
                          Get alerts about new and pending appointments.
                        </p>
                      </div>
                    </div>

                    <input
                      type="checkbox"
                      checked={settings.appointmentAlerts}
                      onChange={(event) =>
                        handleChange(
                          "appointmentAlerts",
                          event.target.checked,
                        )
                      }
                      aria-label="Appointment alerts"
                      className="h-5 w-5 shrink-0 cursor-pointer accent-[#0B63CE]"
                    />
                  </div>

                  {/* SYSTEM UPDATES */}
                  <div className="flex items-center justify-between gap-4 py-5">
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                        <Activity size={20} />
                      </div>

                      <div>
                        <h3 className="text-sm font-semibold text-slate-800">
                          System Updates
                        </h3>

                        <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
                          Receive alerts about platform activity and updates.
                        </p>
                      </div>
                    </div>

                    <input
                      type="checkbox"
                      checked={settings.systemUpdates}
                      onChange={(event) =>
                        handleChange(
                          "systemUpdates",
                          event.target.checked,
                        )
                      }
                      aria-label="System updates"
                      className="h-5 w-5 shrink-0 cursor-pointer accent-[#0B63CE]"
                    />
                  </div>

                </div>
              </>
            )}

            {/* ================= SECURITY SETTINGS ================= */}
            {activeTab === "security" && (
              <>
                {/* SECURITY HEADER */}
                <div className="border-b border-slate-100 px-5 py-5 sm:px-7">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-[#0B63CE]">
                      <LockKeyhole size={22} />
                    </div>

                    <div>
                      <h2 className="text-lg font-bold text-[#183b3b]">
                        Security Settings
                      </h2>

                      <p className="mt-1 text-sm text-slate-500">
                        Protect your administrator account and manage your password.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6 px-5 py-6 sm:px-7 sm:py-7">

                  {/* SECURITY INFORMATION */}
                  <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                    <ShieldCheck
                      size={22}
                      className="mt-0.5 shrink-0 text-emerald-600"
                    />

                    <div>
                      <h3 className="text-sm font-semibold text-emerald-800">
                        Protect Your Account
                      </h3>

                      <p className="mt-1 text-sm leading-5 text-emerald-700">
                        Use a strong, unique password to help keep your
                        administrator account secure.
                      </p>
                    </div>
                  </div>

                  {/* PASSWORD FORM */}
                  <div>
                    <div className="mb-5">
                      <h3 className="text-base font-bold text-[#183b3b]">
                        Change Password
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        Enter your current password and choose a new one.
                      </p>
                    </div>

                    <div className="space-y-5">

                      {/* CURRENT PASSWORD */}
                      <div>
                        <label
                          htmlFor="currentPassword"
                          className="mb-2 block text-sm font-medium text-slate-700"
                        >
                          Current Password
                        </label>

                        <div className="relative">
                          <LockKeyhole
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                          />

                          <input
                            id="currentPassword"
                            type={
                              showCurrentPassword ? "text" : "password"
                            }
                            value={currentPassword}
                            onChange={(event) => {
                              setCurrentPassword(event.target.value);
                              setPasswordError("");
                              setPasswordMessage("");
                            }}
                            placeholder="Enter current password"
                            autoComplete="current-password"
                            className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-12 text-sm outline-none transition focus:border-[#0B63CE] focus:ring-4 focus:ring-blue-50"
                          />

                          <button
                            type="button"
                            onClick={() =>
                              setShowCurrentPassword(
                                !showCurrentPassword,
                              )
                            }
                            aria-label={
                              showCurrentPassword
                                ? "Hide current password"
                                : "Show current password"
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                          >
                            {showCurrentPassword ? (
                              <EyeOff size={19} />
                            ) : (
                              <Eye size={19} />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* NEW PASSWORD */}
                      <div>
                        <label
                          htmlFor="newPassword"
                          className="mb-2 block text-sm font-medium text-slate-700"
                        >
                          New Password
                        </label>

                        <div className="relative">
                          <KeyRound
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                          />

                          <input
                            id="newPassword"
                            type={showNewPassword ? "text" : "password"}
                            value={newPassword}
                            onChange={(event) => {
                              setNewPassword(event.target.value);
                              setPasswordError("");
                              setPasswordMessage("");
                            }}
                            placeholder="Enter new password"
                            autoComplete="new-password"
                            className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-12 text-sm outline-none transition focus:border-[#0B63CE] focus:ring-4 focus:ring-blue-50"
                          />

                          <button
                            type="button"
                            onClick={() =>
                              setShowNewPassword(!showNewPassword)
                            }
                            aria-label={
                              showNewPassword
                                ? "Hide new password"
                                : "Show new password"
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                          >
                            {showNewPassword ? (
                              <EyeOff size={19} />
                            ) : (
                              <Eye size={19} />
                            )}
                          </button>
                        </div>

                        <p className="mt-2 text-xs leading-5 text-slate-500">
                          Minimum 8 characters, including at least one
                          uppercase letter and one number.
                        </p>
                      </div>

                      {/* CONFIRM PASSWORD */}
                      <div>
                        <label
                          htmlFor="confirmPassword"
                          className="mb-2 block text-sm font-medium text-slate-700"
                        >
                          Confirm New Password
                        </label>

                        <div className="relative">
                          <LockKeyhole
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                          />

                          <input
                            id="confirmPassword"
                            type={
                              showConfirmPassword ? "text" : "password"
                            }
                            value={confirmPassword}
                            onChange={(event) => {
                              setConfirmPassword(event.target.value);
                              setPasswordError("");
                              setPasswordMessage("");
                            }}
                            placeholder="Re-enter new password"
                            autoComplete="new-password"
                            className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-12 text-sm outline-none transition focus:border-[#0B63CE] focus:ring-4 focus:ring-blue-50"
                          />

                          <button
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword(
                                !showConfirmPassword,
                              )
                            }
                            aria-label={
                              showConfirmPassword
                                ? "Hide confirm password"
                                : "Show confirm password"
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                          >
                            {showConfirmPassword ? (
                              <EyeOff size={19} />
                            ) : (
                              <Eye size={19} />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* ERROR MESSAGE */}
                      {passwordError && (
                        <div
                          role="alert"
                          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-700"
                        >
                          {passwordError}
                        </div>
                      )}

                      {/* SUCCESS MESSAGE */}
                      {passwordMessage && (
                        <div
                          role="status"
                          className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
                        >
                          {passwordMessage}
                        </div>
                      )}

                      {/* PASSWORD ACTIONS */}
                      <div className="flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                        <button
                          type="button"
                          onClick={clearPasswordFields}
                          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                        >
                          <RotateCcw size={16} />
                          Clear Fields
                        </button>

                        <button
                          type="button"
                          onClick={handlePasswordUpdate}
                          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0B63CE] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0955AE]"
                        >
                          <ShieldCheck size={17} />
                          Update Password
                        </button>
                      </div>

                    </div>
                  </div>

                  {/* PASSWORD SECURITY TIPS */}
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <h3 className="text-sm font-semibold text-[#183b3b]">
                      Password Security Tips
                    </h3>

                    <ul className="mt-3 space-y-2 text-sm leading-5 text-slate-600">
                      <li>
                        • Use a unique password for your administrator account.
                      </li>
                      <li>
                        • Never share your password with anyone.
                      </li>
                      <li>
                        • Avoid reusing passwords from other websites.
                      </li>
                    </ul>
                  </div>

                </div>
              </>
            )}

            {/* FOOTER ACTIONS: PROFILE & NOTIFICATIONS ONLY */}
            {activeTab !== "security" && (
              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50/60 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">

                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
                >
                  <RotateCcw size={16} />
                  Reset Settings
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0B63CE] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0955AE]"
                >
                  <Save size={17} />
                  Save Changes
                </button>

              </div>
            )}
          </section>
        </div>

        {/* SECURITY REMINDER */}
        <div className="mt-6 flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50/60 p-4">
          <ShieldCheck
            size={20}
            className="mt-0.5 shrink-0 text-[#0B63CE]"
          />

          <div>
            <h3 className="text-sm font-semibold text-[#183b3b]">
              Keep Your Account Secure
            </h3>

            <p className="mt-1 text-xs leading-5 text-slate-600 sm:text-sm">
              Use a strong password and keep your administrator
              credentials private.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default AdminSettings;
