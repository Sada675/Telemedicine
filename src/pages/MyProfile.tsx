import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
ArrowLeft,
Camera,
Check,
Eye,
EyeOff,
KeyRound,
LoaderCircle,
LockKeyhole,
Mail,
MapPin,
Phone,
Save,
ShieldCheck,
User,
X,
} from "lucide-react";

type ProfileData = {
fullName: string;
email: string;
phone: string;
gender: string;
dateOfBirth: string;
country: string;
city: string;
address: string;
profilePicture: string;
};

const STORAGE_KEY = "telemedicinePatientProfile";

const defaultProfile: ProfileData = {
fullName: "Sadaye Noor",
email: "",
phone: "",
gender: "",
dateOfBirth: "",
country: "Pakistan",
city: "",
address: "",
profilePicture: "",
};

function MyProfile() {
const [profile, setProfile] = useState<ProfileData>(defaultProfile);
const [originalProfile, setOriginalProfile] =
useState<ProfileData>(defaultProfile);

const [message, setMessage] = useState("");
const [messageType, setMessageType] = useState<"success" | "error">(
"success"
);

const [showPasswordForm, setShowPasswordForm] = useState(false);
const [currentPassword, setCurrentPassword] = useState("");
const [newPassword, setNewPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");

const [showCurrentPassword, setShowCurrentPassword] = useState(false);
const [showNewPassword, setShowNewPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);

const [passwordMessage, setPasswordMessage] = useState("");
const [passwordMessageType, setPasswordMessageType] = useState<
"success" | "error"

> ("error");

const [isSaving, setIsSaving] = useState(false);

const fileInputRef = useRef<HTMLInputElement>(null);

// Load saved profile information.
useEffect(() => {
try {
const savedProfile = localStorage.getItem(STORAGE_KEY);
const savedName = localStorage.getItem("userName");

  let loadedProfile: ProfileData = {
    ...defaultProfile,
    ...(savedName?.trim()
      ? { fullName: savedName.trim() }
      : {}),
  };

  if (savedProfile) {
    const parsedProfile = JSON.parse(
      savedProfile
    ) as Partial<ProfileData>;

    loadedProfile = {
      ...loadedProfile,
      ...parsedProfile,
    };
  }

  setProfile(loadedProfile);
  setOriginalProfile(loadedProfile);
} catch (error) {
  console.error("Unable to load profile:", error);
}


}, []);

// Update profile fields.
const handleChange = (
event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
) => {
const { name, value } = event.target;

setProfile((previous) => ({
  ...previous,
  [name]: value,
}));

setMessage("");

};

// Upload and preview profile picture.
const handlePictureChange = (
event: ChangeEvent<HTMLInputElement>
) => {
const file = event.target.files?.[0];

if (!file) return;

if (!file.type.startsWith("image/")) {
  setMessageType("error");
  setMessage("Please select a valid image file.");
  event.target.value = "";
  return;
}

if (file.size > 2 * 1024 * 1024) {
  setMessageType("error");
  setMessage("Profile picture must be smaller than 2 MB.");
  event.target.value = "";
  return;
}

const reader = new FileReader();

reader.onload = () => {
  if (typeof reader.result === "string") {
    setProfile((previous) => ({
      ...previous,
      profilePicture: reader.result as string,
    }));

    setMessage("");
  }
};

reader.onerror = () => {
  setMessageType("error");
  setMessage("Unable to read this image. Please try another file.");
};

reader.readAsDataURL(file);

// Allow selecting the same image again.
event.target.value = "";

};

// Save profile information.
const handleSaveProfile = (
event: FormEvent<HTMLFormElement>
) => {
event.preventDefault();
setMessage("");

const trimmedName = profile.fullName.trim();
const trimmedEmail = profile.email.trim();

if (!trimmedName) {
  setMessageType("error");
  setMessage("Please enter your full name.");
  return;
}

if (
  trimmedEmail &&
  !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)
) {
  setMessageType("error");
  setMessage("Please enter a valid email address.");
  return;
}

const updatedProfile: ProfileData = {
  ...profile,
  fullName: trimmedName,
  email: trimmedEmail,
  phone: profile.phone.trim(),
  country: profile.country.trim(),
  city: profile.city.trim(),
  address: profile.address.trim(),
};

setIsSaving(true);

try {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updatedProfile)
  );

  localStorage.setItem("userName", updatedProfile.fullName);

  setProfile(updatedProfile);
  setOriginalProfile(updatedProfile);

  // Notify Navbar and other components to refresh.
  window.dispatchEvent(new Event("profileUpdate"));

  setMessageType("success");
  setMessage("Your profile has been saved successfully.");
} catch (error) {
  console.error("Unable to save profile:", error);

  setMessageType("error");
  setMessage(
    "Unable to save your profile. Please try a smaller image or remove the picture and try again."
  );
} finally {
  setIsSaving(false);
}


};

