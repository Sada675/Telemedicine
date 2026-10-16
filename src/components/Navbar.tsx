import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import drMunibImage from "../assets/dr-munib121.jpg";

import {
  Menu,
  X,
  Phone,
  ChevronDown,
  UserRound,
  CalendarDays,
  FileText,
  LogOut,
  Bell,
  LayoutDashboard,
} from "lucide-react";

const PATIENT_PROFILE_KEY = "telemedicinePatientProfile";
const DOCTOR_PROFILE_KEY = "telemedicineDoctorProfile";

const ADMIN_DOCTORS_KEY = "telemedicineAdminDoctors";

type AdminDoctor = {
  id?: string | number;
  name?: string;
  image?: string;
  specialty?: string;
  status?: string;
};

type SavedProfile = {
  fullName?: string;
  profilePicture?: string;
};

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  const [isLoggedIn, setIsLoggedIn] = useState(
    () => localStorage.getItem("isLoggedIn") === "true"
  );

  const [userName, setUserName] = useState(
    () => localStorage.getItem("userName") || "Sadaye Noor"
  );

  const [profilePicture, setProfilePicture] = useState(() => {
  const role = (
    localStorage.getItem("userRole") || "patient"
  ).toLowerCase();

  return role === "doctor" ? drMunibImage : "";
});

  const desktopProfileRef = useRef<HTMLDivElement>(null);
  const mobileProfileRef = useRef<HTMLDivElement>(null);
  const desktopLoginRef = useRef<HTMLDivElement>(null);
  const mobileLoginRef = useRef<HTMLDivElement>(null);

  const location = useLocation();
  const navigate = useNavigate();

  // ----------------------------------
  // Current user role
  // ----------------------------------
  const userRole = (
    localStorage.getItem("userRole") || "patient"
  ).toLowerCase();

  const isDoctor = userRole === "doctor";
  const isAdmin = userRole === "admin";

  const roleLabel = isDoctor
    ? "Doctor"
    : isAdmin
      ? "Admin"
      : "Patient";

  // ----------------------------------
  // Synchronize authentication and profile
  // ----------------------------------
  const syncAuthState = useCallback(() => {
const loggedIn = localStorage.getItem("isLoggedIn") === "true";

const role = (
  localStorage.getItem("userRole") || "patient"
).toLowerCase();

setIsLoggedIn(loggedIn);

const profileKey =
  role === "doctor"
    ? DOCTOR_PROFILE_KEY
    : PATIENT_PROFILE_KEY;

const defaultName =
  role === "doctor"
    ? "Dr. Munib"
    : role === "admin"
      ? "Admin"
      : "Sadaye Noor";

// Default profile values
let updatedName =
  localStorage.getItem("userName") || defaultName;

let updatedPicture =
  role === "doctor" ? drMunibImage : "";

// Read admin-managed doctor data
if (role === "doctor") {
  try {
    const storedDoctors = localStorage.getItem(ADMIN_DOCTORS_KEY);

    if (storedDoctors) {
      const doctors: AdminDoctor[] = JSON.parse(storedDoctors);

      if (Array.isArray(doctors)) {
        const managedDoctor = doctors.find((doctor) => {
          const doctorName = doctor.name?.toLowerCase() || "";
          const doctorId = String(doctor.id || "").toLowerCase();

          return (
            doctorId === "munib" ||
            doctorName.includes("munib")
          );
        });

        if (managedDoctor) {
          updatedName =
            managedDoctor.name?.trim() || defaultName;

          updatedPicture =
            managedDoctor.image?.trim() || drMunibImage;
        }
      }
    }
  } catch (error) {
    console.error("Unable to load admin-managed doctor:", error);
  }
}

// Read the user's saved profile
try {
  const savedProfile = localStorage.getItem(profileKey);

  if (savedProfile) {
    const parsedProfile: SavedProfile = JSON.parse(savedProfile);

    // For patients, continue using their personal profile.
    // For doctors, admin-managed details take priority.
    if (role !== "doctor") {
      updatedName =
        parsedProfile.fullName?.trim() ||
        updatedName;

      updatedPicture =
        parsedProfile.profilePicture?.trim() || "";
    }
  }
} catch (error) {
  console.error("Unable to synchronize profile:", error);
}

setUserName(updatedName);
setProfilePicture(updatedPicture);

if (localStorage.getItem("userName") !== updatedName) {
  localStorage.setItem("userName", updatedName);
}

if (!loggedIn) {
  setProfileOpen(false);
}

}, []);


  // ----------------------------------
  // Listen for login and profile changes
  // ----------------------------------
  useEffect(() => {
    syncAuthState();

    window.addEventListener("authChange", syncAuthState);
    window.addEventListener("profileUpdate", syncAuthState);
    window.addEventListener("storage", syncAuthState);

    return () => {
      window.removeEventListener("authChange", syncAuthState);
      window.removeEventListener("profileUpdate", syncAuthState);
      window.removeEventListener("storage", syncAuthState);
    };
  }, [syncAuthState, location.pathname]);

  // ----------------------------------
  // Close menus
  // ----------------------------------
  const closeMenus = useCallback(() => {
    setMenuOpen(false);
    setProfileOpen(false);
    setLoginOpen(false);
  }, []);

  // ----------------------------------
  // Go to Home
  // ----------------------------------
  const goToHome = () => {
    closeMenus();
    setActiveSection("");

    if (location.pathname !== "/" || location.hash) {
      navigate("/", { replace: true });
    } else {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    }
  };

  // ----------------------------------
  // Navigate to the correct dashboard
  // ----------------------------------
  const goToDashboard = () => {
    closeMenus();

    const loggedIn = localStorage.getItem("isLoggedIn") === "true";

    if (!loggedIn) {
      navigate("/patient-login");
      return;
    }

    const role = (
      localStorage.getItem("userRole") || "patient"
    ).toLowerCase();

    if (role === "doctor") {
      navigate("/doctor-dashboard");
    } else if (role === "admin") {
      navigate("/admin-dashboard");
    } else {
      navigate("/patient-dashboard");
    }
  };

  // ----------------------------------
  // Logout
  // ----------------------------------
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");

    // Keep saved profile information when logging out.
    setIsLoggedIn(false);
    setUserName("Sadaye Noor");
    setProfilePicture("");

    closeMenus();

    window.dispatchEvent(new Event("authChange"));

    navigate("/", { replace: true });

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };

  // ----------------------------------
  // Navigate to Home sections
  // ----------------------------------
  const navigateToSection = (sectionId: string) => {
    closeMenus();

    const hash = `#${sectionId}`;

    if (location.pathname !== "/") {
      navigate(`/${hash}`);
      return;
    }

    if (location.hash !== hash) {
      navigate(`/${hash}`);
    } else {
      document.getElementById(sectionId)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  // ----------------------------------
  // Scroll to section after navigation
  // ----------------------------------
  useEffect(() => {
    if (location.pathname !== "/" || !location.hash) {
      return;
    }

    const sectionId = location.hash.slice(1);
    let attempts = 0;
    let timer = 0;

    const scrollToSection = () => {
      const section = document.getElementById(sectionId);

      if (section) {
        section.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        return;
      }

      if (attempts < 10) {
        attempts += 1;
        timer = window.setTimeout(scrollToSection, 100);
      }
    };

    timer = window.setTimeout(scrollToSection, 50);

    return () => window.clearTimeout(timer);
  }, [location.pathname, location.hash]);

  // ----------------------------------
  // Scroll to top on Home
  // ----------------------------------
  useEffect(() => {
    if (location.pathname === "/" && !location.hash) {
      requestAnimationFrame(() => {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: "smooth",
        });
      });
    }
  }, [location.pathname, location.hash]);

  // ----------------------------------
  // Active navigation link
  // ----------------------------------
  const isActive = (sectionId: string) =>
    location.pathname === "/" &&
    (activeSection === sectionId || location.hash === `#${sectionId}`);

  // ----------------------------------
  // Update active section while scrolling
  // ----------------------------------
  useEffect(() => {
    if (location.pathname !== "/") {
      setActiveSection("");
      return;
    }

    const sectionIds = ["doctors", "services", "how-it-works", "faq"];

    const updateActiveSection = () => {
      let currentSection = "";

      for (const sectionId of sectionIds) {
        const section = document.getElementById(sectionId);

        if (section && section.getBoundingClientRect().top <= 160) {
          currentSection = sectionId;
        }
      }

      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", updateActiveSection, {
      passive: true,
    });

    updateActiveSection();

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
    };
  }, [location.pathname]);

  // ----------------------------------
  // Close dropdowns when clicking outside
  // ----------------------------------
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      const clickedInsideDesktopProfile =
        desktopProfileRef.current?.contains(target) ?? false;

      const clickedInsideMobileProfile =
        mobileProfileRef.current?.contains(target) ?? false;

      const clickedInsideDesktopLogin =
        desktopLoginRef.current?.contains(target) ?? false;

      const clickedInsideMobileLogin =
        mobileLoginRef.current?.contains(target) ?? false;

      if (
        !clickedInsideDesktopProfile &&
        !clickedInsideMobileProfile
      ) {
        setProfileOpen(false);
      }

      if (
        !clickedInsideDesktopLogin &&
        !clickedInsideMobileLogin
      ) {
        setLoginOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // ----------------------------------
  // Close menus when route changes
  // ----------------------------------
  useEffect(() => {
    closeMenus();
  }, [location.pathname, location.hash, closeMenus]);

  // ----------------------------------
  // Close mobile menu on desktop width
  // ----------------------------------
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMenuOpen(false);
        setProfileOpen(false);
        setLoginOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // ----------------------------------
  // Desktop navigation styles
  // ----------------------------------
  const desktopLinkClass = (sectionId: string) =>
    `text-sm transition ${
      isActive(sectionId)
        ? "font-semibold text-[#0B63CE]"
        : "font-medium text-slate-600 hover:text-[#0B63CE]"
    }`;

  // ----------------------------------
  // Mobile navigation styles
  // ----------------------------------
  const mobileLinkClass = (sectionId: string) =>
    `rounded-xl px-4 py-3 text-left transition ${
      isActive(sectionId)
        ? "bg-blue-50 font-semibold text-[#0B63CE]"
        : "font-medium text-slate-600 hover:bg-slate-50 hover:text-[#0B63CE]"
    }`;

  // ----------------------------------
  // Role-specific account links
  // ----------------------------------
  const renderAccountLinks = () => {
    if (isDoctor) {
      return (
        <Link
          to="/doctor-appointments"
          onClick={closeMenus}
          className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-[#0B63CE]"
        >
          <CalendarDays size={18} />
          Doctor Appointments
        </Link>
      );
    }

    if (isAdmin) {
      return (
        <button
          type="button"
          onClick={goToDashboard}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-[#0B63CE]"
        >
          <LayoutDashboard size={18} />
          Admin Dashboard
        </button>
      );
    }

    return (
      <>
        <Link
          to="/my-profile"
          onClick={closeMenus}
          className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-[#0B63CE]"
        >
          <UserRound size={18} />
          My Profile
        </Link>

        <Link
          to="/appointments"
          onClick={closeMenus}
          className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-[#0B63CE]"
        >
          <CalendarDays size={18} />
          My Appointments
        </Link>

        <Link
          to="/prescriptions"
          onClick={closeMenus}
          className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-[#0B63CE]"
        >
          <FileText size={18} />
          My Prescriptions
        </Link>
      </>
    );
  };

  // ----------------------------------
  // Shared profile dropdown
  // ----------------------------------
  const renderProfileMenu = () => (
    <>
      <button
        type="button"
        onClick={goToDashboard}
        className="flex w-full items-center gap-3 border-b border-slate-100 px-4 py-4 text-left transition hover:bg-blue-50"
      >
        <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#e5f4f2] text-[#0B63CE]">
          {profilePicture ? (
            <img
  src={profilePicture || drMunibImage}
  alt={userName}
  onError={(event) => {
    event.currentTarget.onerror = null;
    event.currentTarget.src = drMunibImage;
  }}
  className="h-full w-full rounded-full object-cover"
/>
          ) : (
            <UserRound size={21} />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-slate-800">
            {userName}
          </p>

          <p className="mt-0.5 text-xs text-slate-500">
            {roleLabel} Dashboard
          </p>
        </div>
      </button>

      <div className="p-2">
        <button
          type="button"
          onClick={goToDashboard}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-blue-50 hover:text-[#0B63CE]"
        >
          <LayoutDashboard size={18} />
          Dashboard
        </button>

        {renderAccountLinks()}
      </div>

      <div className="border-t border-slate-100 p-2">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </>
  );

  // ----------------------------------
  // Shared login dropdown
  // ----------------------------------
  const renderLoginMenu = () => (
    <div className="absolute right-0 top-full z-[150] mt-2 w-38 overflow-hidden rounded-xl border border-slate-100 bg-white p-2 shadow-[0_12px_35px_rgba(15,23,42,0.14)]">
      <Link
        to="/patient-login"
        onClick={closeMenus}
        className="block rounded-lg px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-blue-50 hover:text-[#0B63CE]"
      >
        Patient
      </Link>

      <Link
        to="/doctor-login"
        onClick={closeMenus}
        className="block rounded-lg px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-blue-50 hover:text-[#0B63CE]"
      >
        Doctor
      </Link>

      <Link
        to="/admin-login"
        onClick={closeMenus}
        className="block rounded-lg px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-blue-50 hover:text-[#0B63CE]"
      >
        Admin
      </Link>
    </div>
  );

  return (
    <header className="fixed inset-x-0 top-0 z-[100] w-full border-b border-slate-100 bg-white/95 shadow-[0_2px_12px_rgba(15,23,42,0.04)] backdrop-blur-md">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* MAIN NAVBAR */}
        <div className="flex h-[76px] w-full items-center justify-between">
          {/* LOGO */}
          <button
            type="button"
            onClick={goToHome}
            className="flex min-w-0 items-center gap-2.5 text-left"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0B63CE] shadow-sm">
              <span className="text-xl font-bold text-white">+</span>
            </div>

            <div className="min-w-0 leading-tight">
              <h1 className="truncate text-lg font-bold tracking-tight text-slate-800 sm:text-xl">
                Telemedicine
              </h1>

              <p className="text-[10px] font-medium text-slate-500 sm:text-[11px]">
                Online Healthcare
              </p>
            </div>
          </button>

          {/* DESKTOP NAVIGATION */}
          <nav className="hidden items-center gap-7 lg:flex">
            <button
              type="button"
              onClick={goToHome}
              className={`text-sm font-semibold transition ${
                location.pathname === "/" &&
                !location.hash &&
                !activeSection
                  ? "text-[#0B63CE]"
                  : "text-slate-600 hover:text-[#0B63CE]"
              }`}
            >
              Home
            </button>

            <button
              type="button"
              onClick={() => navigateToSection("doctors")}
              className={desktopLinkClass("doctors")}
            >
              Doctors
            </button>

            <button
              type="button"
              onClick={() => navigateToSection("services")}
              className={desktopLinkClass("services")}
            >
              Services
            </button>

            <button
              type="button"
              onClick={() => navigateToSection("how-it-works")}
              className={desktopLinkClass("how-it-works")}
            >
              How It Works
            </button>

            <button
              type="button"
              onClick={() => navigateToSection("faq")}
              className={desktopLinkClass("faq")}
            >
              FAQ
            </button>
          </nav>

          {/* DESKTOP ACTIONS */}
          <div className="hidden items-center gap-3 lg:flex">
            <a
              href="tel:+923001234567"
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-[#0B63CE] hover:text-[#0B63CE]"
            >
              <Phone size={16} />
              <span>+92 300 1234567</span>
            </a>

            <Link
              to="/book-appointment"
              onClick={closeMenus}
              className="rounded-lg bg-[#0B63CE] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0955AE] hover:shadow-md"
            >
              Book Appointment
            </Link>

            {!isLoggedIn ? (
              <div ref={desktopLoginRef} className="relative">
                <button
                  type="button"
                  onClick={() => setLoginOpen((prev) => !prev)}
                  aria-expanded={loginOpen}
                  className="flex items-center gap-2 rounded-lg border border-[#0B63CE] bg-white px-5 py-2.5 text-sm font-semibold text-[#0B63CE] transition hover:bg-blue-50"
                >
                  Login

                  <ChevronDown
                    size={16}
                    className={`transition-transform ${
                      loginOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {loginOpen && renderLoginMenu()}
              </div>
            ) : (
              <>
                {/* DESKTOP NOTIFICATIONS */}
                <Link
                  to="/notifications"
                  aria-label="Notifications"
                  className="relative flex h-10 w-10 items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-100 hover:text-[#0B63CE]"
                >
                  <Bell size={21} />

                  <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white ring-2 ring-white">
                    3
                  </span>
                </Link>

                {/* DESKTOP PROFILE */}
                <div ref={desktopProfileRef} className="relative">
                  <button
                    type="button"
                    onClick={() => setProfileOpen((prev) => !prev)}
                    className="flex items-center gap-2 rounded-xl px-2 py-1.5 transition hover:bg-slate-50"
                    aria-label="Open profile menu"
                    aria-expanded={profileOpen}
                  >
                    <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-[#e5f4f2] text-[#0B63CE] shadow-sm ring-1 ring-slate-200">
                      {profilePicture ? (
                        <img
                          src={profilePicture}
                          alt={userName}
                          className="h-full w-full rounded-full object-cover"
                        />
                      ) : (
                        <UserRound size={20} />
                      )}
                    </div>

                    <div className="hidden text-left xl:block">
                      <p className="max-w-[130px] truncate text-xs font-semibold leading-tight text-slate-800">
                        {userName}
                      </p>

                      <p className="text-[10px] text-slate-500">
                        {roleLabel}
                      </p>
                    </div>

                    <ChevronDown
                      size={16}
                      className={`text-slate-600 transition-transform ${
                        profileOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 top-14 z-[120] w-[285px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_15px_40px_rgba(15,23,42,0.12)]">
                      {renderProfileMenu()}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* MOBILE ACTIONS */}
          <div className="flex items-center gap-1 sm:gap-2 lg:hidden">
            {isLoggedIn && (
              <>
                {/* MOBILE NOTIFICATIONS */}
                <Link
                  to="/notifications"
                  aria-label="Notifications"
                  className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-100 hover:text-[#0B63CE]"
                >
                  <Bell size={21} />

                  <span className="absolute right-0 top-0 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white ring-2 ring-white">
                    3
                  </span>
                </Link>

                {/* MOBILE PROFILE */}
                <div ref={mobileProfileRef} className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen((prev) => !prev);
                      setMenuOpen(false);
                      setLoginOpen(false);
                    }}
                    className="flex min-w-[44px] flex-col items-center justify-center rounded-lg px-1 py-0.5 transition hover:bg-slate-50"
                    aria-label="Open profile menu"
                    aria-expanded={profileOpen}
                  >
                    <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-[#e5f4f2] text-[#0B63CE] ring-1 ring-slate-200">
                      {profilePicture ? (
                        <img
                          src={profilePicture}
                          alt={userName}
                          className="h-full w-full rounded-full object-cover"
                        />
                      ) : (
                        <UserRound size={17} />
                      )}
                    </div>

                    <span className="mt-0.5 max-w-[72px] truncate text-[9px] font-semibold leading-tight text-slate-700">
                      {userName}
                    </span>
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 top-[60px] z-[130] w-[260px] max-w-[calc(100vw-1.5rem)] overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_15px_40px_rgba(15,23,42,0.15)]">
                      {renderProfileMenu()}
                    </div>
                  )}
                </div>
              </>
            )}

            {/* HAMBURGER */}
            <button
              type="button"
              onClick={() => {
                setMenuOpen((prev) => !prev);
                setProfileOpen(false);
                setLoginOpen(false);
              }}
              className="relative z-[110] flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-[#0B63CE] hover:text-[#0B63CE]"
              aria-label="Toggle navigation menu"
              aria-expanded={menuOpen}
            >
              {menuOpen ? (
                <X size={23} strokeWidth={2.5} />
              ) : (
                <Menu size={23} strokeWidth={2.5} />
              )}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {menuOpen && (
          <div className="relative z-[105] border-t border-slate-100 bg-white py-4 lg:hidden">
            <nav className="flex flex-col gap-1">
              {/* TOP ACTION BUTTONS */}
              <div className="grid grid-cols-2 gap-2 border-b border-slate-100 px-3 pb-4">
                <a
                  href="tel:+923001234567"
                  aria-label="Call Telemedicine"
                  className="flex min-h-[46px] items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-2 text-sm font-semibold text-slate-700 transition hover:border-[#0B63CE] hover:bg-blue-50 hover:text-[#0B63CE]"
                >
                  <Phone size={17} className="shrink-0 text-[#0B63CE]" />
                  <span>Call Us</span>
                </a>

                <Link
                  to="/book-appointment"
                  onClick={closeMenus}
                  className="flex min-h-[46px] items-center justify-center gap-2 rounded-xl bg-[#0B63CE] px-2 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-[#0955AE]"
                >
                  <CalendarDays size={17} className="shrink-0" />
                  <span>Book Appointment</span>
                </Link>
              </div>

              {/* HOME */}
              <button
                type="button"
                onClick={goToHome}
                className={`rounded-xl px-4 py-3 text-left transition ${
                  location.pathname === "/" && !location.hash
                    ? "bg-blue-50 font-semibold text-[#0B63CE]"
                    : "font-medium text-slate-600 hover:bg-slate-50 hover:text-[#0B63CE]"
                }`}
              >
                Home
              </button>

              {/* DOCTORS */}
              <button
                type="button"
                onClick={() => navigateToSection("doctors")}
                className={mobileLinkClass("doctors")}
              >
                Doctors
              </button>

              {/* SERVICES */}
              <button
                type="button"
                onClick={() => navigateToSection("services")}
                className={mobileLinkClass("services")}
              >
                Services
              </button>

              {/* HOW IT WORKS */}
              <button
                type="button"
                onClick={() => navigateToSection("how-it-works")}
                className={mobileLinkClass("how-it-works")}
              >
                How It Works
              </button>

              {/* FAQ */}
              <button
                type="button"
                onClick={() => navigateToSection("faq")}
                className={mobileLinkClass("faq")}
              >
                FAQ
              </button>

              {/* LOGGED-OUT USER: LOGIN DROPDOWN */}
              {!isLoggedIn && (
                <div
                  ref={mobileLoginRef}
                  className="mt-3 border-t border-slate-100 px-3 pt-3"
                >
                  <button
                    type="button"
                    onClick={() => setLoginOpen((prev) => !prev)}
                    aria-expanded={loginOpen}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#0B63CE] px-4 py-3 text-sm font-semibold text-[#0B63CE] transition hover:bg-blue-50"
                  >
                    Login to Your Account

                    <ChevronDown
                      size={17}
                      className={`transition-transform ${
                        loginOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {loginOpen && (
                    <div className="mt-2 space-y-1 rounded-xl border border-slate-100 bg-white p-2 shadow-sm">
                      <Link
                        to="/patient-login"
                        onClick={closeMenus}
                        className="block rounded-lg px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-blue-50 hover:text-[#0B63CE]"
                      >
                        Patient
                      </Link>

                      <Link
                        to="/doctor-login"
                        onClick={closeMenus}
                        className="block rounded-lg px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-blue-50 hover:text-[#0B63CE]"
                      >
                        Doctor
                      </Link>

                      <Link
                        to="/admin-login"
                        onClick={closeMenus}
                        className="block rounded-lg px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-blue-50 hover:text-[#0B63CE]"
                      >
                        Admin
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* LOGGED-IN USER */}
              {isLoggedIn && (
                <div className="mt-3 border-t border-slate-100 px-2 pt-3">
                  <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    {isDoctor
                      ? "Doctor Account"
                      : isAdmin
                        ? "Admin Account"
                        : "My Account"}
                  </p>

                  <button
                    type="button"
                    onClick={goToDashboard}
                    className="flex w-full items-center gap-3 rounded-xl bg-blue-50 px-3 py-3 text-left text-sm font-semibold text-[#0B63CE] transition hover:bg-blue-100"
                  >
                    <LayoutDashboard size={18} />
                    Dashboard
                  </button>

                  <div className="mt-1">
                    {renderAccountLinks()}
                  </div>

                  <div className="mt-3 border-t border-slate-100 pt-3">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50"
                    >
                      <LogOut size={18} />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;
