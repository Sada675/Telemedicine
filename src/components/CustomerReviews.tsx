import { CheckCircle2, Quote, Star } from "lucide-react";

const reviews = [
  {
    name: "Ayesha Khan",
    role: "Patient",
    initials: "AK",
    review:
      "The consultation process was simple and convenient. I was able to speak with a doctor from home without the stress of travelling.",
  },
  {
    name: "Hamza Ali",
    role: "Patient",
    initials: "HA",
    review:
      "I really appreciated how smooth the appointment experience was. The doctor listened carefully and explained everything clearly.",
  },
  {
    name: "Sarah Ahmed",
    role: "Patient",
    initials: "SA",
    review:
      "A professional and easy-to-use healthcare experience. Booking my consultation and joining the video call was very straightforward.",
  },
];

function CustomerReviews() {
  return (
    <section
      id="reviews"
      className="bg-[#f8faf9] px-4 py-16 sm:px-6 lg:px-10 lg:py-20"
    >
      <div className="mx-auto max-w-6xl">

        {/* Section Heading */}
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="inline-flex rounded-full bg-[#e5f4f2] px-4 py-2 text-sm font-semibold text-[#245b5b]">
            Patient Reviews
          </span>

          <h2 className="mt-4 text-3xl font-bold leading-tight text-[#183b3b] sm:text-4xl">
            Our Customers{" "}
            <span className="text-highlight">love us</span>
          </h2>

          <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
            See what patients have to say about their experience with our
            online healthcare service.
          </p>
        </div>

        {/* Reviews */}
        <div className="grid gap-5 md:grid-cols-3">
          {reviews.map((review) => (
            <div
              key={review.name}
              className="
                group relative
                rounded-[26px]
                border border-slate-100
                bg-white
                p-6
                shadow-sm
                transition-all duration-300
                hover:-translate-y-1
                hover:shadow-xl
              "
            >
              {/* Quote Icon */}
              <div
                className="
                  absolute right-5 top-5
                  flex h-10 w-10
                  items-center justify-center
                  rounded-full
                  bg-[#e5f4f2]
                  text-[#2d7775]
                  transition-all duration-300
                  group-hover:bg-[#245b5b]
                  group-hover:text-white
                "
              >
                <Quote size={18} />
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={15}
                    className="fill-amber-400 text-amber-400"
                  />
                ))}
              </div>

              {/* Review */}
              <p className="mt-5 text-sm leading-7 text-slate-600">
                “{review.review}”
              </p>

              {/* Divider */}
              <div className="my-6 h-px bg-slate-100" />

              {/* Patient */}
              <div className="flex items-center gap-3">
                <div
                  className="
                    flex h-11 w-11 shrink-0
                    items-center justify-center
                    rounded-full
                    bg-[#dcefeb]
                    text-sm font-bold
                    text-[#245b5b]
                  "
                >
                  {review.initials}
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-bold text-[#183b3b]">
                      {review.name}
                    </p>

                    <CheckCircle2
                      size={14}
                      className="text-emerald-500"
                    />
                  </div>

                  <p className="mt-0.5 text-xs text-slate-400">
                    {review.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Trust Strip */}
        <div
          className="
            mx-auto mt-8
            flex max-w-3xl
            flex-col items-center justify-center
            gap-3
            rounded-[22px]
            border border-[#dcefeb]
            bg-white
            px-6 py-5
            text-center
            shadow-sm
            sm:flex-row
          "
        >
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={17}
                className="fill-amber-400 text-amber-400"
              />
            ))}
          </div>

          <p className="text-sm font-medium text-slate-600">
            A simple, professional and patient-focused healthcare experience.
          </p>
        </div>
      </div>
    </section>
  );
}

export default CustomerReviews;
