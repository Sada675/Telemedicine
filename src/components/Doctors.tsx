import { useEffect, useState } from "react";
import {
  CalendarDays,
  Clock3,
  ShieldCheck,
} from "lucide-react";

import drMunib from "../assets/dr-munib121.jpg";
import ladyDoc from "../assets/lady-doc.jpg";

const STORAGE_KEY = "telemedicineAdminDoctors";

type Doctor = {
  id: string;
  name: string;
  specialty: string;
  qualification: string;
  pmdcNumber: string;
  languages: string[];
  feePKR: number;
  feeUSD: number;
  nextAvailableSlot: string;
  status: "Active" | "Inactive";
  image: string;
};

const defaultDoctors: Doctor[] = [
  {
    id: "munib",
    name: "Dr. Munib",
    specialty: "Medical Specialist",
    qualification: "MBBS, FCPS",
    pmdcNumber: "XXXXX-M",
    languages: ["English", "Urdu"],
    feePKR: 3000,
    feeUSD: 25,
    nextAvailableSlot: "Today • 04:00 PM",
    status: "Active",
    image: drMunib,
  },
  {
    id: "nazli",
    name: "Dr. Nazli",
    specialty: "Medical Specialist",
    qualification: "MBBS, FCPS",
    pmdcNumber: "XXXXX-N",
    languages: ["English", "Urdu"],
    feePKR: 3000,
    feeUSD: 25,
    nextAvailableSlot: "Tomorrow • 11:00 AM",
    status: "Active",
    image: ladyDoc,
  },
];

// Admin ka saved data load karein.
// Agar saved data available nahi hai to default data use hoga.
function getDoctors(): Doctor[] {
  try {
    const savedData = localStorage.getItem(STORAGE_KEY);

    if (!savedData) {
      return defaultDoctors;
    }

    const savedDoctors: unknown = JSON.parse(savedData);

    if (!Array.isArray(savedDoctors)) {
      return defaultDoctors;
    }

    // Default doctors ko base rakhein.
    // Admin ki saved information available ho to usay use karein.
    return defaultDoctors.map((defaultDoctor) => {
      const savedDoctor = savedDoctors.find(
        (doctor: Partial<Doctor>) =>
          doctor &&
          String(doctor.id) === defaultDoctor.id
      ) as Partial<Doctor> | undefined;

      if (!savedDoctor) {
        return defaultDoctor;
      }

      const validLanguages =
        Array.isArray(savedDoctor.languages) &&
        savedDoctor.languages.every(
          (language) => typeof language === "string"
        )
          ? savedDoctor.languages
          : defaultDoctor.languages;

      const savedImage =
        typeof savedDoctor.image === "string"
          ? savedDoctor.image.trim()
          : "";

      const validImage =
        savedImage.startsWith("data:image/") ||
        savedImage.startsWith("https://") ||
        savedImage.startsWith("http://");

      return {
        ...defaultDoctor,
        ...savedDoctor,

        // Empty name ya specialty ki surat mein defaults use hon.
        name:
          typeof savedDoctor.name === "string" &&
          savedDoctor.name.trim()
            ? savedDoctor.name
            : defaultDoctor.name,

        specialty:
          typeof savedDoctor.specialty === "string" &&
          savedDoctor.specialty.trim()
            ? savedDoctor.specialty
            : defaultDoctor.specialty,

        qualification:
          typeof savedDoctor.qualification === "string" &&
          savedDoctor.qualification.trim()
            ? savedDoctor.qualification
            : defaultDoctor.qualification,

        pmdcNumber:
          typeof savedDoctor.pmdcNumber === "string" &&
          savedDoctor.pmdcNumber.trim()
            ? savedDoctor.pmdcNumber
            : defaultDoctor.pmdcNumber,

        languages: validLanguages,

        feePKR:
          typeof savedDoctor.feePKR === "number" &&
          Number.isFinite(savedDoctor.feePKR)
            ? savedDoctor.feePKR
            : defaultDoctor.feePKR,

        feeUSD:
          typeof savedDoctor.feeUSD === "number" &&
          Number.isFinite(savedDoctor.feeUSD)
            ? savedDoctor.feeUSD
            : defaultDoctor.feeUSD,

        nextAvailableSlot:
          typeof savedDoctor.nextAvailableSlot === "string" &&
          savedDoctor.nextAvailableSlot.trim()
            ? savedDoctor.nextAvailableSlot
            : defaultDoctor.nextAvailableSlot,

        status:
          savedDoctor.status === "Active" ||
          savedDoctor.status === "Inactive"
            ? savedDoctor.status
            : defaultDoctor.status,

        // Agar admin ki image available nahi hai,
        // to imported default image use hogi.
        image: validImage
          ? savedImage
          : defaultDoctor.image,
      };
    });
  } catch (error) {
    console.error("Unable to load doctors:", error);
    return defaultDoctors;
  }
}

