import { Link } from "react-router-dom";
import {
ArrowRight,
Mail,
ShieldCheck,
Stethoscope,
} from "lucide-react";

function ForgotPassword() {
return ( <div className="min-h-screen bg-[#f8faf9] px-4 py-8 sm:px-6 lg:px-8"> <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center justify-center"> <div className="grid w-full overflow-hidden rounded-[28px] bg-white shadow-2xl lg:grid-cols-2">


      {/* Left Side */}
      <div className="hidden bg-gradient-to-br from-[#410200] via-[#536276] to-[#151b54] p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-14">
        <div>
          <Link
            to="/"
            className="inline-flex items-center gap-3 text-xl font-bold text-white no-underline"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
              <Stethoscope size={24} />
            </span>
            Telemedicine
          </Link>

          <div className="mt-20 max-w-md">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium backdrop-blur-sm">
              <ShieldCheck size={17} />
              Account Recovery
            </span>

            <h1 className="mt-6 text-4xl font-bold leading-tight xl:text-5xl">
              Get back to your
              <span className="block text-highlight">
                healthcare account.
              </span>
            </h1>

            <p className="mt-5 text-sm leading-7 text-white/90 xl:text-base">
              Don't worry if you forgot your password. We will help you
              securely recover your account.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-sm text-white/80">
          <ShieldCheck size={18} />
          Your account information remains secure.
        </div>
      </div>

      {/* Right Side */}
      <div className="p-6 sm:p-10 lg:p-12 xl:p-14">

        {/* Mobile Logo */}
        <div className="mb-8 flex justify-center lg:hidden">
          <Link
            to="/"
            className="inline-flex items-center gap-3 text-xl font-bold text-[#183b3b] no-underline"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e5f4f2] text-[#245b5b]">
              <Stethoscope size={24} />
            </span>
            HealthCare
          </Link>
        </div>

        <div className="mx-auto max-w-md">

          {/* Heading */}
          <div className="text-center lg:text-left">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#e5f4f2] text-[#245b5b] lg:mx-0">
              <Mail size={30} />
            </div>

            <span className="inline-flex rounded-full bg-[#e5f4f2] px-4 py-2 text-sm font-semibold text-[#245b5b]">
              Password Recovery
            </span>

            <h2 className="mt-4 text-3xl font-bold text-[#183b3b] sm:text-4xl">
              Forgot your password?
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Enter the email address associated with your account and
              we'll send you a verification code.
            </p>
          </div>

          {/* Form */}
          <form className="mt-8 space-y-5">

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Email Address
              </label>

              <div className="relative">
                <Mail
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="
                    w-full rounded-xl border border-slate-200
                    bg-slate-50 py-3.5 pl-11 pr-4
                    text-sm text-slate-800
                    outline-none transition
                    placeholder:text-slate-400
                    focus:border-[#536276]
                    focus:bg-white
                    focus:ring-4 focus:ring-[#536276]/10
                  "
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="
                flex w-full items-center justify-center gap-2
                rounded-xl
                btn-dark
                px-5 py-3.5
                text-sm font-semibold text-white
                shadow-md
                transition-all duration-300
                hover:-translate-y-0.5
                hover:bg-[#245b5b]
                hover:shadow-lg
              "
            >
              Send Verification Code
              <ArrowRight size={18} />
            </button>
          </form>

          {/* Back to Login */}
          <div className="mt-7 text-center">
            <Link
              to="/login"
              className="text-sm font-semibold text-[#536276] no-underline hover:text-[#172b4d]"
            >
              ← Back to Sign In
            </Link>
          </div>

          {/* Security Note */}
          <div className="mt-8 flex items-start gap-3 rounded-xl bg-[#f3f8f7] p-4">
            <ShieldCheck
              size={20}
              className="mt-0.5 shrink-0 text-[#245b5b]"
            />

            <p className="text-xs leading-5 text-slate-500">
              If the email belongs to an account, a verification code
              will be sent to that address.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>


);
}

export default ForgotPassword;
