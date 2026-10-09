import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  
  ClipboardList,
  Download,
  FileText,
  Pill,
  Printer,
  Search,
  ShieldCheck,
  Stethoscope,
  UserRound,
  X,
} from "lucide-react";

import drMunib from "../assets/dr-munib121.jpg";
import ladyDoc from "../assets/lady-doc.jpg";

type Medicine = {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
};

type Prescription = {
  id: string;
  doctor: string;
  specialty: string;
  image: string;
  date: string;
  diagnosis: string;
  medicines: Medicine[];
  notes: string;
  followUp: string;
  status: "Active" | "Completed";
};

const prescriptions: Prescription[] = [
  {
    id: "RX-2026-001",
    doctor: "Dr. Nazli",
    specialty: "Medical Specialist",
    image: ladyDoc,
    date: "October 8, 2026",
    diagnosis: "Sample diagnosis — consultation review required",
    medicines: [
      {
        name: "Medicine A",
        dosage: "As prescribed by doctor",
        frequency: "As directed",
        duration: "As prescribed",
        instructions:
          "Follow the instructions on your verified prescription.",
      },
      {
        name: "Medicine B",
        dosage: "As prescribed by doctor",
        frequency: "As directed",
        duration: "As prescribed",
        instructions:
          "Confirm the dosage and timing with your doctor.",
      },
    ],
    notes:
      "This is sample interface data only. Actual diagnosis and treatment instructions must come from your doctor.",
    followUp: "Follow-up date to be confirmed by your doctor",
    status: "Active",
  },
  {
    id: "RX-2026-002",
    doctor: "Dr. Munib",
    specialty: "Medical Specialist",
    image: drMunib,
    date: "October 2, 2026",
    diagnosis: "Sample consultation record",
    medicines: [
      {
        name: "Medicine C",
        dosage: "As prescribed by doctor",
        frequency: "As directed",
        duration: "As prescribed",
        instructions:
          "Use only the dosage confirmed by your prescribing doctor.",
      },
    ],
    notes:
      "Sample record for testing the prescriptions interface. Replace with verified clinical information.",
    followUp: "Contact your doctor if a follow-up is needed",
    status: "Completed",
  },
  {
    id: "RX-2026-003",
    doctor: "Dr. Nazli",
    specialty: "Medical Specialist",
    image: ladyDoc,
    date: "September 25, 2026",
    diagnosis: "Sample medical record",
    medicines: [
      {
        name: "Medicine D",
        dosage: "As prescribed by doctor",
        frequency: "As directed",
        duration: "As prescribed",
        instructions:
          "Refer to your original prescription for verified instructions.",
      },
    ],
    notes:
      "Demo information only. No real medical advice is provided by this sample record.",
    followUp: "Follow-up information not available",
    status: "Completed",
  },
];

type FilterType = "All" | "Active" | "Completed";

