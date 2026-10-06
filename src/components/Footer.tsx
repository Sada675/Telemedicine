import {
  ArrowUp,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="bg-[#102f3a] text-white">

      {/* Main Footer */}
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-10 lg:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr]">

          {/* Brand */}
          <div>
            <a
              href="#"
              className="inline-flex items-center gap-2 no-underline"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2d7775]">
                <span className="text-lg font-bold">H</span>
              </div>

              <div>
                <p className="text-lg font-bold tracking-tight">
                  HealthCare
                </p>

                <p className="text-[10px] uppercase tracking-[0.2em] text-white/45">
                  Online Healthcare
                </p>
              </div>
            </a>

            <p className="mt-5 max-w-sm text-sm leading-7 text-white/60">
              Connecting patients with trusted doctors through convenient,
              secure and professional online healthcare consultations.
            </p>

            {/* Social Links */}
            <div className="mt-6 flex items-center gap-2">

              {/* Facebook */}
              <a
                href="#"
                aria-label="Facebook"
                className="
                  flex h-9 w-9 items-center justify-center
                  rounded-full bg-white/10
                  text-sm font-bold text-white/65
                  no-underline
                  transition-all duration-300
                  hover:bg-[#2d7775]
                  hover:text-white
                "
              >
                f
              </a>

              {/* Instagram */}
              <a
                href="#"
                aria-label="Instagram"
                className="
                  flex h-9 w-9 items-center justify-center
                  rounded-full bg-white/10
                  text-xs font-bold text-white/65
                  no-underline
                  transition-all duration-300
                  hover:bg-[#2d7775]
                  hover:text-white
                "
              >
                ig
              </a>

              {/* LinkedIn */}
              <a
                href="#"
                aria-label="LinkedIn"
                className="
                  flex h-9 w-9 items-center justify-center
                  rounded-full bg-white/10
                  text-xs font-bold text-white/65
                  no-underline
                  transition-all duration-300
                  hover:bg-[#2d7775]
                  hover:text-white
                "
              >
                in
              </a>

            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold text-white">
              Quick Links
            </h3>

            <ul className="mt-5 space-y-3">
              <li>
                <a
                  href="#"
                  className="text-sm text-white/55 no-underline transition-colors hover:text-white"
                >
                  Home
                </a>
              </li>

              <li>
                <a
                  href="#doctors"
                  className="text-sm text-white/55 no-underline transition-colors hover:text-white"
                >
                  Our Doctors
                </a>
              </li>

              <li>
                <a
                  href="#services"
                  className="text-sm text-white/55 no-underline transition-colors hover:text-white"
                >
                  Services
                </a>
              </li>

              <li>
                <a
                  href="#how-it-works"
                  className="text-sm text-white/55 no-underline transition-colors hover:text-white"
                >
                  How It Works
                </a>
              </li>

              <li>
                <a
                  href="#reviews"
                  className="text-sm text-white/55 no-underline transition-colors hover:text-white"
                >
                  Patient Reviews
                </a>
              </li>

              <li>
                <a
                  href="#faq"
                  className="text-sm text-white/55 no-underline transition-colors hover:text-white"
                >
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-bold text-white">
              Services
            </h3>

            <ul className="mt-5 space-y-3">
              <li>
                <a
                  href="#services"
                  className="text-sm text-white/55 no-underline transition-colors hover:text-white"
                >
                  Online Consultation
                </a>
              </li>

              <li>
                <a
                  href="#services"
                  className="text-sm text-white/55 no-underline transition-colors hover:text-white"
                >
                  Video Consultation
                </a>
              </li>

              <li>
                <a
                  href="#services"
                  className="text-sm text-white/55 no-underline transition-colors hover:text-white"
                >
                  Digital Prescriptions
                </a>
              </li>

              <li>
                <a
                  href="#services"
                  className="text-sm text-white/55 no-underline transition-colors hover:text-white"
                >
                  Secure Payments
                </a>
              </li>

              <li>
                <a
                  href="#services"
                  className="text-sm text-white/55 no-underline transition-colors hover:text-white"
                >
                  Follow-up Care
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-bold text-white">
              Contact Us
            </h3>

            <div className="mt-5 space-y-4">

              {/* Location */}
              <div className="flex items-start gap-3">
                <MapPin
                  size={17}
                  className="mt-0.5 shrink-0 text-[#63b9b3]"
                />

                <p className="text-sm leading-6 text-white/55">
                  Pakistan
                </p>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-3">
                <Phone
                  size={17}
                  className="shrink-0 text-[#63b9b3]"
                />

                <a
                  href="tel:+923000000000"
                  className="text-sm text-white/55 no-underline transition-colors hover:text-white"
                >
                  +92 300 0000000
                </a>
              </div>

              {/* Email */}
              <div className="flex items-center gap-3">
                <Mail
                  size={17}
                  className="shrink-0 text-[#63b9b3]"
                />

                <a
                  href="mailto:info@example.com"
                  className="break-all text-sm text-white/55 no-underline transition-colors hover:text-white"
                >
                  info@example.com
                </a>
              </div>

            </div>

            {/* Book Appointment */}
            <button
              className="
                mt-6 rounded-full
                bg-[#2d7775]
                px-5 py-2.5
                text-sm font-semibold text-white
                transition-all duration-300
                hover:-translate-y-0.5
                hover:bg-[#3b8986]
              "
            >
              Book Appointment
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div
          className="
            mx-auto flex max-w-6xl
            flex-col items-center
            justify-between gap-4
            px-4 py-5
            text-center
            sm:flex-row sm:px-6
            lg:px-10
          "
        >

          {/* Copyright */}
          <p className="text-xs text-white/40">
            © 2026 HealthCare. All rights reserved.
          </p>

          {/* Legal + Back To Top */}
          <div className="flex items-center gap-5">

            <a
              href="#"
              className="text-xs text-white/40 no-underline transition-colors hover:text-white"
            >
              Privacy Policy
            </a>

            <a
              href="#"
              className="text-xs text-white/40 no-underline transition-colors hover:text-white"
            >
              Terms & Conditions
            </a>

            <button
              onClick={scrollToTop}
              aria-label="Back to top"
              className="
                flex h-8 w-8
                items-center justify-center
                rounded-full
                bg-white/10
                text-white/60
                transition-all duration-300
                hover:bg-[#2d7775]
                hover:text-white
              "
            >
              <ArrowUp size={15} />
            </button>

          </div>
        </div>
      </div>

    </footer>
  );
}

export default Footer;
