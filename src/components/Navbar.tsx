import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Phone } from "lucide-react";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
   const handleScroll = () => {
  const currentScrollY = window.scrollY;

  // 💻 Laptop/Desktop: navbar always visible
  if (window.innerWidth >= 1024) {
    setShowNavbar(true);
    setLastScrollY(currentScrollY);
    return;
  }

  // 📱 Mobile/Tablet: show navbar at the top
  if (currentScrollY <= 10) {
    setShowNavbar(true);
  }

  // 📱 Scroll down → hide navbar
  else if (currentScrollY > lastScrollY) {
    setShowNavbar(false);
    setMenuOpen(false);
  }

  // 📱 Scroll up → show navbar
  else if (currentScrollY < lastScrollY) {
    setShowNavbar(true);
  }

  setLastScrollY(currentScrollY);
};

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-50
        bg-white
        border-b border-slate-100
        transition-transform duration-300 ease-in-out
        ${showNavbar ? "translate-y-0" : "-translate-y-full"}
      `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Main Navbar */}
        <div className="h-[76px] flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-[#0B63CE] flex items-center justify-center">
              <span className="text-white text-xl font-bold">
                +
              </span>
            </div>

            <div className="leading-tight">
              <h1 className="text-xl font-bold text-slate-800">
                MediCare
              </h1>

              <p className="text-[11px] text-slate-500">
                Online Healthcare
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">

            <Link
              to="/"
              className="text-sm font-medium text-[#0B63CE] hover:text-[#0955AE] transition"
            >
              Home
            </Link>

            <a
              href="#doctors"
              className="text-sm font-medium text-slate-600 hover:text-[#0B63CE] transition"
            >
              Doctors
            </a>

            <a
              href="#services"
              className="text-sm font-medium text-slate-600 hover:text-[#0B63CE] transition"
            >
              Services
            </a>

            <a
              href="#how-it-works"
              className="text-sm font-medium text-slate-600 hover:text-[#0B63CE] transition"
            >
              How It Works
            </a>

            <a
              href="#about"
              className="text-sm font-medium text-slate-600 hover:text-[#0B63CE] transition"
            >
              About
            </a>

          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3">

            {/* Phone */}
            <button
              className="
                flex items-center gap-2
                px-4 py-2.5
                rounded-lg
                bg-white
                border border-slate-200
                text-slate-700
                text-sm font-medium
                hover:border-[#0B63CE]
                hover:text-[#0B63CE]
                transition
              "
            >
              <Phone size={17} />

              <span>
                +92 300 1234567
              </span>
            </button>

            {/* Book Appointment */}
            <Link
              to="/book-appointment"
              className="
                px-5 py-2.5
                rounded-lg
                bg-[#0B63CE]
                text-white
                text-sm font-semibold
                shadow-sm
                hover:bg-[#0955AE]
                transition
              "
            >
              Book Appointment
            </Link>

            {/* Login */}
            <Link
              to="/login"
              className="
                px-5 py-2.5
                rounded-lg
                border border-[#0B63CE]
                text-[#0B63CE]
                text-sm font-semibold
                hover:bg-blue-50
                transition
              "
            >
              Login
            </Link>

          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="
              lg:hidden
              w-10 h-10
              rounded-lg
              border border-slate-200
              flex items-center justify-center
              text-slate-700
              hover:border-[#0B63CE]
              hover:text-[#0B63CE]
              transition
            "
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <X size={23} />
            ) : (
              <Menu size={23} />
            )}
          </button>

        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="lg:hidden border-t border-slate-100 py-5">

            <nav className="flex flex-col gap-1">

              {/* Home */}
              <Link
                to="/"
                onClick={() => setMenuOpen(false)}
                className="
                  px-4 py-3
                  rounded-lg
                  text-[#0B63CE]
                  font-medium
                  bg-blue-50
                "
              >
                Home
              </Link>

              {/* Doctors */}
              <a
                href="#doctors"
                onClick={() => setMenuOpen(false)}
                className="
                  px-4 py-3
                  rounded-lg
                  text-slate-600
                  font-medium
                  hover:bg-slate-50
                  hover:text-[#0B63CE]
                "
              >
                Doctors
              </a>

              {/* Services */}
              <a
                href="#services"
                onClick={() => setMenuOpen(false)}
                className="
                  px-4 py-3
                  rounded-lg
                  text-slate-600
                  font-medium
                  hover:bg-slate-50
                  hover:text-[#0B63CE]
                "
              >
                Services
              </a>

              {/* How It Works */}
              <a
                href="#how-it-works"
                onClick={() => setMenuOpen(false)}
                className="
                  px-4 py-3
                  rounded-lg
                  text-slate-600
                  font-medium
                  hover:bg-slate-50
                  hover:text-[#0B63CE]
                "
              >
                How It Works
              </a>

              {/* About */}
              <a
                href="#about"
                onClick={() => setMenuOpen(false)}
                className="
                  px-4 py-3
                  rounded-lg
                  text-slate-600
                  font-medium
                  hover:bg-slate-50
                  hover:text-[#0B63CE]
                "
              >
                About
              </a>

              {/* Mobile Phone */}
              <div className="mt-3 px-4">
                <button
                  className="
                    w-full
                    flex items-center justify-center gap-2
                    px-4 py-3
                    rounded-lg
                    border border-slate-200
                    text-slate-700
                    font-medium
                  "
                >
                  <Phone size={17} />

                  +92 300 1234567
                </button>
              </div>

              {/* Mobile Login */}
              <div className="px-4 mt-3">
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="
                    block
                    w-full
                    text-center
                    px-4 py-3
                    rounded-lg
                    border border-[#0B63CE]
                    text-[#0B63CE]
                    font-semibold
                  "
                >
                  Login
                </Link>
              </div>

              {/* Mobile Appointment */}
              <div className="px-4 mt-3">
                <Link
                  to="/book-appointment"
                  onClick={() => setMenuOpen(false)}
                  className="
                    block
                    w-full
                    text-center
                    px-4 py-3
                    rounded-lg
                    bg-[#0B63CE]
                    text-white
                    font-semibold
                  "
                >
                  Book Appointment
                </Link>
              </div>

            </nav>

          </div>
        )}

      </div>
    </header>
  );
}

export default Navbar;