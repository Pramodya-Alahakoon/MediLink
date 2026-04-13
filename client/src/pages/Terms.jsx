import { motion } from "framer-motion";
import { FiFileText, FiArrowRight } from "react-icons/fi";
import { Link } from "react-router-dom";

const lastUpdated = "April 13, 2026";

const sections = [
  {
    id: "acceptance",
    title: "1. Acceptance of Terms",
    content: [
      "By accessing or using MediLink Cloud (the \"Service\"), you confirm that you are at least 18 years of age (or the age of majority in your jurisdiction), and that you agree to be bound by these Terms of Service.",
      "If you access the Service on behalf of an organisation, you represent that you have authority to bind that organisation to these Terms.",
      "If you do not agree to these Terms, you must discontinue use of the Service immediately.",
    ],
  },
  {
    id: "account",
    title: "2. Account Registration & Security",
    content: [
      "You must provide accurate, current, and complete information during registration and keep your account information up to date.",
      "You are solely responsible for maintaining the confidentiality of your password and for all activities that occur under your account.",
      "You must immediately notify us at support@medilink.cloud if you suspect unauthorised access to your account.",
      "MediLink reserves the right to suspend or terminate accounts that provide false information or violate these Terms.",
    ],
  },
  {
    id: "medical-disclaimer",
    title: "3. Medical Disclaimer",
    content: [
      "MediLink Cloud is a **technology platform** that facilitates connections between patients and independent, licensed healthcare providers. We are not a medical provider.",
      "The AI Symptom Checker is an **informational tool only** and does not constitute medical advice, diagnosis, or treatment. Always consult a qualified physician for medical concerns.",
      "In a medical emergency, **call your local emergency services immediately**. Do not rely on MediLink for emergency care.",
      "Doctors on the platform are independent contractors, not employees of MediLink Cloud. Responsibility for clinical decisions rests with the individual healthcare provider.",
    ],
  },
  {
    id: "permitted-use",
    title: "4. Permitted Use",
    content: [
      "You may use the Service solely for lawful purposes and in accordance with these Terms.",
      "You agree **not** to: impersonate any person; distribute spam, malware, or harmful code; attempt to gain unauthorised access to any system; scrape or harvest platform data; or use the Service for commercial purposes not authorised by MediLink.",
      "You agree not to post or transmit content that is unlawful, defamatory, obscene, or that infringes any third-party intellectual property rights.",
    ],
  },
  {
    id: "payments",
    title: "5. Payments, Cancellations & Refunds",
    content: [
      "All fees are stated in Sri Lankan Rupees (LKR) or USD at the time of booking and are inclusive of applicable taxes unless stated otherwise.",
      "Appointments cancelled at least **24 hours** in advance are eligible for a full refund to the original payment method, processed within 5–7 business days.",
      "Cancellations made **less than 24 hours** before the appointment are non-refundable, unless the cancellation was initiated by the doctor.",
      "MediLink reserves the right to modify pricing at any time with at least 14 days' notice to registered users.",
      "Disputes regarding charges must be raised within 30 days of the transaction date via support@medilink.cloud.",
    ],
  },
  {
    id: "ip",
    title: "6. Intellectual Property",
    content: [
      "All content on MediLink Cloud — including the platform design, source code, AI models, brand assets, and written content — is the exclusive property of MediLink Cloud and its licensors.",
      "You may not reproduce, distribute, modify, or create derivative works of any platform content without explicit written permission.",
      "Feedback and suggestions you provide may be used by MediLink without restriction or compensation.",
    ],
  },
  {
    id: "limitation",
    title: "7. Limitation of Liability",
    content: [
      "To the maximum extent permitted by applicable law, MediLink Cloud shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Service.",
      "Our total liability to you for any claim arising from these Terms or your use of the Service shall not exceed the total fees paid by you to MediLink in the 12 months preceding the claim.",
      "Nothing in these Terms limits liability for death or personal injury caused by negligence, fraud, or any other liability that cannot be excluded by law.",
    ],
  },
  {
    id: "termination",
    title: "8. Termination",
    content: [
      "You may delete your account at any time through the Account Settings page. Deletion takes effect within 30 days, subject to legal retention obligations.",
      "MediLink reserves the right to suspend or terminate your access at any time, with or without notice, for conduct that violates these Terms or is otherwise harmful to the platform or its users.",
      "Upon termination, your right to use the Service ceases immediately. Provisions that by their nature should survive termination shall survive.",
    ],
  },
  {
    id: "governing-law",
    title: "9. Governing Law & Dispute Resolution",
    content: [
      "These Terms are governed by the laws of the Democratic Socialist Republic of Sri Lanka.",
      "Any disputes shall first be attempted to be resolved amicably through direct negotiation. If unresolved within 30 days, disputes shall be submitted to binding arbitration under the applicable rules of the Sri Lanka National Arbitration Centre.",
      "Nothing prevents either party from seeking injunctive or other equitable relief from a court of competent jurisdiction.",
    ],
  },
  {
    id: "changes",
    title: "10. Changes to These Terms",
    content: [
      "We may revise these Terms at any time. Material changes will be communicated via email and an in-app notice at least 30 days before they take effect.",
      "Your continued use of the Service after the effective date of any revision constitutes your acceptance of the updated Terms.",
      "We encourage you to review these Terms periodically.",
    ],
  },
];