function Doctors() {
  const [doctors, setDoctors] = useState<Doctor[]>(getDoctors);

  useEffect(() => {
    const updateDoctors = () => {
      setDoctors(getDoctors());
    };

    // Initial load par latest saved data check karein.
    updateDoctors();

    // Doosre browser tabs se changes detect karein.
    window.addEventListener("storage", updateDoctors);

    // Isi tab mein admin ke save karne par update karein.
    window.addEventListener("doctorsUpdated", updateDoctors);

    return () => {
      window.removeEventListener("storage", updateDoctors);
      window.removeEventListener("doctorsUpdated", updateDoctors);
    };
  }, []);

  const handleBookAppointment = (doctor: Doctor) => {
    if (doctor.status !== "Active") {
      return;
    }

    window.location.href = `/book/${doctor.id}`;
  };

  const activeDoctors = doctors.filter(
    (doctor) => doctor.status === "Active"
  );

  return (
    <section
      id="doctors"
      className="bg-[#f8faf9] px-4 pt-4 pb-16 sm:px-6 sm:pt-8 lg:px-10 lg:pt-0 lg:pb-10"
    >
      <div className="mx-auto max-w-6xl">
        {/* Section Heading */}
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <span className="inline-flex rounded-full bg-[#e5f4f2] px-4 py-2 text-sm font-semibold text-[#245b5b]">
            Our Doctors
          </span>

          <h2 className="mt-4 text-3xl font-bold text-[#183b3b] sm:text-4xl">
            Meet Our{" "}
            <span className="text-golden">Expert Doctors</span>
          </h2>

          <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
            Connect with our qualified doctors and receive trusted medical
            care from anywhere in the world.
          </p>
        </div>

        {/* Doctors */}
        <div className="grid gap-7 md:grid-cols-2">
          {activeDoctors.map((doctor) => (
            <div
              key={doctor.id}
              className="
                group overflow-hidden rounded-[26px]
                border border-slate-200
                bg-white
                shadow-sm
                transition-all duration-300
                hover:-translate-y-1
                hover:shadow-xl
              "
            >
              {/* IMAGE */}
              <div className="relative h-[280px] overflow-hidden bg-[#e5f1ef]">
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  onError={(event) => {
                    const fallbackImage =
                      doctor.id === "nazli" ? ladyDoc : drMunib;

                    if (event.currentTarget.src !== fallbackImage) {
                      event.currentTarget.src = fallbackImage;
                    }
                  }}
                  className="
                    h-full w-full object-cover object-top
                    transition-transform duration-500
                    group-hover:scale-105
                  "
                />

                {/* Online Badge */}
                <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-md backdrop-blur-sm">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Available Online
                </div>
              </div>

              {/* INFORMATION */}
              <div className="p-5 sm:p-6">
                {/* Name */}
                <div>
                  <p className="text-xs font-semibold text-[#2d7775]">
                    {doctor.specialty}
                  </p>

                  <h3 className="mt-1 text-xl font-bold text-[#183b3b]">
                    {doctor.name}
                  </h3>
                </div>

                {/* Information Cards */}
                <div className="mt-4 grid grid-cols-2 gap-2.5">
                  {/* Qualification */}
                  <div className="rounded-xl bg-[#f6f9f8] p-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                      Qualification
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-700">
                      {doctor.qualification}
                    </p>
                  </div>

                  {/* PMDC */}
                  <div className="rounded-xl bg-[#f6f9f8] p-3">
                    <div className="flex items-center gap-1.5">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                        PMDC Number
                      </p>

                      <ShieldCheck
                        size={14}
                        className="text-emerald-500"
                      />
                    </div>

                    <p className="mt-1 text-sm font-semibold text-slate-700">
                      PMDC: {doctor.pmdcNumber}
                    </p>
                  </div>

                  {/* Languages */}
                  <div className="col-span-2 flex items-center gap-3 rounded-2xl bg-[#f6f9f8] p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center gap-0.5 rounded-full bg-[#e5f4f2] text-[#245b5b]">
                      <span className="text-sm font-bold">A</span>
                      <span className="text-base font-bold">ی</span>
                    </div>

                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                        Languages
                      </p>

                      <p className="mt-1 text-sm font-semibold text-slate-700">
                        {doctor.languages.join(", ")}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Consultation Fee */}
                <div className="mt-3 rounded-xl bg-gradient-to-r from-[#eef8f6] to-[#f4f6fb] p-3.5">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                    Consultation Fee
                  </p>

                  <div className="mt-1.5 flex items-center justify-between">
                    <div>
                      <p className="text-[11px] text-slate-400">
                        Pakistan
                      </p>

                      <p className="text-base font-bold text-[#245b5b]">
                        PKR {doctor.feePKR.toLocaleString("en-PK")}
                      </p>
                    </div>

                    <div className="h-8 w-px bg-slate-200" />

                    <div>
                      <p className="text-[11px] text-slate-400">
                        International
                      </p>

                      <p className="text-base font-bold text-[#245b5b]">
                        ${doctor.feeUSD}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Next Available Slot */}
                <div className="mt-3 flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-3.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e5f4f2] text-[#245b5b]">
                    <Clock3 size={17} />
                  </div>

                  <div>
                    <p className="text-[11px] text-slate-400">
                      Next Available Slot
                    </p>

                    <p className="mt-0.5 text-sm font-semibold text-slate-700">
                      {doctor.nextAvailableSlot}
                    </p>
                  </div>
                </div>

                {/* Book Appointment Button */}
                <div className="mt-4 flex justify-center">
                  <button
                    type="button"
                    onClick={() => handleBookAppointment(doctor)}
                    className="
                      inline-flex items-center justify-center
                      gap-2 rounded-full
                      btn-dark
                      px-7 py-3
                      text-sm font-semibold
                      text-white
                      shadow-md
                      transition-all
                      hover:-translate-y-0.5
                      hover:shadow-lg
                    "
                  >
                    <CalendarDays size={17} />
                    Book Appointment
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No active doctors */}
        {activeDoctors.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
            <h3 className="text-lg font-semibold text-[#183b3b]">
              No doctors currently available
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Please check again later.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export default Doctors;
