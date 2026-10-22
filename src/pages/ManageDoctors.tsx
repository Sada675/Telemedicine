import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import {
  Pencil,
  X,
  Upload,
  UserRound,
  GraduationCap,
  Stethoscope,
  Languages,
  BadgeCheck,
  Save,
  Camera,
  CheckCircle,
  CircleDollarSign,
  Clock,
  CalendarDays,
  ChevronRight,
  Home,
} from "lucide-react";
import { Link } from "react-router-dom";
import drMunibImage from "../assets/dr-munib121.jpg";
import drNazliImage from "../assets/lady-doc.jpg";

type Doctor = {
  id: string;
  name: string;
  email: string;
  password: string;
  image: string;
  specialty: string;
  qualification: string;
  pmdcNumber: string;
  languages: string[];
  feePKR: number;
  feeUSD: number;
  nextAvailableSlot: string;
  status: "Active" | "Inactive";
};

const STORAGE_KEY = "telemedicineAdminDoctors";

const defaultDoctors: Doctor[] = [
  {
    id: "munib",
    name: "Dr. Munib",
    email: "munib@example.com",
    password: "",
    image: drMunibImage,
    specialty: "Medical Specialist",
    qualification: "MBBS, FCPS",
    pmdcNumber: "XXXXX-M",
    languages: ["English", "Urdu"],
    feePKR: 3000,
    feeUSD: 25,
    nextAvailableSlot: "Today • 04:00 PM",
    status: "Active",
  },
  {
    id: "nazli",
    name: "Dr. Nazli",
    email: "nazli@example.com",
    password: "",
    image: drNazliImage,
    specialty: "Medical Specialist",
    qualification: "MBBS, FCPS",
    pmdcNumber: "XXXXX-M",
    languages: ["English", "Urdu"],
    feePKR: 3000,
    feeUSD: 25,
    nextAvailableSlot: "Tomorrow • 11:00 AM",
    status: "Active",
  },
];

const availableLanguages = [
  "English",
  "Urdu",
  "Arabic",
  "Pashto",
  "Punjabi",
];

const inputClass =
  "w-full min-w-0 rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#0B63CE] focus:ring-4 focus:ring-blue-50";

function isDoctor(value: unknown): value is Doctor {
  if (!value || typeof value !== "object") return false;

  const item = value as Partial<Doctor>;

  return (
    typeof item.id === "string" &&
    typeof item.name === "string" &&
    typeof item.image === "string" &&
    typeof item.specialty === "string" &&
    typeof item.qualification === "string" &&
    typeof item.pmdcNumber === "string" &&
    Array.isArray(item.languages) &&
    item.languages.every((language) => typeof language === "string") &&
    typeof item.feePKR === "number" &&
    typeof item.feeUSD === "number" &&
    typeof item.nextAvailableSlot === "string" &&
    (item.status === "Active" || item.status === "Inactive") &&
    (item.email === undefined || typeof item.email === "string") &&
    (item.password === undefined || typeof item.password === "string")
  );
}

/**
 * Load predefined doctors and merge their saved information.
 */
function readDoctors(): Doctor[] {
  if (typeof window === "undefined") {
    return defaultDoctors;
  }

  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return defaultDoctors;
    }

    const parsed: unknown = JSON.parse(saved);

    if (!Array.isArray(parsed)) {
      return defaultDoctors;
    }

    const savedDoctors = parsed.filter(isDoctor);

    const savedById = new Map(
      savedDoctors.map((doctor) => [doctor.id, doctor]),
    );

    return defaultDoctors.map((defaultDoctor) => {
      const savedDoctor = savedById.get(defaultDoctor.id);

      if (!savedDoctor) {
        return defaultDoctor;
      }

      return {
        ...defaultDoctor,
        ...savedDoctor,

        email:
          typeof savedDoctor.email === "string"
            ? savedDoctor.email
            : defaultDoctor.email,

        password:
          typeof savedDoctor.password === "string"
            ? savedDoctor.password
            : "",

        image: savedDoctor.image || defaultDoctor.image,

        name: savedDoctor.name.trim() || defaultDoctor.name,

        specialty:
          savedDoctor.specialty.trim() || defaultDoctor.specialty,

        qualification:
          savedDoctor.qualification.trim() ||
          defaultDoctor.qualification,

        pmdcNumber:
          savedDoctor.pmdcNumber.trim() ||
          defaultDoctor.pmdcNumber,

        languages:
          savedDoctor.languages.length > 0
            ? savedDoctor.languages
            : defaultDoctor.languages,

        feePKR: Number.isFinite(savedDoctor.feePKR)
          ? savedDoctor.feePKR
          : defaultDoctor.feePKR,

        feeUSD: Number.isFinite(savedDoctor.feeUSD)
          ? savedDoctor.feeUSD
          : defaultDoctor.feeUSD,

        nextAvailableSlot:
          savedDoctor.nextAvailableSlot.trim() ||
          defaultDoctor.nextAvailableSlot,

        status:
          savedDoctor.status === "Inactive"
            ? "Inactive"
            : "Active",
      };
    });
  } catch (error) {
    console.error("Unable to load doctor details:", error);
    return defaultDoctors;
  }
}

