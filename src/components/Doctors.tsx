
import {
  ArrowRight,
  CalendarDays,
  Clock3,
  ShieldCheck,
} from "lucide-react";

import drMunib from "../assets/dr-munib.jpg"; 
import drNazli123 from "../assets/dr-nazli123.jpg";

const doctors = [
  {
    name: "Dr. Munib",
    specialty: "Medical Specialist",
    qualifications: "MBBS, FCPS",
    pmdc: "PMDC: XXXXX-M",
    languages: "English, Urdu",
    feePKR: "PKR 3,000",
    feeUSD: "$25",
    nextSlot: "Today • 04:00 PM",
    image: drMunib,
  },
  {
    name: "Dr. Nazli",
    specialty: "Medical Specialist",
    qualifications: "MBBS, FCPS",
    pmdc: "PMDC: XXXXX-N",
    languages: "English, Urdu",
    feePKR: "PKR 3,000",
    feeUSD: "$25",
    nextSlot: "Tomorrow • 11:00 AM",
    image: drNazli123,
  },
];

function Doctors() {
  return (
    <section
      id="doctors"
      className="bg-[#f8faf9] px-4 py-16 sm:px-6 lg:px-10 lg:py-20"
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
          {doctors.map((doctor) => (
            <div
              key={doctor.name}
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
              {/* ================= IMAGE ================= */}
              <div className="relative h-[280px] overflow-hidden bg-[#e5f1ef]">
                <img
                  src={doctor.image}
                  alt={doctor.name}
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

              {/* ================= INFORMATION ================= */}
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

                {/* Small Information Cards */}
                <div className="mt-4 grid grid-cols-2 gap-2.5">

                  {/* Qualification */}
                  <div className="rounded-xl bg-[#f6f9f8] p-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                      Qualification
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-700">
                      {doctor.qualifications}
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
                      {doctor.pmdc}
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
                        {doctor.languages}
                      </p>
                    </div>
                  </div>

                </div>
                {/* END Small Information Cards */}


                {/* Fee */}
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
                        {doctor.feePKR}
                      </p>
                    </div>

                    <div className="h-8 w-px bg-slate-200" />

                    <div>
                      <p className="text-[11px] text-slate-400">
                        International
                      </p>

                      <p className="text-base font-bold text-[#245b5b]">
                        {doctor.feeUSD}
                      </p>
                    </div>

                  </div>
                </div>


                {/* Next Slot */}
                <div className="mt-3 flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-3.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e5f4f2] text-[#245b5b]">
                    <Clock3 size={17} />
                  </div>

                  <div>
                    <p className="text-[11px] text-slate-400">
                      Next Available Slot
                    </p>

                    <p className="mt-0.5 text-sm font-semibold text-slate-700">
                      {doctor.nextSlot}
                    </p>
                  </div>
                </div>


                {/* Buttons */}
                <div className="mt-4 grid grid-cols-2 gap-2.5">

                  <button
                    className="
                      inline-flex items-center justify-center
                      gap-1.5 rounded-full
                      border border-[#245b5b]
                      px-3 py-2.5
                      text-sm font-semibold
                      text-[#245b5b]
                      transition-all
                      btn-light
                    "
                  >
                    View Details
                    <ArrowRight size={15} />
                  </button>

                  <button
                    className="
                      inline-flex items-center justify-center
                      gap-1.5 rounded-full
                      btn-dark
                      px-3 py-2.5
                      text-sm font-semibold
                      text-white
                      shadow-md
                      transition-all
                    "
                  >
                    <CalendarDays size={16} />
                    Book
                  </button>

                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default Doctors;
