import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface BookAppointmentButtonProps {
  className?: string;
}

function BookAppointmentButton({
  className = "",
}: BookAppointmentButtonProps) {
  return (
    <Link
      to="/book-appointment"
      className={`
        mt-3 inline-flex items-center gap-1
        rounded-full bg-white
        px-3.5 py-2
        text-[10px] font-semibold text-[#19304f]
        shadow-lg transition-all duration-300
        hover:-translate-y-1 hover:shadow-xl

        sm:mt-4 sm:gap-1.5 sm:px-5 sm:py-2.5 sm:text-xs

        lg:mt-7 lg:gap-2 lg:px-6 lg:py-3.5 lg:text-sm

        ${className}
      `}
    >
      Book Appointment

      <ArrowRight
        size={13}
        className="sm:h-4 sm:w-4 lg:h-[18px] lg:w-[18px]"
      />
    </Link>
  );
}

export default BookAppointmentButton;