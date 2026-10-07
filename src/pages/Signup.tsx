import { Link } from "react-router-dom";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Stethoscope,
  User,
} from "lucide-react";
import { useState } from "react";

function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="min-h-screen bg-[#f8faf9] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center justify-center">
        {/* CHANGED: grid-cols-1 md:grid-cols-2 */}
        <div className="grid w-full grid-cols-1 overflow-hidden rounded-[28px] bg-white shadow-2xl md:grid-cols-2">
          
          {/* Left Side */}
          {/* CHANGED: hidden md:flex instead of hidden lg:flex */}
          <div className="hidden bg-gradient-to-br from-[#410200] via-[#536276] to-[#151b54] p-8 text-white md:flex md:flex-col md:justify-between lg:p-10 xl:p-14">
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

              <div className="mt-14 max-w-md xl:mt-20">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium backdrop-blur-sm">
                  <ShieldCheck size={17} />
                  Your Health, Our Priority
                </span>

                <h1 className="mt-6 text-3xl font-bold text-white leading-tight lg:text-4xl xl:text-5xl">
                  Start your journey
                  <span className="block text-highlight">
                    to better healthcare.
                  </span>
                </h1>

                <p className="mt-5 text-sm leading-7 text-white/90 xl:text-base">
                  Create your patient account and connect with qualified
                  doctors for secure online medical consultations.
                </p>
              </div>
            </div>

            <div className="mt-10 flex items-center gap-3 text-sm text-white/80">
              <ShieldCheck size={18} />
              Your personal information is kept secure and private.
            </div>
          </div>

          {/* Right Side */}
          <div className="p-6 sm:p-10 lg:p-12 xl:p-14">
            {/* Mobile Logo */}
            <div className="mb-8 flex justify-center md:hidden">
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
              <div className="text-center md:text-left">
                <span className="inline-flex rounded-full bg-[#e5f4f2] px-4 py-2 text-sm font-semibold text-[#245b5b]">
                  Patient Registration
                </span>

                <h2 className="mt-4 text-3xl font-bold text-[#183b3b] sm:text-4xl">
                  Create your account
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Sign up to book appointments and manage your healthcare
                  online.
                </p>
              </div>

              <form className="mt-7 space-y-4">
                {/* Full Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Full Name
                  </label>

                  <div className="relative">
                    <User
                      size={19}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#536276] focus:bg-white focus:ring-4 focus:ring-[#536276]/10"
                    />
                  </div>
                </div>

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
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#536276] focus:bg-white focus:ring-4 focus:ring-[#536276]/10"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Password
                  </label>

                  <div className="relative">
                    <LockKeyhole
                      size={19}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-12 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#536276] focus:bg-white focus:ring-4 focus:ring-[#536276]/10"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                    >
                      {showPassword ? (
                        <EyeOff size={19} />
                      ) : (
                        <Eye size={19} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Confirm Password
                  </label>

                  <div className="relative">
                    <LockKeyhole
                      size={19}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-12 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#536276] focus:bg-white focus:ring-4 focus:ring-[#536276]/10"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={19} />
                      ) : (
                        <Eye size={19} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Terms */}
                <label className="flex cursor-pointer items-start gap-3 pt-1">
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 rounded border-slate-300 accent-[#245b5b]"
                  />

                  <span className="text-xs leading-5 text-slate-500">
                    I agree to the{" "}
                    <Link
                      to="/terms"
                      className="font-semibold text-[#536276] no-underline"
                    >
                      Terms & Conditions
                    </Link>{" "}
                    and{" "}
                    <Link
                      to="/privacy"
                      className="font-semibold text-[#536276] no-underline"
                    >
                      Privacy Policy
                    </Link>
                    .
                  </span>
                </label>

                {/* Create Account */}
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-xl btn-dark px-5 py-3.5 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#245b5b] hover:shadow-lg"
                >
                  Create Patient Account
                  <ArrowRight size={18} />
                </button>
              </form>

              {/* Login Link */}
              <p className="mt-6 text-center text-sm text-slate-500">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-black/70 no-underline hover:text-[#172b4d]"
                >
                  Sign In
                </Link>
              </p>

              {/* Security Note */}
              <div className="mt-7 flex items-start gap-3 rounded-xl bg-[#f3f8f7] p-4">
                <ShieldCheck
                  size={20}
                  className="mt-0.5 shrink-0 text-[#245b5b]"
                />

                <p className="text-xs leading-5 text-slate-500">
                  After registration, you will verify your email using a
                  one-time verification code.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;