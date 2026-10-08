import { Link } from "react-router-dom";
import {
ArrowRight,
Eye,
EyeOff,
LockKeyhole,
ShieldCheck,
Stethoscope,
} from "lucide-react";
import { useState } from "react";

function ResetPassword() {
const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
              Secure Password Reset
            </span>

            <h1 className="mt-6 text-4xl font-bold leading-tight xl:text-5xl">
              Create a new
              <span className="block text-highlight">
                secure password.
              </span>
            </h1>

            <p className="mt-5 text-sm leading-7 text-white/90 xl:text-base">
              Choose a strong password to keep your healthcare account
              and personal information protected.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-sm text-white/80">
          <ShieldCheck size={18} />
          Keep your password private and secure.
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
            <span className="inline-flex rounded-full bg-[#e5f4f2] px-4 py-2 text-sm font-semibold text-[#245b5b]">
              Reset Password
            </span>

            <h2 className="mt-4 text-3xl font-bold text-[#183b3b] sm:text-4xl">
              Create a new password
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Your new password should be strong and different from
              passwords you have used before.
            </p>
          </div>

          {/* Form */}
          <form className="mt-8 space-y-5">

            {/* New Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                New Password
              </label>

              <div className="relative">
                <LockKeyhole
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  className="
                    w-full rounded-xl border border-slate-200
                    bg-slate-50 py-3.5 pl-11 pr-12
                    text-sm text-slate-800
                    outline-none transition
                    placeholder:text-slate-400
                    focus:border-[#536276]
                    focus:bg-white
                    focus:ring-4 focus:ring-[#536276]/10
                  "
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="
                    absolute right-3 top-1/2
                    -translate-y-1/2
                    rounded-lg p-2
                    text-slate-400
                    hover:bg-slate-100
                    hover:text-slate-600
                  "
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
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
                Confirm New Password
              </label>

              <div className="relative">
                <LockKeyhole
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  className="
                    w-full rounded-xl border border-slate-200
                    bg-slate-50 py-3.5 pl-11 pr-12
                    text-sm text-slate-800
                    outline-none transition
                    placeholder:text-slate-400
                    focus:border-[#536276]
                    focus:bg-white
                    focus:ring-4 focus:ring-[#536276]/10
                  "
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="
                    absolute right-3 top-1/2
                    -translate-y-1/2
                    rounded-lg p-2
                    text-slate-400
                    hover:bg-slate-100
                    hover:text-slate-600
                  "
                  aria-label={
                    showConfirmPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>
              </div>
            </div>

            {/* Password Requirements */}
            <div className="rounded-xl bg-[#f3f8f7] p-4">
              <p className="mb-2 text-xs font-semibold text-[#183b3b]">
                Password should contain:
              </p>

              <ul className="space-y-1 text-xs text-slate-500">
                <li>• At least 8 characters</li>
                <li>• At least one uppercase letter</li>
                <li>• At least one number</li>
                <li>• At least one special character</li>
              </ul>
            </div>

            {/* Reset Button */}
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
              Reset Password
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
          <div className="mt-7 flex items-start gap-3 rounded-xl bg-[#f3f8f7] p-4">
            <ShieldCheck
              size={20}
              className="mt-0.5 shrink-0 text-[#245b5b]"
            />

            <p className="text-xs leading-5 text-slate-500">
              After resetting your password, you can sign in using your
              new credentials.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>


);
}

export default ResetPassword;