function renderContent(text) {
  return text.split(/\*\*(.*?)\*\*/g).map((part, i) =>
    i % 2 === 1 ? <strong key={i} className="text-tertiary dark:text-white font-semibold">{part}</strong> : part
  );
}

function Terms() {
  return (
    <main className="bg-[#F8FAFB] dark:bg-slate-900 overflow-x-hidden transition-colors duration-300">
      {/* ── HERO ── */}
      <section className="relative pt-36 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-tertiary via-[#0c3756] to-primary opacity-95" />
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(white 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[900px] h-[300px] bg-primary/30 rounded-full blur-[100px]" />
        <div className="container mx-auto px-5 sm:px-8 lg:px-16 xl:px-20 relative z-10 text-center text-white">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-xs font-bold font-inter tracking-widest text-primary/90 uppercase mb-6">
            <FiFileText className="w-3.5 h-3.5" /> Terms of Service
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl sm:text-5xl font-extrabold font-manrope leading-tight mb-5">
            Clear Terms for a<br />
            <span className="text-primary/90">Trusted Relationship.</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-white/60 font-inter text-sm">
            Last updated: {lastUpdated}
          </motion.p>
        </div>
      </section>

      {/* ── CONTENT ── */}
      <section className="py-16">
        <div className="container mx-auto px-5 sm:px-8 lg:px-16 xl:px-20">
          <div className="flex flex-col lg:flex-row gap-10">

            {/* Sticky Table of Contents */}
            <aside className="w-full lg:w-64 flex-shrink-0">
              <div className="lg:sticky lg:top-28 bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 p-6 shadow-sm transition-colors duration-300">
                <p className="text-xs font-bold font-inter uppercase tracking-widest text-neutral dark:text-slate-400 mb-4">On this page</p>
                <nav className="space-y-1">
                  {sections.map((s) => (
                    <a key={s.id} href={`#${s.id}`} className="block text-sm font-inter text-neutral dark:text-slate-400 hover:text-primary dark:hover:text-primary hover:bg-primary/5 rounded-lg px-3 py-2 transition-all">
                      {s.title}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {/* Intro callout */}
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="bg-primary/5 dark:bg-primary/10 border border-primary/20 dark:border-primary/30 rounded-2xl p-6 mb-8 transition-colors duration-300"
              >
                <p className="text-tertiary dark:text-slate-200 font-inter text-sm leading-relaxed">
                  These Terms of Service ("Terms") govern your access to and use of MediLink Cloud, its AI tools, patient portal, and booking services (collectively, the "Service"). Please read them carefully before using the platform.
                </p>
              </motion.div>

              <div className="space-y-6">
                {sections.map((section, i) => (
                  <motion.div key={section.id} id={section.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }}
                    className="bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 p-7 sm:p-8 hover:border-primary/10 dark:hover:border-primary/30 transition-colors duration-300"
                  >
                    <h2 className="text-lg font-extrabold font-manrope text-tertiary dark:text-white mb-4">{section.title}</h2>
                    <ul className="space-y-3">
                      {section.content.map((c, j) => (
                        <li key={j} className="flex items-start gap-3">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                          <p className="text-neutral dark:text-slate-400 font-inter text-sm leading-relaxed">{renderContent(c)}</p>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>

              {/* Bottom contact */}
              <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                className="mt-8 bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 p-7 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 transition-colors duration-300"
              >
                <div>
                  <p className="font-bold font-manrope text-tertiary dark:text-white mb-1">Questions about our Terms?</p>
                  <p className="text-sm text-neutral dark:text-slate-400 font-inter">Contact our legal team at <a href="mailto:legal@medilink.cloud" className="text-primary hover:underline">legal@medilink.cloud</a></p>
                </div>
                <Link to="/contact">
                  <button className="group flex items-center gap-2 text-primary font-semibold font-inter text-sm whitespace-nowrap hover:gap-3 transition-all">
                    Contact Us <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Terms;
