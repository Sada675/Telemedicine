import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  Search,
  Users,
  Mail,
  Phone,
  MapPin,
  Eye,
  ShieldCheck,
  CheckCircle2,
  UserCheck,
  UserX,
  ArrowUpRight,
  UserPlus,
  Activity,
  ChevronRight,
  CalendarDays,
  SlidersHorizontal,
  X,
} from "lucide-react";

type PatientStatus = "Active" | "Inactive";

type Patient = {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  gender: string;
  age: number;
  status: PatientStatus;
  joinedDate: string;
};

const STORAGE_KEY = "telemedicineAdminPatients";

const initialPatients: Patient[] = [
  {
    id: "PAT-1001",
    name: "Ayesha Khan",
    email: "ayesha@example.com",
    phone: "+92 300 1234567",
    country: "Pakistan",
    gender: "Female",
    age: 28,
    status: "Active",
    joinedDate: "10 Oct 2026",
  },
  {
    id: "PAT-1002",
    name: "Fatima Noor",
    email: "fatima@example.com",
    phone: "+92 301 2345678",
    country: "Pakistan",
    gender: "Female",
    age: 32,
    status: "Active",
    joinedDate: "09 Oct 2026",
  },
  {
    id: "PAT-1003",
    name: "Sara Ahmed",
    email: "sara@example.com",
    phone: "+971 50 1234567",
    country: "UAE",
    gender: "Female",
    age: 25,
    status: "Active",
    joinedDate: "08 Oct 2026",
  },
  {
    id: "PAT-1004",
    name: "Maryam Ali",
    email: "maryam@example.com",
    phone: "+92 302 3456789",
    country: "Pakistan",
    gender: "Female",
    age: 35,
    status: "Inactive",
    joinedDate: "05 Oct 2026",
  },
  {
    id: "PAT-1005",
    name: "Zainab Shah",
    email: "zainab@example.com",
    phone: "+1 202 555 0145",
    country: "United States",
    gender: "Female",
    age: 30,
    status: "Active",
    joinedDate: "02 Oct 2026",
  },
  {
    id: "PAT-1006",
    name: "Ali Hassan",
    email: "ali@example.com",
    phone: "+92 333 4567890",
    country: "Pakistan",
    gender: "Male",
    age: 41,
    status: "Active",
    joinedDate: "01 Oct 2026",
  },
];

function readPatients(): Patient[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) return initialPatients;

    const parsed: unknown = JSON.parse(saved);

    if (!Array.isArray(parsed)) return initialPatients;

    return parsed as Patient[];
  } catch {
    return initialPatients;
  }
}

