import heroImage from "../assets/hero.jpg";
import { ArrowRight, CheckCircle } from "lucide-react";

function Hero() {
  return (
    <section className="bg-[#f8faf9] px-3 pt-20 pb-6 sm:px-6 sm:pt-24 sm:pb-10 lg:min-h-screen lg:px-10 lg:pt-28 lg:pb-20">
      <div
        className="
          relative mx-auto flex max-w-7xl items-center overflow-hidden
          rounded-[22px]
          bg-gradient-to-r from-[#410200] via-[#536276] to-[#151b54]
          px-4 py-5 shadow-2xl

          sm:rounded-[30px] sm:px-7 sm:py-8

          lg:min-h-[500px] lg:rounded-[36px] lg:px-16 lg:py-14
        "
      >
        {/* Soft background glow */}
        <div className="absolute -left-20 -top-20 h-60 w-60 rounded-full bg-white/10 blur-3xl" />

        <div className="absolute -bottom-20 right-10 h-60 w-60 rounded-full bg-blue-300/10 blur-3xl" />

        {/* ================= LEFT CONTENT ================= */}
        <div
          className="
            relative z-10
            w-[68%]
            text-left text-white

            sm:w-[62%]

            lg:w-full lg:max-w-xl lg:text-left
          "
        >
          {/* Small badge */}
          <div
            className="
              mb-2 inline-flex items-center gap-1
              rounded-full bg-white/15
              px-2.5 py-1
              text-[9px] font-medium
              backdrop-blur-sm

              sm:mb-3 sm:gap-1.5 sm:px-3 sm:py-1.5 sm:text-[11px]

              lg:mb-5 lg:gap-2 lg:px-4 lg:py-2 lg:text-sm
            "
          >
            <CheckCircle size={11} className="sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4" />

            Trusted Online Healthcare
          </div>

          {/* Heading */}
          <h1
  className="
    text-[22px] font-bold leading-[1.1]

    sm:text-4xl

    lg:text-6xl lg:leading-tight
  "
>
  Your Health,
  <br />

  <span className="text-[#F9A603]">
    Our Expert Care.
  </span>
</h1>

          {/* Description */}
          <p
  className="
    mt-2 max-w-[175px]
    text-[9px] leading-4 text-white/80

    sm:mt-3 sm:max-w-[300px] sm:text-xs sm:leading-5

    lg:mx-0 lg:mt-5 lg:max-w-lg lg:text-base lg:leading-7
  "
>
  Connect with trusted doctors online and get quality care from
  wherever you are.
</p>

          {/* Button */}
          <button
            className="
              mt-3 inline-flex items-center gap-1
              rounded-full bg-white
              px-3.5 py-2
              text-[10px] font-semibold text-[#19304f]
              shadow-lg transition-all duration-300
              hover:-translate-y-1 hover:shadow-xl

              sm:mt-4 sm:gap-1.5 sm:px-5 sm:py-2.5 sm:text-xs

              lg:mt-7 lg:gap-2 lg:px-6 lg:py-3.5 lg:text-sm
            "
          >
            Book Appointment

            <ArrowRight
              size={13}
              className="sm:h-4 sm:w-4 lg:h-[18px] lg:w-[18px]"
            />
          </button>
        </div>

        {/* ================= RIGHT IMAGE ================= */}
        <div
          className="
            absolute
            bottom-0 right-0
            flex w-[42%]
            justify-end

            sm:w-[40%]

            lg:absolute lg:bottom-0 lg:right-8 lg:mt-0 lg:w-[46%]
          "
        >
          <div className="relative">

            {/* Image glow */}
            <div
              className="
                absolute bottom-0 left-1/2
                h-32 w-32
                -translate-x-1/2
                rounded-full bg-white/10 blur-3xl

                sm:h-48 sm:w-48

                lg:h-64 lg:w-64
              "
            />

            {/* Doctor Image */}
            <img
              src={heroImage}
              alt="Professional doctor"
              className="
                relative z-10
                h-[185px] w-[145px]
                object-cover object-top
                rounded-t-[70px]
                rounded-b-[20px]
                shadow-2xl

                sm:h-[280px] sm:w-[230px]
                sm:rounded-t-[100px]
                sm:rounded-b-[25px]

                lg:h-[440px] lg:w-[390px]
                lg:rounded-t-[140px]
                lg:rounded-b-[30px]
              "
            />

            {/* Floating mini card */}
            <div
              className="
                absolute bottom-2 -left-8 z-20
                rounded-lg bg-white/95
                px-2 py-1.5
                shadow-xl
                backdrop-blur-sm

                sm:bottom-4 sm:-left-8 sm:rounded-xl sm:px-3 sm:py-2

                lg:bottom-5 lg:-left-10 lg:rounded-2xl lg:px-4 lg:py-3
              "
            >
              <p className="text-[7px] font-medium text-slate-500 sm:text-[9px] lg:text-xs">
                Available Online
              </p>

              <div className="mt-0.5 flex items-center gap-1 sm:gap-1.5 lg:mt-1 lg:gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 sm:h-2 sm:w-2 lg:h-2.5 lg:w-2.5" />

                <span className="text-[8px] font-semibold text-slate-800 sm:text-[10px] lg:text-sm">
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