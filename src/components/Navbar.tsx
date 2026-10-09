import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

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

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  const [isLoggedIn, setIsLoggedIn] = useState(
    () => localStorage.getItem("isLoggedIn") === "true"
  );

  const [userName, setUserName] = useState(
    () => localStorage.getItem("userName") || "Sadaye Noor"
  );

  // Separate refs for desktop and mobile profile dropdowns.
  const desktopProfileRef = useRef<HTMLDivElement>(null);
  const mobileProfileRef = useRef<HTMLDivElement>(null);

  const location = useLocation();
  const navigate = useNavigate();

  // ----------------------------------
  // Synchronize login state
  // ----------------------------------
  const syncAuthState = useCallback(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";

    setIsLoggedIn(loggedIn);
    setUserName(localStorage.getItem("userName") || "Sadaye Noor");

    if (!loggedIn) {
      setProfileOpen(false);
    }
  }, []);

  useEffect(() => {
    syncAuthState();

    window.addEventListener("authChange", syncAuthState);
    window.addEventListener("storage", syncAuthState);

    return () => {
      window.removeEventListener("authChange", syncAuthState);
      window.removeEventListener("storage", syncAuthState);
    };
  }, [syncAuthState, location.pathname]);

  // ----------------------------------
  // Close all menus
  // ----------------------------------
  const closeMenus = useCallback(() => {
    setMenuOpen(false);
    setProfileOpen(false);
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
  // Go to Patient Dashboard
  // ----------------------------------
  const goToDashboard = () => {
    closeMenus();

    // Read the latest login status directly from localStorage.
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";

    if (!loggedIn) {
      navigate("/login");
      return;
    }

    navigate("/patient-dashboard");
  };

  // ----------------------------------
  // Logout
  // ----------------------------------
  const handleLogout = () => {
    // Remove authentication information.
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userName");

    // Update Navbar immediately.
    setIsLoggedIn(false);
    setUserName("Sadaye Noor");

    // Close dropdowns and mobile menu.
    closeMenus();

    // Notify other components listening for authentication changes.
    window.dispatchEvent(new Event("authChange"));

    // Return to Home.
    navigate("/", { replace: true });
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
  // Scroll to a section after navigation
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
  // Scroll to top when opening Home
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
  // Determine active navigation link
  // ----------------------------------
  const isActive = (sectionId: string) => {
    return (
      location.pathname === "/" &&
      (activeSection === sectionId ||
        location.hash === `#${sectionId}`)
    );
  };

  // ----------------------------------
  // Update active section while scrolling
  // ----------------------------------
  useEffect(() => {
    if (location.pathname !== "/") {
      setActiveSection("");
      return;
    }

    const sectionIds = [
      "doctors",
      "services",
      "how-it-works",
      "faq",
    ];

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
  // Close profile dropdown when clicking outside
  // ----------------------------------
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      const clickedInsideDesktop =
        desktopProfileRef.current?.contains(target) ?? false;

      const clickedInsideMobile =
        mobileProfileRef.current?.contains(target) ?? false;

      if (!clickedInsideDesktop && !clickedInsideMobile) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // ----------------------------------
  // Close menus when the route changes
  // ----------------------------------
  useEffect(() => {
    closeMenus();
  }, [location.pathname, location.hash, closeMenus]);

  // ----------------------------------
  // Close mobile menu when entering desktop width
  // ----------------------------------
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMenuOpen(false);
        setProfileOpen(false);
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
  // Shared profile dropdown content
  // Render JSX directly instead of creating a nested component.
  // ----------------------------------
  const renderProfileMenu = () => (
    <>
      {/* User information / Dashboard shortcut */}
      <button
        type="button"
        onClick={goToDashboard}
        className="flex w-full items-center gap-3 border-b border-slate-100 px-4 py-4 text-left transition hover:bg-blue-50"
      >
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#e5f4f2] text-[#0B63CE]">
          <UserRound size={21} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-slate-800">
            {userName}
          </p>

          <p className="mt-0.5 text-xs text-slate-500">
            Open Patient Dashboard
          </p>
        </div>
      </button>

      {/* Profile navigation */}
      <div className="p-2">
        <button
          type="button"
          onClick={goToDashboard}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-blue-50 hover:text-[#0B63CE]"
        >
          <LayoutDashboard size={18} />
          Patient Dashboard
        </button>

        <Link
          to="/profile"
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
      </div>

      {/* Logout */}
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
              <Link
                to="/login"
                onClick={closeMenus}
                className="rounded-lg border border-[#0B63CE] bg-white px-5 py-2.5 text-sm font-semibold text-[#0B63CE] transition hover:bg-blue-50"
              >
                Login
              </Link>
            ) : (
              <>
                {/* Desktop notifications */}
                <button
                  type="button"
                  aria-label="Notifications"
                  className="relative flex h-10 w-10 items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-100 hover:text-[#0B63CE]"
                >
                  <Bell size={21} />

                  <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white ring-2 ring-white">
                    3
                  </span>
                </button>

                {/* Desktop profile dropdown */}
                <div ref={desktopProfileRef} className="relative">
                  <button
                    type="button"
                    onClick={() => setProfileOpen((prev) => !prev)}
                    className="flex items-center gap-2 rounded-xl px-2 py-1.5 transition hover:bg-slate-50"
                    aria-label="Open profile menu"
                    aria-expanded={profileOpen}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-[#e5f4f2] text-[#0B63CE] shadow-sm ring-1 ring-slate-200">
                      <UserRound size={20} />
                    </div>

                    <div className="hidden text-left xl:block">
                      <p className="max-w-[130px] truncate text-xs font-semibold leading-tight text-slate-800">
                        {userName}
                      </p>

                      <p className="text-[10px] text-slate-500">
                        Patient
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
                {/* Mobile notifications */}
                <button
                  type="button"
                  aria-label="Notifications"
                  className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-100 hover:text-[#0B63CE]"
                >
                  <Bell size={21} />

                  <span className="absolute right-0 top-0 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white ring-2 ring-white">
                    3
                  </span>
                </button>

                {/* Mobile profile dropdown */}
                <div ref={mobileProfileRef} className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen((prev) => !prev);
                      setMenuOpen(false);
                    }}
                    className="flex min-w-[44px] flex-col items-center justify-center rounded-lg px-1 py-0.5 transition hover:bg-slate-50"
                    aria-label="Open profile menu"
                    aria-expanded={profileOpen}
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e5f4f2] text-[#0B63CE] ring-1 ring-slate-200">
                      <UserRound size={17} />
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

            {/* Hamburger */}
            <button
              type="button"
              onClick={() => {
                setMenuOpen((prev) => !prev);
                setProfileOpen(false);
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


  {/* TOP ACTION BUTTONS — Always visible */}
  <div className="grid grid-cols-2 gap-2 border-b border-slate-100 px-3 pb-4">

    {/* Call Us */}
    <a
      href="tel:+923001234567"
      aria-label="Call Telemedicine"
      className="flex min-h-[46px] items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-2 text-sm font-semibold text-slate-700 transition hover:border-[#0B63CE] hover:bg-blue-50 hover:text-[#0B63CE]"
    >
      <Phone size={17} className="shrink-0 text-[#0B63CE]" />
      <span>Call Us</span>
    </a>

    {/* Book Appointment */}
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

  {/* LOGGED-OUT USER */}
  {!isLoggedIn && (
    <div className="mt-3 border-t border-slate-100 px-3 pt-3">
      <Link
        to="/login"
        onClick={closeMenus}
        className="flex w-full items-center justify-center rounded-xl border border-[#0B63CE] px-4 py-3 text-sm font-semibold text-[#0B63CE] transition hover:bg-blue-50"
      >
        Login to Your Account
      </Link>
    </div>
  )}

  {/* LOGGED-IN USER */}
  {isLoggedIn && (
    <div className="mt-3 border-t border-slate-100 px-2 pt-3">

      <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
        My Account
      </p>

      {/* Dashboard */}
      <button
        type="button"
        onClick={goToDashboard}
        className="flex w-full items-center gap-3 rounded-xl bg-blue-50 px-3 py-3 text-left text-sm font-semibold text-[#0B63CE] transition hover:bg-blue-100"
      >
        <LayoutDashboard size={18} />
        Patient Dashboard
      </button>

      {/* Profile */}
      <Link
        to="/profile"
        onClick={closeMenus}
        className="mt-1 flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-[#0B63CE]"
      >
        <UserRound size={18} />
        My Profile
      </Link>

      {/* Appointments */}
      <Link
        to="/appointments"
        onClick={closeMenus}
        className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-[#0B63CE]"
      >
        <CalendarDays size={18} />
        My Appointments
      </Link>

      {/* Prescriptions */}
      <Link
        to="/prescriptions"
        onClick={closeMenus}
        className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-[#0B63CE]"
      >
        <FileText size={18} />
        My Prescriptions
      </Link>

      {/* Logout */}
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