function Prescriptions() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] =
    useState<FilterType>("All");
  const [selectedPrescription, setSelectedPrescription] =
    useState<Prescription | null>(null);

  const filteredPrescriptions = prescriptions.filter(
    (prescription) => {
      const matchesSearch = [
        prescription.id,
        prescription.doctor,
        prescription.diagnosis,
      ]
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesFilter =
        activeFilter === "All" ||
        prescription.status === activeFilter;

      return matchesSearch && matchesFilter;
    },
  );

  const handlePrint = (prescription: Prescription) => {
    setSelectedPrescription(prescription);

    window.setTimeout(() => {
      window.print();
    }, 100);
  };

  const closeDetails = () => {
    setSelectedPrescription(null);
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#f8faf9]">
      <Navbar />

      <main className="mx-auto w-full max-w-7xl px-4 pb-12 pt-[96px] sm:px-6 lg:px-8">
        {/* Back link */}
        <Link
          to="/patient-dashboard"
          className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 no-underline transition hover:text-[#0B63CE]"
        >
          <ArrowLeft size={17} />
          Back to Dashboard
        </Link>

        {/* Header */}
        <section className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-purple-600">
              <FileText size={17} />
              Patient Portal
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-[#183b3b] sm:text-3xl">
              My Prescriptions
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
              View your prescription records and review
              instructions provided by your doctor.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-purple-100 bg-white px-4 py-3 text-sm font-medium text-purple-700 shadow-sm">
            <ShieldCheck size={19} />
            <span>Medical Records</span>
          </div>
        </section>

        {/* Summary cards */}
        <section className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              <FileText size={21} />
            </div>

            <p className="mt-4 text-3xl font-bold text-[#183b3b]">
              {prescriptions.length}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Total Prescriptions
            </p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 size={21} />
            </div>

            <p className="mt-4 text-3xl font-bold text-[#183b3b]">
              {
                prescriptions.filter(
                  (item) => item.status === "Active",
                ).length
              }
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Active Records
            </p>
          </div>

          <div className="col-span-2 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:col-span-1">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <CalendarDays size={21} />
            </div>

            <p className="mt-4 text-base font-bold text-[#183b3b]">
              Keep them handy
            </p>

            <p className="mt-1 text-sm leading-5 text-slate-500">
              Review records shared by your healthcare provider.
            </p>
          </div>
        </section>

        {/* Search and filters */}
        <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-5 sm:p-6">
            <h2 className="text-lg font-bold text-[#183b3b]">
              Prescription History
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Search and review your prescription records.
            </p>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="search"
                  value={searchTerm}
                  onChange={(event) =>
                    setSearchTerm(event.target.value)
                  }
                  placeholder="Search doctor or prescription ID..."
                  aria-label="Search prescriptions"
                  className="w-full rounded-xl border border-slate-200 bg-[#fcfdfc] py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#0B63CE] focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="relative">
                <select
                  value={activeFilter}
                  onChange={(event) =>
                    setActiveFilter(
                      event.target.value as FilterType,
                    )
                  }
                  aria-label="Filter prescriptions by status"
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-4 pr-10 text-sm font-medium text-slate-600 outline-none focus:border-[#0B63CE] sm:w-44"
                >
                  <option value="All">All Records</option>
                  <option value="Active">Active</option>
                  <option value="Completed">Completed</option>
                </select>

                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>
            </div>
          </div>

          {/* Prescription cards */}
          <div className="space-y-4 bg-[#fcfdfc] p-4 sm:p-6">
            {filteredPrescriptions.length > 0 ? (
              filteredPrescriptions.map((prescription) => (
                <article
                  key={prescription.id}
                  className="overflow-hidden rounded-2xl border border-slate-100 bg-white transition hover:border-purple-100 hover:shadow-md"
                >
                  <div className="p-4 sm:p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                        <img
                          src={prescription.image}
                          alt={prescription.doctor}
                          className="h-16 w-16 shrink-0 rounded-2xl border border-slate-100 object-cover sm:h-[76px] sm:w-[76px]"
                        />

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-base font-bold text-[#183b3b] sm:text-lg">
                              {prescription.doctor}
                            </h3>

                            <span
                              className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                                prescription.status === "Active"
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-slate-100 text-slate-600"
                              }`}
                            >
                              {prescription.status}
                            </span>
                          </div>

                          <p className="mt-1 text-sm text-slate-500">
                            {prescription.specialty}
                          </p>

                          <p className="mt-2 break-all text-xs text-slate-400">
                            ID: {prescription.id}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-start rounded-xl bg-[#f8faf9] px-3 py-2.5 text-sm text-slate-600">
                        <CalendarDays
                          size={16}
                          className="text-purple-600"
                        />
                        {prescription.date}
                      </div>
                    </div>

                    <div className="mt-5 rounded-xl border border-purple-100 bg-purple-50/50 p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-purple-600 shadow-sm">
                          <Stethoscope size={18} />
                        </div>

                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-purple-600">
                            Diagnosis / Visit Notes
                          </p>

                          <p className="mt-1 text-sm font-medium leading-6 text-slate-700">
                            {prescription.diagnosis}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Pill
                          size={18}
                          className="text-[#245b5b]"
                        />

                        <h4 className="text-sm font-bold text-[#183b3b]">
                          Prescribed Medicines
                        </h4>
                      </div>

                      <span className="text-xs text-slate-400">
                        {prescription.medicines.length} items
                      </span>
                    </div>

                    <div className="mt-3 space-y-2">
                      {prescription.medicines.map(
                        (medicine, index) => (
                          <div
                            key={`${prescription.id}-${index}`}
                            className="flex items-start gap-3 rounded-xl border border-slate-100 p-3"
                          >
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#e5f4f2] text-[#245b5b]">
                              <Pill size={16} />
                            </div>

                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-semibold text-slate-800">
                                {medicine.name}
                              </p>

                              <p className="mt-1 text-xs leading-5 text-slate-500">
                                {medicine.dosage} ·{" "}
                                {medicine.frequency}
                              </p>

                              <p className="mt-1 text-xs leading-5 text-slate-500">
                                Duration: {medicine.duration}
                              </p>
                            </div>
                          </div>
                        ),
                      )}
                    </div>

                    <div className="mt-4 flex flex-col gap-3 rounded-xl bg-[#f8faf9] p-4 sm:flex-row sm:items-start">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-[#245b5b]">
                        <ClipboardList size={18} />
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-[#183b3b]">
                          Doctor&apos;s Notes
                        </p>

                        <p className="mt-1 text-sm leading-6 text-slate-500">
                          {prescription.notes}
                        </p>

                        <p className="mt-3 text-xs leading-5 text-slate-500">
                          <span className="font-semibold text-slate-700">
                            Follow-up:
                          </span>{" "}
                          {prescription.followUp}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                      <p className="flex items-center gap-2 text-xs leading-5 text-slate-400">
                        <ShieldCheck
                          size={15}
                          className="shrink-0 text-emerald-600"
                        />
                        Sample interface data — verify medical details with your doctor.
                      </p>

                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedPrescription(prescription)
                          }
                          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 sm:flex-none"
                        >
                          <FileText size={16} />
                          View Details
                        </button>

                        <button
                          type="button"
                          onClick={() => handlePrint(prescription)}
                          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#0B63CE] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0955AE] sm:flex-none"
                        >
                          <Printer size={16} />
                          Print
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="px-4 py-14 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
                  <FileText size={30} />
                </div>

                <h3 className="mt-5 text-lg font-bold text-[#183b3b]">
                  No prescriptions found
                </h3>

                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                  Try another search term or select a different
                  prescription status.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm("");
                    setActiveFilter("All");
                  }}
                  className="mt-5 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </section>

        
      </main>

      <Footer />

      {/* Prescription details modal */}
      {selectedPrescription && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/50 px-4 py-6 backdrop-blur-sm print:static print:block print:bg-white print:p-0">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="prescription-details-title"
            className="my-auto max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:p-7 print:max-h-none print:max-w-none print:overflow-visible print:rounded-none print:p-0 print:shadow-none"
          >
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold text-purple-600">
                  <FileText size={18} />
                  Prescription Record
                </div>

                <h2
                  id="prescription-details-title"
                  className="mt-2 text-xl font-bold text-[#183b3b]"
                >
                  Prescription Details
                </h2>

                <p className="mt-1 break-all text-xs text-slate-400">
                  {selectedPrescription.id}
                </p>
              </div>

              <button
                type="button"
                onClick={closeDetails}
                aria-label="Close prescription details"
                className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 print:hidden"
              >
                <X size={21} />
              </button>
            </div>

            <div className="mt-5 flex items-center gap-4">
              <img
                src={selectedPrescription.image}
                alt={selectedPrescription.doctor}
                className="h-16 w-16 rounded-2xl border border-slate-100 object-cover"
              />

              <div>
                <h3 className="font-bold text-[#183b3b]">
                  {selectedPrescription.doctor}
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  {selectedPrescription.specialty}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  {selectedPrescription.date}
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-xl bg-[#f8faf9] p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Diagnosis / Visit Notes
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-700">
                {selectedPrescription.diagnosis}
              </p>
            </div>

            <h3 className="mt-6 flex items-center gap-2 font-bold text-[#183b3b]">
              <Pill size={19} />
              Medicines
            </h3>

            <div className="mt-3 space-y-3">
              {selectedPrescription.medicines.map(
                (medicine, index) => (
                  <div
                    key={`${selectedPrescription.id}-detail-${index}`}
                    className="rounded-xl border border-slate-100 p-4"
                  >
                    <h4 className="font-semibold text-slate-800">
                      {medicine.name}
                    </h4>

                    <p className="mt-2 text-sm text-slate-600">
                      {medicine.dosage}
                    </p>

                    <p className="mt-1 text-sm text-slate-600">
                      Frequency: {medicine.frequency}
                    </p>

                    <p className="mt-1 text-sm text-slate-600">
                      Duration: {medicine.duration}
                    </p>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {medicine.instructions}
                    </p>
                  </div>
                ),
              )}
            </div>

            <div className="mt-5 rounded-xl border border-slate-100 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#183b3b]">
                <UserRound size={17} />
                Doctor&apos;s Notes
              </div>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                {selectedPrescription.notes}
              </p>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                <strong className="text-slate-700">
                  Follow-up:
                </strong>{" "}
                {selectedPrescription.followUp}
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end print:hidden">
              <button
                type="button"
                onClick={closeDetails}
                className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Close
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0B63CE] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0955AE]"
              >
                <Download size={17} />
                Print Prescription
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Prescriptions;
