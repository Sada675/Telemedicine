import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  ArrowLeft,
  BadgeCheck,
  Check,
  Clock,
  DollarSign,
  Edit3,
  GraduationCap,
  Globe,
  Mail,
  Menu,
  Search,
  ShieldCheck,
  Stethoscope,
  X,
} from "lucide-react";

type Doctor = {
  id: string;
  name: string;
  email: string;
  specialty: string;
  qualification: string;
  experience: number;
  feePKR: number;
  feeUSD: number;
  languages: string[];
  status: "Active" | "Inactive";
};

type DoctorForm = {
  name: string;
  email: string;
  specialty: string;
  qualification: string;
  experience: string;
  feePKR: string;
  feeUSD: string;
  languages: string;
};

const STORAGE_KEY = "telemedicineAdminDoctors";

const initialDoctors: Doctor[] = [
  {
    id: "doctor-munib",
    name: "Dr. Munib",
    email: "munib@example.com",
    specialty: "Medical Specialist",
    qualification: "MBBS, FCPS",
    experience: 5,
    feePKR: 3000,
    feeUSD: 25,
    languages: ["English", "Urdu"],
    status: "Active",
  },
  {
    id: "doctor-nazli",
    name: "Dr. Nazli",
    email: "nazli@example.com",
    specialty: "Medical Specialist",
    qualification: "MBBS, FCPS",
    experience: 4,
    feePKR: 3000,
    feeUSD: 25,
    languages: ["English", "Urdu"],
    status: "Active",
  },
];

function readDoctors(): Doctor[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return initialDoctors;
    }

    const parsed: unknown = JSON.parse(stored);

    if (!Array.isArray(parsed)) {
      return initialDoctors;
    }

    // Only the two predefined doctors are allowed.
    // Previously added doctors will not appear.
    return initialDoctors.map((initialDoctor) => {
      const savedDoctor = parsed.find(
        (doctor: Doctor) => doctor.id === initialDoctor.id,
      );

      return savedDoctor
        ? {
            ...initialDoctor,
            ...savedDoctor,
            id: initialDoctor.id,
          }
        : initialDoctor;
    });
  } catch {
    return initialDoctors;
  }
}

