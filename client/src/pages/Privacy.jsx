import { motion } from "framer-motion";
import {
  FiShield,
  FiArrowRight,
  FiDatabase,
  FiSettings,
  FiUsers,
  FiLock,
  FiUser,
  FiGlobe,
  FiClock,
  FiRefreshCw,
} from "react-icons/fi";
import { Link } from "react-router-dom";

const lastUpdated = "April 17, 2026";

const sectionIcons = {
  "info-collect": FiDatabase,
  "info-use": FiSettings,
  "info-share": FiUsers,
  "data-security": FiLock,
  "your-rights": FiUser,
  cookies: FiGlobe,
  retention: FiClock,
  changes: FiRefreshCw,
};

const sections = [
  {
    id: "info-collect",
    title: "Information We Collect",
    content: [
      "**Personal Identification Data** — Name, email, phone number, date of birth, and government-issued ID (where required for medical verification).",
      "**Health Information** — Symptoms, medical history, appointment records, prescriptions, and data provided during consultations or via our AI symptom checker.",
      "**Usage & Device Data** — IP address, browser type, device identifiers, pages visited, session duration, and interaction patterns.",
      "**Communication Data** — Messages exchanged with support, doctors, or the AI assistant.",
      "**Payment Information** — Billing address and payment method details processed via PCI-DSS-compliant third-party processors. We never store raw card numbers.",
    ],
  },
  {
    id: "info-use",
    title: "How We Use Your Information",
    content: [
      "To create and manage your patient or provider account and verify your identity.",
      "To match you with appropriate specialists and facilitate appointment bookings.",
      "To power our AI Diagnostic Engine using anonymised, aggregated data — your identifiable data is never used to train external AI models without explicit consent.",
      "To process payments, issue receipts, and prevent fraudulent transactions.",
      "To send appointment reminders, health tips, and platform updates (opt out anytime).",
      "To investigate and prevent fraud, abuse, and security incidents.",
      "To comply with legal obligations under applicable health data regulations including HIPAA equivalents and GDPR where applicable.",
    ],
  },
  {
    id: "info-share",
    title: "Information Sharing & Disclosure",
    content: [
      "**With Your Doctors** — Limited to the information necessary for your consultation, explicitly authorised by you.",
      "**Service Providers** — Cloud infrastructure (encrypted at rest and in transit), payment processors, and analytics providers under strict data processing agreements.",
      "**Legal Requirements** — We may disclose data to comply with court orders, government requests, or to protect the rights, property, or safety of MediLink, our users, or the public.",
      "**Business Transfers** — In the event of a merger, acquisition, or asset sale, data may be transferred with advance notice to you.",
      "We do **not** sell, rent, or lease your personal data to any third party for marketing purposes — ever.",
    ],
  },
  {
    id: "data-security",
    title: "Data Security",
    content: [
      "All data encrypted in transit with TLS 1.3+ and at rest with AES-256 encryption.",
      "Role-based access control — medical records are strictly limited to authorised personnel.",
      "Annual third-party security audits and penetration testing.",
      "Multi-factor authentication (MFA) enforced for all provider accounts.",
      "In the event of a data breach, affected users are notified within 72 hours per applicable law.",
    ],
  },
  {
    id: "your-rights",
    title: "Your Rights",
    content: [
      "**Access** — Request a full export of all personal data we hold about you.",
      "**Correction** — Request correction of inaccurate or incomplete information at any time.",
      "**Deletion** — Request deletion of your account and all associated data, subject to legal retention requirements.",
      "**Portability** — Receive your data in a machine-readable format (JSON or CSV).",
      "**Restriction & Objection** — Object to or restrict specific processing activities.",
      "To exercise any of these rights, contact us at **privacy@medilink.cloud**.",
    ],
  },
  {
    id: "cookies",
    title: "Cookies & Tracking",
    content: [
      "We use strictly necessary, performance, and functional cookies only.",
      "We do **not** use cookies for advertising or cross-site behavioural tracking.",
      "You may manage cookie preferences via your browser settings or our cookie preference centre.",
    ],
  },
  {
    id: "retention",
    title: "Data Retention",
    content: [
      "Medical records are retained for a minimum of 7 years from the last appointment, as required by healthcare regulations.",
      "Account data is deleted within 30 days of a deletion request, unless retention is legally required.",
      "Anonymised, aggregated usage analytics are retained indefinitely for platform improvement.",
    ],
  },
  {
    id: "changes",
    title: "Changes to This Policy",
    content: [
      "We may update this policy periodically. Material changes are communicated via email and an in-app banner at least 30 days before taking effect.",
      "Continued use of MediLink after a policy update constitutes acceptance of the revised terms.",
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

function Privacy() {
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
            <FiShield className="w-4 h-4 text-teal-300" /> Privacy Policy
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-manrope leading-[1.1] mb-6"
          >
            Your Data, Your Control.
            <br />
            <span className="bg-gradient-to-r from-teal-300 to-cyan-300 bg-clip-text text-transparent">
              Our Promise.
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
                  {sections.map((s, i) => {
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
                    <FiShield className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                  </div>
                  <p className="text-gray-700 dark:text-slate-300 font-inter text-sm leading-relaxed">
                    MediLink Cloud is committed to protecting your privacy. This
                    policy explains how we collect, use, disclose, and safeguard
                    your information. If you disagree with its terms, please
                    discontinue use of the platform.
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
                    Privacy Questions?
                  </p>
                  <p className="text-sm text-white/80 font-inter">
                    Our Data Protection Officer is available at{" "}
                    <a
                      href="mailto:privacy@medilink.cloud"
                      className="text-white underline underline-offset-2 hover:text-white/90"
                    >
                      privacy@medilink.cloud
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

export default Privacy;
