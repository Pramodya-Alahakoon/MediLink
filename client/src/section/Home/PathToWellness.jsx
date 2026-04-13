import { motion } from "framer-motion";

const steps = [
  {
    num: "01",
    title: "Search & Filter",
    desc: "Browse verified specialists by specialty, location, language, or rating.",
    icon: "🔍",
  },
  {
    num: "02",
    title: "Pick a Slot",
    desc: "See live availability and instantly secure your preferred time and format.",
    icon: "📅",
  },
  {
    num: "03",
    title: "Attend & Consult",
    desc: "Join via high-definition video or visit in-clinic — your choice, every time.",
    icon: "💊",
  },
  {
    num: "04",
    title: "Heal & Follow Up",
    desc: "Receive your digital prescription, track recovery, and schedule follow-ups.",
    icon: "❤️",
  },
];

function PathToWellness() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 w-[800px] h-[300px] bg-primary/5 rounded-full blur-[100px] -translate-x-1/2" />
      </div>

      <div className="container mx-auto px-5 sm:px-8 lg:px-16 xl:px-20 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-20"
        >
          <span className="inline-block text-xs font-bold font-inter tracking-widest text-primary uppercase mb-3">
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-manrope text-tertiary leading-tight">
            Your path to wellness
            <br />in 4 simple steps.
          </h2>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Connector lines (desktop) */}
          <div className="hidden lg:block absolute top-[38px] left-[calc(12.5%+24px)] right-[calc(12.5%+24px)] z-0">
            <div className="w-full border-t-2 border-dashed border-primary/20" />
          </div>

          {steps.map((step, index) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative flex flex-col items-center text-center"
            >
              {/* Number circle */}
              <div className={`relative w-[76px] h-[76px] rounded-2xl flex items-center justify-center mb-6 z-10 transition-all duration-300 ${
                index === 0
                  ? "bg-primary shadow-xl shadow-primary/30"
                  : "bg-secondary border-2 border-gray-100 group-hover:border-primary/20"
              }`}>
                <span className="text-2xl">{step.icon}</span>
                {/* Small number label */}
                <span className={`absolute -top-2 -right-2 text-[10px] font-bold font-manrope w-5 h-5 rounded-full flex items-center justify-center ${
                  index === 0 ? "bg-white text-primary" : "bg-primary text-white"
                }`}>
                  {index + 1}
                </span>
              </div>

              <h3 className="font-bold font-manrope text-tertiary text-base mb-2">{step.title}</h3>
              <p className="text-sm text-neutral font-inter leading-relaxed max-w-[180px]">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default PathToWellness;
