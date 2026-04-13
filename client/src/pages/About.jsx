import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FiHeart, FiShield, FiZap, FiUsers, FiAward, FiArrowRight,
  FiCheckCircle, FiGlobe, FiCpu, FiActivity,
} from "react-icons/fi";

const values = [
  { icon: FiHeart, title: "Patient-First", desc: "Every decision we make starts with one question: is this better for the patient?", color: "text-rose-500", bg: "bg-rose-50" },
  { icon: FiShield, title: "Uncompromising Privacy", desc: "Your medical data is yours alone. We enforce end-to-end encryption on every byte.", color: "text-blue-500", bg: "bg-blue-50" },
  { icon: FiZap, title: "Speed & Simplicity", desc: "We believe great healthcare should be effortless — not a bureaucratic maze.", color: "text-yellow-500", bg: "bg-yellow-50" },
  { icon: FiGlobe, title: "Inclusive Access", desc: "Breaking geographical barriers to bring world-class care to every doorstep.", color: "text-green-500", bg: "bg-green-50" },
];

const milestones = [
  { year: "2021", event: "MediLink Cloud founded in Colombo, Sri Lanka." },
  { year: "2022", event: "Launched Beta with 50 verified doctors across 3 specialties." },
  { year: "2023", event: "Reached 10,000 active patients. Introduced AI Symptom Engine." },
  { year: "2024", event: "Expanded coverage to 500+ doctors across 30+ specialties." },
  { year: "2025", event: "50,000 patients served. Named top HealthTech platform in South Asia." },
];

const team = [
  { name: "Dr. Arun Patel", role: "Chief Medical Officer", avatar: "/Images/specialist_1.png", bio: "20+ years of cardiology practice, now bridging medicine and technology." },
  { name: "Dr. Lena Huang", role: "Head of AI Research", avatar: "/Images/specialist_3.png", bio: "PhD in Computational Medicine from MIT, pioneering diagnostic AI." },
  { name: "Dr. Fatima Malik", role: "Patient Experience Lead", avatar: "/Images/specialist_2.png", bio: "Ensuring every patient touchpoint feels human, warm, and trustworthy." },
];

const stats = [
  { val: "50K+", lbl: "Patients Served" },
  { val: "500+", lbl: "Verified Doctors" },
  { val: "30+", lbl: "Specialties" },
  { val: "4.9★", lbl: "Avg. Rating" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.55 } }),
};

