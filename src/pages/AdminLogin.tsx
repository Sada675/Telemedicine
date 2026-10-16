import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";

function AdminLogin() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("Admin123");
  const [error, setError] = useState("");

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    // Temporary demo credentials
    if (
      email.trim().toLowerCase() === "admin@example.com" &&
      password === "Admin123"
    ) {
      localStorage.setItem("adminLoggedIn", "true");
      localStorage.setItem("adminName", "Admin");

      navigate("/admin-dashboard");
    } else {
      setError("Invalid admin email or password. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8faf9] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center justify-center">
        <div className="grid w-full grid-cols-1 overflow-hidden rounded-[28px] bg-white shadow-2xl md:grid-cols-2">

          {/* Left Side */}
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
                  Secure Admin Portal
                </span>

                <h1 className="mt-6 text-3xl font-bold leading-tight text-white lg:text-4xl xl:text-5xl">
                  Manage healthcare,
                  <span className="block text-highlight">
                    make a difference.
                  </span>
                </h1>

                <p className="mt-5 text-sm leading-7 text-white/90 xl:text-base">
                  Access your administration dashboard to manage doctors,
                  patients, appointments, and other healthcare services
                  from one secure place.
                </p>
              </div>
            </div>

            <div className="mt-10 flex items-center gap-3 text-sm text-white/80">
              <ShieldCheck size={18} />
              Authorized administrators only.
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
                Telemedicine
              </Link>
            </div>

            <div className="mx-auto max-w-md">

              {/* Heading */}
              <div className="text-center md:text-left">
                <span className="inline-flex rounded-full bg-[#e5f4f2] px-4 py-2 text-sm font-semibold text-[#245b5b]">
                  Administrator Access
                </span>

                <h2 className="mt-4 text-3xl font-bold text-[#183b3b] sm:text-4xl">
                  Admin Sign In
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Sign in to manage your telemedicine platform.
                </p>
              </div>

              {/* Login Form */}
              <form onSubmit={handleLogin} className="mt-8 space-y-5">

                {/* Email */}
                <div>
                  <label
                    htmlFor="admin-email"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Admin Email Address
                  </label>

                  <div className="relative">
                    <Mail
                      size={19}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="admin-email"
                      name="email"
                      type="email"
                      autoComplete="username"
                      placeholder="Enter admin email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      required
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#536276] focus:bg-white focus:ring-4 focus:ring-[#536276]/10"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="admin-password"
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
                      id="admin-password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="Enter admin password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      required
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-12 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#536276] focus:bg-white focus:ring-4 focus:ring-[#536276]/10"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword((previous) => !previous)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
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

                {/* Error Message */}
                {error && (
                  <div
                    role="alert"
                    className="rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-600"
                  >
                    {error}
                  </div>
                )}

                {/* Login Button */}
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-xl btn-dark px-5 py-3.5 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#245b5b] hover:shadow-lg"
                >
                  Sign In to Admin Panel
                  <ArrowRight size={18} />
                </button>
              </form>

              {/* Back to Website */}
              <p className="mt-7 text-center text-sm text-slate-500">
                Not an administrator?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-[#536276] no-underline hover:text-[#172b4d]"
                >
                  Patient Login
                </Link>
              </p>

              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
