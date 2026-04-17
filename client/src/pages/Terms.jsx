import { motion } from "framer-motion";
import {
  FiFileText,
  FiArrowRight,
  FiUserCheck,
  FiAlertTriangle,
  FiCheckCircle,
  FiCreditCard,
  FiCopy,
  FiAlertOctagon,
  FiXCircle,
  FiMapPin,
  FiRefreshCw,
} from "react-icons/fi";
import { Link } from "react-router-dom";

const lastUpdated = "April 17, 2026";

const sectionIcons = {
  acceptance: FiCheckCircle,
  account: FiUserCheck,
  "medical-disclaimer": FiAlertTriangle,
  "permitted-use": FiFileText,
  payments: FiCreditCard,
  ip: FiCopy,
  limitation: FiAlertOctagon,
  termination: FiXCircle,
  "governing-law": FiMapPin,
  changes: FiRefreshCw,
};

const sections = [
  {
    id: "acceptance",
    title: "Acceptance of Terms",
    content: [
      'By accessing or using MediLink Cloud (the "Service"), you confirm that you are at least 18 years of age (or the age of majority in your jurisdiction), and that you agree to be bound by these Terms of Service.',
      "If you access the Service on behalf of an organisation, you represent that you have authority to bind that organisation to these Terms.",
      "If you do not agree to these Terms, you must discontinue use of the Service immediately.",
    ],
  },
  {
    id: "account",
    title: "Account Registration & Security",
    content: [
      "You must provide accurate, current, and complete information during registration and keep your account information up to date.",
      "You are solely responsible for maintaining the confidentiality of your password and for all activities that occur under your account.",
      "You must immediately notify us at **support@medilink.cloud** if you suspect unauthorised access to your account.",
      "MediLink reserves the right to suspend or terminate accounts that provide false information or violate these Terms.",
    ],
  },
  {
    id: "medical-disclaimer",
    title: "Medical Disclaimer",
    content: [
      "MediLink Cloud is a **technology platform** that facilitates connections between patients and independent, licensed healthcare providers. We are not a medical provider.",
      "The AI Symptom Checker is an **informational tool only** and does not constitute medical advice, diagnosis, or treatment. Always consult a qualified physician for medical concerns.",
      "In a medical emergency, **call your local emergency services immediately**. Do not rely on MediLink for emergency care.",
      "Doctors on the platform are independent contractors, not employees of MediLink Cloud. Responsibility for clinical decisions rests with the individual healthcare provider.",
    ],
  },
  {
    id: "permitted-use",
    title: "Permitted Use",
    content: [
      "You may use the Service solely for lawful purposes and in accordance with these Terms.",
      "You agree **not** to — impersonate any person; distribute spam, malware, or harmful code; attempt to gain unauthorised access to any system; scrape or harvest platform data; or use the Service for commercial purposes not authorised by MediLink.",
      "You agree not to post or transmit content that is unlawful, defamatory, obscene, or that infringes any third-party intellectual property rights.",
    ],
  },
  {
    id: "payments",
    title: "Payments, Cancellations & Refunds",
    content: [
      "All fees are stated in Sri Lankan Rupees (LKR) or USD at the time of booking and are inclusive of applicable taxes unless stated otherwise.",
      "Appointments cancelled at least **24 hours** in advance are eligible for a full refund to the original payment method, processed within 5–7 business days.",
      "Cancellations made **less than 24 hours** before the appointment are non-refundable, unless the cancellation was initiated by the doctor.",
      "MediLink reserves the right to modify pricing at any time with at least 14 days' notice to registered users.",
      "Disputes regarding charges must be raised within 30 days of the transaction date via **support@medilink.cloud**.",
    ],
  },
  {
    id: "ip",
    title: "Intellectual Property",
    content: [
      "All content on MediLink Cloud — including the platform design, source code, AI models, brand assets, and written content — is the exclusive property of MediLink Cloud and its licensors.",
      "You may not reproduce, distribute, modify, or create derivative works of any platform content without explicit written permission.",
      "Feedback and suggestions you provide may be used by MediLink without restriction or compensation.",
    ],
  },
  {
    id: "limitation",
    title: "Limitation of Liability",
    content: [
      "To the maximum extent permitted by applicable law, MediLink Cloud shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Service.",
      "Our total liability to you for any claim arising from these Terms or your use of the Service shall not exceed the total fees paid by you to MediLink in the **12 months** preceding the claim.",
      "Nothing in these Terms limits liability for death or personal injury caused by negligence, fraud, or any other liability that cannot be excluded by law.",
    ],
  },
  {
    id: "termination",
    title: "Termination",
    content: [
      "You may delete your account at any time through the Account Settings page. Deletion takes effect within **30 days**, subject to legal retention obligations.",
      "MediLink reserves the right to suspend or terminate your access at any time, with or without notice, for conduct that violates these Terms or is otherwise harmful to the platform or its users.",
      "Upon termination, your right to use the Service ceases immediately. Provisions that by their nature should survive termination shall survive.",
    ],
  },
  {
    id: "governing-law",
    title: "Governing Law & Dispute Resolution",
    content: [
      "These Terms are governed by the laws of the Democratic Socialist Republic of Sri Lanka.",
      "Any disputes shall first be attempted to be resolved amicably through direct negotiation. If unresolved within **30 days**, disputes shall be submitted to binding arbitration under the applicable rules of the Sri Lanka National Arbitration Centre.",
      "Nothing prevents either party from seeking injunctive or other equitable relief from a court of competent jurisdiction.",
    ],
  },
  {
    id: "changes",
    title: "Changes to These Terms",
    content: [
      "We may revise these Terms at any time. Material changes will be communicated via email and an in-app notice at least **30 days** before they take effect.",
      "Your continued use of the Service after the effective date of any revision constitutes your acceptance of the updated Terms.",
      "We encourage you to review these Terms periodically.",
    ],
  },
];