function ManagePatients() {
  const [patients, setPatients] = useState<Patient[]>(readPatients);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedPatient, setSelectedPatient] =
    useState<Patient | null>(null);
  const [notice, setNotice] = useState("");

  // Save patient data in this browser.
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(patients));
  }, [patients]);

  // Automatically hide success messages.
  useEffect(() => {
    if (!notice) return;

    const timer = window.setTimeout(() => {
      setNotice("");
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [notice]);

  // Close the modal using the Escape key.
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedPatient(null);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  const activeCount = patients.filter(
    (patient) => patient.status === "Active",
  ).length;

  const inactiveCount = patients.length - activeCount;

  const filteredPatients = useMemo(() => {
    const query = search.trim().toLowerCase();

    return patients.filter((patient) => {
      const searchableValues = [
        patient.id,
        patient.name,
        patient.email,
        patient.phone,
        patient.country,
      ];

      const matchesSearch = searchableValues.some((value) =>
        value.toLowerCase().includes(query),
      );

      const matchesStatus =
        statusFilter === "All" || patient.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [patients, search, statusFilter]);

  const getInitials = (name: string) =>
    name
      .trim()
      .split(/\s+/)
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

  const getStatusStyle = (status: PatientStatus) =>
    status === "Active"
      ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
      : "bg-slate-100 text-slate-500 ring-1 ring-slate-200";

  const toggleStatus = (patientId: string) => {
    setPatients((previous) =>
      previous.map((patient) =>
        patient.id === patientId
          ? {
              ...patient,
              status:
                patient.status === "Active" ? "Inactive" : "Active",
            }
          : patient,
      ),
    );

    setSelectedPatient((previous) =>
      previous?.id === patientId
        ? {
            ...previous,
            status:
              previous.status === "Active" ? "Inactive" : "Active",
          }
        : previous,
    );

    setNotice("Patient status updated successfully.");
  };

  return (
    <div className="min-h-screen bg-[#f5f8fc] text-slate-800">
      <div className="mx-auto max-w-[1600px] space-y-7 p-4 sm:p-7 lg:p-9">

        {/* Breadcrumb */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-400">
          <span>Dashboard</span>
          <ChevronRight size={14} />
          <span className="font-semibold text-[#0B63CE]">
            Manage Patients
          </span>
        </div>

        {/* Page heading */}
        <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-3 py-1.5 text-[11px] font-bold text-[#0B63CE] shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-[#0B63CE]" />
              PATIENT MANAGEMENT
            </div>

            <h1 className="text-2xl font-extrabold tracking-tight text-[#183b3b] sm:text-3xl lg:text-[34px]">
              Manage your patients.
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
              Review patient profiles, monitor account status, and manage
              your healthcare community from one place.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-slate-200/80 bg-white px-4 py-3 shadow-sm">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Activity size={21} />
            </div>

            <div>
              <p className="text-xs font-medium text-slate-400">
                Patient accounts
              </p>
              <p className="mt-1 text-sm font-extrabold text-[#183b3b]">
                {patients.length} registered
              </p>
            </div>
          </div>
        </section>

        {/* Success notification */}
        {notice && (
          <div
            role="status"
            className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3.5 text-sm font-medium text-emerald-700"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
              <CheckCircle2 size={19} />
            </div>

            <span className="flex-1">{notice}</span>

            <button
              type="button"
              onClick={() => setNotice("")}
              aria-label="Dismiss notification"
              className="rounded-lg p-1.5 hover:bg-emerald-100"
            >
              <X size={17} />
            </button>
          </div>
        )}

        {/* Statistics cards */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <SummaryCard
            title="Total Patients"
            value={patients.length}
            subtitle="All registered patient accounts"
            icon={<Users size={22} />}
            iconClass="bg-blue-50 text-[#0B63CE]"
            accent="bg-[#0B63CE]"
            trend="Patient overview"
          />

          <SummaryCard
            title="Active Patients"
            value={activeCount}
            subtitle="Currently active accounts"
            icon={<UserCheck size={22} />}
            iconClass="bg-emerald-50 text-emerald-600"
            accent="bg-emerald-500"
            trend={
              patients.length
                ? `${Math.round((activeCount / patients.length) * 100)}% of patients`
                : "0% of patients"
            }
          />

          <SummaryCard
            title="Inactive Patients"
            value={inactiveCount}
            subtitle="Accounts marked inactive"
            icon={<UserX size={22} />}
            iconClass="bg-amber-50 text-amber-600"
            accent="bg-amber-500"
            trend="Account monitoring"
          />
        </section>

        {/* Patient directory */}
        <section className="overflow-hidden rounded-[22px] border border-slate-200/70 bg-white shadow-[0_4px_24px_rgba(15,23,42,0.035)]">

          {/* Directory heading */}
          <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 sm:p-6 lg:flex-row lg:items-center">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#0B63CE]">
                <Users size={21} />
              </div>

              <div>
                <h3 className="text-base font-extrabold text-[#183b3b]">
                  Patient Directory
                </h3>
                <p className="mt-1 text-xs leading-5 text-slate-400">
                  Search, review, and manage patient accounts.
                </p>
              </div>
            </div>

            <div className="inline-flex w-fit items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-500">
              <Activity size={15} className="text-emerald-500" />
              {filteredPatients.length} results found
            </div>
          </div>

          {/* Search and filters */}
          <div className="flex flex-col gap-3 border-b border-slate-100 bg-slate-50/50 p-4 sm:p-5 md:flex-row">
            <div className="relative min-w-0 flex-1">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by name, email, phone or patient ID..."
                aria-label="Search patients"
                className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#0B63CE] focus:ring-4 focus:ring-blue-50"
              />
            </div>

            <div className="relative sm:min-w-[190px]">
              <SlidersHorizontal
                size={16}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                aria-label="Filter by patient status"
                className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-3.5 pl-10 pr-9 text-sm font-medium text-slate-600 outline-none transition focus:border-[#0B63CE] focus:ring-4 focus:ring-blue-50"
              >
                <option value="All">All statuses</option>
                <option value="Active">Active patients</option>
                <option value="Inactive">Inactive patients</option>
              </select>
            </div>
          </div>

          {/* Responsive patient table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left">
              <thead>
                <tr className="bg-slate-50/70 text-[10px] font-bold uppercase tracking-[0.13em] text-slate-400">
                  <th className="px-6 py-4">Patient</th>
                  <th className="px-6 py-4">Contact information</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Joined date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredPatients.map((patient) => (
                  <tr
                    key={patient.id}
                    className="group transition-colors hover:bg-blue-50/30"
                  >
                    {/* Patient information */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-gradient-to-br from-[#e5f4f2] to-[#eaf2ff] text-sm font-extrabold text-[#245b5b]">
                          {getInitials(patient.name)}
                        </div>

                        <div>
                          <p className="text-[13px] font-bold text-[#183b3b] transition group-hover:text-[#0B63CE]">
                            {patient.name}
                          </p>
                          <p className="mt-1 text-[11px] font-medium text-slate-400">
                            {patient.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="px-6 py-5">
                      <div className="space-y-2">
                        <p className="flex items-center gap-2 text-xs font-medium text-slate-600">
                          <Mail size={14} className="shrink-0 text-slate-400" />
                          {patient.email}
                        </p>

                        <p className="flex items-center gap-2 text-xs text-slate-400">
                          <Phone size={13} className="shrink-0" />
                          {patient.phone}
                        </p>
                      </div>
                    </td>

                    {/* Country */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                        <MapPin size={15} className="shrink-0 text-slate-400" />
                        {patient.country}
                      </div>
                    </td>

                    {/* Registration date */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                        <CalendarDays size={14} className="text-slate-400" />
                        {patient.joinedDate}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-5">
                      <span
                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-bold ${getStatusStyle(patient.status)}`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            patient.status === "Active"
                              ? "bg-emerald-500"
                              : "bg-slate-400"
                          }`}
                        />
                        {patient.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedPatient(patient)}
                          aria-label={`View ${patient.name} details`}
                          title="View patient details"
                          className="flex h-9 w-9 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-[#0B63CE] transition hover:border-blue-200 hover:bg-[#0B63CE] hover:text-white"
                        >
                          <Eye size={16} />
                        </button>

                        <button
                          type="button"
                          onClick={() => toggleStatus(patient.id)}
                          title={
                            patient.status === "Active"
                              ? "Deactivate patient"
                              : "Activate patient"
                          }
                          aria-label={
                            patient.status === "Active"
                              ? `Deactivate ${patient.name}`
                              : `Activate ${patient.name}`
                          }
                          className={`flex h-9 w-9 items-center justify-center rounded-xl border transition ${
                            patient.status === "Active"
                              ? "border-amber-100 bg-amber-50 text-amber-600 hover:border-amber-200 hover:bg-amber-500 hover:text-white"
                              : "border-emerald-100 bg-emerald-50 text-emerald-600 hover:border-emerald-200 hover:bg-emerald-500 hover:text-white"
                          }`}
                        >
                          {patient.status === "Active" ? (
                            <UserX size={16} />
                          ) : (
                            <UserCheck size={16} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {/* Empty state */}
                {filteredPatients.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center">
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                        <Search size={25} />
                      </div>

                      <p className="mt-4 text-sm font-bold text-[#183b3b]">
                        No patients found
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-400">
                        Try another search term or change the status filter.
                      </p>

                      {(search || statusFilter !== "All") && (
                        <button
                          type="button"
                          onClick={() => {
                            setSearch("");
                            setStatusFilter("All");
                          }}
                          className="mt-4 rounded-xl bg-blue-50 px-4 py-2 text-xs font-bold text-[#0B63CE] transition hover:bg-blue-100"
                        >
                          Clear filters
                        </button>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Table footer */}
          <div className="flex flex-col gap-2 border-t border-slate-100 bg-slate-50/40 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <p className="text-xs text-slate-400">
              Showing{" "}
              <span className="font-bold text-slate-600">
                {filteredPatients.length}
              </span>{" "}
              of{" "}
              <span className="font-bold text-slate-600">
                {patients.length}
              </span>{" "}
              patient accounts
            </p>

            <p className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
              <ShieldCheck size={14} className="text-emerald-500" />
              Patient information overview
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="flex flex-col gap-2 border-t border-slate-200/70 pt-5 pb-2 text-center text-[11px] text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <p>© 2026 Telemedicine. All rights reserved.</p>
          <p className="font-medium">
            Healthcare management made simpler.
          </p>
        </footer>
      </div>

      {/* Patient details modal */}
      {selectedPatient && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-slate-950/55 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedPatient(null);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="patient-modal-title"
            className="my-auto w-full max-w-lg overflow-hidden rounded-[26px] border border-white/70 bg-white shadow-2xl shadow-slate-950/20"
          >
            {/* Modal header */}
            <div className="relative overflow-hidden bg-gradient-to-br from-[#0B63CE] to-[#084a9c] px-6 py-6 text-white">
              <div className="absolute -right-6 -top-12 h-40 w-40 rounded-full border-[25px] border-white/5" />
              <div className="absolute right-20 -bottom-12 h-28 w-28 rounded-full bg-white/5" />

              <div className="relative flex items-start justify-between gap-4">
                <div>
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
                    <Users size={21} />
                  </div>

                  <h3
                    id="patient-modal-title"
                    className="text-xl font-extrabold"
                  >
                    Patient Profile
                  </h3>

                  <p className="mt-1 text-xs text-blue-100">
                    Detailed patient account information
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedPatient(null)}
                  aria-label="Close patient details"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white transition hover:bg-white/20"
                >
                  <X size={19} />
                </button>
              </div>
            </div>

            <div className="p-5 sm:p-6">
              {/* Patient identity */}
              <div className="mb-6 flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
                <div className="flex h-[66px] w-[66px] shrink-0 items-center justify-center rounded-[20px] bg-gradient-to-br from-[#dff4f0] to-[#e6efff] text-xl font-extrabold text-[#245b5b] ring-4 ring-white shadow-sm">
                  {getInitials(selectedPatient.name)}
                </div>

                <div className="min-w-0 flex-1">
                  <h4 className="break-words text-lg font-extrabold text-[#183b3b]">
                    {selectedPatient.name}
                  </h4>

                  <p className="mt-1 text-xs font-medium text-slate-400">
                    Patient ID: {selectedPatient.id}
                  </p>

                  <span
                    className={`mt-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold ${getStatusStyle(selectedPatient.status)}`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        selectedPatient.status === "Active"
                          ? "bg-emerald-500"
                          : "bg-slate-400"
                      }`}
                    />
                    {selectedPatient.status} account
                  </span>
                </div>
              </div>

              {/* Personal information */}
              <div className="mb-5">
                <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
                  Personal information
                </p>

                <div className="space-y-4">
                  <DetailRow
                    icon={<Mail size={17} />}
                    label="Email address"
                    value={selectedPatient.email}
                  />

                  <DetailRow
                    icon={<Phone size={17} />}
                    label="Phone number"
                    value={selectedPatient.phone}
                  />

                  <DetailRow
                    icon={<MapPin size={17} />}
                    label="Country"
                    value={selectedPatient.country}
                  />

                  <DetailRow
                    icon={<Users size={17} />}
                    label="Gender"
                    value={selectedPatient.gender}
                  />

                  <DetailRow
                    icon={<Activity size={17} />}
                    label="Age"
                    value={`${selectedPatient.age} years`}
                  />

                  <DetailRow
                    icon={<CalendarDays size={17} />}
                    label="Registration date"
                    value={selectedPatient.joinedDate}
                  />
                </div>
              </div>

              {/* Modal actions */}
              <div className="grid grid-cols-1 gap-3 border-t border-slate-100 pt-5 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setSelectedPatient(null)}
                  className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
                >
                  Close profile
                </button>

                <button
                  type="button"
                  onClick={() => toggleStatus(selectedPatient.id)}
                  className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition ${
                    selectedPatient.status === "Active"
                      ? "bg-rose-50 text-rose-600 hover:bg-rose-100"
                      : "bg-[#0B63CE] text-white shadow-md shadow-blue-100 hover:bg-[#0955AE]"
                  }`}
                >
                  {selectedPatient.status === "Active" ? (
                    <>
                      <UserX size={17} />
                      Deactivate
                    </>
                  ) : (
                    <>
                      <UserCheck size={17} />
                      Activate patient
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

type SummaryCardProps = {
  title: string;
  value: number;
  subtitle: string;
  icon: ReactNode;
  iconClass: string;
  accent: string;
  trend: string;
};

function SummaryCard({
  title,
  value,
  subtitle,
  icon,
  iconClass,
  accent,
  trend,
}: SummaryCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-[22px] border border-slate-200/70 bg-white p-5 shadow-[0_4px_24px_rgba(15,23,42,0.035)] transition-all duration-300 hover:-translate-y-1 hover:border-blue-100 hover:shadow-lg hover:shadow-blue-100/40 sm:p-6">
      <div
        className={`absolute left-0 top-6 h-10 w-1 rounded-r-full ${accent}`}
      />

      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-slate-500 sm:text-sm">
            {title}
          </p>

          <h4 className="mt-3 text-3xl font-extrabold tracking-tight text-[#183b3b] sm:text-[34px]">
            {value}
          </h4>

          <p className="mt-1.5 text-[11px] leading-5 text-slate-400">
            {subtitle}
          </p>
        </div>

        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110 ${iconClass}`}
        >
          {icon}
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2 border-t border-slate-100 pt-4">
        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
          {title === "Total Patients" ? (
            <UserPlus size={13} />
          ) : title === "Active Patients" ? (
            <ArrowUpRight size={14} />
          ) : (
            <Activity size={13} />
          )}
        </span>

        <p className="text-[10px] font-semibold text-slate-500">
          {trend}
        </p>
      </div>
    </div>
  );
}

type DetailRowProps = {
  icon: ReactNode;
  label: string;
  value: string;
};

function DetailRow({ icon, label, value }: DetailRowProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#0B63CE]">
        {icon}
      </div>

      <div className="min-w-0 flex-1 border-b border-slate-100 pb-3">
        <p className="text-[11px] font-medium text-slate-400">
          {label}
        </p>

        <p className="mt-1 break-words text-sm font-semibold text-slate-700">
          {value || "Not provided"}
        </p>
      </div>
    </div>
  );
}

export default ManagePatients;
