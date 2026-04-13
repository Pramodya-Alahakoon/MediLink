import { motion } from "framer-motion";
import { FiShield, FiArrowRight } from "react-icons/fi";
import { Link } from "react-router-dom";

const lastUpdated = "April 13, 2026";

const sections = [
  {
    id: "info-collect",
    title: "1. Information We Collect",
    content: [
      "**Personal Identification Data**: When you register, we collect your name, email address, phone number, date of birth, and government-issued ID number (where required for medical verification).",
      "**Health Information**: Symptoms, medical history, appointment records, prescriptions, and any information you provide during consultations or via our AI symptom checker.",
      "**Usage Data**: IP address, browser type, device identifiers, pages visited, time spent, and click-stream data to improve platform performance.",
      "**Communication Data**: Messages exchanged with our support team, doctors, or the AI assistant.",
      "**Payment Information**: Billing address and payment method details, processed securely via PCI-DSS-compliant third-party processors. We never store raw card numbers.",
    ],
  },
  {
    id: "info-use",
    title: "2. How We Use Your Information",
    content: [
      "To create and manage your patient or provider account.",
      "To match you with appropriate specialists and facilitate appointment bookings.",
      "To power our AI Diagnostic Engine with anonymised, aggregated data (your identifiable data is never used to train external AI models without explicit consent).",
      "To process payments and send receipts.",
      "To send appointment reminders, health tips, and platform updates (you may opt out at any time).",
      "To investigate and prevent fraud, abuse, and security incidents.",
      "To comply with legal obligations under applicable health data regulations (including HIPAA equivalents and GDPR where applicable).",
    ],
  },
  {
    id: "info-share",
    title: "3. Information Sharing & Disclosure",
    content: [
      "**With Your Doctors**: Limited to the information necessary for your consultation, explicitly authorised by you.",
      "**Service Providers**: Cloud infrastructure (encrypted at rest and in transit), payment processors, and analytics providers under strict data processing agreements.",
      "**Legal Requirements**: We may disclose data to comply with court orders, government requests, or to protect the rights, property, or safety of MediLink, our users, or the public.",
      "**Business Transfers**: In the event of a merger, acquisition, or sale of assets, data may be transferred with advance notice to you.",
      "We do **not** sell, rent, or lease your personal data to any third party for marketing purposes.",
    ],
  },
  {
    id: "data-security",
    title: "4. Data Security",
    content: [
      "All data is encrypted in transit using TLS 1.3+ and at rest using AES-256.",
      "Access to medical records is role-based and strictly limited to authorised personnel.",
      "We conduct annual third-party security audits and penetration testing.",
      "Multi-factor authentication (MFA) is enforced for all provider accounts.",
      "In the event of a data breach, we will notify affected users within 72 hours in accordance with applicable law.",
    ],
  },
  {
    id: "your-rights",
    title: "5. Your Rights",
    content: [
      "**Access**: You may request a full export of all personal data we hold about you.",
      "**Correction**: Request correction of inaccurate or incomplete information at any time.",
      "**Deletion**: Request deletion of your account and all associated data, subject to legal retention requirements.",
      "**Portability**: Receive your data in a machine-readable format (JSON or CSV).",
      "**Restriction & Objection**: Object to or restrict specific processing activities.",
      "To exercise any of these rights, contact us at privacy@medilink.cloud.",
    ],
  },
  {
    id: "cookies",
    title: "6. Cookies & Tracking",
    content: [
      "We use strictly necessary, performance, and functional cookies.",
      "We do **not** use cookies for advertising or cross-site behavioural tracking.",
      "You may manage cookie preferences via your browser settings or our cookie preference centre.",
    ],
  },
  {
    id: "retention",
    title: "7. Data Retention",
    content: [
      "Medical records are retained for a minimum of 7 years from the last appointment, as required by healthcare regulations.",
      "Account data is deleted within 30 days of an account deletion request (unless retention is legally required).",
      "Anonymised, aggregated usage analytics are retained indefinitely for platform improvement.",
    ],
  },
  {
    id: "changes",
    title: "8. Changes to This Policy",
    content: [
      "We may update this policy periodically. Material changes will be communicated via email and an in-app banner at least 30 days before they take effect.",
      "Continued use of MediLink Cloud after a policy update constitutes acceptance of the revised terms.",
    ],
  },
];

function renderContent(text) {
  return text.split(/\*\*(.*?)\*\*/g).map((part, i) =>
    i % 2 === 1 ? <strong key={i} className="text-tertiary dark:text-white font-semibold">{part}</strong> : part
  );
}

function Privacy() {
  return (
    <main className="bg-[#F8FAFB] dark:bg-slate-900 overflow-x-hidden transition-colors duration-300">
      {/* ── HERO ── */}
      <section className="relative pt-36 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-tertiary via-[#0c3756] to-primary opacity-95" />
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(white 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[900px] h-[300px] bg-primary/30 rounded-full blur-[100px]" />
        <div className="container mx-auto px-5 sm:px-8 lg:px-16 xl:px-20 relative z-10 text-center text-white">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-xs font-bold font-inter tracking-widest text-primary/90 uppercase mb-6">
            <FiShield className="w-3.5 h-3.5" /> Privacy Policy
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl sm:text-5xl font-extrabold font-manrope leading-tight mb-5">
            Your Privacy Is Our<br />
            <span className="text-primary/90">Core Commitment.</span>
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
              {/* Intro */}
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="bg-primary/5 dark:bg-primary/10 border border-primary/20 dark:border-primary/30 rounded-2xl p-6 mb-8 transition-colors duration-300"
              >
                <p className="text-tertiary dark:text-slate-200 font-inter text-sm leading-relaxed">
                  MediLink Cloud ("we", "our", "us") is committed to protecting and respecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you access our services. Please read this document carefully. If you disagree with its terms, please discontinue use of the platform.
                </p>
              </motion.div>

              <div className="space-y-8">
                {sections.map((section, i) => (
                  <motion.div key={section.id} id={section.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
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

              {/* Contact box */}
              <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                className="mt-8 bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 p-7 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 transition-colors duration-300"
              >
                <div>
                  <p className="font-bold font-manrope text-tertiary dark:text-white mb-1">Privacy Questions?</p>
                  <p className="text-sm text-neutral dark:text-slate-400 font-inter">Contact our Data Protection Officer at <a href="mailto:privacy@medilink.cloud" className="text-primary hover:underline">privacy@medilink.cloud</a></p>
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

export default Privacy;
