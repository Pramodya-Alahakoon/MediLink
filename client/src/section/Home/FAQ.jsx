import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiMinus } from "react-icons/fi";

const faqs = [
  {
    question: "How do I book an appointment with a doctor?",
    answer:
      "Simply browse our Find a Doctor page, select a specialist that suits your needs, and click the 'Book' button. Choose your preferred date and time slot, confirm your details, and you're all set. You'll receive a confirmation notification instantly.",
  },
  {
    question: "Is my medical data safe and private?",
    answer:
      "Absolutely. We use end-to-end encryption (AES-256 at rest, TLS 1.3+ in transit) for all medical records. Access is strictly role-based, and we never sell or share your data with third parties. Annual security audits ensure our standards remain the highest in the industry.",
  },
  {
    question: "What is the AI Symptom Checker and how accurate is it?",
    answer:
      "Our AI Symptom Checker is an informational tool that helps you understand potential conditions based on your symptoms. It uses advanced algorithms trained on medical literature to provide guidance — but it is not a substitute for professional medical advice. Always consult a licensed doctor for diagnosis and treatment.",
  },
  {
    question: "How do video consultations work?",
    answer:
      "After booking a telemedicine appointment, you'll receive a secure video link. At your scheduled time, join the call directly from your browser — no extra software needed. Your doctor can share prescriptions and notes digitally right after the session.",
  },
  {
    question: "What is the cancellation and refund policy?",
    answer:
      "Appointments cancelled at least 24 hours in advance are eligible for a full refund, processed within 5–7 business days. Cancellations made less than 24 hours before the appointment are non-refundable, unless the doctor initiated the cancellation.",
  },
  {
    question: "Are all doctors on MediLink verified?",
    answer:
      "Yes. Every doctor on our platform undergoes a rigorous verification process including identity checks, medical license validation, and credential review. Only approved doctors appear in search results, so you can book with confidence.",
  },
];

function FAQItem({ faq, isOpen, onToggle }) {
  return (
    <div className="border border-slate-100 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900/80 overflow-hidden transition-colors duration-300">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left group"
      >
        <span className="text-[15px] font-semibold text-slate-800 dark:text-white leading-snug group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
          {faq.question}
        </span>
        <span
          className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 ${
            isOpen
              ? "bg-teal-500 text-white rotate-0"
              : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
          }`}
        >
          {isOpen ? <FiMinus size={16} /> : <FiPlus size={16} />}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="px-6 pb-5 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              {faq.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="py-20 lg:py-28 bg-[#F8FAFB] dark:bg-slate-900 transition-colors duration-300">
      <div className="container mx-auto px-5 sm:px-8 lg:px-16 xl:px-20">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-teal-600 dark:text-teal-400 mb-3">
              FAQ
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-manrope text-slate-900 dark:text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base max-w-lg mx-auto">
              Everything you need to know about MediLink. Can't find your
              answer?{" "}
              <a
                href="/contact"
                className="text-teal-600 dark:text-teal-400 font-medium hover:underline"
              >
                Contact us
              </a>
            </p>
          </motion.div>

          {/* FAQ List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="space-y-3"
          >
            {faqs.map((faq, i) => (
              <FAQItem
                key={i}
                faq={faq}
                isOpen={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
