import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Stethoscope,
  Users,
  CalendarDays,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  Plus,
  Search,
  UserRound,
  Mail,
  Phone,
  MapPin,
  Eye,
  ShieldCheck,
  CheckCircle2,
  UserCheck,
  UserX,
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

const navigation = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    path: "/admin-dashboard",
  },
  {
    name: "Manage Doctors",
    icon: Stethoscope,
    path: "/manage-doctors",
  },
  {
    name: "Manage Patients",
    icon: Users,
    path: "/manage-patients",
  },
  {
    name: "Appointments",
    icon: CalendarDays,
    path: "/manage-appointments",
  },
  {
    name: "Notifications",
    icon: Bell,
    path: "/notifications",
  },
  {
    name: "Settings",
    icon: Settings,
    path: "/admin-settings",
  },
];

function ManagePatients() {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [patients, setPatients] = useState<Patient[]>(readPatients);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(
    null,
  );
  const [notice, setNotice] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(patients));
  }, [patients]);

  useEffect(() => {
    if (!notice) return;

    const timer = window.setTimeout(() => setNotice(""), 3000);

    return () => window.clearTimeout(timer);
  }, [notice]);

  const activeCount = patients.filter(
    (patient) => patient.status === "Active",
  ).length;

  const inactiveCount = patients.filter(
    (patient) => patient.status === "Inactive",
  ).length;

  const filteredPatients = useMemo(() => {
    const query = search.trim().toLowerCase();

    return patients.filter((patient) => {
      const matchesSearch = [
        patient.id,
        patient.name,
        patient.email,
        patient.phone,
        patient.country,
      ].some((value) => value.toLowerCase().includes(query));

      const matchesStatus =
        statusFilter === "All" || patient.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [patients, search, statusFilter]);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userRole");

    window.dispatchEvent(new Event("authChange"));
    navigate("/doctor-login");
  };

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

  const getStatusStyle = (status: PatientStatus) =>
    status === "Active"
      ? "bg-emerald-50 text-emerald-700"
      : "bg-slate-100 text-slate-500";

  return (
    <div className="min-h-screen bg-[#f8faf9] text-slate-800">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-100 bg-white transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex h-20 items-center justify-between border-b border-slate-100 px-6">
          <Link to="/admin-dashboard" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0B63CE] text-white">
              <Plus size={28} strokeWidth={3} />
            </div>

            <div>
              <h1 className="text-lg font-bold text-[#183b3b]">
                Telemedicine
              </h1>
              <p className="text-xs text-slate-500">Admin Panel</p>
            </div>
          </Link>

          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-4 pt-7">
          <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Main Menu
          </p>

          <nav className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = item.name === "Manage Patients";

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    active
                      ? "bg-[#0B63CE] text-white shadow-md shadow-blue-100"
                      : "text-slate-600 hover:bg-blue-50 hover:text-[#0B63CE]"
                  }`}
                >
                  <Icon size={19} />
                  {item.name}

                  {item.name === "Notifications" && (
                    <span className="ml-auto rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
                      3
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto border-t border-slate-100 p-4">
          <div className="mb-4 flex items-center gap-3 rounded-xl bg-[#f8faf9] p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-[#0B63CE]">
              <UserRound size={21} />
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">
                Administrator
              </p>
              <p className="text-xs text-slate-500">Super Admin</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50"
          >
            <LogOut size={19} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="min-h-screen lg:ml-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-100 bg-white/95 px-4 backdrop-blur sm:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
            >
              <Menu size={23} />
            </button>

            <div>
              <h2 className="text-lg font-bold text-[#183b3b] sm:text-xl">
                Manage Patients
              </h2>
              <p className="hidden text-xs text-slate-500 sm:block">
                View and manage registered patient accounts.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate("/notifications")}
            aria-label="Notifications"
            className="relative rounded-xl border border-slate-100 p-2.5 text-slate-600 transition hover:bg-blue-50 hover:text-[#0B63CE]"
          >
            <Bell size={20} />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
          </button>
        </header>

        <div className="space-y-7 p-4 sm:p-8">
          {/* Breadcrumb and heading */}
          <section>
            <div className="mb-2 flex items-center gap-2 text-xs text-slate-500">
              <Link
                to="/admin-dashboard"
                className="hover:text-[#0B63CE]"
              >
                Dashboard
              </Link>
              <span>/</span>
              <span className="font-medium text-[#0B63CE]">
                Manage Patients
              </span>
            </div>

            <h3 className="text-2xl font-bold text-[#183b3b] sm:text-3xl">
              Patient Management
            </h3>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Review patient information and manage account status from
              one place.
            </p>
          </section>

          {/* Success message */}
          {notice && (
            <div
              role="status"
              className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
            >
              <CheckCircle2 size={18} />
              {notice}
            </div>
          )}

          {/* Statistics */}
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <SummaryCard
              title="Total Patients"
              value={patients.length}
              subtitle="Registered patient accounts"
              icon={<Users size={22} />}
              iconClass="bg-blue-50 text-[#0B63CE]"
            />

            <SummaryCard
              title="Active Patients"
              value={activeCount}
              subtitle="Active patient accounts"
              icon={<UserCheck size={22} />}
              iconClass="bg-emerald-50 text-emerald-600"
            />

            <SummaryCard
              title="Inactive Patients"
              value={inactiveCount}
              subtitle="Inactive patient accounts"
              icon={<UserX size={22} />}
              iconClass="bg-amber-50 text-amber-600"
            />
          </section>

          {/* Patient table */}
          <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
            <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:p-6">
              <div>
                <h3 className="text-lg font-bold text-[#183b3b]">
                  Registered Patients
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Search patients and view their account information.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative min-w-0 flex-1">
                  <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search name, email, phone or ID..."
                    aria-label="Search patients"
                    className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#0B63CE] focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  aria-label="Filter by patient status"
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#0B63CE]"
                >
                  <option value="All">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left">
                <thead className="bg-[#f8faf9]">
                  <tr className="text-xs uppercase tracking-wider text-slate-500">
                    <th className="px-5 py-4 font-semibold">Patient</th>
                    <th className="px-5 py-4 font-semibold">Contact</th>
                    <th className="px-5 py-4 font-semibold">Country</th>
                    <th className="px-5 py-4 font-semibold">Joined Date</th>
                    <th className="px-5 py-4 font-semibold">Status</th>
                    <th className="px-5 py-4 text-right font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredPatients.map((patient) => (
                    <tr
                      key={patient.id}
                      className="transition hover:bg-slate-50"
                    >
                      <td className="px-5 py-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#e5f4f2] font-bold text-[#245b5b]">
                            {patient.name
                              .split(" ")
                              .map((part) => part[0])
                              .slice(0, 2)
                              .join("")
                              .toUpperCase()}
                          </div>

                          <div>
                            <p className="text-sm font-semibold text-[#183b3b]">
                              {patient.name}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              {patient.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-5">
                        <p className="flex items-center gap-2 text-sm text-slate-700">
                          <Mail
                            size={14}
                            className="shrink-0 text-slate-400"
                          />
                          {patient.email}
                        </p>
                        <p className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                          <Phone
                            size={13}
                            className="shrink-0 text-slate-400"
                          />
                          {patient.phone}
                        </p>
                      </td>

                      <td className="px-5 py-5">
                        <span className="flex items-center gap-2 text-sm text-slate-600">
                          <MapPin
                            size={15}
                            className="text-slate-400"
                          />
                          {patient.country}
                        </span>
                      </td>

                      <td className="px-5 py-5 text-sm text-slate-600">
                        {patient.joinedDate}
                      </td>

                      <td className="px-5 py-5">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusStyle(patient.status)}`}
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

                      <td className="px-5 py-5">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedPatient(patient)}
                            aria-label={`View ${patient.name} details`}
                            title="View patient details"
                            className="flex h-9 w-9 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-[#0B63CE] transition hover:bg-blue-100"
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
                                ? "border-amber-100 bg-amber-50 text-amber-600 hover:bg-amber-100"
                                : "border-emerald-100 bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
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

                  {filteredPatients.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-5 py-14 text-center">
                        <Search
                          size={25}
                          className="mx-auto text-slate-400"
                        />
                        <p className="mt-3 font-semibold text-slate-700">
                          No patients found
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          Try a different search term or status filter.
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="border-t border-slate-100 px-5 py-4 text-xs text-slate-500">
              Showing {filteredPatients.length} of {patients.length} sample
              patients
            </div>
          </section>

          {/* Notice */}
          <div className="flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50/70 p-4">
            <ShieldCheck
              size={20}
              className="mt-0.5 shrink-0 text-[#0B63CE]"
            />
            <div>
              <h4 className="text-sm font-bold text-[#183b3b]">
                Patient Account Management
              </h4>
              <p className="mt-1 text-xs leading-5 text-slate-600 sm:text-sm">
                This page currently uses sample data. Connect it to your
                backend to manage real patient accounts. Account status
                changes are currently saved only in this browser.
              </p>
            </div>
          </div>

          <footer className="pb-2 text-center text-xs text-slate-400">
            © 2026 Telemedicine Admin Panel. All rights reserved.
          </footer>
        </div>
      </main>

      {/* Patient Details Modal */}
      {selectedPatient && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4 backdrop-blur-[2px]"
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
            className="my-auto w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5 sm:px-6">
              <div>
                <h3
                  id="patient-modal-title"
                  className="text-lg font-bold text-[#183b3b]"
                >
                  Patient Details
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Patient account information
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedPatient(null)}
                aria-label="Close patient details"
                className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-5 sm:p-6">
              <div className="mb-6 flex items-center gap-4 rounded-2xl bg-[#f8faf9] p-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#e5f4f2] text-xl font-bold text-[#245b5b]">
                  {selectedPatient.name
                    .split(" ")
                    .map((part) => part[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase()}
                </div>

                <div className="min-w-0">
                  <h4 className="text-lg font-bold text-[#183b3b]">
                    {selectedPatient.name}
                  </h4>
                  <p className="mt-1 text-sm text-slate-500">
                    {selectedPatient.id}
                  </p>
                  <span
                    className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusStyle(selectedPatient.status)}`}
                  >
                    {selectedPatient.status}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <DetailRow
                  icon={<Mail size={17} />}
                  label="Email Address"
                  value={selectedPatient.email}
                />

                <DetailRow
                  icon={<Phone size={17} />}
                  label="Phone Number"
                  value={selectedPatient.phone}
                />

                <DetailRow
                  icon={<MapPin size={17} />}
                  label="Country"
                  value={selectedPatient.country}
                />

                <DetailRow
                  icon={<UserRound size={17} />}
                  label="Gender"
                  value={selectedPatient.gender}
                />

                <DetailRow
                  icon={<UserRound size={17} />}
                  label="Age"
                  value={`${selectedPatient.age} years`}
                />

                <DetailRow
                  icon={<CalendarDays size={17} />}
                  label="Registration Date"
                  value={selectedPatient.joinedDate}
                />
              </div>

              <button
                type="button"
                onClick={() => toggleStatus(selectedPatient.id)}
                className={`mt-6 flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition ${
                  selectedPatient.status === "Active"
                    ? "bg-red-50 text-red-600 hover:bg-red-100"
                    : "bg-[#0B63CE] text-white hover:bg-[#0955AE]"
                }`}
              >
                {selectedPatient.status === "Active" ? (
                  <>
                    <UserX size={17} />
                    Deactivate Patient
                  </>
                ) : (
                  <>
                    <UserCheck size={17} />
                    Activate Patient
                  </>
                )}
              </button>
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
  icon: React.ReactNode;
  iconClass: string;
};

function SummaryCard({
  title,
  value,
  subtitle,
  icon,
  iconClass,
}: SummaryCardProps) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h4 className="mt-3 text-3xl font-bold text-[#183b3b]">
            {value}
          </h4>
        </div>

        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconClass}`}
        >
          {icon}
        </div>
      </div>

      <p className="mt-4 text-xs text-slate-500">{subtitle}</p>
    </div>
  );
}

type DetailRowProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
};

function DetailRow({ icon, label, value }: DetailRowProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-[#0B63CE]">{icon}</div>

      <div className="min-w-0 flex-1">
        <p className="text-xs text-slate-500">{label}</p>
        <p className="mt-1 break-words text-sm font-medium text-slate-700">
          {value}
        </p>
      </div>
    </div>
  );
}

export default ManagePatients;
