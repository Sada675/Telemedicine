import {
  CalendarDays,
  CheckCircle2,
  CreditCard,
  Stethoscope,
  Video,
} from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Stethoscope,
    title: "Choose Your Doctor",
    description:
      "Explore our qualified doctors and choose the specialist who best matches your healthcare needs.",
  },
  {
    number: "02",
    icon: CalendarDays,
    title: "Select a Time Slot",
    description:
      "View available appointment slots and select a convenient date and time for your consultation.",
  },
  {
    number: "03",
    icon: CreditCard,
    title: "Pay Securely",
    description:
      "Complete your payment securely through our trusted payment checkout before your appointment.",
  },
  {
    number: "04",
    icon: Video,
    title: "Meet Your Doctor",
    description:
      "Join your private video consultation and speak directly with your doctor from anywhere.",
  },
];

function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="bg-[#f8faf9] px-4 py-16 sm:px-6 lg:px-10 lg:py-0"
    >
      <div className="mx-auto max-w-6xl">

        {/* Heading */}
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="inline-flex rounded-full bg-[#e5f4f2] px-4 py-2 text-sm font-semibold text-[#245b5b]">
            How It Works
          </span>

          <h2 className="mt-4 text-3xl font-bold leading-tight text-[#183b3b] sm:text-4xl">
            Get Medical Care in{" "}
            <span className="text-highlight">4 Simple Steps</span>
          </h2>

          <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
            From choosing your doctor to joining your consultation, we make
            online healthcare simple and convenient.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">

          {/* Connecting Line - Desktop */}
          <div className="absolute left-[12.5%] right-[12.5%] top-[58px] hidden h-px bg-[#cfe5e2] lg:block" />

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.number}
                  className="
                    group relative
                    rounded-[26px]
                    border border-slate-100
                    bg-white
                    p-6
                    text-center
                    shadow-sm
                    transition-all duration-300
                    hover:-translate-y-1
                    hover:shadow-xl
                  "
                >
                  {/* Number + Icon */}
                  <div className="relative z-10 mx-auto flex h-20 w-20 items-center justify-center">
                    <div
                      className="
                        flex h-16 w-16 items-center justify-center
                        rounded-full
                        border-4 border-white
                        btn-dark
                        text-white
                        shadow-lg
                        transition-all duration-300
                        group-hover:scale-105
                        group-hover:bg-[#183f3f]
                      "
                    >
                      <Icon size={25} strokeWidth={1.8} />
                    </div>

                    <span
                      className="
                        absolute right-0 top-0
                        flex h-7 w-7 items-center justify-center
                        rounded-full
                        bg-[#d9efeb]
                        text-[10px]
                        font-bold
                        text-[#245b5b]
                        ring-4 ring-white
                      "
                    >
                      {step.number}
                    </span>
                  </div>

                  {/* Content */}
                  <h3 className="mt-5 text-lg font-bold text-[#183b3b]">
                    {step.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Trust Card */}
        <div
          className="
            mt-10 flex flex-col items-center
            justify-center gap-3
            rounded-[24px]
            border border-[#dcefeb]
            bg-white
            px-6 py-5
            text-center
            shadow-sm
            sm:flex-row
          "
        >
          <CheckCircle2
            size={22}
            className="shrink-0 text-emerald-500"
          />

          <p className="text-sm font-medium text-slate-600">
            Your appointment, payment and consultation are handled through a
            secure healthcare experience.
          </p>
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
