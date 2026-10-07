import { Link } from "react-router-dom";
import { ArrowUp, Mail, MapPin, Phone } from "lucide-react";

function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const services = [
    "Acid Base Disbalance",
    "Acute Kidney Injury",
    "Chronic Ambulatory Peritoneal Dialysis",
    "Chronic Kidney Disease",
    "Diabetes Management",
    "Kidney Health Consultation",
  ];

  return (
    <footer className="bg-[#1b5775] text-white">
      {/* ================= MAIN FOOTER ================= */}
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-10 lg:py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1.4fr_1.2fr]">

          {/* ================= BRAND ================= */}
          <div>
            <Link
              to="/"
              className="inline-flex items-center gap-2 no-underline"
            >
              {/* Logo */}
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0B63CE]">
                <span className="text-xl font-bold text-white">+</span>
              </div>

              {/* Brand */}
              <div className="leading-tight">
                <h1 className="text-xl font-bold tracking-tight text-white">
                  Telemedicine
                </h1>

                <p className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.18em] text-white/80">
                  Online Healthcare
                </p>
              </div>
            </Link>

            <p className="mt-6 max-w-sm text-sm leading-7 text-white/85">
              Connecting patients with trusted doctors through convenient,
              secure and professional online healthcare consultations.
            </p>

            {/* ================= SOCIAL ICONS ================= */}
            <div className="mt-7 flex items-center gap-3">

              {/* FACEBOOK */}
              <a
                href="#"
                aria-label="Facebook"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-8 w-8"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="12" fill="#1877F2" />
                  <path
                    fill="#FFFFFF"
                    d="M14 12h-1.5v6h-2.5v-6H8.5V9.8h1.5V8.3c0-2 1.2-3.3 3.2-3.3.9 0 1.8.1 1.8.1v2h-1c-1 0-1.3.6-1.3 1.2v1.5h2.3L14 12z"
                  />
                </svg>
              </a>

              {/* INSTAGRAM */}
              <a
                href="#"
                aria-label="Instagram"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-8 w-8"
                  aria-hidden="true"
                >
                  <defs>
                    <radialGradient
                      id="instaGrad"
                      cx="20%"
                      cy="100%"
                      r="100%"
                      fx="20%"
                      fy="100%"
                    >
                      <stop offset="0%" stopColor="#ffd600" />
                      <stop offset="20%" stopColor="#ff0100" />
                      <stop offset="40%" stopColor="#d800b1" />
                      <stop offset="100%" stopColor="#b800b1" />
                    </radialGradient>
                  </defs>
                  <circle cx="12" cy="12" r="12" fill="url(#instaGrad)" />
                  <rect
                    x="6.5"
                    y="6.5"
                    width="11"
                    height="11"
                    rx="3"
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth="1.5"
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r="2.8"
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth="1.5"
                  />
                  <circle cx="15" cy="9" r="0.8" fill="#FFFFFF" />
                </svg>
              </a>

             {/* LINKEDIN */}
<a
  href="#"
  aria-label="LinkedIn"
  className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
>
  <svg
    viewBox="0 0 24 24"
    className="h-8 w-8"
    aria-hidden="true"
  >
    {/* Rect ki jagah Circle shape update ki hai */}
    <circle cx="12" cy="12" r="12" fill="#0A66C2" />
    <path
      fill="#FFFFFF"
      d="M5.5 8.5h3v10h-3v-10zm1.5-4.5a1.75 1.75 0 110 3.5 1.75 1.75 0 010-3.5zm4.5 4.5h2.8v1.4h.04c.39-.74 1.34-1.52 2.76-1.52 2.95 0 3.5 1.94 3.5 4.47V18.5h-3v-5.2c0-1.24-.02-2.83-1.73-2.83-1.73 0-2 1.35-2 2.74v5.29h-3v-10z"
    />
  </svg>
</a>

            </div>
          </div>

          {/* ================= QUICK LINKS ================= */}
          <div>
            <h3 className="text-base font-semibold tracking-wide text-white">
              Quick Links
            </h3>

            <ul className="mt-6 space-y-3.5">
              <li>
                <a
                  href="#"
                  className="text-sm text-white/80 no-underline transition-colors hover:text-white"
                >
                  Home
                </a>
              </li>

              <li>
                <a
                  href="#doctors"
                  className="text-sm text-white/80 no-underline transition-colors hover:text-white"
                >
                  Our Doctors
                </a>
              </li>

              <li>
                <a
                  href="#services"
                  className="text-sm text-white/80 no-underline transition-colors hover:text-white"
                >
                  Services
                </a>
              </li>

              <li>
                <a
                  href="#how-it-works"
                  className="text-sm text-white/80 no-underline transition-colors hover:text-white"
                >
                  How It Works
                </a>
              </li>

              <li>
                <a
                  href="#reviews"
                  className="text-sm text-white/80 no-underline transition-colors hover:text-white"
                >
                  Patient Reviews
                </a>
              </li>

              <li>
                <a
                  href="#faq"
                  className="text-sm text-white/80 no-underline transition-colors hover:text-white"
                >
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* ================= SERVICES ================= */}
          <div>
            <h3 className="text-base font-semibold tracking-wide text-white">
              Services
            </h3>

            <ul className="mt-6 space-y-3.5">
              {services.map((service) => (
                <li key={service}>
                  <a
                    href="#services"
                    className="text-sm leading-6 text-white/80 no-underline transition-colors hover:text-white"
                  >
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ================= CONTACT ================= */}
          <div>
            <h3 className="text-base font-semibold tracking-wide text-white">
              Contact Us
            </h3>

            <div className="mt-6 space-y-5">

              {/* Location */}
              <div className="flex items-start gap-3">
                <MapPin
                  size={18}
                  className="mt-0.5 shrink-0 text-white"
                />

                <p className="text-sm leading-6 text-white/80">
                  Pakistan
                </p>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-3">
                <Phone
                  size={18}
                  className="shrink-0 text-white"
                />

                <a
                  href="tel:+923000000000"
                  className="text-sm text-white/80 no-underline transition-colors hover:text-white"
                >
                  +92 300 0000000
                </a>
              </div>

              {/* Email */}
              <div className="flex items-center gap-3">
                <Mail
                  size={18}
                  className="shrink-0 text-white"
                />

                <a
                  href="mailto:info@example.com"
                  className="break-all text-sm text-white/80 no-underline transition-colors hover:text-white"
                >
                  info@example.com
                </a>
              </div>
            </div>

            {/* Book Appointment */}
            <button
              className="mt-7 rounded-full btn-dark px-6 py-3 text-sm font-semibold text-[#2596be] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
            >
              Book Appointment
            </button>
          </div>
        </div>
      </div>

      {/* ================= BOTTOM BAR ================= */}
      <div className="border-t border-white/20">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-5 text-center sm:flex-row sm:px-6 lg:px-10">

          <p className="text-xs text-white/75">
            © 2026 Telemedicine. All rights reserved.
          </p>

          <div className="flex items-center gap-5">
            <a
              href="#"
              className="text-xs text-white/75 no-underline transition-colors hover:text-white"
            >
              Privacy Policy
            </a>

            <a
              href="#"
              className="text-xs text-white/75 no-underline transition-colors hover:text-white"
            >
              Terms & Conditions
            </a>

            {/* Back To Top */}
            <button
              onClick={scrollToTop}
              aria-label="Back to top"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#2596be] transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              <ArrowUp size={16} />
            </button>
          </div>

        </div>
      </div>
    </footer>
  );
}

export default Footer;