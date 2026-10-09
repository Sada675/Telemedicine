import service1 from "../assets/service-1.jpg";
import service2 from "../assets/service-2.jpg";
import service3 from "../assets/service-3.jpg";
import service4 from "../assets/service-4.jpg";
import service5 from "../assets/service-5.jpg";
import service6 from "../assets/service-6.jpg";

import {
  Activity,
  Droplets,
  HeartPulse,
  Scan,
  Stethoscope,
  UserRoundCheck,
} from "lucide-react";

const services = [
  {
    title: "Acid Base Disbalance",
    description:
      "Diagnosis and management of acid-base imbalances and related health conditions.",
    image:
      service1,
    icon: Activity,
  },
  {
    title: "Acute Kidney Injury",
    description:
      "Expert evaluation and management of sudden kidney function problems.",
    image:
      service2,
    icon: Scan,
  },
  {
    title: "Chronic Ambulatory Peritoneal Dialysis",
    description:
      "Specialized care and guidance for patients receiving peritoneal dialysis.",
    image:
      service3,
    icon: Droplets,
  },
  {
    title: "Chronic Kidney Disease",
    description:
      "Comprehensive management and ongoing care for chronic kidney disease.",
    image:
      service4,
    icon: HeartPulse,
  },
  {
    title: "Diabetes Management",
    description:
      "Personalized diabetes care to help manage blood sugar and prevent complications.",
    image:
      service5,
    icon: Stethoscope,
  },
  {
    title: "Kidney Health Consultation",
    description:
      "Personalized consultation and guidance for maintaining better kidney health.",
    image:
      service6,
    icon: UserRoundCheck,
  },
];

function Services() {
  return (
    <section id="services" className="bg-[#f8faf9] px-4 pt-4 pb-16 sm:px-6 sm:pt-8 lg:px-10 lg:pt-0 lg:pb-10">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">

        {/* Section Heading */}
        <div className="mx-auto mb-14 max-w-2xl text-center">
         <span className="inline-flex rounded-full bg-[#e5f4f2] px-4 py-2 text-sm font-semibold text-[#245b5b]">
            Our Services
          </span>

          <h2 className="text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">
            Specialized Care for Your{" "}
            <span className="text-highlight">Health Needs</span>
          </h2>

          <p className="mt-4 leading-7 text-slate-600">
            Professional medical care and specialized treatment focused on
            kidney health, diabetes management, and related conditions.
          </p>
        </div>

        {/* Service Cards */}
        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => {
            const Icon = service.icon;

            return (
              <div
                key={service.title}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-blue-100 hover:shadow-xl"
              >
                {/* Image */}
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Image Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent" />

                  {/* Number */}
                  <span className="absolute left-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-xs font-bold text-[#0B63CE] shadow-sm">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  {/* Icon */}
                  <div className="absolute bottom-4 left-5 flex h-12 w-12 items-center justify-center rounded-xl bg-white text-[#0B63CE] shadow-md transition-all duration-300 group-hover:bg-[#0B63CE] group-hover:text-white">
                    <Icon size={23} strokeWidth={1.8} />
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6">
                  <h3 className="mb-3 text-xl font-bold leading-snug text-slate-900 transition-colors duration-300 group-hover:text-[#0B63CE]">
                    {service.title}
                  </h3>

                  <p className="text-sm leading-6 text-slate-600">
                    {service.description}
                  </p>

                  {/* Bottom Accent */}
                  <div className="mt-6 flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#F9A603]" />

                    <span className="text-sm font-semibold text-[#0B63CE]">
                      Specialized Care
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Services;