// Cancel changes and restore the last saved profile.
const handleCancelEdit = () => {
setProfile({ ...originalProfile });
setMessage("");
};

// Remove the picture from the form.
const handleRemovePicture = () => {
setProfile((previous) => ({
...previous,
profilePicture: "",
}));


setMessage("");


};

// Open or close password form.
const handleOpenPasswordForm = () => {
setShowPasswordForm((previous) => !previous);


setCurrentPassword("");
setNewPassword("");
setConfirmPassword("");

setPasswordMessage("");


};

// Validate password change.
const handlePasswordChange = (
event: FormEvent<HTMLFormElement>
) => {
event.preventDefault();
setPasswordMessage("");


if (!currentPassword || !newPassword || !confirmPassword) {
  setPasswordMessageType("error");
  setPasswordMessage("Please complete all password fields.");
  return;
}

if (newPassword.length < 8) {
  setPasswordMessageType("error");
  setPasswordMessage(
    "Your new password must contain at least 8 characters."
  );
  return;
}

if (
  !/[A-Z]/.test(newPassword) ||
  !/[a-z]/.test(newPassword)
) {
  setPasswordMessageType("error");
  setPasswordMessage(
    "Use at least one uppercase and one lowercase letter."
  );
  return;
}

if (!/[0-9]/.test(newPassword)) {
  setPasswordMessageType("error");
  setPasswordMessage(
    "Your new password must contain at least one number."
  );
  return;
}

if (newPassword !== confirmPassword) {
  setPasswordMessageType("error");
  setPasswordMessage(
    "New password and confirmation do not match."
  );
  return;
}

if (currentPassword === newPassword) {
  setPasswordMessageType("error");
  setPasswordMessage(
    "Your new password must be different from your current password."
  );
  return;
}

// Actual password changes must be verified by the backend.
// Never store plain-text passwords in localStorage.
setPasswordMessageType("error");
setPasswordMessage(
  "Password validation passed, but changing your password requires a connection to your authentication backend."
);


};

const initials =
profile.fullName
.trim()
.split(/\s+/)
.filter(Boolean)
.slice(0, 2)
.map((part) => part[0].toUpperCase())
.join("") || "SN";

// Enable Save only when profile data has changed.
const hasChanges =
JSON.stringify(profile) !== JSON.stringify(originalProfile);