function ManageDoctors() {
  const [doctors, setDoctors] = useState<Doctor[]>(readDoctors);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const emptyForm: DoctorForm = {
    name: "",
    email: "",
    specialty: "",
    qualification: "",
    experience: "",
    feePKR: "",
    feeUSD: "",
    languages: "",
  };

  const [form, setForm] = useState<DoctorForm>(emptyForm);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(doctors));
  }, [doctors]);

  useEffect(() => {
    if (!notice) return;

    const timer = window.setTimeout(() => {
      setNotice("");
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [notice]);

  const filteredDoctors = useMemo(() => {
    return doctors.filter((doctor) => {
      const query = searchTerm.trim().toLowerCase();

      const matchesSearch =
        doctor.name.toLowerCase().includes(query) ||
        doctor.email.toLowerCase().includes(query) ||
        doctor.specialty.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" || doctor.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [doctors, searchTerm, statusFilter]);

  const activeDoctors = doctors.filter(
    (doctor) => doctor.status === "Active",
  ).length;

  const inactiveDoctors = doctors.filter(
    (doctor) => doctor.status === "Inactive",
  ).length;

  const openEditModal = (doctor: Doctor) => {
    setEditingId(doctor.id);

    setForm({
      name: doctor.name,
      email: doctor.email,
      specialty: doctor.specialty,
      qualification: doctor.qualification,
      experience: String(doctor.experience),
      feePKR: String(doctor.feePKR),
      feeUSD: String(doctor.feeUSD),
      languages: doctor.languages.join(", "),
    });

    setError("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setForm({ ...emptyForm });
    setError("");
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!editingId) {
      setError("Please select a doctor to edit.");
      return;
    }

    const name = form.name.trim();
    const email = form.email.trim();
    const specialty = form.specialty.trim();
    const qualification = form.qualification.trim();

    const experience = Number(form.experience);
    const feePKR = Number(form.feePKR);
    const feeUSD = Number(form.feeUSD);

    if (
      !name ||
      !email ||
      !specialty ||
      !qualification ||
      !form.experience ||
      !form.feePKR ||
      !form.feeUSD
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (
      !Number.isFinite(experience) ||
      experience < 0 ||
      !Number.isInteger(experience)
    ) {
      setError("Experience must be a valid non-negative whole number.");
      return;
    }

    if (
      !Number.isFinite(feePKR) ||
      feePKR < 0 ||
      !Number.isFinite(feeUSD) ||
      feeUSD < 0
    ) {
      setError("Consultation fees must be valid non-negative amounts.");
      return;
    }

    const languages = form.languages
      .split(",")
      .map((language) => language.trim())
      .filter(Boolean);

    setDoctors((previous) =>
      previous.map((doctor) =>
        doctor.id === editingId
          ? {
              ...doctor,
              name,
              email,
              specialty,
              qualification,
              experience,
              feePKR,
              feeUSD,
              languages,
            }
          : doctor,
      ),
    );

    closeModal();
    setNotice("Doctor profile updated successfully.");
  };

  const toggleDoctorStatus = (doctorId: string) => {
    setDoctors((previous) =>
      previous.map((doctor) =>
        doctor.id === doctorId
          ? {
              ...doctor,
              status:
                doctor.status === "Active" ? "Inactive" : "Active",
            }
          : doctor,
      ),
    );

    setNotice("Doctor status updated successfully.");
  };

  const inputClass =
    "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#0B63CE] focus:ring-2 focus:ring-[#0B63CE]/10";

  return (
    <div className="min-h-screen bg-[#f8faf9] text-slate-800">
      {/* Mobile Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3.5 lg:hidden">
        <Link to="/admin-dashboard" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0B63CE] text-white">
            <PlusIcon />
          </div>

          <span className="text-base font-bold text-[#183b3b]">
            Telemedicine
          </span>
        </Link>

        <button
          type="button"
          onClick={() => setMobileMenuOpen((previous) => !previous)}
          aria-label="Toggle navigation menu"
          aria-expanded={mobileMenuOpen}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200"
        >
          {mobileMenuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </header>

      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside
          className={`${
            mobileMenuOpen ? "block" : "hidden"
          } fixed inset-x-0 bottom-0 top-[65px] z-20 overflow-y-auto border-r border-slate-200 bg-white p-5 lg:sticky lg:top-0 lg:block lg:h-screen lg:w-[260px] lg:shrink-0`}
        >
          <Link
            to="/admin-dashboard"
            className="mb-10 hidden items-center gap-3 lg:flex"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0B63CE] text-white">
              <PlusIcon />
            </div>

            <div>
              <h1 className="text-lg font-bold text-[#183b3b]">
                Telemedicine
              </h1>
              <p className="text-xs text-slate-500">Admin Workspace</p>
            </div>
          </Link>

          <div className="mb-4 px-3 text-[10px] font-bold uppercase tracking-[1.8px] text-slate-400">
            Main Menu
          </div>

          <nav className="space-y-1.5">
            <SidebarLink
              to="/admin-dashboard"
              label="Dashboard"
              icon={<Activity size={18} />}
              onClick={() => setMobileMenuOpen(false)}
            />

            <SidebarLink
              to="/manage-doctors"
              label="Manage Doctors"
              icon={<Stethoscope size={18} />}
              active
              onClick={() => setMobileMenuOpen(false)}
            />

            <SidebarLink
              to="/manage-patients"
              label="Manage Patients"
              icon={<GraduationCap size={18} />}
              onClick={() => setMobileMenuOpen(false)}
            />

            <SidebarLink
              to="/manage-appointments"
              label="Appointments"
              icon={<Clock size={18} />}
              onClick={() => setMobileMenuOpen(false)}
            />

            <SidebarLink
              to="/notifications"
              label="Notifications"
              icon={<BadgeCheck size={18} />}
              onClick={() => setMobileMenuOpen(false)}
            />

            <SidebarLink
              to="/admin-settings"
              label="Settings"
              icon={<ShieldCheck size={18} />}
              onClick={() => setMobileMenuOpen(false)}
            />
          </nav>

          <div className="mt-10 rounded-2xl bg-[#f0f7ff] p-4">
            <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#0B63CE]">
              <ShieldCheck size={19} />
            </div>

            <h3 className="text-sm font-bold text-[#183b3b]">
              Admin Access
            </h3>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Manage doctor profiles, consultation fees and account status.
            </p>
          </div>
        </aside>

        {/* Main Content */}
        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-9 lg:py-9">
          {/* Page Heading */}
          <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-xs text-slate-500">
                <Link
                  to="/admin-dashboard"
                  className="transition hover:text-[#0B63CE]"
                >
                  Dashboard
                </Link>

                <span>/</span>

                <span className="font-medium text-[#0B63CE]">
                  Manage Doctors
                </span>
              </div>

              <h2 className="text-2xl font-bold tracking-tight text-[#183b3b] sm:text-3xl">
                Manage Doctors
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                View and manage the profiles, consultation fees and status
                of your registered doctors.
              </p>
            </div>

            <Link
              to="/admin-dashboard"
              className="inline-flex min-h-10 items-center justify-center gap-2 self-start rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-[#0B63CE] hover:text-[#0B63CE]"
            >
              <ArrowLeft size={16} />
              Back to Dashboard
            </Link>
          </div>

          {/* Success Message */}
          {notice && (
            <div
              role="status"
              className="mb-5 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700"
            >
              <Check size={18} />
              {notice}
            </div>
          )}

          {/* Summary Cards */}
          <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <SummaryCard
              title="Total Doctors"
              value={doctors.length}
              icon={<Stethoscope size={21} />}
              description="Registered doctor accounts"
            />

            <SummaryCard
              title="Active Doctors"
              value={activeDoctors}
              icon={<BadgeCheck size={21} />}
              description="Available doctor accounts"
            />

            <SummaryCard
              title="Inactive Doctors"
              value={inactiveDoctors}
              icon={<Clock size={21} />}
              description="Currently inactive accounts"
            />
          </div>

          {/* Doctor Management */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:p-6">
              <div>
                <h3 className="text-lg font-bold text-[#183b3b]">
                  Doctor Profiles
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Edit the details of your two registered doctors.
                </p>
              </div>

              {/* Search and Filter */}
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative min-w-0 flex-1">
                  <Search
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="search"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search doctors..."
                    aria-label="Search doctors"
                    className="w-full rounded-xl border border-slate-200 bg-[#f8faf9] py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#0B63CE] focus:ring-2 focus:ring-[#0B63CE]/10"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  aria-label="Filter doctors by status"
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#0B63CE]"
                >
                  <option value="All">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* Responsive Table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left">
                <thead>
                  <tr className="border-b border-slate-100 bg-[#f8faf9]">
                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Doctor
                    </th>

                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Specialty
                    </th>

                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Experience
                    </th>

                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Consultation Fee
                    </th>

                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Status
                    </th>

                    <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredDoctors.map((doctor) => (
                    <tr
                      key={doctor.id}
                      className="transition hover:bg-slate-50/70"
                    >
                      <td className="px-5 py-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#e5f4f2] text-sm font-bold text-[#245b5b]">
                            {doctor.name
                              .replace("Dr. ", "")
                              .split(" ")
                              .map((part) => part[0])
                              .join("")
                              .slice(0, 2)
                              .toUpperCase()}
                          </div>

                          <div className="min-w-0">
                            <p className="font-semibold text-[#183b3b]">
                              {doctor.name}
                            </p>

                            <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                              <Mail size={12} />
                              {doctor.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-5">
                        <p className="text-sm font-medium text-slate-700">
                          {doctor.specialty}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {doctor.qualification}
                        </p>
                      </td>

                      <td className="px-5 py-5">
                        <span className="text-sm text-slate-700">
                          {doctor.experience}{" "}
                          {doctor.experience === 1 ? "year" : "years"}
                        </span>
                      </td>

                      <td className="px-5 py-5">
                        <p className="flex items-center gap-1 text-sm font-semibold text-[#183b3b]">
                          <span className="text-xs font-medium text-slate-500">
                            PKR
                          </span>
                          {doctor.feePKR.toLocaleString("en-PK")}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          ${doctor.feeUSD} USD
                        </p>
                      </td>

                      <td className="px-5 py-5">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
                            doctor.status === "Active"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              doctor.status === "Active"
                                ? "bg-emerald-500"
                                : "bg-slate-400"
                            }`}
                          />

                          {doctor.status}
                        </span>
                      </td>

                      <td className="px-5 py-5">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEditModal(doctor)}
                            aria-label={`Edit ${doctor.name} profile`}
                            title="Edit doctor profile"
                            className="flex h-9 w-9 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-[#0B63CE] transition hover:bg-blue-100"
                          >
                            <Edit3 size={16} />
                          </button>

                          <button
                            type="button"
                            onClick={() => toggleDoctorStatus(doctor.id)}
                            title={
                              doctor.status === "Active"
                                ? "Deactivate doctor"
                                : "Activate doctor"
                            }
                            aria-label={
                              doctor.status === "Active"
                                ? `Deactivate ${doctor.name}`
                                : `Activate ${doctor.name}`
                            }
                            className={`flex h-9 w-9 items-center justify-center rounded-xl border transition ${
                              doctor.status === "Active"
                                ? "border-amber-100 bg-amber-50 text-amber-600 hover:bg-amber-100"
                                : "border-emerald-100 bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                            }`}
                          >
                            {doctor.status === "Active" ? (
                              <X size={16} />
                            ) : (
                              <Check size={16} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filteredDoctors.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-5 py-14 text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                          <Search size={22} />
                        </div>

                        <p className="mt-3 font-semibold text-slate-700">
                          No doctors found
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          Try another search term or status filter.
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col gap-2 border-t border-slate-100 px-5 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
              <span>
                Showing {filteredDoctors.length} of {doctors.length} doctors
              </span>

              <span className="flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-[#0B63CE]" />
                Doctor accounts are managed by the admin.
              </span>
            </div>
          </section>

          {/* Information Notice */}
          <div className="mt-5 flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50/70 p-4">
            <div className="mt-0.5 text-[#0B63CE]">
              <ShieldCheck size={19} />
            </div>

            <div>
              <h4 className="text-sm font-bold text-[#183b3b]">
                Doctor Profile Management
              </h4>

              <p className="mt-1 text-xs leading-5 text-slate-600 sm:text-sm">
                Only the admin can update doctor profiles, consultation
                fees and account status. Adding or deleting doctor accounts
                is not available in this panel.
              </p>
            </div>
          </div>
        </main>
      </div>

      {/* Edit Doctor Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 p-3 backdrop-blur-[2px] sm:p-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-doctor-title"
            className="my-auto w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5 sm:px-7">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e5f4f2] text-[#245b5b]">
                  <Edit3 size={20} />
                </div>

                <div>
                  <h3
                    id="edit-doctor-title"
                    className="text-lg font-bold text-[#183b3b]"
                  >
                    Edit Doctor Profile
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    Update the doctor's information below.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeModal}
                aria-label="Close edit doctor modal"
                className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit}>
              <div className="max-h-[65vh] space-y-5 overflow-y-auto px-5 py-6 sm:px-7">
                {error && (
                  <div
                    role="alert"
                    className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
                  >
                    {error}
                  </div>
                )}

                <div>
                  <h4 className="mb-4 flex items-center gap-2 text-sm font-bold text-[#183b3b]">
                    <Stethoscope size={17} className="text-[#0B63CE]" />
                    Personal & Professional Details
                  </h4>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <label className="block text-sm font-medium text-slate-700">
                      Doctor Name
                      <input
                        name="name"
                        value={form.name}
                        onChange={handleInputChange}
                        className={inputClass}
                        placeholder="Enter doctor name"
                        required
                      />
                    </label>

                    <label className="block text-sm font-medium text-slate-700">
                      Email Address
                      <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleInputChange}
                        className={inputClass}
                        placeholder="doctor@example.com"
                        required
                      />
                    </label>

                    <label className="block text-sm font-medium text-slate-700">
                      Medical Specialty
                      <input
                        name="specialty"
                        value={form.specialty}
                        onChange={handleInputChange}
                        className={inputClass}
                        placeholder="Medical Specialist"
                        required
                      />
                    </label>

                    <label className="block text-sm font-medium text-slate-700">
                      Qualifications
                      <input
                        name="qualification"
                        value={form.qualification}
                        onChange={handleInputChange}
                        className={inputClass}
                        placeholder="MBBS, FCPS"
                        required
                      />
                    </label>

                    <label className="block text-sm font-medium text-slate-700">
                      Experience (Years)
                      <input
                        name="experience"
                        type="number"
                        min="0"
                        step="1"
                        value={form.experience}
                        onChange={handleInputChange}
                        className={inputClass}
                        placeholder="5"
                        required
                      />
                    </label>

                    <label className="block text-sm font-medium text-slate-700">
                      Languages
                      <div className="relative">
                        <Globe
                          size={16}
                          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                          name="languages"
                          value={form.languages}
                          onChange={handleInputChange}
                          className={`${inputClass} pl-10`}
                          placeholder="English, Urdu"
                        />
                      </div>

                      <span className="mt-1 block text-xs font-normal text-slate-400">
                        Separate languages with commas.
                      </span>
                    </label>
                  </div>
                </div>

                {/* Consultation Fees */}
                <div className="rounded-2xl border border-slate-100 bg-[#f8faf9] p-4 sm:p-5">
                  <h4 className="mb-4 flex items-center gap-2 text-sm font-bold text-[#183b3b]">
                    <DollarSign size={17} className="text-[#0B63CE]" />
                    Consultation Fees
                  </h4>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <label className="block text-sm font-medium text-slate-700">
                      Fee for Pakistan (PKR)
                      <input
                        name="feePKR"
                        type="number"
                        min="0"
                        step="1"
                        value={form.feePKR}
                        onChange={handleInputChange}
                        className={inputClass}
                        placeholder="3000"
                        required
                      />
                    </label>

                    <label className="block text-sm font-medium text-slate-700">
                      International Fee (USD)
                      <input
                        name="feeUSD"
                        type="number"
                        min="0"
                        step="0.01"
                        value={form.feeUSD}
                        onChange={handleInputChange}
                        className={inputClass}
                        placeholder="25"
                        required
                      />
                    </label>
                  </div>

                  <p className="mt-3 text-xs leading-5 text-slate-500">
                    These values are saved in this browser for now. They
                    will need backend integration to update the live
                    doctor profiles and booking prices for all users.
                  </p>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-white px-5 py-4 sm:flex-row sm:justify-end sm:px-7">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0B63CE] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0955AE]"
                >
                  <Check size={16} />
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

type SidebarLinkProps = {
  to: string;
  label: string;
  icon: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
};

function SidebarLink({
  to,
  label,
  icon,
  active = false,
  onClick,
}: SidebarLinkProps) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition ${
        active
          ? "bg-[#0B63CE] text-white shadow-sm"
          : "text-slate-600 hover:bg-[#f0f7ff] hover:text-[#0B63CE]"
      }`}
    >
      <span className="shrink-0">{icon}</span>
      <span>{label}</span>
    </Link>
  );
}

type SummaryCardProps = {
  title: string;
  value: number;
  icon: React.ReactNode;
  description: string;
};

function SummaryCard({
  title,
  value,
  icon,
  description,
}: SummaryCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-blue-100">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>

          <p className="mt-2 text-3xl font-bold tracking-tight text-[#183b3b]">
            {value}
          </p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e5f4f2] text-[#245b5b]">
          {icon}
        </div>
      </div>

      <p className="mt-3 text-xs text-slate-500">{description}</p>
    </div>
  );
}

function PlusIcon() {
  return (
    <span className="text-2xl font-light leading-none" aria-hidden="true">
      +
    </span>
  );
}

export default ManageDoctors;