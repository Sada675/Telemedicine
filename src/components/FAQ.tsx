import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "How can I book an online consultation?",
    answer:
      "Choose a doctor from our available specialists, view their available appointment slots, select a suitable time, provide your consultation reason, and complete the secure payment process.",
  },
  {
    question: "Can I consult with a doctor from another country?",
    answer:
      "Yes. Our platform supports patients from Pakistan and international locations. The consultation fee is displayed according to the patient's applicable country.",
  },
  {
    question: "How does the video consultation work?",
    answer:
      "After your appointment is confirmed, you can join the private video consultation from your appointment dashboard during the allowed joining window.",
  },
  {
    question: "When will my appointment be confirmed?",
    answer:
      "Your appointment is confirmed after the payment is successfully completed and verified by our system. You will then receive a confirmation notification.",
  },
  {
    question: "Will I receive a prescription after my consultation?",
    answer:
      "If the doctor determines that a prescription is appropriate, it can be prepared digitally and made available to you after the consultation.",
  },
  {
    question: "Is my medical information kept private?",
    answer:
      "Yes. Patient information and medical records are handled with privacy and security in mind. Access to medical information is restricted to authorized users.",
  },
];

function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faq"
      className="bg-slate-50 px-4 py-16 sm:px-6 lg:px-10 lg:py-20"
    >
      <div className="mx-auto max-w-4xl">

        {/* Heading */}
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <span className="inline-flex rounded-full bg-[#e5f4f2] px-4 py-2 text-sm font-semibold text-[#245b5b]">
            FAQ
          </span>

          <h2 className="mt-4 text-3xl font-bold leading-tight text-[#183b3b] sm:text-4xl">
            Frequently Asked{" "}
            <span className="text-highlight">Questions</span>
          </h2>

          <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
            Find quick answers to common questions about consultations,
            appointments, payments and prescriptions.
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={faq.question}
                className={`
                  overflow-hidden rounded-2xl
                  border
                  transition-all duration-300
                  ${
                    isOpen
                      ? "border-[#cfe8e5] bg-[#f8faf9] shadow-sm"
                      : "border-slate-100 bg-white hover:border-[#dcefeb]"
                  }
                `}
              >
                <button
                  type="button"
                  onClick={() => toggleFAQ(index)}
                  aria-expanded={isOpen}
                  className="
                    flex w-full
                    items-center justify-between
                    gap-4
                    px-5 py-5
                    text-left
                    sm:px-6
                  "
                >
                  <span
                    className={`
                      text-sm font-semibold
                      sm:text-base
                      ${
                        isOpen
                          ? "text-[#245b5b]"
                          : "text-[#183b3b]"
                      }
                    `}
                  >
                    {faq.question}
                  </span>

                  <span
                    className={`
                      flex h-8 w-8 shrink-0
                      items-center justify-center
                      rounded-full
                      transition-all duration-300
                      ${
                        isOpen
                          ? "bg-[#245b5b] text-white"
                          : "bg-[#e5f4f2] text-[#245b5b]"
                      }
                    `}
                  >
                    <ChevronDown
                      size={18}
                      className={`
                        transition-transform duration-300
                        ${isOpen ? "rotate-180" : ""}
                      `}
                    />
                  </span>
                </button>

                {/* Answer */}
                <div
                  className={`
                    grid transition-all duration-300
                    ${
                      isOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }
                  `}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 text-sm leading-7 text-slate-500 sm:px-6">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Message */}
        <div className="mt-8 rounded-2xl bg-[#f8faf9] px-5 py-4 text-center">
          <p className="text-sm text-slate-500">
            Still have questions?{" "}
            <span className="font-semibold text-[#245b5b]">
              Our healthcare team is here to help.
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}

export default FAQ;