function renderContent(text) {
  return text.split(/\*\*(.*?)\*\*/g).map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="text-gray-900 dark:text-white font-semibold">
        {part}
      </strong>
    ) : (
      part
    ),
  );
}

function Terms() {
  return (
    <main className="bg-[#F8FAFB] dark:bg-slate-900 overflow-x-hidden transition-colors duration-300">
      {/* ── HERO ── */}
      <section className="relative pt-36 pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-[#0c3756] to-teal-900 dark:from-slate-950 dark:via-[#0a2a42] dark:to-teal-950" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(white 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[250px] bg-teal-500/20 rounded-full blur-[120px]" />
        <div className="container mx-auto px-5 sm:px-8 lg:px-16 xl:px-20 relative z-10 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2.5 bg-white/10 backdrop-blur-sm border border-white/15 rounded-full px-5 py-2 text-xs font-bold font-inter tracking-[0.2em] uppercase mb-8"
          >
            <FiFileText className="w-4 h-4 text-teal-300" /> Terms of Service
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-manrope leading-[1.1] mb-6"
          >
            Clear Terms for a
            <br />
            <span className="bg-gradient-to-r from-teal-300 to-cyan-300 bg-clip-text text-transparent">
              Trusted Relationship.
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.16 }}
            className="text-white/50 font-inter text-sm max-w-lg mx-auto"
          >
            Last updated: {lastUpdated} · Effective immediately for new users
          </motion.p>
        </div>
      </section>

      {/* ── CONTENT ── */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-5 sm:px-8 lg:px-16 xl:px-20">
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Sticky TOC */}
            <aside className="w-full lg:w-72 flex-shrink-0">
              <div className="lg:sticky lg:top-28 bg-white dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-gray-100 dark:border-slate-700/60 p-5 shadow-sm transition-colors duration-300">
                <p className="text-[10px] font-bold font-inter uppercase tracking-[0.25em] text-gray-400 dark:text-slate-500 mb-4">
                  Contents
                </p>
                <nav className="space-y-0.5">
                  {sections.map((s) => {
                    const Icon = sectionIcons[s.id];
                    return (
                      <a
                        key={s.id}
                        href={`#${s.id}`}
                        className="group flex items-center gap-3 text-[13px] font-inter text-gray-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/20 rounded-xl px-3 py-2.5 transition-all"
                      >
                        <Icon className="w-3.5 h-3.5 flex-shrink-0 text-gray-400 dark:text-slate-500 group-hover:text-teal-500 dark:group-hover:text-teal-400 transition-colors" />
                        <span className="truncate">{s.title}</span>
                      </a>
                    );
                  })}
                </nav>
              </div>
            </aside>

            {/* Main */}
            <div className="flex-1 min-w-0">
              {/* Intro */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="relative bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/15 border border-teal-200/50 dark:border-teal-700/30 rounded-2xl p-6 sm:p-7 mb-10 transition-colors duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-teal-500/10 dark:bg-teal-400/10 flex items-center justify-center">
                    <FiFileText className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                  </div>
                  <p className="text-gray-700 dark:text-slate-300 font-inter text-sm leading-relaxed">
                    These Terms of Service ("Terms") govern your access to and
                    use of MediLink Cloud, its AI tools, patient portal, and
                    booking services (collectively, the "Service"). Please read
                    them carefully before using the platform.
                  </p>
                </div>
              </motion.div>

              {/* Sections */}
              <div className="space-y-5">
                {sections.map((section, i) => {
                  const Icon = sectionIcons[section.id];
                  return (
                    <motion.div
                      key={section.id}
                      id={section.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.03 }}
                      className="group bg-white dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-gray-100 dark:border-slate-700/60 p-6 sm:p-7 hover:border-teal-200/60 dark:hover:border-teal-600/30 hover:shadow-lg hover:shadow-teal-500/[0.03] transition-all duration-300"
                    >
                      <div className="flex items-center gap-3.5 mb-5">
                        <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center shadow-sm">
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold font-inter uppercase tracking-[0.2em] text-teal-600 dark:text-teal-400">
                            Section {String(i + 1).padStart(2, "0")}
                          </p>
                          <h2 className="text-base font-bold font-manrope text-gray-900 dark:text-white leading-tight">
                            {section.title}
                          </h2>
                        </div>
                      </div>
                      <ul className="space-y-3 pl-[3.25rem]">
                        {section.content.map((c, j) => (
                          <li key={j} className="flex items-start gap-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 dark:bg-teal-500 mt-[7px] flex-shrink-0" />
                            <p className="text-gray-600 dark:text-slate-400 font-inter text-[13px] leading-relaxed">
                              {renderContent(c)}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  );
                })}
              </div>

              {/* Contact */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="mt-10 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl p-7 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5"
              >
                <div>
                  <p className="font-bold font-manrope text-white text-lg mb-1">
                    Questions About Our Terms?
                  </p>
                  <p className="text-sm text-white/80 font-inter">
                    Contact our legal team at{" "}
                    <a
                      href="mailto:legal@medilink.cloud"
                      className="text-white underline underline-offset-2 hover:text-white/90"
                    >
                      legal@medilink.cloud
                    </a>
                  </p>
                </div>
                <Link to="/contact">
                  <button className="group flex items-center gap-2 bg-white text-teal-600 font-semibold font-inter text-sm px-5 py-2.5 rounded-xl shadow-sm hover:shadow-md whitespace-nowrap transition-all">
                    Contact Us{" "}
                    <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
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