function About() {
  return (
    <main className="bg-[#F8FAFB] overflow-x-hidden">
      {/* ── HERO ── */}
      <section className="relative pt-36 pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-tertiary via-[#0c3756] to-primary opacity-95" />
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(white 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[900px] h-[300px] bg-primary/30 rounded-full blur-[100px]" />
        <div className="container mx-auto px-5 sm:px-8 lg:px-16 xl:px-20 relative z-10 text-center text-white">
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-xs font-bold font-inter tracking-widest text-primary/90 uppercase mb-6">
            <FiCpu className="w-3.5 h-3.5" /> Our Story
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-manrope leading-tight mb-6">
            Redefining Healthcare<br />
            <span className="text-primary/90">for the Digital Generation.</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="max-w-2xl mx-auto text-white/70 font-inter text-lg leading-relaxed">
            MediLink Cloud was born from a simple belief: that accessing world-class healthcare should feel as easy as ordering your favourite meal online.
          </motion.p>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="py-10 bg-white border-b border-gray-100">
        <div className="container mx-auto px-5 sm:px-8 lg:px-16 xl:px-20">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <motion.div key={s.lbl} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center">
                <p className="text-3xl font-extrabold font-manrope text-primary">{s.val}</p>
                <p className="text-sm text-neutral font-inter mt-1">{s.lbl}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MISSION ── */}
      <section className="py-24 bg-[#F8FAFB]">
        <div className="container mx-auto px-5 sm:px-8 lg:px-16 xl:px-20">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="w-full lg:w-1/2">
              <span className="inline-block text-xs font-bold font-inter tracking-widest text-primary uppercase mb-4">Our Mission</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-manrope text-tertiary leading-tight mb-6">
                Technology that puts<br />
                <span className="text-primary italic">humanity first.</span>
              </h2>
              <p className="text-neutral font-inter text-base lg:text-lg leading-relaxed mb-6">
                We built MediLink Cloud to dismantle the walls between patients and the care they deserve. No endless queues. No confusion over records. No friction between you and a verified specialist.
              </p>
              <p className="text-neutral font-inter text-base lg:text-lg leading-relaxed mb-8">
                Our AI-enabled platform powers every interaction — from the moment you describe a symptom to the second a prescription reaches your phone — ensuring you always feel informed, supported, and in control.
              </p>
              <Link to="/contact">
                <button className="group inline-flex items-center gap-2 text-primary font-semibold font-inter text-sm hover:gap-3 transition-all">
                  Get in touch with us <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="w-full lg:w-1/2 grid grid-cols-2 gap-4">
              {values.map((v, i) => {
                const Icon = v.icon;
                return (
                  <motion.div key={v.title} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                    className={`bg-white rounded-3xl p-6 border border-gray-100 hover:shadow-lg hover:shadow-primary/5 transition-all ${i % 2 === 1 ? 'mt-6' : ''}`}
                  >
                    <div className={`w-11 h-11 rounded-2xl ${v.bg} flex items-center justify-center mb-4`}>
                      <Icon className={`w-5 h-5 ${v.color}`} />
                    </div>
                    <h3 className="font-bold font-manrope text-tertiary mb-2 text-sm">{v.title}</h3>
                    <p className="text-neutral font-inter text-xs leading-relaxed">{v.desc}</p>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── TIMELINE ── */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
        </div>
        <div className="container mx-auto px-5 sm:px-8 lg:px-16 xl:px-20 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="inline-block text-xs font-bold font-inter tracking-widest text-primary uppercase mb-3">Our Journey</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-manrope text-tertiary">From idea to impact.</h2>
          </motion.div>
          <div className="relative max-w-2xl mx-auto">
            {/* Vertical line */}
            <div className="absolute left-[27px] top-0 bottom-0 w-0.5 bg-gray-100 z-0" />
            <div className="space-y-10">
              {milestones.map((m, i) => (
                <motion.div key={m.year} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="flex items-start gap-6 relative z-10">
                  <div className={`w-[54px] h-[54px] rounded-2xl flex-shrink-0 flex items-center justify-center font-extrabold font-manrope text-xs shadow-sm ${i === 0 ? 'bg-primary text-white shadow-primary/30' : 'bg-white border-2 border-gray-100 text-tertiary'}`}>
                    {m.year}
                  </div>
                  <div className="bg-white rounded-2xl border border-gray-100 px-5 py-4 flex-1 hover:shadow-md hover:border-primary/10 transition-all">
                    <p className="text-tertiary font-inter text-sm leading-relaxed">{m.event}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section className="py-24 bg-[#F8FAFB]">
        <div className="container mx-auto px-5 sm:px-8 lg:px-16 xl:px-20">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="inline-block text-xs font-bold font-inter tracking-widest text-primary uppercase mb-3">Leadership</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-manrope text-tertiary">The minds behind MediLink.</h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {team.map((member, i) => (
              <motion.div key={member.name} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                className="bg-white rounded-3xl overflow-hidden border border-gray-100 hover:shadow-xl hover:shadow-primary/5 transition-all text-center group"
              >
                <div className="bg-gradient-to-b from-primary/5 to-primary/10 h-44 flex items-end justify-center overflow-hidden">
                  <img src={member.avatar} alt={member.name} className="w-[70%] h-[90%] object-cover object-top transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="p-5">
                  <h3 className="font-bold font-manrope text-tertiary mb-0.5">{member.name}</h3>
                  <p className="text-xs font-semibold text-primary font-inter mb-3">{member.role}</p>
                  <p className="text-xs text-neutral font-inter leading-relaxed">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-5 sm:px-8 lg:px-16 xl:px-20">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="bg-gradient-to-br from-tertiary to-primary rounded-3xl p-10 sm:p-14 text-center text-white relative overflow-hidden"
          >
            <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(white 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
            <div className="relative z-10">
              <FiAward className="w-10 h-10 mx-auto mb-5 text-primary/70" />
              <h2 className="text-3xl sm:text-4xl font-extrabold font-manrope mb-4">Ready to experience better healthcare?</h2>
              <p className="text-white/70 font-inter mb-8 max-w-xl mx-auto">Join 50,000+ patients already using MediLink Cloud to take control of their health journeys.</p>
              <Link to="/signup">
                <button className="inline-flex items-center gap-2 bg-primary text-white font-semibold font-inter px-8 py-4 rounded-2xl shadow-lg shadow-primary/30 hover:bg-primary/90 hover:-translate-y-0.5 transition-all">
                  Get Started Free <FiArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}

export default About;
