import { useEffect, useRef, useState } from "react";
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
} from "lucide-react";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);

  const location = useLocation();
  const navigate = useNavigate();

  const isLoggedIn =
    localStorage.getItem("isLoggedIn") === "true";

  // ----------------------------------
  // Close profile dropdown on outside click
  // ----------------------------------
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  // ----------------------------------
  // Close menus when route changes
  // ----------------------------------
  useEffect(() => {
    setMenuOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  // ----------------------------------
  // Close mobile menu on larger screens
  // ----------------------------------
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // ----------------------------------
  // Logout
  // ----------------------------------
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");

    setProfileOpen(false);
    setMenuOpen(false);

    navigate("/");
  };

  // ----------------------------------
  // Close all menus
  // ----------------------------------
  const closeMenus = () => {
    setMenuOpen(false);
    setProfileOpen(false);
  };

  return (
    <header
  className="
    fixed
    inset-x-0
    top-0
    z-[100]
    w-screen
    max-w-none
    bg-white/95
    backdrop-blur-md
    border-b
    border-slate-100
    shadow-[0_2px_12px_rgba(15,23,42,0.04)]
  "
>
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* =================================
            MAIN NAVBAR
        ================================== */}
        <div className="flex h-[76px] w-full items-center justify-between">

          {/* =================================
              LOGO
          ================================== */}
          <Link
            to="/"
            onClick={closeMenus}
            className="flex min-w-0 items-center gap-2.5"
          >
            {/* Logo Icon */}
            <div
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-[#0B63CE]
                shadow-sm
              "
            >
              <span className="text-xl font-bold text-white">
                +
              </span>
            </div>

            {/* Logo Text */}
            <div className="min-w-0 leading-tight">
              <h1 className="truncate text-lg font-bold tracking-tight text-slate-800 sm:text-xl">
                Telemedicine
              </h1>

              <p className="text-[10px] font-medium text-slate-500 sm:text-[11px]">
                Online Healthcare
              </p>
            </div>
          </Link>

          {/* =================================
              DESKTOP NAVIGATION
          ================================== */}
          <nav className="hidden items-center gap-7 lg:flex">

            {/* Home */}
            <Link
              to="/"
              onClick={closeMenus}
              className={`
                text-sm font-semibold transition
                ${
                  location.pathname === "/"
                    ? "text-[#0B63CE]"
                    : "text-slate-600 hover:text-[#0B63CE]"
                }
              `}
            >
              Home
            </Link>

            {/* Doctors */}
            <a
              href="/#doctors"
              className="
                text-sm
                font-medium
                text-slate-600
                transition
                hover:text-[#0B63CE]
              "
            >
              Doctors
            </a>

            {/* Services */}
            <a
              href="/#services"
              className="
                text-sm
                font-medium
                text-slate-600
                transition
                hover:text-[#0B63CE]
              "
            >
              Services
            </a>

            {/* How It Works */}
            <a
              href="/#how-it-works"
              className="
                text-sm
                font-medium
                text-slate-600
                transition
                hover:text-[#0B63CE]
              "
            >
              How It Works
            </a>

            {/* FAQ */}
            <a
              href="/#faq"
              className="
                text-sm
                font-medium
                text-slate-600
                transition
                hover:text-[#0B63CE]
              "
            >
              FAQ
            </a>
          </nav>

          {/* =================================
              DESKTOP ACTIONS
          ================================== */}
          <div className="hidden items-center gap-3 lg:flex">

            {!isLoggedIn ? (
              <>
                {/* Phone */}
                <button
                  type="button"
                  className="
                    flex
                    items-center
                    gap-2
                    rounded-lg
                    border
                    border-slate-200
                    bg-white
                    px-4
                    py-2.5
                    text-sm
                    font-medium
                    text-slate-700
                    transition
                    hover:border-[#0B63CE]
                    hover:text-[#0B63CE]
                  "
                >
                  <Phone size={16} />
                  <span>+92 300 1234567</span>
                </button>

                {/* Book Appointment */}
                <Link
                  to="/book-appointment"
                  onClick={closeMenus}
                  className="
                    rounded-lg
                    bg-[#0B63CE]
                    px-5
                    py-2.5
                    text-sm
                    font-semibold
                    text-white
                    shadow-sm
                    transition
                    hover:bg-[#0955AE]
                    hover:shadow-md
                  "
                >
                  Book Appointment
                </Link>

                {/* Login */}
                <Link
                  to="/login"
                  onClick={closeMenus}
                  className="
                    rounded-lg
                    border
                    border-[#0B63CE]
                    bg-white
                    px-5
                    py-2.5
                    text-sm
                    font-semibold
                    text-[#0B63CE]
                    transition
                    hover:bg-blue-50
                  "
                >
                  Login
                </Link>
              </>
            ) : (
              /* =================================
                 LOGGED-IN PROFILE
              ================================== */
              <div
                ref={profileRef}
                className="relative"
              >
                <button
                  type="button"
                  onClick={() =>
                    setProfileOpen((prev) => !prev)
                  }
                  className="
                    flex
                    items-center
                    gap-2
                    rounded-full
                    p-1.5
                    transition
                    hover:bg-slate-50
                  "
                  aria-label="Open profile menu"
                  aria-expanded={profileOpen}
                >
                  {/* Profile Picture */}
                  <div
                    className="
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      overflow-hidden
                      rounded-full
                      border-2
                      border-white
                      bg-[#e5f4f2]
                      text-[#0B63CE]
                      shadow-sm
                      ring-1
                      ring-slate-200
                    "
                  >
                    <UserRound size={20} />
                  </div>

                  {/* Arrow */}
                  <ChevronDown
                    size={17}
                    className={`
                      text-slate-600
                      transition-transform
                      duration-200
                      ${
                        profileOpen
                          ? "rotate-180"
                          : ""
                      }
                    `}
                  />
                </button>

                {/* =================================
                    PROFILE DROPDOWN
                ================================== */}
                {profileOpen && (
                  <div
                    className="
                      absolute
                      right-0
                      top-14
                      z-[120]
                      w-[285px]
                      overflow-hidden
                      rounded-2xl
                      border
                      border-slate-100
                      bg-white
                      shadow-[0_15px_40px_rgba(15,23,42,0.12)]
                    "
                  >
                    {/* Profile Header */}
                    <div className="border-b border-slate-100 px-5 py-4">
                      <div className="flex items-center gap-3">

                        <div
                          className="
                            flex
                            h-11
                            w-11
                            items-center
                            justify-center
                            rounded-full
                            bg-[#e5f4f2]
                            text-[#0B63CE]
                          "
                        >
                          <UserRound size={21} />
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-slate-800">
                            Your Account
                          </p>

                          <p className="mt-0.5 text-xs text-slate-500">
                            Manage your healthcare
                          </p>
                        </div>

                      </div>
                    </div>

                    {/* Profile Options */}
                    <div className="p-2">

                      {/* My Profile */}
                      <Link
                        to="/profile"
                        onClick={() =>
                          setProfileOpen(false)
                        }
                        className="
                          flex
                          items-center
                          gap-3
                          rounded-xl
                          px-3
                          py-3
                          transition
                          hover:bg-slate-50
                        "
                      >
                        <div
                          className="
                            flex
                            h-9
                            w-9
                            items-center
                            justify-center
                            rounded-lg
                            bg-slate-100
                            text-slate-600
                          "
                        >
                          <UserRound size={17} />
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-slate-700">
                            My Profile
                          </p>

                          <p className="text-xs text-slate-500">
                            View and update your profile
                          </p>
                        </div>
                      </Link>

                      {/* Appointments */}
                      <Link
                        to="/appointments"
                        onClick={() =>
                          setProfileOpen(false)
                        }
                        className="
                          flex
                          items-center
                          gap-3
                          rounded-xl
                          px-3
                          py-3
                          transition
                          hover:bg-slate-50
                        "
                      >
                        <div
                          className="
                            flex
                            h-9
                            w-9
                            items-center
                            justify-center
                            rounded-lg
                            bg-slate-100
                            text-slate-600
                          "
                        >
                          <CalendarDays size={17} />
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-slate-700">
                            My Appointments
                          </p>

                          <p className="text-xs text-slate-500">
                            Check your appointments
                          </p>
                        </div>
                      </Link>

                      {/* Prescriptions */}
                      <Link
                        to="/prescriptions"
                        onClick={() =>
                          setProfileOpen(false)
                        }
                        className="
                          flex
                          items-center
                          gap-3
                          rounded-xl
                          px-3
                          py-3
                          transition
                          hover:bg-slate-50
                        "
                      >
                        <div
                          className="
                            flex
                            h-9
                            w-9
                            items-center
                            justify-center
                            rounded-lg
                            bg-slate-100
                            text-slate-600
                          "
                        >
                          <FileText size={17} />
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-slate-700">
                            My Prescriptions
                          </p>

                          <p className="text-xs text-slate-500">
                            View your prescriptions
                          </p>
                        </div>
                      </Link>
                    </div>

                    {/* Logout */}
                    <div className="border-t border-slate-100 p-2">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="
                          flex
                          w-full
                          items-center
                          gap-3
                          rounded-xl
                          px-3
                          py-3
                          text-left
                          transition
                          hover:bg-red-50
                        "
                      >
                        <div
                          className="
                            flex
                            h-9
                            w-9
                            items-center
                            justify-center
                            rounded-lg
                            bg-red-50
                            text-red-500
                          "
                        >
                          <LogOut size={17} />
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-red-600">
                            Logout
                          </p>

                          <p className="text-xs text-slate-500">
                            Sign out of your account
                          </p>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* =================================
              MOBILE HAMBURGER
          ================================== */}
          <button
            type="button"
            onClick={() => {
              setMenuOpen((prev) => !prev);
              setProfileOpen(false);
            }}
            className="
              relative
              z-[110]
              flex
              h-11
              w-11
              shrink-0
              items-center
              justify-center
              rounded-lg
              border
              border-slate-200
              bg-white
              text-slate-700
              shadow-sm
              transition
              hover:border-[#0B63CE]
              hover:text-[#0B63CE]
              lg:hidden
            "
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <X
                size={25}
                strokeWidth={2.5}
              />
            ) : (
              <Menu
                size={25}
                strokeWidth={2.5}
              />
            )}
          </button>
        </div>

        {/* =================================
            MOBILE MENU
        ================================== */}
        {menuOpen && (
          <div
            className="
              relative
              z-[105]
              border-t
              border-slate-100
              bg-white
              py-4
              lg:hidden
            "
          >
            <nav className="flex flex-col gap-1">

              {/* Home */}
              <Link
                to="/"
                onClick={closeMenus}
                className={`
                  rounded-xl
                  px-4
                  py-3
                  font-semibold
                  transition
                  ${
                    location.pathname === "/"
                      ? "bg-blue-50 text-[#0B63CE]"
                      : "text-slate-600 hover:bg-slate-50 hover:text-[#0B63CE]"
                  }
                `}
              >
                Home
              </Link>

              {/* Doctors */}
              <a
                href="/#doctors"
                onClick={closeMenus}
                className="
                  rounded-xl
                  px-4
                  py-3
                  font-medium
                  text-slate-600
                  transition
                  hover:bg-slate-50
                  hover:text-[#0B63CE]
                "
              >
                Doctors
              </a>

              {/* Services */}
              <a
                href="/#services"
                onClick={closeMenus}
                className="
                  rounded-xl
                  px-4
                  py-3
                  font-medium
                  text-slate-600
                  transition
                  hover:bg-slate-50
                  hover:text-[#0B63CE]
                "
              >
                Services
              </a>

              {/* How It Works */}
              <a
                href="/#how-it-works"
                onClick={closeMenus}
                className="
                  rounded-xl
                  px-4
                  py-3
                  font-medium
                  text-slate-600
                  transition
                  hover:bg-slate-50
                  hover:text-[#0B63CE]
                "
              >
                How It Works
              </a>

              {/* FAQ */}
              <a
                href="/#faq"
                onClick={closeMenus}
                className="
                  rounded-xl
                  px-4
                  py-3
                  font-medium
                  text-slate-600
                  transition
                  hover:bg-slate-50
                  hover:text-[#0B63CE]
                "
              >
                FAQ
              </a>

              {/* =================================
                  LOGGED OUT MOBILE
              ================================== */}
              {!isLoggedIn ? (
                <>
                  {/* Phone */}
                  <div className="mt-3">
                    <button
                      type="button"
                      className="
                        flex
                        w-full
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        border
                        border-slate-200
                        px-4
                        py-3
                        font-medium
                        text-slate-700
                      "
                    >
                      <Phone size={17} />
                      +92 300 1234567
                    </button>
                  </div>

                  {/* Book Appointment */}
                  <div className="mt-3">
                    <Link
                      to="/book-appointment"
                      onClick={closeMenus}
                      className="
                        block
                        w-full
                        rounded-xl
                        bg-[#0B63CE]
                        px-4
                        py-3
                        text-center
                        font-semibold
                        text-white
                        shadow-sm
                      "
                    >
                      Book Appointment
                    </Link>
                  </div>

                  {/* Login */}
                  <div className="mt-3">
                    <Link
                      to="/login"
                      onClick={closeMenus}
                      className="
                        block
                        w-full
                        rounded-xl
                        border
                        border-[#0B63CE]
                        px-4
                        py-3
                        text-center
                        font-semibold
                        text-[#0B63CE]
                      "
                    >
                      Login
                    </Link>
                  </div>
                </>
              ) : (
                /* =================================
                   LOGGED-IN MOBILE
                ================================== */
                <>
                  <div className="mt-4 border-t border-slate-100 pt-4">

                    {/* Account */}
                    <div
                      className="
                        mb-3
                        flex
                        items-center
                        gap-3
                        rounded-xl
                        bg-slate-50
                        px-4
                        py-3
                      "
                    >
                      <div
                        className="
                          flex
                          h-10
                          w-10
                          shrink-0
                          items-center
                          justify-center
                          rounded-full
                          bg-[#e5f4f2]
                          text-[#0B63CE]
                        "
                      >
                        <UserRound size={19} />
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-slate-800">
                          Your Account
                        </p>

                        <p className="text-xs text-slate-500">
                          Patient
                        </p>
                      </div>
                    </div>

                    {/* My Profile */}
                    <Link
                      to="/profile"
                      onClick={closeMenus}
                      className="
                        flex
                        items-center
                        gap-3
                        rounded-xl
                        px-4
                        py-3
                        text-sm
                        font-medium
                        text-slate-700
                        transition
                        hover:bg-slate-50
                      "
                    >
                      <UserRound size={18} />
                      My Profile
                    </Link>

                    {/* My Appointments */}
                    <Link
                      to="/appointments"
                      onClick={closeMenus}
                      className="
                        flex
                        items-center
                        gap-3
                        rounded-xl
                        px-4
                        py-3
                        text-sm
                        font-medium
                        text-slate-700
                        transition
                        hover:bg-slate-50
                      "
                    >
                      <CalendarDays size={18} />
                      My Appointments
                    </Link>

                    {/* My Prescriptions */}
                    <Link
                      to="/prescriptions"
                      onClick={closeMenus}
                      className="
                        flex
                        items-center
                        gap-3
                        rounded-xl
                        px-4
                        py-3
                        text-sm
                        font-medium
                        text-slate-700
                        transition
                        hover:bg-slate-50
                      "
                    >
                      <FileText size={18} />
                      My Prescriptions
                    </Link>

                    {/* Logout */}
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="
                        mt-2
                        flex
                        w-full
                        items-center
                        gap-3
                        rounded-xl
                        px-4
                        py-3
                        text-left
                        text-sm
                        font-semibold
                        text-red-600
                        transition
                        hover:bg-red-50
                      "
                    >
                      <LogOut size={18} />
                      Logout
                    </button>
                  </div>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;