function ManageDoctors() {
  const [doctors, setDoctors] = useState<Doctor[]>(readDoctors);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [form, setForm] = useState<Doctor | null>(null);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [storageError, setStorageError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const initializedRef = useRef(false);

  /*
   * Persist doctor information.
   * The same storage key must be used by DoctorLogin and other pages.
   */
  useEffect(() => {
    // Save after the initial state has been loaded.
    if (!initializedRef.current) {
      initializedRef.current = true;

      // Initialize the storage only if it doesn't exist.
      if (!localStorage.getItem(STORAGE_KEY)) {
        try {
          localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(doctors),
          );
        } catch (storageIssue) {
          console.error("Unable to initialize doctors:", storageIssue);
          setStorageError(
            "Doctor data could not be saved in this browser.",
          );
        }
      }

      return;
    }

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(doctors),
      );

      window.dispatchEvent(new Event("doctorsUpdated"));

      setStorageError("");
    } catch (storageIssue) {
      console.error("Unable to save doctor details:", storageIssue);

      setStorageError(
        "Changes could not be saved. The browser may be out of storage space; try using a smaller photo.",
      );
    }
  }, [doctors]);

  useEffect(() => {
    if (!notice) return;

    const timer = window.setTimeout(() => {
      setNotice("");
    }, 3500);

    return () => window.clearTimeout(timer);
  }, [notice]);

  /*
   * Refresh doctor records if another page updates localStorage
   * in the same browser.
   */
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) {
        setDoctors(readDoctors());
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const activeCount = doctors.filter(
    (doctor) => doctor.status === "Active",
  ).length;

  const startEditing = (doctor: Doctor) => {
    setEditingDoctor(doctor);

    setForm({
      ...doctor,
      languages: [...doctor.languages],
    });

    setError("");
    setNotice("");
  };

  const closeModal = () => {
    setEditingDoctor(null);
    setForm(null);
    setError("");
  };

  const updateField = <K extends keyof Doctor>(
    key: K,
    value: Doctor[K],
  ) => {
    setForm((previous) =>
      previous
        ? {
            ...previous,
            [key]: value,
          }
        : previous,
    );

    setError("");
  };

  const handleImageUpload = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file || !form) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image.");
      event.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError("Image size must be less than 2 MB.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        setForm((previous) =>
          previous
            ? {
                ...previous,
                image: reader.result as string,
              }
            : previous,
        );

        setError("");
      }
    };

    reader.onerror = () => {
      setError("Unable to read the selected image.");
    };

    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const toggleLanguage = (language: string) => {
    if (!form) return;

    const selected = form.languages.includes(language);

    updateField(
      "languages",
      selected
        ? form.languages.filter((item) => item !== language)
        : [...form.languages, language],
    );
  };

  const saveDoctor = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form || isSaving) return;

    setError("");

    if (!form.name.trim()) {
      setError("Doctor name is required.");
      return;
    }

    if (!form.email.trim()) {
      setError("Doctor login email is required.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setError("Enter a valid doctor login email.");
      return;
    }

    /*
     * Prevent duplicate email addresses.
     */
    const normalizedEmail = form.email.trim().toLowerCase();

    const emailAlreadyExists = doctors.some(
      (doctor) =>
        doctor.id !== form.id &&
        doctor.email.trim().toLowerCase() === normalizedEmail,
    );

    if (emailAlreadyExists) {
      setError("This email is already assigned to another doctor.");
      return;
    }

    /*
     * Require a password when creating/updating credentials.
     * Existing passwords can remain unchanged.
     */
    if (!form.password.trim()) {
      setError("Please set a login password for this doctor.");
      return;
    }

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (!form.specialty.trim()) {
      setError("Medical specialty is required.");
      return;
    }

    if (!form.qualification.trim()) {
      setError("Doctor qualification is required.");
      return;
    }

    if (!form.pmdcNumber.trim()) {
      setError("PMDC registration number is required.");
      return;
    }

    if (form.languages.length === 0) {
      setError("Select at least one language.");
      return;
    }

    if (
      !Number.isFinite(form.feePKR) ||
      !Number.isFinite(form.feeUSD) ||
      form.feePKR < 0 ||
      form.feeUSD < 0
    ) {
      setError(
        "Consultation fees must be valid non-negative amounts.",
      );
      return;
    }

    if (!form.nextAvailableSlot.trim()) {
      setError("Next available slot is required.");
      return;
    }

    const cleanedDoctor: Doctor = {
      ...form,
      name: form.name.trim(),
      email: normalizedEmail,
      password: form.password,
      specialty: form.specialty.trim(),
      qualification: form.qualification.trim(),
      pmdcNumber: form.pmdcNumber.trim(),
      languages: [...form.languages],
      feePKR: Number(form.feePKR),
      feeUSD: Number(form.feeUSD),
      nextAvailableSlot: form.nextAvailableSlot.trim(),
    };

    /*
     * Update the selected doctor without changing other doctors.
     */
    setIsSaving(true);

    try {
      const updatedDoctors = doctors.map((doctor) =>
        doctor.id === cleanedDoctor.id
          ? cleanedDoctor
          : doctor,
      );

      /*
       * Save first, so the success notice is only shown
       * after localStorage accepts the updated information.
       */
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updatedDoctors),
      );

      setDoctors(updatedDoctors);

      window.dispatchEvent(new Event("doctorsUpdated"));

      setNotice(`${cleanedDoctor.name} updated successfully.`);

      closeModal();
    } catch (storageIssue) {
      console.error("Unable to save doctor details:", storageIssue);

      setError(
        "Unable to save changes. Try a smaller profile picture or free browser storage.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const toggleStatus = (doctor: Doctor) => {
    const nextStatus: Doctor["status"] =
      doctor.status === "Active" ? "Inactive" : "Active";

    const updatedDoctors = doctors.map((item) =>
      item.id === doctor.id
        ? {
            ...item,
            status: nextStatus,
          }
        : item,
    );

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updatedDoctors),
      );

      setDoctors(updatedDoctors);

      window.dispatchEvent(new Event("doctorsUpdated"));

      setNotice(`${doctor.name} is now ${nextStatus}.`);
    } catch (storageIssue) {
      console.error("Unable to update doctor status:", storageIssue);

      setStorageError("Unable to save the updated doctor status.");
    }
  };

  const summaryCards = [
    {
      label: "Total Doctors",
      value: doctors.length,
      icon: Stethoscope,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Active Doctors",
      value: activeCount,
      icon: CheckCircle,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Inactive Doctors",
      value: doctors.length - activeCount,
      icon: UserRound,
      color: "bg-amber-50 text-amber-600",
    },
  ];

  const getDefaultDoctorImage = (doctorId: string) =>
    doctorId === "nazli" ? drNazliImage : drMunibImage;

  const getDoctorImage = (doctor: Doctor) =>
    doctor.image || getDefaultDoctorImage(doctor.id);

  return (
    <div className="min-h-screen w-full bg-[#f5f8fc] text-slate-800">
      <div className="mx-auto w-full max-w-[1200px] space-y-7 p-4 sm:p-7 lg:p-9">
        {/* Page Heading */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
              <Link
                to="/admin-dashboard"
                className="flex items-center gap-1.5 text-slate-500 transition hover:text-[#0B63CE]"
              >
                <Home size={15} />
                Dashboard
              </Link>

              <ChevronRight size={15} className="text-slate-400" />

              <Link
                to="/manage-doctors"
                className="font-semibold text-[#0B63CE] hover:underline"
              >
                Manage Doctors
              </Link>
            </div>

            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">
              Manage Doctors
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Manage doctor profiles, qualifications, consultation fees,
              languages, and availability.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-xl border border-blue-100 bg-white px-4 py-3 text-sm font-semibold text-[#0B63CE] shadow-sm">
              <Stethoscope size={18} />
              <span>{doctors.length} Registered Doctors</span>
            </div>
          </div>
        </div>

        {/* Notifications */}
        {notice && (
          <div
            role="status"
            className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700"
          >
            <CheckCircle size={19} />
            {notice}
          </div>
        )}

        {storageError && (
          <div
            role="alert"
            className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
          >
            {storageError}
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          {summaryCards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.label}
                className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      {card.label}
                    </p>

                    <p className="mt-3 text-3xl font-bold">
                      {card.value}
                    </p>
                  </div>

                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.color}`}
                  >
                    <Icon size={23} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Doctor Directory */}
        <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div>
              <h2 className="text-lg font-bold">Doctor Directory</h2>

              <p className="mt-1 text-sm text-slate-500">
                View and update all {doctors.length} registered doctor profiles.
              </p>
            </div>
          </div>

          <div className="space-y-4 p-4 sm:p-6">
            {doctors.length === 0 && (
              <div className="rounded-xl border border-dashed border-slate-200 px-4 py-10 text-center">
                <Stethoscope size={28} className="mx-auto text-slate-300" />

                <p className="mt-3 font-semibold">
                  No doctor profiles available
                </p>
              </div>
            )}

            {doctors.map((doctor) => {
              const image = getDoctorImage(doctor);

              return (
                <article
                  key={doctor.id}
                  className="rounded-2xl border border-slate-200 p-4 transition hover:border-blue-200 hover:shadow-sm sm:p-5"
                >
                  <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                    {/* Doctor Profile */}
                    <div className="flex min-w-0 items-start gap-4">
                      <div className="flex h-[84px] w-[84px] shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-blue-50">
                        <img
                          src={image}
                          alt={doctor.name}
                          className="h-full w-full object-cover"
                          onError={(event) => {
                            const fallbackImage = getDefaultDoctorImage(
                              doctor.id,
                            );

                            const fallbackUrl = new URL(
                              fallbackImage,
                              window.location.href,
                            ).href;

                            if (event.currentTarget.src !== fallbackUrl) {
                              event.currentTarget.src = fallbackImage;
                            } else {
                              event.currentTarget.style.display = "none";
                            }
                          }}
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-bold">
                            {doctor.name}
                          </h3>

                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                              doctor.status === "Active"
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-rose-50 text-rose-700"
                            }`}
                          >
                            {doctor.status}
                          </span>
                        </div>

                        <p className="mt-1 text-sm font-medium text-[#0B63CE]">
                          {doctor.specialty}
                        </p>

                        <p className="mt-2 text-sm text-slate-600">
                          <span className="font-semibold">
                            Qualification:
                          </span>{" "}
                          {doctor.qualification}
                        </p>

                        <p className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-500">
                          <BadgeCheck size={16} />
                          PMDC: {doctor.pmdcNumber}
                        </p>

                        <p className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-500">
                          <Languages size={16} />
                          {doctor.languages.join(", ")}
                        </p>

                        <p className="mt-2 break-all text-sm text-slate-500">
                          <span className="font-semibold">Login Email:</span>{" "}
                          {doctor.email}
                        </p>
                      </div>
                    </div>

                    {/* Fees */}
                    <div className="grid grid-cols-2 gap-3 sm:min-w-[260px]">
                      <div className="rounded-xl bg-[#f5f8fc] p-4">
                        <p className="text-xs text-slate-500">Pakistan</p>

                        <p className="mt-1 text-lg font-bold">
                          PKR {doctor.feePKR.toLocaleString()}
                        </p>
                      </div>

                      <div className="rounded-xl bg-[#f5f8fc] p-4">
                        <p className="text-xs text-slate-500">
                          International
                        </p>

                        <p className="mt-1 text-lg font-bold">
                          ${doctor.feeUSD}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => toggleStatus(doctor)}
                        className={`rounded-xl border px-3 py-2.5 text-sm font-semibold transition ${
                          doctor.status === "Active"
                            ? "border-rose-100 text-rose-600 hover:bg-rose-50"
                            : "border-emerald-100 text-emerald-700 hover:bg-emerald-50"
                        }`}
                      >
                        {doctor.status === "Active"
                          ? "Deactivate"
                          : "Activate"}
                      </button>

                      <button
                        type="button"
                        onClick={() => startEditing(doctor)}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0B63CE] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0955AE]"
                      >
                        <Pencil size={16} />
                        Edit Profile
                      </button>
                    </div>
                  </div>

                  {/* Next Available Slot */}
                  <div className="mt-5 flex flex-col gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
                      <CalendarDays
                        size={17}
                        className="text-[#0B63CE]"
                      />

                      <span className="font-semibold">
                        Next Available Slot:
                      </span>

                      <span>{doctor.nextAvailableSlot}</span>
                    </p>

                    <p className="flex items-center gap-2 text-xs text-slate-400">
                      <Clock size={15} />
                      Consultation availability
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <p className="text-xs leading-5 text-slate-500">
          Changes are saved in this browser only. A backend and database
          connection are required to update information for all users.
        </p>
      </div>

      {/* Edit Doctor Modal */}
      {form && editingDoctor && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-slate-950/50 p-3 backdrop-blur-sm sm:p-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="doctor-form-title"
            className="my-4 w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl sm:my-8"
          >
            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-slate-100 bg-white px-5 py-4 sm:px-7">
              <div>
                <h2
                  id="doctor-form-title"
                  className="text-lg font-bold sm:text-xl"
                >
                  Edit Doctor Profile
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Update {editingDoctor.name}'s professional information
                  and login credentials.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                aria-label="Close doctor form"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100"
              >
                <X size={21} />
              </button>
            </div>

            <form onSubmit={saveDoctor}>
              <div className="space-y-7 p-5 sm:p-7">
                {/* Profile Picture */}
                <section>
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#0B63CE]">
                      <Camera size={19} />
                    </div>

                    <div>
                      <h3 className="font-bold">Profile Picture</h3>

                      <p className="mt-1 text-xs text-slate-500">
                        JPG or PNG. Maximum file size: 2 MB.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4 sm:flex-row sm:items-center">
                    <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white">
                      <img
                        src={form.image || getDefaultDoctorImage(form.id)}
                        alt={form.name || "Doctor preview"}
                        className="h-full w-full object-cover"
                        onError={(event) => {
                          event.currentTarget.src = getDefaultDoctorImage(
                            form.id,
                          );
                        }}
                      />
                    </div>

                    <div>
                      <p className="font-semibold">
                        {form.name || "Doctor name preview"}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="inline-flex items-center gap-2 rounded-xl bg-[#0B63CE] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0955AE]"
                        >
                          <Upload size={16} />
                          Upload Photo
                        </button>

                        {form.image && (
                          <button
                            type="button"
                            onClick={() =>
                              updateField(
                                "image",
                                getDefaultDoctorImage(form.id),
                              )
                            }
                            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100"
                          >
                            Reset Photo
                          </button>
                        )}
                      </div>

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>
                  </div>
                </section>

                {/* Doctor Login Credentials */}
                <section>
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#0B63CE]">
                      <BadgeCheck size={19} />
                    </div>

                    <div>
                      <h3 className="font-bold">
                        Doctor Login Credentials
                      </h3>

                      <p className="mt-1 text-xs text-slate-500">
                        Set the email and password used for this doctor's login.
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-2 block text-sm font-semibold">
                        Login Email *
                      </span>

                      <input
                        required
                        type="email"
                        autoComplete="off"
                        className={inputClass}
                        value={form.email}
                        onChange={(event) =>
                          updateField("email", event.target.value)
                        }
                        placeholder="doctor@example.com"
                      />
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-sm font-semibold">
                        Login Password *
                      </span>

                      <input
                        required
                        type="password"
                        autoComplete="new-password"
                        minLength={8}
                        className={inputClass}
                        value={form.password}
                        onChange={(event) =>
                          updateField("password", event.target.value)
                        }
                        placeholder="Minimum 8 characters"
                      />

                      <span className="mt-1 block text-xs text-slate-400">
                        At least 8 characters.
                      </span>
                    </label>
                  </div>
                </section>

                {/* Professional Details */}
                <section>
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#0B63CE]">
                      <GraduationCap size={19} />
                    </div>

                    <div>
                      <h3 className="font-bold">Professional Details</h3>

                      <p className="mt-1 text-xs text-slate-500">
                        Information displayed on the patient-facing profile.
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-2 block text-sm font-semibold">
                        Doctor Name *
                      </span>

                      <input
                        required
                        className={inputClass}
                        value={form.name}
                        onChange={(event) =>
                          updateField("name", event.target.value)
                        }
                        placeholder="Dr. Munib"
                      />
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-sm font-semibold">
                        Medical Specialty *
                      </span>

                      <input
                        required
                        className={inputClass}
                        value={form.specialty}
                        onChange={(event) =>
                          updateField("specialty", event.target.value)
                        }
                        placeholder="Medical Specialist"
                      />
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-sm font-semibold">
                        Qualifications *
                      </span>

                      <input
                        required
                        className={inputClass}
                        value={form.qualification}
                        onChange={(event) =>
                          updateField("qualification", event.target.value)
                        }
                        placeholder="MBBS, FCPS"
                      />
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-sm font-semibold">
                        PMDC Registration Number *
                      </span>

                      <input
                        required
                        className={inputClass}
                        value={form.pmdcNumber}
                        onChange={(event) =>
                          updateField("pmdcNumber", event.target.value)
                        }
                        placeholder="XXXXX-M"
                      />
                    </label>
                  </div>
                </section>

                {/* Languages */}
                <section>
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#0B63CE]">
                      <Languages size={19} />
                    </div>

                    <div>
                      <h3 className="font-bold">Languages</h3>

                      <p className="mt-1 text-xs text-slate-500">
                        Select languages available for consultation.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {availableLanguages.map((language) => {
                      const selected = form.languages.includes(language);

                      return (
                        <button
                          key={language}
                          type="button"
                          aria-pressed={selected}
                          onClick={() => toggleLanguage(language)}
                          className={`rounded-full border px-4 py-2.5 text-sm font-medium transition ${
                            selected
                              ? "border-blue-200 bg-blue-50 text-[#0B63CE]"
                              : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          {selected ? "✓ " : "+ "}
                          {language}
                        </button>
                      );
                    })}
                  </div>
                </section>

                {/* Consultation Fees */}
                <section>
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#0B63CE]">
                      <CircleDollarSign size={19} />
                    </div>

                    <div>
                      <h3 className="font-bold">Consultation Fees</h3>

                      <p className="mt-1 text-xs text-slate-500">
                        Set fees for Pakistan and international patients.
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-2 block text-sm font-semibold">
                        Pakistan Fee (PKR)
                      </span>

                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">
                          PKR
                        </span>

                        <input
                          type="number"
                          min="0"
                          required
                          className={`${inputClass} pl-14`}
                          value={form.feePKR}
                          onChange={(event) =>
                            updateField(
                              "feePKR",
                              Number(event.target.value),
                            )
                          }
                        />
                      </div>
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-sm font-semibold">
                        International Fee (USD)
                      </span>

                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">
                          USD
                        </span>

                        <input
                          type="number"
                          min="0"
                          required
                          className={`${inputClass} pl-14`}
                          value={form.feeUSD}
                          onChange={(event) =>
                            updateField(
                              "feeUSD",
                              Number(event.target.value),
                            )
                          }
                        />
                      </div>
                    </label>
                  </div>
                </section>

                {/* Next Available Slot */}
                <section>
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#0B63CE]">
                      <CalendarDays size={19} />
                    </div>

                    <div>
                      <h3 className="font-bold">Next Available Slot</h3>

                      <p className="mt-1 text-xs text-slate-500">
                        Enter the next slot displayed to patients.
                      </p>
                    </div>
                  </div>

                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold">
                      Date and Time *
                    </span>

                    <div className="relative">
                      <Clock
                        size={18}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        required
                        className={`${inputClass} pl-10`}
                        value={form.nextAvailableSlot}
                        onChange={(event) =>
                          updateField(
                            "nextAvailableSlot",
                            event.target.value,
                          )
                        }
                        placeholder="Today • 04:00 PM"
                      />
                    </div>

                    <p className="mt-2 text-xs text-slate-400">
                      Example: Today • 04:00 PM or Tomorrow • 11:00 AM
                    </p>
                  </label>
                </section>

                {/* Account Status */}
                <section>
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#0B63CE]">
                      <BadgeCheck size={19} />
                    </div>

                    <div>
                      <h3 className="font-bold">Account Status</h3>

                      <p className="mt-1 text-xs text-slate-500">
                        Activate or deactivate this doctor's profile.
                      </p>
                    </div>
                  </div>

                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold">
                      Doctor Status
                    </span>

                    <select
                      className={inputClass}
                      value={form.status}
                      onChange={(event) =>
                        updateField(
                          "status",
                          event.target.value as Doctor["status"],
                        )
                      }
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </label>
                </section>

                {/* Validation Error */}
                {error && (
                  <div
                    role="alert"
                    className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
                  >
                    {error}
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="sticky bottom-0 flex flex-col-reverse gap-3 border-t border-slate-100 bg-white px-5 py-4 sm:flex-row sm:justify-end sm:px-7">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0B63CE] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0955AE] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Save size={17} />
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}

export default ManageDoctors;