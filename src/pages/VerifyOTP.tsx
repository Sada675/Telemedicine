import { Link } from "react-router-dom";
import {
ArrowRight,
CheckCircle2,
Mail,
ShieldCheck,
Stethoscope,
} from "lucide-react";
import { useRef, useState } from "react";

function VerifyOTP() {
const [otp, setOtp] = useState(["", "", "", "", "", ""]);
const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

const handleChange = (value: string, index: number) => {
// Allow only one digit
const digit = value.replace(/\D/g, "").slice(-1);


const newOtp = [...otp];
newOtp[index] = digit;
setOtp(newOtp);

// Move to next input
if (digit && index < 5) {
  inputRefs.current[index + 1]?.focus();
}


};

const handleKeyDown = (
e: React.KeyboardEvent<HTMLInputElement>,
index: number
) => {
if (e.key === "Backspace" && !otp[index] && index > 0) {
inputRefs.current[index - 1]?.focus();
}
};

const handlePaste = (
e: React.ClipboardEvent<HTMLInputElement>
) => {
e.preventDefault();


const pastedData = e.clipboardData
  .getData("text")
  .replace(/\D/g, "")
  .slice(0, 6);

if (!pastedData) return;

const newOtp = [...otp];

pastedData.split("").forEach((digit, index) => {
  newOtp[index] = digit;
});

setOtp(newOtp);

const nextIndex = Math.min(pastedData.length, 5);
inputRefs.current[nextIndex]?.focus();


};

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
              Secure Verification
            </span>

            <h1 className="mt-6 text-4xl text-white font-bold leading-tight xl:text-5xl">
              One more step
              <span className="block text-highlight">
                to secure your account.
              </span>
            </h1>

            <p className="mt-5 text-sm leading-7 text-white/90 xl:text-base">
              Verify your email address to protect your account and keep
              your healthcare information secure.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-sm text-white/80">
          <ShieldCheck size={18} />
          Your healthcare information remains private and protected.
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
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#e5f4f2] text-[#245b5b]">
              <Mail size={30} />
            </div>

            <span className="mt-5 inline-flex rounded-full bg-[#e5f4f2] px-4 py-2 text-sm font-semibold text-[#245b5b]">
              Email Verification
            </span>

            <h2 className="mt-4 text-3xl font-bold text-[#183b3b] sm:text-4xl">
              Verify your email
            </h2>

            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-500">
              We have sent a 6-digit verification code to
            </p>

            <p className="mt-1 font-semibold text-[#536276]">
              example@email.com
            </p>
          </div>

          {/* OTP Form */}
          <form className="mt-9">

            <div className="flex justify-center gap-2 sm:gap-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(element) => {
                    inputRefs.current[index] = element;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) =>
                    handleChange(e.target.value, index)
                  }
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onPaste={handlePaste}
                  className="
                    h-12 w-11 rounded-xl
                    border border-slate-200
                    bg-slate-50
                    text-center text-xl font-bold text-[#183b3b]
                    outline-none transition
                    focus:border-[#536276]
                    focus:bg-white
                    focus:ring-4 focus:ring-[#536276]/10
                    sm:h-14 sm:w-14
                  "
                  aria-label={`OTP digit ${index + 1}`}
                />
              ))}
            </div>

            {/* Verify Button */}
            <button
              type="submit"
              className="
                mt-7 flex w-full items-center justify-center gap-2
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
              Verify Email
              <ArrowRight size={18} />
            </button>
          </form>

          {/* Resend */}
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-500">
              Didn't receive the code?
            </p>

            <button
              type="button"
              className="
                mt-2 text-sm font-semibold
                text-[#536276]
                transition
                hover:text-[#172b4d]
              "
            >
              Resend Code
            </button>
          </div>

          {/* Change Email */}
          <div className="mt-5 text-center">
            <Link
              to="/signup"
              className="text-sm font-semibold text-slate-500 no-underline hover:text-[#183b3b]"
            >
              ← Change email address
            </Link>
          </div>

          {/* Security Note */}
          <div className="mt-8 flex items-start gap-3 rounded-xl bg-[#f3f8f7] p-4">
            <CheckCircle2
              size={20}
              className="mt-0.5 shrink-0 text-[#245b5b]"
            />

            <p className="text-xs leading-5 text-slate-500">
              For your security, never share this verification code with
              anyone. The code will expire after a limited time.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>


);
}

export default VerifyOTP;
