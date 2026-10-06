
import { ArrowRight, CheckCircle } from "lucide-react";

function Hero() {
  return (
    <section className="min-h-screen bg-[#f8faf9] px-4 pt-28 pb-10 sm:px-6 lg:px-10">
      <div
        className="
          relative mx-auto flex max-w-7xl items-center overflow-hidden
          rounded-[28px] 
          bg-gradient-to-r from-[#410200] via-[#536276] to-[#151b54]
          px-6 py-10 shadow-2xl
          sm:rounded-[36px] sm:px-10 sm:py-12
          lg:min-h-[500px] lg:px-16 lg:py-14
        "
      >
        {/* Soft background glow */}
        <div className="absolute -left-20 -top-20 h-60 w-60 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-20 right-10 h-60 w-60 rounded-full bg-blue-300/10 blur-3xl" />

        {/* LEFT CONTENT */}
        <div className="relative z-10 w-full max-w-xl text-white">
          {/* Small badge */}
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium backdrop-blur-sm">
            <CheckCircle size={16} />
            Trusted Online Healthcare
          </div>

          {/* Heading */}
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            Your Health,
            <br />
            <span className="text-[#F9A603]">Our Expert Care.</span>
          </h1>

          {/* Description */}
          <p className="mt-5 max-w-lg text-sm leading-7 text-white/80 sm:text-base">
            Connect with trusted doctors online and get quality care from
            wherever you are.
          </p>

          {/* Button */}
          <button
            className="
              mt-7 inline-flex items-center gap-2 rounded-full
              bg-white px-6 py-3.5
              text-sm font-semibold text-[#19304f]
              shadow-lg transition-all duration-300
              hover:-translate-y-1 hover:shadow-xl
            "
          >
            Book Appointment
            <ArrowRight size={18} />
          </button>
        </div>

        {/* RIGHT IMAGE */}
        <div className="relative mt-10 flex w-full justify-center lg:absolute lg:bottom-0 lg:right-8 lg:mt-0 lg:w-[46%]">
          <div className="relative">
            {/* Image glow */}
            <div className="absolute bottom-0 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />

            <img
              src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=700&q=85"
              alt="Professional doctor"
              className="
                relative z-10
                h-[300px] w-[280px]
                object-cover object-top
                rounded-t-[140px]
                rounded-b-[30px]
                shadow-2xl
                sm:h-[360px] sm:w-[330px]
                lg:h-[440px] lg:w-[390px]
              "
            />

            {/* Floating mini card */}
            <div
              className="
                absolute bottom-5 -left-5 z-20
                rounded-2xl bg-white/95
                px-4 py-3 shadow-xl
                backdrop-blur-sm
                sm:-left-10
              "
            >
              <p className="text-xs font-medium text-slate-500">
                Available Online
              </p>

              <div className="mt-1 flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                <span className="text-sm font-semibold text-slate-800">
                  Expert Doctors
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