return ( <div className="min-h-screen bg-[#f8faf9]"> <Navbar />

  <main className="mx-auto max-w-7xl px-4 pb-12 pt-28 sm:px-6 lg:px-8">
    <Link
      to="/patient-dashboard"
      className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 no-underline transition hover:text-[#0B63CE]"
    >
      <ArrowLeft size={18} />
      Back to Dashboard
    </Link>

    <div className="mb-8">
      <p className="text-sm font-semibold text-[#0B63CE]">
        Account Settings
      </p>

      <h1 className="mt-2 text-2xl font-bold text-[#183b3b] sm:text-3xl">
        My Profile
      </h1>

      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
        Manage your personal information and account preferences.
      </p>
    </div>

    {message && (
      <div
        role="status"
        className={`mb-6 flex items-start gap-3 rounded-xl border p-4 text-sm ${
          messageType === "success"
            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
            : "border-red-200 bg-red-50 text-red-700"
        }`}
      >
        {messageType === "success" ? (
          <Check size={19} className="mt-0.5 shrink-0" />
        ) : (
          <ShieldCheck size={19} className="mt-0.5 shrink-0" />
        )}

        <p>{message}</p>
      </div>
    )}

    <div className="grid items-start gap-6 lg:grid-cols-3">
      {/* Profile card */}
      <aside className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
        <div className="h-24 bg-gradient-to-r from-[#183b3b] to-[#245b5b]" />

        <div className="px-5 pb-6">
          <div className="-mt-12 flex flex-col items-center">
            <div className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-[#e5f4f2] text-2xl font-bold text-[#245b5b] shadow-sm">
              {profile.profilePicture ? (
                <img
                  src={profile.profilePicture}
                  alt="Patient profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                initials
              )}
            </div>

            <div className="mt-3 flex flex-wrap justify-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <Camera size={15} />
                Change Photo
              </button>

              {profile.profilePicture && (
                <button
                  type="button"
                  onClick={handleRemovePicture}
                  className="rounded-lg px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                >
                  Remove
                </button>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePictureChange}
                className="hidden"
              />
            </div>

            <h2 className="mt-4 text-center text-xl font-bold text-[#183b3b]">
              {profile.fullName || "Your Name"}
            </h2>

            <p className="mt-1 break-all text-center text-sm text-slate-500">
              {profile.email || "Add your email address"}
            </p>

            <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#e5f4f2] px-4 py-2 text-xs font-semibold text-[#245b5b]">
              <ShieldCheck size={15} />
              Patient Account
            </span>
          </div>

          <div className="mt-7 space-y-4 border-t border-slate-100 pt-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#0B63CE]">
                <Mail size={18} />
              </div>

              <div className="min-w-0">
                <p className="text-xs text-slate-500">Email Address</p>
                <p className="mt-1 break-all text-sm font-medium text-slate-800">
                  {profile.email || "Not added"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#0B63CE]">
                <Phone size={18} />
              </div>

              <div className="min-w-0">
                <p className="text-xs text-slate-500">Phone Number</p>
                <p className="mt-1 break-words text-sm font-medium text-slate-800">
                  {profile.phone || "Not added"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#0B63CE]">
                <MapPin size={18} />
              </div>

              <div className="min-w-0">
                <p className="text-xs text-slate-500">Location</p>
                <p className="mt-1 break-words text-sm font-medium text-slate-800">
                  {[profile.city, profile.country]
                    .filter(Boolean)
                    .join(", ") || "Not added"}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#0B63CE]">
              <ShieldCheck size={18} />
              Your Privacy
            </div>

            <p className="mt-2 text-xs leading-5 text-slate-600">
              Keep your contact information accurate so your healthcare
              team can reach you when needed.
            </p>
          </div>
        </div>
      </aside>

      {/* Right content */}
      <div className="space-y-6 lg:col-span-2">
        {/* Personal information */}
        <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#e5f4f2] text-[#245b5b]">
              <User size={21} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-[#183b3b]">
                Personal Information
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Your personal and contact details
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveProfile}>
            <div className="mt-7 grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="fullName"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Full Name <span className="text-red-500">*</span>
                </label>

                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={profile.fullName}
                  onChange={handleChange}
                  required
                  maxLength={100}
                  placeholder="Enter your full name"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#0B63CE] focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Email Address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={profile.email}
                  onChange={handleChange}
                  maxLength={254}
                  placeholder="Enter your email"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#0B63CE] focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Phone Number
                </label>

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={profile.phone}
                  onChange={handleChange}
                  maxLength={25}
                  placeholder="+92 3XX XXXXXXX"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#0B63CE] focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label
                  htmlFor="gender"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Gender
                </label>

                <select
                  id="gender"
                  name="gender"
                  value={profile.gender}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[#0B63CE] focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">Select gender</option>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Prefer not to say">
                    Prefer not to say
                  </option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="dateOfBirth"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Date of Birth
                </label>

                <input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={profile.dateOfBirth}
                  onChange={handleChange}
                  max={new Date().toISOString().split("T")[0]}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[#0B63CE] focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label
                  htmlFor="country"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Country
                </label>

                <input
                  id="country"
                  name="country"
                  type="text"
                  value={profile.country}
                  onChange={handleChange}
                  maxLength={100}
                  placeholder="Enter your country"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#0B63CE] focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label
                  htmlFor="city"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  City
                </label>

                <input
                  id="city"
                  name="city"
                  type="text"
                  value={profile.city}
                  onChange={handleChange}
                  maxLength={100}
                  placeholder="Enter your city"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#0B63CE] focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="address"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Complete Address
                </label>

                <input
                  id="address"
                  name="address"
                  type="text"
                  value={profile.address}
                  onChange={handleChange}
                  maxLength={250}
                  placeholder="House number, street, area..."
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#0B63CE] focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            <div className="mt-7 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleCancelEdit}
                disabled={isSaving || !hasChanges}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <X size={17} />
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSaving || !hasChanges}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0B63CE] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0955AE] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isSaving ? (
                  <LoaderCircle size={17} className="animate-spin" />
                ) : (
                  <Save size={17} />
                )}

                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </section>

        {/* Password and security */}
        <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#e5f4f2] text-[#245b5b]">
                <LockKeyhole size={21} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-[#183b3b]">
                  Password &amp; Security
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Manage your account password
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleOpenPasswordForm}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-[#0B63CE] hover:text-[#0B63CE]"
            >
              <KeyRound size={16} />
              {showPasswordForm ? "Close Form" : "Change Password"}
            </button>
          </div>

          {showPasswordForm && (
            <form
              onSubmit={handlePasswordChange}
              className="mt-6 border-t border-slate-100 pt-6"
            >
              {passwordMessage && (
                <div
                  role="status"
                  className={`mb-5 rounded-xl border p-4 text-sm leading-6 ${
                    passwordMessageType === "success"
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-amber-200 bg-amber-50 text-amber-800"
                  }`}
                >
                  {passwordMessage}
                </div>
              )}

              <div className="mb-5">
                <label
                  htmlFor="currentPassword"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Current Password
                </label>

                <div className="relative">
                  <input
                    id="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(event) =>
                      setCurrentPassword(event.target.value)
                    }
                    autoComplete="current-password"
                    required
                    placeholder="Enter current password"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-12 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#0B63CE] focus:ring-2 focus:ring-blue-100"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowCurrentPassword((previous) => !previous)
                    }
                    aria-label={
                      showCurrentPassword
                        ? "Hide current password"
                        : "Show current password"
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-[#0B63CE]"
                  >
                    {showCurrentPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              <div className="mb-5">
                <label
                  htmlFor="newPassword"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  New Password
                </label>

                <div className="relative">
                  <input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(event) =>
                      setNewPassword(event.target.value)
                    }
                    autoComplete="new-password"
                    minLength={8}
                    required
                    placeholder="Enter new password"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-12 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#0B63CE] focus:ring-2 focus:ring-blue-100"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowNewPassword((previous) => !previous)
                    }
                    aria-label={
                      showNewPassword
                        ? "Hide new password"
                        : "Show new password"
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-[#0B63CE]"
                  >
                    {showNewPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>

                <p className="mt-2 text-xs leading-5 text-slate-500">
                  Use at least 8 characters, including uppercase,
                  lowercase, and a number.
                </p>
              </div>

              <div className="mb-6">
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Confirm New Password
                </label>

                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(event) =>
                      setConfirmPassword(event.target.value)
                    }
                    autoComplete="new-password"
                    required
                    placeholder="Confirm your new password"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-12 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#0B63CE] focus:ring-2 focus:ring-blue-100"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword((previous) => !previous)
                    }
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirmed password"
                        : "Show confirmed password"
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-[#0B63CE]"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0B63CE] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0955AE] sm:w-auto"
              >
                <LockKeyhole size={17} />
                Update Password
              </button>
            </form>
          )}
        </section>

        {/* Account information */}
        <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#e5f4f2] text-[#245b5b]">
              <ShieldCheck size={21} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-[#183b3b]">
                Account Information
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Your account overview
              </p>
            </div>
          </div>

          <div className="mt-6 divide-y divide-slate-100">
            <div className="flex items-center justify-between gap-4 py-4">
              <div>
                <p className="text-sm font-semibold text-slate-700">
                  Account Type
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Your current account role
                </p>
              </div>

              <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-[#0B63CE]">
                Patient
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 py-4">
              <div>
                <p className="text-sm font-semibold text-slate-700">
                  Profile Status
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Your profile information
                </p>
              </div>

              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                <Check size={14} />
                Active
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 py-4">
              <div>
                <p className="text-sm font-semibold text-slate-700">
                  Personal Details
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Name and contact information
                </p>
              </div>

              <span className="text-right text-xs font-semibold text-slate-600">
                {profile.fullName.trim() && profile.email.trim()
                  ? "Information added"
                  : "Incomplete"}
              </span>
            </div>
          </div>
        </section>

        {/* Appointments link */}
        <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-semibold text-[#183b3b]">
              Ready to continue?
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              View your upcoming medical appointments.
            </p>
          </div>

          <Link
            to="/appointments"
            className="inline-flex shrink-0 items-center justify-center rounded-xl bg-[#0B63CE] px-5 py-3 text-sm font-semibold text-white no-underline transition hover:bg-[#0955AE]"
          >
            My Appointments
          </Link>
        </div>
      </div>
    </div>
  </main>

  <Footer />
</div>

);
}

export default MyProfile;
