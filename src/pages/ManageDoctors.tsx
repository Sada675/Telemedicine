import { useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import {
  Search,
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
} from "lucide-react";
import drMunibImage from "../assets/dr-munib121.jpg";
import drNazliImage from "../assets/lady-doc.jpg";

type Doctor = {
  id: string;
  name: string;
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
    image: "/dr-munib121.jpg",
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
    image: "/lady-doc.jpg",
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

function readDoctors(): Doctor[] {
try {
const saved = localStorage.getItem(STORAGE_KEY);

if (!saved) {
  return defaultDoctors;
}

const parsed: Doctor[] = JSON.parse(saved);

if (!Array.isArray(parsed)) {
  return defaultDoctors;
}

// Keep the two predefined doctors and use saved values when available.
return defaultDoctors.map((defaultDoctor) => {
  const savedDoctor = parsed.find(
    (doctor) => doctor.id === defaultDoctor.id,
  );

  if (!savedDoctor) {
    return defaultDoctor;
  }

  return {
    ...defaultDoctor,
    ...savedDoctor,
    image: savedDoctor.image || defaultDoctor.image,
    name: savedDoctor.name?.trim() || defaultDoctor.name,
    specialty:
      savedDoctor.specialty?.trim() || defaultDoctor.specialty,
    qualification:
      savedDoctor.qualification?.trim() ||
      defaultDoctor.qualification,
    pmdcNumber:
      savedDoctor.pmdcNumber?.trim() ||
      defaultDoctor.pmdcNumber,
    languages:
      Array.isArray(savedDoctor.languages) &&
      savedDoctor.languages.length > 0
        ? savedDoctor.languages
        : defaultDoctor.languages,
    feePKR:
      Number.isFinite(savedDoctor.feePKR)
        ? savedDoctor.feePKR
        : defaultDoctor.feePKR,
    feeUSD:
      Number.isFinite(savedDoctor.feeUSD)
        ? savedDoctor.feeUSD
        : defaultDoctor.feeUSD,
    nextAvailableSlot:
      savedDoctor.nextAvailableSlot?.trim() ||
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
  const [search, setSearch] = useState("");
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [form, setForm] = useState<Doctor | null>(null);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(doctors));

  // Notify Navbar and other components about updated doctor details.
  window.dispatchEvent(new Event("doctorsUpdated"));
}, [doctors]);

  useEffect(() => {
    if (!notice) return;

    const timer = window.setTimeout(() => setNotice(""), 3000);

    return () => window.clearTimeout(timer);
  }, [notice]);

  const filteredDoctors = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return doctors;

    return doctors.filter((doctor) =>
      [
        doctor.name,
        doctor.specialty,
        doctor.qualification,
        doctor.pmdcNumber,
        doctor.languages.join(" "),
      ].some((value) => value.toLowerCase().includes(query)),
    );
  }, [doctors, search]);

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
      previous ? { ...previous, [key]: value } : previous,
    );
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
            ? { ...previous, image: reader.result as string }
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

    const exists = form.languages.includes(language);

    updateField(
      "languages",
      exists
        ? form.languages.filter((item) => item !== language)
        : [...form.languages, language],
    );
  };

  const saveDoctor = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form || !editingDoctor) return;

    if (!form.name.trim()) {
      setError("Doctor name is required.");
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
      setError("Consultation fees must be valid non-negative amounts.");
      return;
    }

    if (!form.nextAvailableSlot.trim()) {
      setError("Next available slot is required.");
      return;
    }

    setDoctors((previous) =>
      previous.map((doctor) =>
        doctor.id === editingDoctor.id
          ? {
              ...form,
              name: form.name.trim(),
              specialty: form.specialty.trim(),
              qualification: form.qualification.trim(),
              pmdcNumber: form.pmdcNumber.trim(),
              nextAvailableSlot: form.nextAvailableSlot.trim(),
            }
          : doctor,
      ),
    );

    closeModal();
    setNotice("Doctor details updated successfully.");
  };

  const toggleStatus = (doctor: Doctor) => {
    const nextStatus =
      doctor.status === "Active" ? "Inactive" : "Active";

    setDoctors((previous) =>
      previous.map((item) =>
        item.id === doctor.id
          ? { ...item, status: nextStatus }
          : item,
      ),
    );

    setNotice(`${doctor.name} is now ${nextStatus}.`);
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

  return (
    <div className="min-h-screen w-full min-w-0 bg-[#f5f8fc] px-4 py-6 text-slate-800 sm:px-6 lg:px-10">
      <div className="mx-auto w-full max-w-[1400px] space-y-6">

        {/* Page Heading */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span>Admin</span>
              <span>/</span>
              <span className="font-medium text-[#0B63CE]">
                Manage Doctors
              </span>
            </div>

            <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
              Manage Doctors
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Manage doctor profiles, qualifications, consultation fees,
              languages, and availability.
            </p>
          </div>

          <div className="flex w-fit items-center gap-2 rounded-xl border border-blue-100 bg-white px-4 py-3 text-sm font-semibold text-[#0B63CE] shadow-sm">
            <Stethoscope size={18} />
            <span>2 Registered Doctors</span>
          </div>
        </div>

        {/* Success Message */}
        {notice && (
          <div
            role="status"
            className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700"
          >
            <CheckCircle size={19} />
            {notice}
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
                View and update the two registered doctor profiles.
              </p>
            </div>

            <div className="relative w-full sm:max-w-xs">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search doctors..."
                aria-label="Search doctors"
                className={`${inputClass} pl-10`}
              />
            </div>
          </div>

          <div className="space-y-4 p-4 sm:p-6">
            {filteredDoctors.length === 0 && (
              <div className="rounded-xl border border-dashed border-slate-200 px-4 py-10 text-center">
                <Search size={28} className="mx-auto text-slate-300" />

                <p className="mt-3 font-semibold">
                  No doctors found
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Try another doctor name or specialty.
                </p>
              </div>
            )}

            {filteredDoctors.map((doctor) => (
              <article
                key={doctor.id}
                className="rounded-2xl border border-slate-200 p-4 transition hover:border-blue-200 hover:shadow-sm sm:p-5"
              >
                <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                  {/* Doctor Profile */}
                  <div className="flex min-w-0 items-start gap-4">
                    <div className="flex h-[84px] w-[84px] shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-blue-50">
                      <img
  src={doctor.image || (doctor.id === "munib" ? drMunibImage : drNazliImage)}
  alt={doctor.name}
  className="h-full w-full object-cover"
  onError={(event) => {
    const fallbackImage =
      doctor.id === "munib" ? drMunibImage : drNazliImage;

    if (event.currentTarget.src !== new URL(fallbackImage, window.location.href).href) {
      event.currentTarget.src = fallbackImage;
    }
  }}
/>

                      {!doctor.image && (
                        <UserRound size={30} className="text-[#0B63CE]" />
                      )}
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
                        <span className="font-semibold">Qualification:</span>{" "}
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
                      {doctor.status === "Active" ? "Deactivate" : "Activate"}
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
                  <p className="flex items-center gap-2 text-sm text-slate-600">
                    <CalendarDays size={17} className="text-[#0B63CE]" />
                    <span className="font-semibold">Next Available Slot:</span>
                    <span>{doctor.nextAvailableSlot}</span>
                  </p>

                  <p className="flex items-center gap-2 text-xs text-slate-400">
                    <Clock size={15} />
                    Consultation availability
                  </p>
                </div>
              </article>
            ))}
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
            if (event.target === event.currentTarget) closeModal();
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-doctor-title"
            className="my-4 w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl sm:my-8"
          >
            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-slate-100 bg-white px-5 py-4 sm:px-7">
              <div>
                <h2
                  id="edit-doctor-title"
                  className="text-lg font-bold sm:text-xl"
                >
                  Edit Doctor Profile
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Update {editingDoctor.name}&apos;s patient-facing information.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                aria-label="Close edit form"
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
                      {form.image ? (
                        <img
                          src={form.image}
                          alt={form.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <UserRound size={35} className="text-slate-300" />
                      )}
                    </div>

                    <div>
                      <p className="font-semibold">{form.name}</p>

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
                            onClick={() => updateField("image", "")}
                            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100"
                          >
                            Remove Photo
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
                            updateField("feePKR", Number(event.target.value))
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
                            updateField("feeUSD", Number(event.target.value))
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
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0B63CE] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0955AE]"
                >
                  <Save size={17} />
                  Save Changes
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
