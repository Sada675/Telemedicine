import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  FileText,
  Plus,
  Search,
  Printer,
  Trash2,
  X,
  UserRound,
  CalendarDays,
  Pill,
  CheckCircle,
  ClipboardList,
  Stethoscope,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

type Medicine = {
  id: number;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
};

type Prescription = {
  id: number;
  patientName: string;
  patientEmail: string;
  diagnosis: string;
  date: string;
  medicines: Medicine[];
  instructions: string;
};

function DoctorPrescriptions() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedPrescription, setSelectedPrescription] =
    useState<Prescription | null>(null);

  const [prescriptions, setPrescriptions] = useState<Prescription[]>([
    {
      id: 1,
      patientName: "Ayesha Khan",
      patientEmail: "ayesha@example.com",
      diagnosis: "Seasonal Allergies",
      date: "Oct 12, 2026",
      medicines: [
        {
          id: 1,
          name: "Cetirizine",
          dosage: "10 mg",
          frequency: "Once daily",
          duration: "5 days",
        },
      ],
      instructions: "Drink plenty of water and get adequate rest.",
    },
    {
      id: 2,
      patientName: "Fatima Ahmed",
      patientEmail: "fatima@example.com",
      diagnosis: "Vitamin Deficiency",
      date: "Oct 11, 2026",
      medicines: [
        {
          id: 2,
          name: "Vitamin D",
          dosage: "As prescribed",
          frequency: "As directed",
          duration: "As prescribed",
        },
      ],
      instructions: "Follow up with your doctor as advised.",
    },
    {
      id: 3,
      patientName: "Sara Ali",
      patientEmail: "sara@example.com",
      diagnosis: "General Consultation",
      date: "Oct 10, 2026",
      medicines: [],
      instructions: "Follow the care plan discussed during consultation.",
    },
  ]);

  const [formData, setFormData] = useState({
    patientName: "",
    patientEmail: "",
    diagnosis: "",
    instructions: "",
  });

  const [medicines, setMedicines] = useState<Medicine[]>([
    {
      id: Date.now(),
      name: "",
      dosage: "",
      frequency: "",
      duration: "",
    },
  ]);

  const [message, setMessage] = useState("");

  const filteredPrescriptions = prescriptions.filter((prescription) => {
    const search = searchTerm.toLowerCase();

    return (
      prescription.patientName.toLowerCase().includes(search) ||
      prescription.patientEmail.toLowerCase().includes(search) ||
      prescription.diagnosis.toLowerCase().includes(search)
    );
  });

  const handleInputChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleMedicineChange = (
    id: number,
    field: keyof Omit<Medicine, "id">,
    value: string
  ) => {
    setMedicines((previous) =>
      previous.map((medicine) =>
        medicine.id === id
          ? { ...medicine, [field]: value }
          : medicine
      )
    );
  };

  const addMedicine = () => {
    setMedicines((previous) => [
      ...previous,
      {
        id: Date.now() + Math.random(),
        name: "",
        dosage: "",
        frequency: "",
        duration: "",
      },
    ]);
  };

  const removeMedicine = (id: number) => {
    setMedicines((previous) =>
      previous.filter((medicine) => medicine.id !== id)
    );
  };

  const resetForm = () => {
    setFormData({
      patientName: "",
      patientEmail: "",
      diagnosis: "",
      instructions: "",
    });

    setMedicines([
      {
        id: Date.now(),
        name: "",
        dosage: "",
        frequency: "",
        duration: "",
      },
    ]);

    setMessage("");
  };

  const handleSavePrescription = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const validMedicines = medicines.filter(
      (medicine) =>
        medicine.name.trim() &&
        medicine.dosage.trim() &&
        medicine.frequency.trim() &&
        medicine.duration.trim()
    );

    if (validMedicines.length === 0) {
      setMessage(
        "Please add at least one medicine with all required details."
      );
      return;
    }

    const newPrescription: Prescription = {
      id: Date.now(),
      patientName: formData.patientName.trim(),
      patientEmail: formData.patientEmail.trim(),
      diagnosis: formData.diagnosis.trim(),
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }),
      medicines: validMedicines,
      instructions: formData.instructions.trim(),
    };

    setPrescriptions((previous) => [
      newPrescription,
      ...previous,
    ]);

    setShowForm(false);
    setSelectedPrescription(newPrescription);
    resetForm();
  };

  const handlePrint = () => {
    window.print();
  };

  const inputClass =
    "mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-[#0B63CE] focus:ring-2 focus:ring-blue-100";

  const labelClass =
    "text-sm font-semibold text-gray-700";

  return (
    <div className="min-h-screen bg-[#f8faf9]">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          to="/doctor-dashboard"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-[#0B63CE]"
        >
          <ArrowLeft size={17} />
          Back to Dashboard
        </Link>

        {/* Page Header */}
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-[#0B63CE]">
              <FileText size={25} />
            </div>

            <h1 className="text-2xl font-bold text-[#183b3b] sm:text-3xl">
              Doctor Prescriptions
            </h1>

            <p className="mt-2 text-sm text-gray-500 sm:text-base">
              Create, manage, and review your patients' prescriptions.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              resetForm();
              setSelectedPrescription(null);
              setShowForm(true);
            }}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0B63CE] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0955AE]"
          >
            <Plus size={19} />
            Create Prescription
          </button>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Total Prescriptions
                </p>
                <h2 className="mt-2 text-3xl font-bold text-[#183b3b]">
                  {prescriptions.length}
                </h2>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-[#0B63CE]">
                <FileText size={23} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Patients Treated
                </p>
                <h2 className="mt-2 text-3xl font-bold text-[#183b3b]">
                  {
                    new Set(
                      prescriptions.map((item) => item.patientEmail)
                    ).size
                  }
                </h2>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-600">
                <UserRound size={23} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Today's Prescriptions
                </p>
                <h2 className="mt-2 text-3xl font-bold text-[#183b3b]">
                  {
                    prescriptions.filter(
                      (item) =>
                        item.date ===
                        new Date().toLocaleDateString("en-US", {
                          month: "short",
                          day: "2-digit",
                          year: "numeric",
                        })
                    ).length
                  }
                </h2>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-[#F9A603]">
                <CalendarDays size={23} />
              </div>
            </div>
          </div>
        </div>

        {/* Prescriptions History */}
        <section className="rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div>
              <h2 className="text-lg font-bold text-[#183b3b]">
                Prescription History
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                View prescriptions issued to your patients.
              </p>
            </div>

            <div className="relative w-full sm:max-w-xs">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
                placeholder="Search patient or diagnosis..."
                className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#0B63CE] focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          {filteredPrescriptions.length === 0 ? (
            <div className="px-5 py-16 text-center">
              <ClipboardList
                size={42}
                className="mx-auto mb-3 text-gray-300"
              />

              <h3 className="font-semibold text-[#183b3b]">
                No prescriptions found
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Try another search or create a new prescription.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-left">
                <thead className="bg-gray-50">
                  <tr className="text-xs uppercase tracking-wide text-gray-500">
                    <th className="px-6 py-4 font-semibold">
                      Patient
                    </th>
                    <th className="px-6 py-4 font-semibold">
                      Diagnosis
                    </th>
                    <th className="px-6 py-4 font-semibold">
                      Date
                    </th>
                    <th className="px-6 py-4 font-semibold">
                      Medicines
                    </th>
                    <th className="px-6 py-4 text-right font-semibold">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredPrescriptions.map((prescription) => (
                    <tr
                      key={prescription.id}
                      className="transition hover:bg-gray-50/70"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 font-semibold text-[#0B63CE]">
                            {prescription.patientName
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div>
                            <p className="text-sm font-semibold text-gray-800">
                              {prescription.patientName}
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                              {prescription.patientEmail}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <span className="rounded-lg bg-teal-50 px-3 py-1.5 text-xs font-medium text-[#245b5b]">
                          {prescription.diagnosis}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-sm text-gray-600">
                        {prescription.date}
                      </td>

                      <td className="px-6 py-5">
                        <span className="inline-flex items-center gap-1.5 text-sm text-gray-600">
                          <Pill
                            size={16}
                            className="text-[#0B63CE]"
                          />
                          {prescription.medicines.length}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-right">
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedPrescription(prescription)
                          }
                          className="rounded-lg border border-blue-100 px-3 py-2 text-xs font-semibold text-[#0B63CE] transition hover:bg-blue-50"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      <Footer />

      {/* Create Prescription Modal */}
      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/50 p-3 py-6 sm:p-6">
          <div className="my-auto w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 sm:px-7">
              <div>
                <h2 className="text-xl font-bold text-[#183b3b]">
                  Create Prescription
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Enter patient and prescription details.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setMessage("");
                }}
                className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
                aria-label="Close prescription form"
              >
                <X size={21} />
              </button>
            </div>

            <form
              onSubmit={handleSavePrescription}
              className="max-h-[75vh] space-y-6 overflow-y-auto p-5 sm:p-7"
            >
              {/* Patient Details */}
              <div>
                <h3 className="mb-4 flex items-center gap-2 font-semibold text-[#183b3b]">
                  <UserRound size={19} className="text-[#0B63CE]" />
                  Patient Information
                </h3>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="patientName"
                      className={labelClass}
                    >
                      Patient Name *
                    </label>

                    <input
                      id="patientName"
                      name="patientName"
                      value={formData.patientName}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter patient name"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="patientEmail"
                      className={labelClass}
                    >
                      Patient Email *
                    </label>

                    <input
                      id="patientEmail"
                      name="patientEmail"
                      type="email"
                      value={formData.patientEmail}
                      onChange={handleInputChange}
                      required
                      placeholder="patient@example.com"
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>

              {/* Diagnosis */}
              <div>
                <label
                  htmlFor="diagnosis"
                  className={labelClass}
                >
                  Diagnosis *
                </label>

                <input
                  id="diagnosis"
                  name="diagnosis"
                  value={formData.diagnosis}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter diagnosis"
                  className={inputClass}
                />
              </div>

              {/* Medicines */}
              <div>
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h3 className="flex items-center gap-2 font-semibold text-[#183b3b]">
                    <Pill size={19} className="text-[#0B63CE]" />
                    Medicines
                  </h3>

                  <button
                    type="button"
                    onClick={addMedicine}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-[#0B63CE] transition hover:bg-blue-100"
                  >
                    <Plus size={15} />
                    Add Medicine
                  </button>
                </div>

                <div className="space-y-4">
                  {medicines.map((medicine, index) => (
                    <div
                      key={medicine.id}
                      className="rounded-xl border border-gray-200 bg-gray-50/70 p-4"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <p className="text-sm font-semibold text-gray-700">
                          Medicine {index + 1}
                        </p>

                        {medicines.length > 1 && (
                          <button
                            type="button"
                            onClick={() =>
                              removeMedicine(medicine.id)
                            }
                            className="rounded-lg p-1.5 text-red-500 transition hover:bg-red-50"
                            aria-label={`Remove medicine ${index + 1}`}
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div>
                          <label
                            htmlFor={`medicine-name-${medicine.id}`}
                            className="text-xs font-semibold text-gray-600"
                          >
                            Medicine Name *
                          </label>

                          <input
                            id={`medicine-name-${medicine.id}`}
                            value={medicine.name}
                            onChange={(event) =>
                              handleMedicineChange(
                                medicine.id,
                                "name",
                                event.target.value
                              )
                            }
                            required
                            placeholder="Medicine name"
                            className={inputClass}
                          />
                        </div>

                        <div>
                          <label
                            htmlFor={`medicine-dosage-${medicine.id}`}
                            className="text-xs font-semibold text-gray-600"
                          >
                            Dosage *
                          </label>

                          <input
                            id={`medicine-dosage-${medicine.id}`}
                            value={medicine.dosage}
                            onChange={(event) =>
                              handleMedicineChange(
                                medicine.id,
                                "dosage",
                                event.target.value
                              )
                            }
                            required
                            placeholder="As prescribed"
                            className={inputClass}
                          />
                        </div>

                        <div>
                          <label
                            htmlFor={`medicine-frequency-${medicine.id}`}
                            className="text-xs font-semibold text-gray-600"
                          >
                            Frequency *
                          </label>

                          <input
                            id={`medicine-frequency-${medicine.id}`}
                            value={medicine.frequency}
                            onChange={(event) =>
                              handleMedicineChange(
                                medicine.id,
                                "frequency",
                                event.target.value
                              )
                            }
                            required
                            placeholder="As directed"
                            className={inputClass}
                          />
                        </div>

                        <div>
                          <label
                            htmlFor={`medicine-duration-${medicine.id}`}
                            className="text-xs font-semibold text-gray-600"
                          >
                            Duration *
                          </label>

                          <input
                            id={`medicine-duration-${medicine.id}`}
                            value={medicine.duration}
                            onChange={(event) =>
                              handleMedicineChange(
                                medicine.id,
                                "duration",
                                event.target.value
                              )
                            }
                            required
                            placeholder="As prescribed"
                            className={inputClass}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Instructions */}
              <div>
                <label
                  htmlFor="instructions"
                  className={labelClass}
                >
                  Additional Instructions
                </label>

                <textarea
                  id="instructions"
                  name="instructions"
                  rows={3}
                  value={formData.instructions}
                  onChange={handleInputChange}
                  placeholder="Enter follow-up or care instructions..."
                  className={inputClass}
                />
              </div>

              {message && (
                <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                  {message}
                </p>
              )}

              <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setMessage("");
                  }}
                  className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0B63CE] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0955AE]"
                >
                  <CheckCircle size={17} />
                  Save Prescription
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Prescription Details Modal */}
      {selectedPrescription && !showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/50 p-3 py-6 sm:p-6">
          <div
            id="prescription-print"
            className="my-auto w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-gray-100 bg-[#f8faf9] px-5 py-4 sm:px-7">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-[#0B63CE]">
                  <Stethoscope size={23} />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-[#183b3b]">
                    Telemedicine
                  </h2>

                  <p className="text-xs text-gray-500">
                    Digital Prescription
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedPrescription(null)}
                className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-200"
                aria-label="Close prescription details"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6 p-5 sm:p-7">
              <div className="flex flex-col justify-between gap-4 sm:flex-row">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    Patient
                  </p>

                  <h3 className="mt-1 text-lg font-bold text-[#183b3b]">
                    {selectedPrescription.patientName}
                  </h3>

                  <p className="mt-1 break-all text-sm text-gray-500">
                    {selectedPrescription.patientEmail}
                  </p>
                </div>

                <div className="sm:text-right">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    Prescription Date
                  </p>

                  <p className="mt-1 text-sm font-semibold text-gray-700">
                    {selectedPrescription.date}
                  </p>
                </div>
              </div>

              <div className="rounded-xl bg-teal-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#245b5b]">
                  Diagnosis
                </p>

                <p className="mt-2 font-semibold text-[#183b3b]">
                  {selectedPrescription.diagnosis}
                </p>
              </div>

              <div>
                <h3 className="mb-3 flex items-center gap-2 font-bold text-[#183b3b]">
                  <Pill size={19} className="text-[#0B63CE]" />
                  Prescribed Medicines
                </h3>

                {selectedPrescription.medicines.length === 0 ? (
                  <p className="rounded-xl border border-gray-200 p-4 text-sm text-gray-500">
                    No medicines were added to this prescription.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {selectedPrescription.medicines.map(
                      (medicine, index) => (
                        <div
                          key={medicine.id}
                          className="rounded-xl border border-gray-200 p-4"
                        >
                          <div className="mb-3 flex items-center gap-2">
                            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-xs font-bold text-[#0B63CE]">
                              {index + 1}
                            </span>

                            <h4 className="font-semibold text-gray-800">
                              {medicine.name}
                            </h4>
                          </div>

                          <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
                            <div>
                              <p className="text-xs text-gray-400">
                                Dosage
                              </p>
                              <p className="mt-1 font-medium text-gray-700">
                                {medicine.dosage}
                              </p>
                            </div>

                            <div>
                              <p className="text-xs text-gray-400">
                                Frequency
                              </p>
                              <p className="mt-1 font-medium text-gray-700">
                                {medicine.frequency}
                              </p>
                            </div>

                            <div>
                              <p className="text-xs text-gray-400">
                                Duration
                              </p>
                              <p className="mt-1 font-medium text-gray-700">
                                {medicine.duration}
                              </p>
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>

              {selectedPrescription.instructions && (
                <div>
                  <h3 className="mb-2 font-semibold text-[#183b3b]">
                    Additional Instructions
                  </h3>

                  <p className="rounded-xl bg-gray-50 p-4 text-sm leading-6 text-gray-600">
                    {selectedPrescription.instructions}
                  </p>
                </div>
              )}

              <div className="border-t border-dashed border-gray-200 pt-5">
                <p className="text-xs leading-5 text-gray-400">
                  This is a demonstration prescription for the Telemedicine
                  project. In the production version, prescriptions should
                  be issued and verified by an authorized healthcare
                  professional.
                </p>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-gray-100 bg-gray-50 px-5 py-4 sm:flex-row sm:justify-end sm:px-7">
              <button
                type="button"
                onClick={() => setSelectedPrescription(null)}
                className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-100"
              >
                Close
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0B63CE] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0955AE]"
              >
                <Printer size={17} />
                Print Prescription
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Print Styles */}
      <style>
        {`
          @media print {
            body * {
              visibility: hidden !important;
            }

            #prescription-print,
            #prescription-print * {
              visibility: visible !important;
            }

            #prescription-print {
              position: absolute !important;
              left: 0 !important;
              top: 0 !important;
              width: 100% !important;
              max-width: none !important;
              max-height: none !important;
              overflow: visible !important;
              border: none !important;
              border-radius: 0 !important;
              box-shadow: none !important;
            }

            #prescription-print button {
              display: none !important;
            }

            @page {
              size: A4;
              margin: 15mm;
            }
          }
        `}
      </style>
    </div>
  );
}

export default DoctorPrescriptions;
